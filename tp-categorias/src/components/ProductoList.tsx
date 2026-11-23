import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import type { Producto } from "../types/producto";
import { EmptyState } from "./StatusStates";

interface ProductoListProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Producto>();

export const ProductoList: React.FC<ProductoListProps> = ({
  productos,
  onEdit,
  onDelete,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => "ID",
        cell: (info) => (
          <span className="font-mono text-xs text-slate-500 font-semibold">
            #{info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("nombre", {
        header: () => "Nombre",
        cell: (info) => (
          <span className="font-semibold text-slate-900">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("descripcion", {
        header: () => "Descripción",
        cell: (info) => (
          <span className="text-slate-600 text-sm max-w-xs truncate block">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("precio_base", {
        header: () => "Precio Base",
        cell: (info) => (
          <span className="font-medium text-emerald-700 text-sm">
            ${Number(info.getValue()).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </span>
        ),
      }),
      columnHelper.accessor("disponible", {
        header: () => "Estado",
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
              Disponible
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
              No disponible
            </span>
          ),
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <span className="text-right block">Acciones</span>,
        cell: (props) => (
          <div className="text-right space-x-3">
            <button
              type="button"
              onClick={() => onEdit(props.row.original)}
              className="text-blue-600 hover:text-blue-900 font-medium text-sm hover:underline cursor-pointer"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(props.row.original.id)}
              className="text-rose-600 hover:text-rose-900 font-medium text-sm hover:underline cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: productos,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (productos.length === 0) {
    return <EmptyState message="No hay productos registrados en el catálogo." />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500">
          Mostrando {table.getRowModel().rows.length} de {productos.length} productos
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      onClick={header.column.getToggleSortingHandler()}
                      className={`px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                        canSort ? "cursor-pointer select-none hover:bg-slate-100" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {sortDir === "asc" && <span> 🔼</span>}
                        {sortDir === "desc" && <span> 🔽</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="text-xs text-slate-600">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoList;
