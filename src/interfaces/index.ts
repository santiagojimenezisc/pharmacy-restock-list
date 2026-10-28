export interface Product {
  id: number;
  name: string;
  activeSubstance: string;
  description: string;
  quantity: number;
  grammage: string;
  price: number;

  laboratoryId: number;
  laboratoryName: string;

  supplierId: number | null;
  supplierName: string | null;

  sectorId: number;
  sectorName: string;

  category: string;
  tags: string[] | "";
  isMedicine: boolean;
  isComplete: boolean;
  createdAt: string;
}

export interface NewProduct {
  name: string;
  activeSubstance: string;
  description: string;
  quantity: number;
  grammage: string;
  price: number;
  laboratoryId: number;
  supplierId: number;
  sectorId: number;
  category: string;
  tags: string[];
  isMedicine: boolean;
}

export interface CreateProductResponse {
  message: string;
  id: number;
}

export interface CatalogItem {
  id: number;
  name: string;
  active: boolean;
}

export interface SectorList {
  sectorId: number;
  sectorName: string;
  totalProducts: number;
  incompleteProducts: number;
}
