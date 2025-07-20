import useAuth from "@/hooks/useAuth";
import { patientTreatmentSchema } from "@/schemas/patientTreatment";
import { appointmentService } from "@/services/appointmentService";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import { treatmentProtocolService } from "@/services/treatmentProtocolService";
import type { ErrorResponse } from "@/types/common";
import type { Medicine } from "@/types/medicine";
import type { PatientTreatmentFormSubmit } from "@/types/patientTreatment";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  AutoEndSubmitSection,
  DatesTotalSection,
  ExistingTreatmentDialog,
  NotesSection,
  PatientProtocolSection,
} from "./forms";
import CombinedMedicationsSection from "./forms/CombinedMedicationsSection";

interface PatientTreatmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: PatientTreatmentFormSubmit,
    autoEndExisting: boolean
  ) => void;
}

export const PatientTreatmentForm: React.FC<PatientTreatmentFormProps> = ({
  onSubmit,
}) => {
  // ===== State =====
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [existingTreatment, setExistingTreatment] = useState<{
    id: number;
    patientId: number;
  } | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [protocolDetail, setProtocolDetail] =
    useState<TreatmentProtocol | null>(null);
  const [autoEndExisting, setAutoEndExisting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openProtocol, setOpenProtocol] = useState(true);
  const [openCustomMed, setOpenCustomMed] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);

  const { user } = useAuth();
  const doctorIdFromUser =
    user && typeof user.id === "number"
      ? user.id
      : user && typeof user.id === "string"
      ? Number(user.id)
      : undefined;

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<import("@/schemas/patientTreatment").PatientTreatmentFormValues>({
    resolver: zodResolver(patientTreatmentSchema),
    defaultValues: {
      patientId: undefined,
      protocolId: undefined,
      doctorId: doctorIdFromUser,
      customMedications: [],
      notes: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: undefined,
      total: 0,
    },
    mode: "onChange",
  });
  // ===== Handlers =====
  // const handleCheckExisting = useCallback(async (patientId: number) => {
  //   try {
  //     const res = await patientTreatmentService.getByPatient(
  //       String(patientId),
  //       {}
  //     );
  //     const treatments = res.data.data || [];
  //     if (treatments.length > 0) {
  //       const t = treatments[0];
  //       setExistingTreatment({ id: t.id, patientId: t.patientId });
  //       setShowEditDialog(true);
  //     } else {
  //       setExistingTreatment(null);
  //     }
  //   } catch {
  //     setExistingTreatment(null);
  //   }
  // }, []);

  const {
    fields: customMedFields,
    append: appendCustomMed,
    remove: removeCustomMed,
  } = useFieldArray({
    control,
    name: "customMedications",
  });

  const searchProtocols = useCallback(async (query: string) => {
    const res = await treatmentProtocolService.getAllTreatmentProtocols({
      search: query,
      limit: "100000",
    });
    const list: TreatmentProtocol[] = res.data.data || [];
    return list.map((p) => ({ id: p.id, name: p.name }));
  }, []);
  const searchPatients = useCallback(async () => {
    if (!user?.id) return [];
    const res = await appointmentService.getAppointmentByDoctorId(
      Number(user.id),
      { limit: 10 }
    );
    const appointments: import("@/types/appointment").Appointment[] =
      res.data?.data || [];
    const uniquePatients: Record<number, { id: number; name: string }> = {};
    appointments.forEach((appt) => {
      if (appt.user && appt.userId && !uniquePatients[appt.userId]) {
        uniquePatients[appt.userId] = {
          id: appt.userId,
          name: appt.user.name || "",
        };
      }
    });
    return Object.values(uniquePatients);
  }, [user]);

  // ===== Doctor info =====
  const doctorNameFromStorage = (() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        return userObj.name || userObj.doctorName;
      }
    } catch {
      toast.error("Không thể lấy thông tin bác sĩ.");
    }
    return undefined;
  })();

  const watchedProtocolId = watch("protocolId");
  const watchedPatientId = watch("patientId");

  // Lấy thông tin phác đồ khi watchedProtocolId thay đổi
  useEffect(() => {
    if (typeof watchedProtocolId !== "number") {
      setProtocolDetail(null);
      setValue("customMedications", []);
      setValue("endDate", undefined);
      return;
    }
    let ignore = false;
    const fetchAll = async () => {
      // Lấy danh sách thuốc
      try {
        const { medicineService } = await import("@/services/medicineService");
        const res = await medicineService.getMedicines({ limit: 10000 });
        if (!ignore) setMedicines(res.data.data || []);
      } catch {
        if (!ignore) setMedicines([]);
      }

      // Kiểm tra điều trị hiện tại
      if (typeof watchedPatientId === "number") {
        try {
          const res = await patientTreatmentService.getByPatient(
            String(watchedPatientId),
            {}
          );
          const treatments = res.data.data || [];
          if (treatments.length > 0) {
            const t = treatments[0];
            setExistingTreatment({ id: t.id, patientId: t.patientId });
            setShowEditDialog(true);
          } else {
            setExistingTreatment(null);
          }
        } catch {
          setExistingTreatment(null);
        }
      }

      // Lấy thông tin phác đồ
      if (typeof watchedProtocolId === "number") {
        try {
          const res = await treatmentProtocolService.getTreatmentProtocolById(
            watchedProtocolId
          );
          const protocol = {
            ...res.data,
            medicines: Array.isArray(res.data?.medicines)
              ? res.data.medicines
              : [],
          };
          setProtocolDetail(protocol);
          if (protocol.medicines.length) {
            const meds = protocol.medicines.map((med) => ({
              medicineId:
                typeof med.medicineId === "string"
                  ? Number(med.medicineId)
                  : med.medicineId,
              medicineName: med.medicine?.name || "",
              dosage: med.dosage || "",
              unit: med.medicine?.unit || "",
              price:
                typeof med.medicine?.price === "string"
                  ? Number(med.medicine?.price)
                  : med.medicine?.price ?? 0,
              schedule: med.duration || "MORNING",
              frequency: med.frequency ?? "1",
              time: "",
              durationValue:
                typeof protocol.durationValue === "string"
                  ? Number(protocol.durationValue)
                  : protocol.durationValue ?? 1,
              durationUnit: protocol.durationUnit ?? "DAY",
              notes: med.notes || "",
            }));
            setValue("customMedications", meds);
          }
          // Tính endDate
          const startDateStr = protocol.startDate || new Date().toISOString();
          let endDate = startDateStr;
          if (protocol.durationValue && protocol.durationUnit) {
            const start = new Date(startDateStr);
            let addDays = 0;
            switch (protocol.durationUnit) {
              case "DAY":
                addDays = protocol.durationValue;
                break;
              case "WEEK":
                addDays = protocol.durationValue * 7;
                break;
              case "MONTH":
                start.setMonth(start.getMonth() + protocol.durationValue);
                break;
              case "YEAR":
                start.setFullYear(start.getFullYear() + protocol.durationValue);
                break;
              default:
                addDays = protocol.durationValue;
            }
            if (addDays > 0) {
              start.setDate(start.getDate() + addDays);
            }
            endDate = start.toISOString().slice(0, 16);
          }
          setValue("endDate", endDate);
        } catch {
          setProtocolDetail(null);
        }
      } else {
        setProtocolDetail(null);
        setValue("customMedications", []);
        setValue("endDate", undefined);
      }
    };
    fetchAll();
    return () => {
      ignore = true;
    };
  }, [watchedProtocolId, watchedPatientId, setValue]);

  return (
    <div className="w-full mx-auto">
      <div className="bg-primary/5 px-6 py-4 border-b">
        <h2 className="text-xl font-bold text-primary">
          Tạo điều trị bệnh nhân
          {doctorNameFromStorage && (
            <span className="block text-base font-medium text-gray-700">
              bởi <strong>{doctorNameFromStorage}</strong>
            </span>
          )}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(
          async (values) => {
            setSubmitError(null);
            try {
              const data: PatientTreatmentFormSubmit = {
                patientId: values.patientId!,
                protocolId: values.protocolId!,
                doctorId:
                  typeof values.doctorId === "string"
                    ? Number(values.doctorId)
                    : values.doctorId!,
                customMedications: Array.isArray(values.customMedications)
                  ? values.customMedications
                  : [],
                notes: values.notes,
                startDate: values.startDate,
                endDate: values.endDate ?? "",
                total: values.total!,
              };
              onSubmit(data, autoEndExisting);
            } catch (err) {
              let msg = "Đã xảy ra lỗi. Vui lòng thử lại.";
              const be = err as ErrorResponse;
              if (be.response?.status === 409) {
                const rawMsg = be.response.data?.message;
                if (
                  typeof rawMsg === "object" &&
                  rawMsg !== null &&
                  typeof rawMsg.message === "string"
                ) {
                  msg = rawMsg.message;
                } else if (typeof rawMsg === "string") {
                  msg = rawMsg;
                } else {
                  msg = "Xung đột dữ liệu.";
                }
              }
              setSubmitError(msg);
              toast.error(msg);
            }
          },
          (formErrors) => {
            let errorMsg = "";
            if (formErrors.patientId)
              errorMsg += `Bệnh nhân: ${formErrors.patientId.message}\n`;
            if (formErrors.protocolId)
              errorMsg += `Phác đồ: ${formErrors.protocolId.message}\n`;
            if (formErrors.doctorId)
              errorMsg += `Bác sĩ: ${formErrors.doctorId.message}\n`;
            if (formErrors.startDate)
              errorMsg += `Ngày bắt đầu: ${formErrors.startDate.message}\n`;
            if (formErrors.endDate)
              errorMsg += `Ngày kết thúc: ${formErrors.endDate.message}\n`;
            if (formErrors.total)
              errorMsg += `Tổng chi phí: ${formErrors.total.message}\n`;
            if (formErrors.customMedications)
              errorMsg += `Thuốc: lỗi dữ liệu thuốc bổ sung hoặc phác đồ.\n`;
            if (!errorMsg)
              errorMsg = "Vui lòng kiểm tra lại các trường bắt buộc.";
            setSubmitError(errorMsg);
            toast.error(errorMsg);
          }
        )}
        className="space-y-8 px-6 py-4 rounded-xl"
      >
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-primary mb-1">
            Thông tin điều trị
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            Vui lòng nhập đầy đủ thông tin để tạo điều trị cho bệnh nhân.
          </p>
        </div>
        {/* Patient & Protocol section */}
        <PatientProtocolSection
          control={control}
          register={register}
          errors={errors}
          searchPatients={searchPatients}
          searchProtocols={searchProtocols}
        />
        {/* Existing Treatment Dialog */}
        <ExistingTreatmentDialog
          show={showEditDialog}
          existingTreatment={existingTreatment}
          onClose={() => setShowEditDialog(false)}
          onEdit={(id) => {
            window.location.href = `/admin/patient-treatments/${id}/edit`;
          }}
        />
        {/* Combined Medications section */}
        <CombinedMedicationsSection
          protocolDetail={protocolDetail}
          openProtocol={openProtocol}
          setOpenProtocol={setOpenProtocol}
          openCustomMed={openCustomMed}
          setOpenCustomMed={setOpenCustomMed}
          customMedFields={customMedFields}
          appendCustomMed={appendCustomMed}
          removeCustomMed={removeCustomMed}
          register={register}
          errors={errors}
          medicines={medicines}
        />
        {/* Dates & Total section */}
        <DatesTotalSection register={register} errors={errors} />
        {/* Notes section */}
        <NotesSection
          open={openNotes}
          setOpen={setOpenNotes}
          register={register}
          errors={errors}
        />
        {/* Auto end & Submit section */}
        <AutoEndSubmitSection
          autoEndExisting={autoEndExisting}
          setAutoEndExisting={setAutoEndExisting}
          isSubmitting={isSubmitting}
        />
        {submitError && (
          <p className="text-red-600 text-sm mt-4 border border-red-200 rounded p-2 bg-red-50">
            {submitError}
          </p>
        )}
      </form>
    </div>
  );
};
