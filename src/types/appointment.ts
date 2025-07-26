import type { Service } from "./service";

export type AppointmentType = "ONLINE" | "OFFLINE";
export type AppointmentStatus = "PENDING" | "PAID" | "CANCELLED" | "COMPLETED";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  phoneNumber: string | null;
}

export interface Doctor {
  id: number;
  specialization: string;
  user: User;
}

export interface Appointment {
  id: number;
  userId: number;
  doctorId: number;
  serviceId: number;
  appointmentTime: string;
  isAnonymous: boolean;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string | null;
  user: User;
  doctor: Doctor;
  patientMeetingUrl: string | null;
  doctorMeetingUrl: string | null;
  service: Service;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormValues {
  userId: number;
  serviceId: number;
  appointmentTime: string;
  isAnonymous: boolean;
  type: AppointmentType;
  notes: string | null;
  doctorId?: number;
}

export interface AppointmentResponse {
  data: Appointment;
  statusCode: number;
  message: string;
}

export interface AppointmentsListResponse {
  data: {
    data: Appointment[];
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

export type AppointmentQueryParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: string;
  serviceId?: number;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
};
