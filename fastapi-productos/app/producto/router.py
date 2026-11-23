from fastapi import APIRouter, HTTPException, Path, Query, status, Depends
from typing import List
from sqlmodel import Session
from app.core.database import get_session
from . import schema, service

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.post("/", response_model=schema.ProductoRead, status_code=status.HTTP_201_CREATED)
def alta_producto(producto: schema.ProductoCreate, session: Session = Depends(get_session)):
    return service.crear(producto, session)


@router.get("/", response_model=List[schema.ProductoRead], status_code=status.HTTP_200_OK)
def listar_productos(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
    session: Session = Depends(get_session)
):
    return service.obtener_todos(skip, limit, session)


@router.get("/{id}", response_model=schema.ProductoRead, status_code=status.HTTP_200_OK)
def detalle_producto(id: int = Path(..., gt=0), session: Session = Depends(get_session)):
    return service.obtener_por_id(id, session)


@router.put("/{id}", response_model=schema.ProductoRead, status_code=status.HTTP_200_OK)
def actualizar_producto(
    producto: schema.ProductoCreate,
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.actualizar_total(id, producto, session)


@router.delete("/{id}",status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(id: int = Path(..., gt=0), session: Session = Depends(get_session)):
    service.eliminar(id, session)


@router.post("/{id}/categorias",response_model=schema.ProductoFullRead,status_code=status.HTTP_201_CREATED)
def asignar_categoria(
    id: int = Path(..., gt=0),
    body: schema.CategoriaIdBody = ...,
    session: Session = Depends(get_session)
):
    return service.agregar_categoria(id, body.categoria_id, session)


@router.get("/{id}/categorias",response_model=List[schema.CategoriaRead],status_code=status.HTTP_200_OK)
def listar_categorias_producto(
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.listar_categorias_de_producto(id, session)


@router.delete("/{id}/categorias/{categoria_id}",status_code=status.HTTP_204_NO_CONTENT)
def quitar_categoria(
    id: int = Path(..., gt=0),
    categoria_id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    service.quitar_categoria(id, categoria_id, session)


# Compatibilidad alternativa para /{producto_id}/categorias/{categoria_id} por si se envía por path
@router.post(
    "/{producto_id}/categorias/{categoria_id}",
    response_model=schema.ProductoFullRead,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def agregar_categoria_path(producto_id: int, categoria_id: int,
                           session: Session = Depends(get_session)):
    return service.agregar_categoria(producto_id, categoria_id, session)


