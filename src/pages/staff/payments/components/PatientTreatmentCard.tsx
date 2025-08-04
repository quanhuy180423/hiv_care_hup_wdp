import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { ActivePatientTreatment } from "@/types/patientTreatment";
import type { PaymentResponse } from "@/services/paymentService";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Stethoscope,
  Clock,
  FileText,
  Pill,
  TestTube,
  CreditCard,
  CheckCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { formatDate } from "@/lib/utils/dates/formatDate";

interface PatientTreatmentCardProps {
  treatment: ActivePatientTreatment;
  orderLoading: number | null;
  onOpenModal: (treatment: ActivePatientTreatment) => void;
  onShowQRModal?: (treatment: ActivePatientTreatment) => void;
  payments?: PaymentResponse[];
}

const PatientTreatmentCard: React.FC<PatientTreatmentCardProps> = ({
  treatment,
  orderLoading,
  onOpenModal,
  onShowQRModal,
  payments = [],
}) => {
  const totalPrice =
    (treatment?.customMedications?.reduce(
      (acc, medication) =>
        acc + (medication?.price || 0) * Number(medication.durationValue),
      0
    ) || 0) +
    (treatment?.testResults?.reduce(
      (acc, result) => acc + Number(result?.test?.price || 0),
      0
    ) || 0);

  // Kiểm tra status của order cho treatment này
  const existingOrder = payments.find(
    (payment) => payment.patientTreatmentId === treatment.id
  );

  const orderStatus = existingOrder?.orderStatus;
  const isPaid = orderStatus === "PAID";
  const isPending = orderStatus === "PENDING";

  // Function để xử lý click button
  const handleButtonClick = () => {
    if (isPending && onShowQRModal) {
      // Nếu order đang PENDING, hiển thị QR modal
      onShowQRModal(treatment);
    } else if (!isPaid) {
      // Nếu chưa có order hoặc order không PAID, mở modal tạo payment
      onOpenModal(treatment);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-l-4 border-l-green-500 hover:shadow-xl transition-shadow duration-200">
      <div className="space-y-5">
        {/* Header Section with Enhanced Visual Hierarchy */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-2xl text-green-800">
                Điều trị #{treatment.id}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Payment Status Badge */}
            {isPaid && (
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 border-green-300"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Đã thanh toán
              </Badge>
            )}
            {isPending && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 border-orange-300"
              >
                <Clock className="w-4 h-4 mr-1" />
                Chờ thanh toán
              </Badge>
            )}

            {/* Total Cost */}
            <div className="text-right space-y-2">
              {/* <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-700">
                  {formatCurrency(totalPrice)}
                </span>
              </div> */}

              {/* Payment Button - Only show if not paid */}
              {!isPaid && (
                <Button
                  onClick={handleButtonClick}
                  disabled={orderLoading === treatment.id}
                  className={`${
                    isPending
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md`}
                >
                  {orderLoading === treatment.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Đang xử lý...
                    </div>
                  ) : isPending ? (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Xem QR thanh toán
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Tạo mã QR thanh toán
                    </div>
                  )}
                </Button>
              )}

              {/* Paid status message */}
              {/* {isPaid && (
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">
                    Thanh toán đã hoàn tất
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Patient & Doctor Information with Icons */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Thông tin liên quan
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {treatment.patient?.name && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">Bệnh nhân</span>
                </div>
                <p className="font-semibold text-blue-900">
                  {treatment.patient.name}
                </p>
                <p className="text-sm text-blue-700">
                  {treatment.patient.email}
                </p>
                {treatment.patient.phoneNumber && (
                  <p className="text-sm text-blue-700">
                    📞 {treatment.patient.phoneNumber}
                  </p>
                )}
              </div>
            )}

            {treatment.doctor?.user?.name && (
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-800">
                    Bác sĩ phụ trách
                  </span>
                </div>
                <p className="font-semibold text-purple-900">
                  {treatment.doctor.user.name}
                </p>
                <p className="text-sm text-purple-700">
                  {treatment.doctor.specialization}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Treatment Protocol Information */}
        {treatment.protocol?.name && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">
                Phác đồ điều trị
              </span>
            </div>
            <p className="font-semibold text-green-900">
              {treatment.protocol.name}
            </p>
            <p className="text-sm text-green-700">
              Bệnh: {treatment.protocol.targetDisease}
            </p>
          </div>
        )}

        {/* Timeline Information */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">
              Thời gian điều trị
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex space-x-4 items-center">
              <p className="text-sm font-medium text-orange-700">
                Ngày bắt đầu:
              </p>
              <p className="font-semibold text-orange-900">
                {formatDate(treatment.startDate)}
              </p>
            </div>
            {treatment.endDate && (
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Ngày kết thúc
                </p>
                <p className="font-semibold text-orange-900">
                  {formatDate(treatment.endDate)}
                </p>
              </div>
            )}
            {treatment.daysRemaining !== null && treatment.isCurrent && (
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Số ngày còn lại
                </p>
                <p className="font-semibold text-orange-900">
                  {treatment.daysRemaining} ngày
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        {treatment.notes && (
          <div className="bg-yellow-50 border-l-4 border-l-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">
                Ghi chú điều trị
              </span>
            </div>
            <p className="text-yellow-700">{treatment.notes}</p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Medications Section with Enhanced Display */}
        {treatment.customMedications &&
          treatment.customMedications.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">
                  Thuốc điều trị ({treatment.customMedications.length})
                </h4>
              </div>

              <div className="space-y-3">
                {treatment.customMedications.map((medication, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="w-4 h-4 text-blue-600" />
                          <h5 className="font-semibold text-blue-900">
                            {medication.medicineName}
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-blue-700">
                              Liều lượng:
                            </span>
                            <p className="text-blue-800">{medication.dosage}</p>
                          </div>
                          {medication.unit && (
                            <div>
                              <span className="font-medium text-blue-700">
                                Đơn vị:
                              </span>
                              <p className="text-blue-800">{medication.unit}</p>
                            </div>
                          )}
                          {medication.frequency && (
                            <div>
                              <span className="font-medium text-blue-700">
                                Tần suất:
                              </span>
                              <p className="text-blue-800">
                                {medication.frequency}
                              </p>
                            </div>
                          )}
                          {medication.time && (
                            <div>
                              <span className="font-medium text-blue-700">
                                Thời gian:
                              </span>
                              <p className="text-blue-800">{medication.time}</p>
                            </div>
                          )}
                          {medication.durationValue &&
                            medication.durationUnit && (
                              <div>
                                <span className="font-medium text-blue-700">
                                  Thời gian điều trị:
                                </span>
                                <p className="text-blue-800">
                                  {medication.durationValue}{" "}
                                  {medication.durationUnit}
                                </p>
                              </div>
                            )}
                        </div>

                        {medication.notes && (
                          <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                            <span className="font-medium text-blue-700">
                              Ghi chú:
                            </span>
                            <p className="text-blue-800 text-sm mt-1">
                              {medication.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {medication.price !== undefined && (
                        <div className="text-right">
                          <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                            <p className="text-sm font-medium text-green-700">
                              Thành tiền
                            </p>
                            <p className="text-lg font-bold text-green-800">
                              {formatCurrency(
                                medication.price *
                                  Number(medication.durationValue)
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Test Results Section with Enhanced Display */}
        {treatment.testResults && treatment.testResults.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <TestTube className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-800">
                Kết quả xét nghiệm ({treatment.testResults.length})
              </h4>
            </div>

            <div className="space-y-3">
              {treatment.testResults.map((testResult, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TestTube className="w-4 h-4 text-purple-600" />
                        <h5 className="font-semibold text-purple-900">
                          {testResult.test?.name || "Xét nghiệm không rõ tên"}
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className=" flex space-x-4">
                          <span className="font-medium text-purple-700">
                            Kết quả:
                          </span>
                          <p className="text-purple-800">
                            {testResult.rawResultValue} {testResult.unit}
                          </p>
                        </div>
                        <div className=" flex space-x-4">
                          <span className="font-medium text-purple-700">
                            Diễn giải:
                          </span>
                          <p className="text-purple-800">
                            {testResult.interpretation}
                          </p>
                        </div>
                        <div className="flex space-x-4">
                          <span className="font-medium text-purple-700">
                            Ngày thực hiện:
                          </span>
                          <p className="text-purple-800">
                            {formatDate(testResult.resultDate, "dd/MM/yyyy")}
                          </p>
                        </div>
                        <div className="flex space-x-4">
                          <span className="font-medium text-purple-700">
                            Trạng thái:
                          </span>
                          <Badge
                            variant={
                              testResult.status === "Completed"
                                ? "default"
                                : "secondary"
                            }
                            className={`text-xs ${
                              testResult.status === "Completed"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-yellow-100 text-yellow-800 border-yellow-300"
                            }`}
                          >
                            {testResult.status === "Completed" ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Hoàn thành
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {testResult.status}
                              </div>
                            )}
                          </Badge>
                        </div>
                      </div>

                      {testResult.notes && (
                        <div className="mt-3 p-2 bg-purple-50 rounded border border-purple-200">
                          <span className="font-medium text-purple-700">
                            Ghi chú:
                          </span>
                          <p className="text-purple-800 text-sm mt-1">
                            {testResult.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {testResult.test?.price && (
                      <div className="text-right">
                        <div className="bg-green-100 flex gap-2 items-center rounded-lg p-3 border border-green-300">
                          <p className="text-sm font-medium text-green-700">
                            Chi phí
                          </p>
                          <p className="text-lg font-bold text-green-800">
                            {formatCurrency(testResult.test.price)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Cost Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="font-bold text-xl text-green-800">
                Tổng chi phí điều trị
              </h4>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(totalPrice)}
              </p>
              <p className="text-sm text-green-600 font-medium">
                Đã bao gồm tất cả dịch vụ
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PatientTreatmentCard;
