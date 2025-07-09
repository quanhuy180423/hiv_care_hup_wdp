"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateScheduleFormSchema } from "@/schemas/doctor";

interface GenerateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { startDate: string; doctorsPerShift: number }) => void;
  isPending: boolean;
}

export function GenerateScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: GenerateScheduleModalProps) {
  const form = useForm({
    resolver: zodResolver(generateScheduleFormSchema),
    defaultValues: {
      startDate: "",
      doctorsPerShift: 2,
    },
  });

  const handleSubmit = (values: { startDate: string; doctorsPerShift: number }) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Tạo lịch làm việc
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Tạo lịch làm việc tự động cho các bác sĩ trong tuần.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Ngày bắt đầu</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="Chọn ngày bắt đầu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doctorsPerShift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Số bác sĩ mỗi ca</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Nhập số bác sĩ"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Lưu ý:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ngày bắt đầu phải là Chủ nhật hoặc Thứ 2</li>
                <li>• Lịch sẽ được tạo cho tuần tiếp theo</li>
                <li>• Không tạo lịch cho Chủ nhật</li>
                <li>• Thứ 7 chỉ có ca sáng</li>
              </ul>
            </div>

            <DialogFooter className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} type="button" className="cursor-pointer">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} variant="outline" className="cursor-pointer">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Tạo lịch"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 