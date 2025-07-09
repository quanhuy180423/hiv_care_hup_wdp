"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useAppointmentDrawerStore,
  useAppointmentModalStore,
} from "@/store/appointmentStore";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  CalendarClock,
  Stethoscope,
  ClipboardList,
  Clock,
  Pencil,
  AlertCircle,
  FileCog,
  Mail,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AppointmentDetailsDialog = ({ open, onClose }: Props) => {
  const { viewingAppointment } = useAppointmentDrawerStore();
  const { openModal } = useAppointmentModalStore();

  if (!viewingAppointment) return null;

  const {
    user,
    doctor,
    service,
    appointmentTime,
    type,
    status,
    notes,
    isAnonymous,
    id,
    doctorMeetingUrl,
  } = viewingAppointment;

  const getStatusStyle = () => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "PAID":
        return "bg-emerald-100 text-emerald-700";
      case "CHECKIN":
        return "bg-orange-100 text-orange-700";
      case "PROCESS":
        return "bg-yellow-100 text-yellow-700";
      case "PENDING":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeVariant = () => (type === "ONLINE" ? "secondary" : "default");

  const handleJoinMeeting = (url: string | null) => {
    if (url) {
      window.open(url, "_blank"); // Mở URL trong tab mới
    } else {
      toast.error("No meeting URL available");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] bg-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            <span>Chi tiết cuộc hẹn</span>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <span>Mã lịch hẹn:</span>
            <Badge variant="outline" className="font-medium">
              #{id}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="grid gap-4">
          <Card>
            <CardContent className="space-y-4 pt-4">
              {/* Bệnh nhân */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Bệnh nhân
                  </h4>
                  <p className="font-medium">
                    {isAnonymous ? "Ẩn danh" : user.name}
                  </p>
                  {!isAnonymous && (
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mt-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bác sĩ */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Bác sĩ
                  </h4>
                  <p className="font-medium">{doctor.user.name}</p>
                </div>
              </div>

              {/* Thời gian */}
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <CalendarClock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Thời gian khám
                  </h4>
                  <p className="font-medium">
                    {formatUtcDateManually(appointmentTime, "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Các thông tin chi tiết */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="col-span-2">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileCog className="w-4 h-4" />
                  <span>Dịch vụ</span>
                </div>
                <p className="font-medium">{service.name}</p>
                {service.description && (
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Thời gian phục vụ: {service.startTime} - {service.endTime}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Hình thức</span>
                  </div>
                  <Badge variant={getTypeVariant()} className="mt-1">
                    {type === "ONLINE" ? "Online" : "Offline"}
                  </Badge>
                  {type === "ONLINE" && (
                    <Button
                      onClick={() => handleJoinMeeting(doctorMeetingUrl)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Join Meeting
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>Trạng thái</span>
                  </div>
                  <span
                    className={`mt-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle()}`}
                  >
                    {status}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ghi chú */}
          {notes && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ClipboardList className="w-4 h-4" />
                  <span>Ghi chú</span>
                </div>
                <p className="text-sm">{notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Đóng
          </Button>
          <Button
            onClick={() => {
              openModal(viewingAppointment);
              onClose();
            }}
            variant="outline"
            className="gap-2 cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;
