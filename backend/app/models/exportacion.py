from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class FormatoExportacion(str, enum.Enum):
    PDF = "pdf"
    PNG = "png"
    SVG = "svg"
    JSON = "json"
    HTML = "html"

class Exportacion(Base):
    __tablename__ = "exportaciones"
    
    id = Column(Integer, primary_key=True, index=True)
    visualizacion_id = Column(Integer, ForeignKey("visualizaciones.id", ondelete="CASCADE"), nullable=False, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False, index=True)
    tipo_contenido = Column(String(100), nullable=False)
    formato = Column(SQLEnum(FormatoExportacion, name="formato_exportacion"), nullable=False)
    archivo = Column(String(500), nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    tamaño = Column(BigInteger, nullable=False)
    expira_en = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    visualizacion = relationship("Visualizacion", back_populates="exportaciones")
    usuario = relationship("User", back_populates="exportaciones")
    
    def __repr__(self):
        return f"<Exportacion(id={self.id}, formato='{self.formato}', archivo='{self.archivo}')>"

