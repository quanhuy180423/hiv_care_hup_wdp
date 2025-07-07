import { apiClient } from "@/services/apiClient";
import type { PaginationMeta } from "@/types/patientTreatment";

export interface Medicine {
  id: number;
  name: string;
  description?: string;
  unit: string;
  dose: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  unit?: string;
}

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
  async getAll(params: MedicineQueryParams, token: string) {
    return apiClient.get<{ data: Medicine[]; meta: PaginationMeta }>(
      "/medicines",
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
  },
  async getById(id: number | string, token: string) {
    return apiClient.get<Medicine>(`/medicines/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async create(data: MedicineCreateInput, token: string) {
    return apiClient.post<Medicine>("/medicines", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async update(
    id: number | string,
    data: Partial<MedicineCreateInput>,
    token: string
  ) {
    return apiClient.put<Medicine>(`/medicines/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async delete(id: number | string, token: string) {
    return apiClient.delete(`/medicines/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async search(query: string, token: string) {
    return apiClient.get<{ data: Medicine[] }>(`/medicines/search`, {
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
