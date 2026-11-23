import type { Producto, ProductoFormData } from "../types/producto";

const API_BASE_URL = "http://localhost:8000/productos";

export const getProductos = async (): Promise<Producto[]> => {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    throw new Error(`Error al obtener productos (Status: ${response.status})`);
  }
  return response.json();
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener el producto con id ${id} (Status: ${response.status})`);
  }
  return response.json();
};

export const createProducto = async (data: ProductoFormData): Promise<Producto> => {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error al crear el producto (Status: ${response.status})`);
  }
  return response.json();
};

export const updateProducto = async (
  id: number,
  data: ProductoFormData
): Promise<Producto> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error al actualizar el producto con id ${id} (Status: ${response.status})`);
  }
  return response.json();
};

export const deleteProducto = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error al eliminar el producto con id ${id} (Status: ${response.status})`);
  }
};
