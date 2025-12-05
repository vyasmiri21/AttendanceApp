from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRead(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    department: Optional[str]
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: str
    department: Optional[str]

class AttendanceRead(BaseModel):
    id: str
    userId: str
    date: str
    status: str
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None
    notes: Optional[str] = None
    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    userId: str
    date: str
    status: str
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None
    notes: Optional[str] = None
