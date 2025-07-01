import type { Permission, PermissionsResponse } from "@/types/permission";
import { apiClient } from "./apiClient";

export const permissionService = {
  getPermissions: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const res = await apiClient.get<PermissionsResponse>("/permissions", {
      params,
    });
    return res.data;
  },

  getPermissionById: async (id: number) => {
    const res = await apiClient.get<{ data: Permission }>(`/permissions/${id}`);
    return res.data.data;
  },

  createPermission: async (payload: Partial<Permission>) => {
    const res = await apiClient.post<{ data: Permission }>(
      "/permissions",
      payload
    );
    return res.data.data;
  },

  updatePermission: async (id: number, payload: Partial<Permission>) => {
    const res = await apiClient.put<{ data: Permission }>(
      `/permissions/${id}`,
      payload
    );
    return res.data.data;
  },

  deletePermission: async (id: number) => {
    await apiClient.delete(`/permissions/${id}`);
  },
};
