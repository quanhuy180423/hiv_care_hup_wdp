import { useQuery } from '@tanstack/react-query';
import { 
  dashboardPaymentService, 
  type PaymentStats, 
  type DashboardPayment 
} from '@/services/dashboardPaymentService';

// Query keys cho React Query
export const PAYMENT_QUERY_KEYS = {
  all: ['dashboard-payments'] as const,
  stats: () => [...PAYMENT_QUERY_KEYS.all, 'stats'] as const,
  list: () => [...PAYMENT_QUERY_KEYS.all, 'list'] as const,
  byDateRange: (startDate: string, endDate: string) => 
    [...PAYMENT_QUERY_KEYS.all, 'date-range', startDate, endDate] as const,
  byStatus: (status: string) => 
    [...PAYMENT_QUERY_KEYS.all, 'status', status] as const,
} as const;

// Hook để lấy thống kê thanh toán
export const useDashboardPaymentStats = () => {
  return useQuery<PaymentStats, Error>({
    queryKey: PAYMENT_QUERY_KEYS.stats(),
    queryFn: () => dashboardPaymentService.getPaymentStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy tất cả thanh toán
export const useDashboardPayments = () => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.list(),
    queryFn: () => dashboardPaymentService.getAllPayments(),
    staleTime: 3 * 60 * 1000, // 3 phút
    gcTime: 10 * 60 * 1000, // 10 phút
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy thanh toán với bộ lọc
export const useDashboardPaymentsWithFilters = (params: {
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...PAYMENT_QUERY_KEYS.all, 'filtered', params],
    queryFn: () => dashboardPaymentService.getPaymentsWithFilters(params),
    staleTime: 2 * 60 * 1000, // 2 phút
    gcTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: false,
    enabled: Boolean(
      params.startDate || 
      params.endDate || 
      params.status || 
      params.page || 
      params.limit
    ),
  });
};

// Hook để lấy thanh toán theo khoảng thời gian
export const useDashboardPaymentsByDateRange = (
  startDate: string, 
  endDate: string,
  enabled = true
) => {
  return useQuery<DashboardPayment[], Error>({
    queryKey: PAYMENT_QUERY_KEYS.byDateRange(startDate, endDate),
    queryFn: () => dashboardPaymentService.getPaymentsByDateRange(startDate, endDate),
    staleTime: 3 * 60 * 1000, // 3 phút
    gcTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: false,
    enabled: enabled && Boolean(startDate && endDate),
  });
};

// Hook để lấy thanh toán theo trạng thái
export const useDashboardPaymentsByStatus = (status: string, enabled = true) => {
  return useQuery<DashboardPayment[], Error>({
    queryKey: PAYMENT_QUERY_KEYS.byStatus(status),
    queryFn: () => dashboardPaymentService.getPaymentsByStatus(status),
    staleTime: 3 * 60 * 1000, // 3 phút
    gcTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: false,
    enabled: enabled && Boolean(status),
  });
};

// Hook để lấy thanh toán hôm nay
export const useTodayPayments = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery<DashboardPayment[], Error>({
    queryKey: [...PAYMENT_QUERY_KEYS.all, 'today', today],
    queryFn: async () => {
      const response = await dashboardPaymentService.getPaymentsWithFilters({
        startDate: today,
        endDate: today,
      });
      return response.data.payments;
    },
    staleTime: 1 * 60 * 1000, // 1 phút cho dữ liệu hôm nay
    gcTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: true, // Làm mới khi focus lại tab
    refetchInterval: 2 * 60 * 1000, // Tự động làm mới mỗi 2 phút
  });
};

// Hook để lấy thanh toán tuần này
export const useThisWeekPayments = () => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startDate = weekAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  return useDashboardPaymentsByDateRange(startDate, endDate);
};

// Hook để lấy thanh toán tháng này
export const useThisMonthPayments = () => {
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDate = monthAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  return useDashboardPaymentsByDateRange(startDate, endDate);
};

// Hook để lấy thanh toán thành công
export const useSuccessfulPayments = () => {
  return useDashboardPaymentsByStatus('SUCCESS');
};

// Hook tùy chỉnh để phân tích thanh toán
export const usePaymentAnalytics = () => {
  const statsQuery = useDashboardPaymentStats();
  const todayQuery = useTodayPayments();
  const thisWeekQuery = useThisWeekPayments();
  
  return {
    stats: statsQuery.data,
    todayPayments: todayQuery.data,
    thisWeekPayments: thisWeekQuery.data,
    isLoading: statsQuery.isLoading || todayQuery.isLoading || thisWeekQuery.isLoading,
    error: statsQuery.error || todayQuery.error || thisWeekQuery.error,
    refetch: () => {
      statsQuery.refetch();
      todayQuery.refetch();
      thisWeekQuery.refetch();
    },
  };
};
