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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { useDoctorSchedulesByDate } from "@/hooks/useDoctor";
import {
  filterSlotsByService,
  getDateTo,
  slots,
  type Slot,
} from "@/lib/utils/slotsAppointment";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  useAppointmentsByStaff,
  useCreateAppointment,
} from "@/hooks/useAppointments";
import type {
  AppointmentFormValues,
  AppointmentType,
} from "@/types/appointment";
import { useNavigate } from "react-router";
import {
  BadgeCheck,
  Stethoscope,
  FlaskConical,
  User,
  EyeOff,
  Eye,
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Phone,
  Mail,
  CalendarCheck,
  MessageSquare,
  Activity,
  CreditCard,
  Calendar,
  Shield,
  FileText,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { getAvatarUrl } from "@/lib/utils/uploadImage/uploadImage";
import type { DoctorScheduleByDate } from "@/types/doctor";

const appointmentSchema = z
  .object({
    userId: z.number(),
    doctorId: z.number().optional(),
    serviceId: z
      .number({ required_error: "Vui lòng chọn dịch vụ" })
      .min(1, "Vui lòng chọn dịch vụ"),
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
  const [step, setStep] = useState(1);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [doctorSlots, setDoctorSlots] = useState<Slot[]>([]);
  const [dialogLoading, setDialogLoading] = useState(false);

  const services = useServices({ page: 1, limit: 100 });
  const { data: doctors } = useDoctorSchedulesByDate(
    selectedDate || new Date().toISOString().split("T")[0]
  );
  const { mutate: createAppointment } = useCreateAppointment();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
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
  const dateFrom = watch("appointmentDate");
  const dateTo = dateFrom ? getDateTo(dateFrom) : undefined;
  const staffAppointments = useAppointmentsByStaff({
    dateFrom,
    dateTo,
  });

  const selectedSlot = watch("appointmentTime"); // "HH:mm-HH:mm"
  const availableDoctors = doctors?.filter((doctor) => {
    // Lấy tất cả appointment của doctor này trong ngày
    const doctorAppointments = staffAppointments.data?.data.filter(
      (appt) => appt.doctorId === doctor.id
    );
    // Nếu slot đã chọn đã có appointment với doctor này, loại bỏ
    if (
      doctorAppointments?.some((appt) => {
        // So sánh slot, có thể so sánh appt.appointmentTime.slice(11, 16) === slot.start
        const apptSlot = `${appt.appointmentTime.slice(11, 16)}-${new Date(
          new Date(appt.appointmentTime).getTime() + 30 * 60000 // giả sử slot 30 phút
        )
          .toISOString()
          .slice(11, 16)}`;
        return apptSlot === selectedSlot;
      })
    ) {
      return false;
    }
    // Có thể thêm điều kiện khác nếu muốn
    return true;
  });

  useEffect(() => {
    if (selectedService) {
      if (selectedService.type === "CONSULT") {
        setValue("type", "ONLINE");
      } else {
        setValue("isAnonymous", false);
        setValue("type", "OFFLINE");
      }
      // Reset các trường liên quan khi đổi service
      setSelectedDate("");
      setValue("appointmentDate", "");
      setSelectedDoctorId(null);
      setValue("doctorId", 0);
      setDoctorSlots([]);
      setValue("appointmentTime", "");
    }
  }, [selectedService, setValue]);

  useEffect(() => {
    if (selectedDoctorId && selectedService && selectedDate) {
      // Lấy slot trống của bác sĩ này
      const doctorAppointments = staffAppointments.data?.data.filter(
        (appt) => appt.doctorId === selectedDoctorId
      );
      let filteredSlots = filterSlotsByService(
        slots,
        selectedService.startTime,
        selectedService.endTime
      );
      // Loại bỏ slot đã có appointment
      filteredSlots = filteredSlots.filter((slot) => {
        const slotStr = `${slot.start}-${slot.end}`;
        return !doctorAppointments?.some((appt) => {
          const apptSlot = `${appt.appointmentTime.slice(11, 16)}-${new Date(
            new Date(appt.appointmentTime).getTime() + 30 * 60000
          )
            .toISOString()
            .slice(11, 16)}`;
          return apptSlot === slotStr;
        });
      });
      setDoctorSlots(filteredSlots);
    } else {
      setDoctorSlots([]);
    }
  }, [selectedDoctorId, selectedService, selectedDate, staffAppointments.data]);

  // Validate từng bước trước khi chuyển step
  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["serviceId"]);
      if (!valid) return toast.error("Vui lòng chọn dịch vụ!");
      setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["appointmentDate", "appointmentTime"]);
      if (!valid) return toast.error("Vui lòng chọn ngày và khung giờ!");
      setStep(3);
    }
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = (data: z.infer<typeof appointmentSchema>) => {
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

    // Chuẩn bị dữ liệu submit đúng type
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
      onSettled: () => {
        setDialogLoading(false);
      },
    });
  };

  const DoctorCardMini = ({
    doctor,
    isSelected,
    isAvailable,
    onClick,
  }: {
    doctor: DoctorScheduleByDate;
    isSelected: boolean;
    isAvailable: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-xl border-2 p-4 flex items-center gap-4 shadow-sm transition-all duration-200
      ${
        isSelected
          ? "border-purple-600 ring-2 ring-purple-200"
          : "border-gray-200 hover:border-purple-400"
      }
      ${!isAvailable ? "opacity-60 pointer-events-none" : ""}
    `}
    >
      <div className="relative">
        <img
          src={
            getAvatarUrl(doctor.user.avatar || "") ||
            "/images/default-avatar.png"
          }
          alt={doctor.user.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-purple-400"
        />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-base text-gray-900">
          {doctor.user.name}
        </div>
        <div className="text-xs text-gray-500">
          {doctor.specialization || "Bác sĩ đa khoa"}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isAvailable ? "bg-emerald-500" : "bg-rose-500"
            }`}
          ></span>
          <span className="text-xs">{isAvailable ? "Có sẵn" : "Bận"}</span>
        </div>
      </div>
      {isSelected && <CheckCircle className="w-5 h-5 text-purple-600" />}
    </div>
  );

  // --- Render từng bước ---
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Patient Information - chỉ hiển thị */}
      <div className="space-y-3">
        <Label className="text-gray-700 font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-purple-600" />
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
      {/* Service Selection + Info */}
      <div>
        <Label className="text-lg font-semibold flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-purple-600" />
          Chọn dịch vụ <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value ? String(field.value) : ""}
            >
              <SelectTrigger className="mt-2 w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                <SelectValue placeholder="Chọn dịch vụ bạn cần" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-72 overflow-y-auto">
                {services?.data?.data?.map((service) => (
                  <SelectItem
                    key={service.id}
                    value={service.id.toString()}
                    className="flex items-center gap-2"
                  >
                    {service.type === "CONSULT" ? (
                      <User className="w-4 h-4 text-blue-600" />
                    ) : service.type === "TEST" ? (
                      <FlaskConical className="w-4 h-4 text-green-600" />
                    ) : (
                      <Stethoscope className="w-4 h-4 text-purple-600" />
                    )}
                    {service.name}
                    {service.isActive ? (
                      <Badge
                        variant="outline"
                        className="ml-2 text-green-600 border-green-200"
                      >
                        Đang hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="ml-2">
                        Tạm dừng
                      </Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.serviceId && !watch("serviceId") ? (
          <p className="text-red-500 text-sm mt-1">
            {errors.serviceId.message}
          </p>
        ) : null}
      </div>
      {/* Hiển thị thông tin service đã chọn */}
      {selectedService && (
        <Card className="mt-4 border-2 border-purple-100 shadow-md">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {selectedService.type === "CONSULT" ? (
                  <User className="w-5 h-5 text-blue-600" />
                ) : selectedService.type === "TEST" ? (
                  <FlaskConical className="w-5 h-5 text-green-600" />
                ) : (
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                )}
                <span className="text-lg font-bold">
                  {selectedService.name}
                </span>
                <BadgeCheck className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {selectedService.type === "CONSULT"
                    ? "Tư vấn"
                    : selectedService.type === "TEST"
                    ? "Xét nghiệm"
                    : "Điều trị"}
                </Badge>
                <Badge variant="outline">
                  Giá:{" "}
                  <span className="font-semibold ml-1">
                    {Number(selectedService.price).toLocaleString()}₫
                  </span>
                </Badge>
                <Badge variant="outline">
                  Thời gian: {selectedService.startTime} -{" "}
                  {selectedService.endTime}
                </Badge>
              </div>
              <div className="text-gray-700 text-sm mt-2">
                {selectedService.description}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Nếu là CONSULT thì cho chọn ẩn danh */}
      {selectedService?.type === "CONSULT" && (
        <div className="flex items-center gap-3 mt-4">
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
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            {watch("isAnonymous") ? (
              <EyeOff className="w-4 h-4 text-purple-600" />
            ) : (
              <Eye className="w-4 h-4 text-purple-600" />
            )}
            Đăng ký ẩn danh (Bác sĩ sẽ không biết thông tin cá nhân của bạn)
          </Label>
        </div>
      )}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={nextStep}
          variant="outline"
          className="cursor-pointer"
        >
          Tiếp tục <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Chọn ngày */}
      <div className="space-y-2 w-sm">
        <Label>
          Chọn ngày <span className="text-red-500">*</span>
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
                setSelectedDate(e.target.value);
                setSelectedDoctorId(null);
                setValue("doctorId", 0);
              }}
            />
          )}
        />
        {errors.appointmentDate && !watch("appointmentDate") ? (
          <p className="text-red-500 text-sm mt-1">
            {errors.appointmentDate.message}
          </p>
        ) : null}
      </div>
      {/* Carousel chọn bác sĩ */}
      {selectedService?.type !== "CONSULT" && (
        <>
          <Label>Chọn bác sĩ</Label>
          <div className="flex gap-4 overflow-x-auto py-2">
            {availableDoctors?.length === 0 && (
              <div className="p-4 text-gray-500">
                Không có bác sĩ nào trống ngày này
              </div>
            )}
            {availableDoctors?.map((doctor) => (
              <DoctorCardMini
                key={doctor.id}
                doctor={doctor}
                isAvailable={true}
                isSelected={selectedDoctorId === doctor.id}
                onClick={() => {
                  setSelectedDoctorId(doctor.id);
                  setValue("doctorId", doctor.id);
                }}
              />
            ))}
          </div>
          {errors.doctorId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.doctorId.message}
            </p>
          )}
        </>
      )}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={prevStep}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
        </Button>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={async () => {
            if (selectedService?.type === "CONSULT") {
              const valid = await trigger(["appointmentDate"]);
              if (!valid) return toast.error("Vui lòng chọn ngày!");
              setStep(3);
            } else {
              const valid = await trigger(["appointmentDate", "doctorId"]);
              if (!valid) return toast.error("Vui lòng chọn ngày và bác sĩ!");
              setStep(3);
            }
          }}
          disabled={selectedService?.type !== "CONSULT" && !selectedDoctorId}
        >
          Tiếp tục <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Doctor Selection */}
      <div className="space-y-2 w-sm">
        <Label>
          Chọn khung giờ <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="appointmentTime"
          control={control}
          render={({ field }) => {
          // Nếu là CONSULT, slot lấy theo service, không cần bác sĩ
          if (selectedService?.type === "CONSULT") {
            const consultSlots = filterSlotsByService(
              slots,
              selectedService.startTime,
              selectedService.endTime
            );
            return (
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={!selectedDate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khung giờ" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {consultSlots.length === 0 ? (
                    <div className="p-2 text-center text-gray-500">
                      Không có khung giờ trống
                    </div>
                  ) : (
                    consultSlots.map((slot, idx) => (
                      <SelectItem key={idx} value={`${slot.start}-${slot.end}`}>
                        {slot.start} - {slot.end}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            );
          }
          // Nếu không phải CONSULT, slot lấy theo bác sĩ đã chọn
          return (
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              disabled={!selectedDoctorId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khung giờ" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {doctorSlots.length === 0 ? (
                  <div className="p-2 text-center text-gray-500">
                    Không có khung giờ trống
                  </div>
                ) : (
                  doctorSlots.map((slot, idx) => (
                    <SelectItem key={idx} value={`${slot.start}-${slot.end}`}>
                      {slot.start} - {slot.end}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          );
        }}
        />
        {errors.appointmentTime && (
          <p className="text-red-500 text-sm mt-1">
            {errors.appointmentTime.message}
          </p>
        )}
      </div>
      {/* Notes */}
      <div className="space-y-3">
        <Label
          htmlFor="notes"
          className="text-gray-700 font-semibold flex items-center"
        >
          <Stethoscope className="w-5 h-5 text-purple-600" />
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
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={prevStep}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
        </Button>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={async () => {
            const valid = await trigger(["appointmentTime"]);
            if (!valid) return toast.error("Vui lòng chọn khung giờ!");
            setIsConfirmDialogOpen(true);
          }}
          disabled={!watch("appointmentTime")}
        >
          Đặt lịch
        </Button>
      </div>

      {/* Dialog xác nhận */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="md:max-w-6xl md:w-[70vw] lg:w-[55vw] bg-white border-0 shadow-2xl rounded-2xl overflow-hidden p-0">
          <DialogHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="bg-white/20 p-2 rounded-lg">
                <CalendarCheck className="w-6 h-6" />
              </div>
              Xác nhận thông tin đặt lịch hẹn
            </DialogTitle>
            <p className="text-purple-100 opacity-90 mt-2">
              Vui lòng kiểm tra lại thông tin trước khi xác nhận
            </p>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Thông tin bệnh nhân */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                Thông tin bệnh nhân
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-semibold text-gray-800">
                      {userProfile?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-semibold text-gray-800">
                      {userProfile?.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">
                      {userProfile?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin dịch vụ */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                <Stethoscope className="w-5 h-5 text-purple-600" />
                Thông tin dịch vụ
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    {selectedService?.type === "CONSULT" ? (
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    ) : selectedService?.type === "TEST" ? (
                      <FlaskConical className="w-4 h-4 text-green-600" />
                    ) : (
                      <Activity className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Dịch vụ đã chọn</p>
                    <p className="font-semibold text-gray-800">
                      {selectedService?.name}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 border-purple-200"
                  >
                    {selectedService?.type === "CONSULT"
                      ? "Tư vấn"
                      : selectedService?.type === "TEST"
                      ? "Xét nghiệm"
                      : "Điều trị"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chi phí dự kiến</p>
                    <p className="font-bold text-emerald-600 text-lg">
                      {formatCurrency(selectedService?.price || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin lịch hẹn */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                Thời gian hẹn
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <CalendarDays className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày khám</p>
                    <p className="font-semibold text-gray-800">
                      {watch("appointmentDate")
                        ? formatDate(
                            watch("appointmentDate"),
                            "EEEE, dd/MM/yyyy"
                          )
                        : "Chưa chọn ngày"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Khung giờ</p>
                    <p className="font-semibold text-gray-800">
                      {watch("appointmentTime")
                        ? watch("appointmentTime").replace("-", " - ")
                        : "Chưa chọn khung giờ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin bác sĩ (nếu không phải CONSULT) */}
            {selectedService?.type !== "CONSULT" && (
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                  <UserCheck className="w-5 h-5 text-teal-600" />
                  Bác sĩ phụ trách
                </h3>
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Bác sĩ được chỉ định
                    </p>
                    <p className="font-semibold text-gray-800">
                      BS.{" "}
                      {doctors?.find((d) => d.id === watch("doctorId"))?.user
                        ?.name || "Chưa chọn"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin ẩn danh (nếu là CONSULT) */}
            {selectedService?.type === "CONSULT" && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    {watch("isAnonymous") ? (
                      <EyeOff className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chế độ tư vấn</p>
                    <p className="font-semibold text-gray-800">
                      {watch("isAnonymous") ? "Ẩn danh" : "Công khai thông tin"}
                    </p>
                  </div>
                  {watch("isAnonymous") && (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-700 border-gray-300"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Bảo mật
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Ghi chú (nếu có) */}
            {watch("notes") && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                  <FileText className="w-5 h-5 text-yellow-600" />
                  Ghi chú thêm
                </h3>
                <div className="bg-white p-3 rounded-lg border border-yellow-200">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {watch("notes")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="bg-gray-50 px-6 py-4 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 cursor-pointer"
              disabled={dialogLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại chỉnh sửa
            </Button>
            <Button
              type="button"
              onClick={() => {
                setDialogLoading(true);
                handleSubmit(onSubmit)();
              }}
              disabled={dialogLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 px-6 cursor-pointer"
            >
              {dialogLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Xác nhận đặt lịch
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // --- UI chính ---
  return (
    <div className="min-h-full flex items-center justify-center p-4 mb-6">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Stethoscope className="h-8 w-8" />
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
          {/* Stepper */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${
                    step === s ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className="w-8 h-1 bg-gray-300 mx-2 rounded" />}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterAppointment;
