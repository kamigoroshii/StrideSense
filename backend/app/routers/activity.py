from fastapi import APIRouter, Depends, HTTPException
from app.dependencies.auth_deps import verify_token
from app.models.activity import ActivityLog
from app.core.db import db
from typing import List, Optional
from uuid import uuid4

router = APIRouter()

def get_activities_collection():
    return db.collection("activities")

@router.post("/", status_code=201)
def create_activity(activity: ActivityLog):
    activity_id = str(uuid4())
    data = activity.dict()
    data["id"] = activity_id
    get_activities_collection().document(activity_id).set(data)
    return {"id": activity_id, "status": "created"}

@router.get("/", response_model=List[ActivityLog])
def list_activities(user_id: str):
    docs = get_activities_collection().where("user_id", "==", user_id).stream()
    return [doc.to_dict() for doc in docs]

@router.get("/{activity_id}", response_model=ActivityLog)
def get_activity(activity_id: str):
    doc = get_activities_collection().document(activity_id).get()
    if not doc.exists:
        raise HTTPException(404, "Activity not found")
    return doc.to_dict()

@router.put("/{activity_id}")
def update_activity(activity_id: str, activity: ActivityLog):
    ref = get_activities_collection().document(activity_id)
    if not ref.get().exists:
        raise HTTPException(404, "Activity not found")
    ref.set(activity.dict())
    return {"id": activity_id, "status": "updated"}

@router.delete("/{activity_id}")
def delete_activity(activity_id: str):
    ref = get_activities_collection().document(activity_id)
    if not ref.get().exists:
        raise HTTPException(404, "Activity not found")
    ref.delete()
    return {"id": activity_id, "status": "deleted"}
