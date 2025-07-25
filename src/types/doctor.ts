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
  role?: Role;
}

export interface Doctor {
  id: number;
  userId: number;
  specialization: string;
  certifications: string[];
  maxShiftsPerDay: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: User;
  schedules?: DoctorSchedule[];
}

export interface DoctorSchedule {
  id: number;
  doctorId: number;
  date: string;
  dayOfWeek:
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY";
  shift: "MORNING" | "AFTERNOON";
  isOff: boolean;
  isAutoGenerated: boolean;
  swappedWithId?: number | null;
  swappedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DoctorListResponse {
  data: {
    data: Doctor[];
    meta: PaginationMeta;
  };
  statusCode: number;
  message: string;
}

export interface DoctorsResponse {
  data: {
    data: Doctor[];
    meta: PaginationMeta;
  };
}

export interface DoctorResponse {
  data: Doctor;
  statusCode: number;
  message: string;
}

export interface DoctorScheduleResponse {
  data: DoctorSchedule[];
  statusCode: number;
  message: string;
}

export interface WeeklyScheduleResponse {
  data: {
    startDate: string;
    endDate: string;
    doctors: Doctor[];
  };
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

// Form types
export type DoctorFormValues = {
  userId: number;
  specialization?: string;
  certifications?: string[];
};

export type UpdateDoctorFormValues = {
  specialization?: string;
  certifications?: string[];
};

export type QueryDoctorFormValues = {
  search?: string;
  sortBy?: "specialization" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  specialization?: string;
};

export type SwapShiftsFormValues = {
  doctor1: {
    id: number;
    date: string;
    shift: "MORNING" | "AFTERNOON";
  };
  doctor2: {
    id: number;
    date: string;
    shift: "MORNING" | "AFTERNOON";
  };
};

export type GenerateScheduleFormValues = {
  startDate: string;
  doctorsPerShift: number;
};

export type ManualScheduleAssignmentFormValues = {
  doctorId: number;
  date: string;
  shift: "MORNING" | "AFTERNOON";
};
