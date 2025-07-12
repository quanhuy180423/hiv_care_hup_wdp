import { apiClient } from "./apiClient";
import type { User, UsersResponse, UserFormValues, UpdateUserFormValues } from "@/types/user";

export const userService = {
  getUsers: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
  }): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    const response = await apiClient.get(`/users?${searchParams.toString()}`);
    return response.data;
  },

  getUserById: async (id: number): Promise<{ data: User }> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: UserFormValues): Promise<{ data: User }> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserFormValues): Promise<{ data: User }> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  restoreUser: async (id: number): Promise<{ data: User }> => {
    const response = await apiClient.patch(`/users/${id}/restore`);
    return response.data;
  },
}; 