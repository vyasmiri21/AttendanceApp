from sqlalchemy.orm import Session
from . import models, schemas
from typing import List
from datetime import datetime

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email, role=user.role, department=user.department)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def list_users(db: Session) -> List[models.User]:
    return db.query(models.User).all()

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_attendance(db: Session, payload: schemas.AttendanceCreate):
    db_rec = models.AttendanceRecord(
        user_id=payload.userId,
        date=payload.date,
        status=payload.status,
        check_in=payload.checkIn,
        check_out=payload.checkOut,
        notes=payload.notes
    )
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)
    return db_rec

def list_attendance_by_user(db: Session, user_id: str) -> List[models.AttendanceRecord]:
    return db.query(models.AttendanceRecord).filter(models.AttendanceRecord.user_id == user_id).order_by(models.AttendanceRecord.date.desc()).all()

def list_attendance_by_date(db: Session, date_str: str) -> List[models.AttendanceRecord]:
    return db.query(models.AttendanceRecord).filter(models.AttendanceRecord.date == date_str).all()

def search_user_by_name_or_email(db: Session, q: str) -> List[models.User]:
    return db.query(models.User).filter((models.User.name.ilike(f"%{q}%")) | (models.User.email.ilike(f"%{q}%"))).all()
