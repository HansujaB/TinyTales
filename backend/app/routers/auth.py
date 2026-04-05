from fastapi import APIRouter, Depends
from datetime import datetime
from app.middleware.auth_middleware import verify_token
from app.db.mongo import get_users_collection

router = APIRouter()


@router.post("/verify")
async def verify_user(user=Depends(verify_token)):
    """Verify Firebase token and upsert user in database."""
    users = get_users_collection()

    user_doc = await users.find_one({"_id": user["uid"]})
    if not user_doc:
        # Create new user
        new_user = {
            "_id": user["uid"],
            "email": user.get("email", ""),
            "name": user.get("name", ""),
            "photoURL": user.get("picture", ""),
            "school": "",
            "plan": "free",
            "createdAt": datetime.utcnow().isoformat(),
            "storyCount": 0,
            "preferences": {
                "defaultLanguage": "English",
                "ageGroup": "3-5",
                "defaultTheme": "kindness",
            },
        }
        await users.insert_one(new_user)
        return {"user": new_user, "isNew": True}

    return {"user": user_doc, "isNew": False}


@router.get("/me")
async def get_current_user(user=Depends(verify_token)):
    """Get current user profile."""
    users = get_users_collection()
    user_doc = await users.find_one({"_id": user["uid"]})
    if not user_doc:
        return {"error": "User not found"}
    return user_doc


@router.patch("/preferences")
async def update_preferences(updates: dict, user=Depends(verify_token)):
    """Update user preferences."""
    users = get_users_collection()
    update_fields = {}
    for key, value in updates.items():
        if value is not None:
            if key in ["defaultLanguage", "ageGroup", "defaultTheme"]:
                update_fields[f"preferences.{key}"] = value
            elif key in ["name", "school"]:
                update_fields[key] = value

    if update_fields:
        await users.update_one({"_id": user["uid"]}, {"$set": update_fields})

    user_doc = await users.find_one({"_id": user["uid"]})
    return user_doc
