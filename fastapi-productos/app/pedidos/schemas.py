from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import List, Optional, Literal
from datetime import datetime

EstadoPedido = Literal["PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO"]

class DetallePedidoItem(BaseModel):
    producto_id: int = Field(..., gt=0)
    cantidad: int = Field(..., ge=1)

class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: float

class PedidoCreate(BaseModel):
    detalles: List[DetallePedidoItem] = Field(..., min_length=1)

    @field_validator("detalles")
    @classmethod
    def validar_detalles(cls, v: List[DetallePedidoItem]):
        ids = [item.producto_id for item in v]
        if len(ids) != len(set(ids)):
            raise ValueError("No se permiten productos duplicados en los detalles del pedido")
        return v

class PedidoUpdateEstado(BaseModel):
    estado: EstadoPedido

class PedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha: datetime
    estado: str
    total: float
    deleted_at: Optional[datetime] = None

class PedidoReadFull(PedidoRead):
    detalles: List[DetallePedidoRead] = []
