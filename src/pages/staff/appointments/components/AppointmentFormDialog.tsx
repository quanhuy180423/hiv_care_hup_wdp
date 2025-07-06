"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppointmentModalStore } from "@/store/appointmentStore";
import type { AppointmentFormValues } from "@/types/appointment";
import { useUpdateAppointment } from "@/hooks/useAppointments";
import { useEffect, useState } from "react";
import { useServices } from "@/hooks/useServices";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDoctors } from "@/hooks/useDoctor";

const slots = [
  { start: "07:00", end: "07:30" },
  { start: "07:35", end: "08:05" },
  { start: "08:10", end: "08:40" },
  { start: "08:45", end: "09:15" },
  { start: "09:20", end: "09:50" },
  { start: "09:55", end: "10:25" },
  { start: "10:30", end: "11:00" },
  { start: "13:00", end: "13:30" },
  { start: "13:35", end: "14:05" },
  { start: "14:10", end: "14:40" },
  { start: "14:45", end: "15:15" },
  { start: "15:20", end: "15:50" },
  { start: "15:55", end: "16:25" },
  { start: "16:30", end: "17:00" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const AppointmentFormDialog = ({ open, onClose }: Props) => {
  const { editingAppointment } = useAppointmentModalStore();
  const { register, handleSubmit, setValue, reset, watch } =
    useForm<AppointmentFormValues>();
  const { mutate, isPending } = useUpdateAppointment();

  const { services } = useServices(1, 100);
  const { data: doctors } = useDoctors();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    if (editingAppointment) {
      const [datePart, timePart] =
        editingAppointment.appointmentTime.split("T");
      setSelectedDate(datePart);
      setSelectedSlot(timePart?.slice(0, 5) || "");

      reset({
        userId: editingAppointment.userId,
        serviceId: editingAppointment.serviceId,
        appointmentTime: editingAppointment.appointmentTime,
        isAnonymous: editingAppointment.isAnonymous,
        type: editingAppointment.type,
        notes: editingAppointment.notes || "",
        doctorId: editingAppointment.doctorId,
      });
    }
  }, [editingAppointment, reset]);

  const onSubmit = (data: AppointmentFormValues) => {
    if (!editingAppointment || !selectedDate || !selectedSlot) return;

    const appointmentTime = `${selectedDate}T${selectedSlot}`;

    mutate(
      { id: editingAppointment.id, data: { ...data, appointmentTime } },
      { onSuccess: onClose }
    );
  };

  if (!editingAppointment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Cập nhật thông tin cuộc hẹn
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4"
        >
          {/* Bệnh nhân - Bác sĩ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bệnh nhân */}
            <div>
              <Label className="mb-2">Bệnh nhân</Label>
              <Input
                value={editingAppointment.user.name}
                disabled
                className="w-full"
              />
            </div>

            {/* Bác sĩ */}
            <div>
              <Label className="mb-2">Bác sĩ</Label>
              <Select
                onValueChange={(value) => setValue("doctorId", Number(value))}
                defaultValue={editingAppointment.doctorId?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn bác sĩ" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {doctors?.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dịch vụ */}
          <div>
            <Label className="mb-2">Dịch vụ</Label>
            <Select
              onValueChange={(value) => {
                const selectedService = services?.data?.data.find(
                  (s) => s.id === Number(value)
                );
                setValue("serviceId", Number(value));
                if (selectedService) {
                  const autoType =
                    selectedService.type === "CONSULT" ? "ONLINE" : "OFFLINE";
                  setValue("type", autoType);
                }
              }}
              defaultValue={editingAppointment.serviceId.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn dịch vụ" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {services?.data?.data.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ngày - Giờ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngày */}
            <div>
              <Label className="mb-2">Ngày khám</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Giờ */}
            <div>
              <Label className="mb-2">Khung giờ</Label>
              <Select
                onValueChange={(value) => setSelectedSlot(value)}
                defaultValue={selectedSlot}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn khung giờ" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {slots.map((slot) => (
                    <SelectItem key={slot.start} value={slot.start}>
                      {slot.start} - {slot.end}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hình thức - Ẩn danh */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            {/* Hình thức */}
            <div>
              <Label className="mb-2">Hình thức</Label>
              <Input
                value={watch("type") === "ONLINE" ? "Online" : "Offline"}
                disabled
                className="w-full"
              />
            </div>

            {/* Ẩn danh */}
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Label htmlFor="isAnonymous">Ẩn danh</Label>
              <Switch
                checked={watch("isAnonymous")}
                onCheckedChange={(value) => setValue("isAnonymous", value)}
                id="isAnonymous"
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 border border-gray-300 shadow-md"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <Label className="mb-2">Ghi chú</Label>
            <Textarea
              placeholder="Ghi chú thêm"
              {...register("notes")}
              className="w-full"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full cursor-pointer" disabled={isPending} variant="outline">
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
