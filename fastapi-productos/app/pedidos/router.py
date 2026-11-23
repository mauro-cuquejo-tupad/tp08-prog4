from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import List
from app.pedidos.schemas import PedidoCreate, PedidoRead, PedidoUpdateEstado
from app.pedidos.service import (
    PedidoService,
    ProductoNoEncontrado,
    PedidoNoEncontrado,
    PedidoEstadoInvalido
)

router = APIRouter(prefix="/pedidos", tags=["pedidos"])
service = PedidoService()

@router.get("", response_model=List[PedidoRead], status_code=status.HTTP_200_OK)
@router.get("/", response_model=List[PedidoRead], status_code=status.HTTP_200_OK, include_in_schema=False)
def listar_pedidos(skip: int = Query(0, ge=0), limit: int = Query(100, le=200)):
    return service.listar(skip=skip, limit=limit)


@router.get("/{id}", response_model=PedidoRead, status_code=status.HTTP_200_OK)
def obtener_pedido(id: int = Path(..., gt=0)):
    try:
        return service.obtener_por_id(id)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PedidoRead, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def crear_pedido(data: PedidoCreate):
    try:
        return service.crear(data)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{id}", response_model=PedidoRead, status_code=status.HTTP_200_OK)
def actualizar_estado_pedido(data: PedidoUpdateEstado, id: int = Path(..., gt=0)):
    try:
        return service.actualizar_estado(id, data)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PedidoEstadoInvalido as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pedido(id: int = Path(..., gt=0)):
    try:
        service.eliminar(id)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
