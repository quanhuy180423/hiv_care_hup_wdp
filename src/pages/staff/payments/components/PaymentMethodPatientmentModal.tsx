import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type {
  ActivePatientTreatment,
  TestResult,
} from "@/types/patientTreatment";
import type { PaymentMethod } from "@/services/paymentService";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "../../../../lib/utils/numbers/formatCurrency";
import { formatDate } from "../../../../lib/utils/dates/formatDate";
import type { CustomMedicationItem } from "@/schemas/patientTreatment";
import { Card } from "@/components/ui/card";
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

// Define formatDateTime inline
const formatDateTime = (iso: string | undefined) => {
  if (!iso) return "";
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

interface PaymentMethodPatientmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTreatment?: ActivePatientTreatment | null;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const PaymentMethodPatientmentModal: React.FC<
  PaymentMethodPatientmentModalProps
> = ({
  isOpen,
  onClose,
  selectedTreatment,
  paymentMethod,
  setPaymentMethod,
  onConfirm,
  isLoading = false,
}) => {
  // Ensure treatment is properly typed and checked
  const treatment = selectedTreatment ?? ({} as ActivePatientTreatment);
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl bg-white max-h-[95vh] overflow-y-auto p-0 min-w-4xl">
        <DialogHeader className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-green-200 sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-green-800">
            <Stethoscope className="w-7 h-7 text-green-600" />
            Thông tin thanh toán điều trị
          </DialogTitle>
        </DialogHeader>

        {selectedTreatment && (
          <div className="p-6 space-y-6">
            {/* Treatment Header */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-green-500">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-2xl text-green-800">
                    Điều trị #{treatment.id}
                  </h3>
                  {treatment.isCurrent && (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Hiện tại
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  {treatment.treatmentStatus && (
                    <Badge className="text-lg font-semibold px-4 py-2 bg-blue-100 text-blue-800 border-blue-300">
                      {treatment.treatmentStatus
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Badge>
                  )}

                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Tổng chi phí điều trị
                    </p>
                    <p className="text-3xl font-bold text-green-700">
                      {formatCurrency(totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Patient & Doctor Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {treatment.patient?.name && (
                <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-800">
                      Thông tin bệnh nhân
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Họ và tên
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        {treatment.patient.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700">Email</p>
                      <p className="text-blue-800">{treatment.patient.email}</p>
                    </div>
                    {treatment.patient.phoneNumber && (
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Số điện thoại
                        </p>
                        <p className="text-blue-800">
                          {treatment.patient.phoneNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {treatment.doctor?.user?.name && (
                <Card className="p-6 bg-purple-50 border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Stethoscope className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-purple-800">
                      Bác sĩ phụ trách
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Họ và tên
                      </p>
                      <p className="text-lg font-bold text-purple-900">
                        {treatment.doctor.user.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Chuyên khoa
                      </p>
                      <p className="text-purple-800">
                        {treatment.doctor.specialization}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Timeline */}
            <Card className="p-6 bg-orange-50 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-orange-800">
                  Thời gian điều trị
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-orange-700">
                    Ngày bắt đầu
                  </p>
                  <p className="text-lg font-bold text-orange-900">
                    {formatDateTime(treatment.startDate)}
                  </p>
                </div>
                {treatment.endDate && (
                  <div>
                    <p className="text-sm font-medium text-orange-700">
                      Ngày kết thúc
                    </p>
                    <p className="text-lg font-bold text-orange-900">
                      {formatDateTime(treatment.endDate)}
                    </p>
                  </div>
                )}
                {treatment.daysRemaining !== null && treatment.isCurrent && (
                  <div>
                    <p className="text-sm font-medium text-orange-700">
                      Số ngày còn lại
                    </p>
                    <p className="text-lg font-bold text-orange-900">
                      {treatment.daysRemaining} ngày
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Notes */}
            {treatment.notes && (
              <Card className="p-6 bg-yellow-50 border-l-4 border-l-yellow-500">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-bold text-yellow-800">
                    Ghi chú điều trị
                  </h3>
                </div>
                <p className="text-yellow-700 leading-relaxed">
                  {treatment.notes}
                </p>
              </Card>
            )}

            {/* Custom Medications Section */}
            {treatment.customMedications &&
              treatment.customMedications.length > 0 && (
                <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-3 mb-6">
                    <Pill className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-800">
                      Thuốc điều trị ({treatment.customMedications.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {treatment.customMedications.map(
                      (med: CustomMedicationItem, medIndex: number) => (
                        <div
                          key={medIndex}
                          className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Pill className="w-4 h-4 text-blue-600" />
                              <h4 className="font-bold text-blue-900">
                                {med.medicineName}
                              </h4>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="font-medium text-blue-700">
                                  Liều dùng
                                </p>
                                <p className="text-blue-800">{med.dosage}</p>
                              </div>
                              {med.unit && (
                                <div>
                                  <p className="font-medium text-blue-700">
                                    Đơn vị
                                  </p>
                                  <p className="text-blue-800">{med.unit}</p>
                                </div>
                              )}
                              {med.frequency && (
                                <div>
                                  <p className="font-medium text-blue-700">
                                    Tần suất
                                  </p>
                                  <p className="text-blue-800">
                                    {med.frequency}
                                  </p>
                                </div>
                              )}
                              {med.time && (
                                <div>
                                  <p className="font-medium text-blue-700">
                                    Thời gian
                                  </p>
                                  <p className="text-blue-800">{med.time}</p>
                                </div>
                              )}
                            </div>

                            {med.durationValue && med.durationUnit && (
                              <div className="p-2 bg-blue-100 rounded">
                                <p className="text-sm font-medium text-blue-700">
                                  Thời gian điều trị
                                </p>
                                <p className="text-blue-800">
                                  {med.durationValue} {med.durationUnit}
                                </p>
                              </div>
                            )}

                            {med.notes && (
                              <div className="p-2 bg-gray-100 rounded">
                                <p className="text-sm font-medium text-gray-700">
                                  Ghi chú
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {med.notes}
                                </p>
                              </div>
                            )}

                            {med.price !== undefined && (
                              <div className="p-2 bg-green-100 rounded text-center">
                                <p className="text-sm font-medium text-green-700">
                                  Giá thuốc
                                </p>
                                <p className="text-lg font-bold text-green-800">
                                  {formatCurrency(med.price)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Card>
              )}

            {/* Test Results Section */}
            {treatment.testResults && treatment.testResults.length > 0 && (
              <Card className="p-6 bg-purple-50 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-3 mb-6">
                  <TestTube className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-800">
                    Kết quả xét nghiệm ({treatment.testResults.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {treatment.testResults.map(
                    (result: TestResult, resultIndex: number) => (
                      <div
                        key={resultIndex}
                        className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <TestTube className="w-4 h-4 text-purple-600" />
                            <h4 className="font-bold text-purple-900">
                              {result.test?.name || "Xét nghiệm không rõ tên"}
                            </h4>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="font-medium text-purple-700">
                                Kết quả
                              </p>
                              <p className="text-purple-800">
                                {result.rawResultValue} {result.unit}
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-purple-700">
                                Diễn giải
                              </p>
                              <p className="text-purple-800">
                                {result.interpretation}
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-purple-700">
                                Ngày thực hiện
                              </p>
                              <p className="text-purple-800">
                                {formatDate(result.resultDate)}
                              </p>
                            </div>
                          </div>

                          {result.notes && (
                            <div className="p-2 bg-purple-100 rounded">
                              <p className="text-sm font-medium text-purple-700">
                                Ghi chú
                              </p>
                              <p className="text-purple-600 text-sm">
                                {result.notes}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <Badge
                              variant={
                                result.status === "FINAL"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`text-xs ${
                                result.status === "FINAL"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
                              }`}
                            >
                              {result.status === "FINAL" ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Hoàn thành
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {result.status}
                                </div>
                              )}
                            </Badge>

                            {result.test?.price && (
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  {formatCurrency(result.test.price)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}

            <Separator className="my-6" />

            {/* Payment Method Selection */}
            <Card className="p-6 bg-green-50 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-800">
                  Phương thức thanh toán
                </h3>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <Select
                  value={paymentMethod?.method || undefined}
                  onValueChange={(value) =>
                    setPaymentMethod({ method: value } as PaymentMethod)
                  }
                >
                  <SelectTrigger className="h-12 text-lg border-2 border-green-300 focus:border-green-500">
                    <SelectValue
                      placeholder="Chọn phương thức thanh toán"
                      className="text-gray-700"
                    />
                  </SelectTrigger>
                  <SelectContent className="min-w-full bg-white">
                    <SelectItem value="BANK_TRANSFER" className="text-lg p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">
                            Chuyển khoản ngân hàng
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod?.method && (
                <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Đã chọn: Chuyển khoản ngân hàng
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Hệ thống sẽ tạo mã QR để bệnh nhân thanh toán
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        <DialogFooter className="bg-gray-50 p-6 border-t border-gray-200 sticky bottom-0 z-10">
          <div className="flex items-center justify-between w-full">
            <div className="text-left">
              <p className="text-sm text-gray-600">Tổng thanh toán điều trị</p>
              <p className="text-3xl font-bold text-green-700">
                {selectedTreatment && formatCurrency(totalPrice)}
              </p>
              <p className="text-sm text-green-600 font-medium">
                Bao gồm thuốc và xét nghiệm
              </p>
            </div>

            <Button
              onClick={onConfirm}
              disabled={isLoading || !paymentMethod?.method}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Đang xử lý...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Xác nhận và tạo QR thanh toán
                </div>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodPatientmentModal;
