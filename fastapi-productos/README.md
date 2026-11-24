# Backend - Gestor Gastronómico (FastAPI + SQLModel + PostgreSQL)
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

API REST desarrollada con **FastAPI** y **SQLModel** para la gestión de Categorías, Productos, Ingredientes y Pedidos con sus detalles.

---

## 🏛️ Arquitectura

El módulo de **Pedidos** aplica el patrón **Models - Schemas - Repository - Unit of Work - Service - Router**:

- **Models:**
  - `Pedido`: `id`, `fecha` en formato UTC, `estado` (PENDIENTE, CONFIRMADO, ENTREGADO o CANCELADO), `total` calculado a partir de los detalles y `deleted_at` para borrado lógico.
  - `DetallePedido`: clave primaria compuesta por `pedido_id` y `producto_id`, `cantidad` y `precio_unitario` tomado del producto al momento de crear el pedido.
- **Schemas:**
  - `PedidoCreate`: valida que contenga al menos un detalle, cantidades válidas y rechaza productos duplicados con código 422.
  - `PedidoUpdateEstado`: valida estados permitidos mediante `Literal` respondiendo 422 si se envía un valor no reconocido.
  - `PedidoRead`: serialización para listados sin detalles.
  - `PedidoReadFull`: serialización completa con la lista de detalles para creación y consulta individual.
- **Repository:**
  - `PedidoRepository` y `DetallePedidoRepository`: extienden de `BaseRepository` y encapsulan las consultas sin confirmar transacciones.
- **Unit of Work:**
  - `PedidoUnitOfWork`: maneja la sesión mediante `session_factory` dentro de un context manager con bloque try/finally, asegurando atomicidad transaccional con commit al finalizar o rollback ante cualquier excepción.
- **Service:**
  - `PedidoService`: aplica las reglas de negocio dentro del Unit of Work. Si un producto no existe arroja excepción para revertir la transacción completa y traducirla a 404. El borrado es lógico completando `deleted_at`.
- **Router:**
  - `APIRouter(prefix="/pedidos", tags=["pedidos"])`: inyecta el servicio mediante `Depends` y traduce las excepciones de negocio a respuestas HTTP con códigos 404, 409 y 422.

Se incorporan también los módulos de **Categorías**, **Productos** e **Ingredientes** con validaciones de strings no vacíos y control de unicidad. Al eliminar un producto asociado a pedidos existentes se captura el error de base de datos respondiendo con código 409.

---

## 🚀 Instalación y Ejecución

1. **Crear y activar entorno virtual:**
   En Windows:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
   En Linux o macOS:
   ```bash
   source .venv/bin/activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar base de datos:**
   Revisar el archivo `.env`:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:mipasswordseguro@localhost:5432/gestor_productos
   RESET_DB_ON_STARTUP=false
   SEED_ON_STARTUP=true
   ```

4. **Iniciar el servidor:**
   ```bash
   python -m fastapi dev app/main.py
   ```
   - Swagger interactivo: http://localhost:8000/docs

---

## 🧪 Pruebas con REST Client

Los archivos `.http` contienen la suite de pruebas lista para ejecutar:
- `ingredientes.http`: pruebas completas de CRUD, validaciones 422, duplicados 409 y borrado.
- `pedidos.http`: pruebas de flujo dinámico tomando productos existentes, errores 422, rollback atómico 404, cambio de estado y borrado lógico.
- `productos.http`: pruebas de productos, categorías y relación muchos a muchos.
