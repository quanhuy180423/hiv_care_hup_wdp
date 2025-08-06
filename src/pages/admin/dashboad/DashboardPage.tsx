
import { useDashboardUserRoleStats } from "@/hooks/useDashboardUsers";
import { useDashboardAppointmentStats } from "@/hooks/useDashboardAppointments";
import { QuickPaymentStats } from "@/components/dashboard/QuickPaymentStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Users, UserCheck, Stethoscope, Shield, Briefcase, Calendar, CalendarDays, Clock, CheckCircle } from "lucide-react";

const DashboardPage = () => {
  const { data: roleStats, isLoading: userLoading, error: userError } = useDashboardUserRoleStats();
  const { data: appointmentStats, isLoading: appointmentLoading, error: appointmentError } = useDashboardAppointmentStats();

  if (userLoading || appointmentLoading) return <LoadingSpinner />;

  if (userError) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Lỗi khi tải dữ liệu người dùng: {userError.message}
        </div>
      </div>
    );
  }

  if (appointmentError) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Lỗi khi tải dữ liệu cuộc hẹn: {appointmentError.message}
        </div>
      </div>
    );
  }

  // Mapping role names to icons and colors
  const getRoleConfig = (roleName: string) => {
    switch (roleName) {
      case "ADMIN":
        return {
          icon: Shield,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      case "DOCTOR":
        return {
          icon: Stethoscope,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
      case "STAFF":
        return {
          icon: Briefcase,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case "PATIENT":
        return {
          icon: UserCheck,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200"
        };
      default:
        return {
          icon: Users,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  // Mapping appointment status to colors
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-yellow-500" };
      case "PAID":
        return { color: "bg-blue-500" };
      case "COMPLETED":
        return { color: "bg-green-500" };
      case "CANCELLED":
        return { color: "bg-red-500" };
      default:
        return { color: "bg-gray-500" };
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bảng Điều Khiển</h1>
        <p className="text-gray-600 mt-1">Tổng quan về hệ thống quản lý chăm sóc HIV</p>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          Total Users: {roleStats?.totalUsers || 0}
        </Badge>
      </div>

      {/* Tổng quan người dùng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tổng quan người dùng */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tổng Quan Người Dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center py-4">
              {roleStats?.totalUsers || 0}
              <div className="text-sm font-normal text-gray-600 mt-1">
                Tổng số người dùng đã đăng ký
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tổng quan cuộc hẹn */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Tổng Quan Cuộc Hẹn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center py-4">
              {appointmentStats?.totalAppointments || 0}
              <div className="text-sm font-normal text-gray-600 mt-1">
                Tổng số cuộc hẹn
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê cuộc hẹn */}
      {appointmentStats && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Thống Kê Cuộc Hẹn</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Hôm Nay</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-600">
                  {appointmentStats?.todayAppointments || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  cuộc hẹn hôm nay
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Tuần Này</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">
                  {appointmentStats?.thisWeekAppointments || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  cuộc hẹn tuần này
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-purple-50 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Tháng Này</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-purple-600">
                  {appointmentStats?.thisMonthAppointments || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  cuộc hẹn tháng này
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-orange-50 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Đã Thanh Toán</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-orange-600">
                  {appointmentStats?.appointmentsByStatus?.PAID || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  cuộc hẹn đã thanh toán
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Cuộc hẹn theo ngày (7 ngày qua) */}
      {appointmentStats?.appointmentsByDate && (
        <Card>
          <CardHeader>
            <CardTitle>Cuộc Hẹn Theo Ngày (7 Ngày Qua)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointmentStats?.appointmentsByDate?.map((dayData) => {
                const date = new Date(dayData.date);
                const isToday = dayData.date === new Date().toISOString().split('T')[0];
                
                return (
                  <div key={dayData.date} className={`flex items-center justify-between p-3 border rounded ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">
                        {date.toLocaleDateString('vi-VN', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                        {isToday && <span className="ml-2 text-blue-600 font-semibold">(Today)</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={dayData.count > 0 ? "default" : "secondary"}>
                        {dayData.count} cuộc hẹn
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thống kê vai trò */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Người Dùng Theo Vai Trò</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roleStats?.roleStats && Object.entries(roleStats.roleStats).map(([roleName, count]) => {
            const config = getRoleConfig(roleName);
            const IconComponent = config.icon;
            
            return (
              <Card key={roleName} className={`${config.borderColor} border-2`}>
                <CardHeader className={`${config.bgColor} pb-2`}>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-5 w-5 ${config.color}`} />
                      <span className="text-sm font-medium">{roleName}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className={`text-2xl font-bold ${config.color}`}>
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {count === 1 ? 'người dùng' : 'người dùng'}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Thống kê bổ sung */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phân bố vai trò */}
        {roleStats?.roleStats && (
          <Card>
            <CardHeader>
              <CardTitle>Phân Bố Vai Trò</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roleStats?.roleStats && Object.entries(roleStats.roleStats).map(([roleName, count]) => {
                  const percentage = ((count / (roleStats?.totalUsers || 1)) * 100).toFixed(1);
                  const config = getRoleConfig(roleName);
                  
                  return (
                    <div key={roleName} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                        <span className="font-medium">{roleName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{percentage}%</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phân bố trạng thái cuộc hẹn */}
        {appointmentStats?.appointmentsByStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Phân Bố Trạng Thái Cuộc Hẹn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointmentStats?.appointmentsByStatus && Object.entries(appointmentStats.appointmentsByStatus).map(([status, count]) => {
                  const percentage = ((count / (appointmentStats?.totalAppointments || 1)) * 100).toFixed(1);
                  const statusConfig = getStatusConfig(status);
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${statusConfig.color}`} />
                        <span className="font-medium">{status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{percentage}%</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Thống kê doanh thu */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Thống Kê Doanh Thu</h2>
        <QuickPaymentStats />
      </div>
    </div>
  );
};

export default DashboardPage;
