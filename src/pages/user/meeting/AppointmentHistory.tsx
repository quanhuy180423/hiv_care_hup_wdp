import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { vi } from "date-fns/locale";
import {
  useAppointmentsByUser,
  useChangeAppointmentStatus,
} from "@/hooks/useAppointments";
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
  Heart,
  Activity,
  AlertCircle,
  Video,
  Building2,
  Calendar as CalendarLucide,
  Shield,
  Coins,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Appointment } from "@/types/appointment";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";
import { ConfirmDelete } from "@/components/ConfirmDelete";

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
  const { mutate: changeStatus } = useChangeAppointmentStatus();

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
          <Badge className="gap-1 bg-emerald-100 text-emerald-700 border-emerald-200">
            <CheckCircle className="h-3 w-3" /> Hoàn thành
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="gap-1 bg-red-100 text-red-700 border-red-200">
            <XCircle className="h-3 w-3" /> Đã hủy
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="gap-1 bg-blue-100 text-blue-700 border-blue-200gap">
            <Coins className="h-3 w-3" /> Đã thanh toán
          </Badge>
        );
      default:
        return (
          <Badge className="-1 bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3" /> Đang chờ
          </Badge>
        );
    }
  };

  const handleAppointmentClick = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsDialogOpen(true);
  };

  const canCancelAppointment = (appointment: Appointment) => {
    if (
      appointment.status === "CANCELLED" ||
      appointment.status === "COMPLETED"
    ) {
      return false;
    }

    const appointmentDate = new Date(appointment.appointmentTime);
    const now = new Date();
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    return daysDiff > 1;
  };

  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      changeStatus(
        {
          id: selectedAppointment.id,
          status: "CANCELLED",
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CalendarLucide className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Lịch Hẹn Của Tôi
                  </h1>
                  <p className="text-sm text-gray-600">
                    Quản lý và theo dõi các cuộc hẹn khám bệnh
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                Hôm nay
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-normal border-indigo-200 hover:bg-indigo-50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                    {format(selectedDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white shadow-xl rounded-xl"
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
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-indigo-100">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goToPreviousWeek}
              className="text-indigo-600 hover:bg-indigo-50"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Tuần trước
            </Button>
            <h2 className="text-lg font-semibold text-gray-800 text-center">
              {format(weekDates[0], "dd/MM")} -{" "}
              {format(weekDates[6], "dd/MM/yyyy")}
            </h2>
            <Button
              variant="ghost"
              onClick={goToNextWeek}
              className="text-indigo-600 hover:bg-indigo-50"
            >
              Tuần sau <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Appointments Grid */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Lịch hẹn trong tuần
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
                {weekDates.map((date) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  const dailyAppointments = appointmentsByDate?.[dateStr] || [];
                  const isToday =
                    format(date, "yyyy-MM-dd") ===
                    format(new Date(), "yyyy-MM-dd");

                  return (
                    <div key={dateStr} className="space-y-3">
                      <div
                        className={`p-3 rounded-xl text-center transition-all ${
                          isToday
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        <p className="text-xs font-medium">
                          {format(date, "EEEE", { locale: vi })}
                        </p>
                        <p className="text-lg font-bold">
                          {format(date, "dd/MM")}
                        </p>
                      </div>

                      {dailyAppointments.length > 0 ? (
                        <div className="space-y-2">
                          {dailyAppointments.map((appt) => (
                            <div
                              key={appt.id}
                              onClick={() => handleAppointmentClick(appt)}
                              className="group relative overflow-hidden border border-gray-200 p-3 rounded-xl hover:shadow-lg transition-all cursor-pointer bg-white hover:scale-[1.02]"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                              <div className="relative space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    {appt.type === "ONLINE" ? (
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Video className="h-4 w-4 text-blue-600" />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="h-4 w-4 text-emerald-600" />
                                      </div>
                                    )}
                                    <span className="text-xs font-medium">
                                      {appt.type === "ONLINE"
                                        ? "Online"
                                        : "Tại phòng khám"}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span className="font-semibold text-gray-700">
                                      {format(
                                        toZonedTime(
                                          appt.appointmentTime,
                                          "UTC"
                                        ),
                                        "HH:mm"
                                      )}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Stethoscope className="h-3 w-3 text-gray-400" />
                                    <span className="truncate">
                                      BS. {appt.doctor.user.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Heart className="h-3 w-3 text-gray-400" />
                                    <span className="truncate">
                                      {appt.service.name}
                                    </span>
                                  </div>
                                </div>

                                <div className="pt-1">
                                  {getStatusBadge(appt.status)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center h-32 bg-gray-50/50">
                          <CalendarIcon className="h-6 w-6 text-gray-300 mb-1" />
                          <p className="text-gray-400 text-xs text-center">
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
          <DialogContent className="sm:max-w-[700px] bg-white p-0 overflow-hidden">
            {selectedAppointment && (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                        <ClipboardList className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xl">Chi tiết lịch hẹn</span>
                        <p className="text-sm text-white/80 font-normal">
                          Mã lịch hẹn: #{selectedAppointment.id}
                        </p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {/* Status Alert */}
                  {selectedAppointment.status === "CANCELLED" && (
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        Lịch hẹn này đã bị hủy
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Main Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Doctor Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-indigo-600" />
                        Thông tin bác sĩ
                      </h3>
                      <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              BS. {selectedAppointment.doctor.user.name}
                            </p>
                            <p className="text-sm text-gray-600">Chuyên khoa</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time & Type Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                        Thời gian & Hình thức
                      </h3>
                      <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-600">
                              Ngày khám:
                            </span>
                          </div>
                          <span className="font-semibold">
                            {formatUtcDateManually(
                              selectedAppointment.appointmentTime,
                              "dd/MM/yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-600">
                              Giờ khám:
                            </span>
                          </div>
                          <span className="font-semibold">
                            {formatUtcDateManually(
                              selectedAppointment.appointmentTime,
                              "HH:mm"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {selectedAppointment.type === "ONLINE" ? (
                              <Video className="h-4 w-4 text-purple-600" />
                            ) : (
                              <Building2 className="h-4 w-4 text-purple-600" />
                            )}
                            <span className="text-sm text-gray-600">
                              Hình thức:
                            </span>
                          </div>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                            {selectedAppointment.type === "ONLINE"
                              ? "Khám Online"
                              : "Khám Trực tiếp"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-600" />
                      Dịch vụ khám
                    </h3>
                    <div className="bg-rose-50 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Tên dịch vụ
                          </p>
                          <p className="font-semibold text-gray-800">
                            {selectedAppointment.service.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Loại dịch vụ
                          </p>
                          <p className="font-semibold text-gray-800">
                            {selectedAppointment.service.type === "CONSULT"
                              ? "Tư vấn"
                              : "Điều trị"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Chi phí</p>
                          <p className="font-semibold text-rose-600 text-lg">
                            {formatCurrency(selectedAppointment.service.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Thời gian hoạt động
                          </p>
                          <p className="font-semibold text-gray-800">
                            {selectedAppointment.service.startTime} -{" "}
                            {selectedAppointment.service.endTime}
                          </p>
                        </div>
                      </div>
                      {selectedAppointment.service.description && (
                        <div className="mt-4 pt-4 border-t border-rose-200">
                          <p className="text-sm text-gray-600 mb-1">
                            Mô tả dịch vụ
                          </p>
                          <p className="text-gray-700">
                            {selectedAppointment.service.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location/Meeting Info */}
                  {selectedAppointment.type === "ONLINE" ? (
                    <div className="space-y-4 mb-6">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Video className="h-5 w-5 text-blue-600" />
                        Thông tin phòng khám online
                      </h3>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Monitor className="h-5 w-5 text-blue-600" />
                          </div>
                          <p className="text-gray-700">
                            Khám bệnh trực tuyến qua video call
                          </p>
                        </div>
                        <Button
                          variant="default"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() =>
                            window.open(
                              selectedAppointment.patientMeetingUrl || "",
                              "_blank"
                            )
                          }
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Tham gia phòng khám online
                        </Button>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                          <Info className="h-3 w-3 inline mr-1" />
                          Link chỉ hoạt động khi đến giờ hẹn
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                        Địa điểm khám
                      </h3>
                      <div className="bg-emerald-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              Phòng khám đa khoa HIV Care
                            </p>
                            <p className="text-gray-700 mt-1">
                              123 Đường ABC, Quận 1, TP.HCM
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              <AlertCircle className="h-3 w-3 inline mr-1" />
                              Vui lòng đến trước 15 phút để làm thủ tục
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {(selectedAppointment.notes ||
                    selectedAppointment.isAnonymous) && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Info className="h-5 w-5 text-amber-600" />
                        Thông tin bổ sung
                      </h3>
                      <div className="bg-amber-50 rounded-xl p-4">
                        {selectedAppointment.isAnonymous && (
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="h-4 w-4 text-amber-600" />
                            <p className="text-gray-700">
                              <span className="font-semibold">
                                Khám ẩn danh:
                              </span>{" "}
                              Thông tin cá nhân của bạn sẽ được bảo mật
                            </p>
                          </div>
                        )}
                        {selectedAppointment.notes && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Ghi chú của bạn:
                            </p>
                            <p className="text-gray-700 bg-white rounded-lg p-3">
                              {selectedAppointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 py-4 bg-gray-50 border-t">
                  <div className="w-full space-y-3 flex justify-end">
                    {canCancelAppointment(selectedAppointment) && (
                      <ConfirmDelete
                        onConfirm={handleCancelAppointment}
                        title="Xác nhận hủy lịch hẹn"
                        description="Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không thể hoàn tác."
                        cancelText="Không"
                        confirmText="Xác nhận hủy"
                        trigger={
                          <Button
                            variant="outline"
                            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Hủy lịch hẹn
                          </Button>
                        }
                        asChild
                      />
                    )}
                    {!canCancelAppointment(selectedAppointment) &&
                      selectedAppointment.status !== "CANCELLED" &&
                      selectedAppointment.status !== "COMPLETED" && (
                        <Alert className="border-amber-200 bg-amber-50">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-700">
                            Không thể hủy lịch hẹn trong vòng 24 giờ trước giờ
                            khám
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AppointmentHistory;
