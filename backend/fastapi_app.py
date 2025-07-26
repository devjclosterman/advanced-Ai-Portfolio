from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path
import os
import openai

# Load environment variables from .env file
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

# Initialize FastAPI app
app = FastAPI()

# Mount static files (CSS, JS, HTML) from the 'public' directory
app.mount("/static", StaticFiles(directory="public"), name="static")

# Serve the frontend HTML at root URL
@app.get("/")
async def root():
    return FileResponse("public/index.html")

# Enable CORS (for dev/testing across domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client using v1 SDK
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Data model for POST request
class ChatRequest(BaseModel):
    model: str
    messages: list

# Chat endpoint
@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        response = client.chat.completions.create(
            model=req.model,
            messages=req.messages
        )
        return response.model_dump()
    except Exception as e:
        return {"error": str(e)}
