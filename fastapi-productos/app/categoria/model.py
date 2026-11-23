
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from app.producto.model import ProductoCategoria

class Categoria(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)

    nombre: str 
    descripcion: str
    
    productos: List["Producto"] = Relationship(back_populates= "categorias", link_model=ProductoCategoria)