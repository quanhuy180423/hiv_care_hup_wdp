import { apiClient } from './apiClient';

// Interfaces for Payment Dashboard
export interface DashboardPayment {
  id: number;
  orderId: number;
  amount: string;
  method: 'BANK_TRANSFER' | 'CASH' | 'CARD';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  transactionCode: string;
  gatewayTransactionId?: string;
  gatewayResponse?: {
    id: number;
    code: string;
    content: string;
    gateway: string;
    subAccount?: string;
    accumulated: number;
    description: string;
    transferType: string;
    accountNumber: string;
    referenceCode: string;
    transferAmount: number;
    transactionDate: string;
  };
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  order: {
    id: number;
    userId: number;
    appointmentId?: number;
    patientTreatmentId?: number;
    orderCode: string;
    totalAmount: string;
    notes: string;
    orderStatus: 'PAID' | 'PENDING' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
    expiredAt: string;
    user: {
      id: number;
      name: string;
      email: string;
      phoneNumber: string;
    };
    appointment?: {
      id: number;
      appointmentTime: string;
      status: string;
      service: {
        id: number;
        name: string;
        price: string;
      };
      doctor: {
        id: number;
        user: {
          name: string;
        };
      };
    };
    patientTreatment?: {
      id: number;
      startDate: string;
      endDate: string;
      status: boolean;
    };
    orderDetails: Array<{
      id: number;
      type: 'TEST' | 'MEDICINE' | 'APPOINTMENT_FEE';
      referenceId: number;
      name: string;
      quantity: number;
      unitPrice: string;
      totalPrice: string;
    }>;
  };
}

export interface PaymentDashboardResponse {
  data: {
    payments: DashboardPayment[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  todayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  averageOrderValue: number;
  revenueByMethod: {
    BANK_TRANSFER: number;
    CASH: number;
    CARD: number;
  };
  revenueByType: {
    APPOINTMENT_FEE: number;
    TEST: number;
    MEDICINE: number;
  };
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    count: number;
  }>;
}

// Dashboard Payment Service
export const dashboardPaymentService = {
  // Get all payments for dashboard
  async getAllPayments(): Promise<PaymentDashboardResponse> {
    try {
      const response = await apiClient.get<PaymentDashboardResponse>(
        '/payment/dashboard',
        {
          params: {
            limit: 1000000, // Get all payments
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard payments:', error);
      throw this.handleApiError(error);
    }
  },

  // Get payments with filters
  async getPaymentsWithFilters(params: {
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaymentDashboardResponse> {
    try {
      const response = await apiClient.get<PaymentDashboardResponse>(
        '/payment/dashboard',
        {
          params: {
            ...params,
            limit: params.limit || 1000000,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered payments:', error);
      throw this.handleApiError(error);
    }
  },

  // Calculate payment statistics
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await this.getAllPayments();
      const payments = response.data.payments;

      // Calculate total revenue
      const totalRevenue = payments
        .filter(p => p.status === 'SUCCESS')
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      // Calculate counts by status
      const successfulPayments = payments.filter(p => p.status === 'SUCCESS').length;
      const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
      const failedPayments = payments.filter(p => p.status === 'FAILED').length;

      // Date calculations
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate time-based revenue
      const todayRevenue = payments
        .filter(p => 
          p.status === 'SUCCESS' && 
          p.paidAt && 
          p.paidAt.startsWith(todayStr)
        )
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      const thisWeekRevenue = payments
        .filter(p => 
          p.status === 'SUCCESS' && 
          p.paidAt && 
          new Date(p.paidAt) >= weekAgo
        )
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      const thisMonthRevenue = payments
        .filter(p => 
          p.status === 'SUCCESS' && 
          p.paidAt && 
          new Date(p.paidAt) >= monthAgo
        )
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      // Calculate average order value
      const averageOrderValue = successfulPayments > 0 ? totalRevenue / successfulPayments : 0;

      // Revenue by payment method
      const revenueByMethod = {
        BANK_TRANSFER: 0,
        CASH: 0,
        CARD: 0,
      };

      payments
        .filter(p => p.status === 'SUCCESS')
        .forEach(payment => {
          revenueByMethod[payment.method] += parseFloat(payment.amount);
        });

      // Revenue by order detail type
      const revenueByType = {
        APPOINTMENT_FEE: 0,
        TEST: 0,
        MEDICINE: 0,
      };

      payments
        .filter(p => p.status === 'SUCCESS')
        .forEach(payment => {
          payment.order.orderDetails.forEach(detail => {
            revenueByType[detail.type] += parseFloat(detail.totalPrice);
          });
        });

      // Daily revenue for the last 7 days
      const dailyRevenue: Array<{ date: string; revenue: number; count: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayPayments = payments.filter(p => 
          p.status === 'SUCCESS' && 
          p.paidAt && 
          p.paidAt.startsWith(dateStr)
        );

        const dayRevenue = dayPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        
        dailyRevenue.push({
          date: dateStr,
          revenue: dayRevenue,
          count: dayPayments.length,
        });
      }

      return {
        totalRevenue,
        totalPayments: payments.length,
        successfulPayments,
        pendingPayments,
        failedPayments,
        todayRevenue,
        thisWeekRevenue,
        thisMonthRevenue,
        averageOrderValue,
        revenueByMethod,
        revenueByType,
        dailyRevenue,
      };
    } catch (error) {
      console.error('Error calculating payment stats:', error);
      throw this.handleApiError(error);
    }
  },

  // Get payments by date range
  async getPaymentsByDateRange(startDate: string, endDate: string): Promise<DashboardPayment[]> {
    try {
      const response = await this.getPaymentsWithFilters({ startDate, endDate });
      return response.data.payments;
    } catch (error) {
      console.error('Error fetching payments by date range:', error);
      throw this.handleApiError(error);
    }
  },

  // Get payments by status
  async getPaymentsByStatus(status: string): Promise<DashboardPayment[]> {
    try {
      const response = await this.getPaymentsWithFilters({ status });
      return response.data.payments;
    } catch (error) {
      console.error('Error fetching payments by status:', error);
      throw this.handleApiError(error);
    }
  },

  // Error handling
  handleApiError(error: any): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error?.message) {
      return new Error(error.message);
    }
    return new Error('Có lỗi xảy ra khi lấy dữ liệu doanh thu');
  },
};

export default dashboardPaymentService;
