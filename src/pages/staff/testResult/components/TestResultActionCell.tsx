import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { testResultSchema } from "@/schemas/testResult";
import type { Appointment } from "@/types/appointment";
import type { TestResultFormValues } from "@/types/testResult";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Calendar, CalendarIcon } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { Form, useForm } from "react-hook-form";

interface TestResultFormProps {
  appointment: Appointment;
}

const TestResultForm = ({ appointment }: TestResultFormProps) => {
  const form = useForm({
    resolver: zodResolver(testResultSchema),
    defaultValues: {
      name: appointment?.service?.name || "",
      userId: appointment?.user?.id,
      doctorId: appointment?.doctor?.user?.id,
      type: appointment?.type || "",
      result: "",
      price: Number(appointment?.service?.price) || undefined,
      description: "",
      patientTreatmentId: undefined,
      resultDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<TestResultFormValues> = (data) => {
    console.log("Form data submitted:", data);
    alert("Dữ liệu đã được gửi thành công! Kiểm tra console để xem dữ liệu.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Tạo Kết Quả Xét Nghiệm
        </h1>
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Tên Xét Nghiệm</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="Ví dụ: Xét nghiệm máu tổng quát"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* User ID Field */}
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="userId">ID Người Dùng</FormLabel>
                <FormControl>
                  <Input
                    id="userId"
                    type="number"
                    placeholder="Ví dụ: 123"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.userId?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Doctor ID Field */}
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="doctorId">ID Bác Sĩ</FormLabel>
                <FormControl>
                  <Input
                    id="doctorId"
                    type="number"
                    placeholder="Ví dụ: 456"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.doctorId?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Type Field */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="type">Loại Xét Nghiệm</FormLabel>
                <FormControl>
                  <Input id="type" placeholder="Ví dụ: Huyết học" {...field} />
                </FormControl>
                <FormMessage>{form.formState.errors.type?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Result Field */}
          <FormField
            control={form.control}
            name="result"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="result">Kết Quả</FormLabel>
                <FormControl>
                  <Textarea
                    id="result"
                    placeholder="Nhập kết quả xét nghiệm chi tiết..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.result?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="price">Giá</FormLabel>
                <FormControl>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Ví dụ: 150000.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.price?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Mô Tả (Tùy chọn)</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder="Thêm mô tả về xét nghiệm nếu cần..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.description?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Patient Treatment ID Field */}
          <FormField
            control={form.control}
            name="patientTreatmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="patientTreatmentId">
                  ID Điều Trị Bệnh Nhân
                </FormLabel>
                <FormControl>
                  <Input
                    id="patientTreatmentId"
                    type="number"
                    placeholder="Ví dụ: 789"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.patientTreatmentId?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Result Date Field */}
          <FormField
            control={form.control}
            name="resultDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày Kết Quả</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value as Date}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage>
                  {form.formState.errors.resultDate?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-6 py-2">
            Tạo Kết Quả Xét Nghiệm
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default TestResultForm;
