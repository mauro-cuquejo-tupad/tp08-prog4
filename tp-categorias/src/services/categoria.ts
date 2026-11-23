import type { Categoria, CategoriaFormData } from "../types/categoria";

const API_BASE_URL = "http://localhost:8000/categorias";

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    throw new Error(`Error al obtener categorías (Status: ${response.status})`);
  }
  return response.json();
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener la categoría con id ${id} (Status: ${response.status})`);
  }
  return response.json();
};

export const createCategoria = async (data: CategoriaFormData): Promise<Categoria> => {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error al crear la categoría (Status: ${response.status})`);
  }
  return response.json();
};

export const updateCategoria = async (
  id: number,
  data: CategoriaFormData
): Promise<Categoria> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error al actualizar la categoría con id ${id} (Status: ${response.status})`);
  }
  return response.json();
};

export const deleteCategoria = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error al eliminar la categoría con id ${id} (Status: ${response.status})`);
  }
};
