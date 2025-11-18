from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.project import Proyecto, EstadoProyecto
from app.models.archivo_entrada import ArchivoEntrada
from app.models.visualizacion import Visualizacion
from app.api.auth import get_current_user
from app.schemas.project import ProyectoCreate, ProyectoUpdate, ProyectoResponse, ProyectoWithFiles
from app.schemas.archivo_entrada import ArchivoEntradaResponse
from app.services.neural_network_parser import NeuralNetworkParser
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter()

@router.post("", response_model=ProyectoResponse, status_code=status.HTTP_201_CREATED)
async def create_proyecto(
    proyecto_data: ProyectoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    nuevo_proyecto = Proyecto(
        nombre=proyecto_data.nombre,
        descripcion=proyecto_data.descripcion,
        usuario_id=current_user.id,
        estado=EstadoProyecto.ACTIVO
    )
    
    db.add(nuevo_proyecto)
    db.commit()
    db.refresh(nuevo_proyecto)
    
    return nuevo_proyecto

@router.get("", response_model=List[ProyectoResponse])
async def get_proyectos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    estado: Optional[EstadoProyecto] = None
):
    """Get all projects for the current user"""
    query = db.query(Proyecto).filter(Proyecto.usuario_id == current_user.id)
    
    if estado:
        query = query.filter(Proyecto.estado == estado)
    
    proyectos = query.order_by(Proyecto.fecha_modificacion.desc()).all()
    return proyectos

@router.get("/{proyecto_id}", response_model=ProyectoWithFiles)
async def get_proyecto(
    proyecto_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a project by ID with its input files"""
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.usuario_id == current_user.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return proyecto

@router.put("/{proyecto_id}", response_model=ProyectoResponse)
async def update_proyecto(
    proyecto_id: int,
    proyecto_data: ProyectoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a project"""
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.usuario_id == current_user.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if proyecto_data.nombre is not None:
        proyecto.nombre = proyecto_data.nombre
    if proyecto_data.descripcion is not None:
        proyecto.descripcion = proyecto_data.descripcion
    if proyecto_data.estado is not None:
        proyecto.estado = proyecto_data.estado
    
    proyecto.fecha_modificacion = datetime.utcnow()
    
    db.commit()
    db.refresh(proyecto)
    
    return proyecto

@router.delete("/{proyecto_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_proyecto(
    proyecto_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a project"""
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.usuario_id == current_user.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(proyecto)
    db.commit()
    
    return None

@router.post("/{proyecto_id}/archivos-entrada", response_model=ArchivoEntradaResponse, status_code=status.HTTP_201_CREATED)
async def upload_archivo_entrada(
    proyecto_id: int,
    file: UploadFile = File(...),
    ataque: str = "False",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload an input file (.txt) to a project"""
    # Verify project exists and belongs to user
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.usuario_id == current_user.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check file extension
    if not file.filename.endswith('.txt'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .txt files are allowed"
        )
    
    # Convert ataque string to boolean
    ataque_bool = ataque.lower() == 'true'
    
    # Read file content
    content = await file.read()
    file_content = content.decode('utf-8')
    
    # Parse the neural network file
    try:
        parser = NeuralNetworkParser()
        parsed_data = parser.parse(file_content)
        parser.validate_parsed_data(parsed_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error parsing file: {str(e)}"
        )
    
    # Create ArchivoEntrada record
    nuevo_archivo = ArchivoEntrada(
        proyecto_id=proyecto_id,
        nombre_archivo=file.filename,
        fichero=file_content,
        ataque=ataque_bool,
        num_neuronas=parsed_data["num_neuronas"],
        capas=parsed_data["capas"],
        matriz_pesos=parsed_data["matriz_pesos"]
    )
    
    db.add(nuevo_archivo)
    proyecto.fecha_modificacion = datetime.utcnow()
    db.commit()
    db.refresh(nuevo_archivo)
    
    return nuevo_archivo

@router.get("/{proyecto_id}/archivos-entrada", response_model=List[ArchivoEntradaResponse])
async def get_archivos_entrada(
    proyecto_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all input files for a project"""
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.usuario_id == current_user.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return proyecto.archivos_entrada

@router.get("/{proyecto_id}/archivos-entrada/{archivo_id}", response_model=ArchivoEntradaResponse)
async def get_archivo_entrada(
    proyecto_id: int,
    archivo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific input file"""
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.usuario_id == current_user.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    archivo = db.query(ArchivoEntrada).filter(
        ArchivoEntrada.id == archivo_id,
        ArchivoEntrada.proyecto_id == proyecto_id
    ).first()
    
    if not archivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Input file not found"
        )
    
    return archivo

@router.delete("/{proyecto_id}/archivos-entrada/{archivo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_archivo_entrada(
    proyecto_id: int,
    archivo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an input file"""
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.usuario_id == current_user.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    archivo = db.query(ArchivoEntrada).filter(
        ArchivoEntrada.id == archivo_id,
        ArchivoEntrada.proyecto_id == proyecto_id
    ).first()
    
    if not archivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Input file not found"
        )
    
    db.delete(archivo)
    proyecto.fecha_modificacion = datetime.utcnow()
    db.commit()
    
    return None

class VisualizacionCreate(BaseModel):
    layout_config: Optional[Dict[str, Any]] = {}

@router.post("/{proyecto_id}/visualizaciones", status_code=status.HTTP_201_CREATED)
async def create_visualizacion(
    proyecto_id: int,
    visualizacion_data: VisualizacionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new visualization for a project"""
    proyecto = db.query(Proyecto).filter(
        Proyecto.id == proyecto_id,
        Proyecto.usuario_id == current_user.id
    ).first()
    
    if not proyecto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    nueva_visualizacion = Visualizacion(
        proyecto_id=proyecto_id,
        layout_config=visualizacion_data.layout_config or {}
    )
    
    db.add(nueva_visualizacion)
    db.commit()
    db.refresh(nueva_visualizacion)
    
    return {
        "id": nueva_visualizacion.id,
        "proyecto_id": nueva_visualizacion.proyecto_id,
        "layout_config": nueva_visualizacion.layout_config,
        "fecha_creacion": nueva_visualizacion.fecha_creacion,
        "activo": nueva_visualizacion.activo
    }

