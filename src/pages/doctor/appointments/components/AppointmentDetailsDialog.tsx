import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Calendar,
  Clock,
  Stethoscope,
  ClipboardList,
  Pencil,
  AlertCircle,
  Mail,
  Phone,
  Video,
  MapPin,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye,
} from "lucide-react";
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

  const getStatusConfig = () => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Hoàn tất",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle,
          dotColor: "bg-green-500"
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          className: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
          dotColor: "bg-red-500"
        };
      case "PAID":
        return {
          label: "Đã thanh toán",
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: DollarSign,
          dotColor: "bg-blue-500"
        };
      case "PENDING":
        return {
          label: "Đang chờ",
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: Clock,
          dotColor: "bg-yellow-500"
        };
      default:
        return {
          label: status,
          className: "bg-gray-50 text-gray-700 border-gray-200",
          icon: AlertCircle,
          dotColor: "bg-gray-500"
        };
    }
  };

  const getTypeConfig = () => {
    if (type === "ONLINE") {
      return {
        label: "Khám trực tuyến",
        className: "bg-purple-50 text-purple-700 border-purple-200",
        icon: Video,
        dotColor: "bg-purple-500"
      };
    }
    return {
      label: "Khám tại phòng",
      className: "bg-gray-50 text-gray-700 border-gray-200",
      icon: MapPin,
      dotColor: "bg-gray-500"
    };
  };

  const handleJoinMeeting = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.error("Không có liên kết cuộc họp");
    }
  };

  const statusConfig = getStatusConfig();
  const typeConfig = getTypeConfig();
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
        <DialogHeader className="space-y-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chi tiết lịch hẹn
              </span>
            </DialogTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mã lịch hẹn:</span>
            <Badge variant="outline" className="font-mono font-semibold">
              #{id}
            </Badge>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}></div>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {/* Patient & Doctor Info */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Patient Card */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="px-3">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Bệnh nhân
                      </h4>
                      <p className="text-lg font-semibold text-gray-900">
                        {isAnonymous ? "Bệnh nhân ẩn danh" : user.name}
                      </p>
                    </div>
                    
                    {!isAnonymous && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{user.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {isAnonymous && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Thông tin được bảo mật
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Card */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="px-3">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Bác sĩ điều trị
                      </h4>
                      <p className="text-lg font-semibold text-gray-900">
                        {doctor.user.name}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Activity className="w-3 h-3" />
                      Bác sĩ phụ trách
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointment Details */}
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="px-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Thông tin lịch hẹn
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày khám</p>
                      <p className="font-semibold text-gray-900">
                        {formatUtcDateManually(appointmentTime, "EEEE, dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Giờ khám</p>
                      <p className="font-semibold text-gray-900">
                        {formatUtcDateManually(appointmentTime, "HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status & Type */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <StatusIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <Badge className={`${statusConfig.className} border font-medium`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <TypeIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Hình thức khám</p>
                      <Badge className={`${typeConfig.className} border font-medium`}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {typeConfig.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Meeting Button */}
              {type === "ONLINE" && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Cuộc họp trực tuyến</p>
                        <p className="text-sm text-gray-600">Sẵn sàng tham gia cuộc họp</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinMeeting(doctorMeetingUrl)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg cursor-pointer"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Tham gia
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="px-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-green-600" />
                Dịch vụ khám
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{service.name}</p>
                  {service.description && (
                    <p className="text-gray-600 mt-1">{service.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Thời gian: {service.startTime} - {service.endTime}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {notes && (
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="px-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Ghi chú
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 hover:bg-gray-50 cursor-pointer"
          >
            Đóng
          </Button>
          <Button
            onClick={() => {
              openModal(viewingAppointment);
              onClose();
            }}
            className="px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg cursor-pointer"
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