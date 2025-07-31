import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import numpy as np

# 1. Load data
csv_path = "ai_models/data/college_sports_injury_detection.csv"
df = pd.read_csv(csv_path)

# 2. Show class balance
print("Class balance (Injury_Occurred):")
print(df['Injury_Occurred'].value_counts())

# 3. Feature engineering
# Add BMI if height and weight are available (assume cm/kg, convert to m)
if 'Height_cm' in df.columns and 'Weight_kg' in df.columns:
    df['BMI'] = df['Weight_kg'] / ((df['Height_cm'] / 100) ** 2)
    print("Added BMI feature.")
else:
    df['BMI'] = np.nan

# Add Heart Rate to Age Ratio if Age is available
if 'Age' in df.columns:
    df['HR_Age_Ratio'] = df['Heart_Rate_BPM'] / df['Age']
    print("Added Heart Rate to Age Ratio feature.")
else:
    df['HR_Age_Ratio'] = np.nan

# Fatigue per minute (Cumulative_Fatigue_Index / Duration_Minutes)
df['Fatigue_per_Minute'] = df['Cumulative_Fatigue_Index'] / (df['Duration_Minutes'].replace(0, np.nan))

# 4. Features and target
features = [
    "Heart_Rate_BPM", "Respiratory_Rate_BPM", "Skin_Temperature_C",
    "Blood_Oxygen_Level_Percent", "Impact_Force_Newtons",
    "Cumulative_Fatigue_Index", "Duration_Minutes", "Injury_Risk_Score",
    "BMI", "HR_Age_Ratio", "Fatigue_per_Minute"
]
target = "Injury_Occurred"

# 5. Clean data
X = df[features]
y = df[target]
X = X.fillna(X.mean())  # Fill missing engineered features with mean

# 6. Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)

# 7. Train model
model = RandomForestClassifier(n_estimators=64, random_state=42, class_weight='balanced')
model.fit(X_train, y_train)

# 8. Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, digits=3))
print("Accuracy:", accuracy_score(y_test, y_pred))

# 9. Save model
os.makedirs("backend/app/core", exist_ok=True)
joblib.dump(model, "backend/app/core/athlete_injury_rf.joblib")
print("Model saved to backend/app/core/athlete_injury_rf.joblib")