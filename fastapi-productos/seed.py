from sqlmodel import Session, select
from app.core.database import engine, create_db_and_tables
from app.categoria.model import Categoria
from app.producto.model import Producto, ProductoCategoria
from app.ingrediente.model import Ingrediente

def seed_data():
    create_db_and_tables()
    with Session(engine) as session:
        # Categorías
        if not session.exec(select(Categoria)).first():
            cat1 = Categoria(nombre="Pizzas", descripcion="Pizzas artesanales al horno de barro")
            cat2 = Categoria(nombre="Hamburguesas", descripcion="Hamburguesas caseras premium")
            cat3 = Categoria(nombre="Bebidas", descripcion="Gaseosas, jugos y cervezas")
            session.add_all([cat1, cat2, cat3])
            session.commit()
            session.refresh(cat1)
            session.refresh(cat2)
            session.refresh(cat3)
            print("Categorías creadas.")
        else:
            cat1 = session.exec(select(Categoria)).first()

        # Ingredientes
        if not session.exec(select(Ingrediente)).first():
            ing1 = Ingrediente(nombre="Queso Mozzarella")
            ing2 = Ingrediente(nombre="Salsa de Tomate")
            ing3 = Ingrediente(nombre="Carne Vacuna")
            ing4 = Ingrediente(nombre="Pan de Papa")
            session.add_all([ing1, ing2, ing3, ing4])
            session.commit()
            print("Ingredientes creados.")

        # Productos
        if not session.exec(select(Producto)).first():
            prod1 = Producto(
                nombre="Pizza Muzzarella",
                descripcion="Muzzarella clásica con orégano y aceitunas",
                precio_base=8500.0,
                disponible=True,
                imagenes_url=["https://images.unsplash.com/photo-1513104890138-7c749659a591"]
            )
            prod2 = Producto(
                nombre="Hamburguesa Doble Cheddar",
                descripcion="Doble carne, doble cheddar y bacon crocante",
                precio_base=9200.0,
                disponible=True,
                imagenes_url=["https://images.unsplash.com/photo-1568901346375-23c9450c58cd"]
            )
            session.add_all([prod1, prod2])
            session.commit()
            print("Productos creados.")

if __name__ == "__main__":
    seed_data()
    print("Seed completado exitosamente.")
