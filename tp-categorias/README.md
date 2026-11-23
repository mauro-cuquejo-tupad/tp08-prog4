# Frontend - Gestor Gastronómico (React + TypeScript + Vite)
**Materia:** Programación IV - UTN  
**Unidad 8:** Formularios y Tablas  
**Alumno:** Mauro Cuquejo  

Frontend SPA interactivo construido con React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Form y TanStack Table v8.

---

## 📦 Características Principales

1. **Páginas y Navegación:**
   - `/` y `/categorias`: `CategoriasPage` para administración completa de categorías.
   - `/productos`: `ProductsPage` para gestión completa de productos.
   - `/ingredientes`: `IngredientesPage` para gestión de ingredientes.
   - Enlaces accesibles desde `Navbar.tsx` con `react-router-dom`.
   - `App.tsx` centrado únicamente en definir rutas y montar layout.

2. **TanStack Table (v8):**
   - Implementado en cada listado (`CategoriaList`, `ProductoList`, `IngredienteList`).
   - Soporte de ordenamiento por columnas con `getSortedRowModel`.
   - Paginación dinámica con `getPaginationRowModel` y controles Anterior / Siguiente.
   - Búsqueda en tiempo real con `getFilteredRowModel`.
   - Componentes modulares y reutilizables para estados de **carga** (`LoadingState`), **vacío** (`EmptyState`) y **error de red** (`ErrorState`) con Tailwind CSS.

3. **TanStack Form:**
   - Formularios modales de creación y edición (`CategoriaModal`, `ProductoModal`, `IngredienteModal`).
   - Validación tipada por campo (`form.Field` con `validators`).
   - Botón de guardado reactivo con `form.Subscribe` para deshabilitar mientras es inválido o se está enviando (`canSubmit`, `isSubmitting`).
   - Mensajes de error de API integrados sin cerrar el modal ante respuestas 409 o 422.

---

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Ejecutar servidor local:**
   ```bash
   pnpm dev
   ```
   La aplicación correrá en [http://localhost:5173](http://localhost:5173).

3. **Comprobar tipado y build:**
   ```bash
   npx tsc --noEmit
   pnpm build
   ```
