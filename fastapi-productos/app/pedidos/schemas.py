from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import List, Optional
from datetime import datetime

ESTADOS_VALIDOS = {"PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO"}

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
        if not v:
            raise ValueError("El pedido debe tener al menos un detalle")
        vistos = set()
        for item in v:
            if item.producto_id in vistos:
                raise ValueError(f"El producto_id {item.producto_id} está duplicado en los detalles")
            vistos.add(item.producto_id)
            if item.cantidad < 1:
                raise ValueError(f"La cantidad para el producto {item.producto_id} debe ser mayor o igual a 1")
        return v

class PedidoUpdateEstado(BaseModel):
    estado: str

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v: str):
        v_upper = v.upper().strip()
        if v_upper not in ESTADOS_VALIDOS:
            raise ValueError(f"Estado inválido. Debe ser uno de: {', '.join(sorted(ESTADOS_VALIDOS))}")
        return v_upper

class PedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha: datetime
    estado: str
    total: float
    deleted_at: Optional[datetime] = None
    detalles: List[DetallePedidoRead] = []
