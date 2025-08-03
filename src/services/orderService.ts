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
};
