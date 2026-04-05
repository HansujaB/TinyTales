from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # AI APIs
    gemini_api_key: str = ""
    groq_api_key: str = ""

    # Firebase
    firebase_project_id: str = ""
    firebase_service_account_path: str = "./firebase-service-account.json"

    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "tinytales"

    # Redis
    redis_url: Optional[str] = None

    # App
    cors_origins: str = "http://localhost:5173"
    environment: str = "development"
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
