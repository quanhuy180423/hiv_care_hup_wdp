import { apiClient } from "./apiClient";
import axios from "axios";

// Error handler utility
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    switch (error.response?.status) {
      case 400:
        return "Yêu cầu không hợp lệ";
      case 401:
        return "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn";
      case 403:
        return "Bạn không có quyền truy cập tài nguyên này";
      case 404:
        return "Không tìm thấy tài nguyên";
      case 422:
        return "Dữ liệu không hợp lệ";
      case 429:
        return "Quá nhiều yêu cầu, vui lòng thử lại sau";
      case 500:
        return "Lỗi máy chủ nội bộ";
      default:
        return error.message || "Đã xảy ra lỗi không xác định";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi không xác định";
};

// Dashboard Appointment interface dựa trên response body
interface DashboardAppointment {
  id: number;
  userId: number;
  doctorId: number;
  serviceId: number;
  appointmentTime: string;
  isAnonymous: boolean;
  type: "ONLINE" | "OFFLINE";
  status: "PENDING" | "PAID" | "CANCELLED" | "COMPLETED";
  notes?: string;
  patientMeetingUrl?: string | null;
  doctorMeetingUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Response interface cho dashboard appointments
interface DashboardAppointmentsResponse {
  data: {
    data: DashboardAppointment[];
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

interface DashboardAppointmentParams {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  type?: string;
}

// Appointment stats by date
interface AppointmentsByDate {
  date: string;
  count: number;
  appointments: DashboardAppointment[];
}

interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  thisWeekAppointments: number;
  thisMonthAppointments: number;
  appointmentsByStatus: Record<string, number>;
  appointmentsByType: Record<string, number>;
  appointmentsByDate: AppointmentsByDate[];
}

// Dashboard service cho appointments
export const dashboardAppointmentService = {
  // Lấy danh sách appointments cho dashboard
  getAppointments: async (params?: DashboardAppointmentParams): Promise<DashboardAppointmentsResponse> => {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
      if (params?.dateTo) searchParams.append('dateTo', params.dateTo);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.type) searchParams.append('type', params.type);

      const response = await apiClient.get<DashboardAppointmentsResponse>(`/appointments?${searchParams.toString()}`);
      
      if (response.data) {
        return response.data;
      }
      
      throw new Error("Không thể lấy danh sách cuộc hẹn");
    } catch (error) {
      console.error("🌐 dashboardAppointmentService.getAppointments error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Lấy thống kê appointments cho dashboard
  getAppointmentStats: async (): Promise<AppointmentStats> => {
    try {
      // Lấy tất cả appointments với limit cao để thống kê
      const response = await apiClient.get<DashboardAppointmentsResponse>(`/appointments?limit=10000`);
      
      if (response.data?.data?.data) {
        const appointments = response.data.data.data;
        
        // Tính toán các ngày
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);

        // Thống kê tổng quan
        const totalAppointments = appointments.length;
        const todayAppointments = appointments.filter(apt => 
          apt.appointmentTime.startsWith(todayStr)
        ).length;
        
        const thisWeekAppointments = appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentTime);
          return aptDate >= oneWeekAgo && aptDate <= today;
        }).length;
        
        const thisMonthAppointments = appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentTime);
          return aptDate >= oneMonthAgo && aptDate <= today;
        }).length;

        // Thống kê theo status
        const appointmentsByStatus: Record<string, number> = {};
        appointments.forEach(apt => {
          appointmentsByStatus[apt.status] = (appointmentsByStatus[apt.status] || 0) + 1;
        });

        // Thống kê theo type
        const appointmentsByType: Record<string, number> = {};
        appointments.forEach(apt => {
          appointmentsByType[apt.type] = (appointmentsByType[apt.type] || 0) + 1;
        });

        // Thống kê theo ngày (7 ngày gần nhất)
        const appointmentsByDate: AppointmentsByDate[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayAppointments = appointments.filter(apt => 
            apt.appointmentTime.startsWith(dateStr)
          );
          
          appointmentsByDate.push({
            date: dateStr,
            count: dayAppointments.length,
            appointments: dayAppointments
          });
        }

        return {
          totalAppointments,
          todayAppointments,
          thisWeekAppointments,
          thisMonthAppointments,
          appointmentsByStatus,
          appointmentsByType,
          appointmentsByDate
        };
      }
      
      throw new Error("Không thể lấy thống kê cuộc hẹn");
    } catch (error) {
      console.error("🌐 dashboardAppointmentService.getAppointmentStats error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Lấy appointments theo ngày cụ thể
  getAppointmentsByDate: async (date: string): Promise<DashboardAppointment[]> => {
    try {
      const response = await apiClient.get<DashboardAppointmentsResponse>(
        `/appointments?dateFrom=${date}&dateTo=${date}&limit=1000`
      );
      
      if (response.data?.data?.data) {
        return response.data.data.data;
      }
      
      return [];
    } catch (error) {
      console.error("🌐 dashboardAppointmentService.getAppointmentsByDate error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Lấy appointments trong khoảng thời gian
  getAppointmentsByDateRange: async (dateFrom: string, dateTo: string): Promise<DashboardAppointment[]> => {
    try {
      const response = await apiClient.get<DashboardAppointmentsResponse>(
        `/appointments?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=1000`
      );
      
      if (response.data?.data?.data) {
        return response.data.data.data;
      }
      
      return [];
    } catch (error) {
      console.error("🌐 dashboardAppointmentService.getAppointmentsByDateRange error:", error);
      throw new Error(handleApiError(error));
    }
  },
};

export type { 
  DashboardAppointment, 
  DashboardAppointmentsResponse, 
  DashboardAppointmentParams,
  AppointmentsByDate,
  AppointmentStats
};
