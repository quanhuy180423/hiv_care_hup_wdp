import { useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { useDoctorSchedule } from "@/hooks/useDoctor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sun,
  Moon,
  Coffee,
  Clock,
  Users,
  AlertCircle,
  Calendar as CalendarLarge,
  Stethoscope,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DoctorSchedule } from "@/types/doctor";
import useAuthStore from "@/store/authStore";
import { vi } from "date-fns/locale";

interface GroupedSchedule {
  [date: string]: {
    dayOfWeek: string;
    shifts: {
      [shift in "MORNING" | "AFTERNOON"]?: DoctorSchedule;
    };
  };
}

export default function DoctorSchedule() {
  const { userProfile } = useAuthStore((state) => state);
  const doctorId = Number(userProfile?.doctorId) || 0;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data, isLoading, isError } = useDoctorSchedule(doctorId);

  const groupSchedulesByDate = (
    schedules: DoctorSchedule[]
  ): GroupedSchedule => {
    const result: GroupedSchedule = {};
    schedules.forEach((schedule) => {
      const dateStr = schedule.date.slice(0, 10);
      if (!result[dateStr]) {
        result[dateStr] = {
          dayOfWeek: schedule.dayOfWeek,
          shifts: {},
        };
      }
      result[dateStr].shifts[schedule.shift as "MORNING" | "AFTERNOON"] =
        schedule;
    });
    return result;
  };

  const grouped = data ? groupSchedulesByDate(data) : {};
  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    format(addDays(selectedDate, i), "yyyy-MM-dd")
  );

  // Calculate statistics
  const totalShifts = weekDates.reduce((total, dateStr) => {
    const daySchedule = grouped[dateStr];
    if (!daySchedule) return total;

    const workingShifts = Object.values(daySchedule.shifts).filter(
      (shift) => shift && !shift.isOff
    ).length;

    return total + workingShifts;
  }, 0);

  const goToPreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const goToNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getShiftInfo = (shift: string) => {
    switch (shift) {
      case "MORNING":
        return {
          icon: Sun,
          label: "Ca sáng",
          time: "07:00 - 11:00",
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
      case "AFTERNOON":
        return {
          icon: Coffee,
          label: "Ca chiều",
          time: "13:00 - 17:00",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "EVENING":
        return {
          icon: Moon,
          label: "Ca tối",
          time: "18:00 - 22:00",
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
        };
      default:
        return {
          icon: Clock,
          label: "Ca khác",
          time: "",
          color: "text-slate-600",
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
        };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-2">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 rounded-3xl" />
        <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <CalendarLarge className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Lịch trực bác sĩ
                    </h1>
                    <p className="text-slate-600 font-medium">
                      Quản lý lịch trực và ca làm việc hàng tuần
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                      {totalShifts} ca trực tuần này
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">
                      Bác sĩ chuyên khoa
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 rounded-full">
                    <Clock className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-semibold text-violet-700">
                      Tuần {format(selectedDate, "w/yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToToday}
                    className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Hôm nay
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[260px] justify-start text-left font-normal hover:bg-blue-50 hover:border-blue-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                        {format(selectedDate, "EEEE, dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-white shadow-xl border-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousWeek}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Tuần trước
            </Button>

            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">
                {format(selectedDate, "dd/MM/yyyy")} -{" "}
                {format(addDays(selectedDate, 6), "dd/MM/yyyy")}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Tuần {format(selectedDate, "w")} năm{" "}
                {format(selectedDate, "yyyy")}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={goToNextWeek}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
            >
              Tuần sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <CalendarIcon className="w-6 h-6 text-blue-500" />
            Lịch trực chi tiết
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-16 w-32" />
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Skeleton key={j} className="h-16 flex-1" />
                  ))}
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                Lỗi tải dữ liệu
              </h3>
              <p className="text-red-600 mb-4">
                Không thể tải lịch trực. Vui lòng thử lại.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Tải lại
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="p-4 mt-2 bg-slate-100 rounded-xl font-semibold text-slate-700">
                    Ca làm việc
                  </div>
                  {weekDates.map((dateStr) => {
                    const date = parseISO(dateStr);
                    const isToday =
                      format(date, "yyyy-MM-dd") ===
                      format(new Date(), "yyyy-MM-dd");
                    const daySchedule = grouped[dateStr];

                    return (
                      <div
                        key={dateStr}
                        className={cn(
                          "p-4 rounded-xl text-center font-medium transition-all duration-200 mt-2",
                          isToday
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wide opacity-75 mb-1">
                            {daySchedule?.dayOfWeek || format(date, "EEE")}
                          </span>
                          <span className="font-bold">
                            {format(date, "dd/MM")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shift Rows */}
                <div className="space-y-3">
                  {["MORNING", "AFTERNOON"].map((shift) => {
                    const shiftInfo = getShiftInfo(shift);

                    return (
                      <div key={shift} className="grid grid-cols-8 gap-2">
                        {/* Shift Label */}
                        <div
                          className={cn(
                            "p-4 rounded-xl border-2 font-medium mb-2",
                            shiftInfo.bgColor,
                            shiftInfo.borderColor
                          )}
                        >
                          <div className="flex items-center gap-3 py-2">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                shiftInfo.color
                              )}
                            >
                              <shiftInfo.icon className="h-5 w-5" />
                            </div>
                            <div
                              className={cn("font-semibold", shiftInfo.color)}
                            >
                              {shiftInfo.label}
                            </div>
                          </div>
                          <div className="text-xs text-slate-600 mt-2 flex justify-center">
                            {shiftInfo.time}
                          </div>
                        </div>

                        {/* Daily Schedule Cells */}
                        {weekDates.map((dateStr) => {
                          const daySchedule = grouped[dateStr];
                          const shiftSchedule =
                            daySchedule?.shifts?.[
                              shift as "MORNING" | "AFTERNOON"
                            ];
                          const isWorking =
                            shiftSchedule && !shiftSchedule.isOff;
                          const isToday =
                            format(parseISO(dateStr), "yyyy-MM-dd") ===
                            format(new Date(), "yyyy-MM-dd");

                          return (
                            <div
                              key={`${dateStr}-${shift}`}
                              className={cn(
                                "p-4 rounded-xl border-2 mb-2",
                                isToday && "ring-2 ring-blue-400 ring-offset-2",
                                isWorking
                                  ? "bg-emerald-50 border-emerald-200"
                                  : "bg-red-50 border-red-200"
                              )}
                            >
                              <div className="text-center">
                                <div
                                  className={cn(
                                    "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-white shadow-lg",
                                    isWorking
                                      ? "bg-gradient-to-br from-emerald-500 to-green-600"
                                      : "bg-gradient-to-br from-red-500 to-rose-600"
                                  )}
                                >
                                  {isWorking ? (
                                    <Check className="h-6 w-6" />
                                  ) : (
                                    <X className="h-6 w-6" />
                                  )}
                                </div>

                                <div
                                  className={cn(
                                    "font-semibold text-sm",
                                    isWorking
                                      ? "text-emerald-700"
                                      : "text-red-700"
                                  )}
                                >
                                  {isWorking ? "Trực" : "Không có lịch"}
                                </div>

                                {isWorking &&
                                  (() => {
                                    const now = new Date();
                                    const currentDateStr = format(
                                      now,
                                      "yyyy-MM-dd"
                                    );

                                    const isToday = dateStr === currentDateStr;

                                    const currentHour = now.getHours();
                                    let isWithinShiftTime = false;

                                    if (shift === "MORNING") {
                                      isWithinShiftTime =
                                        currentHour >= 7 && currentHour < 11;
                                    } else if (shift === "AFTERNOON") {
                                      isWithinShiftTime =
                                        currentHour >= 13 && currentHour < 17;
                                    }

                                    return isToday && isWithinShiftTime ? (
                                      <Badge
                                        variant="secondary"
                                        className="mt-2 bg-emerald-100 text-emerald-800 text-xs hover:bg-emerald-100"
                                      >
                                        Đang làm việc
                                      </Badge>
                                    ) : null;
                                  })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Ca trực tuần này
                </p>
                <p className="text-2xl font-bold text-emerald-900">
                  {totalShifts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Giờ làm việc dự kiến
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalShifts * 4}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-violet-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-violet-600">
                  Bệnh nhân dự kiến
                </p>
                <p className="text-2xl font-bold text-violet-900">
                  {totalShifts * 8}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
