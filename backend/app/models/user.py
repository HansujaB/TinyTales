from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserDocument(BaseModel):
    """MongoDB user document schema."""
    _id: str  # firebase_uid
    email: str
    name: str
    photoURL: str = ""
    school: str = ""
    plan: str = "free"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    storyCount: int = 0
    preferences: dict = Field(default_factory=lambda: {
        "defaultLanguage": "English",
        "ageGroup": "3-5",
        "defaultTheme": "kindness",
    })


class UserPreferencesUpdate(BaseModel):
    defaultLanguage: Optional[str] = None
    ageGroup: Optional[str] = None
    defaultTheme: Optional[str] = None
    school: Optional[str] = None
    name: Optional[str] = None
