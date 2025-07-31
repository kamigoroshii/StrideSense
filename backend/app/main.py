from fastapi import FastAPI
from app.routers import ai, auth, users, activity, wellness
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI(title="PulsePro MVP Backend")

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],  # or ["*"] for all origins, but not recommended for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(activity.router, prefix="/data/activity", tags=["activity"])
app.include_router(wellness.router, prefix="/data/wellness", tags=["wellness"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])


@app.get("/")
async def root():
    return {"message": "Welcome to PulsePro API"}
