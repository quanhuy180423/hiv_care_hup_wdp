import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { treatmentProtocolService } from "@/services/treatmentProtocolService";
import type {
  TreatmentProtocol,
  CreateTreatmentProtocol,
  UpdateTreatmentProtocol,
  QueryTreatmentProtocol,
  AdvancedSearchTreatmentProtocol,
  CloneTreatmentProtocol,
  BulkCreateTreatmentProtocol,
  FindTreatmentProtocolByName,
  UsageStatsQuery,
  PopularProtocolsQuery,
  CreateCustomProtocolFromTreatment,
  ProtocolComparison,
  ProtocolTrendAnalysis,
  PaginatedResponse,
} from "@/types/treatmentProtocol";

// Query keys
export const treatmentProtocolKeys = {
  all: ["treatment-protocols"] as const,
  lists: () => [...treatmentProtocolKeys.all, "list"] as const,
  list: (params: QueryTreatmentProtocol) => [...treatmentProtocolKeys.lists(), params] as const,
  details: () => [...treatmentProtocolKeys.all, "detail"] as const,
  detail: (id: number) => [...treatmentProtocolKeys.details(), id] as const,
  search: (query: string) => [...treatmentProtocolKeys.all, "search", query] as const,
  advancedSearch: (params: AdvancedSearchTreatmentProtocol) => [...treatmentProtocolKeys.all, "advanced-search", params] as const,
  usageStats: (id: number) => [...treatmentProtocolKeys.all, "usage-stats", id] as const,
  popularProtocols: (params?: PopularProtocolsQuery) => [...treatmentProtocolKeys.all, "popular", params] as const,
  customVariations: () => [...treatmentProtocolKeys.all, "custom-variations"] as const,
  effectivenessMetrics: (id: number) => [...treatmentProtocolKeys.all, "effectiveness", id] as const,
  costEstimation: (id: number) => [...treatmentProtocolKeys.all, "cost-estimation", id] as const,
  trendAnalysis: (params: ProtocolTrendAnalysis) => [...treatmentProtocolKeys.all, "trend-analysis", params] as const,
};

// Queries
export const useTreatmentProtocols = (params?: QueryTreatmentProtocol) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.list(params || {}),
    queryFn: () => treatmentProtocolService.getAllTreatmentProtocols(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTreatmentProtocol = (id: number) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.detail(id),
    queryFn: () => treatmentProtocolService.getTreatmentProtocolById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchTreatmentProtocols = (query: string) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.search(query),
    queryFn: () => treatmentProtocolService.searchTreatmentProtocols(query),
    enabled: !!query,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdvancedSearchTreatmentProtocols = (params: AdvancedSearchTreatmentProtocol) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.advancedSearch(params),
    queryFn: () => treatmentProtocolService.advancedSearchTreatmentProtocols(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useFindTreatmentProtocolByName = (params: FindTreatmentProtocolByName) => {
  return useQuery({
    queryKey: [...treatmentProtocolKeys.all, "find-by-name", params],
    queryFn: () => treatmentProtocolService.findTreatmentProtocolByName(params),
    enabled: !!params.name,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProtocolUsageStats = (id: number, params?: UsageStatsQuery) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.usageStats(id),
    queryFn: () => treatmentProtocolService.getProtocolUsageStats(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMostPopularProtocols = (params?: PopularProtocolsQuery) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.popularProtocols(params),
    queryFn: () => treatmentProtocolService.getMostPopularProtocols(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProtocolsWithCustomVariations = () => {
  return useQuery({
    queryKey: treatmentProtocolKeys.customVariations(),
    queryFn: () => treatmentProtocolService.getProtocolsWithCustomVariations(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useProtocolEffectivenessMetrics = (id: number) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.effectivenessMetrics(id),
    queryFn: () => treatmentProtocolService.getProtocolEffectivenessMetrics(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProtocolCostEstimation = (id: number) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.costEstimation(id),
    queryFn: () => treatmentProtocolService.getProtocolCostEstimation(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProtocolTrendAnalysis = (params: ProtocolTrendAnalysis) => {
  return useQuery({
    queryKey: treatmentProtocolKeys.trendAnalysis(params),
    queryFn: () => treatmentProtocolService.getProtocolTrendAnalysis(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateTreatmentProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTreatmentProtocol) => treatmentProtocolService.createTreatmentProtocol(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentProtocolKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Create treatment protocol error:", error);
    },
  });
};

export const useUpdateTreatmentProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTreatmentProtocol }) =>
      treatmentProtocolService.updateTreatmentProtocol(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: treatmentProtocolKeys.lists() });
      queryClient.invalidateQueries({ queryKey: treatmentProtocolKeys.detail(id) });
    },
    onError: (error: any) => {
      console.error("Update treatment protocol error:", error);
    },
  });
};

export const useDeleteTreatmentProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => treatmentProtocolService.deleteTreatmentProtocol(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentProtocolKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Delete treatment protocol error:", error);
    },
  });
};

export const useCloneTreatmentProtocol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CloneTreatmentProtocol }) =>
      treatmentProtocolService.cloneTreatmentProtocol(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentProtocolKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Clone treatment protocol error:", error);
    },
  });
};

export const useBulkCreateTreatmentProtocols = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateTreatmentProtocol) => treatmentProtocolService.bulkCreateTreatmentProtocols(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: treatmentProtocolKeys.lists() });
      
    },
    onError: (error: any) => {
      console.error("Bulk create treatment protocols error:", error);
    },
  });
};

export const useCreateCustomProtocolFromTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ treatmentId, data }: { treatmentId: number; data: CreateCustomProtocolFromTreatment }) =>
      treatmentProtocolService.createCustomProtocolFromTreatment(treatmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentProtocolKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Create custom protocol error:", error);
    },
  });
};

export const useProtocolComparison = () => {
  return useMutation({
    mutationFn: (data: ProtocolComparison) => treatmentProtocolService.getProtocolComparison(data),
    onError: (error: any) => {
      console.error("Protocol comparison error:", error);
    },
  });
}; 