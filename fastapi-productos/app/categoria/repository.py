from sqlmodel import Session, select
from app.categoria.model import Categoria


def get_by_id(id: int, session: Session) -> Categoria | None:
    return session.get(Categoria, id)

def get_all(skip: int, limit: int, session: Session) -> list[Categoria]:
    statement = select(Categoria).offset(skip).limit(limit)
    return list(session.exec(statement).all())

def get_by_nombre(nombre: str, session: Session) -> Categoria | None:
    statement = select(Categoria).where(Categoria.nombre == nombre)
    return session.exec(statement).first()

def save_categoria(categoria: Categoria, session: Session) -> Categoria:
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

def delete_categoria(categoria: Categoria, session: Session) -> None:
    session.delete(categoria)
    session.commit()