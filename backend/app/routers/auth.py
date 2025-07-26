from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserOut
from app.core.db import auth as firebase_auth, db

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    # 1. Create user in Firebase Auth
    try:
        fb_user = firebase_auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # 2. Add extra profile info to Firestore
    user_doc = {
        "email": user.email,
        "user_type": user.user_type,
        "name": user.name,
        "dob": user.dob,
        "gender": user.gender,
        "height": user.height,
        "weight": user.weight
    }
    db.collection("users").document(fb_user.uid).set(user_doc)
    return UserOut(id=fb_user.uid, **user_doc)
