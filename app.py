"""
Flask Skill Tree Visualization App

To run the app:
1. Install dependencies: pip install -r requirements.txt
2. Run the app: python app.py
3. Open browser: http://localhost:5000/skills
"""

from flask import Flask, request, jsonify
import os
import openai
from dotenv import load_dotenv
from flask_cors import CORS

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

# Get OpenAI API key from environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')

# Load resume content
def load_resume_content():
    try:
        with open('static/data/resume.txt', 'r') as file:
            return file.read()
    except FileNotFoundError:
        return "Resume content not found."

resume_content = load_resume_content()

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    session_id = data.get('session_id')

    # Define the system message to set the context for the AI
    system_message = {
        "role": "system",
        "content": f"You are Pranav's AI assistant. Answer questions about Pranav's experience, education, skills, projects, and contact information based on the following resume content:\n\n{resume_content}"
    }

    # Prepare the messages for the OpenAI API
    messages = [system_message, {"role": "user", "content": user_message}]

    try:
        # Call the OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        # Extract the assistant's reply
        assistant_reply = response.choices[0].message['content']

        # Return the response
        return jsonify({
            'message': assistant_reply,
            'session_id': session_id
        })

    except Exception as e:
        # Handle any errors that occur during the API call
        return jsonify({
            'error': str(e),
            'message': "I'm having trouble connecting to my brain right now. Please try again later."
        }), 500

if __name__ == '__main__':
    app.run(debug=True)