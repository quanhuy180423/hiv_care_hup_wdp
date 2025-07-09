import { apiClient } from "@/services/apiClient";
import type {
  TreatmentProtocolsResponse,
  TreatmentProtocolType,
} from "@/types/treatmentProtocol";

const API_URL = "/treatment-protocols";

export const treatmentProtocolsService = {
  async getAll({
    page = 1,
    limit = 20,
    search = "",
    targetDisease = "HIV",
    sortBy = "createdAt",
    sortOrder = "desc",
    token,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    targetDisease?: string;
    sortBy?: string;
    sortOrder?: string;
    token: string;
  }): Promise<TreatmentProtocolsResponse> {
    const res = await apiClient.get(API_URL, {
      params: { page, limit, search, targetDisease, sortBy, sortOrder },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  async create(
    data: {
      name: string;
      description: string;
      targetDisease: string;
      medicines: Array<{
        medicineId: number;
        dosage: string;
        duration: string;
        notes?: string;
      }>;
    },
    token: string
  ) {
    return apiClient.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async update(
    id: number,
    data: {
      name: string;
      description: string;
      targetDisease: string;
      medicines: Array<{
        medicineId: number;
        dosage: string;
        duration: string;
        notes?: string;
      }>;
    },
    token: string
  ) {
    return apiClient.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async delete(id: number, token: string) {
    return apiClient.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Tạo các cuộc hẹn tái khám cho bệnh nhân dựa vào phác đồ điều trị
  async createFollowupAppointments({
    patientId,
    doctorId,
    protocol,
    startDate,
    serviceId,
  }: {
    patientId: number;
    doctorId: number;
    protocol: TreatmentProtocolType;
    startDate: string; // ISO string
    token: string;
    serviceId?: number; // fallback nếu không lấy từ medicine
  }) {
    // Sử dụng duration nếu có, nếu không thì mặc định mỗi lần cách nhau 7 ngày
    const appointments = protocol.medicines.map((med, idx) => {
      let days = 7;
      if (typeof med.duration === "number") days = med.duration;
      // Nếu duration là enum (MORNING/AFTERNOON/NIGHT), có thể map sang số ngày nếu cần
      const revisitDate = new Date(startDate);
      revisitDate.setDate(revisitDate.getDate() + idx * days);
      return {
        userId: patientId,
        doctorId,
        serviceId: med.id || serviceId || 1,
        appointmentTime: revisitDate.toISOString(),
        isAnonymous: false,
        type: "OFFLINE" as const,
        notes: `Tái khám theo phác đồ: ${protocol.name}`,
      };
    });
    // Bulk tạo appointments nếu backend hỗ trợ, nếu không thì tuần tự
    const { appointmentService } = await import(
      "@/services/appointmentService"
    );
    const results = [];
    for (const appt of appointments) {
      results.push(await appointmentService.createAppointment(appt));
    }
    return results;
  },
};
