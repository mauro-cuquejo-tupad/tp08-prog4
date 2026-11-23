from fastapi import APIRouter, HTTPException, Path, Query, status, Depends
from typing import List
from app.pedidos.schemas import PedidoCreate, PedidoRead, PedidoReadFull, PedidoUpdateEstado
from app.pedidos.service import (
    PedidoService,
    ProductoNoEncontrado,
    PedidoNoEncontrado,
    PedidoEstadoInvalido
)
from app.pedidos.unit_of_work import PedidoUnitOfWork

from app.core.database import session_factory

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork(session_factory))

def pedido_no_encontrado() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

@router.get("", response_model=List[PedidoRead], status_code=status.HTTP_200_OK)
@router.get("/", response_model=List[PedidoRead], status_code=status.HTTP_200_OK, include_in_schema=False)
def listar_pedidos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=200),
    service: PedidoService = Depends(get_pedido_service)
):
    return service.listar(skip=skip, limit=limit)


@router.get("/{id}", response_model=PedidoReadFull, status_code=status.HTTP_200_OK)
def obtener_pedido(
    id: int = Path(..., gt=0),
    service: PedidoService = Depends(get_pedido_service)
):
    try:
        return service.obtener_por_id(id)
    except PedidoNoEncontrado:
        raise pedido_no_encontrado()


@router.post("", response_model=PedidoReadFull, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PedidoReadFull, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def crear_pedido(
    data: PedidoCreate,
    service: PedidoService = Depends(get_pedido_service)
):
    try:
        return service.crear(data)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{id}", response_model=PedidoReadFull, status_code=status.HTTP_200_OK)
def actualizar_estado_pedido(
    data: PedidoUpdateEstado,
    id: int = Path(..., gt=0),
    service: PedidoService = Depends(get_pedido_service)
):
    try:
        return service.actualizar_estado(id, data)
    except PedidoNoEncontrado:
        raise pedido_no_encontrado()
    except PedidoEstadoInvalido as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pedido(
    id: int = Path(..., gt=0),
    service: PedidoService = Depends(get_pedido_service)
):
    try:
        service.eliminar(id)
    except PedidoNoEncontrado:
        raise pedido_no_encontrado()
