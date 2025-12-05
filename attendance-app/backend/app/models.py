import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)  # 'admin'|'user'
    department = Column(String, nullable=True)

    attendance = relationship("AttendanceRecord", back_populates="user", cascade="all, delete-orphan")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    date = Column(String, nullable=False)      # store date as 'YYYY-MM-DD' string
    status = Column(String, nullable=False)    # present|absent|late|half-day
    check_in = Column(String, nullable=True)   # ISO datetime string
    check_out = Column(String, nullable=True)  # ISO datetime string
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="attendance")
