from fastapi import APIRouter, Depends, HTTPException
from app.models.user import UserOut

router = APIRouter()

# Dummy current user dependency (simulated)
async def get_current_user():
    # Normally extract user info from auth token/cookie
    dummy_user = {
        "id": "user_1",
        "email": "user@example.com",
        "user_type": "athlete",
        "name": "John Doe",
        "dob": "1990-01-01",
        "gender": "male",
        "height": 180,
        "weight": 75,
    }
    return dummy_user

@router.get("/me", response_model=UserOut)
async def get_me(user=Depends(get_current_user)):
    return user

@router.put("/me")
async def update_me():
    # Stub - just return success for now
    return {"message": "Profile updated (stub)"} 
