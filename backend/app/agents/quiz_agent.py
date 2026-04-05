import json
from app.agents.base_agent import BaseAgent
from app.utils.prompt_templates import QUIZ_SYSTEM, QUIZ_PROMPT


class QuizAgent(BaseAgent):
    """Generates comprehension quizzes from stories using Groq for fast JSON output."""

    def __init__(self):
        super().__init__(model_type="groq")

    async def run(self, story: str, num_questions: int = 5) -> dict:
        prompt = QUIZ_PROMPT.format(num_questions=num_questions, story=story)
        raw = await self.call_groq(prompt, system=QUIZ_SYSTEM, json_mode=True)
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {
                "questions": [
                    {
                        "question": "What was the story about?",
                        "options": ["Animals", "Weather", "Friends", "Adventures"],
                        "correct": 0,
                        "explanation": "Could not generate quiz. Please try again.",
                    }
                ]
            }


quiz_agent = QuizAgent()
