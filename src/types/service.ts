export enum ServiceType {
  TEST = 'TEST',
  TREATMENT = 'TREATMENT',
  CONSULT = 'CONSULT',
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  price: string;
  type: ServiceType;
  description: string;
  startTime: string;
  endTime: string;
  duration?: string | null;
  imageUrl: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  data: Service[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type ServiceFormValues = {
  name: string;
  price: string;
  type: ServiceType;
  description?: string;
  startTime: string;
  endTime: string;
  duration?: string;
  imageUrl?: string;
  content?: string;
  isActive: boolean;
};

export type UpdateServiceFormValues = {
  name?: string;
  price?: string;
  type?: ServiceType;
  description?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  imageUrl?: string;
  content?: string;
  isActive?: boolean;
};

export type QueryServiceFormValues = {
  search?: string;
  type?: ServiceType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}; 