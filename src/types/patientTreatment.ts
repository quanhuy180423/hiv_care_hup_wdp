import type { CustomMedicationItem } from "@/schemas/patientTreatment";
import type { PaginatedResponse } from "./common";

// --- User/Patient/Doctor Types ---
export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface PatientInfo extends UserInfo {
  phoneNumber: string;
}

export interface DoctorInfo {
  id: number;
  userId: number;
  specialization: string;
  certifications: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserInfo;
}

// --- Medicine/Protocol Types ---
export interface MedicineInfo {
  id: number;
  name: string;
  description: string;
  unit: string;
  dose: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProtocolMedicineInfo {
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
  medicine: MedicineInfo;
}

export interface ProtocolInfo {
  id: number;
  name: string;
  description: string;
  targetDisease: string;
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
  medicines: ProtocolMedicineInfo[];
}

// --- Custom Medication Types ---
export interface CustomMedications {
  additionalMeds: CustomMedicationItem[];
}

export type TreatmentMedicineSubmit = {
  medicineId: number;
  dosage: string;
  duration: string;
  notes?: string;
};

export interface Test {
  id: number;
  name: string;
  description: string;
  method: string;
  category: string;
  isQuantitative: boolean;
  unit: string;
  cutOffValue: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  id: number;
  testId: number;
  rawResultValue: string;
  interpretation: string;
  unit: string;
  cutOffValueUsed: string;
  patientTreatmentId: number;
  userId: number;
  labTechId: number | null;
  createdByDoctorId: number | null;
  resultDate: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  test?: Test;
}

export interface PatientTreatmentType {
  id: number;
  patientId: number;
  protocolId: number;
  doctorId: number;
  customMedications?: CustomMedicationItem[];
  notes?: string | null;
  startDate: string;
  endDate?: string | null;
  createdById: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  status?: boolean;
  isAnonymous?: boolean;
  patient?: PatientInfo;
  protocol?: ProtocolInfo;
  doctor?: DoctorInfo;
  createdBy?: UserInfo;
  testResults: TestResult[];
}

export interface PatientTreatmentsResponse {
  data: {
    data: PatientTreatmentType[];
    meta: PaginationMeta;
  };
  statusCode: number;
  message: string;
}

export interface ActivePatientTreatment {
  id: number;
  patientId: number;
  protocolId: number;
  doctorId: number;
  customMedications?: CustomMedicationItem[];
  notes?: string | null;
  startDate: string;
  endDate?: string | null;
  createdById: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  status?: boolean;
  isAnonymous?: boolean;
  patient?: PatientInfo;
  protocol?: ProtocolInfo;
  doctor?: DoctorInfo;
  createdBy?: UserInfo;
  testResults: TestResult[];
  isCurrent: boolean;
  isStarted: boolean;
  daysRemaining: number | null;
  treatmentStatus: string;
}

export type ActivePatientTreatmentType = ActivePatientTreatment;

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

export interface PatientTreatmentType {
  id: number;
  patientId: number;
  protocolId: number;
  doctorId: number;
  customMedications?: CustomMedicationItem[];
  notes?: string | null;
  startDate: string;
  endDate?: string | null;
  createdById: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  status?: boolean;
  isAnonymous?: boolean;
  patient?: PatientInfo;
  protocol?: ProtocolInfo;
  doctor?: DoctorInfo;
  createdBy?: UserInfo;
  testResults: TestResult[];
}

export interface ActivePatientTreatmentsResponse {
  data: ActivePatientTreatment[];
  statusCode: number;
  message: string;
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
  protocolId: number | undefined;
  doctorId: number;
  customMedications?: CustomMedicationItem[];
  notes?: string;
  startDate: string;
  endDate?: string;
  total: number;
  isAnonymous?: boolean; // Added isAnonymous
};

export type CreatePatientTreatmentInput = {
  patientId: number;
  protocolId: number;
  doctorId: number;
  startDate: string;
  endDate?: string;
  notes?: string;
  customMedications?: CustomMedicationItem[];
  isAnonymous?: boolean; // Added isAnonymous
};

export type PatientTreatmentResponse = {
  data: PaginatedResponse<PatientTreatmentType>;
};

export type UpdatePatientTreatmentInput = Partial<CreatePatientTreatmentInput>;

export type PatientTreatmentQuery = PatientTreatmentQueryParams;

export interface PatientTreatmentDetailResponse {
  data: PatientTreatmentType & {
    customMedications?: Array<{
      dosage: string;
      schedule?: string;
      frequency?: string;
      durationUnit?: string;
      medicineName: string;
      durationValue?: number;
      medicineId?: number | string;
      notes?: string;
    }>;
    protocol?: ProtocolInfo & {
      medicines?: Array<
        ProtocolMedicineInfo & {
          medicine?: MedicineInfo;
        }
      >;
    };
    doctor?: DoctorInfo & {
      user?: UserInfo;
    };
    createdBy?: UserInfo;
    patient?: PatientInfo;
  };
  statusCode: number;
  message: string;
}
