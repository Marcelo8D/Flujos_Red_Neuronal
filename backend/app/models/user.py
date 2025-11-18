from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class User(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    nombre = Column(String(100), nullable=False)
    apellidos = Column(String(150), nullable=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ultimo_acceso = Column(DateTime(timezone=True), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)

    
    # Relationships
    proyectos = relationship("Proyecto", back_populates="usuario")
    exportaciones = relationship("Exportacion", back_populates="usuario", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"