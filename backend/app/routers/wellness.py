from fastapi import APIRouter, Depends, HTTPException
from app.dependencies.auth_deps import verify_token
from app.models.wellness import WellnessLog
from app.core.db import db
from typing import List, Optional
from uuid import uuid4

router = APIRouter()

def get_wellness_collection():
    return db.collection("wellness")

@router.post("/", status_code=201)
def create_wellness(log: WellnessLog):
    log_id = str(uuid4())
    data = log.dict()
    data["id"] = log_id
    get_wellness_collection().document(log_id).set(data)
    return {"id": log_id, "status": "created"}

@router.get("/", response_model=List[WellnessLog])
def list_wellness(user_id: str):
    docs = get_wellness_collection().where("user_id", "==", user_id).stream()
    return [doc.to_dict() for doc in docs]

@router.get("/{log_id}", response_model=WellnessLog)
def get_wellness(log_id: str):
    doc = get_wellness_collection().document(log_id).get()
    if not doc.exists:
        raise HTTPException(404, "Wellness log not found")
    return doc.to_dict()

@router.put("/{log_id}")
def update_wellness(log_id: str, log: WellnessLog):
    ref = get_wellness_collection().document(log_id)
    if not ref.get().exists:
        raise HTTPException(404, "Wellness log not found")
    ref.set(log.dict())
    return {"id": log_id, "status": "updated"}

@router.delete("/{log_id}")
def delete_wellness(log_id: str):
    ref = get_wellness_collection().document(log_id)
    if not ref.get().exists:
        raise HTTPException(404, "Wellness log not found")
    ref.delete()
    return {"id": log_id, "status": "deleted"}
