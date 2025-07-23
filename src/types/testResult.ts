// TestResult type for test result records
export interface TestResult {
  id: number;
  patientTreatmentId: number;
  testName: string; // Name of the test
  result: string; // Result of the test
  date: string; // ISO date string
  note?: string; // Optional note for the test result
}

export enum TestInterpretation {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  INDETERMINATE = "INDETERMINATE",
  DETECTED = "DETECTED",
  NOT_DETECTED = "NOT_DETECTED",
}

export function translateInterpretation(
  status: TestInterpretation | string
): string {
  switch (status) {
    case TestInterpretation.POSITIVE:
      return "Dương tính";
    case TestInterpretation.NEGATIVE:
      return "Âm tính";
    case TestInterpretation.INDETERMINATE:
      return "Không xác định / Cần làm lại";
    case TestInterpretation.DETECTED:
      return "Phát hiện";
    case TestInterpretation.NOT_DETECTED:
      return "Không phát hiện";
    default:
      return "Không xác định";
  }
}

export type TestResultCreate = Omit<TestResult, "id">;
