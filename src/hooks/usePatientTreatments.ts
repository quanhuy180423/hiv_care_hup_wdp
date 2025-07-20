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
  PatientTreatmentType,
  PatientTreatmentFormValues,
  PatientTreatmentQueryParams,
  PatientTreatmentsResponse,
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
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["patient-treatment-detail", id],
      });
      queryClient.invalidateQueries({ queryKey: ["patient-treatments"] });
    },
  });
};

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
        params,
        token
      );

      return response;
    },
    enabled: !!patientId && !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
