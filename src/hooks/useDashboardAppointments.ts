import { useQuery } from "@tanstack/react-query";
import { dashboardAppointmentService } from "@/services/dashboardAppointmentService";
import type { DashboardAppointmentParams } from "@/services/dashboardAppointmentService";

// Hook để lấy thống kê appointments cho dashboard
export const useDashboardAppointmentStats = () => {
  return useQuery({
    queryKey: ["dashboard-appointment-stats"],
    queryFn: () => dashboardAppointmentService.getAppointmentStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy danh sách appointments cho dashboard
export const useDashboardAppointments = (params: DashboardAppointmentParams = {}) => {
  const { page = 1, limit = 100, dateFrom, dateTo, status, type } = params;

  return useQuery({
    queryKey: ["dashboard-appointments", { page, limit, dateFrom, dateTo, status, type }],
    queryFn: () => dashboardAppointmentService.getAppointments({ page, limit, dateFrom, dateTo, status, type }),
    select: (res) => ({
      appointments: res.data.data,
      meta: res.data.meta,
      statusCode: res.statusCode,
      message: res.message,
    }),
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy appointments theo ngày cụ thể
export const useDashboardAppointmentsByDate = (date: string) => {
  return useQuery({
    queryKey: ["dashboard-appointments-by-date", date],
    queryFn: () => dashboardAppointmentService.getAppointmentsByDate(date),
    enabled: !!date,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Hook để lấy appointments trong khoảng thời gian
export const useDashboardAppointmentsByDateRange = (dateFrom: string, dateTo: string) => {
  return useQuery({
    queryKey: ["dashboard-appointments-by-date-range", dateFrom, dateTo],
    queryFn: () => dashboardAppointmentService.getAppointmentsByDateRange(dateFrom, dateTo),
    enabled: !!dateFrom && !!dateTo,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};
