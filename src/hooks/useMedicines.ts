import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineService } from "@/services/medicineService";
import type { 
  
  MedicineFormValues, 
  UpdateMedicineFormValues,
 
  BulkCreateMedicineFormValues,
 
  AdvancedSearchFormValues
} from "@/types/medicine";

export const useMedicines = (params?: { 
  page?: number; 
  limit?: number; 
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  minPrice?: number;
  maxPrice?: number;
  unit?: string;
}) => {
  return useQuery({
    queryKey: ["medicines", params],
    queryFn: () => {
      const serviceParams = {
        search: params?.search,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
        unit: params?.unit,
        page: params?.page,
        limit: params?.limit || 10,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
      };
      return medicineService.getMedicines(serviceParams);
    },
    select: (res) => ({
      data: res.data.data,
      meta: res.data.meta,
    }),
  });
};

export const useMedicine = (id: number) => {
  return useQuery({
    queryKey: ["medicine", id],
    queryFn: () => medicineService.getMedicineById(id),
    enabled: !!id,
  });
};

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicineFormValues) => medicineService.createMedicine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMedicineFormValues }) =>
      medicineService.updateMedicine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicine"] });
    },
  });
};

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medicineService.deleteMedicine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};

export const useSearchMedicines = (query: string) => {
  return useQuery({
    queryKey: ["medicines-search", query],
    queryFn: () => medicineService.searchMedicines(query),
    enabled: !!query && query.length > 0,
    select: (res) => res.data,
  });
};

export const useMedicinesByPriceRange = (minPrice: number, maxPrice: number) => {
  return useQuery({
    queryKey: ["medicines-price-range", minPrice, maxPrice],
    queryFn: () => medicineService.getMedicinesByPriceRange(minPrice, maxPrice),
    enabled: !!minPrice && !!maxPrice && maxPrice >= minPrice && minPrice > 0,
    select: (res) => res.data,
  });
};

export const useAdvancedSearchMedicines = (params: AdvancedSearchFormValues | null) => {
  return useQuery({
    queryKey: ["medicines-advanced-search", params],
    queryFn: () => medicineService.advancedSearchMedicines(params!),
    enabled: !!params && (!!params.query || !!params.minPrice || !!params.maxPrice || !!params.unit),
  });
};

export const useCreateManyMedicines = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkCreateMedicineFormValues) => medicineService.createManyMedicines(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}; 

export const useAllMedicines = () => {
  return useQuery({
    queryKey: ["medicines-all"],
    queryFn: () => {
      return medicineService.getMedicines({ limit: 1000 }); // Get all medicines
    },
    select: (res) => ({
      data: res.data.data,
      meta: res.data.meta,
    }),
  });
}; 