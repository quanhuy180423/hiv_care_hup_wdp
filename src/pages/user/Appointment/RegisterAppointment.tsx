import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { useDoctorSchedulesByDate } from "@/hooks/useDoctor";
import { slots } from "@/lib/utils/slotsAppointment";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAppointment } from "@/hooks/useAppointments";
import type { AppointmentFormValues, AppointmentType } from "@/types/appointment";
import { useNavigate } from "react-router";

const appointmentSchema = z
  .object({
    userId: z.number(),
    doctorId: z.number().nonnegative("Vui lòng chọn bác sĩ"),
    serviceId: z.number().nonnegative("Vui lòng chọn dịch vụ"),
    appointmentDate: z.string().nonempty("Vui lòng chọn ngày"),
    appointmentTime: z.string().nonempty("Vui lòng chọn khung giờ"),
    isAnonymous: z.boolean(),
    type: z.enum(["OFFLINE", "ONLINE"]),
    notes: z.string().nullable(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(data.appointmentDate);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    {
      message: "Vui lòng chọn ngày từ hôm nay trở đi",
      path: ["appointmentDate"],
    }
  );

const RegisterAppointment = () => {
  const navigation = useNavigate();
  const { userProfile } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState(slots);

  const services = useServices({
    page: 1,
    limit: 100,
  });
  const { data: doctors } = useDoctorSchedulesByDate(
    selectedDate || new Date().toISOString().split("T")[0]
  );
  const { mutate: createAppointment } = useCreateAppointment();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      userId: userProfile?.id ? Number(userProfile.id) : 0,
      doctorId: 0,
      serviceId: 0,
      appointmentDate: "",
      appointmentTime: "",
      isAnonymous: false,
      type: "OFFLINE",
      notes: "",
    },
  });

  const selectedServiceId = watch("serviceId");
  const selectedService = services?.data?.data?.find(
    (service: { id: number; name: string; type: string }) =>
      service.id === selectedServiceId
  );

  useEffect(() => {
    if (selectedService) {
      if (selectedService.type === "CONSULT") {
        setValue("type", "ONLINE");
      } else {
        setValue("isAnonymous", false);
        setValue("type", "OFFLINE");
      }
    }
  }, [selectedService, setValue]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setValue("appointmentDate", date);
    setValue("appointmentTime", "");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      toast.error("Vui lòng chọn ngày từ hôm nay trở đi");
      return;
    }

    const now = new Date();
    const isToday = selected.getTime() === today.getTime();

    if (isToday) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const filteredSlots = slots.filter((slot) => {
        const [hours, minutes] = slot.start.split(":").map(Number);
        const slotTime = hours * 60 + minutes;
        return slotTime > currentTime;
      });
      setAvailableSlots(filteredSlots);

      if (filteredSlots.length === 0) {
        toast.error(
          "Không có khung giờ trống cho hôm nay. Vui lòng chọn ngày khác."
        );
      }
    } else {
      setAvailableSlots(slots);
    }
  };

  const onSubmit = (data: z.infer<typeof appointmentSchema>) => {
    if (!data.appointmentDate) {
      toast.error("Vui lòng chọn ngày hẹn");
      return;
    }

    if (!data.appointmentTime) {
      toast.error("Vui lòng chọn khung giờ");
      return;
    }

    // Format appointmentTime
    const [startTime] = data.appointmentTime.split("-");
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date(data.appointmentDate);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const pad = (n: number) => String(n).padStart(2, "0");
    const localISOString = `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(date.getDate())}T${pad(hours)}:${pad(minutes)}:00Z`;

    // Check if selected time slot is still valid for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(data.appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const slotTime = hours * 60 + minutes;
      if (slotTime <= currentTime) {
        toast.error("Khung giờ đã chọn đã qua. Vui lòng chọn giờ khác.");
        return;
      }
    }

    // Prepare submit data based on service type
    let submitData: AppointmentFormValues;
    if (selectedService?.type !== "CONSULT") {
      submitData = {
        userId: data.userId,
        doctorId: data.doctorId,
        serviceId: data.serviceId,
        appointmentTime: localISOString,
        isAnonymous: false,
        type: data.type,
        notes: data.notes,
      };
    } else {
      submitData = {
        userId: data.userId,
        serviceId: data.serviceId,
        appointmentTime: localISOString,
        isAnonymous: data.isAnonymous,
        type: "ONLINE" as AppointmentType,
        notes: data.notes,
      };
    }

    createAppointment(submitData, {
      onSuccess: () => {
        toast.success("Đặt lịch hẹn thành công!");
        navigation("/user/appointments");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Đăng Ký Lịch Hẹn Khám Bệnh
              </CardTitle>
              <p className="text-purple-100 opacity-90">
                Đặt lịch hẹn với các chuyên gia y tế của chúng tôi
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-semibold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Thông Tin Bệnh Nhân
              </Label>
              <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Họ và tên</p>
                    <p className="font-semibold text-gray-800">
                      {userProfile?.name || "Chưa có"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">
                      {userProfile?.email || "Chưa có"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500">Số điện thoại</p>
                    <p className="font-semibold text-gray-800">
                      {userProfile?.phoneNumber || "Chưa có"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="space-y-3">
              <Label
                htmlFor="serviceId"
                className="text-gray-700 font-semibold flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Chọn Dịch Vụ <span className="text-red-500 ml-1">*</span>
              </Label>
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="Chọn dịch vụ bạn cần" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {services?.data?.data?.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.serviceId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.serviceId.message}
                </p>
              )}
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Selection */}
              <div className="space-y-3">
                <Label
                  htmlFor="appointmentDate"
                  className="text-gray-700 font-semibold flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Chọn Ngày <span className="text-red-500 ml-1">*</span>
                </Label>
                <Controller
                  name="appointmentDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      {...field}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleDateChange(e.target.value);
                      }}
                      className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  )}
                />
                {errors.appointmentDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.appointmentDate.message}
                  </p>
                )}
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-3">
                <Label
                  htmlFor="appointmentTime"
                  className="text-gray-700 font-semibold flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Chọn Khung Giờ <span className="text-red-500 ml-1">*</span>
                </Label>
                <Controller
                  name="appointmentTime"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedDate}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          !selectedDate ? "bg-gray-50 text-gray-400" : ""
                        } border-gray-300 focus:ring-purple-500 focus:border-purple-500`}
                      >
                        <SelectValue
                          placeholder={
                            !selectedDate
                              ? "Vui lòng chọn ngày trước"
                              : "Chọn khung giờ"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="flex items-center bg-white ">
                        {availableSlots.length === 0 ? (
                          <div className="p-2 text-center text-gray-500">
                            Không có khung giờ trống
                          </div>
                        ) : (
                          availableSlots.map((slot, index) => (
                            <SelectItem
                              key={index}
                              value={`${slot.start}-${slot.end}`}
                              className="flex items-center hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 ease-in-out"
                            >
                              <span className="mr-2">⏰</span>
                              {slot.start} - {slot.end}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.appointmentTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Doctor Selection */}
            {selectedService?.type !== "CONSULT" && (
            <div className="space-y-3">
              <Label
                htmlFor="doctorId"
                className="text-gray-700 font-semibold flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Chọn Bác Sĩ <span className="text-red-500 ml-1">*</span>
              </Label>
              <Controller
                name="doctorId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="Chọn bác sĩ" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors?.map((doctor) => (
                        <SelectItem
                          key={doctor.id}
                          value={doctor.id.toString()}
                          className="flex items-center bg-white hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 ease-in-out"
                        >
                          <span className="mr-2">👨‍⚕️</span>
                          BS. {doctor.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.doctorId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.doctorId.message}
                </p>
              )}
            </div>
            )}

            {/* Appointment Type */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-semibold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Loại Hình Khám
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled
                  >
                    <SelectTrigger
                      className={`w-full ${
                        selectedService ? "bg-gray-50" : ""
                      } border-gray-300 focus:ring-purple-500 focus:border-purple-500`}
                    >
                      <SelectValue placeholder="Chọn loại hình khám" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OFFLINE" className="flex items-center">
                        <span className="mr-2">🏥</span>
                        Khám trực tiếp
                      </SelectItem>
                      <SelectItem value="ONLINE" className="flex items-center">
                        <span className="mr-2">💻</span>
                        Tư vấn trực tuyến
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {selectedService && (
                <p className="text-purple-600 text-sm mt-1">
                  Loại hình khám được tự động thiết lập dựa trên dịch vụ đã chọn
                </p>
              )}
            </div>

            {/* Anonymous Checkbox */}
            {selectedService?.type === "CONSULT" && (
              <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-3">
                  <Controller
                    name="isAnonymous"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="isAnonymous"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-purple-500 data-[state=checked]:bg-purple-600"
                      />
                    )}
                  />
                  <Label
                    htmlFor="isAnonymous"
                    className="text-gray-700 font-medium"
                  >
                    Đăng ký ẩn danh
                  </Label>
                </div>
                <p className="text-purple-600 text-sm mt-1 ml-8">
                  Chỉ áp dụng cho dịch vụ tư vấn để bảo vệ quyền riêng tư
                </p>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-3">
              <Label
                htmlFor="notes"
                className="text-gray-700 font-semibold flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Ghi Chú Thêm
              </Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Các yêu cầu đặc biệt, triệu chứng hoặc ghi chú cho bác sĩ..."
                    className="border-gray-300 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <span>Đặt Lịch Hẹn</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterAppointment;
