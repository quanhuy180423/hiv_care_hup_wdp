import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "@/services/doctorService";
import type { 
  DoctorFormValues, 
  UpdateDoctorFormValues,
  SwapShiftsFormValues,
  GenerateScheduleFormValues,
  ManualScheduleAssignmentFormValues
} from "@/types/doctor";

interface UseDoctorsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  specialization?: string;
}

export const useDoctors = (params: UseDoctorsParams = {}) => {
  const { page = 1, limit = 10, search = "", sortBy, sortOrder, specialization } = params;
  
  return useQuery({
    queryKey: ["doctors", { page, limit, search, sortBy, sortOrder, specialization }],
    queryFn: () => doctorService.getDoctors({ page, limit, search, sortBy, sortOrder, specialization }),
    select: (res) => ({
      data: res.data.data,
      meta: res.data.meta,
    }),
  });
};

export const useDoctor = (id: number) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorService.getDoctorById(id),
    enabled: !!id,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DoctorFormValues) => doctorService.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDoctorFormValues }) =>
      doctorService.updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => doctorService.deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useDoctorSchedule = (id: number, params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["doctor-schedule", id, params],
    queryFn: () => doctorService.getDoctorSchedule(id, params),
    enabled: !!id,
  });
};

export const useGenerateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateScheduleFormValues) => doctorService.generateSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-schedule"] });
    },
  });
};

export const useAssignDoctorsManually = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManualScheduleAssignmentFormValues) => doctorService.assignDoctorsManually(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-schedule"] });
    },
  });
};

export const useSwapShifts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SwapShiftsFormValues) => doctorService.swapShifts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-schedule"] });
    },
  });
};

export const useDoctorsByDate = (date: string) => {
  return useQuery({
    queryKey: ["doctors-by-date", date],
    queryFn: () => doctorService.getDoctorsByDate(date),
    enabled: !!date,
  });
};

export const useWeeklySchedule = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["weekly-schedule", params],
    queryFn: () => doctorService.getWeeklySchedule(params),
    enabled: !!(params?.startDate && params?.endDate),
  });
}; 

export const useAllDoctors = () => {
  return useQuery({
    queryKey: ["all-doctors-list"],
    queryFn: () => doctorService.getDoctors({ page: 1, limit: 1000, search: "" }),
    select: (res) => res.data.data,
  });
}; 