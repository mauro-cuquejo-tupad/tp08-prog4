from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import create_db_and_tables
import app.producto.model  # Registra las tablas en SQLModel.metadata
import app.categoria.model
import app.ingrediente.model
import app.pedidos.models
from app.producto.router import router as producto_router
from app.categoria.router import router as categoria_router
from app.ingrediente.router import router as ingrediente_router
from app.pedidos.router import router as pedidos_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

def create_app() -> FastAPI:
    app = FastAPI(
        title="Gestor de Productos, Categorías, Ingredientes y Pedidos",
        version="1.0.0",
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=['http://localhost:5173'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    app.include_router(categoria_router)
    app.include_router(producto_router)
    app.include_router(ingrediente_router)
    app.include_router(pedidos_router)

    return app

app = create_app()
