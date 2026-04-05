from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime
from bson import ObjectId
from app.middleware.auth_middleware import verify_token
from app.db.mongo import get_stories_collection, get_users_collection
from app.agents.story_agent import story_agent
from app.agents.moral_agent import moral_agent
from app.agents.continuation_agent import continuation_agent
from app.models.story import (
    StoryRequest,
    StoryContinueRequest,
    MoralRequest,
    SaveStoryRequest,
)

router = APIRouter()


@router.post("/generate")
async def generate_story(req: StoryRequest, user=Depends(verify_token)):
    """Generate a new story using the Story Agent."""
    result = await story_agent.run(
        topic=req.topic,
        characters=req.characters,
        theme=req.theme,
        age_group=req.age_group,
        length=req.length,
        language=req.language,
    )
    return result


@router.post("/generate/stream")
async def stream_story(req: StoryRequest, user=Depends(verify_token)):
    """Stream story generation token by token via SSE."""

    async def generate():
        for chunk in story_agent.stream(
            topic=req.topic,
            characters=req.characters,
            theme=req.theme,
            age_group=req.age_group,
            length=req.length,
            language=req.language,
        ):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.post("/moral")
async def extract_moral(req: MoralRequest, user=Depends(verify_token)):
    """Extract moral lesson from a story."""
    result = await moral_agent.run(story=req.story)
    return result


@router.post("/continue")
async def continue_story(req: StoryContinueRequest, user=Depends(verify_token)):
    """Continue a story based on children's suggestions."""
    result = await continuation_agent.run(
        story_so_far=req.story_so_far,
        children_suggestion=req.children_suggestion,
    )
    return result


@router.post("/save")
async def save_story(req: SaveStoryRequest, user=Depends(verify_token)):
    """Save a story to the library."""
    stories = get_stories_collection()
    users = get_users_collection()

    story_doc = {
        "userId": user["uid"],
        "title": req.title,
        "content": req.content,
        "topic": req.topic,
        "theme": req.theme,
        "characters": req.characters,
        "moral": req.moral,
        "language": req.language,
        "tags": req.tags,
        "isFavorite": False,
        "playCount": 0,
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat(),
    }
    result = await stories.insert_one(story_doc)
    story_doc["_id"] = str(result.inserted_id)

    # Increment user story count
    await users.update_one({"_id": user["uid"]}, {"$inc": {"storyCount": 1}})

    return story_doc


@router.get("/{story_id}")
async def get_story(story_id: str, user=Depends(verify_token)):
    """Get a story by ID."""
    stories = get_stories_collection()
    story = await stories.find_one({"_id": ObjectId(story_id), "userId": user["uid"]})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    story["_id"] = str(story["_id"])
    return story


@router.delete("/{story_id}")
async def delete_story(story_id: str, user=Depends(verify_token)):
    """Delete a story."""
    stories = get_stories_collection()
    result = await stories.delete_one({"_id": ObjectId(story_id), "userId": user["uid"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Story not found")

    users = get_users_collection()
    await users.update_one({"_id": user["uid"]}, {"$inc": {"storyCount": -1}})

    return {"message": "Story deleted"}


@router.patch("/{story_id}/favorite")
async def toggle_favorite(story_id: str, user=Depends(verify_token)):
    """Toggle favorite status of a story."""
    stories = get_stories_collection()
    story = await stories.find_one({"_id": ObjectId(story_id), "userId": user["uid"]})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    new_fav = not story.get("isFavorite", False)
    await stories.update_one(
        {"_id": ObjectId(story_id)},
        {"$set": {"isFavorite": new_fav, "updatedAt": datetime.utcnow().isoformat()}},
    )
    return {"isFavorite": new_fav}
