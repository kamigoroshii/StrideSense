from fastapi import FastAPI
from app.routers import auth, users, activity, wellness

app = FastAPI(title="PulsePro MVP Backend")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(activity.router, prefix="/data/activity", tags=["activity"])
app.include_router(wellness.router, prefix="/data/wellness", tags=["wellness"])

@app.get("/")
async def root():
    return {"message": "Welcome to PulsePro API"}
