import { type TestResult } from "@/types/testResult";
import { testResultService } from "@/services/testResultService";
import { useQuery } from "@tanstack/react-query";

export function useTestResults(patientTreatmentId: number) {
  return useQuery<TestResult[]>({
    queryKey: ["testResults", "patientTreatment", patientTreatmentId],
    queryFn: async () => {
      const res = await testResultService.getByPatientTreatmentId(
        patientTreatmentId
      );
      return (
        res.data?.data.map((item) => ({
          id: item.id,
          patientTreatmentId: item.patientTreatmentId,
          testName: item.test?.name || "Unknown",
          result: item.rawResultValue?.toString() || "N/A",
          date: item.resultDate || new Date().toISOString(),
          note: item.notes || undefined,
        })) || []
      );
    },
    enabled: !!patientTreatmentId,
  });
}
