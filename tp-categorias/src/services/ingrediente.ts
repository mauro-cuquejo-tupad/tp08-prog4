import type { Ingrediente, IngredienteFormData } from "../types/ingrediente";

const API_BASE_URL = "http://localhost:8000/ingredientes";

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) {
    throw new Error(`Error al obtener ingredientes (Status: ${response.status})`);
  }
  return response.json();
};

export const getIngredienteById = async (id: number): Promise<Ingrediente> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener el ingrediente con id ${id} (Status: ${response.status})`);
  }
  return response.json();
};

export const createIngrediente = async (data: IngredienteFormData): Promise<Ingrediente> => {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error al crear el ingrediente (Status: ${response.status})`);
  }
  return response.json();
};

export const updateIngrediente = async (
  id: number,
  data: IngredienteFormData
): Promise<Ingrediente> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error al actualizar el ingrediente con id ${id} (Status: ${response.status})`);
  }
  return response.json();
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error al eliminar el ingrediente con id ${id} (Status: ${response.status})`);
  }
};
