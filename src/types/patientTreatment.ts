export interface PatientTreatmentFormValues {
  diagnosis: string;
  treatmentProtocol: string;
  medicines: Array<{
    name: string;
    dosage: string;
  }>;
  tests: Array<{
    name: string;
  }>;
  notes?: string;
}

export interface PatientTreatmentType {
  id: number;
  patientId: number;
  protocolId: number;
  doctorId: number;
  customMedications?: Record<string, unknown> | null;
  notes?: string | null;
  startDate: string;
  endDate?: string | null;
  createdById: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface PatientTreatmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  patientId?: number;
  doctorId?: number;
  protocolId?: number;
  startDate?: string;
  endDate?: string;
  // Add more specific filter fields as needed
}

export interface PatientTreatmentStats {
  totalTreatments: number;
  activeTreatments: number;
  completedTreatments: number;
  // Add more specific stats fields as needed
}

export interface DoctorWorkloadStats {
  doctorId: number;
  totalPatients: number;
  totalTreatments: number;
  // Add more specific workload fields as needed
}

export interface CustomMedicationStats {
  totalCustomMedications: number;
  mostCommonMedications: string[];
  // Add more specific stats fields as needed
}

export interface TreatmentComplianceStats {
  patientId: number;
  complianceRate: number;
  missedDoses: number;
  // Add more specific compliance fields as needed
}

export interface TreatmentCostAnalysis {
  totalCost: number;
  averageCost: number;
  breakdown: Record<string, number>;
  // Add more specific cost analysis fields as needed
}

export interface BulkPatientTreatmentInput {
  patientId: number;
  protocolId: number;
  doctorId: number;
  startDate: string;
  endDate?: string;
  notes?: string;
  // Add more specific bulk input fields as needed
}

export interface EndActiveTreatmentsResult {
  endedCount: number;
  affectedTreatmentIds: number[];
  // Add more specific result fields as needed
}

export interface ActivePatientTreatmentType {
  id: number;
  patientId: number;
  protocolId: number;
  doctorId: number;
  startDate: string;
  endDate?: string;
  // Add more specific active treatment fields as needed
}

export interface ActivePatientTreatmentsSummary {
  totalActive: number;
  patients: Array<{ patientId: number; activeTreatments: number }>;
  // Add more specific summary fields as needed
}

export interface PaginatedActiveTreatmentsResult {
  data: ActivePatientTreatmentType[];
  meta: { page: number; limit: number; total: number };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}
