from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class ArchivoEntrada(Base):
    __tablename__ = "archivos_entrada"
    
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey("proyectos.id"), nullable=False, index=True)
    nombre_archivo = Column(String(255), nullable=False)
    fichero = Column(Text, nullable=False) 
    ataque = Column(Boolean, default=False, nullable=False)
    num_neuronas = Column(Integer, nullable=False)
    capas = Column(ARRAY(Integer), nullable=False)
    matriz_pesos = Column(JSONB, nullable=False)
    fecha_carga = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationship
    proyecto = relationship("Proyecto", back_populates="archivos_entrada")
    
    def __repr__(self):
        return f"<ArchivoEntrada(id={self.id}, nombre_archivo='{self.nombre_archivo}')>"

