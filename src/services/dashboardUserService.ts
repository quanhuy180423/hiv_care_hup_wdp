import { apiClient } from "./apiClient";
import axios from "axios";

// Error handler utility
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    switch (error.response?.status) {
      case 400:
        return "Yêu cầu không hợp lệ";
      case 401:
        return "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn";
      case 403:
        return "Bạn không có quyền truy cập tài nguyên này";
      case 404:
        return "Không tìm thấy tài nguyên";
      case 422:
        return "Dữ liệu không hợp lệ";
      case 429:
        return "Quá nhiều yêu cầu, vui lòng thử lại sau";
      case 500:
        return "Lỗi máy chủ nội bộ";
      default:
        return error.message || "Đã xảy ra lỗi không xác định";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi không xác định";
};

// Dashboard User interface dựa trên response body
interface DashboardUser {
  id: number;
  email: string;
  name: string;
  password?: string;
  phoneNumber?: string;
  avatar?: string | null;
  totpSecret?: string | null;
  googleId?: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  roleId: number;
  createdById?: number | null;
  updatedById?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdById?: number | null;
    updatedById?: number | null;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// Response interface cho dashboard
interface DashboardUsersResponse {
  data: {
    data: DashboardUser[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  statusCode: number;
  message: string;
}

interface DashboardUserParams {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: number;
  isActive?: boolean;
}

// Dashboard service cho users
export const dashboardUserService = {
  // Lấy danh sách users cho dashboard
  getUsers: async (params?: DashboardUserParams): Promise<DashboardUsersResponse> => {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.roleId) searchParams.append('roleId', params.roleId.toString());
      if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

      const response = await apiClient.get<DashboardUsersResponse>(`/users?${searchParams.toString()}`);
      
      if (response.data) {
        return response.data;
      }
      
      throw new Error("Không thể lấy danh sách người dùng");
    } catch (error) {
      console.error("🌐 dashboardUserService.getUsers error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Lấy user theo ID cho dashboard
  getUserById: async (id: number): Promise<{ data: DashboardUser; statusCode: number; message: string }> => {
    try {
      const response = await apiClient.get<{ data: DashboardUser; statusCode: number; message: string }>(`/users/${id}`);
      
      if (response.data) {
        return response.data;
      }
      
      throw new Error("Không thể lấy thông tin người dùng");
    } catch (error) {
      console.error("🌐 dashboardUserService.getUserById error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Toggle trạng thái active của user
  toggleUserActive: async (id: number): Promise<{ data: DashboardUser; statusCode: number; message: string }> => {
    try {
      const response = await apiClient.patch<{ data: DashboardUser; statusCode: number; message: string }>(`/users/${id}/toggle-active`);
      
      if (response.data) {
        return response.data;
      }
      
      throw new Error("Thay đổi trạng thái người dùng thất bại");
    } catch (error) {
      console.error("🌐 dashboardUserService.toggleUserActive error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Xóa user (soft delete)
  deleteUser: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error("🌐 dashboardUserService.deleteUser error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Khôi phục user đã xóa
  restoreUser: async (id: number): Promise<{ data: DashboardUser; statusCode: number; message: string }> => {
    try {
      const response = await apiClient.patch<{ data: DashboardUser; statusCode: number; message: string }>(`/users/${id}/restore`);
      
      if (response.data) {
        return response.data;
      }
      
      throw new Error("Khôi phục người dùng thất bại");
    } catch (error) {
      console.error("🌐 dashboardUserService.restoreUser error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Lấy thống kê users theo role từ danh sách users
  getUserRoleStats: async (): Promise<{
    totalUsers: number;
    roleStats: Record<string, number>;
  }> => {
    try {
      // Lấy tất cả users với limit cao để đếm đầy đủ
      const response = await apiClient.get<DashboardUsersResponse>(`/users?limit=1000`);
      
      if (response.data?.data?.data) {
        const users = response.data.data.data;
        const totalUsers = users.length;
        
        // Đếm users theo role
        const roleStats: Record<string, number> = {};
        users.forEach(user => {
          const roleName = user.role.name;
          roleStats[roleName] = (roleStats[roleName] || 0) + 1;
        });
        
        return {
          totalUsers,
          roleStats
        };
      }
      
      throw new Error("Không thể lấy thống kê người dùng");
    } catch (error) {
      console.error("🌐 dashboardUserService.getUserRoleStats error:", error);
      throw new Error(handleApiError(error));
    }
  },
};

export type { DashboardUser, DashboardUsersResponse, DashboardUserParams };
