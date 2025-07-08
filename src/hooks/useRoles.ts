import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services/roleService";
import type { RoleFormValues } from "@/types/role";
import toast from "react-hot-toast";

interface UseRolesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useRoles = (params: UseRolesParams = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  
  return useQuery({
    queryKey: ["roles", { page, limit, search }],
    queryFn: () => roleService.getRoles({ page, limit, search }),
    select: (res) => ({
      data: res.data.data,
      meta: res.data.meta,
    }),
  });
};

export const useRole = (id: number) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: () => roleService.getRoleById(id),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoleFormValues) => roleService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi tạo vai trò!");
      return error;
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleFormValues }) =>
      roleService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật vai trò!");
      return error;
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xóa vai trò!");
      return error;
    },
  });
};
