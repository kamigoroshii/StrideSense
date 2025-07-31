from pydantic import BaseModel, EmailStr, ConfigDict
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

class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    name: str
    dob: str
    gender: str
    height: float
    weight: float
    user_type: str  # athlete or elder
    sport: Optional[str] = None
    medical_conditions: Optional[str] = None
