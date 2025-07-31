import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import csv

# 1. Load data manually (without pandas)
def load_csv_data(filepath):
    data = []
    with open(filepath, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data

# 2. Extract features and target
def extract_features(data):
    features = [
        "Heart_Rate_BPM", "Respiratory_Rate_BPM", "Skin_Temperature_C",
        "Blood_Oxygen_Level_Percent", "Impact_Force_Newtons",
        "Cumulative_Fatigue_Index", "Duration_Minutes", "Injury_Risk_Score"
    ]
    target = "Injury_Occurred"
    
    X = []
    y = []
    
    for row in data:
        try:
            # Extract feature values
            feature_values = [float(row[feature]) for feature in features]
            target_value = int(row[target])
            
            X.append(feature_values)
            y.append(target_value)
        except (ValueError, KeyError):
            # Skip rows with missing or invalid data
            continue
    
    return np.array(X), np.array(y)

# 3. Load and process data
print("Loading data...")
csv_path = "data/college_sports_injury_detection.csv"
data = load_csv_data(csv_path)
X, y = extract_features(data)

# 4. Show class balance
print("Class balance (Injury_Occurred):")
unique, counts = np.unique(y, return_counts=True)
for i, count in zip(unique, counts):
    print(f"Class {i}: {count}")

# 5. Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)

# 6. Train model
print("Training model...")
model = RandomForestClassifier(n_estimators=64, random_state=42, class_weight='balanced')
model.fit(X_train, y_train)

# 7. Evaluate
y_pred = model.predict(X_test)
print("\nClassification Report:")
print(classification_report(y_test, y_pred, digits=3))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")

# 8. Save model
os.makedirs("backend/app/core", exist_ok=True)
joblib.dump(model, "backend/app/core/athlete_injury_rf.joblib")
print("\nModel saved to backend/app/core/athlete_injury_rf.joblib")
print("Model trained with 8 features (original features only)") 