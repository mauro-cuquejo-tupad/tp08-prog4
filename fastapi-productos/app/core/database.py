from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    echo=True,  # SQL visible en consola (obligatorio en dev)
)

def create_db_and_tables():
    reset_db = os.getenv("RESET_DB_ON_STARTUP", "false").lower() in ("true", "1", "yes")
    if reset_db:
        print("⚠️ [RESET_DB_ON_STARTUP] Reiniciando tablas de la base de datos (drop_all)...")
        SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    
def get_session():
    # Cada request obtiene su propia sesión
    # No se comparte estado entre requests
    with Session(engine) as session:
        # El endpoint usa esta sesión para leer/escribir en la base
        yield session
        # Al terminar el request:
        # - se cierra la sesión
        # - se devuelve la conexión al pool