import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";
import type {
  AppointmentFormValues,
  AppointmentQueryParams,
} from "@/types/appointment";
import toast from "react-hot-toast";

// Get all appointments (admin view)
export const useAppointments = (params: AppointmentQueryParams = {}) => {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => appointmentService.getAllAppointments(params),
    select: (res) => res.data.data,
  });
};

// Get appointments by user
export const useAppointmentsByUser = (userId?: number) => {
  return useQuery({
    queryKey: ["appointments-user", userId],
    queryFn: () => appointmentService.getAppointmentByUserId(userId!),
    enabled: !!userId,
    select: (res) => res.data.data,
  });
};

// Get appointments by doctor
export const useAppointmentsByDoctor = (doctorId?: number) => {
  return useQuery({
    queryKey: ["appointments-doctor", doctorId],
    queryFn: () => appointmentService.getAppointmentByDoctorId(doctorId!),
    enabled: !!doctorId,
    select: (res) => res.data.data,
  });
};

// Get appointments for staff
export const useAppointmentsByStaff = (params: AppointmentQueryParams = {}) => {
  return useQuery({
    queryKey: ["appointments-staff", params],
    queryFn: () => appointmentService.getAppointmentByStaff(params),
    select: (res) => res.data.data,
  });
};

// Get a single appointment by id
export const useAppointment = (id: number) => {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => appointmentService.getAppointmentById(id),
    enabled: !!id,
  });
};

// Create appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AppointmentFormValues) =>
      appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi tạo cuộc hẹn!");
      return error;
    },
  });
};

// Update appointment
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AppointmentFormValues }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật cuộc hẹn!");
      return error;
    },
  });
};

// Delete appointment
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xoá cuộc hẹn!");
      return error;
    },
  });
};

// Change appointment status
export const useChangeAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      appointmentService.changeStatusAppointment(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments-staff"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật trạng thái cuộc hẹn!");
      return error;
    },
  });
};
