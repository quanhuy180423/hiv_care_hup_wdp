import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { vi } from "date-fns/locale";
import { useAppointmentsByUser } from "@/hooks/useAppointments";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Stethoscope,
  Monitor,
  CheckCircle,
  XCircle,
  MapPin,
  Info,
  ClipboardList,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Appointment } from "@/types/appointment";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";

const AppointmentHistory = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endOfSelectedWeek = addDays(startOfSelectedWeek, 6);

  const { data: appointments, isLoading } = useAppointmentsByUser(
    Number(user?.id),
    {
      page: 1,
      limit: 100,
      dateFrom: format(startOfSelectedWeek, "yyyy-MM-dd"),
      dateTo: format(endOfSelectedWeek, "yyyy-MM-dd"),
    }
  );

  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfSelectedWeek, i)
  );

  const appointmentsByDate = appointments?.reduce((acc, appt) => {
    const dateStr = appt.appointmentTime.slice(0, 10);
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(appt);
    return acc;
  }, {} as Record<string, typeof appointments>);

  // Sắp xếp các lịch hẹn trong mỗi ngày theo thời gian
  for (const date in appointmentsByDate) {
    appointmentsByDate[date].sort(
      (a, b) =>
        new Date(a.appointmentTime).getTime() -
        new Date(b.appointmentTime).getTime()
    );
  }

  const goToPreviousWeek = () => setSelectedDate(addDays(selectedDate, -7));
  const goToNextWeek = () => setSelectedDate(addDays(selectedDate, 7));
  const goToToday = () => setSelectedDate(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" /> Hoàn thành
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" /> Đã hủy
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="default" className="gap-1">
            Đã xác nhận
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            Đang chờ
          </Badge>
        );
    }
  };

  const handleAppointmentClick = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Lịch Hẹn Của Tôi</h1>
          <p className="text-sm text-gray-500">
            Quản lý và theo dõi các cuộc hẹn khám bệnh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="border-gray-300"
          >
            Hôm nay
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-start text-left font-normal border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                {format(selectedDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-white shadow-lg rounded-md"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-white p-3">
        <Button
          variant="outline"
          onClick={goToPreviousWeek}
          className="text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Tuần trước
        </Button>
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {format(weekDates[0], "dd/MM/yyyy")} -{" "}
          {format(weekDates[6], "dd/MM/yyyy")}
        </h2>
        <Button
          variant="outline"
          onClick={goToNextWeek}
          className="text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Tuần sau <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Appointments */}
      <Card className="border-none shadow-sm">
        <CardHeader className="px-0 sm:px-6">
          <CardTitle className="text-lg text-gray-800">
            Chi tiết lịch hẹn tuần này
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 animate-pulse">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 w-32 rounded bg-gray-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-24 rounded-lg bg-gray-200" />
                    <Skeleton className="h-24 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-2">
              {weekDates.map((date) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const dailyAppointments = appointmentsByDate?.[dateStr] || [];
                const isToday =
                  format(date, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");

                return (
                  <div key={dateStr} className="space-y-3">
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isToday ? "bg-blue-50" : ""
                      }`}
                    >
                      <h3 className="text-sm font-medium text-gray-800">
                        {format(date, "EEE, dd/MM/yyyy", { locale: vi })}
                      </h3>
                    </div>

                    {dailyAppointments.length > 0 ? (
                      <div className="space-y-3">
                        {dailyAppointments.map((appt) => (
                          <div
                            key={appt.id}
                            onClick={() => handleAppointmentClick(appt)}
                            className="border border-gray-200 p-2 rounded-lg hover:shadow-sm transition-shadow cursor-pointer bg-white min-h-[120px] flex flex-col justify-between"
                          >
                            <div className="flex justify-between items-start mb-2 space-x-1">
                              <div className="flex items-center gap-1">
                                {appt.type === "ONLINE" ? (
                                  <Monitor className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Stethoscope className="h-4 w-4 text-green-600" />
                                )}
                                <span className="text-sm font-medium truncate max-w-[100px]">
                                  {appt.type === "ONLINE"
                                    ? "Online"
                                    : "Offline"}
                                </span>
                              </div>
                              {getStatusBadge(appt.status)}
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2 truncate">
                                <Clock className="h-4 w-4 text-gray-400" />
                                {format(
                                  toZonedTime(appt.appointmentTime, "UTC"),
                                  "HH:mm"
                                )}
                              </div>
                              <div className="flex items-center gap-2 truncate">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="truncate max-w-[140px]">
                                  {appt.doctor.user.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 truncate">
                                <Stethoscope className="h-4 w-4 text-gray-400" />
                                <span className="truncate max-w-[140px]">
                                  {appt.service.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center h-[120px]">
                        <p className="text-gray-500 text-sm text-center">
                          Không có lịch hẹn
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] bg-white">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                  <span>Chi tiết lịch hẹn #{selectedAppointment.id}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-blue-50 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Bệnh nhân
                        </h4>
                        <p className="font-medium">
                          {selectedAppointment.user.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-green-50 rounded-full">
                        <Stethoscope className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Bác sĩ
                        </h4>
                        <p className="font-medium">
                          BS. {selectedAppointment.doctor.user.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-purple-50 rounded-full">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Thời gian
                        </h4>
                        <p className="font-medium">
                          {formatUtcDateManually(
                            selectedAppointment.appointmentTime,
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-orange-50 rounded-full">
                        {selectedAppointment.type === "ONLINE" ? (
                          <Monitor className="h-5 w-5 text-orange-600" />
                        ) : (
                          <MapPin className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Hình thức
                        </h4>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {selectedAppointment.type === "ONLINE"
                              ? "Khám Online"
                              : "Khám Trực tiếp"}
                          </p>
                          {getStatusBadge(selectedAppointment.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin dịch vụ */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    Thông tin dịch vụ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Tên dịch vụ
                      </h4>
                      <p className="font-medium">
                        {selectedAppointment.service.name}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Loại dịch vụ
                      </h4>
                      <p className="font-medium">
                        {selectedAppointment.service.type === "CONSULT"
                          ? "Tư vấn"
                          : "Điều trị"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Giá dịch vụ
                      </h4>
                      <p className="font-medium">
                        {formatCurrency(selectedAppointment.service.price)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Thời gian khám
                      </h4>
                      <p className="font-medium">
                        {selectedAppointment.service.startTime} -{" "}
                        {selectedAppointment.service.endTime}
                      </p>
                    </div>
                  </div>
                  {selectedAppointment.service.description && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-500">
                        Mô tả dịch vụ
                      </h4>
                      <p className="text-gray-700">
                        {selectedAppointment.service.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Thông tin bổ sung */}
                {selectedAppointment.type === "ONLINE" ? (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-blue-600" />
                      Thông tin phòng khám online
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="mb-2">
                        Bạn có thể tham gia phòng khám online bằng đường link
                        bên dưới:
                      </p>
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={() =>
                          window.open(
                            selectedAppointment.patientMeetingUrl || "",
                            "_blank"
                          )
                        }
                      >
                        Tham gia phòng khám ngay
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Lưu ý: Link chỉ hoạt động khi đến giờ hẹn
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Thông tin địa điểm khám
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">Phòng khám đa khoa</p>
                      <p className="text-gray-700">
                        123 Đường ABC, Quận 1, TP.HCM
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Vui lòng đến trước 15 phút để làm thủ tục
                      </p>
                    </div>
                  </div>
                )}

                {/* Ghi chú */}
                {(selectedAppointment.notes ||
                  selectedAppointment.isAnonymous) && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      Thông tin bổ sung
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedAppointment.isAnonymous && (
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Khám ẩn danh:</span> Bác
                          sĩ sẽ không biết thông tin cá nhân của bạn
                        </p>
                      )}
                      {selectedAppointment.notes && (
                        <>
                          <h4 className="text-sm font-medium text-gray-500">
                            Ghi chú của bạn
                          </h4>
                          <p className="text-gray-700">
                            {selectedAppointment.notes}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentHistory;
