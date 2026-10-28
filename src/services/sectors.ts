import type {
  CreateSectorResponse,
  NewSector,
  Product,
  SectorList,
} from "@/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

const errorFrom = async (response: Response, fallback: string) => {
  try {
    const { message } = await response.json();
    return new Error(message ?? fallback);
  } catch {
    return new Error(fallback);
  }
};

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

export const createSector = async (
  sector: NewSector,
): Promise<CreateSectorResponse> => {
  const response = await fetch(`${API_URL}/api/sectors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sector),
  });

  if (!response.ok) {
    throw await errorFrom(response, "Error al crear el anaquel");
  }

  return response.json();
};

export const updateSector = async (
  id: number,
  sector: NewSector,
): Promise<void> => {
  const response = await fetch(`${API_URL}/api/sectors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sector),
  });

  if (!response.ok) {
    throw await errorFrom(response, "Error al actualizar el anaquel");
  }
};

export const deleteSector = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/sectors/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await errorFrom(response, "Error al eliminar el anaquel");
  }
};