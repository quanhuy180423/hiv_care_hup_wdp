"use client";

import {
  useActivePatientTreatmentsByPatient,
  usePatientTreatmentsByPatient,
} from "@/hooks/usePatientTreatments";
import { useAuthStore } from "@/store/authStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  FlaskConical,
  ClipboardCheck,
  Activity,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import {
  formatDate,
  formatUtcDateManually,
} from "@/lib/utils/dates/formatDate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  ActivePatientTreatment,
  PatientTreatmentType,
} from "@/types/patientTreatment";
import { translateInterpretation } from "@/types/testResult";

function translateTreatmentStatus(status: string) {
  switch (status) {
    case "upcoming":
      return "Sắp diễn ra";
    case "active":
      return "Đang diễn ra";
    case "ending_soon":
      return "Sắp kết thúc";
    default:
      return "Không xác định";
  }
}

export default function TreatmentSchedule() {
  const user = useAuthStore((s) => s.user);
  const patientId = Number(user?.id);

  const {
    data: treatments,
    isLoading,
    isError,
  } = usePatientTreatmentsByPatient(patientId, {
    includeCompleted: false,
    sortBy: "startDate",
    sortOrder: "desc",
  });

  const {
    data: activeTreatmentsData,
    isLoading: isLoadingActive,
    isError: isErrorActive,
  } = useActivePatientTreatmentsByPatient(patientId);

  const treatmentList = treatments?.data.data || [];
  const activeTreatmentList = activeTreatmentsData?.data || [];

  const renderTreatmentCard = (
    treatment: PatientTreatmentType | ActivePatientTreatment
  ) => {
    // Type guard để kiểm tra loại treatment
    const isActiveTreatment = (
      t: PatientTreatmentType | ActivePatientTreatment
    ): t is ActivePatientTreatment => {
      return "treatmentStatus" in t;
    };

    const hasTestResults =
      !isActiveTreatment(treatment) && treatment.testResults?.length > 0;

    return (
      <Card
        key={treatment.id}
        className="hover:shadow-md transition-shadow mb-4"
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center gap-2">
              <NotebookPen className="w-5 h-5 text-primary" />
              <span className="text-lg">
                {treatment.protocol?.name || "Phác đồ điều trị"}
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {isActiveTreatment(treatment) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {translateTreatmentStatus(treatment.treatmentStatus)}
                </Badge>
              )}
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
                    {treatment.protocol?.targetDisease || "Không xác định"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Bác sĩ phụ trách
                  </p>
                  <p className="font-medium">
                    {treatment.doctor?.user?.name || "Không xác định"}
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
                    {formatDate(treatment.startDate, "dd/MM/yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Thời gian điều trị
                  </p>
                  <p className="font-medium">
                    {treatment.protocol?.medicines?.[0]?.durationValue || "--"}{" "}
                    ngày
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
                    {treatment.createdBy?.name || "Hệ thống"}
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
          <div className="grid grid-cols-1 gap-2">
            <h3 className="font-medium flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              Thuốc điều trị
            </h3>
            {/* Protocol Medicines */}
            {treatment.protocol?.medicines &&
              treatment.protocol.medicines.length > 0 && (
                <div className="space-y-3">
                  <div className="space-y-3">
                    {treatment.protocol.medicines.map((med) => (
                      <div
                        key={med.id}
                        className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium flex items-center gap-2">
                            {med.medicine?.name || "Thuốc không xác định"}
                            <Badge variant="secondary" className="text-xs h-5">
                              {med.medicine?.dose || "Liều không xác định"}
                            </Badge>
                          </p>
                          <div className="grid grid-cols-3 gap-2 mt-1">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Liều dùng
                              </p>
                              <p className="text-sm">{med.dosage}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Thời gian
                              </p>
                              <p className="text-sm">
                                {med.durationValue}{" "}
                                {med.durationUnit?.toLowerCase()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Cách dùng
                              </p>
                              <p className="text-sm">
                                {med.notes || "Theo chỉ định"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Custom Medications */}
            {treatment.customMedications &&
              treatment.customMedications.length > 0 && (
                <div className="space-y-3">
                  <div className="space-y-3">
                    {treatment.customMedications.map((med, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium flex items-center gap-2">
                            {med.medicineName || "Thuốc đặc biệt"}
                          </p>
                          <div className="grid grid-cols-3 gap-2 mt-1">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Liều dùng
                              </p>
                              <p className="text-sm">{med.dosage}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Thời gian
                              </p>
                              <p className="text-sm">
                                {med.durationValue}{" "}
                                {med.durationUnit?.toLowerCase()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Cách dùng
                              </p>
                              <p className="text-sm">
                                {med.schedule || "Theo chỉ định"}
                              </p>
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
          {hasTestResults && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Kết quả xét nghiệm
                  </h3>
                </div>
                <div className="space-y-4">
                  {treatment.testResults?.map((result) => (
                    <div
                      key={result.id}
                      className="p-5  rounded-xl border  space-y-4"
                    >
                      {/* Test Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg ">
                          {result.test?.name || "Tên xét nghiệm không xác định"}
                        </h4>
                        {result.test?.description && (
                          <p className=" text-sm">{result.test.description}</p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          <div className="flex justify-between p-2 bg-white/60 rounded-lg">
                            <span className="text-sm font-medium ">
                              Phương pháp:
                            </span>
                            <span className="text-sm ">
                              {result.test?.method || "--"}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/60 rounded-lg">
                            <span className="text-sm font-medium ">Loại:</span>
                            <span className="text-sm ">
                              {result.test?.category || "--"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Results Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex justify-between p-3 bg-white/60 rounded-lg">
                          <span className="text-sm font-medium ">
                            Giá trị xét nghiệm:
                          </span>
                          <span className="text-sm font-semibold ">
                            {result.rawResultValue}{" "}
                            {result.unit || result.test?.unit || ""}
                          </span>
                        </div>
                        <div className="flex justify-between p-3 bg-white/60 rounded-lg">
                          <span className="text-sm font-medium ">
                            Giá trị ngưỡng:
                          </span>
                          <span className="text-sm ">
                            {result.cutOffValueUsed}{" "}
                            {result.unit || result.test?.unit || ""}
                          </span>
                        </div>
                        <div className="flex justify-between p-3 bg-white/60 rounded-lg">
                          <span className="text-sm font-medium ">Kết quả:</span>
                          <span className="text-sm font-semibold ">
                            {translateInterpretation(result.interpretation)}
                          </span>
                        </div>
                        <div className="flex justify-between p-3 bg-white/60 rounded-lg">
                          <span className="text-sm font-medium ">
                            Ngày nhận kết quả:
                          </span>
                          <span className="text-sm ">
                            {formatUtcDateManually(result.resultDate)}
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      {result.notes && (
                        <div className="p-3 bg-white/60 rounded-lg">
                          <span className="text-sm font-medium  block mb-2">
                            Ghi chú:
                          </span>
                          <p className="text-sm  whitespace-pre-line">
                            {result.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

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
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6" />
          Lịch trình điều trị
        </h1>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-white shadow-sm border">
            <TabsTrigger 
              value="active" 
              className="cursor-pointer flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              Phác đồ hiện tại ({activeTreatmentList.length})
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="cursor-pointer flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              Danh sách phác đồ ({treatmentList.length})
            </TabsTrigger>
          </TabsList>

        <TabsContent value="active">
          {isLoadingActive ? (
            <div className="flex justify-center items-center h-[80vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isErrorActive ? (
            <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span>
                Không thể tải dữ liệu điều trị hiện tại. Vui lòng thử lại.
              </span>
            </div>
          ) : activeTreatmentList.length === 0 ? (
            <div className="text-center py-10 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground italic">
                Hiện không có phác đồ điều trị nào đang hoạt động.
              </p>
              <Button variant="outline" className="mt-4">
                Liên hệ bác sĩ
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTreatmentList.map(renderTreatmentCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center items-center h-[80vh]">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span>Không thể tải dữ liệu điều trị. Vui lòng thử lại.</span>
            </div>
          ) : treatmentList.length === 0 ? (
            <div className="text-center py-10 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground italic">
                Hiện không có điều trị nào đang diễn ra.
              </p>
              <Button variant="outline" className="mt-4">
                Liên hệ bác sĩ
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {treatmentList.map(renderTreatmentCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
