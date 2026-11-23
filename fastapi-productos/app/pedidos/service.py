from datetime import datetime
from typing import List, Optional
from app.pedidos.models import Pedido, DetallePedido
from app.pedidos.schemas import PedidoCreate, PedidoRead, PedidoUpdateEstado
from app.pedidos.unit_of_work import PedidoUnitOfWork

class ProductoNoEncontrado(Exception):
    def __init__(self, producto_id: int):
        self.producto_id = producto_id
        super().__init__(f"Producto con id {producto_id} no encontrado")

class PedidoNoEncontrado(Exception):
    def __init__(self, pedido_id: int):
        self.pedido_id = pedido_id
        super().__init__(f"Pedido con id {pedido_id} no encontrado")

class PedidoEstadoInvalido(Exception):
    def __init__(self, mensaje: str):
        super().__init__(mensaje)

class PedidoService:
    def __init__(self, uow: Optional[PedidoUnitOfWork] = None):
        self.uow = uow or PedidoUnitOfWork()

    def listar(self, skip: int = 0, limit: int = 100) -> List[PedidoRead]:
        with self.uow as uow:
            pedidos = uow.pedidos.get_all_activos(skip=skip, limit=limit)
            resultado = []
            for p in pedidos:
                detalles = uow.detalles.get_by_pedido_id(p.id)
                p.detalles = detalles
                resultado.append(PedidoRead.model_validate(p))
            return resultado

    def obtener_por_id(self, pedido_id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_activo(pedido_id)
            if not pedido:
                raise PedidoNoEncontrado(pedido_id)
            pedido.detalles = uow.detalles.get_by_pedido_id(pedido.id)
            return PedidoRead.model_validate(pedido)

    def crear(self, data: PedidoCreate) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.create(Pedido(estado="PENDIENTE", total=0.0))
            total = 0.0
            detalles_creados = []
            for item in data.detalles:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None:
                    raise ProductoNoEncontrado(item.producto_id)
                detalle = uow.detalles.create(DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    precio_unitario=producto.precio_base,
                ))
                detalles_creados.append(detalle)
                total += item.cantidad * producto.precio_base

            pedido.total = total
            pedido.detalles = detalles_creados
            return PedidoRead.model_validate(pedido)

    def actualizar_estado(self, pedido_id: int, data: PedidoUpdateEstado) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_activo(pedido_id)
            if not pedido:
                raise PedidoNoEncontrado(pedido_id)

            # Regla de negocio opcional / recomendada: No cambiar si ya está ENTREGADO o CANCELADO
            if pedido.estado in {"ENTREGADO", "CANCELADO"} and pedido.estado != data.estado:
                raise PedidoEstadoInvalido(f"No se puede cambiar el estado de un pedido en estado terminal {pedido.estado}")

            pedido.estado = data.estado
            uow.pedidos.update(pedido)
            pedido.detalles = uow.detalles.get_by_pedido_id(pedido.id)
            return PedidoRead.model_validate(pedido)

    def eliminar(self, pedido_id: int) -> None:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_activo(pedido_id)
            if not pedido:
                raise PedidoNoEncontrado(pedido_id)

            # Borrado lógico: completamos deleted_at
            pedido.deleted_at = datetime.utcnow()
            uow.pedidos.update(pedido)
