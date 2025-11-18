from sqlalchemy import Column, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Visualizacion(Base):
    __tablename__ = "visualizaciones"
    
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey("proyectos.id", ondelete="CASCADE"), nullable=False, index=True)
    layout_config = Column(JSONB, nullable=False, server_default='{}')
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    proyecto = relationship("Proyecto", back_populates="visualizaciones")
    exportaciones = relationship("Exportacion", back_populates="visualizacion", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Visualizacion(id={self.id}, proyecto_id={self.proyecto_id})>"

