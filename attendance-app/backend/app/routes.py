from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import crud, schemas

router = APIRouter()

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

# Users
@router.post("/users", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    return crud.create_user(db, user)

@router.get("/users", response_model=list[schemas.UserRead])
def get_users(db: Session = Depends(get_db)):
    return crud.list_users(db)

@router.get("/users/{user_id}", response_model=schemas.UserRead)
def get_user(user_id: str, db: Session = Depends(get_db)):
    u = crud.get_user(db, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return u

# Attendance
@router.post("/attendance", response_model=schemas.AttendanceRead)
def create_attendance(payload: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # basic validation of status
    if payload.status not in {"present", "absent", "late", "half-day"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    return crud.create_attendance(db, payload)

@router.get("/attendance/user/{user_id}", response_model=list[schemas.AttendanceRead])
def attendance_for_user(user_id: str, db: Session = Depends(get_db)):
    return crud.list_attendance_by_user(db, user_id)

@router.get("/attendance/date/{date_str}", response_model=list[schemas.AttendanceRead])
def attendance_by_date(date_str: str, db: Session = Depends(get_db)):
    return crud.list_attendance_by_date(db, date_str)

# Search
@router.get("/search/users")
def search_users(q: str, db: Session = Depends(get_db)):
    return crud.search_user_by_name_or_email(db, q)
