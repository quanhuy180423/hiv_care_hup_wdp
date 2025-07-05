import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDoctor } from "../services/apiDoctor";
import type { Doctor } from "../types/doctor";

export const useDoctor = () => {
  const queryClient = useQueryClient();

  // Get all doctors for admin
  const {
    data: doctors,
    isLoading: isDoctorsLoading,
    error: doctorsError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => fetchDoctor.getAll(),
  });

  // Get doctor by ID
  const useGetDoctorById = (id: string) =>
    useQuery({
      queryKey: ["doctor", id],
      queryFn: () => fetchDoctor.getById(id),
    });

  // Get schedule by doctor ID
  const useGetScheduleByDoctorId = (id: string) =>
    useQuery({
      queryKey: ["doctorSchedule", id],
      queryFn: () => fetchDoctor.getScheduleDoctorAtDay(id),
    });

  // Get list of doctors at a specific date
  const useGetListDoctorAtDate = (date: string) =>
    useQuery({
      queryKey: ["doctorsByDate", date],
      queryFn: () => fetchDoctor.getScheduleDoctorAtDay(date),
    });

  // Create doctor
  const createDoctor = useMutation({
    mutationFn: (doctorData: Doctor) => fetchDoctor.create(doctorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  // Update doctor
  const updateDoctor = useMutation({
    mutationFn: ({
      id,
      doctorData,
    }: {
      id: string;
      doctorData: Partial<Doctor>;
    }) => fetchDoctor.update(id, doctorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  // Delete doctor
  const deleteDoctor = useMutation({
    mutationFn: (id: string) => fetchDoctor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  return {
    doctors,
    isDoctorsLoading,
    doctorsError,
    useGetDoctorById,
    useGetScheduleByDoctorId,
    useGetListDoctorAtDate,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
};
