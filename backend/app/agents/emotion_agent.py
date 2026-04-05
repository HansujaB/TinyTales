import json
from app.agents.base_agent import BaseAgent
from app.utils.prompt_templates import EMOTION_STORY_PROMPT


class EmotionAgent(BaseAgent):
    """Generates emotion-based comfort stories using Groq for fast response."""

    def __init__(self):
        super().__init__(model_type="groq")

    async def run(self, emotion: str, context: str = "") -> dict:
        prompt = EMOTION_STORY_PROMPT.format(emotion=emotion, context=context)
        raw = await self.call_groq(
            prompt,
            system="You are a kind storyteller who helps preschool children understand feelings. Respond in valid JSON only.",
            json_mode=True,
        )
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {
                "title": f"A Story About Feeling {emotion.title()}",
                "story": f"Once upon a time, a little bunny felt {emotion}...",
                "feeling_validation": f"It's okay to feel {emotion}.",
                "coping_strategy": "Take a deep breath and talk to someone you trust.",
                "teacher_note": "Could not parse AI response.",
            }


emotion_agent = EmotionAgent()
