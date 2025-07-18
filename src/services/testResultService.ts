import { apiClient } from "@/services/apiClient";

export enum TestInterpretation {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  INDETERMINATE = "INDETERMINATE",
  DETECTED = "DETECTED",
  NOT_DETECTED = "NOT_DETECTED",
}
export interface TestResult {
  id: number;
  testId: number;
  userId: number;
  patientTreatmentId: number;
  rawResultValue: number;
  unit: string | null;
  interpretation: TestInterpretation;
  cutOffValueUsed: number | null;
  labTechId: number;
  resultDate: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface ResTestResult {
  data: TestResult[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
export interface ReqTestResult {
  testId: number;
  userId: number;
  patientTreatmentId: number;
}

export interface ReqTestResultUpdate {
  rawResultValue: number;
  notes: string;
  resultDate: string;
}
export const testResultService = {
  async createByDoctor(data: ReqTestResult): Promise<ResTestResult> {
    const response = await apiClient.post<ResTestResult>("/test-results", data);
    return response.data;
  },
  async getAll(): Promise<ResTestResult> {
    const response = await apiClient.get<ResTestResult>("/test-results");
    return response.data;
  },
  async getById(id: number): Promise<TestResult> {
    const response = await apiClient.get<TestResult>(`/test-results/${id}`);
    return response.data;
  },
  async getByPatientTreatmentId(
    patientTreatmentId: number
  ): Promise<ResTestResult> {
    const response = await apiClient.get<ResTestResult>(
      `/test-results/patient-treatment/${patientTreatmentId}`
    );
    return response.data;
  },
  async getByStatus(status: string): Promise<ResTestResult> {
    const response = await apiClient.get<ResTestResult>(
      `/test-results/status/${status}`
    );
    return response.data;
  },
  async updateById(
    id: number,
    data: Partial<ReqTestResultUpdate>
  ): Promise<TestResult> {
    const response = await apiClient.put<TestResult>(
      `/test-results/${id}`,
      data
    );
    return response.data;
  },
  async deleteById(id: number): Promise<void> {
    await apiClient.delete(`/test-results/${id}`);
  },
};
