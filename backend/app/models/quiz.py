from pydantic import BaseModel, Field
from datetime import datetime


class QuizRequest(BaseModel):
    story: str
    num_questions: int = 5


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct: int
    explanation: str


class QuizDocument(BaseModel):
    """MongoDB quiz document schema."""
    storyId: str
    userId: str
    questions: list[dict]
    createdAt: datetime = Field(default_factory=datetime.utcnow)
