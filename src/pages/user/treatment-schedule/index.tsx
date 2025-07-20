'use client';

import { usePatientTreatmentsByPatient } from '@/hooks/usePatientTreatments';
import { useAuthStore } from '@/store/authStore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  // CardFooter,
} from '@/components/ui/card';
import {
  CalendarDays,
  NotebookPen,
  AlertCircle,
  User2,
  Pill,
  StickyNote,
  Thermometer,
  Clock,
  ClipboardList,
  Loader,
  Syringe,
  FlaskConical,
  ClipboardCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/numbers/formatCurrency';
import { formatDate, formatUtcDateManually } from '@/lib/utils/dates/formatDate';

export default function TreatmentSchedule() {
  const user = useAuthStore((s) => s.user);
  const patientId = Number(user?.id);

  const {
    data: treatments,
    isLoading,
    isError,
  } = usePatientTreatmentsByPatient(patientId, {
    includeCompleted: false,
    sortBy: 'startDate',
    sortOrder: 'desc',
  });

  const treatmentList = treatments?.data.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6" />
          Lịch trình điều trị hiện tại
        </h1>
        <Badge variant="outline" className="px-3 py-1">
          {treatmentList.length} điều trị đang diễn ra
        </Badge>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-[80vh]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Không thể tải dữ liệu điều trị. Vui lòng thử lại.</span>
        </div>
      )}

      {!isLoading && treatmentList.length === 0 && (
        <div className="text-center py-10 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground italic">
            Hiện không có điều trị nào đang diễn ra.
          </p>
          <Button variant="outline" className="mt-4">
            Liên hệ bác sĩ
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {!isLoading &&
          treatmentList.map((treatment) => (
            <Card key={treatment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <NotebookPen className="w-5 h-5 text-primary" />
                    <span className="text-lg">{treatment.protocol?.name || 'Phác đồ điều trị'}</span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Đang điều trị
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <ClipboardCheck className="w-3 h-3" />
                      Tổng chi phí: {formatCurrency(treatment.total || 0)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Diagnosis Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Thermometer className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Chuẩn đoán</p>
                        <p className="font-medium">
                          {treatment.protocol?.targetDisease || 'Không xác định'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bác sĩ phụ trách</p>
                        <p className="font-medium">
                          {treatment.doctor?.user?.name || 'Không xác định'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {treatment.doctor?.specialization}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CalendarDays className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                        <p className="font-medium">
                          {formatDate(treatment.startDate, 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CalendarDays className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Thời gian điều trị</p>
                        <p className="font-medium">
                          {treatment.protocol?.medicines?.[0]?.durationValue || '--'} ngày
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <ClipboardCheck className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tạo bởi</p>
                        <p className="font-medium">
                          {treatment.createdBy?.name || 'Hệ thống'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatUtcDateManually(treatment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Medications Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Protocol Medicines */}
                  {treatment.protocol?.medicines && treatment.protocol.medicines.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary" />
                        Thuốc theo phác đồ
                      </h3>
                      <div className="space-y-3">
                        {treatment.protocol.medicines.map((med) => (
                          <div key={med.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium flex items-center gap-2">
                                {med.medicine?.name || 'Thuốc không xác định'}
                                <Badge variant="secondary" className="text-xs h-5">
                                  {med.medicine?.dose || 'Liều không xác định'}
                                </Badge>
                              </p>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <div>
                                  <p className="text-xs text-muted-foreground">Liều dùng</p>
                                  <p className="text-sm">{med.dosage}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Thời gian</p>
                                  <p className="text-sm">
                                    {med.durationValue} {med.durationUnit?.toLowerCase()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Cách dùng</p>
                                  <p className="text-sm">{med.notes || 'Theo chỉ định'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Medications */}
                  {treatment.customMedications && treatment.customMedications.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Syringe className="w-4 h-4 text-primary" />
                        Thuốc tùy chỉnh
                      </h3>
                      <div className="space-y-3">
                        {treatment.customMedications.map((med, index) => (
                          <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium flex items-center gap-2">
                                Thuốc đặc biệt #{index + 1}
                              </p>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <div>
                                  <p className="text-xs text-muted-foreground">Liều dùng</p>
                                  <p className="text-sm">{med.dosage}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Ghi chú</p>
                                  <p className="text-sm">{med.note || 'Theo chỉ định'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tests Section - Placeholder */}
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-primary" />
                    Xét nghiệm cần thực hiện
                  </h3>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm">Không có xét nghiệm nào được yêu cầu</p>
                  </div>
                </div>

                {treatment.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <StickyNote className="w-4 h-4 text-primary" />
                        Ghi chú của bác sĩ
                      </h3>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-line">
                        {treatment.notes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>

              {/* <CardFooter className="flex justify-end pt-0">
                <Button variant="outline" size="sm">
                  Xem chi tiết hồ sơ
                </Button>
              </CardFooter> */}
            </Card>
          ))}
      </div>
    </div>
  );
}