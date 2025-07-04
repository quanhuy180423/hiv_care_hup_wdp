import type { Permission, PermissionsResponse } from "@/types/permission";
import { apiClient } from "./apiClient";

export const permissionService = {
  getPermissions: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PermissionsResponse> => {
    const res = await apiClient.get<PermissionsResponse>("/permissions", {
      params,
    });
    return res.data;
  },

  getPermissionById: async (id: number): Promise<PermissionsResponse> => {
    const res = await apiClient.get<PermissionsResponse>(`/permissions/${id}`);
    return res.data;
  },

  createPermission: async (
    payload: Partial<Permission>
  ): Promise<PermissionsResponse> => {
    const res = await apiClient.post<PermissionsResponse>(
      "/permissions",
      payload
    );
    return res.data;
  },

  updatePermission: async (
    id: number,
    payload: Partial<Permission>
  ): Promise<PermissionsResponse> => {
    const res = await apiClient.put<PermissionsResponse>(
      `/permissions/${id}`,
      payload
    );
    return res.data;
  },

  deletePermission: async (id: number) => {
    await apiClient.delete(`/permissions/${id}`);
  },
};
