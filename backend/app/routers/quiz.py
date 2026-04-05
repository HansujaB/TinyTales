from fastapi import APIRouter, Depends
from app.middleware.auth_middleware import verify_token
from app.agents.quiz_agent import quiz_agent
from app.models.quiz import QuizRequest
from app.db.mongo import get_quizzes_collection
from datetime import datetime

router = APIRouter()


@router.post("/generate")
async def generate_quiz(req: QuizRequest, user=Depends(verify_token)):
    """Generate a quiz from a story."""
    result = await quiz_agent.run(story=req.story, num_questions=req.num_questions)

    # Save quiz
    quizzes = get_quizzes_collection()
    quiz_doc = {
        "userId": user["uid"],
        "questions": result.get("questions", []),
        "createdAt": datetime.utcnow().isoformat(),
    }
    insert_result = await quizzes.insert_one(quiz_doc)
    result["_id"] = str(insert_result.inserted_id)

    return result
