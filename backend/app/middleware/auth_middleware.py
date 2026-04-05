import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
import os

# Initialize Firebase Admin SDK
_firebase_initialized = False


def init_firebase():
    global _firebase_initialized
    if _firebase_initialized:
        return
    try:
        sa_path = settings.firebase_service_account_path
        if os.path.exists(sa_path):
            cred = credentials.Certificate(sa_path)
            firebase_admin.initialize_app(cred)
        else:
            # Fall back to project ID only (for environments with GOOGLE_APPLICATION_CREDENTIALS)
            firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id})
        _firebase_initialized = True
    except ValueError:
        # Already initialized
        _firebase_initialized = True


security = HTTPBearer(auto_error=False)


async def verify_token(
    credentials_header: HTTPAuthorizationCredentials = Security(security),
) -> dict:
    """Verify Firebase ID token and return decoded token data."""
    if not credentials_header:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    token = credentials_header.credentials
    try:
        init_firebase()
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")


async def optional_verify_token(
    credentials_header: HTTPAuthorizationCredentials = Security(security),
) -> dict | None:
    """Optional auth — returns None if no token provided."""
    if not credentials_header:
        return None
    try:
        init_firebase()
        decoded = auth.verify_id_token(credentials_header.credentials)
        return decoded
    except Exception:
        return None
