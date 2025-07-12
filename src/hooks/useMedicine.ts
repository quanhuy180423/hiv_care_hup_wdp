import {
  medicineService,
  type MedicineBulkCreateInput,
  type MedicineCreateInput,
  type MedicineQueryParams,
} from "@/services/medicineService";
import type { MedicineResponse } from "@/types/medicine";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMedicines(params: MedicineQueryParams, token: string) {
  return useQuery<MedicineResponse>({
    queryKey: ["medicines", params, token],
    queryFn: () => medicineService.getAll(params, token),
    enabled: !!token,
  });
}

export function useMedicine(id: number | string | undefined, token: string) {
  return useQuery({
    queryKey: ["medicine", id, token],
    queryFn: () => (id ? medicineService.getById(id, token) : Promise.reject()),
    enabled: !!id && !!token,
    select: (res) => res.data,
  });
}

export function useCreateMedicine(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicineCreateInput) =>
      medicineService.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}

export function useUpdateMedicine(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: Partial<MedicineCreateInput>;
    }) => medicineService.update(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}

export function useDeleteMedicine(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => medicineService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}

export function useBulkCreateMedicines(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicineBulkCreateInput) =>
      medicineService.bulkCreate(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}

export function useSearchMedicines(query: string, token: string) {
  return useQuery({
    queryKey: ["medicines-search", query, token],
    queryFn: () => medicineService.search(query, token),
    enabled: !!query && !!token,
    select: (res) => res.data,
  });
}
