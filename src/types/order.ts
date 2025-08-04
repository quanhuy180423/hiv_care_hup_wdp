import type { CustomMedicationItem } from "@/schemas/patientTreatment";
import type { AppointmentStatus } from "./appointment";

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string | null;
}

export interface Service {
  name: string;
}

export interface Appointment {
  id: number;
  userId: number;
  doctorId: number;
  serviceId: number;
  appointmentTime: string;
  isAnonymous: boolean;
  type: string;
  status: AppointmentStatus;
  notes: string | null;
  patientMeetingUrl: string | null;
  doctorMeetingUrl: string | null;
  service: Service;
  createdAt: string;
  updatedAt: string;
}

export interface PatientTreatment {
  id: number;
  patientId: number;
  protocolId: number;
  doctorId: number;
  customMedications?: CustomMedicationItem[];
  notes?: string | null;
  startDate: string;
  endDate?: string | null;
  createdById: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail {
  id: number;
  orderId: number;
  type: string;
  referenceId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  method: string;
  status: string;
  transactionCode: string | null;
  gatewayTransactionId: string | null;
  gatewayResponse: {
    id: string;
    code: string;
    content: string;
    gateway: string;
    subAccount: string | null;
    accumulated: number;
    description: string | null;
    transferType: string | null;
    accountNumber: string | null;
    referenceCode: string | null;
    transferAmount: number | null;
    transactionDate: string | null;
  };
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  appointmentId: number | null;
  patientTreatmentId: number | null;
  orderCode: string;
  totalAmount: number;
  notes: string | null;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  expiredAt: string | null;
  user: User;
  appointment: Appointment | null;
  patientTreatment: PatientTreatment | null;
  orderDetails: OrderDetail[];
  payments: Payment[];
  paymentUrl: string | null;
}

export interface OrderListResponse {
  data: Order[];
  statusCode: number;
  message: string;
}

export interface OrderResponse {
  data: Order;
  statusCode: number;
  message: string;
}
