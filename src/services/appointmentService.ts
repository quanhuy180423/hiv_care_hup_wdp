import type {
  AppointmentFormValues,
  AppointmentQueryParams,
  AppointmentResponse,
  AppointmentsListResponse,
} from "@/types/appointment";
import { apiClient } from "./apiClient";

export const appointmentService = {
  getAllAppointments: async (
    params?: AppointmentQueryParams
  ): Promise<AppointmentsListResponse> => {
    const res = await apiClient.get<AppointmentsListResponse>("/appointments", {
      params,
    });
    return res.data;
  },

  getAppointmentById: async (id: number): Promise<AppointmentResponse> => {
    const res = await apiClient.get<AppointmentResponse>(`/appointments/${id}`);
    return res.data;
  },

  getAppointmentByUserId: async (
    userId: number,
    params?: AppointmentQueryParams
  ): Promise<AppointmentsListResponse> => {
    const res = await apiClient.get<AppointmentsListResponse>(
      `/appointments/user/${userId}`,
      { params }
    );
    return res.data;
  },

  getAppointmentByDoctorId: async (
    doctorId: number,
    params?: AppointmentQueryParams
  ): Promise<AppointmentsListResponse> => {
    const res = await apiClient.get<AppointmentsListResponse>(
      `/appointments/doctor/${doctorId}`,
      { params }
    );
    return res.data;
  },

  getAppointmentByStaff: async (
    params?: AppointmentQueryParams
  ): Promise<AppointmentsListResponse> => {
    const res = await apiClient.get<AppointmentsListResponse>(
      `/appointments/staff`,
      { params }
    );
    return res.data;
  },

  createAppointment: async (
    payload: AppointmentFormValues
  ): Promise<AppointmentResponse> => {
    const res = await apiClient.post<AppointmentResponse>(
      "/appointments",
      payload
    );
    return res.data;
  },

  updateAppointment: async (
    id: number,
    payload: AppointmentFormValues
  ): Promise<AppointmentResponse> => {
    const res = await apiClient.put<AppointmentResponse>(
      `/appointments/${id}`,
      payload
    );
    return res.data;
  },

  deleteAppointment: async (id: number): Promise<AppointmentResponse> => {
    const res = await apiClient.delete<AppointmentResponse>(
      `/appointments/${id}`
    );
    return res.data;
  },

  changeStatusAppointment: async (
    id: number,
    payload: { status: string }
  ): Promise<AppointmentResponse> => {
    const res = await apiClient.put<AppointmentResponse>(
      `/appointments/status/${id}`,
      payload
    );
    return res.data;
  },
};
