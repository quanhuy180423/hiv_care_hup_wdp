import { apiClient } from "@/services/apiClient";
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
  ProtocolEffectivenessMetrics,
  ProtocolUsageStats,
  PopularProtocol,
  ProtocolWithCustomVariations,
  ProtocolCostEstimation,
  PaginatedResponse,
} from "@/types/treatmentProtocol";

const BASE_URL = "/treatment-protocols";

export const treatmentProtocolService = {
  // Basic CRUD operations
  async getAllTreatmentProtocols(params?: QueryTreatmentProtocol): Promise<PaginatedResponse<TreatmentProtocol>> {
    const response = await apiClient.get(BASE_URL, { params });
    // Transform the nested response structure to match PaginatedResponse
    const apiResponse = response.data;
    return {
      data: apiResponse.data.data,
      meta: apiResponse.data.meta
    };
  },

  async getTreatmentProtocolById(id: number): Promise<TreatmentProtocol> {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  async createTreatmentProtocol(data: CreateTreatmentProtocol): Promise<TreatmentProtocol> {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  async updateTreatmentProtocol(id: number, data: UpdateTreatmentProtocol): Promise<TreatmentProtocol> {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  async deleteTreatmentProtocol(id: number): Promise<TreatmentProtocol> {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Search operations
  async searchTreatmentProtocols(query: string): Promise<TreatmentProtocol[]> {
    const response = await apiClient.get(`${BASE_URL}/search`, {
      params: { q: query },
    });
    return response.data;
  },

  async advancedSearchTreatmentProtocols(params: AdvancedSearchTreatmentProtocol): Promise<PaginatedResponse<TreatmentProtocol>> {
    const response = await apiClient.get(`${BASE_URL}/advanced-search`, { params });
    return response.data;
  },

  async findTreatmentProtocolByName(params: FindTreatmentProtocolByName): Promise<TreatmentProtocol | null> {
    const response = await apiClient.get(`${BASE_URL}/find-by-name`, { params });
    return response.data;
  },

  // Protocol management
  async cloneTreatmentProtocol(id: number, data: CloneTreatmentProtocol): Promise<TreatmentProtocol> {
    const response = await apiClient.post(`${BASE_URL}/clone/${id}`, data);
    return response.data;
  },

  async bulkCreateTreatmentProtocols(data: BulkCreateTreatmentProtocol): Promise<{ count: number; errors: string[] }> {
    const response = await apiClient.post(`${BASE_URL}/bulk`, data);
    return response.data;
  },

  // Analytics and statistics
  async getProtocolUsageStats(id: number, params?: UsageStatsQuery): Promise<ProtocolUsageStats> {
    const response = await apiClient.get(`${BASE_URL}/stats/usage/${id}`, { params });
    return response.data;
  },

  async getMostPopularProtocols(params?: PopularProtocolsQuery): Promise<PopularProtocol[]> {
    const response = await apiClient.get(`${BASE_URL}/stats/popular`, { params });
    return response.data;
  },

  async getProtocolsWithCustomVariations(): Promise<ProtocolWithCustomVariations[]> {
    const response = await apiClient.get(`${BASE_URL}/stats/custom-variations`);
    return response.data;
  },

  async getProtocolEffectivenessMetrics(id: number): Promise<ProtocolEffectivenessMetrics> {
    const response = await apiClient.get(`${BASE_URL}/analytics/effectiveness/${id}`);
    return response.data;
  },

  async getProtocolComparison(data: ProtocolComparison): Promise<{
    protocols: TreatmentProtocol[];
    comparison: Array<{
      protocolId: number;
      name: string;
      totalUsage: number;
      successRate: number | null;
      averageCost: number;
      activeTreatments: number;
    }>;
  }> {
    const response = await apiClient.post(`${BASE_URL}/analytics/comparison`, data);
    return response.data;
  },

  async getProtocolTrendAnalysis(params: ProtocolTrendAnalysis): Promise<Array<{
    protocol: TreatmentProtocol;
    usageCount: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercentage: number;
  }>> {
    const response = await apiClient.get(`${BASE_URL}/analytics/trends`, { params });
    return response.data;
  },

  async createCustomProtocolFromTreatment(treatmentId: number, data: CreateCustomProtocolFromTreatment): Promise<TreatmentProtocol> {
    const response = await apiClient.post(`${BASE_URL}/custom/from-treatment/${treatmentId}`, data);
    return response.data;
  },

  async getProtocolCostEstimation(id: number): Promise<ProtocolCostEstimation> {
    const response = await apiClient.get(`${BASE_URL}/cost-estimation/${id}`);
    return response.data;
  },

  // Paginated search
  async findTreatmentProtocolsPaginated(params?: QueryTreatmentProtocol): Promise<PaginatedResponse<TreatmentProtocol>> {
    const response = await apiClient.get(`${BASE_URL}/paginated`, { params });
    return response.data;
  },
}; 