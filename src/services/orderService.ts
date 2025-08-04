import type { OrderListResponse, OrderResponse } from "@/types/order";
import { apiClient } from "./apiClient";

export interface CreateOrderPayload {
  appointmentId: number;
}

export const orderService = {
  createOrder: async (payload: CreateOrderPayload) => {
    // Adjust endpoint as needed
    const res = await apiClient.post("/orders", payload);
    return res.data;
  },

  getOrderByUserId: async (userId: number): Promise<OrderListResponse> => {
    const res = await apiClient.get<OrderListResponse>(
      `/orders/user/${userId}`
    );
    return res.data;
  },

  getOrderByOrdercode: async (orderCode: string): Promise<OrderResponse> => {
    const res = await apiClient.get<OrderResponse>(`/orders/code/${orderCode}`);
    return res.data;
  },

  getOrderById: async (id: number): Promise<OrderResponse> => {
    const res = await apiClient.get<OrderResponse>(`/orders/${id}`);
    return res.data;
  },
};
