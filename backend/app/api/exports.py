from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, timezone
import json
import os
import base64
from pathlib import Path

from app.database import get_db
from app.models.user import User
from app.models.visualizacion import Visualizacion
from app.models.exportacion import Exportacion, FormatoExportacion
from app.api.auth import get_current_user
from app.schemas.exportacion import ExportacionCreate, ExportacionResponse

router = APIRouter()

# Create exports directory if it doesn't exist
EXPORTS_DIR = Path("exports")
EXPORTS_DIR.mkdir(exist_ok=True)

@router.post("", response_model=ExportacionResponse, status_code=status.HTTP_201_CREATED)
async def create_export(
    export_data: ExportacionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new export"""
    # Verify visualization exists and belongs to user's project
    visualizacion = db.query(Visualizacion).filter(
        Visualizacion.id == export_data.visualizacion_id
    ).first()
    
    if not visualizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visualization not found"
        )
    
    # Check if user owns the project
    if visualizacion.proyecto.usuario_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to export this visualization"
        )
    
    # Generate filename
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    filename = f"export_{visualizacion.id}_{timestamp}.{export_data.formato.value}"
    filepath = EXPORTS_DIR / filename
    
    # Generate export content based on format
    content = await generate_export_content(visualizacion, export_data.formato)
    
    # Save file
    if export_data.formato in [FormatoExportacion.PDF, FormatoExportacion.PNG]:
        # For binary formats
        with open(filepath, 'wb') as f:
            if isinstance(content, bytes):
                f.write(content)
            else:
                f.write(content.encode('utf-8'))
    else:
        # For text formats (SVG, JSON, HTML)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content if isinstance(content, str) else str(content))
    
    # Get file size
    file_size = filepath.stat().st_size
    
    # Determine content type
    content_type_map = {
        FormatoExportacion.PDF: "application/pdf",
        FormatoExportacion.PNG: "image/png",
        FormatoExportacion.SVG: "image/svg+xml",
        FormatoExportacion.JSON: "application/json",
        FormatoExportacion.HTML: "text/html"
    }
    tipo_contenido = content_type_map.get(export_data.formato, "application/octet-stream")
    
    # Set expiration (30 days from now)
    expira_en = datetime.now(timezone.utc) + timedelta(days=30)
    
    # Create export record
    nueva_exportacion = Exportacion(
        visualizacion_id=export_data.visualizacion_id,
        usuario_id=current_user.id,
        tipo_contenido=tipo_contenido,
        formato=export_data.formato,
        archivo=str(filepath),
        tamaño=file_size,
        expira_en=expira_en
    )
    
    db.add(nueva_exportacion)
    db.commit()
    db.refresh(nueva_exportacion)
    
    return nueva_exportacion

@router.get("/{export_id}/download")
async def download_export(
    export_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download an export file"""
    exportacion = db.query(Exportacion).filter(
        Exportacion.id == export_id,
        Exportacion.usuario_id == current_user.id
    ).first()
    
    if not exportacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Export not found"
        )
    
    # Check if file exists
    filepath = Path(exportacion.archivo)
    if not filepath.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Export file not found"
        )
    
    # Check expiration
    if exportacion.expira_en and exportacion.expira_en < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Export has expired"
        )
    
    return FileResponse(
        path=filepath,
        filename=filepath.name,
        media_type=exportacion.tipo_contenido
    )

@router.get("", response_model=List[ExportacionResponse])
async def get_exports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    visualizacion_id: int = None
):
    """Get all exports for the current user"""
    query = db.query(Exportacion).filter(Exportacion.usuario_id == current_user.id)
    
    if visualizacion_id:
        query = query.filter(Exportacion.visualizacion_id == visualizacion_id)
    
    exports = query.order_by(Exportacion.fecha_creacion.desc()).all()
    return exports

@router.delete("/{export_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_export(
    export_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an export"""
    exportacion = db.query(Exportacion).filter(
        Exportacion.id == export_id,
        Exportacion.usuario_id == current_user.id
    ).first()
    
    if not exportacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Export not found"
        )
    
    # Delete file if exists
    filepath = Path(exportacion.archivo)
    if filepath.exists():
        filepath.unlink()
    
    db.delete(exportacion)
    db.commit()
    
    return None

async def generate_export_content(visualizacion: Visualizacion, formato: FormatoExportacion) -> str | bytes:
    """Generate export content based on format"""
    layout_config = visualizacion.layout_config or {}
    
    if formato == FormatoExportacion.JSON:
        return json.dumps({
            "visualizacion_id": visualizacion.id,
            "proyecto_id": visualizacion.proyecto_id,
            "layout_config": layout_config,
            "fecha_creacion": visualizacion.fecha_creacion.isoformat(),
            "activo": visualizacion.activo
        }, indent=2, default=str)
    
    elif formato == FormatoExportacion.HTML:
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualization Export - {visualizacion.id}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f5f5f5;
        }}
        .container {{
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #333;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }}
        .info {{
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #4CAF50;
        }}
        .config {{
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            white-space: pre-wrap;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Neural Network Visualization Export</h1>
        <div class="info">
            <p><strong>Visualization ID:</strong> {visualizacion.id}</p>
            <p><strong>Project ID:</strong> {visualizacion.proyecto_id}</p>
            <p><strong>Created:</strong> {visualizacion.fecha_creacion}</p>
            <p><strong>Active:</strong> {visualizacion.activo}</p>
        </div>
        <h2>Layout Configuration</h2>
        <div class="config">{json.dumps(layout_config, indent=2)}</div>
    </div>
</body>
</html>"""
    
    elif formato == FormatoExportacion.SVG:
        return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="#f5f5f5"/>
    <text x="400" y="50" text-anchor="middle" font-size="24" font-weight="bold" fill="#333">
        Neural Network Visualization
    </text>
    <text x="400" y="80" text-anchor="middle" font-size="16" fill="#666">
        Visualization ID: {visualizacion.id}
    </text>
    <text x="400" y="110" text-anchor="middle" font-size="14" fill="#888">
        Project ID: {visualizacion.proyecto_id}
    </text>
    <text x="400" y="300" text-anchor="middle" font-size="12" fill="#999">
        SVG Export - Layout configuration available in JSON format
    </text>
</svg>"""
    
    elif formato == FormatoExportacion.PNG:
        # For PNG, we'd need PIL/Pillow to generate an image
        # For now, return a placeholder message
        # In production, you'd generate an actual PNG image
        return b"PNG placeholder - implement with PIL/Pillow"
    
    elif formato == FormatoExportacion.PDF:
        # For PDF, we'd need reportlab or similar
        # For now, return a placeholder
        # In production, you'd generate an actual PDF
        return b"PDF placeholder - implement with reportlab"
    
    return ""

