import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency"; // Assuming this utility is correct
import type {
  ActivePatientTreatment,
  TestResult,
} from "@/types/patientTreatment";
import { Separator } from "@/components/ui/separator"; // Import Separator
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion
import type { CustomMedicationItem } from "@/schemas/patientTreatment";

interface PatientTreatmentCardProps {
  treatment: ActivePatientTreatment;
  orderLoading: number | null;
  onOpenModal: (treatment: ActivePatientTreatment) => void;
}

const PatientTreatmentCard: React.FC<PatientTreatmentCardProps> = ({
  treatment,
  orderLoading,
  onOpenModal,
}) => {
  const formatDateTime = (iso: string | undefined) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN");
  };

  const getTreatmentStatusVariant = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "default"; // or "success"
      case "COMPLETED":
        return "secondary";
      case "DISCONTINUED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="p-4 bg-gray-50 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-3">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h3 className="font-bold text-xl text-primary flex items-center gap-2">
            Điều trị #{treatment.id}
            {treatment.isCurrent && (
              <Badge variant="default" className="text-xs">
                Hiện tại
              </Badge>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {treatment.treatmentStatus && (
              <Badge
                variant={getTreatmentStatusVariant(treatment.treatmentStatus)}
                className="text-sm font-semibold"
              >
                {treatment.treatmentStatus === "ONGOING" && "Đang diễn ra"}
                {treatment.treatmentStatus === "COMPLETED" && "Đã hoàn thành"}
                {treatment.treatmentStatus === "DISCONTINUED" && "Đã dừng"}
                {!["ONGOING", "COMPLETED", "DISCONTINUED"].includes(
                  treatment.treatmentStatus
                ) && treatment.treatmentStatus}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => onOpenModal(treatment)}
            disabled={orderLoading === treatment.id}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {orderLoading === treatment.id ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>

        <Separator />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
          {treatment.patient?.name && (
            <p>
              <span className="font-semibold">Bệnh nhân:</span>{" "}
              {treatment.patient.name} ({treatment.patient.email}{" "}
              {treatment.patient.phoneNumber &&
                `- ${treatment.patient.phoneNumber}`}
              )
            </p>
          )}
          {treatment.doctor?.user?.name && (
            <p>
              <span className="font-semibold">Bác sĩ:</span>{" "}
              {treatment.doctor.user.name} ({treatment.doctor.specialization})
            </p>
          )}
          {treatment.protocol?.name && (
            <p>
              <span className="font-semibold">Phác đồ:</span>{" "}
              {treatment.protocol.name} (Bệnh:{" "}
              {treatment.protocol.targetDisease})
            </p>
          )}
          <p>
            <span className="font-semibold">Tổng chi phí:</span>{" "}
            <span className="text-lg font-bold text-green-700">
              {formatCurrency(treatment.total)}
            </span>
          </p>
          <p>
            <span className="font-semibold">Ngày bắt đầu:</span>{" "}
            {formatDateTime(treatment.startDate)}
          </p>
          {treatment.endDate && (
            <p>
              <span className="font-semibold">Ngày kết thúc:</span>{" "}
              {formatDateTime(treatment.endDate)}
            </p>
          )}
          {treatment.daysRemaining !== null && treatment.isCurrent && (
            <p>
              <span className="font-semibold">Số ngày còn lại:</span>{" "}
              {treatment.daysRemaining} ngày
            </p>
          )}
        </div>

        {treatment.notes && (
          <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-600">
            <span className="font-semibold">Ghi chú:</span> {treatment.notes}
          </div>
        )}

        <Separator />

        {/* Accordion for detailed sections */}
        <Accordion type="multiple" className="w-full">
          {/* Custom Medications */}
          {treatment.customMedications &&
            treatment.customMedications.length > 0 && (
              <AccordionItem value="custom-medications">
                <AccordionTrigger className="text-base font-semibold text-gray-800">
                  Thuốc chỉ định ({treatment.customMedications.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                    {treatment.customMedications.map(
                      (med: CustomMedicationItem, medIndex: number) => (
                        <Card
                          key={medIndex}
                          className="p-3 bg-white border border-gray-200 flex flex-col gap-1 text-sm"
                        >
                          <p className="font-semibold text-primary">
                            {med.medicineName}
                          </p>
                          <p>
                            Liều dùng:{" "}
                            <span className="font-medium">{med.dosage}</span>
                          </p>
                          {med.unit && (
                            <p>
                              Đơn vị:{" "}
                              <span className="font-medium">{med.unit}</span>
                            </p>
                          )}
                          {med.frequency && (
                            <p>
                              Tần suất:{" "}
                              <span className="font-medium">
                                {med.frequency}
                              </span>
                            </p>
                          )}
                          {med.time && (
                            <p>
                              Thời gian:{" "}
                              <span className="font-medium">{med.time}</span>
                            </p>
                          )}
                          {med.durationValue && med.durationUnit && (
                            <p>
                              Thời gian điều trị:{" "}
                              <span className="font-medium">
                                {med.durationValue} {med.durationUnit}
                              </span>
                            </p>
                          )}
                          {med.notes && (
                            <p>
                              Ghi chú:{" "}
                              <span className="text-gray-600">{med.notes}</span>
                            </p>
                          )}
                          {med.price !== undefined && (
                            <p>
                              Giá:{" "}
                              <span className="font-medium">
                                {formatCurrency(med.price)}
                              </span>
                            </p>
                          )}
                        </Card>
                      )
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

          {/* Test Results */}
          {treatment.testResults && treatment.testResults.length > 0 && (
            <AccordionItem value="test-results">
              <AccordionTrigger className="text-base font-semibold text-gray-800">
                Kết quả xét nghiệm ({treatment.testResults.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                  {treatment.testResults.map(
                    (result: TestResult, resultIndex: number) => (
                      <Card
                        key={resultIndex}
                        className="p-3 bg-white border border-gray-200 flex flex-col gap-1 text-sm"
                      >
                        <p className="font-semibold text-primary">
                          {result.test?.name || "Xét nghiệm không rõ tên"}
                        </p>
                        <p>
                          Kết quả:{" "}
                          <span className="font-medium">
                            {result.rawResultValue} {result.unit}
                          </span>
                        </p>
                        <p>
                          Diễn giải:{" "}
                          <span className="font-medium">
                            {result.interpretation}
                          </span>
                        </p>
                        <p>
                          Ngày:{" "}
                          <span className="font-medium">
                            {formatDateTime(result.resultDate)}
                          </span>
                        </p>
                        {result.notes && (
                          <p>
                            Ghi chú:{" "}
                            <span className="text-gray-600">
                              {result.notes}
                            </span>
                          </p>
                        )}
                        <Badge
                          variant={
                            result.status === "FINAL" ? "success" : "secondary"
                          }
                          className="mt-1 self-start"
                        >
                          Trạng thái: {result.status}
                        </Badge>
                      </Card>
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </Card>
  );
};

export default PatientTreatmentCard;
