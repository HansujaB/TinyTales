from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.auth_middleware import verify_token
from app.agents.emotion_agent import emotion_agent

router = APIRouter()


class EmotionStoryRequest(BaseModel):
    emotion: str
    context: str = ""


@router.post("/story")
async def generate_emotion_story(req: EmotionStoryRequest, user=Depends(verify_token)):
    """Generate an emotion-based comfort story."""
    result = await emotion_agent.run(emotion=req.emotion, context=req.context)
    return result
