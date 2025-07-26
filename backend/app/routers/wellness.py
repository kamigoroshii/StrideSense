from fastapi import APIRouter, Depends
from typing import List, Optional
from app.models.wellness import WellnessLog

router = APIRouter()

fake_wellness_db = []

async def get_current_user():
    return {"id": "user_1"}

@router.post("/", status_code=201)
async def post_wellness(log: WellnessLog, user=Depends(get_current_user)):
    log_dict = log.dict()
    fake_wellness_db.append(log_dict)
    return {"status": "Wellness logged", "log": log_dict}

@router.get("/", response_model=List[WellnessLog])
async def get_wellness(user=Depends(get_current_user), log_type: Optional[str] = None):
    logs = [l for l in fake_wellness_db if l["user_id"] == user["id"]]
    if log_type:
        logs = [l for l in logs if l["log_type"] == log_type]
    return logs
