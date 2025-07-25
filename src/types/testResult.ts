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

export type TestResultCreate = Omit<
  TestResult,
  "id" | "createdAt" | "updatedAt"
>;

export interface TestResultFormValues {
  name: string;
  userId?: number;
  doctorId?: number;
  type: string;
  result: string;
  price?: number;
  description?: string;
  patientTreatmentId?: number;
  resultDate: Date;
}
export interface TestResult {
  id: number;
  name: string;
  userId: number;
  doctorId: number;
  type: string;
  result: string;
  price: number;
  description?: string;
  patientTreatmentId: number;
  resultDate: Date;
  createdAt: string;
  updatedAt: string;
}
export interface TestResultResponse {
  data: TestResult;
  statusCode: number;
  message: string;
}
