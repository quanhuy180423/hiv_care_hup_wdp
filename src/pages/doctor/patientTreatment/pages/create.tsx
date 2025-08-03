import { PatientTreatmentForm } from "@/components/doctor/PatientTreatmentForm";
import { Button } from "@/components/ui/button";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import type { PatientTreatmentFormSubmit } from "@/types/patientTreatment";
import { NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateDoctorPatientTreatmentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      patientTreatmentService
        .getById(id)
        .then((res) => {
          console.log(`Fetched treatment data:`, res.data);
        })
        .catch(() => {
          toast.error("Không thể tải dữ liệu hồ sơ bệnh án.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleClose = () => {
    navigate("/doctor/patient-treatments");
  };

  const handleSubmit = async (
    data: PatientTreatmentFormSubmit,
    autoEndExisting: boolean
  ) => {
    try {
      if (id) {
        await patientTreatmentService.update(id, data);
        toast.success("Cập nhật hồ sơ bệnh án thành công!");
      } else {
        await patientTreatmentService.create(data, autoEndExisting);
        toast.success("Tạo điều trị thành công!");
      }
      navigate("/doctor/patient-treatments");
    } catch {
      toast.error(
        id ? "Đã xảy ra lỗi khi cập nhật." : "Đã xảy ra lỗi khi tạo điều trị."
      );
    }
  };

  return (
    <div className="w-full mx-auto py-8 relative">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-2 text-base"
        aria-label="Breadcrumb"
      >
        <Button
          type="button"
          variant="ghost"
          className="text-gray-500 hover:text-primary focus:outline-none flex items-center gap-2 px-2"
          onClick={() => navigate("/doctor/patient-treatments")}
          disabled={loading}
          aria-label="Quay lại danh sách hồ sơ điều trị"
        >
          <NotebookPen className="w-5 h-5 mr-1" />
          <span>Hồ sơ điều trị</span>
        </Button>
        <span className="text-gray-400">/</span>
        <span className="font-semibold text-primary">
          {id ? "Cập nhật hồ sơ điều trị" : "Tạo hồ sơ điều trị mới"}
        </span>
      </nav>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin mb-2 mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            <div className="text-gray-600 text-base">
              Đang tải dữ liệu hồ sơ điều trị...
            </div>
          </div>
        </div>
      )}
      <div className={loading ? "pointer-events-none opacity-50" : ""}>
        <PatientTreatmentForm
          open={true}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
