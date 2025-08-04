import { useDashboardAppointmentStats } from "@/hooks/useDashboardAppointments";
import { Badge } from "@/components/ui/badge";

export const QuickAppointmentStats = () => {
  const { data, isLoading, error } = useDashboardAppointmentStats();

  if (isLoading) return <div>Loading appointments...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Function to get status badge variant and color
  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "PENDING":
        return { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" };
      case "PAID":
        return { variant: "default" as const, className: "bg-blue-100 text-blue-800" };
      case "COMPLETED":
        return { variant: "default" as const, className: "bg-green-100 text-green-800" };
      case "CANCELLED":
        return { variant: "destructive" as const, className: "bg-red-100 text-red-800" };
      default:
        return { variant: "outline" as const, className: "" };
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
      <h3 className="font-semibold text-lg">Appointment Statistics</h3>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">{data?.totalAppointments || 0}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data?.todayAppointments || 0}</div>
          <div className="text-sm text-gray-600">Today</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data?.thisWeekAppointments || 0}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{data?.thisMonthAppointments || 0}</div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div>
        <h4 className="font-medium mb-3">By Status:</h4>
        <div className="grid grid-cols-2 gap-2">
          {data?.appointmentsByStatus && Object.entries(data.appointmentsByStatus).map(([status, count]) => {
            const badgeProps = getStatusBadgeProps(status);
            return (
              <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <Badge {...badgeProps}>
                  {status}
                </Badge>
                <strong className="text-lg">{count}</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* Type Breakdown */}
      <div>
        <h4 className="font-medium mb-3">By Type:</h4>
        <div className="flex gap-2">
          {data?.appointmentsByType && Object.entries(data.appointmentsByType).map(([type, count]) => (
            <div key={type} className="flex-1 text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold">{count}</div>
              <div className="text-sm text-gray-600">{type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Last 7 Days */}
      <div>
        <h4 className="font-medium mb-3">Last 7 Days:</h4>
        <div className="space-y-1">
          {data?.appointmentsByDate?.map((dayData) => {
            const isToday = dayData.date === new Date().toISOString().split('T')[0];
            return (
              <div key={dayData.date} className={`flex justify-between items-center p-2 rounded ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <span className="text-sm">
                  {new Date(dayData.date).toLocaleDateString('vi-VN', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  {isToday && <span className="ml-1 text-blue-600 font-medium">(Today)</span>}
                </span>
                <Badge variant={dayData.count > 0 ? "default" : "secondary"}>
                  {dayData.count}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
