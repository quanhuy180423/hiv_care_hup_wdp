import { apiClient } from "./apiClient";
import type { 
  Medicine, 
  MedicinesResponse, 
  MedicineFormValues, 
  UpdateMedicineFormValues,
  BulkCreateMedicineFormValues,
  AdvancedSearchFormValues,
  BulkCreateResponse,
  AdvancedSearchResponse
} from "@/types/medicine";

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
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.unit) searchParams.append('unit', params.unit);

    const response = await apiClient.get(`/medicines?${searchParams.toString()}`);
    return response.data;
  },

  getMedicineById: async (id: number): Promise<{ data: Medicine }> => {
    const response = await apiClient.get(`/medicines/${id}`);
    return response.data;
  },

  createMedicine: async (data: MedicineFormValues): Promise<Medicine> => {
    const response = await apiClient.post('/medicines', data);
    return response.data;
  },

  updateMedicine: async (id: number, data: UpdateMedicineFormValues): Promise<Medicine> => {
    const response = await apiClient.put(`/medicines/${id}`, data);
    return response.data;
  },

  deleteMedicine: async (id: number): Promise<Medicine> => {
    const response = await apiClient.delete(`/medicines/${id}`);
    return response.data;
  },

  searchMedicines: async (query: string): Promise<{ data: Medicine[] }> => {
    const response = await apiClient.get(`/medicines/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getMedicinesByPriceRange: async (minPrice: number, maxPrice: number): Promise<{ data: Medicine[] }> => {
    const response = await apiClient.get(`/medicines/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return response.data;
  },

  advancedSearchMedicines: async (params: AdvancedSearchFormValues): Promise<AdvancedSearchResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.unit) searchParams.append('unit', params.unit);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.page) searchParams.append('page', params.page.toString());

    const response = await apiClient.get(`/medicines/advanced-search?${searchParams.toString()}`);
    return response.data;
  },

  createManyMedicines: async (data: BulkCreateMedicineFormValues): Promise<BulkCreateResponse> => {
    const response = await apiClient.post('/medicines/bulk', data);
    return response.data;
  },
}; 