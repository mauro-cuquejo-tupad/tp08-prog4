import React from "react";
import type { Categoria } from "../types/categoria";

interface CategoriaCardProps {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

export const CategoriaCard: React.FC<CategoriaCardProps> = ({
  categoria,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-200">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
        {categoria.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
        {categoria.nombre}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        {categoria.descripcion}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
        <button
          type="button"
          onClick={() => onEdit(categoria)}
          className="text-blue-600 hover:text-blue-900 font-medium hover:underline cursor-pointer"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(categoria.id)}
          className="text-rose-600 hover:text-rose-900 font-medium hover:underline cursor-pointer"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default CategoriaCard;
