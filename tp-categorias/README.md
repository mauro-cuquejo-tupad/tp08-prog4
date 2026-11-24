# Frontend - Gestor Gastronómico (React + TypeScript + Vite)
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

Frontend SPA interactivo construido con React, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Form y TanStack Table v8.

---

## 📦 Características Principales

1. **Páginas y Navegación:**
   - Rutas `/` y `/categorias`: `CategoriasPage` para administración de categorías.
   - Ruta `/productos`: `ProductsPage` para administración de productos.
   - Ruta `/ingredientes`: `IngredientesPage` para administración de ingredientes.
   - Barra de navegación superior con enlaces de React Router y `Footer` fijo al pie en el layout de `App.tsx`.

2. **TanStack Table v8:**
   - Tablas interactivas en cada página con ordenamiento por columnas, paginación con controles anterior y siguiente, y filtro de búsqueda en tiempo real.
   - Componentes modulares para estados de carga, vacío y error de red con Tailwind CSS.

3. **TanStack Form y Modales:**
   - Modales de creación y edición controlados con `useState`.
   - Validación tipada por campo y botón de guardado deshabilitado mientras el formulario es inválido o se está enviando.
   - Modales de confirmación para eliminaciones y alertas para mensajes de error del servidor.
   - Hook personalizado `useEscapeKey` para cerrar cualquier modal con la tecla Escape o con el botón cancelar.

---

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación correrá en http://localhost:5173.

3. **Comprobar tipado y build:**
   ```bash
   npx tsc -b
   npm run build
   ```
