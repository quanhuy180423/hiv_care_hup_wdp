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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { swapShiftsFormSchema } from "@/schemas/doctor";
import { useAllDoctors } from "@/hooks/useDoctors";
import type { SwapShiftsFormValues, Doctor } from "@/types/doctor";

interface SwapShiftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SwapShiftsFormValues) => void;
  isPending: boolean;
}

export function SwapShiftsModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: SwapShiftsModalProps) {
  const { data: doctors = [] } = useAllDoctors();
  
  const form = useForm<SwapShiftsFormValues>({
    resolver: zodResolver(swapShiftsFormSchema),
    defaultValues: {
      doctor1: {
        id: 0,
        date: "",
        shift: "MORNING",
      },
      doctor2: {
        id: 0,
        date: "",
        shift: "MORNING",
      },
    },
  });

  const handleSubmit = (values: SwapShiftsFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Đổi ca làm việc
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Đổi ca làm việc giữa hai bác sĩ.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Bác sĩ 1</h3>
                
                <FormField
                  control={form.control}
                  name="doctor1.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Bác sĩ</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString() || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn bác sĩ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {doctors.map((doctor: Doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                              {doctor.user?.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600 font-semibold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctor1.date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Ngày</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          placeholder="Chọn ngày"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 font-semibold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctor1.shift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Ca</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ca" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="MORNING">Sáng</SelectItem>
                          <SelectItem value="AFTERNOON">Chiều</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600 font-semibold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Bác sĩ 2</h3>
                
                <FormField
                  control={form.control}
                  name="doctor2.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Bác sĩ</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString() || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn bác sĩ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {doctors.map((doctor: Doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                              {doctor.user?.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600 font-semibold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctor2.date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Ngày</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          placeholder="Chọn ngày"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 font-semibold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctor2.shift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Ca</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ca" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="MORNING">Sáng</SelectItem>
                          <SelectItem value="AFTERNOON">Chiều</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600 font-semibold" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Lưu ý:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Cả hai ngày phải trong tương lai</li>
                <li>• Khoảng cách giữa 2 ngày không quá 5 ngày</li>
                <li>• Không đổi ca vào Chủ nhật</li>
                <li>• Cả hai bác sĩ phải có lịch làm việc</li>
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
                  "Đổi ca"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 