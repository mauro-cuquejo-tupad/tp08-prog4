# Trabajo Práctico 08 - Full Stack: CRUD Categorías, Productos e Ingredientes (Frontend) y Pedidos (Backend)
**Materia:** Programación IV - UTN  
**Revisor de la unidad:** Prof. Franco González  
**Alumno:** Mauro Cuquejo  

---

## 📌 Descripción General

El proyecto integra un frontend desarrollado en **React + TypeScript + Vite + Tailwind CSS** con un backend en **FastAPI + SQLModel + PostgreSQL**.

- **Frontend:**
  - Implementa el CRUD completo de **Categorías**, **Productos** e **Ingredientes**.
  - Servido mediante **TanStack Query** (fetching, cache y sincronización con `useQuery` y `useMutation`).
  - Formularios fuertemente tipados con validación campo por campo mediante **TanStack Form** (`useForm`, `form.Field`, `form.Subscribe`).
  - Tablas dinámicas e interactivas construidas con **TanStack Table v8** (ordenamiento por columnas, paginación con botones anterior/siguiente y filtrado/búsqueda).
  - Modales controlados con `useState` para alta y edición de entidades.
  - Navegación declarativa en SPA con **React Router** (`/categorias`, `/productos`, `/ingredientes`).

- **Backend:**
  - Arquitectura modular desacoplada: **Models - Schemas - Repository - Unit of Work (UoW) - Service - Router**.
  - Módulo de **Pedidos y DetallePedido**: transacciones atómicas con Unit of Work (creación en una sola transacción, rollback automático ante fallo o producto inexistente, borrado lógico con `deleted_at`).
  - Módulos de **Categorías**, **Productos** e **Ingredientes** con validación Pydantic, constraints (`StringConstraints(strip_whitespace=True, min_length=1)`), códigos HTTP precisos (200, 201, 204, 404, 409, 422) y soporte CORS para `http://localhost:5173`.
  - Demostración de endpoints documentada mediante archivos `.http` para **REST Client**.
  - Script para carga inicial de datos `seed.py`.

---

## 🗂️ Estructura del Repositorio

```text
tp08-prog4-main/
├── fastapi-productos/             # Backend FastAPI + SQLModel + PostgreSQL
│   ├── app/
│   │   ├── core/                  # BaseRepository, AbstractUnitOfWork, database
│   │   │   ├── database.py
│   │   │   ├── repository.py      # Repositorio genérico CRUD
│   │   │   └── unit_of_work.py    # Unit of Work base con context manager
│   │   ├── categoria/             # CRUD Categorías
│   │   │   ├── model.py
│   │   │   ├── schema.py
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   └── router.py
│   │   ├── producto/              # CRUD Productos y ProductoCategoria
│   │   │   ├── model.py
│   │   │   ├── schema.py
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   └── router.py
│   │   ├── ingrediente/           # CRUD Ingredientes
│   │   │   ├── model.py
│   │   │   ├── schema.py
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   └── router.py
│   │   ├── pedidos/               # Arquitectura Models-Schemas-Repository-UoW-Service-Router
│   │   │   ├── models.py          # Pedido y DetallePedido (PK compuesta)
│   │   │   ├── schemas.py         # PedidoCreate, PedidoRead, PedidoUpdateEstado
│   │   │   ├── repository.py      # PedidoRepository, DetallePedidoRepository
│   │   │   ├── unit_of_work.py    # PedidoUnitOfWork (pedidos, detalles, productos)
│   │   │   ├── service.py         # PedidoService (transacción atómica en UoW)
│   │   │   └── router.py          # APIRouter /pedidos (mapeo a 404, 422, 409)
│   │   └── main.py                # Instancia FastAPI, CORS y registro de routers
│   ├── pedidos.http               # Demostración exhaustiva de Pedidos con REST Client
│   ├── productos.http             # Demostración de Productos y Categorías
│   ├── requirements.txt           # Dependencias backend
│   ├── seed.py                    # Script de precarga de datos de prueba
│   ├── .env                       # Variables de entorno
│   └── README.md
│
├── tp-categorias/                 # Frontend React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/            # CategoriaList, CategoriaModal, ProductoList, ProductoModal,
│   │   │                          # IngredienteList, IngredienteModal, StatusStates, Navbar
│   │   ├── pages/
│   │   │   ├── CategoriasPage.tsx # CRUD Categorías con TanStack Query, Table v8 y Form
│   │   │   ├── ProductsPage.tsx   # CRUD Productos con TanStack Query, Table v8 y Form
│   │   │   └── IngredientesPage.tsx # CRUD Ingredientes con TanStack Query, Table v8 y Form
│   │   ├── services/              # Acceso a API vía fetch (categoria, producto, ingrediente)
│   │   ├── types/                 # Interfaces TypeScript de entidades y formularios
│   │   ├── App.tsx                # Rutas con React Router y renderizado de Navbar
│   │   └── main.tsx               # QueryClientProvider y BrowserRouter
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── docker-compose.yml             # Contenedor de PostgreSQL listo para usar
├── pedidos.http                   # Archivo REST Client en raíz
└── README.md
```

---

## 🚀 Puesta en Marcha

### 1. Base de Datos (PostgreSQL)
Podés iniciar el contenedor Docker provisto en la raíz:
```bash
docker compose up -d
```
O configurar una base existente en `fastapi-productos/.env`:
```env
DATABASE_URL=postgresql+psycopg://postgres:mipasswordseguro@localhost:5432/gestor_productos
```

### 2. Backend (FastAPI)
1. Ingresar a `fastapi-productos`:
   ```bash
   cd fastapi-productos
   ```
2. Crear y activar el entorno virtual:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate       # En Windows
   # source .venv/bin/activate     # En Linux / macOS
   ```
3. Instalar requerimientos:
   ```bash
   pip install -r requirements.txt
   ```
4. (Opcional) Cargar datos de prueba:
   ```bash
   python seed.py
   ```
5. Iniciar la aplicación backend:
   ```bash
   python -m fastapi dev app/main.py
   ```
   - Swagger / OpenAPI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Archivo de pruebas HTTP: abrir `pedidos.http` o `fastapi-productos/pedidos.http` con REST Client.

### 3. Frontend (React + TypeScript)
1. Ingresar a `tp-categorias`:
   ```bash
   cd tp-categorias
   ```
2. Instalar dependencias con `pnpm`:
   ```bash
   pnpm install
   ```
3. Ejecutar servidor de desarrollo:
   ```bash
   pnpm dev
   ```
   - Aplicación disponible en [http://localhost:5173](http://localhost:5173).
4. Verificación de compilación y tipado:
   ```bash
   npx tsc --noEmit
   pnpm build
   ```
