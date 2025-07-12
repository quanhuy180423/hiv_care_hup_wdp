export interface Medicine {
  id: number;
  name: string;
  description?: string | null;
  unit: string;
  dose: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface MedicinesResponse {
  data: {
    data: Medicine[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface BulkCreateResponse {
  count: number;
  errors: string[];
}

export interface AdvancedSearchResponse {
  medicines: Medicine[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type MedicineFormValues = {
  name: string;
  description?: string;
  unit: string;
  dose: string;
  price: number;
};

export type UpdateMedicineFormValues = {
  name?: string;
  description?: string;
  unit?: string;
  dose?: string;
  price?: number;
};

export type QueryMedicineFormValues = {
  search?: string;
  sortBy?: "name" | "price" | "createdAt" | "unit";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  unit?: string;
  page?: number;
  limit?: number;
};

export type BulkCreateMedicineFormValues = {
  medicines: Array<{
    name: string;
    description?: string;
    unit: string;
    dose: string;
    price: number;
  }>;
  skipDuplicates?: boolean;
};

export type PriceRangeFormValues = {
  minPrice: number;
  maxPrice: number;
};

export type AdvancedSearchFormValues = {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  unit?: string;
  limit?: number;
  page?: number;
};

// Legacy types for backward compatibility
export type MedicineType = Medicine;

export type MedicineResponse = {
  data: Medicine[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
