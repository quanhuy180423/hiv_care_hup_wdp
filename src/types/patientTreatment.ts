export interface CustomMedication {
  id: number; // id là bắt buộc
  name: string;
  unit: string;
  dose: string;
  price: string;
  createdAt: string;
  updatedAt: string;
  duration?: string;
  notes?: string;
}

export interface PatientTreatmentFormValues {
  diagnosis: string;
  treatmentProtocol: string;
  medicines: CustomMedication[];
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
}

export interface PatientTreatmentStats {
  totalTreatments: number;
  activeTreatments: number;
  completedTreatments: number;
}

export interface DoctorWorkloadStats {
  doctorId: number;
  totalPatients: number;
  totalTreatments: number;
}

export interface CustomMedicationStats {
  totalCustomMedications: number;
  mostCommonMedications: string[];
}

export interface TreatmentComplianceStats {
  patientId: number;
  complianceRate: number;
  missedDoses: number;
}

export interface TreatmentCostAnalysis {
  totalCost: number;
  averageCost: number;
  breakdown: Record<string, number>;
}

export interface BulkPatientTreatmentInput {
  patientId: number;
  protocolId: number;
  doctorId: number;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface EndActiveTreatmentsResult {
  endedCount: number;
  affectedTreatmentIds: number[];
}

export interface ActivePatientTreatmentType {
  id: number;
  patientId: number;
  protocolId: number;
  doctorId: number;
  startDate: string;
  endDate?: string;
}

export interface ActivePatientTreatmentsSummary {
  totalActive: number;
  patients: Array<{ patientId: number; activeTreatments: number }>;
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
