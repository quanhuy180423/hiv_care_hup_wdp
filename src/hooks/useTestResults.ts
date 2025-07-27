import { testResultService } from "@/services/testResultService";
import { useQuery } from "@tanstack/react-query";

/**
 * Mapped test result for display in UI
 */
export type MappedTestResult = {
  id: number;
  patientTreatmentId: number;
  testName: string;
  result: string;
  date: string;
  note?: string;
};

/**
 * Fetch and map test results for a given patient treatment
 */
export function useTestResults(patientTreatmentId: number) {
  return useQuery<MappedTestResult[]>({
    queryKey: ["testResults", "patientTreatment", patientTreatmentId],
    enabled: !!patientTreatmentId,
    queryFn: async () => {
      const res = await testResultService.getByPatientTreatmentId(
        patientTreatmentId
      );
      const items = res.data?.data ?? [];
      return items.map((item) => ({
        id: item.id,
        patientTreatmentId: item.patientTreatmentId,
        testName: item.test?.name || "Unknown",
        result: item.rawResultValue?.toString() || "N/A",
        date: item.resultDate || new Date().toISOString(),
        note: item.notes || undefined,
      }));
    },
  });
}
