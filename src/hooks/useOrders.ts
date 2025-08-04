import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import type { OrderListResponse, OrderResponse } from "@/types/order";

// Lấy danh sách order theo userId
export const useOrdersByUser = (userId?: number) => {
  return useQuery<OrderListResponse>({
    queryKey: ["orders-user", userId],
    queryFn: () => orderService.getOrderByUserId(userId!),
    enabled: !!userId,
    select: (res) => res,
  });
};

// Lấy order theo orderCode
export const useOrderByOrderCode = (orderCode?: string) => {
  return useQuery<OrderResponse>({
    queryKey: ["order-code", orderCode],
    queryFn: () => orderService.getOrderByOrdercode(orderCode!),
    enabled: !!orderCode,
    select: (res) => res,
  });
};

// Lấy order theo id
export const useOrderById = (id?: number) => {
  return useQuery<OrderResponse>({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
    select: (res) => res,
  });
};

// Tạo order mới
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-user"] });
    },
  });
};
