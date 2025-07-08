import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/serviceService";
import type { 
  ServiceFormValues, 
  UpdateServiceFormValues,
  QueryServiceFormValues,
  ServicesResponse
} from "@/types/service";

export const useServices = (params?: QueryServiceFormValues) => {
  return useQuery<ServicesResponse>({
    queryKey: ["services", params],
    queryFn: () => serviceService.getServices(params),
  });
};

export const useService = (id: number) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => serviceService.getServiceById(id),
    enabled: !!id,
  });
};

export const useServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["service-by-slug", slug],
    queryFn: () => serviceService.getServiceBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceFormValues) => serviceService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServiceFormValues }) =>
      serviceService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => serviceService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useActiveServices = (params?: QueryServiceFormValues) => {
  return useQuery<ServicesResponse>({
    queryKey: ["active-services", params],
    queryFn: () => serviceService.getActiveServices(params),
  });
}; 