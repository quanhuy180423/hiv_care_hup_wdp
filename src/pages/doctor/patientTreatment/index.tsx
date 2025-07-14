import { PatientTreatmentDetailDialog } from "@/components/doctor/PatientTreatmentDetailDialog";
import { PatientTreatmentForm } from "@/components/doctor/PatientTreatmentForm";
import { PatientTreatmentTable } from "@/components/doctor/PatientTreatmentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileX2, Loader2, Plus, Search } from "lucide-react";

import {
  useCreatePatientTreatment,
  useDeletePatientTreatment,
  usePatientTreatments,
  useUpdatePatientTreatment,
} from "@/hooks/usePatientTreatments";
import type { PatientTreatmentType } from "@/types/patientTreatment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DoctorPatientTreatments = () => {
  const [search, setSearch] = useState("");
  const [selectedTreatment, setSelectedTreatment] =
    useState<PatientTreatmentType | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const {
    data: treatmentsData,
    isLoading: isLoadingPatientTreatments,
    refetch: refetchTreatments,
  } = usePatientTreatments({
    page: 1,
    limit: 100,
    search,
    sortBy: "startDate",
    sortOrder: "desc",
  });

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

  console.log(treatmentsData);

  const handleAdd = () => {
    setSelectedTreatment(null);
    setOpenForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa hồ sơ này không?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Đã xóa hồ sơ bệnh án!"),
        onError: () => toast.error("Xóa hồ sơ thất bại."),
      });
    }
  };

  const handleShowDetail = (treatment: PatientTreatmentType) => {
    setSelectedTreatment(treatment);
  };

  const handleEdit = (treatment: PatientTreatmentType) => {
    setSelectedTreatment(treatment);
    setOpenForm(true);
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
      <div className="mb-6 max-w-xs">
        <div className="relative">
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
        ) : Array.isArray(treatmentsData) && treatmentsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-base">
            <FileX2 className="w-12 h-12 mb-2" />
            Không tìm thấy kết quả phù hợp.
          </div>
        ) : (
          <>
            <PatientTreatmentTable
              treatments={Array.isArray(treatmentsData) ? treatmentsData : []}
              onShowDetail={handleShowDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {/* Pagination UI */}
            {/* {meta && meta.totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Trang trước
                </Button>
                <span className="flex items-center gap-2">
                  Trang {meta.page} / {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= meta.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                >
                  Trang sau
                </Button>
              </div>
            )} */}
          </>
        )}
      </div>

      {/* Dialog chi tiết hồ sơ */}
      <PatientTreatmentDetailDialog
        open={!!selectedTreatment && !openForm}
        appointment={null}
        treatment={selectedTreatment ?? undefined}
        onClose={() => setSelectedTreatment(null)}
        onShowForm={() => setOpenForm(true)}
        onJoinMeet={() => {}}
      />

      {/* Form tạo/sửa hồ sơ bệnh án */}
      {openForm && (
        <PatientTreatmentForm
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setSelectedTreatment(null);
          }}
          onSubmit={async (data) => {
            if (selectedTreatment?.id) {
              updateMutation.mutate(
                {
                  id: selectedTreatment.id,
                  data: data,
                },
                {
                  onSuccess: () => {
                    toast.success("Đã cập nhật hồ sơ bệnh án!");
                    setOpenForm(false);
                    setSelectedTreatment(null);
                  },
                  onError: () => {
                    toast.error("Cập nhật thất bại.");
                  },
                }
              );
            } else {
              createMutation.mutate(data, {
                onSuccess: () => {
                  toast.success("Đã tạo hồ sơ bệnh án mới!");
                  setOpenForm(false);
                },
                onError: () => {
                  toast.error("Tạo thất bại.");
                },
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default DoctorPatientTreatments;
