from sqlmodel import Session, select
from app.producto.model import Producto
from app.categoria.model import Categoria


def get_by_id(id: int, session: Session) -> Producto | None:
    return session.get(Producto, id)


def get_all(skip: int, limit: int, session: Session) -> list[Producto]:
    statement = select(Producto).offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_by_nombre(nombre: str, session: Session) -> Producto | None:
    statement = select(Producto).where(Producto.nombre == nombre)
    return session.exec(statement).first()


def save_producto(producto: Producto, session: Session) -> Producto:
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def delete_producto(producto: Producto, session: Session) -> None:
    session.delete(producto)
    session.commit()

def add_categoria_to_producto(producto: Producto, categoria: Categoria, session: Session) -> Producto:
    producto.categorias.append(categoria)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto
    
def remove_categoria_from_producto(producto: Producto, categoria: Categoria, session: Session) -> Producto:
    producto.categorias.remove(categoria)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

