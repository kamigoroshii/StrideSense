

# StrideSense - Sacropenia and Sports Injury Risk Prediction


By performing wearable integration taking the past data and performing ML prediction for athletes regarding 
bone degradation diseases and muscle mass like sacropenia for both elders and young athletes

## Project Structure

```
StrideSense/
├── README.md                    # This file
├── backend/                     # FastAPI backend server
│   ├── app/                    # Application code
│   ├── requirements.txt         # Python dependencies
│   └── firebase-key.json       # Firebase configuration
├── frontend/                    # Web interface
│   ├── index.html              # Main page
│   ├── styles.css              # Styling
│   └── script.js               # Frontend logic
├── ai_models/                   # AI risk prediction components
│   ├── README.md               # AI models documentation
│   ├── data/                   # Training datasets
│   ├── scripts/                # Model training scripts
│   └── athlete_injury_model.ipynb  # Development notebook
└── .venv/                      # Python virtual environment
```

## Quick Start

### 1. Setup Environment
```bash
# Activate virtual environment
.venv\Scripts\activate

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 2. Run Backend Server
```bash
# From project root
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Run Frontend
```bash
# Open new terminal
cd frontend
python -m http.server 8080
```

### 4. Access Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## AI Model Training

### Quick Training
```bash
# Simple model (recommended for most cases)
cd ai_models/scripts
python retrain_simple.py

# Advanced model (with feature engineering)
python retrain_advanced.py
```

### Development
```bash
# Open Jupyter notebook for model development
cd ai_models
jupyter notebook athlete_injury_model.ipynb
```

## Features

- **Real-time Risk Assessment**: AI-powered injury risk prediction
- **Biometric Data Processing**: Heart rate, temperature, fatigue analysis
- **Web Interface**: User-friendly dashboard
- **RESTful API**: Scalable backend architecture
- **Model Retraining**: Easy model updates with new data

## API Endpoints

- `GET /` - Welcome message
- `POST /ai/predict` - Injury risk prediction
- `GET /data/activity` - Activity data
- `GET /data/wellness` - Wellness metrics
- `POST /auth/login` - User authentication

## Technologies Used

- **Backend**: FastAPI, Python 3.9+
- **Frontend**: HTML5, CSS3, JavaScript
- **AI/ML**: scikit-learn, pandas, numpy
- **Data Storage**: CSV files, Firebase (optional)

- **Development**: Jupyter Notebooks
