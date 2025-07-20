// TestResult type for test result records
export interface TestResult {
  id: number;
  patientTreatmentId: number;
  testName: string;
  result: string;
  date: string; // ISO date string
  note?: string;
}

export type TestResultCreate = Omit<TestResult, "id">;
