
import { useDashboardUserRoleStats } from "@/hooks/useDashboardUsers";
import { useDashboardAppointmentStats } from "@/hooks/useDashboardAppointments";
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
          Error loading user data: {userError.message}
        </div>
      </div>
    );
  }

  if (appointmentError) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error loading appointment data: {appointmentError.message}
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          Total Users: {roleStats?.totalUsers || 0}
        </Badge>
      </div>

      {/* Total Users Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center py-4">
              {roleStats?.totalUsers || 0}
              <div className="text-sm font-normal text-gray-600 mt-1">
                Total Registered Users
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Appointments Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center py-4">
              {appointmentStats?.totalAppointments || 0}
              <div className="text-sm font-normal text-gray-600 mt-1">
                Total Appointments
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Statistics */}
      {appointmentStats && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Appointments Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-blue-50 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Today</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-600">
                  {appointmentStats.todayAppointments}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  appointments today
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">This Week</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">
                  {appointmentStats.thisWeekAppointments}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  appointments this week
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-purple-50 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">This Month</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-purple-600">
                  {appointmentStats.thisMonthAppointments}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  appointments this month
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-orange-50 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Paid</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-orange-600">
                  {appointmentStats.appointmentsByStatus.PAID || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  paid appointments
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Appointments by Date (Last 7 days) */}
      {appointmentStats?.appointmentsByDate && (
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Date (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointmentStats.appointmentsByDate.map((dayData) => {
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
                        {dayData.count} appointments
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Users by Role</h2>
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
                    {count === 1 ? 'user' : 'users'}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        {roleStats?.roleStats && (
          <Card>
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(roleStats.roleStats).map(([roleName, count]) => {
                  const percentage = ((count / roleStats.totalUsers) * 100).toFixed(1);
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

        {/* Appointment Status Distribution */}
        {appointmentStats?.appointmentsByStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(appointmentStats.appointmentsByStatus).map(([status, count]) => {
                  const percentage = ((count / appointmentStats.totalAppointments) * 100).toFixed(1);
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
    </div>
  );
};

export default DashboardPage;
