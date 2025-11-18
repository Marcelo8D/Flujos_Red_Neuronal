from pydantic import BaseModel
from datetime import datetime
from typing import List

class ArchivoEntradaUpload(BaseModel):
    # This will be handled via FormData in the endpoint
    pass

class ArchivoEntradaResponse(BaseModel):
    id: int
    proyecto_id: int
    nombre_archivo: str
    ataque: bool
    num_neuronas: int
    capas: List[int]
    matriz_pesos: List[List[float]]
    fecha_carga: datetime
    
    class Config:
        from_attributes = True

class ArchivoEntradaDetail(ArchivoEntradaResponse):
    fichero: str  # Include file content in detailed view
    
    class Config:
        from_attributes = True

