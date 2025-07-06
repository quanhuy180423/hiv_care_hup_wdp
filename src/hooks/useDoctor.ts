import { doctorService } from "@/services/doctorService";
import type { DoctorQueryParams } from "@/types/doctor";
import { useQuery } from "@tanstack/react-query";

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
