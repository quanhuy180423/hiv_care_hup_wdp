import { PatientTreatmentDetailDialog } from "@/components/doctor/PatientTreatmentDetailDialog";
import { PatientTreatmentTable } from "@/components/doctor/PatientTreatmentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppointmentsByDoctor } from "@/hooks/useAppointments";
import {
  useCreatePatientTreatment,
  useDeletePatientTreatment,
  usePatientTreatmentsByDoctor,
  useUpdatePatientTreatment,
} from "@/hooks/usePatientTreatments";
import useAuthStore from "@/store/authStore";
import type { Appointment } from "@/types/appointment";
import type { PatientTreatmentType as BasePatientTreatmentType } from "@/types/patientTreatment";
import { FileX2, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Extend PatientTreatmentType to include appointment info
export interface PatientTreatmentWithAppointment
  extends BasePatientTreatmentType {
  appointmentStatus?: Appointment["status"];
  appointmentId?: Appointment["id"];
  isAnonymous?: boolean;
}

// Paginated data type for treatments
interface PaginatedTreatmentData {
  data: BasePatientTreatmentType[];
  meta?: { total: number };
}

function isPaginatedTreatmentData(obj: unknown): obj is PaginatedTreatmentData {
  return (
    !!obj &&
    typeof obj === "object" &&
    Array.isArray((obj as PaginatedTreatmentData).data)
  );
}

const DoctorPatientTreatments = () => {
  // Lấy doctorId từ store
  const doctorIdFromUser = useAuthStore((s) => {
    const docId = s.userProfile?.doctorId ?? s.userProfile?.doctorId;
    if (typeof docId === "string") return Number(docId);
    if (typeof docId === "number") return docId;
    return undefined;
  });
  const [search, setSearch] = useState("");
  const [selectedTreatment, setSelectedTreatment] =
    useState<PatientTreatmentWithAppointment | null>(null);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    data: treatmentsDataRaw,
    isLoading: isLoadingPatientTreatments,
    refetch: refetchTreatments,
  } = usePatientTreatmentsByDoctor(
    doctorIdFromUser !== undefined ? doctorIdFromUser : "",
    {
      page,
      limit: pageSize,
      sortBy: "startDate",
      sortOrder: "desc",
    }
  );

  // Lấy danh sách lịch hẹn của bác sĩ
  const { data: appointmentsData } = useAppointmentsByDoctor(
    doctorIdFromUser ?? 0,
    { page: 1, limit: 1000 }
  );

  // Lấy đúng mảng appointments từ appointmentsData (có thể là paginated object)
  const appointmentsList: Appointment[] = useMemo(() => {
    if (Array.isArray(appointmentsData)) return appointmentsData;
    return appointmentsData?.data ?? [];
  }, [appointmentsData]);
  console.log("appointmentsList:", appointmentsList);

  // Build appointmentMap theo userId (patientId)
  const appointmentMap: Record<number, Appointment> = useMemo(() => {
    const map = appointmentsList.reduce((acc, apt) => {
      if (typeof apt.userId === "number") acc[apt.userId] = apt;
      return acc;
    }, {} as Record<number, Appointment>);
    console.log("appointmentMap:", map);
    return map;
  }, [appointmentsList]);

  // Gộp trạng thái appointment vào treatment (memoized)
  const treatmentsData = useMemo(() => {
    if (isPaginatedTreatmentData(treatmentsDataRaw)) {
      const merged: PatientTreatmentWithAppointment[] =
        treatmentsDataRaw.data.map((t) => {
          const apt = appointmentMap[t.patientId];
          return {
            ...t,
            appointmentStatus: apt?.status,
            appointmentId: apt?.id,
            isAnonymous: t.isAnonymous,
          };
        });
      console.log("merged treatments:", merged);
      return {
        data: merged,
        meta: treatmentsDataRaw.meta ?? { total: merged.length },
      };
    }
    return { data: [], meta: { total: 0 } };
  }, [treatmentsDataRaw, appointmentMap]);

  console.log(`merged treatments:`, treatmentsData);

  useEffect(() => {
    if (
      !isLoadingPatientTreatments &&
      (!treatmentsDataRaw ||
        typeof treatmentsDataRaw !== "object" ||
        !("data" in treatmentsDataRaw))
    ) {
      toast.error(
        "Không thể tải danh sách hồ sơ bệnh nhân. Vui lòng kiểm tra lại kết nối hoặc liên hệ quản trị viên."
      );
    }
  }, [isLoadingPatientTreatments, treatmentsDataRaw]);

  const createMutation = useCreatePatientTreatment();
  const updateMutation = useUpdatePatientTreatment();
  const deleteMutation = useDeletePatientTreatment();

  useEffect(() => {
    if (
      createMutation.isSuccess ||
      updateMutation.isSuccess ||
      deleteMutation.isSuccess
    ) {
      refetchTreatments();
    }
  }, [
    createMutation.isSuccess,
    updateMutation.isSuccess,
    deleteMutation.isSuccess,
    refetchTreatments,
  ]);

  const handleAdd = () => {
    navigate("/doctor/patient-treatments/create");
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa hồ sơ này không?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Đã xóa hồ sơ bệnh án!"),
        onError: () => toast.error("Xóa hồ sơ thất bại."),
      });
    }
  };

  const handleShowDetail = (treatment: PatientTreatmentWithAppointment) => {
    setSelectedTreatment(treatment);
  };

  const handleEdit = (treatment: PatientTreatmentWithAppointment) => {
    navigate(`/doctor/patient-treatments/${treatment.id}/edit`);
  };

  const handleRefresh = () => {
    refetchTreatments();
    toast.success("Đã làm mới danh sách hồ sơ bệnh nhân!");
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Quản lý hồ sơ bệnh nhân
        </h1>
        <Button
          className="inline-flex items-center gap-2 bg-primary text-black px-5 py-2 rounded-lg shadow transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          onClick={handleAdd}
        >
          <Plus className="w-5 h-5" />
          Thêm hồ sơ
        </Button>
      </div>
      <div className="mb-6 flex items-center justify-between w-full">
        <div className="relative w-full max-w-xs">
          <Input
            placeholder="Tìm kiếm theo tên bệnh nhân..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-primary focus:ring-primary/30 pl-10"
            aria-label="Tìm kiếm theo tên bệnh nhân"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleRefresh}
          aria-label="Làm mới danh sách"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v6h6M20 20v-6h-6"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 4a8.1 8.1 0 0 0-15.9 2M4 20a8.1 8.1 0 0 0 15.9-2"
            />
          </svg>
          Làm mới
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Danh sách hồ sơ bệnh nhân
        </h2>
        {isLoadingPatientTreatments ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-1" />
            <span className="text-gray-500">Đang tải dữ liệu...</span>
          </div>
        ) : treatmentsData.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-base">
            <FileX2 className="w-12 h-12 mb-2" />
            Không tìm thấy kết quả phù hợp.
          </div>
        ) : (
          <>
            <PatientTreatmentTable
              treatments={treatmentsData.data}
              onShowDetail={handleShowDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRefresh={handleRefresh}
            />
            {/* Pagination UI */}
            {(() => {
              const totalPages = Math.max(
                1,
                Math.ceil(treatmentsData.meta.total / pageSize)
              );
              return totalPages > 1 ? (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Trang trước
                  </Button>
                  <span className="flex items-center gap-2">
                    Trang {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Trang sau
                  </Button>
                </div>
              ) : null;
            })()}
          </>
        )}
      </div>

      {/* Dialog chi tiết hồ sơ */}
      <PatientTreatmentDetailDialog
        open={!!selectedTreatment}
        appointment={null}
        treatment={selectedTreatment ?? undefined}
        onClose={() => setSelectedTreatment(null)}
        onShowForm={() => {}}
        onJoinMeet={() => {}}
      />

      {/* Form tạo/sửa hồ sơ bệnh án chỉ dùng trang riêng để tạo mới */}
    </div>
  );
};

export default DoctorPatientTreatments;
