from abc import ABC, abstractmethod
import google.generativeai as genai
from groq import Groq
from app.core.config import settings

# Configure AI clients
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)

groq_client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None


class BaseAgent(ABC):
    """Abstract base class for all TinyTales AI agents."""

    def __init__(self, model_type: str = "gemini"):
        self.model_type = model_type
        if settings.gemini_api_key:
            self.gemini = genai.GenerativeModel("gemini-1.5-flash")
        else:
            self.gemini = None

    async def call_gemini(self, prompt: str) -> str:
        """Call Gemini for creative, long-form content."""
        if not self.gemini:
            return "[Gemini API key not configured. Please set GEMINI_API_KEY in .env]"
        response = self.gemini.generate_content(prompt)
        return response.text

    def call_gemini_stream(self, prompt: str):
        """Stream response from Gemini token by token."""
        if not self.gemini:
            yield "[Gemini API key not configured]"
            return
        response = self.gemini.generate_content(prompt, stream=True)
        for chunk in response:
            if chunk.text:
                yield chunk.text

    async def call_groq(self, prompt: str, system: str = "", json_mode: bool = False) -> str:
        """Call Groq for fast, structured outputs."""
        if not groq_client:
            return '{"error": "Groq API key not configured. Please set GROQ_API_KEY in .env"}'
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        kwargs = {
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = groq_client.chat.completions.create(**kwargs)
        return response.choices[0].message.content

    @abstractmethod
    async def run(self, **kwargs) -> dict:
        """Execute the agent's primary task."""
        pass
