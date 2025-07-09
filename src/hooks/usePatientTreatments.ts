import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import { useAuthStore } from "@/store/authStore";
import type {
  PatientTreatmentType,
  PatientTreatmentFormValues,
} from "@/types/patientTreatment";

// Lấy danh sách hồ sơ điều trị của bệnh nhân theo appointmentId
export const usePatientTreatmentsByAppointment = (
  appointmentId?: number,
  patientId?: number
) => {
  const getAccessToken = useAuthStore((s) => s.getAccessToken);
  const token = getAccessToken();
  return useQuery<PatientTreatmentType[]>({
    queryKey: ["patient-treatments", appointmentId, patientId],
    queryFn: async () => {
      if ((!appointmentId && !patientId) || !token) return [];
      // Nếu cần lọc theo appointmentId, cần API hỗ trợ. Ở đây tạm lọc theo patientId.
      const res = await patientTreatmentService.getAll(
        patientId ? { patientId } : {},
        token
      );
      return res.data?.data || [];
    },
    enabled: (!!appointmentId || !!patientId) && !!token,
  });
};

// Tạo mới hồ sơ điều trị
export const useCreatePatientTreatment = () => {
  const queryClient = useQueryClient();
  const getAccessToken = useAuthStore((s) => s.getAccessToken);
  const token = getAccessToken();
  return useMutation({
    mutationFn: async (data: PatientTreatmentFormValues) => {
      if (!token) throw new Error("No access token");
      const res = await patientTreatmentService.create(data, token);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-treatments"] });
    },
  });
};

// Lấy chi tiết hồ sơ điều trị theo id
export const usePatientTreatmentDetail = (id?: number) => {
  const getAccessToken = useAuthStore((s) => s.getAccessToken);
  const token = getAccessToken();
  return useQuery<PatientTreatmentType | null>({
    queryKey: ["patient-treatment-detail", id],
    queryFn: async () => {
      if (!id || !token) return null;
      const res = await patientTreatmentService.getById(id, token);
      return res.data || null;
    },
    enabled: !!id && !!token,
  });
};

// Cập nhật hồ sơ điều trị
export const useUpdatePatientTreatment = () => {
  const queryClient = useQueryClient();
  const getAccessToken = useAuthStore((s) => s.getAccessToken);
  const token = getAccessToken();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<PatientTreatmentFormValues>;
    }) => {
      if (!token) throw new Error("No access token");
      const res = await patientTreatmentService.update(id, data, token);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patient-treatment-detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["patient-treatments"] });
    },
  });
};

// Xóa hồ sơ điều trị
export const useDeletePatientTreatment = () => {
  const queryClient = useQueryClient();
  const getAccessToken = useAuthStore((s) => s.getAccessToken);
  const token = getAccessToken();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error("No access token");
      const res = await patientTreatmentService.delete(id, token);
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
