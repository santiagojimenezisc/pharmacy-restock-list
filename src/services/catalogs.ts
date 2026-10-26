import type { CatalogItem } from "@/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export const getLaboratories = async (): Promise<CatalogItem[]> => {
  const response = await fetch(`${API_URL}/api/laboratories`);

  if (!response.ok) {
    throw new Error("Error al obtener los laboratorios");
  }

  return response.json();
};

export const getSuppliers = async (): Promise<CatalogItem[]> => {
  const response = await fetch(`${API_URL}/api/suppliers`);

  if (!response.ok) {
    throw new Error("Error al obtener los proveedores");
  }

  return response.json();
};

export const getSectors = async (): Promise<CatalogItem[]> => {
  const response = await fetch(`${API_URL}/api/sectors`);

  if (!response.ok) {
    throw new Error("Error al obtener los sectores");
  }

  return response.json();
};
