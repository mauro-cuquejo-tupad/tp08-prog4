from app.core.unit_of_work import AbstractUnitOfWork
from app.core.database import session_factory
from app.pedidos.repository import PedidoRepository, DetallePedidoRepository
from app.core.repository import BaseRepository
from app.producto.model import Producto

class ProductoRepositoryAdapter(BaseRepository[Producto]):
    def __init__(self, session):
        super().__init__(session, Producto)

class PedidoUnitOfWork(AbstractUnitOfWork):
    def __init__(self, factory=session_factory):
        super().__init__(factory)

    def __enter__(self):
        super().__enter__()
        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoRepositoryAdapter(self.session)
        return self
