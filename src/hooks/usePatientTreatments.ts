import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Bạn cần tạo file service và types thực tế cho patient treatment
// Ví dụ dưới đây là mẫu chuẩn hóa, bạn cần sửa lại cho đúng API thực tế

// type mẫu, bạn cần sửa lại cho đúng types thực tế
export interface PatientTreatment {
  id: number;
  appointmentId: number;
  protocol: string;
  medicines: string[];
  tests?: string[];
  createdAt: string;
}

export interface PatientTreatmentFormValues {
  appointmentId: number;
  protocol: string;
  medicines: string[];
  tests?: string[];
}

// Service mẫu, bạn cần thay thế bằng service thực tế
const patientTreatmentService = {
  getByAppointmentId: async (
    appointmentId: number
  ): Promise<PatientTreatment[]> => {
    // Gọi API thực tế ở đây
    return [];
  },
  create: async (
    data: PatientTreatmentFormValues
  ): Promise<PatientTreatment> => {
    // Gọi API thực tế ở đây
    return {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    } as PatientTreatment;
  },
};

// Lấy danh sách hồ sơ điều trị của bệnh nhân theo appointmentId
export const usePatientTreatmentsByAppointment = (appointmentId?: number) => {
  return useQuery<PatientTreatment[]>({
    queryKey: ["patient-treatments", appointmentId],
    queryFn: () => patientTreatmentService.getByAppointmentId(appointmentId!),
    enabled: !!appointmentId,
  });
};

// Tạo mới hồ sơ điều trị
export const useCreatePatientTreatment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatientTreatmentFormValues) =>
      patientTreatmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-treatments"] });
    },
  });
};
