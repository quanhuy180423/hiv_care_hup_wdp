export interface Doctor {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  maxShiftsPerDay: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface meta {
  total: 3;
  page: 2;
  limit: 2;
  totalPages: 2;
  hasNextPage: false;
  hasPreviousPage: true;
}
export interface dataresponse {
  data: Doctor[];
  meta: meta;
}
export interface DoctorListResponse {
  data: dataresponse;
  statusCode: number;
  message?: string;
}
