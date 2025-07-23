import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  testService,
  type Query,
  type ReqTest,
  type ResTest,
  type Test,
} from "@/services/testService";

export const useTests = (param?: Query) => {
  return useQuery<ResTest>({
    queryKey: ["tests", param],
    queryFn: () => testService.getAll(param),
  });
};

export const useTest = (id: number) => {
  return useQuery<Test>({
    queryKey: ["test", id],
    queryFn: () => testService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReqTest) => testService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ReqTest> }) =>
      testService.updateById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
  });
};

export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => testService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};
