from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.exportacion import FormatoExportacion

class ExportacionCreate(BaseModel):
    visualizacion_id: int
    formato: FormatoExportacion
    tipo_contenido: str = "visualization"

class ExportacionResponse(BaseModel):
    id: int
    visualizacion_id: int
    usuario_id: int
    tipo_contenido: str
    formato: FormatoExportacion
    archivo: str
    fecha_creacion: datetime
    tamaño: int
    expira_en: Optional[datetime] = None

    class Config:
        from_attributes = True

