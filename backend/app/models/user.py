from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    user_type: str  # 'athlete' or 'elder'
    name: str
    dob: Optional[str] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str
