from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import openai
from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env from same folder as fastapi_app.py
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")


app = FastAPI()

# Allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    model: str
    messages: list

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        response = client.chat.completions.create(
            model=req.model,
            messages=req.messages
        )
        return response
    except Exception as e:
        return {"error": str(e)}

