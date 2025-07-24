import { PatientTreatmentForm } from "@/components/doctor/PatientTreatmentForm";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import type { PatientTreatmentFormSubmit } from "@/types/patientTreatment";
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
    <div className="w-full mx-auto py-8">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-2 text-base"
        aria-label="Breadcrumb"
      >
        <button
          type="button"
          className="text-gray-500 hover:text-primary focus:outline-none"
          onClick={() => navigate("/doctor/patient-treatments")}
        >
          Hồ sơ điều trị
        </button>
        <span className="text-gray-400">/</span>
        <span className="font-semibold text-primary">
          {id ? "Cập nhật hồ sơ" : "Tạo hồ sơ mới"}
        </span>
      </nav>
      {loading ? (
        <div className="text-center py-12">Đang tải dữ liệu...</div>
      ) : (
        <PatientTreatmentForm
          open={true}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
