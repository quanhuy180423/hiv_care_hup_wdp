import type {
  DoctorListResponse,
  DoctorQueryParams,
  DoctorResponse,
  DoctorScheduleByDateResponse,
  DoctorScheduleResponse,
} from "@/types/doctor";
import { apiClient } from "./apiClient";

export const doctorService = {
  getAllDoctors: async (
    params: DoctorQueryParams
  ): Promise<DoctorListResponse> => {
    const res = await apiClient.get<DoctorListResponse>("/doctors", { params });
    return res.data;
  },

  getDoctorById: async (id: number): Promise<DoctorResponse> => {
    const res = await apiClient.get<DoctorResponse>(`/doctors/${id}`);
    return res.data;
  },

  getDotorSchedule: async (id: number): Promise<DoctorScheduleResponse> => {
    const res = await apiClient.get<DoctorScheduleResponse>(
      `/doctors/${id}/schedule`
    );
    return res.data;
  },

  getDoctorScheduleAtDay: async (date: string) => {
    const res = await apiClient.get<DoctorScheduleByDateResponse>(
      `/doctors/schedule/by-date`,
      { params: { date } }
    );
    return res.data;
  },
};
