import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils/uploadImage/uploadImage";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { User2, Calendar, Clock, Stethoscope, UserCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { MeetingRecord } from "@/types/meetingRecord";
import "../../../../styles/editor-renderer.css";

interface MeetingRecordDetailDialogProps {
  open: boolean;
  onClose: () => void;
  record: MeetingRecord | null;
}

export function MeetingRecordDetailDialog({ open, onClose, record }: MeetingRecordDetailDialogProps) {
  if (!record) return null;
  const doctor = record.appointment?.doctor?.user;
  const patient = record.appointment?.user;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-6xl sm:!w-[50vw] md:!w-[80vw] xl:!w-[95vw] bg-white max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User2 className="w-6 h-6 text-blue-600" />
            </div>
            Chi tiết biên bản tư vấn
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Thông tin bác sĩ và bệnh nhân */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bác sĩ */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                    <AvatarImage src={getAvatarUrl(doctor?.avatar || "")} />
                    <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                      {doctor?.name?.[0] || "B"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Stethoscope className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-blue-500 text-white text-xs px-2 py-1">
                      Bác sĩ tư vấn
                    </Badge>
                  </div>
                  <div className="font-semibold text-gray-900 text-lg mb-1">{doctor?.name}</div>
                  <div className="text-sm text-blue-700 font-medium">{record.appointment?.doctor?.specialization}</div>
                </div>
              </div>
            </div>

            {/* Bệnh nhân */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                    <AvatarImage src={getAvatarUrl(patient?.avatar || "")} />
                    <AvatarFallback className="bg-green-500 text-white text-lg font-semibold">
                      {patient?.name?.[0] || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <UserCheck className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-green-500 text-white text-xs px-2 py-1">
                      Người được tư vấn
                    </Badge>
                  </div>
                  <div className="font-semibold text-gray-900 text-lg mb-1">{patient?.name}</div>
                  <div className="text-sm text-green-700 font-medium">{patient?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin thời gian */}
          <div className="bg-gray-50 rounded-xl p-5 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Thời gian bắt đầu</div>
                  <div className="font-semibold text-gray-900">{formatDate(record.startTime, "dd/MM/yyyy HH:mm")}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Thời gian kết thúc</div>
                  <div className="font-semibold text-gray-900">{formatDate(record.endTime, "dd/MM/yyyy HH:mm")}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Nội dung biên bản */}
          <div className="bg-white border rounded-xl p-6">
            <div className="mb-4">
              <h3 className="font-bold text-2xl text-gray-900 mb-2">{record.title}</h3>
              <div className="w-12 h-1 bg-primary rounded-full"></div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div
                className="blog-content text-gray-700 leading-relaxed medical-form"
                dangerouslySetInnerHTML={{ __html: record.content }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}