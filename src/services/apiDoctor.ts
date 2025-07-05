import { apiClient } from "./apiClient";
import type { Doctor, DoctorListResponse } from "@/types/doctor";

export const fetchDoctor = {
  getAll: async () => {
    const response = await apiClient.get<DoctorListResponse>("/doctors");

    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<DoctorListResponse>(`/doctors/${id}`);

    return response.data;
  },
  getScheduleDoctorAtDay: async (date: string) => {
    const response = await apiClient.get<DoctorListResponse>(
      `/doctors/schedule/by-date?date=${date}`
    );
    return response.data;
  },
  create: async (doctorData: Doctor) => {
    const response = await apiClient.post("/doctors", doctorData);
    return response.data;
  },
  update: async (id: string, doctorData: Partial<Doctor>) => {
    const response = await apiClient.put(`/doctors/${id}`, doctorData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/doctors/${id}`);
    return response.data;
  },
};
