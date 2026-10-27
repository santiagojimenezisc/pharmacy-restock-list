import type { CreateProductResponse, NewProduct } from "@/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

export const toggleProductStatus = async (
  id: number,
  isComplete: boolean,
): Promise<void> => {
  const action = isComplete ? "incomplete" : "complete";
  const response = await fetch(
    `${API_URL}/api/products-to-buy/${id}/${action}`,
    {
      method: "PATCH",
    },
  );

  if (!response.ok) {
    throw new Error("Error al actualizar el producto");
  }
};

export const createProduct = async (
  product: NewProduct,
): Promise<CreateProductResponse> => {
  const response = await fetch(`${API_URL}/api/purchase-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Error al agregar el producto");
  }

  return response.json();
};

export const updateProduct = async (
  id: number,
  product: NewProduct,
): Promise<void> => {
  const response = await fetch(`${API_URL}/api/products-to-buy/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el producto");
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/products-to-buy/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el producto");
  }
};
