# Trabajo Práctico 08 - Formularios y Tablas
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

---

## 📌 Descripción General

El proyecto integra un frontend desarrollado en **React + TypeScript + Vite + Tailwind CSS** con un backend en **FastAPI + SQLModel + PostgreSQL**.

- **Frontend:**
  - Implementa el CRUD completo de **Categorías**, **Productos** e **Ingredientes**.
  - Manejo del estado del servidor con **TanStack Query** mediante `useQuery` y `useMutation`.
  - Formularios fuertemente tipados con validación campo por campo usando **TanStack Form** con `useForm`, `form.Field` y `form.Subscribe`.
  - Tablas interactivas construidas con **TanStack Table v8** que incluyen ordenamiento por columnas, paginación y búsqueda en tiempo real.
  - Modales controlados con `useState` para alta y edición de entidades.
  - Modales personalizados para confirmar eliminaciones y mostrar avisos de error, reemplazando las ventanas nativas del navegador.
  - Hook personalizado `useEscapeKey` para cerrar los modales al presionar la tecla Escape.
  - Navegación declarativa en SPA con **React Router** para `/categorias`, `/productos` e `/ingredientes`.
  - Layout general con barra de navegación superior y `Footer` fijo al pie.

- **Backend:**
  - Arquitectura modular desacoplada: **Models - Schemas - Repository - Unit of Work - Service - Router**.
  - Módulo de **Pedidos y DetallePedido** implementado según el apunte teórico de la Actividad 1, con transacciones atómicas mediante `session_factory` y Unit of Work. Creación en una sola transacción, rollback automático ante fallo o producto inexistente y borrado lógico con `deleted_at`.
  - Inyección de dependencias en los routers mediante `Depends`.
  - Módulos de **Categorías**, **Productos** e **Ingredientes** con validación Pydantic, nombres no vacíos con `StringConstraints`, códigos HTTP 200, 201, 204, 404, 409, 422 y soporte CORS para `http://localhost:5173`.
  - Captura de errores de clave foránea con código 409 si se intenta eliminar un producto en uso.
  - Suite de pruebas completa documentada en archivos `.http` para **REST Client**.
  - Script `seed.py` para precarga de datos de prueba, integrado también al inicio de la aplicación mediante el `lifespan` de FastAPI.
  - Flags de configuración en `.env` para reiniciar tablas al iniciar la aplicación y para habilitar o deshabilitar la carga de datos iniciales.

---

## 🗂️ Estructura del Repositorio

```text
tp08-prog4-main/
├── fastapi-productos/             # Backend FastAPI + SQLModel + PostgreSQL
│   ├── app/
│   │   ├── core/                  # BaseRepository, UnitOfWork, session_factory, database
│   │   │   ├── database.py
│   │   │   ├── repository.py      # Repositorio genérico CRUD
│   │   │   └── unit_of_work.py    # Unit of Work base con context manager
│   │   ├── categoria/             # CRUD Categorías
│   │   │   ├── model.py
│   │   │   ├── schema.py
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   └── router.py
│   │   ├── producto/              # CRUD Productos y relación con Categorías
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
│   │   │   ├── models.py          # Pedido y DetallePedido
│   │   │   ├── schemas.py         # PedidoCreate, PedidoRead, PedidoReadFull, PedidoUpdateEstado
│   │   │   ├── repository.py      # PedidoRepository, DetallePedidoRepository
│   │   │   ├── unit_of_work.py    # PedidoUnitOfWork con pedidos, detalles y productos
│   │   │   ├── service.py         # PedidoService con transacción atómica
│   │   │   └── router.py          # APIRouter /pedidos con Depends
│   │   └── main.py                # Instancia FastAPI, CORS, lifespan y routers
│   ├── ingredientes.http          # Pruebas de Ingredientes con REST Client
│   ├── pedidos.http               # Pruebas de Pedidos con REST Client
│   ├── productos.http             # Pruebas de Productos y Categorías con REST Client
│   ├── requirements.txt           # Dependencias backend
│   ├── seed.py                    # Script de precarga de datos de prueba
│   ├── .env                       # Variables de entorno incluidas para evaluación
│   └── README.md
│
├── tp-categorias/                 # Frontend React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/            # Modales, listas con TanStack Table, FeedbackModals, Navbar, Footer
│   │   ├── hooks/                 # Hook useEscapeKey para modales
│   │   ├── pages/
│   │   │   ├── CategoriasPage.tsx # CRUD Categorías con TanStack Query, Table y Form
│   │   │   ├── ProductsPage.tsx   # CRUD Productos con TanStack Query, Table y Form
│   │   │   └── IngredientesPage.tsx # CRUD Ingredientes con TanStack Query, Table y Form
│   │   ├── services/              # Llamadas a la API vía fetch
│   │   ├── types/                 # Interfaces TypeScript
│   │   ├── App.tsx                # Rutas y layout principal con Navbar y Footer
│   │   └── main.tsx               # QueryClientProvider y BrowserRouter
│   ├── .npmrc                     # Configuración de compatibilidad para node_modules plano
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── docker-compose.yml             # Servicio PostgreSQL
├── ingredientes.http              # Pruebas de Ingredientes en raíz
├── pedidos.http                   # Pruebas de Pedidos en raíz
└── README.md
```

---

## 🚀 Puesta en Marcha

### 1. Base de Datos
Iniciar el contenedor de PostgreSQL con Docker:
```bash
docker compose up -d
```
O configurar una base existente en el archivo `fastapi-productos/.env`:
```env
DATABASE_URL=postgresql+psycopg://postgres:mipasswordseguro@localhost:5432/gestor_productos
RESET_DB_ON_STARTUP=false
SEED_ON_STARTUP=true
```

### 2. Backend
1. Entrar a la carpeta `fastapi-productos`:
   ```bash
   cd fastapi-productos
   ```
2. Crear y activar el entorno virtual:
   En Windows:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
   En Linux o macOS:
   ```bash
   source .venv/bin/activate
   ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Levantar el servidor:
   ```bash
   python -m fastapi dev app/main.py
   ```
   - Documentación Swagger interactiva: http://localhost:8000/docs
   - Pruebas HTTP: abrir `ingredientes.http`, `pedidos.http` o `productos.http` con REST Client.

### 3. Frontend
1. Entrar a la carpeta `tp-categorias`:
   ```bash
   cd tp-categorias
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el entorno de desarrollo:
   ```bash
   npm run dev
   ```
   - Aplicación disponible en http://localhost:5173.
4. Para verificar la compilación y el tipado:
   ```bash
   npx tsc -b
   npm run build
   ```
