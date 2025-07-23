import {
  testResultService,
  type TestResult,
} from "@/services/testResultService";
import { useQuery } from "@tanstack/react-query";

export function useTestResults(patientTreatmentId: number) {
  return useQuery<TestResult[]>({
    queryKey: ["testResults", "patientTreatment", patientTreatmentId],
    queryFn: async () => {
      const res = await testResultService.getByPatientTreatmentId(
        patientTreatmentId
      );
      return res.data?.data || [];
    },
    enabled: !!patientTreatmentId,
  });
}
