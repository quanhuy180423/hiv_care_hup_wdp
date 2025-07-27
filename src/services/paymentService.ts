import { apiClient } from "./apiClient";

export interface PaymentItemType {
  type?: "APPOINTMENT_FEE" | "MEDICINE" | "TEST" | "CONSULTATION" | "TREATMENT";
}
export interface OrderStatus {
  status?: "PENDING" | "PAID";
}
export interface PaymentMethod {
  method?: "BANK_TRANSFER" | "CASH";
}
export interface PaymentItem {
  type?: "APPOINTMENT_FEE" | "MEDICINE" | "TEST" | "CONSULTATION" | "TREATMENT";
  referenceId: number;
  name: string;
  quantity: number;
  unitPrice: number;
}
export interface RequestCreatePayment {
  userId: number;
  appointmentId?: number;
  patientTreatmentId?: number;
  items: PaymentItem[];
  method?: "BANK_TRANSFER" | "CASH";
  notes: string;
}
export interface PaymentOrderDetails {
  id: number;
  type: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface PaymentOrder {
  id: number;
  transactionCode: string;
  amount: number;
  status: "PENDING" | "PAID";
  method?: "BANK_TRANSFER" | "CASH";
}
export interface BankingInfo {
  accountNumber: string;
  accountName: string;
  bankName: string;
  amount: string;
  content: string;
}
export interface PaymentResponse {
  id: number;
  appointmentId?: number;
  patientTreatmentId?: number;
  orderCode: string;
  totalAmount: number;
  orderStatus: "PENDING" | "PAID";
  createdAt: string;
  expiredAt: string;
  orderDetails: PaymentOrderDetails[];
  totalPrice: number;
  payment: PaymentOrder;
  paymentUrl: string;
  bankInfo: BankingInfo;
}

export interface PaymentListResponse {
  data: PaymentResponse[];
  statusCode: number;
  message: string;
}
export interface PaymentOneResponse {
  data: PaymentResponse;
  statusCode: number;
  message: string;
}
export const PaymentService = {
  createPayment: async (
    data: RequestCreatePayment
  ): Promise<PaymentOneResponse> => {
    const res = await apiClient.post<PaymentOneResponse>("/orders", data);
    return res.data;
  },

  getPaymentById: async (id: number): Promise<PaymentResponse> => {
    const res = await apiClient.get<PaymentResponse>(`/payments/${id}`);
    return res.data;
  },

  getPaymentByUserId: async (id: string): Promise<PaymentListResponse> => {
    const res = await apiClient.get<PaymentListResponse>(`/orders/user/${id}`);
    return res.data;
  },
};
