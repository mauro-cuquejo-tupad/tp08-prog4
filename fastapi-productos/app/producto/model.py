from sqlmodel import Relationship
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import String, Column as SaColumn

class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"
    producto_id: int = Field(sa_column=Column(Integer, ForeignKey("producto.id", ondelete="CASCADE"), primary_key=True, nullable=False))
    categoria_id: int = Field(sa_column=Column(Integer, ForeignKey("categoria.id", ondelete="CASCADE"), primary_key=True, nullable=False))

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    nombre: str
    descripcion: str
    precio_base: float = Field(ge=0)
    imagenes_url: list[str] = Field(default_factory=list, sa_column=SaColumn(ARRAY(String)))
    disponible: bool = True

    categorias: List["Categoria"] = Relationship(back_populates="productos", link_model=ProductoCategoria)


    