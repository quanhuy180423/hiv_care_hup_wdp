import { patientTreatmentSchema } from "@/schemas/patientTreatment";
import {
  createPatientTreatment,
  deletePatientTreatment,
  getActivePatientTreatments,
  getPatientTreatmentById,
  getPatientTreatments,
  patientTreatmentService,
  searchPatientTreatments,
  updatePatientTreatment,
} from "@/services/patientTreatmentService";
import useAuthStore from "@/store/authStore";
import type {
  ActivePatientTreatmentsResponse,
  PatientTreatmentFormSubmit,
  PatientTreatmentQuery,
  PatientTreatmentQueryParams,
  PatientTreatmentsResponse,
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
      // Always return { data, meta } for pagination
      if (res && res.data && res.data.data && res.data.meta) {
        return {
          data: res.data.data,
          meta: res.data.meta,
        };
      }
      // Fallback for array response
      if (Array.isArray(res.data) ) {
        return {
          data: res.data,
          meta: {
            page: 1,
            limit: res.data.length,
            total: res.data.length,
            totalPages: 1,
          },
        };
      }
      // Fallback for empty
      return {
        data: [],
        meta: { page: 1, limit: 0, total: 0, totalPages: 1 },
      };
    },
    ...(options ?? {}),
  });

export const usePatientTreatment = (id: number, options?: UseQueryOptions) =>
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

// Lấy tất cả hồ sơ điều trị của bệnh nhân theo patientId
export const usePatientTreatmentsByPatient = (
  patientId?: number,
  params: PatientTreatmentQueryParams = {}
) => {
  const getAccessToken = useAuthStore((s) => s.getAccessToken);
  const token = getAccessToken();

  return useQuery<PatientTreatmentsResponse>({
    queryKey: ["patient-treatments", "by-patient", patientId, params],
    queryFn: async () => {
      if (!patientId || !token) {
        throw new Error("Missing patientId or access token");
      }

      const response = await patientTreatmentService.getByPatient(
        patientId,
        params
      );

      return response;
    },
    enabled: !!patientId && !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Lấy hồ sơ đang điều trị của bệnh nhân theo patientId
export const useActivePatientTreatmentsByPatient = (patientId?: number) => {
  const getAccessToken = useAuthStore((s) => s.getAccessToken);
  const token = getAccessToken();

  return useQuery<ActivePatientTreatmentsResponse>({
    queryKey: ["patient-treatments", "active-by-patient", patientId],
    queryFn: async () => {
      if (!patientId || !token) {
        throw new Error("Missing patientId or access token");
      }

      const response = await patientTreatmentService.getActiveByPatient(
        patientId
      );

      return response;
    },
    enabled: !!patientId && !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
