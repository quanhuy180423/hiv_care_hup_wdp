// src/hooks/useTestResults.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  testResultService,
  type ReqTestResult,
  type ResTestResult,
  type TestResult,
  type ReqTestResultUpdate,
} from "@/services/testResultService";

export const useTestResults = () => {
  return useQuery<ResTestResult>({
    queryKey: ["testResults"],
    queryFn: testResultService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTestResult = (id: number) => {
  return useQuery<TestResult>({
    queryKey: ["testResult", id],
    queryFn: () => testResultService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTestResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReqTestResult) => testResultService.createByDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testResults"] });
    },
  });
};

export const useUpdateTestResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ReqTestResultUpdate>;
    }) => testResultService.updateById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testResults"] });
      queryClient.invalidateQueries({ queryKey: ["testResult"] });
    },
  });
};

export const useDeleteTestResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => testResultService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testResults"] });
    },
  });
};

export const useTestResultsByPatientTreatmentId = (
  patientTreatmentId: number
) => {
  return useQuery<TestResult[]>({
    queryKey: ["testResults", "patientTreatment", patientTreatmentId],
    queryFn: async () => {
      const res = await testResultService.getByPatientTreatmentId(
        patientTreatmentId
      );
      return res.data;
    },
    enabled: !!patientTreatmentId,
  });
};

export const useTestResultsByStatus = (status: string) => {
  return useQuery<TestResult[]>({
    queryKey: ["testResults", "status", status],
    queryFn: async () => {
      const res = await testResultService.getByStatus(status);
      return res.data;
    },
    enabled: !!status,
  });
};
