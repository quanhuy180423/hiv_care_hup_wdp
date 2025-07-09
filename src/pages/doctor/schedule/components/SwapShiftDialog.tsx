"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import {
  useDoctorSchedule,
  useDoctorSchedulesByDate,
  useSwapShifts,
} from "@/hooks/useDoctor";
import toast from "react-hot-toast";
import type { ShiftType } from "@/types/doctor";
import { formatDate } from "@/lib/utils/dates/formatDate";

interface SwapShiftDialogProps {
  doctorId: number;
}

export default function SwapShiftDialog({ doctorId }: SwapShiftDialogProps) {
  const [open, setOpen] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [fromShift, setFromShift] = useState<ShiftType>("MORNING");

  const [toDate, setToDate] = useState("");
  const [toShift, setToShift] = useState<ShiftType>("MORNING");

  const [targetDoctorId, setTargetDoctorId] = useState("");

  const { data: mySchedules } = useDoctorSchedule(doctorId);
  const { data: availableDoctorsData } = useDoctorSchedulesByDate(toDate);
  const { mutate: swapShifts, isPending } = useSwapShifts();

  // Danh sách lịch trực hiện tại của bác sĩ
  const uniqueDates: string[] =
    mySchedules
      ?.filter((s) => !s.isOff)
      .reduce((acc: string[], curr) => {
        const date = curr.date.slice(0, 10);
        if (!acc.includes(date)) acc.push(date);
        return acc;
      }, []) || [];

  // Bác sĩ khả dụng để đổi sang
  const availableDoctors = useMemo(() => {
    return (
      availableDoctorsData
        ?.filter((doctor) => doctor.id !== doctorId)
        .filter((doctor) =>
          doctor.schedules.some((s) => s.shift === toShift && !s.isOff)
        )
        .map((doctor) => ({
          id: doctor.id,
          name: doctor.user?.name || `Bác sĩ #${doctor.id}`,
        })) || []
    );
  }, [availableDoctorsData, doctorId, toShift]);

  const handleSwap = () => {
    if (!fromDate || !fromShift || !toDate || !toShift || !targetDoctorId) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    swapShifts({
      doctor1: {
        id: doctorId,
        date: fromDate,
        shift: fromShift,
      },
      doctor2: {
        id: parseInt(targetDoctorId),
        date: toDate,
        shift: toShift,
      },
    });

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setFromDate("");
          setFromShift("MORNING");
          setToDate("");
          setToShift("MORNING");
          setTargetDoctorId("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Đổi ca trực</Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đổi ca trực</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 1. Chọn lịch bác sĩ hiện tại */}
          <div className="text-sm font-semibold col-span-4">
            Lịch trực của bạn
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Ngày</Label>
            <Select value={fromDate} onValueChange={setFromDate}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Chọn ngày" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {formatDate(date, "dd/MM/yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Ca</Label>
            <Select
              value={fromShift}
              onValueChange={(v) => setFromShift(v as ShiftType)}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Chọn ca" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="MORNING">Ca sáng</SelectItem>
                <SelectItem value="AFTERNOON">Ca chiều</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Chọn lịch bác sĩ khác */}
          <div className="text-sm font-semibold col-span-4">
            Lịch trực muốn đổi sang
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Ngày</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setTargetDoctorId("");
              }}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Ca</Label>
            <Select
              value={toShift}
              onValueChange={(v) => setToShift(v as ShiftType)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn ca" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="MORNING">Ca sáng</SelectItem>
                <SelectItem value="AFTERNOON">Ca chiều</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {toDate && (
            <div className="col-span-4">
              <Label className="block mb-1">Bác sĩ</Label>
              <Select value={targetDoctorId} onValueChange={setTargetDoctorId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn bác sĩ phù hợp" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {availableDoctors.length > 0 ? (
                    availableDoctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id.toString()}>
                        {doc.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Không có bác sĩ phù hợp
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSwap}
            disabled={isPending}
            variant="outline"
            className="cursor-pointer"
          >
            {isPending ? "Đang xử lý..." : "Xác nhận đổi ca"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
