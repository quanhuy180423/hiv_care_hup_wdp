import { apiClient } from "./apiClient";
import type {
  Medicine,
  MedicineType,
  MedicinesResponse,
  MedicineResponse,
  MedicineFormValues,
  UpdateMedicineFormValues,
  BulkCreateMedicineFormValues,
  AdvancedSearchFormValues,
  BulkCreateResponse,
  AdvancedSearchResponse,
} from "@/types/medicine";

export type MedicineQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  unit?: string;
};

export interface MedicineCreateInput {
  name: string;
  description?: string;
  unit: string;
  dose: string;
  price: number;
}

export interface MedicineBulkCreateInput {
  medicines: MedicineCreateInput[];
  skipDuplicates?: boolean;
}

export const medicineService = {
  getMedicines: async (params?: {
    page?: string | number;
    limit?: string | number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    unit?: string;
  }): Promise<MedicinesResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params?.minPrice)
      searchParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice)
      searchParams.append("maxPrice", params.maxPrice.toString());
    if (params?.unit) searchParams.append("unit", params.unit);

    const response = await apiClient.get(
      `/medicines?${searchParams.toString()}`
    );
    return response.data;
  },

  getMedicineById: async (id: number): Promise<{ data: Medicine }> => {
    const response = await apiClient.get(`/medicines/${id}`);
    return response.data;
  },

  createMedicine: async (data: MedicineFormValues): Promise<Medicine> => {
    const response = await apiClient.post("/medicines", data);
    return response.data;
  },

  updateMedicine: async (
    id: number,
    data: UpdateMedicineFormValues
  ): Promise<Medicine> => {
    const response = await apiClient.put(`/medicines/${id}`, data);
    return response.data;
  },

  deleteMedicine: async (id: number): Promise<Medicine> => {
    const response = await apiClient.delete(`/medicines/${id}`);
    return response.data;
  },

  searchMedicines: async (query: string): Promise<{ data: Medicine[] }> => {
    const response = await apiClient.get(
      `/medicines/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  getMedicinesByPriceRange: async (
    minPrice: number,
    maxPrice: number
  ): Promise<{ data: Medicine[] }> => {
    const response = await apiClient.get(
      `/medicines/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
    return response.data;
  },

  advancedSearchMedicines: async (
    params: AdvancedSearchFormValues
  ): Promise<AdvancedSearchResponse> => {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.append("query", params.query);
    if (params.minPrice)
      searchParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      searchParams.append("maxPrice", params.maxPrice.toString());
    if (params.unit) searchParams.append("unit", params.unit);
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.page) searchParams.append("page", params.page.toString());

    const response = await apiClient.get(
      `/medicines/advanced-search?${searchParams.toString()}`
    );
    return response.data;
  },

  createManyMedicines: async (
    data: BulkCreateMedicineFormValues
  ): Promise<BulkCreateResponse> => {
    const response = await apiClient.post("/medicines/bulk", data);
    return response.data;
  },

  // Legacy methods for backward compatibility
  async getAll(
    params: MedicineQueryParams,
    token: string
  ): Promise<MedicineResponse> {
    const res = await apiClient.get("/medicines", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data.data;
  },

  async getById(id: number | string, token: string) {
    return apiClient.get<MedicineType>(`/medicines/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async create(data: MedicineCreateInput, token: string) {
    return apiClient.post<MedicineType>("/medicines", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async update(
    id: number | string,
    data: Partial<MedicineCreateInput>,
    token: string
  ) {
    return apiClient.put<MedicineType>(`/medicines/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async delete(id: number | string, token: string) {
    return apiClient.delete(`/medicines/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async search(query: string, token: string) {
    return apiClient.get<{ data: MedicineType[] }>(`/medicines/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query },
    });
  },

  async getStats(
    params: { includeInactive?: boolean; groupBy?: string },
    token: string
  ) {
    return apiClient.get(`/medicines/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  async getPriceDistribution(
    params: { buckets?: number; customRanges?: string },
    token: string
  ) {
    return apiClient.get(`/medicines/price-distribution`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  async getUnitUsage(
    params: { sortBy?: string; sortOrder?: string; limit?: number },
    token: string
  ) {
    return apiClient.get(`/medicines/unit-usage`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  async bulkCreate(data: MedicineBulkCreateInput, token: string) {
    return apiClient.post(`/medicines/bulk`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
