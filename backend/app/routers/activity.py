from fastapi import APIRouter, Depends
from typing import List, Optional
from app.models.activity import ActivityLog

router = APIRouter()

fake_activity_db = []

async def get_current_user():
    # Dummy user id
    return {"id": "user_1"}

@router.post("/", status_code=201)
async def post_activity(activity: ActivityLog, user=Depends(get_current_user)):
    # Simulate storing activity log
    activity_dict = activity.dict()
    fake_activity_db.append(activity_dict)
    return {"status": "Activity logged", "activity": activity_dict}

@router.get("/", response_model=List[ActivityLog])
async def get_activity(user=Depends(get_current_user), type: Optional[str] = None):
    # Filter activities for current user, optional filter by type
    logs = [a for a in fake_activity_db if a["user_id"] == user["id"]]
    if type:
        logs = [a for a in logs if a["type"] == type]
    return logs
