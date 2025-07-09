import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesAPI } from "../services/serviceService";
import type { Service } from "../types/service";

export const useServices = (page: number = 1, limit: number = 10) => {
  const queryClient = useQueryClient();

  // Fetch services
  const {
    data: services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["services", page, limit],
    queryFn: () => servicesAPI.getAll(page, limit),
  });

  // Create service
  const createService = useMutation({
    mutationFn: (serviceData: Partial<Service>) =>
      servicesAPI.create(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  // Update service
  const updateService = useMutation({
    mutationFn: ({
      id,
      serviceData,
    }: {
      id: number;
      serviceData: Partial<Service>;
    }) => servicesAPI.update(id, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  // Delete service
  const deleteService = useMutation({
    mutationFn: (id: number) => servicesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  return {
    services,
    isServicesLoading,
    servicesError,
    createService,
    updateService,
    deleteService,
  };
};
