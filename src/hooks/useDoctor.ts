import { doctorService } from "@/services/doctorService";
import type {
  DoctorQueryParams,
  DoctorSwapFromValues,
  DoctorSwapResponse,
} from "@/types/doctor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// 📄 Get all doctors
export const useDoctors = (params?: DoctorQueryParams) => {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => doctorService.getAllDoctors(params || {}),
    select: (res) => res.data.data,
  });
};

// 👨‍⚕️ Get doctor by ID
export const useDoctor = (id: number) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorService.getDoctorById(id),
    enabled: !!id,
    select: (res) => res.data,
  });
};

// 📅 Get schedules by doctor ID
export const useDoctorSchedule = (id: number) => {
  return useQuery({
    queryKey: ["doctor", id, "schedule"],
    queryFn: () => doctorService.getDotorSchedule(id),
    enabled: !!id,
    select: (res) => res.data,
  });
};

// 📆 Get all doctors' schedules by date
export const useDoctorSchedulesByDate = (date: string) => {
  return useQuery({
    queryKey: ["doctors", "schedule", "by-date", date],
    queryFn: () => doctorService.getDoctorScheduleAtDay(date),
    enabled: !!date,
    select: (res) => res.data,
  });
};

export const useSwapShifts = () => {
  const queryClient = useQueryClient();

  return useMutation<DoctorSwapResponse, Error, DoctorSwapFromValues>({
    mutationFn: (data) => doctorService.swapShifts(data),
    onSuccess: () => {
      toast.success("Đổi ca thành công!");
      // Cập nhật lại dữ liệu lịch nếu cần
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", "schedule"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Đổi ca thất bại!");
    },
  });
};
