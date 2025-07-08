import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService } from "@/services/permissionService";
import type { Permission } from "@/types/permission";

interface UsePermissionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const usePermissions = (params: UsePermissionsParams = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  
  return useQuery({
    queryKey: ["permissions", { page, limit, search }],
    queryFn: () => permissionService.getPermissions({ page, limit, search }),
    select: (res) => ({
      data: res.data.data,
      meta: res.data.meta,
    }),
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
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => permissionService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};
