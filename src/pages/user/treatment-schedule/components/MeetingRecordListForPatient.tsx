import { useMeetingRecordByPatient } from "@/hooks/useMeetingRecord";
import { useAuthStore } from "@/store/authStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  FileText,
  User2,
  NotebookPen,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getAvatarUrl } from "@/lib/utils/uploadImage/uploadImage";
import { useState, type JSX } from "react";
import { MeetingRecordDetailDialog } from "./MeetingRecordDetailDialog";
import type { MeetingRecord } from "@/types/meetingRecord";
import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = vfs;

function exportMeetingRecordToPDF(record: MeetingRecord) {
  // Chỉ lấy nội dung biên bản (không header)
  const html = `<div class="blog-content">${record.content}</div>`;

  const pdfContent = htmlToPdfmake(html);

  const docDefinition: TDocumentDefinitions = {
    content: pdfContent,
    defaultStyle: { font: "Roboto", fontSize: 12 },
    pageMargins: [20, 20, 20, 20],
  };

  pdfMake.createPdf(docDefinition).download(
    `BienBanTuVan_${record.appointment.user.name || "benhnhan"}_${formatDate(
      record.startTime,
      "yyyyMMdd_HHmm"
    )}.pdf`
  );
}

export function MeetingRecordListForPatient() {
  const user = useAuthStore((s) => s.user);
  const patientId = Number(user?.id);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MeetingRecord | null>(
    null
  );

  // Lấy meeting records của bệnh nhân
  const { data, isLoading, isError } = useMeetingRecordByPatient(patientId, {
    page: 1,
    limit: 100,
  });

  const records = data?.data || [];

  // Calculate meeting duration
  const getMeetingDuration = (
    startTime: string | Date,
    endTime: string | Date
  ): string => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Get status badge based on meeting time
  const getStatusBadge = (endTime: string | Date): JSX.Element => {
    const now = new Date();
    const end = new Date(endTime);
    const isCompleted = end < now;

    return isCompleted ? (
      <Badge
        variant="secondary"
        className="bg-green-50 text-green-700 border-green-200"
      >
        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
        Đã hoàn thành
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="bg-blue-50 text-blue-700 border-blue-200"
      >
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
        Đang diễn ra
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Biên bản tư vấn
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Xem lại các buổi tư vấn đã thực hiện
            </p>
          </div>
        </div>
        {records.length > 0 && (
          <Badge variant="outline" className="text-sm">
            {records.length} biên bản
          </Badge>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              Đang tải dữ liệu...
            </p>
            <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      ) : isError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">
                  Không thể tải biên bản tư vấn
                </h3>
                <p className="text-red-600 text-sm">
                  Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => window.location.reload()}
                >
                  Thử lại
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : records.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <NotebookPen className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có biên bản tư vấn
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Các biên bản tư vấn sẽ được hiển thị tại đây sau khi bạn hoàn
                  thành các buổi tư vấn với bác sĩ.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <Card
              key={record.id}
              className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <NotebookPen className="w-4 h-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {record.title}
                      </CardTitle>
                    </div>

                    {/* Meeting Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {/* Doctor Info */}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                          <AvatarImage
                            src={getAvatarUrl(record.recordedBy.avatar || "")}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {record.recordedBy.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <User2 className="w-3 h-3" />
                            Bác sĩ tư vấn
                          </div>
                          <p className="font-medium text-gray-900 truncate">
                            {record.recordedBy.name}
                          </p>
                        </div>
                      </div>

                      {/* Start Time */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-blue-600 mb-1">
                            Thời gian bắt đầu
                          </div>
                          <p className="font-medium text-gray-900 text-sm">
                            {formatDate(record.startTime, "dd/MM/yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(record.startTime, "HH:mm")}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-green-600 mb-1">
                            Thời lượng
                          </div>
                          <p className="font-medium text-gray-900">
                            {getMeetingDuration(
                              record.startTime,
                              record.endTime
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="ml-4">{getStatusBadge(record.endTime)}</div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Separator className="mb-2" />

                {/* Content Preview */}
                <div className="space-y-4">
                  {/* Patient Info */}
                  {/* <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={getAvatarUrl(record.appointment.user.avatar || "")}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {record.appointment.user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs text-green-600 mb-1">
                        <User2 className="w-3 h-3" />
                        Người được tư vấn
                      </div>
                      <p className="font-medium text-gray-900 truncate">
                        {record.appointment.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {record.appointment.user.email}
                      </p>
                      {record.appointment.user.phoneNumber && (
                        <p className="text-xs text-gray-500 truncate">
                          {record.appointment.user.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div> */}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedRecord(record);
                        setOpenDetail(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 hover:text-primary cursor-pointer"
                      onClick={() => exportMeetingRecordToPDF(record)}
                    >
                      <Download className="w-4 h-4" />
                      Tải xuống
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <MeetingRecordDetailDialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        record={selectedRecord}
      />
    </div>
  );
}
