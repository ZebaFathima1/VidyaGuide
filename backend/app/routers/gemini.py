"""
Gemini API Proxy - Proxies AI requests from frontend to avoid CORS
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import re

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or "AIzaSyAzmjPEGMqSyMZ0fkCG2uJIKEZWP0yoSR0"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


class GeminiRequest(BaseModel):
    prompt: str


@router.post("/generate")
async def generate_content(req: GeminiRequest):
    """Proxy prompt to Gemini and return text response."""
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")
    try:
        response = model.generate_content(req.prompt)
        text = response.text if response.text else ""
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
