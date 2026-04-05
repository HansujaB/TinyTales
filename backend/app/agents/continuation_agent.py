from app.agents.base_agent import BaseAgent
from app.utils.prompt_templates import CONTINUATION_PROMPT


class ContinuationAgent(BaseAgent):
    """Continues stories based on children's suggestions using Gemini."""

    def __init__(self):
        super().__init__(model_type="gemini")

    async def run(self, story_so_far: str, children_suggestion: str = "") -> dict:
        prompt = CONTINUATION_PROMPT.format(
            story_so_far=story_so_far,
            children_suggestion=children_suggestion or "please continue the adventure",
        )
        continuation = await self.call_gemini(prompt)
        return {"continuation": continuation}


continuation_agent = ContinuationAgent()
