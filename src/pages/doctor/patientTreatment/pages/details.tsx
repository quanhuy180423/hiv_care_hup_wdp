import { TestResultList } from "@/components/doctor/TestResultList";
import { Button } from "@/components/ui/button";
import { usePatientTreatment } from "@/hooks/usePatientTreatments";
import { exportPatientTreatmentToPDF } from "@/lib/utils/exportPatientTreatmentToPDF";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailDoctorPatientTreatment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: treatment,
    isLoading,
    isError,
    refetch,
  } = usePatientTreatment(Number(id));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <span>Đang tải dữ liệu hồ sơ bệnh án...</span>
      </div>
    );
  }

  if (isError || !treatment) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500">
        <FileText className="w-10 h-10 mb-2" />
        <span>Không tìm thấy hồ sơ bệnh án.</span>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          Chi tiết hồ sơ bệnh án
        </h1>
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <b>Bệnh nhân:</b> {treatment.patient?.name || "-"}
            </div>
            <div className="mb-2">
              <b>Bác sĩ:</b> {treatment.doctor?.user?.name || "-"}
            </div>
            <div className="mb-2">
              <b>Phác đồ:</b> {treatment.protocol?.name || "-"}
            </div>
            <div className="mb-2">
              <b>Ngày bắt đầu:</b>{" "}
              {treatment.startDate ? treatment.startDate.slice(0, 10) : "-"}
            </div>
            <div className="mb-2">
              <b>Ngày kết thúc:</b>{" "}
              {treatment.endDate ? treatment.endDate.slice(0, 10) : "-"}
            </div>
            <div className="mb-2">
              <b>Ghi chú:</b> {treatment.notes || "-"}
            </div>
          </div>
          <div>
            <div className="mb-2">
              <b>Trạng thái:</b>{" "}
              {treatment.status ? "Đang điều trị" : "Đã kết thúc"}
            </div>
            <div className="mb-2">
              <b>Tổng chi phí:</b> {treatment.total?.toLocaleString() || "-"}{" "}
              VNĐ
            </div>
            <div className="mb-2">
              <b>Người tạo:</b> {treatment.createdBy?.name || "-"}
            </div>
            <div className="mb-2">
              <b>Ngày tạo:</b>{" "}
              {treatment.createdAt ? treatment.createdAt.slice(0, 10) : "-"}
            </div>
          </div>
        </div>
      </div>
      <Button
        className="mb-4"
        variant="outline"
        onClick={() => exportPatientTreatmentToPDF(treatment)}
      >
        <FileText className="w-4 h-4 mr-2" /> Xuất PDF hồ sơ bệnh án
      </Button>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2 text-primary">
          Kết quả xét nghiệm
        </h2>
        <TestResultList patientTreatmentId={treatment.id} />
      </div>
    </div>
  );
}
