# backend/app/routers/ai.py

from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Dict, Any
from app.core.db import db
from firebase_admin import auth as firebase_auth
from datetime import datetime

router = APIRouter()

# Dependency for token verification
def verify_token(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    id_token = authorization.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        return decoded_token.get('uid')
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# Utils: fetch latest logs from Firestore
def get_latest_logs(user_id: str, log_type: str, days: int = 7):
    col = db.collection(log_type)
    now = datetime.utcnow()
    docs = (
        col.where("user_id", "==", user_id)
        .stream()
    )
    recent = []
    for doc in docs:
        data = doc.to_dict()
        try:
            dt = datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00"))
            if (now - dt).days <= days:
                recent.append(data)
        except Exception:
            continue
    return recent


@router.post("/predict/athlete-risk")
def athlete_risk(
    recommendation_input: Dict[str, Any], 
    user_id: str = Depends(verify_token)
):
    # For demo, takes latest activity/wellness logs OR use posted values
    fatigue = recommendation_input.get("fatigue", 0)
    soreness = recommendation_input.get("soreness", 0)
    sleep_hours = recommendation_input.get("sleep_hours", 7)
    stress_level = recommendation_input.get("stress", 0)

    # --- Rule-based MVP logic ---
    if sleep_hours < 6 and soreness > 5 and stress_level > 3:
        risk_level = "High"
        recommendation = "Reduce training load. Prioritize sleep and active recovery."
    elif sleep_hours < 7 or soreness > 3 or stress_level > 2:
        risk_level = "Medium"
        recommendation = "Monitor recovery and stress. Lighten training if necessary."
    else:
        risk_level = "Low"
        recommendation = "Continue with planned training."
    return {
        "risk_level": risk_level,
        "contributing_factors": {
            "fatigue": fatigue, "soreness": soreness,
            "sleep_hours": sleep_hours, "stress": stress_level,
        },
        "recommendation": recommendation
    }

@router.post("/predict/elder-risk")
def elder_risk(
    log_input: Dict[str, Any], 
    user_id: str = Depends(verify_token)
):
    # For demo, take posted features or fetch logs
    pain = log_input.get("pain", 0)
    fatigue = log_input.get("fatigue", 0)
    steps = log_input.get("steps", 3000)

    # --- Rule-based MVP logic ---
    if steps < 2000 or pain > 6 or fatigue > 6:
        risk_level = "High"
        recommendation = "Increase supervision and consider rest. Monitor for fall risk."
    elif steps < 4000 or pain > 3 or fatigue > 3:
        risk_level = "Medium"
        recommendation = "Encourage light movement and monitor pain/fatigue."
    else:
        risk_level = "Low"
        recommendation = "Activity level is safe. Continue routine."
    return {
        "risk_level": risk_level,
        "contributing_factors": {
            "pain": pain, "fatigue": fatigue, "steps": steps,
        },
        "recommendation": recommendation
    }
