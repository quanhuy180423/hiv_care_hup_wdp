import { PatientTreatmentForm } from "@/components/doctor/MedicalRecordForm";
import { PatientTreatmentDetailDialog } from "@/components/doctor/PatientTreatmentDetailDialog";
import { PatientTreatmentTable } from "@/components/doctor/PatientTreatmentTable";
import type { Appointment } from "@/types/appointment";
import { useState } from "react";
import toast from "react-hot-toast";

const DoctorPatientTreatments = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [openForm, setOpenForm] = useState(false);

  // Handler chuyển sang phòng tư vấn (giả lập)
  const handleJoinMeet = (appt: Appointment) => {
    toast.success(`Chuyển sang phòng tư vấn cho bệnh nhân: ${appt.user?.name}`);
    // TODO: Thực hiện chuyển hướng/phòng meet thực tế
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Điều trị bệnh nhân</h1>
      {/* Table tracking appointments today */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Danh sách cuộc hẹn hôm nay
        </h2>
        <PatientTreatmentTable
          onShowDetail={(appt) => setSelectedAppointment(appt)}
          onShowForm={(appt) => {
            setSelectedAppointment(appt);
            setOpenForm(true);
          }}
          onJoinMeet={handleJoinMeet}
        />
      </div>

      {/* Dialog chi tiết cuộc hẹn */}
      <PatientTreatmentDetailDialog
        open={!!selectedAppointment && !openForm}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onShowForm={() => setOpenForm(true)}
        onJoinMeet={() =>
          selectedAppointment && handleJoinMeet(selectedAppointment)
        }
      />

      {/* Form tạo hồ sơ bệnh án */}
      {openForm && selectedAppointment && (
        <PatientTreatmentForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={async (values) => {
            setOpenForm(false);
            setSelectedAppointment(null);
            try {
              const { patientTreatmentService } = await import(
                "@/services/patientTreatmentService"
              );
              const { treatmentProtocolsService } = await import(
                "@/services/treatmentProtocolService"
              );
              const token = localStorage.getItem("accessToken") || "";
              if (!selectedAppointment)
                throw new Error("Không có thông tin cuộc hẹn");
              const patientId = selectedAppointment.userId;
              const doctorId = selectedAppointment.doctorId;
              const startDate = selectedAppointment.appointmentTime;
              // Tạo hồ sơ bệnh án (chỉ truyền các trường hợp lệ)
              await patientTreatmentService.create(
                {
                  ...values,
                  // Nếu backend yêu cầu, có thể cần truyền thêm patientId, doctorId, startDate, protocolId ở đây
                },
                token
              );
              // Lấy protocol object để truyền vào hàm tạo lịch tái khám
              const protocols = await treatmentProtocolsService.getAll({
                token,
              });
              const protocol = protocols.find(
                (p) => p.id === Number(values.treatmentProtocol)
              );
              if (protocol) {
                await treatmentProtocolsService.createFollowupAppointments({
                  patientId,
                  doctorId,
                  protocol,
                  startDate,
                  token,
                });
              }
              toast.success("Tạo hồ sơ bệnh án và lịch tái khám thành công!");
            } catch {
              toast.error("Có lỗi khi tạo hồ sơ hoặc lịch tái khám!");
            }
          }}
        />
      )}
    </div>
  );
};

export default DoctorPatientTreatments;
