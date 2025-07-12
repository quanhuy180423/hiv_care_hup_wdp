export enum MedicationSchedule {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  NIGHT = "NIGHT",
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProtocolMedicine {
  id?: number;
  medicineId: number;
  dosage: string;
  duration: MedicationSchedule;
  notes?: string;
  medicine?: {
    id: number;
    name: string;
    description?: string;
    unit: string;
    dose: string;
    price: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TreatmentProtocol {
  id: number;
  name: string;
  description?: string;
  targetDisease: string;
  medicines?: ProtocolMedicine[];
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
  updatedBy?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateTreatmentProtocol {
  name: string;
  description?: string;
  targetDisease: string;
  medicines: ProtocolMedicine[];
}

export interface UpdateTreatmentProtocol {
  name?: string;
  description?: string;
  targetDisease?: string;
  medicines?: ProtocolMedicine[];
}

export interface QueryTreatmentProtocol {
  page?: string;
  limit?: string;
  search?: string;
  targetDisease?: string;
  sortBy?: "name" | "targetDisease" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface AdvancedSearchTreatmentProtocol {
  query?: string;
  targetDisease?: string;
  createdById?: number;
  minMedicineCount?: number;
  maxMedicineCount?: number;
  page?: string;
  limit?: string;
}

export interface CloneTreatmentProtocol {
  newName: string;
}

export interface BulkCreateTreatmentProtocol {
  protocols: CreateTreatmentProtocol[];
  skipDuplicates?: boolean;
}

export interface FindTreatmentProtocolByName {
  name: string;
}

export interface UsageStatsQuery {
  startDate?: string;
  endDate?: string;
  includeInactive?: boolean;
}

export interface PopularProtocolsQuery {
  limit?: number;
  period?: "week" | "month" | "quarter" | "year" | "all";
}

export interface CreateCustomProtocolFromTreatment {
  name: string;
  description?: string;
  targetDisease: string;
}

export interface ProtocolComparison {
  protocolIds: number[];
}

export interface ProtocolTrendAnalysis {
  startDate?: string;
  endDate?: string;
  disease?: string;
  limit?: number;
}

export interface ProtocolEffectivenessMetrics {
  protocol: TreatmentProtocol | null;
  totalUsages: number;
  completedTreatments: number;
  activeTreatments: number;
  averageTreatmentDuration: number | null;
  averageCost: number;
  successRate: number | null;
}

export interface ProtocolUsageStats {
  protocolId: number;
  protocolName: string;
  totalUsage: number;
  activeUsage: number;
  completedUsage: number;
  successRate: number;
}

export interface PopularProtocol {
  protocol: TreatmentProtocol;
  usageCount: number;
  successRate: number;
}

export interface ProtocolWithCustomVariations {
  protocol: TreatmentProtocol;
  customVariationCount: number;
  mostCommonVariations: string[];
}

export interface ProtocolCostEstimation {
  protocolId: number;
  protocolName: string;
  totalCost: number;
  medicinesCost: Array<{
    medicineId: number;
    medicineName: string;
    unitPrice: number;
    dosage: string;
    duration: string;
    estimatedCost: number;
  }>;
}

// Legacy types for backward compatibility
export type TreatmentProtocolType = TreatmentProtocol;

export type TreatmentProtocolsResponse = PaginatedResponse<TreatmentProtocol>;
