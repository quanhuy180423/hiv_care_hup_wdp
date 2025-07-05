import type { Service, ServiceListResponse } from "@/types/service";
import { apiClient } from "./apiClient";

export const servicesAPI = {
  getAll: async (page: number, limit: number): Promise<ServiceListResponse> => {
    // Call API to get all services
    const response = await apiClient.get<ServiceListResponse>(
      `/services/public?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getById: async (id: number): Promise<Service> => {
    // Call API to get service by ID
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data;
  },
  create: async (serviceData: Partial<Service>) => {
    // Call API to create a new service
    const response = await apiClient.post("/services", serviceData);
    return response.data;
  },
  update: async (id: number, serviceData: Partial<Service>) => {
    // Call API to update an existing service
    const response = await apiClient.put(`/services/${id}`, serviceData);
    return response.data;
  },
  delete: async (id: number) => {
    // Call API to delete a service by ID
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },
};
