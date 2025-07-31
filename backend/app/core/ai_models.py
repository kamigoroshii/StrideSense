import joblib
import os
from typing import Optional

_athlete_injury_model = None

def get_athlete_injury_model():
    global _athlete_injury_model
    if _athlete_injury_model is None:
        # Try multiple possible paths for the model file
        possible_paths = [
            "app/core/athlete_injury_rf.joblib",
            "backend/app/core/athlete_injury_rf.joblib",
            "athlete_injury_rf.joblib",
            os.path.join(os.path.dirname(__file__), "athlete_injury_rf.joblib")
        ]
        
        model_loaded = False
        for model_path in possible_paths:
            if os.path.exists(model_path):
                try:
                    _athlete_injury_model = joblib.load(model_path)
                    print(f"Successfully loaded model from: {model_path}")
                    model_loaded = True
                    break
                except Exception as e:
                    print(f"Warning: Could not load model from {model_path}: {e}")
                    continue
        
        if not model_loaded:
            print(f"Warning: Model file not found in any of the expected locations: {possible_paths}")
            _athlete_injury_model = None
            
    return _athlete_injury_model
