from fastapi import APIRouter, Depends, Query
from app.middleware.auth_middleware import verify_token
from app.db.mongo import get_stories_collection

router = APIRouter()


@router.get("/")
async def get_library(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user=Depends(verify_token),
):
    """Get all user stories (paginated)."""
    stories = get_stories_collection()
    skip = (page - 1) * limit

    cursor = stories.find({"userId": user["uid"]}).sort("createdAt", -1).skip(skip).limit(limit)
    items = []
    async for story in cursor:
        story["_id"] = str(story["_id"])
        items.append(story)

    total = await stories.count_documents({"userId": user["uid"]})

    return {
        "stories": items,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }


@router.get("/favorites")
async def get_favorites(user=Depends(verify_token)):
    """Get favorite stories."""
    stories = get_stories_collection()
    cursor = stories.find({"userId": user["uid"], "isFavorite": True}).sort("createdAt", -1)
    items = []
    async for story in cursor:
        story["_id"] = str(story["_id"])
        items.append(story)
    return {"stories": items}


@router.get("/search")
async def search_stories(
    q: str = Query("", min_length=0),
    theme: str = Query(""),
    language: str = Query(""),
    user=Depends(verify_token),
):
    """Search stories by tag/topic/title."""
    stories = get_stories_collection()
    query = {"userId": user["uid"]}

    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"topic": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}},
            {"characters": {"$regex": q, "$options": "i"}},
        ]
    if theme:
        query["theme"] = theme
    if language:
        query["language"] = language

    cursor = stories.find(query).sort("createdAt", -1).limit(50)
    items = []
    async for story in cursor:
        story["_id"] = str(story["_id"])
        items.append(story)
    return {"stories": items}
