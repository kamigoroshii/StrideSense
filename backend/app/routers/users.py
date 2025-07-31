from fastapi import APIRouter, Depends, HTTPException
from app.models.user import UserOut, UserProfile
from app.dependencies.auth_deps import verify_token
from app.core.db import db
import traceback

router = APIRouter()

@router.get("/test-db")
async def test_db():
    """Test database connection"""
    try:
        test_collection = db.collection("test")
        # Try fetching one document
        docs = list(test_collection.limit(1).stream())
        print("Database connection successful")
        return {"message": "Database connection successful"}
    except Exception as e:
        print(f"Database connection error: {e}")
        traceback.print_exc()
        return {"error": str(e)}

@router.post("/test-profile")
async def test_profile(profile: UserProfile):
    """Test profile creation without authentication"""
    try:
        print(f"Testing profile creation with data: {profile}")
        profile_dict = profile.model_dump()
        print(f"Profile dict: {profile_dict}")
        return {"message": "Profile validation successful", "data": profile_dict}
    except Exception as e:
        print(f"Profile validation error: {e}")
        traceback.print_exc()
        return {"error": str(e)}

@router.get("/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str, token=Depends(verify_token)):
    """Get user profile by Firebase UID"""
    # Verify the user is requesting their own profile
    if user_id != token.get("uid"):
        raise HTTPException(403, detail="Forbidden - can only access own profile")
    
    try:
        doc = db.collection("users").document(user_id).get()
        if not doc.exists:
            raise HTTPException(404, detail="User profile not found")
        
        profile_data = doc.to_dict()
        return UserProfile(**profile_data)
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        traceback.print_exc()
        raise HTTPException(500, detail="Internal server error")

@router.put("/{user_id}", response_model=UserProfile)
async def update_user_profile(user_id: str, profile: UserProfile, token=Depends(verify_token)):
    """Update user profile by Firebase UID"""
    # Verify the user is updating their own profile
    if user_id != token.get("uid"):
        raise HTTPException(403, detail="Forbidden - can only update own profile")
    
    try:
        print(f"Updating profile for user {user_id}")
        print(f"Profile data: {profile}")
        
        # Convert profile to dict and save to Firestore
        profile_dict = profile.model_dump()
        print(f"Profile dict: {profile_dict}")
        
        # Save to Firestore
        doc_ref = db.collection("users").document(user_id)
        doc_ref.set(profile_dict)
        
        print(f"Profile saved successfully for user {user_id}")
        return profile
    except Exception as e:
        print(f"Error updating user profile: {e}")
        traceback.print_exc()
        raise HTTPException(500, detail=f"Internal server error: {str(e)}")

@router.get("/me", response_model=UserOut)
async def get_me(token=Depends(verify_token)):
    """Get current user profile (legacy endpoint)"""
    try:
        doc = db.collection("users").document(token.get("uid")).get()
        if not doc.exists:
            raise HTTPException(404, detail="User profile not found")
        
        profile_data = doc.to_dict()
        # Convert to UserOut format
        return UserOut(
            id=token.get("uid"),
            email=token.get("email", ""),
            **profile_data
        )
    except Exception as e:
        print(f"Error fetching current user: {e}")
        traceback.print_exc()
        raise HTTPException(500, detail="Internal server error")

@router.put("/me")
async def update_me(profile: UserProfile, token=Depends(verify_token)):
    """Update current user profile (legacy endpoint)"""
    try:
        profile_dict = profile.model_dump()
        db.collection("users").document(token.get("uid")).set(profile_dict)
        print(f"Profile updated for user {token.get('uid')}.")
        return {"message": "Profile updated successfully"}
    except Exception as e:
        print(f"Error updating current user: {e}")
        traceback.print_exc()
        raise HTTPException(500, detail="Internal server error")
