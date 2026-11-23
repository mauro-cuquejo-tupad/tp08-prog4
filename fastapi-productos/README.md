# Backend - Gestor Gastronómico (FastAPI + SQLModel + PostgreSQL)
**Materia:** Programación IV - UTN  
**Unidad 8:** Formularios y Tablas / Unit of Work y Repository  
**Alumno:** Mauro Cuquejo  

API REST desarrollada con **FastAPI** y **SQLModel** para la gestión de Categorías, Productos, Ingredientes y Pedidos con sus detalles.

---

## 🏛️ Arquitectura

El módulo de **Pedidos** aplica de forma rigurosa el patrón **Models - Schemas - Repository - Unit of Work (UoW) - Service - Router**:

- **Models:**
  - `Pedido`: `id` (autoincremental), `fecha` (datetime asignada por el backend), `estado` (PENDIENTE, CONFIRMADO, ENTREGADO o CANCELADO), `total` (suma calculada de detalles) y `deleted_at` (soporte de borrado lógico).
  - `DetallePedido`: clave primaria compuesta (`pedido_id`, `producto_id`), `cantidad` (>= 1) y `precio_unitario` (obtenido del `precio_base` del producto al crearse).
- **Schemas:**
  - `PedidoCreate`: valida que contenga al menos un detalle (`min_length=1`), cantidades >= 1 y rechaza productos repetidos retornando **HTTP 422**.
  - `PedidoUpdateEstado`: valida estados permitidos retornando **HTTP 422** si se envía un valor no reconocido.
  - `PedidoRead` y `DetallePedidoRead`: serialización tipada para respuestas.
- **Repository:**
  - `PedidoRepository` y `DetallePedidoRepository`: extienden de `BaseRepository[T]`, manejan queries sin invocar `commit()`.
- **Unit of Work:**
  - `PedidoUnitOfWork`: maneja la sesión con context manager (`with uow:`), garantizando atomicidad transaccional: commit automático al completar el bloque o rollback ante cualquier excepción.
- **Service:**
  - `PedidoService`: aplica lógica de negocio. Si un producto en los detalles no existe, arroja `ProductoNoEncontrado`, revirtiendo completamente la transacción. El borrado es lógico completando `deleted_at`.
- **Router:**
  - `APIRouter(prefix="/pedidos", tags=["pedidos"])`: captura excepciones del servicio y las transforma en respuestas HTTP pertinentes (**404**, **422**, **409**).

Asimismo, se incorporan los módulos de **Categorías**, **Productos** e **Ingredientes** (con validaciones de no vacío `StringConstraints(strip_whitespace=True, min_length=1)` y control de unicidad).

---

## 🚀 Instalación y Ejecución

1. **Crear y activar entorno virtual:**
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate       # Windows
   # source .venv/bin/activate     # Linux / macOS
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar base de datos:**
   Asegurar las credenciales en el archivo `.env`:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:mipasswordseguro@localhost:5432/gestor_productos
   ```

4. **Poblar datos de prueba (Seed):**
   ```bash
   python seed.py
   ```

5. **Iniciar el servidor:**
   ```bash
   python -m fastapi dev app/main.py
   ```
   - Documentación Swagger interactiva: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Pruebas con REST Client

El archivo `pedidos.http` contiene la suite de pruebas lista para ejecutar con la extensión REST Client:
- `GET /pedidos`: listado de pedidos activos.
- `POST /pedidos` con casos de validación **422** (lista vacía, cantidad < 1, producto duplicado).
- `POST /pedidos` con caso **404** (producto inexistente demostrando rollback atómico).
- `POST /pedidos` con caso exitoso **201**.
- `GET /pedidos/{id}`: detalle del pedido creado.
- `PUT /pedidos/{id}`: actualización de estado y caso **422** con estado inválido.
- `DELETE /pedidos/{id}`: borrado lógico (204).
- `GET /pedidos/{id}` posterior: comprobación de respuesta **404**.
