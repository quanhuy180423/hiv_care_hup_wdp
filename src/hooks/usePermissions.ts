import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService } from "@/services/permissionService";
import type { Permission } from "@/types/permission";
import toast from "react-hot-toast";

export const usePermissions = (params?: { search?: string }) => {
  return useQuery({
    queryKey: ["permissions", params],
    queryFn: () => permissionService.getPermissions({ limit: 100, ...params }),
    select: (res) => res.data.data,
  });
};

export const usePermission = (id: number) => {
  return useQuery({
    queryKey: ["permission", id],
    queryFn: () => permissionService.getPermissionById(id),
    enabled: !!id,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Permission>) =>
      permissionService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi tạo quyền!");
      return error;
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Permission> }) =>
      permissionService.updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permission"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật quyền!");
      return error;
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => permissionService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xóa quyền!");
      return error;
    },
  });
};
