import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardPaymentStats } from '@/hooks/useDashboardPayments';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  BarChart3,
} from 'lucide-react';

export const QuickPaymentStats: React.FC = () => {
  const { data: stats, isLoading, error } = useDashboardPaymentStats();

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Lỗi khi tải dữ liệu doanh thu: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Helper function to get status badge props
  const getStatusBadgeProps = (status: string, count: number) => {
    switch (status) {
      case 'SUCCESS':
        return { 
          variant: 'default' as const, 
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'Thành công',
          count 
        };
      case 'PENDING':
        return { 
          variant: 'secondary' as const, 
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-3 h-3 mr-1" />,
          label: 'Đang xử lý',
          count 
        };
      case 'FAILED':
        return { 
          variant: 'destructive' as const, 
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-3 h-3 mr-1" />,
          label: 'Thất bại',
          count 
        };
      default:
        return { 
          variant: 'outline' as const, 
          className: '',
          icon: null,
          label: status,
          count 
        };
    }
  };

  // Helper function to get method badge props
  const getMethodBadgeProps = (method: string, amount: number) => {
    switch (method) {
      case 'BANK_TRANSFER':
        return { 
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <CreditCard className="w-3 h-3 mr-1" />,
          label: 'Chuyển khoản',
          amount 
        };
      case 'CASH':
        return { 
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: <DollarSign className="w-3 h-3 mr-1" />,
          label: 'Tiền mặt',
          amount 
        };
      case 'CARD':
        return { 
          variant: 'outline' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <CreditCard className="w-3 h-3 mr-1" />,
          label: 'Thẻ',
          amount 
        };
      default:
        return { 
          variant: 'outline' as const,
          className: '',
          icon: null,
          label: method,
          amount 
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Tổng Doanh Thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Từ {stats.successfulPayments} giao dịch thành công
            </p>
          </CardContent>
        </Card>

        {/* Today's Revenue */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Doanh Thu Hôm Nay
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(stats.todayRevenue)}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {new Date().toLocaleDateString('vi-VN')}
            </p>
          </CardContent>
        </Card>

        {/* This Week Revenue */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Tuần Này
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(stats.thisWeekRevenue)}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              7 ngày qua
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Giá Trị TB/Đơn
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {formatCurrency(stats.averageOrderValue)}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Trung bình mỗi giao dịch
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Thống Kê Trạng Thái Thanh Toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { status: 'SUCCESS', count: stats.successfulPayments },
              { status: 'PENDING', count: stats.pendingPayments },
              { status: 'FAILED', count: stats.failedPayments },
            ].map(({ status, count }) => {
              const badgeProps = getStatusBadgeProps(status, count);
              return (
                <div key={status} className="text-center p-4 rounded-lg border">
                  <Badge className={badgeProps.className}>
                    {badgeProps.icon}
                    {badgeProps.label}
                  </Badge>
                  <div className="text-2xl font-bold mt-2">{count}</div>
                  <p className="text-sm text-gray-600">
                    {((count / stats.totalPayments) * 100).toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Revenue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Doanh Thu Theo Phương Thức Thanh Toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.revenueByMethod).map(([method, amount]) => {
              const badgeProps = getMethodBadgeProps(method, amount);
              return (
                <div key={method} className="text-center p-4 rounded-lg border">
                  <Badge className={badgeProps.className}>
                    {badgeProps.icon}
                    {badgeProps.label}
                  </Badge>
                  <div className="text-xl font-bold mt-2">
                    {formatCurrency(amount)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {((amount / stats.totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Service Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Doanh Thu Theo Loại Dịch Vụ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.revenueByType).map(([type, amount]) => {
              const getTypeLabel = (type: string) => {
                switch (type) {
                  case 'APPOINTMENT_FEE': return 'Phí Khám';
                  case 'TEST': return 'Xét Nghiệm';
                  case 'MEDICINE': return 'Thuốc';
                  default: return type;
                }
              };

              const getTypeColor = (type: string) => {
                switch (type) {
                  case 'APPOINTMENT_FEE': return 'bg-blue-100 text-blue-800 border-blue-200';
                  case 'TEST': return 'bg-green-100 text-green-800 border-green-200';
                  case 'MEDICINE': return 'bg-purple-100 text-purple-800 border-purple-200';
                  default: return 'bg-gray-100 text-gray-800 border-gray-200';
                }
              };

              return (
                <div key={type} className="text-center p-4 rounded-lg border">
                  <Badge className={getTypeColor(type)}>
                    {getTypeLabel(type)}
                  </Badge>
                  <div className="text-xl font-bold mt-2">
                    {formatCurrency(amount)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {((amount / stats.totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Xu Hướng Doanh Thu 7 Ngày Qua
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.dailyRevenue.map((day) => {
              const isToday = day.date === new Date().toISOString().split('T')[0];
              return (
                <div 
                  key={day.date} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isToday ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      isToday ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      isToday ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {new Date(day.date).toLocaleDateString('vi-VN', { 
                        weekday: 'short', 
                        day: '2-digit', 
                        month: '2-digit' 
                      })}
                      {isToday && ' (Hôm nay)'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      isToday ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {formatCurrency(day.revenue)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {day.count} giao dịch
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
