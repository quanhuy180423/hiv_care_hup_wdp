import { useMeetingRecordDialogStore } from "@/store/meetingRecordStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMeetingRecordByAppointment } from "@/hooks/useMeetingRecord";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, FileText, TestTube, User } from "lucide-react";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { useState } from "react";
import type { MeetingRecord } from "@/types/meetingRecord";
import MeetingRecordFormModal from "./MeetingRecordFormModal";
import "../../../../styles/editor-renderer.css";

export default function MeetingRecordDialog() {
  const { isOpen, appointment, close, hide } = useMeetingRecordDialogStore();
  const appointmentId = appointment?.id;
  const { data: meetingRecord, isLoading, refetch } =
    useMeetingRecordByAppointment(appointmentId);
  const [openForm, setOpenForm] = useState(false);
  const [initialData, setInitialData] = useState<MeetingRecord | null>(null);

  const handleSuccess = () => {
    refetch();
    close();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Biên bản cuộc họp
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="bg-gray-200 h-8 w-3/4" />
              <Skeleton className="bg-gray-200 h-4 w-full" />
              <Skeleton className="bg-gray-200 h-4 w-5/6" />
              <Skeleton className="bg-gray-200 h-4 w-4/5" />
              <div className="flex gap-4 pt-4 justify-end">
                <Skeleton className="bg-gray-200 h-10 w-24" />
              </div>
            </div>
          ) : meetingRecord ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Tên bệnh nhân:</span>
                  <span>{meetingRecord.appointment.user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Người ghi biên bản:</span>
                  <span>{meetingRecord.recordedBy.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Bác sĩ phụ trách:</span>
                  <span>{meetingRecord.appointment.doctor.user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TestTube className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Chức danh:</span>
                  <span>{meetingRecord.appointment.doctor.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Thời gian bắt đầu:</span>
                  <span>
                    {formatDate(meetingRecord.startTime, "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Thời gian kết thúc:</span>
                  <span>
                    {formatDate(meetingRecord.endTime, "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-medium">Nội dung:</h2>
                <h4 className="text-lg font-medium">{meetingRecord.title}</h4>
                <div 
                  className="prose max-w-none meeting-record-content"
                  dangerouslySetInnerHTML={{ __html: meetingRecord.content }}
                />
              </div>

              <div className="flex gap-4 pt-4 justify-end">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setInitialData(meetingRecord);
                    setOpenForm(true);
                    hide();
                  }}
                >
                  Chỉnh sửa biên bản
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="p-6 bg-gray-50 rounded-lg">
                <FileText className="w-10 h-10 mx-auto text-gray-400" />
                <h4 className="mt-2 font-medium text-gray-900">
                  Chưa có biên bản nào
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Cuộc họp này chưa có biên bản được ghi lại.
                </p>
              </div>
              <Button
                className="w-full cursor-pointer"
                variant="outline"
                onClick={() => {
                  setInitialData(null);
                  setOpenForm(true);
                  hide();
                }}
              >
                Tạo biên bản mới
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <MeetingRecordFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setInitialData(null);
        }}
        appointmentId={appointmentId!}
        recordedById={appointment?.doctor?.id || 0}
        initialData={initialData}
        onSuccess={handleSuccess}
      />
    </>
  );
}