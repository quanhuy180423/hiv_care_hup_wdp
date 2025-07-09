import { apiClient } from "./apiClient";
import type {
  Service,
  ServicesResponse,
  ServiceFormValues,
  UpdateServiceFormValues,
  QueryServiceFormValues,
} from "@/types/service";

export const serviceService = {
  getServices: async (
    params?: QueryServiceFormValues
  ): Promise<ServicesResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.isActive !== undefined)
      searchParams.append("isActive", params.isActive.toString());

    const response = await apiClient.get(
      `/services?${searchParams.toString()}`
    );
    const result: ServicesResponse = response.data.data;
    return result;
  },

  getServiceById: async (id: number): Promise<Service> => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  getServiceBySlug: async (slug: string): Promise<Service> => {
    const response = await apiClient.get(`/services/slug/${slug}`);
    return response.data;
  },

  createService: async (data: ServiceFormValues): Promise<Service> => {
    try {
      console.log("🚀 Creating service with data:", data);
      const response = await apiClient.post("/services", data);
      console.log("✅ Service created successfully:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("❌ Create service error:", error);
      throw error;
    }
  },

  updateService: async (
    id: number,
    data: UpdateServiceFormValues
  ): Promise<Service> => {
    try {
      console.log("🚀 Updating service with data:", { id, data });
      const response = await apiClient.patch(`/services/${id}`, data);
      console.log("✅ Service updated successfully:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("❌ Update service error:", error);
      throw error;
    }
  },

  deleteService: async (id: number): Promise<Service> => {
    try {
      console.log("🚀 Deleting service:", id);
      const response = await apiClient.delete(`/services/${id}`);
      console.log("✅ Service deleted successfully:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("❌ Delete service error:", error);
      throw error;
    }
  },

  getActiveServices: async (
    params?: QueryServiceFormValues
  ): Promise<ServicesResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.type) searchParams.append("type", params.type);

    const response = await apiClient.get(
      `/services/public?${searchParams.toString()}`
    );
    const result: ServicesResponse = response.data.data;
    return result;
  },
};

// Legacy API for backward compatibility
export const servicesAPI = {
  getAll: async (page: number, limit: number) => {
    return serviceService.getActiveServices({ page, limit });
  },
  getById: async (id: number) => {
    return serviceService.getServiceById(id);
  },
  create: async (serviceData: ServiceFormValues) => {
    return serviceService.createService(serviceData);
  },
  update: async (id: number, serviceData: UpdateServiceFormValues) => {
    return serviceService.updateService(id, serviceData);
  },
  delete: async (id: number) => {
    return serviceService.deleteService(id);
  },
};
