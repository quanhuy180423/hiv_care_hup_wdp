import { testResultService } from "@/services/testResultService";
import { useQuery } from "@tanstack/react-query";

export function useTestResults(patientTreatmentId?: number) {
  return useQuery({
    queryKey: ["testResults", patientTreatmentId],
    queryFn: () =>
      patientTreatmentId
        ? testResultService.getByPatientTreatmentId(patientTreatmentId)
        : [],
    enabled: !!patientTreatmentId,
  });
}
