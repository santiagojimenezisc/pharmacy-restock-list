import type { Product, SectorList } from "@/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export const getSectorsSummary = async (): Promise<SectorList[]> => {
  const response = await fetch(`${API_URL}/api/sectors/summary`);

  if (!response.ok) {
    throw new Error("Error al obtener el resumen de sectores");
  }

  return response.json();
};

export const getProductsBySector = async (
  sectorId: number
): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/api/sectors/${sectorId}`);

  if (!response.ok) {
    throw new Error("Error al obtener los productos del sector");
  }

  return response.json();
};