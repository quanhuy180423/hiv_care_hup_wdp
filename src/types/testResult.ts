export interface TestResultFormValues {
  name: string;
  userId: number | undefined;
  doctorId: number | undefined;
  type: string;
  result: string;
  price: number | undefined;
  description?: string; // Allow undefined
  patientTreatmentId: number | undefined;
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
