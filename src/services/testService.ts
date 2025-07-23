import { apiClient } from "@/services/apiClient";

export interface Test {
  id: number;
  name: string;
  description: string;
  method: string;
  category: "GENERAL" | "STD" | "HEPATITIS" | "IMMUNOLOGY"; // Restrict to specific values
  isQuantitative: boolean;
  unit: string;
  cutOffValue: number;
  price: number;
}

export interface ReqTest {
  name: string;
  description: string;
  method: string;
  category: "GENERAL" | "STD" | "HEPATITIS" | "IMMUNOLOGY"; // Restrict to specific values
  isQuantitative: boolean;
  unit: string;
  cutOffValue: number;
  price: number;
}

export interface ResTestMetta {
  data: Test[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ResTest {
  data?: ResTestMetta;
  message: string;
  statusCode: number;
}
export interface Query {
  page?: number;
  limit?: number;
  search?: string;
}
export const testService = {
  async create(data: ReqTest): Promise<Test> {
    const response = await apiClient.post<Test>("/tests", data);
    return response.data;
  },

  async getAll(query?: Query): Promise<ResTest> {
    const response = await apiClient.get<ResTest>(
      `/tests?page=${query?.page || 1}&limit=${query?.limit || 10}&search=${
        query?.search || ""
      }`
    );
    return response.data;
  },

  async getById(id: number): Promise<Test> {
    const response = await apiClient.get<Test>(`/tests/${id}`);
    return response.data;
  },

  async updateById(id: number, data: Partial<ReqTest>): Promise<Test> {
    const response = await apiClient.put<Test>(`/tests/${id}`, data);
    return response.data;
  },

  async deleteById(id: number): Promise<void> {
    await apiClient.delete(`/tests/${id}`);
  },
};
