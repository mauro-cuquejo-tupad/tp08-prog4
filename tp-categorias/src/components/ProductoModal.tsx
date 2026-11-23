import React from "react";
import { useForm } from "@tanstack/react-form";
import type { Producto, ProductoFormData } from "../types/producto";
import { useEscapeKey } from "../hooks/useEscapeKey";

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductoFormData) => void;
  productoSeleccionado: Producto | null;
  isLoading?: boolean;
  apiError?: string | null;
}

export const ProductoModal: React.FC<ProductoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productoSeleccionado,
  isLoading = false,
  apiError = null,
}) => {
  useEscapeKey(onClose, isOpen && !isLoading);

  const form = useForm({
    defaultValues: {
      nombre: productoSeleccionado?.nombre ?? "",
      descripcion: productoSeleccionado?.descripcion ?? "",
      precio_base: productoSeleccionado ? String(productoSeleccionado.precio_base) : "0",
      disponible: productoSeleccionado?.disponible ?? true,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        precio_base: parseFloat(value.precio_base) || 0,
        disponible: Boolean(value.disponible),
        imagenes_url: productoSeleccionado?.imagenes_url ?? [],
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {productoSeleccionado ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        {apiError && (
          <div className="mb-4 rounded-md bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
            {apiError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                !value || !value.trim() ? "El nombre del producto es obligatorio" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label htmlFor="prod-nombre" className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre del producto *
                </label>
                <input
                  id="prod-nombre"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. Pizza Napolitana..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                {field.state.meta.errors ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="descripcion"
            validators={{
              onChange: ({ value }) =>
                !value || !value.trim() ? "La descripción es obligatoria" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label htmlFor="prod-desc" className="block text-sm font-medium text-slate-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  id="prod-desc"
                  name={field.name}
                  rows={2}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ingredientes, detalles de preparación..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                {field.state.meta.errors ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="precio_base"
              validators={{
                onChange: ({ value }) => {
                  const num = Number(value);
                  if (isNaN(num)) return "Debe ser un número válido";
                  if (num < 0) return "El precio no puede ser negativo";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor="prod-precio" className="block text-sm font-medium text-slate-700 mb-1">
                    Precio Base ($) *
                  </label>
                  <input
                    id="prod-precio"
                    type="number"
                    step="0.01"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field name="disponible">
              {(field) => (
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span>Disponible para venta</span>
                  </label>
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isLoading || isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;
