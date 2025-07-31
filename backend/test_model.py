#!/usr/bin/env python3
"""
Test script to verify the AI model loading works correctly
"""

import sys
import os

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from core.ai_models import get_athlete_injury_model

def test_model_loading():
    print("Testing AI model loading...")
    
    model = get_athlete_injury_model()
    
    if model is not None:
        print("✅ Model loaded successfully!")
        print(f"Model type: {type(model)}")
        
        # Test a simple prediction
        try:
            # Sample features for testing
            test_features = [70, 15, 36.5, 98, 0, 1.0, 60, 50]
            prediction = model.predict([test_features])
            probabilities = model.predict_proba([test_features])
            
            print(f"✅ Test prediction successful!")
            print(f"Prediction: {prediction[0]}")
            print(f"Probabilities: {probabilities[0]}")
            
        except Exception as e:
            print(f"❌ Error during prediction: {e}")
            
    else:
        print("❌ Model failed to load!")
        print("This means the fallback logic will be used for risk predictions.")

if __name__ == "__main__":
    test_model_loading() 