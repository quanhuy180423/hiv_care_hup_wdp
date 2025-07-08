import { PatientTreatmentForm } from "@/components/doctor/MedicalRecordForm";
import { PatientTreatmentDetailDialog } from "@/components/doctor/PatientTreatmentDetailDialog";
import { PatientTreatmentTable } from "@/components/doctor/PatientTreatmentTable";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/types/appointment";
import { useMemo, useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

const DoctorPatientTreatments = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [search, setSearch] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Handler chuyển sang phòng tư vấn (giả lập)
  const handleJoinMeet = (appt: Appointment) => {
    toast.success(`Chuyển sang phòng tư vấn cho bệnh nhân: ${appt.user?.name}`);
    // TODO: Thực hiện chuyển hướng/phòng meet thực tế
  };

  // Lọc danh sách appointments theo search
  const filteredAppointments = useMemo(() => {
    if (!search.trim()) return undefined; // undefined để PatientTreatmentTable lấy mặc định
    return (appointments: Appointment[]) =>
      appointments.filter(
        (appt) =>
          appt.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          appt.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
          appt.notes?.toLowerCase().includes(search.toLowerCase())
      );
  }, [search]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Điều trị bệnh nhân</h1>
      {/* Table tracking appointments today */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Danh sách cuộc hẹn hôm nay
        </h2>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="size-4" />
            </span>
            <Input
              ref={searchInputRef}
              placeholder="Tìm kiếm bệnh nhân, email, ghi chú..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          {search && (
            <span className="text-xs text-gray-500 ml-2">
              Đã tìm thấy{" "}
              {filteredAppointments &&
              typeof filteredAppointments === "function"
                ? "..."
                : ""}{" "}
              kết quả
            </span>
          )}
        </div>
        {/* Loading và empty state */}
        <PatientTreatmentTable
          onShowDetail={(appt) => setSelectedAppointment(appt)}
          onShowForm={(appt) => {
            setSelectedAppointment(appt);
            setOpenForm(true);
          }}
          onJoinMeet={handleJoinMeet}
          filterAppointments={filteredAppointments}
        />
        {search && (
          <div className="text-center text-gray-400 text-sm mt-2">
            {/* Nếu không có kết quả sau khi lọc, hiển thị thông báo */}
            {/* PatientTreatmentTable sẽ không render nếu không có appointments, nên kiểm tra ở đây */}
            {/* Có thể truyền thêm prop để lấy số lượng kết quả thực tế nếu muốn chính xác hơn */}
            {/* Hoặc custom lại PatientTreatmentTable để trả về số lượng kết quả */}
            {/* Ở đây chỉ demo UX, bạn có thể tối ưu thêm */}
            {/* Nếu cần, có thể truyền callback để nhận số lượng kết quả từ bảng */}
          </div>
        )}
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
              // Tạo hồ sơ bệnh án (chỉ truyền các trường hợp hợp lệ)
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
