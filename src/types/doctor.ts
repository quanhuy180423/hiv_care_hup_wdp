export type ShiftType = "MORNING" | "AFTERNOON";

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  avatar?: string | null;
  status: string;
  roleId: number;
  role: Role;
}

export interface Doctor {
  id: number;
  userId: number;
  specialization: string;
  certifications: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  schedules: DoctorSchedule[];
}

export interface DoctorListResponse {
  data: {
    data: Doctor[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  statusCode: number;
  message: string;
}

export interface DoctorResponse {
  data: Doctor;
  statusCode: number;
  message: string;
}

export interface DoctorSchedule {
  id: number;
  doctorId: number;
  date: string;
  dayOfWeek: string;
  shift: ShiftType;
  isOff: boolean;
  swappedWithId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorScheduleResponse {
  data: DoctorSchedule[];
  statusCode: number;
  message: string;
}

export interface DoctorSwapFromValues {
  doctor1: {
    id: number;
    date: string;
    shift: ShiftType;
  };
  doctor2: {
    id: number;
    date: string;
    shift: ShiftType;
  };
}

export interface DoctorSwapResponse {
  message: string;
  doctor1: {
    id: number;
    newSchedule: {
      date: string;
      shift: string;
    };
  };
  doctor2: {
    id: number;
    newSchedule: {
      date: string;
      shift: string;
    };
  };
}

export interface UserShort {
  email: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
}

export interface DoctorScheduleByDate {
  id: number;
  userId: number;
  specialization: string;
  certifications: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserShort;
  schedules: DoctorSchedule[];
}

export interface DoctorScheduleByDateResponse {
  data: DoctorScheduleByDate[];
  statusCode: number;
  message: string;
}

export type DoctorQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  specialization?: string;
};
