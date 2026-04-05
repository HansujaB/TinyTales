import motor.motor_asyncio
from app.core.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongodb_url)
db = client[settings.mongodb_db_name]


# Collection references
def get_users_collection():
    return db["users"]


def get_stories_collection():
    return db["stories"]


def get_quizzes_collection():
    return db["quizzes"]


def get_classrooms_collection():
    return db["classrooms"]


def get_lesson_plans_collection():
    return db["lesson_plans"]
