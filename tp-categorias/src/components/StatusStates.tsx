import React from "react";

export const LoadingState: React.FC<{ message?: string }> = ({
  message = "Cargando datos...",
}) => (
  <div className="flex items-center justify-center p-12">
    <div className="inline-flex items-center space-x-3 text-slate-500">
      <svg
        className="animate-spin h-6 w-6 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  </div>
);

export const EmptyState: React.FC<{ message?: string }> = ({
  message = "No hay registros disponibles en este momento.",
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center text-slate-500">
    <p className="text-sm">{message}</p>
  </div>
);

export const ErrorState: React.FC<{ error: unknown; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => {
  const errorMessage =
    error instanceof Error ? error.message : "Ocurrió un error inesperado al consultar el servidor.";

  return (
    <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-rose-800 text-sm font-medium">
          <svg className="w-5 h-5 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold px-2.5 py-1 rounded transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};
