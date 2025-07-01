import type { Role, RoleFormValues, RolesResponse } from "@/types/role";
import { apiClient } from "./apiClient";

export const roleService = {
  getRoles: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const res = await apiClient.get<RolesResponse>("/roles", { params });
    return res.data;
  },

  getRoleById: async (id: number) => {
    const res = await apiClient.get<{ data: Role }>(`/roles/${id}`);
    return res.data.data;
  },

  createRole: async (payload: RoleFormValues) => {
    const res = await apiClient.post<{ data: Role }>("/roles", payload);
    return res.data.data;
  },

  updateRole: async (id: number, payload: RoleFormValues) => {
    const res = await apiClient.put<{ data: Role }>(`/roles/${id}`, payload);
    return res.data.data;
  },

  deleteRole: async (id: number) => {
    await apiClient.delete(`/roles/${id}`);
  },

  getUserRoles: async (userId: number) => {
    const res = await apiClient.get<{ data: Role[] }>(`/roles/user/${userId}`);
    return res.data.data;
  },

  updateUserRole: async (userId: number, payload: { roleIds: number[] }) => {
    const res = await apiClient.put(`/roles/user/${userId}/roles`, payload);
    return res.data;
  },
};
