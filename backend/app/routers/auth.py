from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserOut

router = APIRouter()

# Simplified in-memory user "database"
fake_users_db = {}

@router.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    # Simulate password hashing: store plain password (in real app, hash it)
    user_dict = user.dict()
    user_id = f"user_{len(fake_users_db) + 1}"
    fake_users_db[user.email] = {"id": user_id, **user_dict}
    return UserOut(id=user_id, **user.dict(exclude={"password"}))

@router.post("/login")
async def login(form_data: dict):
    # Simulate login, accept JSON body: { "username": "...", "password": "..." }
    username = form_data.get("username")
    password = form_data.get("password")
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    user = fake_users_db.get(username)
    if user is None or user["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    # Return a dummy token
    return {"access_token": "fake-jwt-token", "token_type": "bearer"}
