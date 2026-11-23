from typing import Optional, List
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.pedidos.models import Pedido, DetallePedido

class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def get_by_id_activo(self, id: int) -> Optional[Pedido]:
        statement = select(Pedido).where(Pedido.id == id, Pedido.deleted_at == None)
        return self.session.exec(statement).first()

    def get_all_activos(self, skip: int = 0, limit: int = 100) -> List[Pedido]:
        statement = select(Pedido).where(Pedido.deleted_at == None).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())


class DetallePedidoRepository(BaseRepository[DetallePedido]):
    def __init__(self, session: Session):
        super().__init__(session, DetallePedido)

    def get_by_pedido_id(self, pedido_id: int) -> List[DetallePedido]:
        statement = select(DetallePedido).where(DetallePedido.pedido_id == pedido_id)
        return list(self.session.exec(statement).all())
