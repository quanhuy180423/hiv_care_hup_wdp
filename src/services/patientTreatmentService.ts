import { apiClient } from "@/services/apiClient";
import type {
  ActivePatientTreatmentsResponse,
  ActivePatientTreatmentsSummary,
  BulkPatientTreatmentInput,
  CustomMedicationStats,
  DoctorWorkloadStats,
  EndActiveTreatmentsResult,
  PaginatedActiveTreatmentsResult,
  PatientTreatmentDetailResponse,
  PatientTreatmentFormSubmit,
  PatientTreatmentQueryParams,
  PatientTreatmentResponse,
  PatientTreatmentsResponse,
  TreatmentComplianceStats,
  TreatmentCostAnalysis,
} from "@/types/patientTreatment";

const API_URL = "/patient-treatments";

export const patientTreatmentService = {
  // Create a new patient treatment
  async create(data: PatientTreatmentFormSubmit, autoEndExisting?: boolean) {
    return apiClient.post(API_URL, data, {
      params: autoEndExisting !== undefined ? { autoEndExisting } : undefined,
    });
  },

  // Get all patient treatments with advanced filtering, sorting, search, pagination
  async getAll(
    params: PatientTreatmentQueryParams
  ): Promise<PatientTreatmentsResponse> {
    const res = await apiClient.get<PatientTreatmentsResponse>(API_URL, {
      params,
    });
    return res.data;
  },

  // Get a single patient treatment by ID
  async getById(id: number | string) {
    return apiClient.get<PatientTreatmentDetailResponse>(
      `${API_URL}/${id}`,
      {}
    );
  },

  // Update a patient treatment by ID (partial update)
  async update(id: number | string, data: Partial<PatientTreatmentFormSubmit>) {
    return apiClient.patch(`${API_URL}/${id}`, data, {});
  },

  // Delete a patient treatment by ID
  async delete(id: number | string) {
    return apiClient.delete(`${API_URL}/${id}`, {});
  },

  // Get all treatments for a specific patient (with filters)
  async getByPatient(
    patientId: number | string,
    params: PatientTreatmentQueryParams
  ): Promise<PatientTreatmentsResponse> {
    const res = await apiClient.get<PatientTreatmentsResponse>(
      `${API_URL}/patient/${patientId}`,
      {
        params,
      }
    );
    return res.data;
  },

  // Get all treatments for a specific doctor (with filters)
  async getByDoctor(
    doctorId: number | string,
    params: PatientTreatmentQueryParams
  ): Promise<PatientTreatmentResponse> {
    const res = await apiClient.get<PatientTreatmentResponse>(
      `${API_URL}/doctor/${doctorId}`,
      {
        params,
      }
    );
    return res.data;
  },

  // Search patient treatments (by patient/doctor/protocol/notes)
  async search(params: PatientTreatmentQueryParams) {
    const res = await apiClient.get<PatientTreatmentResponse>(
      `${API_URL}/search`,
      {
        params,
      }
    );
    return res.data;
  },

  // Get treatments by date range
  async getByDateRange(startDate: string, endDate: string) {
    const res = await apiClient.get<PatientTreatmentResponse>(
      `${API_URL}/date-range`,
      {
        params: { startDate, endDate },
      }
    );
    return res.data;
  },

  // Get all active patient treatments (unified, with filters)
  async getActive(params: PatientTreatmentQueryParams) {
    const res = await apiClient.get<PatientTreatmentResponse>(
      `${API_URL}/active`,
      {
        params,
      }
    );
    return res.data;
  },

  // Get treatments with custom medications
  async getWithCustomMedications(params: PatientTreatmentQueryParams) {
    const res = await apiClient.get<PatientTreatmentResponse>(
      `${API_URL}/custom-meds`,
      {
        params,
      }
    );
    return res.data;
  },

  // ===============================
  // STATISTICS & ANALYTICS
  // ===============================

  // Get statistics for a specific patient
  async getPatientStats(patientId: number | string) {
    const res = await apiClient.get<PatientTreatmentResponse>(
      `${API_URL}/stats/patient/${patientId}`,
      {}
    );
    return res.data;
  },

  // Get doctor workload statistics
  async getDoctorWorkloadStats(doctorId: number | string) {
    return apiClient.get<DoctorWorkloadStats>(
      `${API_URL}/stats/doctor/${doctorId}`,
      {}
    );
  },

  // Get custom medication statistics
  async getCustomMedicationStat() {
    return apiClient.get<CustomMedicationStats>(
      `${API_URL}/stats/custom-meds`,
      {}
    );
  },

  // Compare protocol vs custom treatments
  async compareProtocolVsCustom(protocolId: number | string) {
    // The response type should be defined if possible, using unknown for now
    return apiClient.get<unknown>(
      `${API_URL}/compare-protocol/${protocolId}`,
      {}
    );
  },

  // Get treatment compliance statistics for a patient
  async getTreatmentComplianceStats(patientId: number | string) {
    return apiClient.get<TreatmentComplianceStats>(
      `${API_URL}/compliance/${patientId}`,
      {}
    );
  },

  // Get treatment cost analysis (with filters)
  async getTreatmentCostAnalysis(params: PatientTreatmentQueryParams) {
    return apiClient.get<TreatmentCostAnalysis>(`${API_URL}/cost-analysis`, {
      params,
    });
  },

  // ===============================
  // BULK OPERATIONS
  // ===============================

  // Bulk create patient treatments
  async bulkCreate(data: BulkPatientTreatmentInput[]) {
    return apiClient.post(`${API_URL}/bulk`, data, {});
  },

  // End all active treatments for a patient
  async endActiveTreatments(patientId: number | string) {
    return apiClient.post<EndActiveTreatmentsResult>(
      `${API_URL}/end-active/${patientId}`,
      {},
      {}
    );
  },

  // ===============================
  // ENHANCED ACTIVE TREATMENTS & ANALYTICS
  // ===============================

  // Get active treatments for a specific patient (enhanced)
  async getActiveByPatient(
    patientId: number | string
  ): Promise<ActivePatientTreatmentsResponse> {
    const res = await apiClient.get<ActivePatientTreatmentsResponse>(
      `${API_URL}/active/patient/${patientId}`,
      {}
    );
    return res.data;
  },

  // Get comprehensive active treatment summary (optionally patient-specific)
  async getActiveSummary(params: { patientId?: number | string }) {
    return apiClient.get<ActivePatientTreatmentsSummary>(
      `${API_URL}/active/summary`,
      {
        params,
      }
    );
  },

  // Get active treatments with enhanced pagination and search
  async getActivePaginated(params: PatientTreatmentQueryParams) {
    return apiClient.get<PaginatedActiveTreatmentsResult>(
      `${API_URL}/active/paginated`,
      {
        params,
      }
    );
  },
};

export const createPatientTreatment = patientTreatmentService.create;
export const getPatientTreatments = patientTreatmentService.getAll;
export const getPatientTreatmentById = patientTreatmentService.getById;
export const updatePatientTreatment = patientTreatmentService.update;
export const deletePatientTreatment = patientTreatmentService.delete;
export const searchPatientTreatments = patientTreatmentService.search;
export const getActivePatientTreatments = patientTreatmentService.getActive;
