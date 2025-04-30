import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()
# Update your OpenAI API key in the .env file in the project root:
# OPENAI_API_KEY=sk-...
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI()

@app.get("/ping")
def ping():
    return {"pong": True}

# Allow CORS for local development (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your domain in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Make a copy of the data to prevent modifying the original
    payload = dict(data)
    
    # Handle different parameter names for different models
    model = payload.get('model', '')
    if 'max_completion_tokens' in payload and 'gpt' in model:
        # For GPT models, use max_tokens instead of max_completion_tokens
        payload['max_tokens'] = payload.pop('max_completion_tokens')
    
    # Just pass through the payload with appropriate parameters
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)} 