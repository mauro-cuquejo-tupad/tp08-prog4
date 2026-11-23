import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente";
import {
  getIngredientes,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../services/ingrediente";
import { IngredienteList } from "../components/IngredienteList";
import { IngredienteModal } from "../components/IngredienteModal";
import { LoadingState, ErrorState } from "../components/StatusStates";
import { ConfirmModal, AlertModal } from "../components/FeedbackModals";

export const IngredientesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Estados para modales de feedback
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
  const [alertaMensaje, setAlertaMensaje] = useState<string | null>(null);

  const {
    data: ingredientes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Ingrediente[]>({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
  });

  const createMutation = useMutation({
    mutationFn: (data: IngredienteFormData) => createIngrediente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      cerrarModal();
    },
    onError: (err: Error) => {
      setApiError(err.message || "Error al crear ingrediente");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteFormData }) =>
      updateIngrediente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      cerrarModal();
    },
    onError: (err: Error) => {
      setApiError(err.message || "Error al actualizar ingrediente");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteIngrediente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      setIdAEliminar(null);
    },
    onError: (err: Error) => {
      setAlertaMensaje(`No se pudo eliminar el ingrediente: ${err.message}`);
      setIdAEliminar(null);
    },
  });

  const abrirParaCrear = () => {
    setApiError(null);
    setIngredienteSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirParaEditar = (ingrediente: Ingrediente) => {
    setApiError(null);
    setIngredienteSeleccionado(ingrediente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setIngredienteSeleccionado(null);
    setApiError(null);
  };

  const handleModalSubmit = (data: IngredienteFormData) => {
    setApiError(null);
    if (ingredienteSeleccionado) {
      updateMutation.mutate({ id: ingredienteSeleccionado.id, data });
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
            Ingredientes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administración de ingredientes
          </p>
        </div>
        <button
          type="button"
          onClick={abrirParaCrear}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
        >
          + Nuevo Ingrediente
        </button>
      </div>

      {isLoading && <LoadingState message="Cargando ingredientes..." />}

      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <IngredienteList
          ingredientes={ingredientes}
          onEdit={abrirParaEditar}
          onDelete={(id) => setIdAEliminar(id)}
        />
      )}

      {/* Modal Formulario */}
      <IngredienteModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSubmit={handleModalSubmit}
        ingredienteSeleccionado={ingredienteSeleccionado}
        isLoading={isMutating}
        apiError={apiError}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={idAEliminar !== null}
        title="Eliminar Ingrediente"
        message="¿Está seguro de que desea eliminar este ingrediente? Esta acción no se puede deshacer."
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

export default IngredientesPage;
