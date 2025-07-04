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
import { formatDate } from "@/utils/dates/formatDate";
import { formatCurrency } from "@/utils/numbers/formatCurrency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  CalendarClock,
  Stethoscope,
  ClipboardList,
  Clock,
  DollarSign,
  Pencil,
  AlertCircle,
  FileCog,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  } = viewingAppointment;

  const getStatusVariant = () => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "COMPLETED":
        return "secondary"; // Changed from "success" to "secondary"
      case "CANCELLED":
        return "destructive";
      case "PENDING":
        return "outline"; // Changed from "warning" to "outline"
      default:
        return "outline";
    }
  };

  const getTypeVariant = () => {
    return type === "ONLINE" ? "secondary" : "default";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] bg-white">
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
            <CardContent className=" space-y-4">
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
                </div>
              </div>

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

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <CalendarClock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Thời gian
                  </h4>
                  <p className="font-medium">
                    {formatDate(appointmentTime, "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
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
                  <Badge variant={getStatusVariant()} className="mt-1">
                    {status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileCog className="w-4 h-4" />
                    <span>Dịch vụ</span>
                  </div>
                  <p className="font-medium">{service.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Giá</span>
                  </div>
                  <p className="font-medium">{formatCurrency(service.price)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

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
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Đóng
          </Button>
          <Button
            onClick={() => {
              openModal(viewingAppointment);
              onClose();
            }}
            className="gap-2 cursor-pointer"
            variant="outline"
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
