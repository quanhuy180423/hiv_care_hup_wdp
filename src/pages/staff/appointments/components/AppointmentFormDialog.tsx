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
import { slots } from "@/lib/utils/slotsAppointment";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  Eye,
  EyeOff,
  Video,
  Building2,
  Save,
  X,
  Activity,
  CreditCard,
  Hash,
  Phone,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AppointmentFormDialog = ({ open, onClose }: Props) => {
  const { editingAppointment } = useAppointmentModalStore();
  const { register, handleSubmit, setValue, reset, watch } =
    useForm<AppointmentFormValues>();
  const { mutate, isPending } = useUpdateAppointment();

  const { data: services } = useServices({ page: 1, limit: 100 });
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

    const appointmentTime = `${selectedDate}T${selectedSlot}:00Z`;

    mutate(
      { id: editingAppointment.id, data: { ...data, appointmentTime } },
      {
        onSuccess: () => {
          toast.success("Cập nhật lịch khám thành công");
          onClose();
        },
      }
    );
  };

  if (!editingAppointment) return null;

  const isOnline = watch("type") === "ONLINE";
  const selectedService = services?.data.find(
    (s) => s.id === watch("serviceId")
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="lg:!w-[80vw] xl:!w-[60vw] !max-w-[90vw] !max-h-[90vh] overflow-y-auto bg-white p-0">
        {/* Header with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10" />
          <DialogHeader className="relative p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Cập nhật lịch hẹn
                  </DialogTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {editingAppointment.id}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`
                        ${
                          editingAppointment.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : ""
                        }
                        ${
                          editingAppointment.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-700"
                            : ""
                        }
                        ${
                          editingAppointment.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : ""
                        }
                      `}
                    >
                      {editingAppointment.status === "PENDING" &&
                        "Chờ xác nhận"}
                      {editingAppointment.status === "COMPLETED" &&
                        "Đã xác nhận"}
                      {editingAppointment.status === "CANCELLED" && "Đã hủy"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Patient and Doctor Section */}
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="px-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                Thông tin bệnh nhân & bác sĩ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Info */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      Bệnh nhân
                    </Label>
                    <div className="relative">
                      <Input
                        value={editingAppointment.user.name}
                        disabled
                        className="pl-10 bg-slate-50 border-slate-200"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span>{editingAppointment.user.email}</span>
                    </div>
                    {editingAppointment.user.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-violet-500" />
                        <span>{editingAppointment.user.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Doctor Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-purple-500" />
                    Bác sĩ phụ trách
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("doctorId", Number(value))
                    }
                    defaultValue={editingAppointment.doctorId?.toString()}
                  >
                    <SelectTrigger className="w-full border-slate-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-purple-400" />
                        <SelectValue placeholder="Chọn bác sĩ" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {doctors?.map((doctor) => (
                        <SelectItem
                          key={doctor.id}
                          value={doctor.id.toString()}
                        >
                          <div className="flex items-center justify-between w-full gap-3">
                            <span className="font-medium">
                              {doctor.user?.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 text-purple-700 text-xs"
                            >
                              {doctor.specialization}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Section */}
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="px-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                Dịch vụ khám
              </h3>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">
                    Chọn dịch vụ
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedService = services?.data.find(
                        (s) => s.id === Number(value)
                      );
                      setValue("serviceId", Number(value));
                      if (selectedService) {
                        const autoType =
                          selectedService.type === "CONSULT"
                            ? "ONLINE"
                            : "OFFLINE";
                        setValue("type", autoType);
                      }
                    }}
                    defaultValue={editingAppointment.serviceId.toString()}
                  >
                    <SelectTrigger className="w-full !py-6 border-slate-200 hover:border-emerald-300 transition-colors">
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {services?.data.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          <div className="flex items-center justify-between w-full gap-3">
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-xs text-slate-500">
                                {service.description}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200"
                            >
                              <CreditCard className="w-3 h-3 mr-1" />
                              {service.price} VND
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedService && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50">
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-emerald-900">
                          {selectedService.name}
                        </p>
                        <p className="text-sm text-emerald-700 mt-1">
                          {selectedService.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-emerald-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {selectedService.startTime} -{" "}
                            {selectedService.endTime}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700"
                          >
                            {selectedService.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Section */}
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="px-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <div className="p-2 bg-violet-50 rounded-lg">
                  <Clock className="h-5 w-5 text-violet-600" />
                </div>
                Thời gian khám
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-violet-500" />
                    Ngày khám
                  </Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border-slate-200 hover:border-violet-300 focus:border-violet-400 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-500" />
                    Khung giờ
                  </Label>
                  <Select
                    onValueChange={(value) => setSelectedSlot(value)}
                    defaultValue={selectedSlot}
                  >
                    <SelectTrigger className="w-full border-slate-200 hover:border-violet-300 transition-colors">
                      <SelectValue placeholder="Chọn khung giờ" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {slots.map((slot) => (
                        <SelectItem key={slot.start} value={slot.start}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-violet-400" />
                            <span className="font-medium">
                              {slot.start} - {slot.end}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedDate && selectedSlot && (
                <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-medium text-violet-900">
                        Thời gian đã chọn
                      </p>
                      <p className="text-sm text-violet-700 mt-1">
                        {new Date(selectedDate).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        lúc {selectedSlot}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Options Section */}
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="px-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                Tùy chọn & Ghi chú
              </h3>

              <div className="space-y-6">
                {/* Type and Anonymous */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700">
                      Hình thức khám
                    </Label>
                    <div
                      className={`
                      p-4 rounded-xl border-2 transition-all duration-200
                      ${
                        isOnline
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                          : "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
                      }
                    `}
                    >
                      <div className="flex items-center gap-3">
                        {isOnline ? (
                          <>
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Video className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-blue-900">
                                Khám trực tuyến
                              </p>
                              <p className="text-sm text-blue-700 mt-1">
                                Qua video call
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <Building2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-emerald-900">
                                Khám tại phòng khám
                              </p>
                              <p className="text-sm text-emerald-700 mt-1">
                                Trực tiếp tại cơ sở
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Anonymous */}
                  {isOnline && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700">
                        Chế độ riêng tư
                      </Label>
                      <div
                        className={`
                      p-4 rounded-xl border-2 transition-all duration-200
                      ${
                        watch("isAnonymous")
                          ? "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-300"
                          : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                      }
                    `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {watch("isAnonymous") ? (
                              <>
                                <div className="p-2 bg-slate-100 rounded-lg">
                                  <EyeOff className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">
                                    Ẩn danh
                                  </p>
                                  <p className="text-sm text-slate-600 mt-1">
                                    Thông tin được bảo mật
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Eye className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-green-900">
                                    Công khai
                                  </p>
                                  <p className="text-sm text-green-700 mt-1">
                                    Hiển thị thông tin
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                          <Switch
                            checked={watch("isAnonymous")}
                            onCheckedChange={(value) =>
                              setValue("isAnonymous", value)
                            }
                            className="data-[state=checked]:bg-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Notes */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    Ghi chú cho bác sĩ
                  </Label>
                  <div className="relative">
                    <Textarea
                      placeholder="Mô tả triệu chứng, thuốc đang dùng, tiền sử bệnh hoặc thông tin khác mà bạn muốn bác sĩ biết..."
                      {...register("notes")}
                      className="min-h-[120px] border-slate-200 hover:border-amber-300 focus:border-amber-400 transition-colors resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                      {watch("notes")?.length || 0}/500 ký tự
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Thông tin này sẽ giúp bác sĩ chuẩn bị tốt hơn cho buổi khám
                    của bạn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 cursor-pointer"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
