# StrideSense Backend

FastAPI backend for the StrideSense AI-powered sports injury risk prediction system.

## Directory Structure

```
backend/
├── README.md                    # This file
├── requirements.txt             # Python dependencies
├── firebase-key.json           # Firebase configuration
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
└── app/                        # Application code
    ├── main.py                 # FastAPI application entry point
    ├── __init__.py             # Python package marker
    ├── routers/                # API route handlers
    │   ├── __init__.py
    │   ├── ai.py              # AI risk prediction endpoints
    │   ├── auth.py            # Authentication endpoints
    │   ├── users.py           # User management endpoints
    │   ├── activity.py        # Activity logging endpoints
    │   └── wellness.py        # Wellness tracking endpoints
    ├── models/                 # Pydantic data models
    │   ├── __init__.py
    │   ├── user.py            # User data models
    │   ├── activity.py        # Activity data models
    │   └── wellness.py        # Wellness data models
    ├── core/                   # Core application components
    │   ├── __init__.py
    │   ├── config.py          # Configuration settings
    │   ├── db.py              # Database connection
    │   ├── ai_models.py       # AI model loading
    │   └── athlete_injury_rf.joblib  # Trained model file
    └── dependencies/           # Dependency injection
        ├── __init__.py
        └── auth_deps.py       # Authentication dependencies
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration

### Users
- `GET /users/{user_id}` - Get user profile
- `PUT /users/{user_id}` - Update user profile
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile

### AI Risk Prediction
- `POST /ai/predict/athlete-risk` - Predict injury risk

### Activity Data
- `POST /data/activity/` - Create activity log
- `GET /data/activity/` - List activities
- `GET /data/activity/{activity_id}` - Get activity
- `PUT /data/activity/{activity_id}` - Update activity
- `DELETE /data/activity/{activity_id}` - Delete activity

### Wellness Data
- `POST /data/wellness/` - Create wellness log
- `GET /data/wellness/` - List wellness logs
- `GET /data/wellness/{log_id}` - Get wellness log
- `PUT /data/wellness/{log_id}` - Update wellness log
- `DELETE /data/wellness/{log_id}` - Delete wellness log

## Setup

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables:**
   Create a `.env` file with:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_CLIENT_ID=your-client-id
   ```

3. **Run the Server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Features

- **AI Risk Prediction**: Real-time injury risk assessment
- **User Management**: Firebase authentication integration
- **Activity Tracking**: Comprehensive activity logging
- **Wellness Monitoring**: Health and wellness metrics
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Frontend integration ready

## Technologies

- **FastAPI**: Modern, fast web framework
- **Firebase**: Authentication and database
- **Pydantic**: Data validation and serialization
- **scikit-learn**: AI model integration
- **Uvicorn**: ASGI server 