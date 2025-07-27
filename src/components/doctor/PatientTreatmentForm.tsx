import { cn } from "@/lib/utils";
import { calculateEndDate, parseDate } from "@/lib/utils/patientTreatmentUtils";
import type { CustomMedicationItem } from "@/schemas/patientTreatment";
import {
  patientTreatmentSchema,
  type PatientTreatmentFormValues,
} from "@/schemas/patientTreatment";
import { appointmentService } from "@/services/appointmentService";
import { medicineService } from "@/services/medicineService";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import { treatmentProtocolService } from "@/services/treatmentProtocolService";
import useAuthStore from "@/store/authStore";
import type { Appointment } from "@/types/appointment";
import type { ErrorResponse } from "@/types/common";
import type { DurationUnit, Medicine } from "@/types/medicine";
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

  const doctorIdFromUser = useAuthStore((s) => {
    const docId = s.userProfile?.doctorId ?? s.userProfile?.doctorId;
    if (typeof docId === "string") return Number(docId);
    if (typeof docId === "number") return docId;
    return undefined;
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PatientTreatmentFormValues>({
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

  const {
    fields: customMedFields,
    append: appendCustomMed,
    remove: removeCustomMed,
  } = useFieldArray({
    control,
    name: "customMedications",
  });

  // ===== Search helpers =====
  const searchProtocols = useCallback(async (query: string) => {
    const res = await treatmentProtocolService.getAllTreatmentProtocols({
      search: query,
      limit: "100000",
    });
    const list: TreatmentProtocol[] = res.data.data || [];
    return list.map((p) => ({ id: p.id, name: p.name }));
  }, []);

  const searchPatients = useCallback(async () => {
    if (!doctorIdFromUser) return [];
    const res = await appointmentService.getAppointmentByDoctorId(
      Number(doctorIdFromUser),
      { limit: 10 }
    );
    const appointments: Appointment[] = res.data?.data || [];
    console.log(`appointments`, appointments);
    const uniquePatients: Record<
      number,
      { id: number; name: string; appointmentStatus?: string }
    > = {};
    appointments.forEach((appt) => {
      if (appt.user && appt.userId && !uniquePatients[appt.userId]) {
        uniquePatients[appt.userId] = {
          id: appt.userId,
          name: appt.user.name || "",
          appointmentStatus: appt.status,
        };
      }
    });
    return Object.values(uniquePatients);
  }, [doctorIdFromUser]);

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

  // ===== Effects =====
  // Lấy thông tin phác đồ khi watchedProtocolId thay đổi
  useEffect(() => {
    if (typeof watchedProtocolId !== "number") {
      setProtocolDetail(null);
      setValue("customMedications", []);
      setValue("endDate", undefined);
      return;
    }
    const fetchAll = async () => {
      await fetchMedicines();
      await checkExistingTreatment();
      await fetchProtocolDetail();
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedProtocolId, watchedPatientId, doctorIdFromUser, setValue]);

  // ===== Data fetching helpers =====
  const fetchMedicines = async () => {
    try {
      const res = await medicineService.getMedicines({ limit: 10000 });
      setMedicines(res.data.data || []);
    } catch {
      setMedicines([]);
    }
  };

  const checkExistingTreatment = async () => {
    if (
      typeof watchedPatientId === "number" &&
      typeof doctorIdFromUser === "number"
    ) {
      try {
        const res = await patientTreatmentService.getByPatient(
          String(watchedPatientId),
          { doctorId: doctorIdFromUser }
        );
        const treatments =
          res && res.data && Array.isArray(res.data.data) ? res.data.data : [];
        if (
          treatments.length > 0 &&
          treatments[0]?.id &&
          treatments[0]?.patientId
        ) {
          setExistingTreatment({
            id: treatments[0].id,
            patientId: treatments[0].patientId,
          });
          setShowEditDialog(true);
        } else {
          setExistingTreatment(null);
        }
      } catch (err) {
        setExistingTreatment(null);
        console.error("Lỗi lấy hồ sơ điều trị bệnh nhân:", err);
      }
    }
  };

  const fetchProtocolDetail = async () => {
    if (typeof watchedProtocolId !== "number") {
      setProtocolDetail(null);
      setValue("customMedications", []);
      setValue("endDate", undefined);
      return;
    }
    try {
      const res = await treatmentProtocolService.getTreatmentProtocolById(
        watchedProtocolId
      );
      const protocol = {
        ...res.data,
        medicines: Array.isArray(res.data?.medicines) ? res.data.medicines : [],
      };
      setProtocolDetail(protocol);
      if (protocol.medicines.length) {
        // Chỉ lấy thuốc gốc từ phác đồ, không ghi đè customMedications nếu đã có chỉnh sửa
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
          source: "protocol" as const,
          protocolMedicineId: med.id,
        }));
        setValue("customMedications", meds);
      }

      const startDate = protocol.startDate
        ? parseDate(protocol.startDate)
        : new Date();
      setValue(
        "endDate",
        calculateEndDate(
          {
            ...protocol,
            durationUnit: protocol.durationUnit as DurationUnit,
          },
          startDate instanceof Date ? startDate.toISOString().slice(0, 16) : ""
        ) || undefined
      );
    } catch {
      setProtocolDetail(null);
    }
  };

  const handleEditProtocolMedicine = (
    protocolMedicineId: number,
    newValues: Partial<Medicine & { dosage: string; notes: string }>
  ) => {
    const currentMeds = (getValues("customMedications") ||
      []) as CustomMedicationItem[];
    const existed = currentMeds.find(
      (m) =>
        m.protocolMedicineId === protocolMedicineId && m.source === "edited"
    );
    if (existed) {
      const updated = currentMeds.map((m) =>
        m.protocolMedicineId === protocolMedicineId && m.source === "edited"
          ? { ...m, ...newValues }
          : m
      );
      setValue("customMedications", updated);
    } else {
      const origin = protocolDetail?.medicines?.find(
        (m) => m.id === protocolMedicineId
      );
      if (!origin) return;
      setValue("customMedications", [
        ...currentMeds,
        {
          medicineId:
            typeof origin.medicineId === "string"
              ? Number(origin.medicineId)
              : origin.medicineId,
          medicineName: origin.medicine?.name || "",
          dosage: newValues.dosage ?? origin.dosage ?? "",
          unit: origin.medicine?.unit || "",
          price:
            typeof origin.medicine?.price === "string"
              ? Number(origin.medicine?.price)
              : origin.medicine?.price ?? 0,
          schedule: origin.duration || "MORNING",
          frequency: origin.frequency ?? "1",
          time: "",
          durationValue:
            typeof protocolDetail?.durationValue === "string"
              ? Number(protocolDetail?.durationValue)
              : protocolDetail?.durationValue ?? 1,
          durationUnit: protocolDetail?.durationUnit ?? "DAY",
          notes: newValues.notes ?? origin.notes ?? "",
          source: "edited",
          protocolMedicineId: origin.id,
        },
      ]);
    }
  };

  const handleDeleteProtocolMedicine = (protocolMedicineId: number) => {
    const currentMeds = (getValues("customMedications") ||
      []) as CustomMedicationItem[];
    // Nếu đã có bản ghi deleted cho protocolMedicineId này thì không thêm nữa
    const existed = currentMeds.find(
      (m) =>
        m.protocolMedicineId === protocolMedicineId &&
        m.source === "edited" &&
        m.deleted
    );
    if (existed) return;
    // Lấy thông tin thuốc gốc để điền đủ các trường bắt buộc
    const origin = protocolDetail?.medicines?.find(
      (m) => m.id === protocolMedicineId
    );
    setValue("customMedications", [
      ...currentMeds,
      {
        medicineId: origin
          ? typeof origin.medicineId === "string"
            ? Number(origin.medicineId)
            : origin.medicineId
          : undefined,
        medicineName: origin?.medicine?.name || "",
        dosage: origin?.dosage || "",
        unit: origin?.medicine?.unit || "",
        price: origin
          ? typeof origin.medicine?.price === "string"
            ? Number(origin.medicine?.price)
            : origin.medicine?.price ?? 0
          : undefined,
        schedule: origin?.duration || "MORNING",
        frequency: origin?.frequency ?? "1",
        time: "",
        durationValue:
          protocolDetail && typeof protocolDetail.durationValue === "string"
            ? Number(protocolDetail.durationValue)
            : protocolDetail?.durationValue ?? 1,
        durationUnit: protocolDetail?.durationUnit ?? "DAY",
        notes: origin?.notes || "",
        protocolMedicineId,
        source: "edited",
        deleted: true,
      },
    ]);
  };

  return (
    <div className={cn("w-full mx-auto")}>
      <div className={cn("bg-primary/5 px-6 py-4 border-b")}>
        <h2 className={cn("text-xl font-bold text-primary")}>
          Tạo điều trị bệnh nhân
          {doctorNameFromStorage && (
            <span className={cn("block text-base font-medium text-gray-700")}>
              bởi <strong>{doctorNameFromStorage}</strong>
            </span>
          )}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(
          async (values) => {
            setSubmitError(null);
            // Clean: tách logic chuyển đổi, gom biến
            const doctorId =
              typeof values.doctorId === "string"
                ? Number(values.doctorId)
                : values.doctorId!;
            const customMedications = Array.isArray(values.customMedications)
              ? values.customMedications
              : [];
            const endDate = values.endDate ?? "";
            try {
              const data: PatientTreatmentFormSubmit = {
                patientId: values.patientId!,
                protocolId: values.protocolId!,
                doctorId,
                customMedications,
                notes: values.notes,
                startDate: values.startDate,
                endDate,
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
        className={cn("space-y-8 px-6 py-4 rounded-xl")}
      >
        <div className={cn("mb-2")}>
          <h2 className={cn("text-lg font-semibold text-primary mb-1")}>
            Thông tin điều trị
          </h2>
          <p className={cn("text-gray-500 text-sm mb-2")}>
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
          onEditProtocolMedicine={handleEditProtocolMedicine}
          onDeleteProtocolMedicine={handleDeleteProtocolMedicine}
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
          <p
            className={cn(
              "text-red-600 text-sm mt-4 border border-red-200 rounded p-2 bg-red-50"
            )}
          >
            {submitError}
          </p>
        )}
      </form>
    </div>
  );
};
