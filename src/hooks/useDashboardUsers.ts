import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardUserService } from "@/services/dashboardUserService";
import type { DashboardUserParams } from "@/services/dashboardUserService";

// Hook để lấy danh sách users cho dashboard
export const useDashboardUsers = (params: DashboardUserParams = {}) => {
  const { page = 1, limit = 100, search = "", roleId, isActive } = params;

  return useQuery({
    queryKey: ["dashboard-users", { page, limit, search, roleId, isActive }],
    queryFn: () => dashboardUserService.getUsers({ page, limit, search, roleId, isActive }),
    select: (res) => ({
      users: res.data.data,
      meta: res.data.meta,
      statusCode: res.statusCode,
      message: res.message,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy user theo ID cho dashboard
export const useDashboardUser = (id: number) => {
  return useQuery({
    queryKey: ["dashboard-user", id],
    queryFn: () => dashboardUserService.getUserById(id),
    enabled: !!id,
    select: (res) => ({
      user: res.data,
      statusCode: res.statusCode,
      message: res.message,
    }),
  });
};

// Hook để toggle trạng thái active của user
export const useToggleDashboardUserActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => dashboardUserService.toggleUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-user"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-user-stats"] });
    },
  });
};

// Hook để xóa user
export const useDeleteDashboardUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => dashboardUserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-user-stats"] });
    },
  });
};

// Hook để khôi phục user
export const useRestoreDashboardUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => dashboardUserService.restoreUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-user-stats"] });
    },
  });
};

// Hook để lấy thống kê users theo role
export const useDashboardUserRoleStats = () => {
  return useQuery({
    queryKey: ["dashboard-user-role-stats"],
    queryFn: () => dashboardUserService.getUserRoleStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
