import joblib
import os
from typing import Optional

_athlete_injury_model = None

def get_athlete_injury_model():
    global _athlete_injury_model
    if _athlete_injury_model is None:
        model_path = "app/core/athlete_injury_rf.joblib"
        if os.path.exists(model_path):
            try:
                _athlete_injury_model = joblib.load(model_path)
            except Exception as e:
                print(f"Warning: Could not load model from {model_path}: {e}")
                _athlete_injury_model = None
        else:
            print(f"Warning: Model file not found at {model_path}")
            _athlete_injury_model = None
    return _athlete_injury_model
