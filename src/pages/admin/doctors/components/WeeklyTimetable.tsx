"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import type { Doctor, DoctorSchedule } from "@/types/doctor";
import { ManualScheduleModal } from "./ManualScheduleModal";

interface WeeklyTimetableProps {
  doctors: Doctor[];
  onWeekChange: (startDate: Date, endDate: Date) => void;
  isLoading?: boolean;
  onManualSchedule?: (values: { doctorId: number; date: string; shift: 'MORNING' | 'AFTERNOON' }) => void;
  isManualSchedulePending?: boolean;
  onRefresh?: () => void;
}

interface DoctorWithSchedules extends Doctor {
  schedules: DoctorSchedule[];
}

const shiftColors = {
  MORNING: "bg-blue-100 text-blue-800 border-blue-200",
  AFTERNOON: "bg-green-100 text-green-800 border-green-200",
};

const shiftLabels = {
  MORNING: "Sáng",
  AFTERNOON: "Chiều",
};

export function WeeklyTimetable({ 
  doctors, 
  onWeekChange, 
  isLoading = false,
  onManualSchedule,
  isManualSchedulePending = false,
  onRefresh
}: WeeklyTimetableProps) {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
  });

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const weekDays = eachDayOfInterval({
    start: currentWeek.start,
    end: currentWeek.end,
  });

  const handlePreviousWeek = () => {
    const newWeek = {
      start: subWeeks(currentWeek.start, 1),
      end: subWeeks(currentWeek.end, 1),
    };
    setCurrentWeek(newWeek);
    onWeekChange(newWeek.start, newWeek.end);
  };

  const handleNextWeek = () => {
    const newWeek = {
      start: addWeeks(currentWeek.start, 1),
      end: addWeeks(currentWeek.end, 1),
    };
    setCurrentWeek(newWeek);
    onWeekChange(newWeek.start, newWeek.end);
  };

  const handleCurrentWeek = () => {
    const now = new Date();
    const newWeek = {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
    setCurrentWeek(newWeek);
    onWeekChange(newWeek.start, newWeek.end);
  };

  const getDoctorScheduleForDay = (doctor: DoctorWithSchedules, date: Date) => {
    return doctor.schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return isSameDay(scheduleDate, date);
    });
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isPastWeek = () => {
    const today = new Date();
    return currentWeek.end < today;
  };

  const handleManualSchedule = (values: { doctorId: number; date: string; shift: 'MORNING' | 'AFTERNOON' }) => {
    if (onManualSchedule) {
      onManualSchedule(values);
    }
    setIsManualModalOpen(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch làm việc tuần
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsManualModalOpen(true)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm lịch
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousWeek}
                disabled={isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCurrentWeek}
                disabled={isLoading}
              >
                Tuần hiện tại
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextWeek}
                disabled={isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {format(currentWeek.start, "dd/MM/yyyy", { locale: vi })} -{" "}
            {format(currentWeek.end, "dd/MM/yyyy", { locale: vi })}
            {isPastWeek() && (
              <Badge variant="secondary" className="ml-2">
                Tuần trong quá khứ
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="font-semibold text-sm text-gray-600 p-2">Bác sĩ</div>
                  {weekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={`text-center p-2 text-sm font-medium ${
                        isToday(day) ? "bg-blue-50 text-blue-700 rounded" : ""
                      }`}
                    >
                      <div className="font-semibold">
                        {format(day, "EEE", { locale: vi })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(day, "dd/MM", { locale: vi })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="grid grid-cols-8 gap-2 items-start border-b border-gray-100 pb-2"
                    >
                      <div className="p-2">
                        <div className="font-medium text-sm">{doctor.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{doctor.specialization}</div>
                      </div>

                      {weekDays.map((day) => {
                        const daySchedules = getDoctorScheduleForDay(doctor as DoctorWithSchedules, day);
                        const isSunday = day.getDay() === 0;
                        const isSaturdayAfternoon = day.getDay() === 6;

                        return (
                          <div key={day.toISOString()} className="p-1 min-h-[60px]">
                            {isSunday ? (
                              <div className="text-center text-xs text-gray-400 py-2">
                                Nghỉ
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {daySchedules.map((schedule) => (
                                  <Badge
                                    key={schedule.id}
                                    variant="outline"
                                    className={`text-xs px-2 py-1 w-full justify-center ${
                                      shiftColors[schedule.shift as keyof typeof shiftColors]
                                    }`}
                                  >
                                    {shiftLabels[schedule.shift as keyof typeof shiftLabels]}
                                  </Badge>
                                ))}
                                {daySchedules.length === 0 && !isSaturdayAfternoon && (
                                  <div className="text-center text-xs text-gray-400 py-1">
                                    -
                                  </div>
                                )}
                                {daySchedules.length === 0 && isSaturdayAfternoon && (
                                  <div className="text-center text-xs text-gray-400 py-1">
                                    Nghỉ
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {doctors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Không có bác sĩ nào trong hệ thống
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ManualScheduleModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleManualSchedule}
        isPending={isManualSchedulePending}
        doctors={doctors}
      />
    </>
  );
} 