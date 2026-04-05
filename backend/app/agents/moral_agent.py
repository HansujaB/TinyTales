import json
from app.agents.base_agent import BaseAgent
from app.utils.prompt_templates import MORAL_PROMPT


class MoralAgent(BaseAgent):
    """Extracts moral lessons from stories using Groq for fast structured output."""

    def __init__(self):
        super().__init__(model_type="groq")

    async def run(self, story: str) -> dict:
        prompt = MORAL_PROMPT.format(story=story)
        raw = await self.call_groq(
            prompt,
            system="You are a preschool education expert. Always respond in valid JSON.",
            json_mode=True,
        )
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {
                "moral": "Every story teaches us something beautiful.",
                "life_skills": ["listening", "empathy", "creativity"],
                "discussion_question": "What did you learn from this story?",
                "activity": "Draw your favorite part of the story!",
                "teacher_note": "Could not parse AI response. Default values used.",
            }


moral_agent = MoralAgent()
