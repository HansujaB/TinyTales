from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.routers import auth, story, quiz, library, emotion


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting TinyTales API...")
    print(f"   Environment: {settings.environment}")
    print(f"   Gemini API: {'✅ configured' if settings.gemini_api_key else '❌ not set'}")
    print(f"   Groq API: {'✅ configured' if settings.groq_api_key else '❌ not set'}")
    yield
    # Shutdown
    print("👋 Shutting down TinyTales API...")


app = FastAPI(
    lifespan=lifespan,
    title="TinyTales API",
    description="AI-powered storytelling platform for preschool teachers",
    version="2.0.0",
)

# CORS
origins = [o.strip() for o in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(story.router, prefix="/api/story", tags=["Story"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(library.router, prefix="/api/library", tags=["Library"])
app.include_router(emotion.router, prefix="/api/emotion", tags=["Emotion"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to TinyTales API! 📚✨",
        "version": "2.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "tinytales-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
