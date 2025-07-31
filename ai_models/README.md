# AI Risk Prediction Models

This directory contains all AI-related components for the StrideSense injury risk prediction system.

## Directory Structure

```
ai_models/
├── README.md                    # This file
├── athlete_injury_model.ipynb   # Jupyter notebook for model development
├── data/                        # Dataset directory
│   └── college_sports_injury_detection.csv
├── models/                      # Trained model files (generated)
└── scripts/                     # Model training scripts
    ├── retrain_advanced.py      # Advanced model with feature engineering
    └── retrain_simple.py        # Simple model with basic features
```

## Model Training Scripts

### 1. Advanced Model (`retrain_advanced.py`)
**Features:**
- Uses pandas for data processing
- Includes feature engineering:
  - BMI calculation (if height/weight available)
  - Heart Rate to Age Ratio
  - Fatigue per Minute
- 11 total features (8 original + 3 engineered)
- Handles missing values with mean imputation

**Usage:**
```bash
cd ai_models/scripts
python retrain_advanced.py
```

### 2. Simple Model (`retrain_simple.py`)
**Features:**
- Manual CSV loading (no pandas dependency)
- Uses only original 8 features
- Lightweight and portable
- Better for environments with limited dependencies

**Usage:**
```bash
cd ai_models/scripts
python retrain_simple.py
```

## Model Output

Both scripts save the trained model to:
```
backend/app/core/athlete_injury_rf.joblib
```

## Features Used

### Original Features (8):
- Heart_Rate_BPM
- Respiratory_Rate_BPM
- Skin_Temperature_C
- Blood_Oxygen_Level_Percent
- Impact_Force_Newtons
- Cumulative_Fatigue_Index
- Duration_Minutes
- Injury_Risk_Score

### Engineered Features (Advanced model only):
- BMI (if height/weight data available)
- HR_Age_Ratio
- Fatigue_per_Minute

## Development

For model development and experimentation, use the Jupyter notebook:
```bash
jupyter notebook athlete_injury_model.ipynb
```

## Model Performance

Both models use:
- RandomForestClassifier with 64 estimators
- Balanced class weights
- Stratified train/test split
- Classification report and accuracy metrics

Choose the model based on your needs:
- **Advanced**: Better performance, more features, requires pandas
- **Simple**: Faster training, fewer dependencies, portable 