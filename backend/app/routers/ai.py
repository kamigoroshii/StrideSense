from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Dict, Any
from app.core.ai_models import get_athlete_injury_model
from firebase_admin import auth as firebase_auth
from datetime import datetime
import os

router = APIRouter()

def verify_token(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    id_token = authorization.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        return decoded_token.get('uid')
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def analyze_contributing_factors(features):
    """Analyze which factors are contributing to risk assessment"""
    contributing_factors = {}
    
    # Define thresholds for each factor
    thresholds = {
        "Heart_Rate_BPM": {"high": 160, "medium": 140},
        "Respiratory_Rate_BPM": {"high": 25, "medium": 20},
        "Skin_Temperature_C": {"high": 38.5, "medium": 37.5},
        "Blood_Oxygen_Level_Percent": {"high": 95, "medium": 97},
        "Impact_Force_Newtons": {"high": 150, "medium": 100},
        "Cumulative_Fatigue_Index": {"high": 2.0, "medium": 1.5},
        "Duration_Minutes": {"high": 120, "medium": 90},
        "Injury_Risk_Score": {"high": 70, "medium": 60}
    }
    
    feature_names = [
        "Heart_Rate_BPM", "Respiratory_Rate_BPM", "Skin_Temperature_C",
        "Blood_Oxygen_Level_Percent", "Impact_Force_Newtons",
        "Cumulative_Fatigue_Index", "Duration_Minutes", "Injury_Risk_Score"
    ]
    
    for i, (feature_name, value) in enumerate(zip(feature_names, features)):
        if feature_name in thresholds:
            threshold = thresholds[feature_name]
            if value >= threshold["high"]:
                contributing_factors[feature_name] = value
            elif value >= threshold["medium"]:
                contributing_factors[feature_name] = value
    
    return contributing_factors

def analyze_elder_factors(features):
    """Analyze which factors are contributing to elder risk assessment"""
    contributing_factors = {}
    
    # Define thresholds for elder factors
    thresholds = {
        "pain": {"high": 7, "medium": 5},
        "fatigue": {"high": 7, "medium": 5},
        "steps": {"high": 10000, "medium": 5000},
        "balance_score": {"high": 3, "medium": 5},
        "mobility_score": {"high": 3, "medium": 5}
    }
    
    for feature_name, value in features.items():
        if feature_name in thresholds:
            threshold = thresholds[feature_name]
            if value >= threshold["high"]:
                contributing_factors[feature_name] = value
            elif value >= threshold["medium"]:
                contributing_factors[feature_name] = value
    
    return contributing_factors

@router.post("/predict/athlete-risk")
def athlete_risk(json: Dict[str, Any], user_id: str = Depends(verify_token)):
    # Extract features with proper validation and defaults
    features = [
        float(json.get("Heart_Rate_BPM", 70)),
        float(json.get("Respiratory_Rate_BPM", 15)),
        float(json.get("Skin_Temperature_C", 36.5)),
        float(json.get("Blood_Oxygen_Level_Percent", 98)),
        float(json.get("Impact_Force_Newtons", 0)),
        float(json.get("Cumulative_Fatigue_Index", 1.0)),
        float(json.get("Duration_Minutes", 60)),
        float(json.get("Injury_Risk_Score", 50))
    ]
    
    model = get_athlete_injury_model()
    
    # Handle case where model is not available
    if model is None:
        # Improved fallback logic with more balanced thresholds
        heart_rate = features[0]
        fatigue_index = features[5]
        injury_risk_score = features[7]
        impact_force = features[4]
        duration = features[6]
        
        # More nuanced risk assessment
        risk_factors = 0
        
        if heart_rate > 170: risk_factors += 2
        elif heart_rate > 150: risk_factors += 1
        
        if fatigue_index > 2.5: risk_factors += 2
        elif fatigue_index > 1.8: risk_factors += 1
        
        if injury_risk_score > 75: risk_factors += 2
        elif injury_risk_score > 65: risk_factors += 1
        
        if impact_force > 200: risk_factors += 1
        elif impact_force > 150: risk_factors += 0.5
        
        if duration > 120: risk_factors += 1
        elif duration > 90: risk_factors += 0.5
        
        # Balanced threshold - need multiple risk factors for high risk
        pred = 1 if risk_factors >= 3 else 0
    else:
        # Use model prediction with adjusted threshold to reduce bias
        prediction_proba = model.predict_proba([features])[0]
        
        # Adjust threshold to be more conservative (reduce false positives)
        # Original model is biased towards class 1, so we use a higher threshold
        threshold = 0.6  # Require 60% confidence for high risk
        pred = 1 if prediction_proba[1] >= threshold else 0
    
    risk_level = ["Low", "High"][pred]
    
    # Generate more detailed recommendation based on contributing factors
    contributing_factors = analyze_contributing_factors(features)
    
    if pred == 0:
        rec_text = "Great condition! Maintain current training load and continue monitoring."
    else:
        rec_text = "High injury risk detected! Consider reducing intensity, increasing rest periods, and monitoring closely."
    
    # Store prediction in database for history
    try:
        from app.core.db import db
        prediction_doc = {
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "input": json,
            "output": {
                "risk_level": risk_level,
                "features": dict(
                    Heart_Rate_BPM=features[0], Respiratory_Rate_BPM=features[1],
                    Skin_Temperature_C=features[2], Blood_Oxygen_Level_Percent=features[3],
                    Impact_Force_Newtons=features[4], Cumulative_Fatigue_Index=features[5],
                    Duration_Minutes=features[6], Injury_Risk_Score=features[7]
                ),
                "contributing_factors": contributing_factors,
                "recommendation": rec_text,
                "model_available": model is not None,
                "prediction_confidence": model.predict_proba([features])[0].tolist() if model else None
            }
        }
        db.collection("risk_predictions").add(prediction_doc)
    except Exception as e:
        print(f"Warning: Could not store prediction in database: {e}")
    
    return {
        "risk_level": risk_level,
        "features": dict(
            Heart_Rate_BPM=features[0], Respiratory_Rate_BPM=features[1],
            Skin_Temperature_C=features[2], Blood_Oxygen_Level_Percent=features[3],
            Impact_Force_Newtons=features[4], Cumulative_Fatigue_Index=features[5],
            Duration_Minutes=features[6], Injury_Risk_Score=features[7]
        ),
        "contributing_factors": contributing_factors,
        "recommendation": rec_text,
        "model_available": model is not None,
        "prediction_confidence": model.predict_proba([features])[0].tolist() if model else None
    }

@router.post("/predict/elder-risk")
def elder_risk(json: Dict[str, Any], user_id: str = Depends(verify_token)):
    # Extract elder-specific features
    pain = float(json.get("pain", 0))
    fatigue = float(json.get("fatigue", 0))
    steps = float(json.get("steps", 0))
    balance_score = float(json.get("balance_score", 7))  # Higher is better
    mobility_score = float(json.get("mobility_score", 7))  # Higher is better
    
    # Simple risk assessment for elders
    risk_factors = 0
    
    if pain >= 7: risk_factors += 2
    elif pain >= 5: risk_factors += 1
    
    if fatigue >= 7: risk_factors += 2
    elif fatigue >= 5: risk_factors += 1
    
    if steps < 2000: risk_factors += 2
    elif steps < 5000: risk_factors += 1
    
    if balance_score <= 3: risk_factors += 2
    elif balance_score <= 5: risk_factors += 1
    
    if mobility_score <= 3: risk_factors += 2
    elif mobility_score <= 5: risk_factors += 1
    
    # Determine risk level
    if risk_factors >= 4:
        risk_level = "High"
        rec_text = "High fall risk detected! Consider using mobility aids, reducing activity, and consulting healthcare provider."
    elif risk_factors >= 2:
        risk_level = "Medium"
        rec_text = "Moderate risk. Monitor symptoms closely and consider gentle exercise programs."
    else:
        risk_level = "Low"
        rec_text = "Low risk. Continue current activity level and maintain regular check-ups."
    
    features = {
        "pain": pain,
        "fatigue": fatigue,
        "steps": steps,
        "balance_score": balance_score,
        "mobility_score": mobility_score
    }
    
    contributing_factors = analyze_elder_factors(features)
    
    # Store prediction in database for history
    try:
        from app.core.db import db
        prediction_doc = {
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "input": json,
            "output": {
                "risk_level": risk_level,
                "features": features,
                "contributing_factors": contributing_factors,
                "recommendation": rec_text,
                "model_available": False,  # No ML model for elders yet
                "prediction_confidence": None
            }
        }
        db.collection("risk_predictions").add(prediction_doc)
    except Exception as e:
        print(f"Warning: Could not store prediction in database: {e}")
    
    return {
        "risk_level": risk_level,
        "features": features,
        "contributing_factors": contributing_factors,
        "recommendation": rec_text,
        "model_available": False,
        "prediction_confidence": None
    }

@router.get("/risk_predictions")
def get_risk_predictions(user_id: str, user_id_param: str = Depends(verify_token)):
    """Get risk prediction history for a user"""
    try:
        from app.core.db import db
        
        # Get predictions for the user
        predictions_ref = db.collection("risk_predictions").where("user_id", "==", user_id)
        predictions = predictions_ref.stream()
        
        prediction_list = []
        for pred in predictions:
            pred_data = pred.to_dict()
            pred_data["id"] = pred.id
            # Convert timestamp to string for JSON serialization
            if "timestamp" in pred_data:
                pred_data["timestamp"] = pred_data["timestamp"].isoformat()
            prediction_list.append(pred_data)
        
        # Sort by timestamp (newest first)
        prediction_list.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return prediction_list
        
    except Exception as e:
        print(f"Error fetching risk predictions: {e}")
        return []
