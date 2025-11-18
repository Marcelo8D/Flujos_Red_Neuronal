from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class EstadoProyecto(str, enum.Enum):
    ACTIVO = "Activo"
    ARCHIVADO = "Archivado"

class Proyecto(Base):
    __tablename__ = "proyectos"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_modificacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    estado = Column(
        SQLEnum(EstadoProyecto, name="estado_proyecto"),
        default=EstadoProyecto.ACTIVO,
        nullable=False
    )
    
    # Relationships
    usuario = relationship("User", back_populates="proyectos")
    archivos_entrada = relationship("ArchivoEntrada", back_populates="proyecto", cascade="all, delete-orphan")
    visualizaciones = relationship("Visualizacion", back_populates="proyecto", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Proyecto(id={self.id}, nombre='{self.nombre}')>"

