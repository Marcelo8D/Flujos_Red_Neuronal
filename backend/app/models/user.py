from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum

class ProveedorAutenticacion(str, enum.Enum):
    LOCAL = "LOCAL"
    GOOGLE = "GOOGLE"

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
    proveedor_autenticacion = Column(
        SQLEnum(ProveedorAutenticacion, name="proveedor_autenticacion"),
        default=ProveedorAutenticacion.LOCAL,
        nullable=False
    )
    oauth_id = Column(String(255), nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"