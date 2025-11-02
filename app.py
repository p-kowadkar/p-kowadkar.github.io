"""
Flask Portfolio Chatbot with Gemini 2.5 Flash + Llama 4 Fallback

To run the app:
1. Install dependencies: pip install -r requirements.txt
2. Set environment variables: GEMINI_API_KEY, LLAMA_API_KEY
3. Run the app: python app.py
4. Test: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message":"What is Pranav'\''s experience?"}'
"""

from flask import Flask, request, jsonify
import os
import hashlib
import requests
from dotenv import load_dotenv
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:*",
            "https://p-kowadkar.github.io"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Rate limiting to prevent abuse
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day"],
    storage_uri="memory://"
)

# In-memory cache for responses
response_cache = {}

# Configure API keys
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
LLAMA_API_KEY = os.getenv('LLAMA_API_KEY')

# Primary: Gemini 2.5 Flash (newest, fastest, GPT-4o level)
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(
    'gemini-2.5-flash',  # Latest model from Sept 2025
    generation_config={
        "temperature": 0.7,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 350,
    }
)

# Fallback: Meta Llama 4 Maverick (via direct Meta API)
LLAMA_BASE_URL = "https://api.llama.com/compat/v1/chat/completions"

# Load resume content
def load_resume_content():
    try:
        # Try the correct path with capital D in Data
        with open('static/Data/resume.txt', 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        try:
            # Fallback to lowercase data
            with open('static/data/resume.txt', 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            app.logger.error("Resume file not found at static/Data/resume.txt or static/data/resume.txt")
            return ""

resume_content = load_resume_content()

def get_cache_key(message):
    """Generate cache key from message"""
    return hashlib.md5(message.lower().strip().encode()).hexdigest()

def get_cached_response(message):
    """Check if response is cached"""
    return response_cache.get(get_cache_key(message))

def set_cached_response(message, response):
    """Cache response"""
    response_cache[get_cache_key(message)] = response

def call_gemini(prompt, user_message):
    """Primary: Use Gemini 2.5 Flash"""
    try:
        full_prompt = f"{prompt}\n\nUSER QUESTION: {user_message}\n\nYOUR RESPONSE:"
        response = gemini_model.generate_content(full_prompt)
        return response.text.strip()
    except Exception as e:
        app.logger.error(f"Gemini error: {str(e)}")
        raise

def call_llama(prompt, user_message):
    """Fallback: Use Meta Llama 4 Maverick"""
    try:
        headers = {
            "Authorization": f"Bearer {LLAMA_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "Llama-4-Maverick-17B-128E-Instruct-FP8",
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.7,
            "max_tokens": 350,
            "top_p": 0.95
        }
        
        response = requests.post(LLAMA_BASE_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            app.logger.error(f"Llama error {response.status_code}: {response.text}")
            raise Exception(f"Llama API error: {response.status_code}")
            
    except Exception as e:
        app.logger.error(f"Llama fallback error: {str(e)}")
        raise

@app.route('/api/chat', methods=['POST'])
@limiter.limit("10 per hour")
def chat():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id')
        
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Check cache first
        cached = get_cached_response(user_message)
        if cached:
            app.logger.info("Cache hit")
            return jsonify({
                'message': cached,
                'response': cached,
                'session_id': session_id,
                'source': 'cache'
            })
        
        # Build optimized system prompt for resume Q&A
        system_prompt = f"""You are Pranav Kowadkar's AI assistant on his portfolio website. Answer questions professionally and conversationally based on his resume below.

RESUME:
{resume_content}

INSTRUCTIONS:
- Keep responses concise (2-4 sentences for simple questions, detailed for technical deep-dives)
- Be professional but friendly and enthusiastic about Pranav's work
- Highlight specific achievements with metrics (e.g., "72% latency reduction", "86.84% accuracy", "22% ROI boost")
- If asked about something not in the resume, politely say you don't have that information and suggest emailing Pranav at pk.kowadkar@gmail.com or visiting his LinkedIn
- For location questions: Pranav is from Belagavi, Karnataka, India (born in Chikodi, schooled in Hubbali/Belagavi/Bangalore). Currently in NYC with F1 STEM OPT work authorization.
- For education: MS Data Science from NJIT (GPA 3.6, Sep 2022-Dec 2023), BE Mechanical Engineering from VTU (GPA 3.3, Aug 2014-Jul 2018)
- Match the user's tone: casual questions → friendly responses, technical questions → detailed technical responses
- Pranav has 4+ years of ML/Data Engineering experience across healthcare, finance, aerospace, and tech domains"""

        # Try Gemini 2.5 Flash first (primary)
        try:
            bot_reply = call_gemini(system_prompt, user_message)
            source = "gemini-2.5-flash"
            app.logger.info(f"Success with {source}")
        except Exception as gemini_error:
            # Fallback to Meta Llama 4
            app.logger.warning(f"Gemini failed, using Llama fallback: {gemini_error}")
            try:
                bot_reply = call_llama(system_prompt, user_message)
                source = "llama-4-maverick"
                app.logger.info(f"Success with {source}")
            except Exception as llama_error:
                app.logger.error(f"Both models failed: Gemini={gemini_error}, Llama={llama_error}")
                return jsonify({
                    'error': 'Sorry, I encountered an error. Please try again or email Pranav at pk.kowadkar@gmail.com',
                    'message': "I'm having trouble connecting to my brain right now. Please try again later."
                }), 500
        
        # Cache the response
        set_cached_response(user_message, bot_reply)
        
        return jsonify({
            'message': bot_reply,
            'response': bot_reply,
            'session_id': session_id,
            'source': source
        })
    
    except Exception as e:
        app.logger.error(f"Chat error: {str(e)}")
        return jsonify({
            'error': 'Sorry, I encountered an error. Please try again or email Pranav at pk.kowadkar@gmail.com',
            'message': "I'm having trouble connecting to my brain right now. Please try again later."
        }), 500

@app.route('/api/health', methods=['GET'])
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'primary_model': 'gemini-2.5-flash',
        'fallback_model': 'llama-4-maverick',
        'cache_size': len(response_cache),
        'resume_loaded': len(resume_content) > 0
    }), 200

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))