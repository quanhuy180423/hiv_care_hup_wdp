import { apiClient } from "./apiClient";
import type {
  Doctor,
  DoctorsResponse,
  DoctorFormValues,
  UpdateDoctorFormValues,
  SwapShiftsFormValues,
  GenerateScheduleFormValues,
  ManualScheduleAssignmentFormValues,
  DoctorListResponse,
  DoctorQueryParams,
  DoctorScheduleByDateResponse,
  DoctorScheduleResponse,
  DoctorSwapFromValues,
  DoctorSwapResponse,
} from "@/types/doctor";

export const doctorService = {
  // Legacy methods (keeping for backward compatibility)
  getAllDoctors: async (
    params: DoctorQueryParams
  ): Promise<DoctorListResponse> => {
    const res = await apiClient.get<DoctorListResponse>("/doctors", { params });
    return res.data;
  },

  getDotorSchedule: async (id: number): Promise<DoctorScheduleResponse> => {
    const res = await apiClient.get<DoctorScheduleResponse>(
      `/doctors/${id}/schedule`
    );
    return res.data;
  },

  getDoctorScheduleAtDay: async (
    date: string
  ): Promise<DoctorScheduleByDateResponse> => {
    const res = await apiClient.get<DoctorScheduleByDateResponse>(
      `/doctors/schedule/by-date`,
      { params: { date } }
    );
    return res.data;
  },

  // New admin feature methods
  getDoctors: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    specialization?: string;
  }): Promise<DoctorsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params?.specialization)
      searchParams.append("specialization", params.specialization);

    const response = await apiClient.get(`/doctors?${searchParams.toString()}`);
    return response.data;
  },

  getDoctorById: async (id: number): Promise<{ data: Doctor }> => {
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data;
  },

  createDoctor: async (data: DoctorFormValues): Promise<{ data: Doctor }> => {
    const response = await apiClient.post("/doctors", data);
    return response.data;
  },

  updateDoctor: async (
    id: number,
    data: UpdateDoctorFormValues
  ): Promise<{ data: Doctor }> => {
    const response = await apiClient.put(`/doctors/${id}`, data);
    return response.data;
  },

  deleteDoctor: async (id: number): Promise<{ data: Doctor }> => {
    const response = await apiClient.delete(`/doctors/${id}`);
    return response.data;
  },

  getDoctorSchedule: async (
    id: number,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<DoctorScheduleResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);

    const response = await apiClient.get(
      `/doctors/${id}/schedule?${searchParams.toString()}`
    );
    return response.data;
  },

  generateSchedule: async (
    data: GenerateScheduleFormValues
  ): Promise<{ message: string }> => {
    const response = await apiClient.post("/doctors/schedule/generate", data);
    return response.data;
  },

  assignDoctorsManually: async (
    data: ManualScheduleAssignmentFormValues
  ): Promise<{ message: string }> => {
    const response = await apiClient.post("/doctors/schedule/manual", data);
    return response.data;
  },

  swapShifts: async (
    data: SwapShiftsFormValues | DoctorSwapFromValues
  ): Promise<DoctorSwapResponse> => {
    const response = await apiClient.post("/doctors/schedule/swap", data);
    return response.data;
  },

  getDoctorsByDate: async (
    date: string
  ): Promise<DoctorScheduleByDateResponse> => {
    const response = await apiClient.get(
      `/doctors/schedule/by-date?date=${date}`
    );
    return response.data;
  },

  getWeeklySchedule: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DoctorScheduleResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);

    const response = await apiClient.get(
      `/doctors/schedule/weekly?${searchParams.toString()}`
    );
    return response.data;
  },
};
