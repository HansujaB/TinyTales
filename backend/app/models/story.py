from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class StoryRequest(BaseModel):
    topic: str
    characters: list[str] = Field(default_factory=lambda: ["a friendly animal"])
    theme: str = "kindness"
    age_group: str = "3-5"
    length: str = "short"  # tiny, short, long
    language: str = "English"


class StoryResponse(BaseModel):
    story: str
    topic: str
    theme: str
    characters: list[str]
    language: str


class StoryContinueRequest(BaseModel):
    story_so_far: str
    children_suggestion: str = ""


class StoryTranslateRequest(BaseModel):
    story: str
    target_language: str


class MoralRequest(BaseModel):
    story: str


class SaveStoryRequest(BaseModel):
    title: str
    content: str
    topic: str = ""
    theme: str = ""
    characters: list[str] = Field(default_factory=list)
    moral: str = ""
    language: str = "English"
    tags: list[str] = Field(default_factory=list)


class StoryDocument(BaseModel):
    """MongoDB story document schema."""
    userId: str
    title: str
    content: str
    topic: str = ""
    theme: str = ""
    characters: list[str] = Field(default_factory=list)
    moral: str = ""
    language: str = "English"
    tags: list[str] = Field(default_factory=list)
    isFavorite: bool = False
    playCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
