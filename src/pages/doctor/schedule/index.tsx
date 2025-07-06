"use client";

import { useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { useDoctorSchedule } from "@/hooks/useDoctor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DoctorSchedule } from "@/types/doctor";

interface GroupedSchedule {
  [date: string]: {
    dayOfWeek: string;
    shifts: {
      [shift in "MORNING" | "AFTERNOON" | "EVENING"]?: DoctorSchedule;
    };
  };
}

export default function DoctorSchedule() {
  const doctorData = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const doctorId = doctorData.doctorId;

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
      result[dateStr].shifts[
        schedule.shift as "MORNING" | "AFTERNOON" | "EVENING"
      ] = schedule;
    });
    return result;
  };

  const grouped = data ? groupSchedulesByDate(data) : {};
  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    format(addDays(selectedDate, i), "yyyy-MM-dd")
  );

  const goToPreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const goToNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {" "}
            Lịch Trực Bác Sĩ
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi lịch trực theo tuần và ca làm việc
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hôm nay
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
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

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goToPreviousWeek}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Tuần trước
        </Button>
        <h2 className="text-lg font-semibold text-center">
          {format(selectedDate, "dd/MM/yyyy")} -{" "}
          {format(addDays(selectedDate, 6), "dd/MM/yyyy")}
        </h2>
        <Button variant="outline" onClick={goToNextWeek}>
          Tuần sau
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Chi tiết ca làm việc trong tuần
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-6">
              Lỗi khi tải dữ liệu.
            </div>
          ) : (
            <div className="overflow-auto rounded-lg border">
              <table className="min-w-full table-fixed text-sm text-center">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 sticky left-0 bg-muted text-left">
                      Ca / Ngày
                    </th>
                    {weekDates.map((dateStr) => {
                      const date = parseISO(dateStr);
                      const isToday =
                        format(date, "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd");
                      const daySchedule = grouped[dateStr];
                      return (
                        <th
                          key={dateStr}
                          className={cn(
                            "p-3 font-medium",
                            isToday && "bg-accent"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="uppercase text-xs text-muted-foreground">
                              {daySchedule?.dayOfWeek || format(date, "EEE")}
                            </span>
                            <span
                              className={cn(
                                isToday ? "font-bold text-primary" : ""
                              )}
                            >
                              {format(date, "dd/MM")}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {["MORNING", "AFTERNOON"].map((shift) => (
                    <tr key={shift} className="border-t hover:bg-muted/50">
                      <td className="p-3 text-left font-medium whitespace-nowrap sticky left-0 bg-white">
                        {shift === "MORNING" ? (
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-yellow-500" />
                            <span>Ca sáng(7h-11h)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-indigo-500" />
                            <span>Ca chiều(13h-17h)</span>
                          </div>
                        )}
                      </td>
                      {weekDates.map((dateStr) => {
                        const daySchedule = grouped[dateStr];
                        const isWorking =
                          daySchedule?.shifts?.[
                            shift as "MORNING" | "AFTERNOON"
                          ] &&
                          !daySchedule.shifts[shift as "MORNING" | "AFTERNOON"]!
                            .isOff;
                        return (
                          <td key={`${dateStr}-${shift}`} className="p-3">
                            <div
                              className={cn(
                                "inline-flex items-center gap-1",
                                isWorking ? "text-green-600" : "text-red-500"
                              )}
                            >
                              {isWorking ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                              {isWorking ? "Có trực" : "Không trực"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
