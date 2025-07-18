import { apiClient } from "@/services/apiClient";
import type {
  PatientTreatmentFormValues,
  PatientTreatmentType,
  PatientTreatmentQueryParams,
  PatientTreatmentStats,
  DoctorWorkloadStats,
  CustomMedicationStats,
  TreatmentComplianceStats,
  TreatmentCostAnalysis,
  BulkPatientTreatmentInput,
  EndActiveTreatmentsResult,
  ActivePatientTreatmentType,
  ActivePatientTreatmentsSummary,
  PaginatedActiveTreatmentsResult,
  PaginationMeta,
  PatientTreatmentsResponse,
} from "@/types/patientTreatment";

const API_URL = "/patient-treatments";

export const patientTreatmentService = {
  // Create a new patient treatment
  async create(
    data: PatientTreatmentFormValues,
    token: string,
    autoEndExisting?: boolean
  ) {
    return apiClient.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
      params: autoEndExisting !== undefined ? { autoEndExisting } : undefined,
    });
  },

  // Get all patient treatments with advanced filtering, sorting, search, pagination
  async getAll(params: PatientTreatmentQueryParams, token: string) {
    return apiClient.get<{
      data: PatientTreatmentType[];
      meta: PaginationMeta;
    }>(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  // Get a single patient treatment by ID
  async getById(id: number | string, token: string) {
    return apiClient.get<PatientTreatmentType>(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update a patient treatment by ID
  async update(
    id: number | string,
    data: Partial<PatientTreatmentFormValues>,
    token: string
  ) {
    return apiClient.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Delete a patient treatment by ID
  async delete(id: number | string, token: string) {
    return apiClient.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get all treatments for a specific patient (with filters)
  async getByPatient(
    patientId: number | string,
    params: PatientTreatmentQueryParams,
    token: string
  ): Promise<PatientTreatmentsResponse> {
    const res = await apiClient.get<PatientTreatmentsResponse>(
      `${API_URL}/patient/${patientId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return res.data;
  },

  // Get all treatments for a specific doctor (with filters)
  async getByDoctor(
    doctorId: number | string,
    params: PatientTreatmentQueryParams,
    token: string
  ) {
    return apiClient.get<{
      data: PatientTreatmentType[];
      meta: PaginationMeta;
    }>(`${API_URL}/doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  // Search patient treatments (by patient/doctor/protocol/notes)
  async search(params: PatientTreatmentQueryParams, token: string) {
    return apiClient.get<{
      data: PatientTreatmentType[];
      meta: PaginationMeta;
    }>(`${API_URL}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  // Get treatments by date range
  async getByDateRange(startDate: string, endDate: string, token: string) {
    return apiClient.get<{
      data: PatientTreatmentType[];
      meta: PaginationMeta;
    }>(`${API_URL}/date-range`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { startDate, endDate },
    });
  },

  // Get all active patient treatments (unified, with filters)
  async getActive(params: PatientTreatmentQueryParams, token: string) {
    return apiClient.get<{
      data: ActivePatientTreatmentType[];
      meta: PaginationMeta;
    }>(`${API_URL}/active`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  // Get treatments with custom medications
  async getWithCustomMedications(
    params: PatientTreatmentQueryParams,
    token: string
  ) {
    return apiClient.get<{
      data: PatientTreatmentType[];
      meta: PaginationMeta;
    }>(`${API_URL}/custom-meds`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  // ===============================
  // STATISTICS & ANALYTICS
  // ===============================

  // Get statistics for a specific patient
  async getPatientStats(patientId: number | string, token: string) {
    return apiClient.get<PatientTreatmentStats>(
      `${API_URL}/stats/patient/${patientId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Get doctor workload statistics
  async getDoctorWorkloadStats(doctorId: number | string, token: string) {
    return apiClient.get<DoctorWorkloadStats>(
      `${API_URL}/stats/doctor/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Get custom medication statistics
  async getCustomMedicationStats(token: string) {
    return apiClient.get<CustomMedicationStats>(
      `${API_URL}/stats/custom-meds`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Compare protocol vs custom treatments
  async compareProtocolVsCustom(protocolId: number | string, token: string) {
    // The response type should be defined if possible, using unknown for now
    return apiClient.get<unknown>(`${API_URL}/compare-protocol/${protocolId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get treatment compliance statistics for a patient
  async getTreatmentComplianceStats(patientId: number | string, token: string) {
    return apiClient.get<TreatmentComplianceStats>(
      `${API_URL}/compliance/${patientId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Get treatment cost analysis (with filters)
  async getTreatmentCostAnalysis(
    params: PatientTreatmentQueryParams,
    token: string
  ) {
    return apiClient.get<TreatmentCostAnalysis>(`${API_URL}/cost-analysis`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  },

  // ===============================
  // BULK OPERATIONS
  // ===============================

  // Bulk create patient treatments
  async bulkCreate(data: BulkPatientTreatmentInput[], token: string) {
    return apiClient.post(`${API_URL}/bulk`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // End all active treatments for a patient
  async endActiveTreatments(patientId: number | string, token: string) {
    return apiClient.post<EndActiveTreatmentsResult>(
      `${API_URL}/end-active/${patientId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // ===============================
  // ENHANCED ACTIVE TREATMENTS & ANALYTICS
  // ===============================

  // Get active treatments for a specific patient (enhanced)
  async getActiveByPatient(patientId: number | string, token: string) {
    return apiClient.get<ActivePatientTreatmentType[]>(
      `${API_URL}/active/patient/${patientId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Get comprehensive active treatment summary (optionally patient-specific)
  async getActiveSummary(
    params: { patientId?: number | string },
    token: string
  ) {
    return apiClient.get<ActivePatientTreatmentsSummary>(
      `${API_URL}/active/summary`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
  },

  // Get active treatments with enhanced pagination and search
  async getActivePaginated(params: PatientTreatmentQueryParams, token: string) {
    return apiClient.get<PaginatedActiveTreatmentsResult>(
      `${API_URL}/active/paginated`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
  },
};
