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
import type { AppointmentFormValues, AppointmentType } from "@/types/appointment";
import { useUpdateAppointment } from "@/hooks/useAppointments";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AppointmentFormDialog = ({ open, onClose }: Props) => {
  const { editingAppointment } = useAppointmentModalStore();
  const { register, handleSubmit, setValue, reset } = useForm<AppointmentFormValues>();
  const { mutate, isPending } = useUpdateAppointment();

  useEffect(() => {
    if (editingAppointment) {
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
    if (!editingAppointment) return;
    mutate(
      { id: editingAppointment.id, data },
      { onSuccess: onClose }
    );
  };

  if (!editingAppointment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Cập nhật thông tin cuộc hẹn
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="datetime-local"
            {...register("appointmentTime")}
            className="w-full"
          />

          <Select
            onValueChange={(value) => setValue("type", value as AppointmentType)}
            defaultValue={editingAppointment.type}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="OFFLINE">Offline</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Ghi chú"
            {...register("notes")}
            className="w-full"
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
