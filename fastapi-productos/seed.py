import os
from sqlmodel import Session, select
from app.core.database import engine, create_db_and_tables
from app.categoria.model import Categoria
from app.producto.model import Producto
from app.ingrediente.model import Ingrediente

def seed_data():
    """
    Carga datos iniciales de prueba únicamente si las tablas correspondientes están vacías.
    Usa nombres diferenciados para no colisionar con peticiones fijas de los archivos .http.
    """
    with Session(engine) as session:
        # 1. Categorías: solo si no hay ninguna cargada
        if not session.exec(select(Categoria)).first():
            cat1 = Categoria(nombre="Entradas y Tapeos", descripcion="Picadas, papas y appetizers")
            cat2 = Categoria(nombre="Sandwiches & Burgers", descripcion="Variedades artesanales al pan")
            cat3 = Categoria(nombre="Bebidas y Tragos", descripcion="Gaseosas, cervezas y coctelería")
            session.add_all([cat1, cat2, cat3])
            session.commit()
            print("🌱 [SEED] Categorías de prueba creadas.")

        # 2. Ingredientes: solo si no hay ninguno cargado
        if not session.exec(select(Ingrediente)).first():
            ing1 = Ingrediente(nombre="Queso Cheddar Fundido")
            ing2 = Ingrediente(nombre="Panceta Ahumada Crispy")
            ing3 = Ingrediente(nombre="Cebolla Caramelizada")
            ing4 = Ingrediente(nombre="Salsa BBQ Casera")
            session.add_all([ing1, ing2, ing3, ing4])
            session.commit()
            print("🌱 [SEED] Ingredientes de prueba creados.")

        # 3. Productos: solo si no hay ninguno cargado
        if not session.exec(select(Producto)).first():
            prod1 = Producto(
                nombre="Papas Rústicas Cheddar y Bacon",
                descripcion="Papas naturales cortadas a mano con salsa cheddar y lluvia de bacon crocante",
                precio_base=6800.0,
                disponible=True,
                imagenes_url=["https://images.unsplash.com/photo-1573080496219-bb080dd4f877"]
            )
            prod2 = Producto(
                nombre="Burger Monumental Triple",
                descripcion="Triple medallón vacuno de 120g, triple cheddar y cebolla caramelizada",
                precio_base=10500.0,
                disponible=True,
                imagenes_url=["https://images.unsplash.com/photo-1568901346375-23c9450c58cd"]
            )
            session.add_all([prod1, prod2])
            session.commit()
            print("🌱 [SEED] Productos de prueba creados.")

if __name__ == "__main__":
    create_db_and_tables()
    seed_data()
    print("Seed completado exitosamente.")
