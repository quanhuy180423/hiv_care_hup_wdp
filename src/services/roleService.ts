import type { RoleFormValues, RolesResponse } from "@/types/role";
import { apiClient } from "./apiClient";

export const roleService = {
  getRoles: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<RolesResponse> => {
    const res = await apiClient.get<RolesResponse>("/roles", { params });
    return res.data;
  },

  getRoleById: async (id: number): Promise<RolesResponse> => {
    const res = await apiClient.get<RolesResponse>(`/roles/${id}`);
    return res.data;
  },

  createRole: async (payload: RoleFormValues): Promise<RolesResponse> => {
    const res = await apiClient.post<RolesResponse>("/roles", payload);
    return res.data;
  },

  updateRole: async (
    id: number,
    payload: RoleFormValues
  ): Promise<RolesResponse> => {
    const res = await apiClient.put<RolesResponse>(`/roles/${id}`, payload);
    return res.data;
  },

  deleteRole: async (id: number) => {
    await apiClient.delete(`/roles/${id}`);
  },

  getUserRoles: async (userId: number): Promise<RolesResponse> => {
    const res = await apiClient.get<RolesResponse>(`/roles/user/${userId}`);
    return res.data;
  },

  updateUserRole: async (userId: number, payload: { roleIds: number[] }) => {
    const res = await apiClient.put(`/roles/user/${userId}/roles`, payload);
    return res.data;
  },
};
