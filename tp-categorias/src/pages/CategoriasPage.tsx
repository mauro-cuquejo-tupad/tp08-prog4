import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Categoria, CategoriaFormData } from "../types/categoria";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoria";
import { CategoriaList } from "../components/CategoriaList";
import { CategoriaModal } from "../components/CategoriaModal";
import { LoadingState, ErrorState } from "../components/StatusStates";
import { ConfirmModal, AlertModal } from "../components/FeedbackModals";

export const CategoriasPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Estados para modales de feedback
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
  const [alertaMensaje, setAlertaMensaje] = useState<string | null>(null);

  const {
    data: categorias = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoriaFormData) => createCategoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      cerrarModal();
    },
    onError: (err: Error) => {
      setApiError(err.message || "Error al crear la categoría");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaFormData }) =>
      updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      cerrarModal();
    },
    onError: (err: Error) => {
      setApiError(err.message || "Error al actualizar la categoría");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setIdAEliminar(null);
    },
    onError: (err: Error) => {
      setAlertaMensaje(`No se pudo eliminar la categoría: ${err.message}`);
      setIdAEliminar(null);
    },
  });

  const abrirParaCrear = () => {
    setApiError(null);
    setCategoriaSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirParaEditar = (categoria: Categoria) => {
    setApiError(null);
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
    setApiError(null);
  };

  const handleModalSubmit = (data: CategoriaFormData) => {
    setApiError(null);
    if (categoriaSeleccionada) {
      updateMutation.mutate({ id: categoriaSeleccionada.id, data });
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
            Categorías
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administración de categorías
          </p>
        </div>
        <button
          type="button"
          onClick={abrirParaCrear}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
        >
          + Nueva Categoría
        </button>
      </div>

      {isLoading && <LoadingState message="Cargando categorías..." />}

      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <CategoriaList
          categorias={categorias}
          onEdit={abrirParaEditar}
          onDelete={(id) => setIdAEliminar(id)}
        />
      )}

      {/* Modal Formulario */}
      <CategoriaModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSubmit={handleModalSubmit}
        categoriaSeleccionada={categoriaSeleccionada}
        isLoading={isMutating}
        apiError={apiError}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={idAEliminar !== null}
        title="Eliminar Categoría"
        message="¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer."
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

export default CategoriasPage;
