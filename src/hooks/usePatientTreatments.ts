import { patientTreatmentSchema } from "@/schemas/patientTreatment";
import {
  createPatientTreatment,
  deletePatientTreatment,
  getActivePatientTreatments,
  getPatientTreatmentById,
  getPatientTreatments,
  searchPatientTreatments,
  updatePatientTreatment,
} from "@/services/patientTreatmentService";
import type {
  PatientTreatmentFormSubmit,
  PatientTreatmentQuery,
  UpdatePatientTreatmentInput,
} from "@/types/patientTreatment";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

export const usePatientTreatments = (
  query: PatientTreatmentQuery,
  options?: UseQueryOptions
) =>
  useQuery({
    queryKey: ["patientTreatments", query],
    queryFn: async () => {
      const res = await getPatientTreatments(query);
      return res.data.data;
    },
    ...(options ?? {}),
  });

export const usePatientTreatment = (
  id: number,
  options?: UseQueryOptions
) =>
  useQuery({
    queryKey: ["patientTreatment", id],
    queryFn: async () => {
      const res = await getPatientTreatmentById(id);
      return patientTreatmentSchema.parse(res);
    },
    enabled: !!id,
    ...(options ?? {}),
  });

export const useCreatePatientTreatment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PatientTreatmentFormSubmit) =>
      createPatientTreatment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientTreatments"] });
    },
  });
};

export const useUpdatePatientTreatment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdatePatientTreatmentInput;
    }) => updatePatientTreatment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientTreatments"] });
    },
  });
};

export const useDeletePatientTreatment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePatientTreatment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientTreatments"] });
    },
  });
};

export const useSearchPatientTreatments = (
  params: PatientTreatmentQuery,
  options?: UseQueryOptions
) =>
  useQuery({
    queryKey: ["searchPatientTreatments", params],
    queryFn: async () => {
      const res = await searchPatientTreatments(params);
      return res.data;
    },
    ...options,
  });

export const useActivePatientTreatments = (
  params: PatientTreatmentQuery,
  options?: UseQueryOptions
) =>
  useQuery({
    queryKey: ["activePatientTreatments", params],
    queryFn: async () => {
      const res = await getActivePatientTreatments(params);
      return res.data;
    },
    ...options,
  });
