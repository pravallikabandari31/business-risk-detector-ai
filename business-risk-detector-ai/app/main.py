import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from openai import OpenAI

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
app = FastAPI(title="Business Risk Detector AI", version="1.0.0")
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=8000)


class ChatResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = """You are Business Risk Detector AI, a practical assistant for small businesses.
Answer each user message independently. Do not claim to remember previous messages or use prior chat context.
Help identify potential operational, financial, customer, supplier, cybersecurity, compliance, and reputation risks.
When useful, structure answers as: Risk, Why it matters, Warning signs, Likelihood (Low/Medium/High), Impact (Low/Medium/High), and practical next steps.
Do not present guesses as verified facts. Ask for missing information when needed.
You are not a substitute for a qualified lawyer, accountant, or regulated financial adviser.
Do not ask users to share passwords, payment card details, or unnecessary sensitive information.
Keep the response clear and actionable for a small-business owner."""


@app.get("/", response_class=HTMLResponse)
def home():
    html_path = BASE_DIR / "static" / "index.html"
    return html_path.read_text(encoding="utf-8")


@app.get("/health")
def health():
    return {"status": "ok", "app": "Business Risk Detector AI"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return ChatResponse(
            reply="The AI API key is not configured yet. Add OPENAI_API_KEY to your .env file, restart the server, and try again."
        )

    model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini").strip() or "gpt-4.1-mini"
    try:
        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=model,
            instructions=SYSTEM_PROMPT,
            input=request.message,
        )
        reply = (response.output_text or "").strip()
        if not reply:
            reply = "I couldn't generate a response. Please try asking in a different way."
        return ChatResponse(reply=reply)
    except Exception as exc:
        # Avoid exposing internal details or credentials to end users.
        print(f"AI request failed: {type(exc).__name__}: {exc}")
        return ChatResponse(
            reply="Sorry, I couldn't process that request. Check that your API key and model name are valid, then try again."
        )
