from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ml.engine import story_engine

router = APIRouter()

class StoryRequest(BaseModel):
    prompt: str
    max_length: int = 100

class StoryResponse(BaseModel):
    story: str

@router.post("/generate", response_model=StoryResponse)
async def generate_story(req: StoryRequest):
    if not story_engine.model:
        raise HTTPException(status_code=503, detail="Model is still loading or failed to load.")
    
    generated_text = await story_engine.generate_async(req.prompt, req.max_length)
    return StoryResponse(story=generated_text)
