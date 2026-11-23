import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Producto, ProductoFormData } from "../types/producto";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/producto";
import { ProductoList } from "../components/ProductoList";
import { ProductoModal } from "../components/ProductoModal";
import { LoadingState, ErrorState } from "../components/StatusStates";
import { ConfirmModal, AlertModal } from "../components/FeedbackModals";

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Estados para modales de feedback
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
  const [alertaMensaje, setAlertaMensaje] = useState<string | null>(null);

  const {
    data: productos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Producto[]>({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductoFormData) => createProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      cerrarModal();
    },
    onError: (err: Error) => {
      setApiError(err.message || "Error al crear el producto");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoFormData }) =>
      updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      cerrarModal();
    },
    onError: (err: Error) => {
      setApiError(err.message || "Error al actualizar el producto");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setIdAEliminar(null);
    },
    onError: (err: Error) => {
      setAlertaMensaje(`No se pudo eliminar el producto: ${err.message}`);
      setIdAEliminar(null);
    },
  });

  const abrirParaCrear = () => {
    setApiError(null);
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirParaEditar = (producto: Producto) => {
    setApiError(null);
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
    setApiError(null);
  };

  const handleModalSubmit = (data: ProductoFormData) => {
    setApiError(null);
    if (productoSeleccionado) {
      updateMutation.mutate({ id: productoSeleccionado.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Productos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administración de productos
          </p>
        </div>
        <button
          type="button"
          onClick={abrirParaCrear}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
        >
          + Nuevo Producto
        </button>
      </div>

      {isLoading && <LoadingState message="Cargando productos..." />}

      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <ProductoList
          productos={productos}
          onEdit={abrirParaEditar}
          onDelete={(id) => setIdAEliminar(id)}
        />
      )}

      {/* Modal Formulario */}
      <ProductoModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSubmit={handleModalSubmit}
        productoSeleccionado={productoSeleccionado}
        isLoading={isMutating}
        apiError={apiError}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={idAEliminar !== null}
        title="Eliminar Producto"
        message="¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isDestructive={true}
        onConfirm={() => {
          if (idAEliminar !== null) {
            deleteMutation.mutate(idAEliminar);
          }
        }}
        onClose={() => setIdAEliminar(null)}
      />

      {/* Modal de Alerta / Error */}
      <AlertModal
        isOpen={alertaMensaje !== null}
        title="Error al eliminar"
        message={alertaMensaje ?? ""}
        onClose={() => setAlertaMensaje(null)}
      />
    </div>
  );
};

export default ProductsPage;
