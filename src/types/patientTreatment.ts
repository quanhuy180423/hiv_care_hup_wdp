import type { PaginatedResponse } from "./common";

export interface CustomMedication {
  id: number;
  name: string;
  unit: string;
  dose: string;
  price: string;
  createdAt: string;
  updatedAt: string;
  duration?: string;
  notes?: string;
}

export type TreatmentMedicineSubmit = {
  medicineId: number;
  dosage: string;
  duration: string;
  notes?: string;
};

export interface PatientTreatmentType {
  id: number;
  patientId: number;
  protocolId: number;
  doctorId: number;
  customMedications?: Array<{
    id: number;
    note: string;
    dosage: string;
    schedule: string;
  }>;
  notes?: string | null;
  startDate: string;
  endDate?: string | null;
  createdById: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
  };
  protocol?: {
    id: number;
    name: string;
    description: string;
    targetDisease: string;
    createdById: number;
    updatedById: number;
    createdAt: string;
    updatedAt: string;
    medicines: Array<{
      id: number;
      protocolId: number;
      medicineId: number;
      dosage: string;
      durationValue: number;
      durationUnit: string;
      schedule: string;
      notes: string;
      createdAt: string;
      updatedAt: string;
      medicine: {
        id: number;
        name: string;
        description: string;
        unit: string;
        dose: string;
        price: string;
        createdAt: string;
        updatedAt: string;
      };
    }>;
  };
  doctor?: {
    id: number;
    userId: number;
    specialization: string;
    certifications: string[];
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PatientTreatmentsResponse {
  data: {
    data: PatientTreatmentType[];
    meta: PaginationMeta;
  };
  statusCode: number;
  message: string;
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
  includeCompleted?: boolean;
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

export type PatientTreatmentFormSubmit = {
  patientId: number;
  protocolId: number;
  doctorId: number;
  customMedications?: Record<string, unknown>;
  notes?: string;
  startDate: string;
  endDate?: string;
  total: number;
};

export type CreatePatientTreatmentInput = {
  patientId: number;
  protocolId: number;
  doctorId: number;
  startDate: string;
  endDate?: string;
  notes?: string;
};

export type PatientTreatmentResponse = {
  data: PaginatedResponse<PatientTreatmentType>;
};

export type UpdatePatientTreatmentInput = Partial<CreatePatientTreatmentInput>;

export type PatientTreatmentQuery = PatientTreatmentQueryParams;
