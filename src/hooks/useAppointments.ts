import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";
import type {
  AppointmentFormValues,
  AppointmentQueryParams,
} from "@/types/appointment";
import type { Appointment } from "@/types/appointment";

// Helper type for API response shape
interface AppointmentsApiData {
  data: Appointment[];
  meta?: unknown;
}

// Get all appointments (admin view)
export const useAppointments = (params: AppointmentQueryParams = {}) => {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => appointmentService.getAllAppointments(params),
    select: (res) => {
      const data = res?.data?.data;
      if (Array.isArray(data)) return data;
      if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as AppointmentsApiData).data)
      ) {
        return (data as AppointmentsApiData).data;
      }
      // Nếu trả về object lỗi hoặc không đúng, trả về mảng rỗng
      return [];
    },
  });
};

// Get appointments by user
export const useAppointmentsByUser = (
  userId?: number,
  params?: AppointmentQueryParams
) => {
  return useQuery({
    queryKey: ["appointments-user", userId, params],
    queryFn: () => appointmentService.getAppointmentByUserId(userId!, params),
    enabled: !!userId,
    select: (res) => res.data.data,
  });
};

// Get appointments by doctor
export const useAppointmentsByDoctor = (
  doctorId: number,
  params?: AppointmentQueryParams
) => {
  return useQuery({
    queryKey: ["appointments-doctor", doctorId, params],
    queryFn: () =>
      appointmentService.getAppointmentByDoctorId(doctorId, params),
    enabled: !!doctorId,
    select: (res) => res.data,
  });
};

// Get appointments for staff
export const useAppointmentsByStaff = (params: AppointmentQueryParams = {}) => {
  return useQuery({
    queryKey: ["appointments-staff", params],
    queryFn: () => appointmentService.getAppointmentByStaff(params),
    select: (res) => res.data,
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
      queryClient.invalidateQueries({ queryKey: ["appointments-staff"] });
      queryClient.invalidateQueries({ queryKey: ["appointments-user"] });
      queryClient.invalidateQueries({ queryKey: ["appointments-doctor"] });
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
  });
};
