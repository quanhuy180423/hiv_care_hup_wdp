"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Doctor } from "@/types/doctor";
import type { ManualScheduleAssignmentFormValues } from "@/types/doctor";

const manualScheduleSchema = z.object({
  doctorId: z.number({
    required_error: "Vui lòng chọn bác sĩ",
  }),
  date: z.string({
    required_error: "Vui lòng chọn ngày",
  }).refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, {
    message: "Không thể tạo lịch cho ngày trong quá khứ",
  }),
  shift: z.enum(["MORNING", "AFTERNOON"], {
    required_error: "Vui lòng chọn ca làm việc",
  }),
});

interface ManualScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ManualScheduleAssignmentFormValues) => void;
  isPending?: boolean;
  doctors: Doctor[];
}

const shiftLabels = {
  MORNING: "Sáng",
  AFTERNOON: "Chiều",
};

export function ManualScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
  doctors,
}: ManualScheduleModalProps) {
  const form = useForm<ManualScheduleAssignmentFormValues>({
    resolver: zodResolver(manualScheduleSchema),
    defaultValues: {
      doctorId: undefined,
      date: "",
      shift: undefined,
    },
  });

  const handleSubmit = (values: ManualScheduleAssignmentFormValues) => {
    onSubmit(values);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Thêm lịch làm việc
          </DialogTitle>
          <DialogDescription>
            Chọn bác sĩ và thời gian để tạo lịch làm việc mới.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Bác sĩ
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bác sĩ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.user?.name || `Bác sĩ ${doctor.id}`} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ngày làm việc
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Ca làm việc
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ca làm việc" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MORNING">
                        {shiftLabels.MORNING}
                      </SelectItem>
                      <SelectItem value="AFTERNOON">
                        {shiftLabels.AFTERNOON}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang tạo..." : "Tạo lịch"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 