from app.agents.base_agent import BaseAgent
from app.utils.prompt_templates import STORY_PROMPT


class StoryAgent(BaseAgent):
    """Generates full stories using Gemini for rich, creative output."""

    def __init__(self):
        super().__init__(model_type="gemini")

    async def run(
        self,
        topic: str,
        characters: list[str],
        theme: str,
        age_group: str = "3-5",
        length: str = "short",
        language: str = "English",
    ) -> dict:
        prompt = STORY_PROMPT.format(
            topic=topic,
            characters=", ".join(characters),
            theme=theme,
            age_group=age_group,
            length=length,
            language=language,
        )
        story_text = await self.call_gemini(prompt)
        return {
            "story": story_text,
            "topic": topic,
            "theme": theme,
            "characters": characters,
            "language": language,
        }

    def stream(
        self,
        topic: str,
        characters: list[str],
        theme: str,
        age_group: str = "3-5",
        length: str = "short",
        language: str = "English",
    ):
        """Stream story generation token by token."""
        prompt = STORY_PROMPT.format(
            topic=topic,
            characters=", ".join(characters),
            theme=theme,
            age_group=age_group,
            length=length,
            language=language,
        )
        return self.call_gemini_stream(prompt)


story_agent = StoryAgent()
