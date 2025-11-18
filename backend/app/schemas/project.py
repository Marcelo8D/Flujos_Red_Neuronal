from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.project import EstadoProyecto

class ProyectoCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class ProyectoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    estado: Optional[EstadoProyecto] = None

class ProyectoResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    usuario_id: int
    fecha_creacion: datetime
    fecha_modificacion: datetime
    estado: EstadoProyecto
    
    class Config:
        from_attributes = True

class ProyectoWithFiles(ProyectoResponse):
    archivos_entrada: List['ArchivoEntradaResponse'] = []
    
    class Config:
        from_attributes = True

# Forward reference fix
from app.schemas.archivo_entrada import ArchivoEntradaResponse
ProyectoWithFiles.model_rebuild()

