import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  AutoEndSubmitSection,
  CustomMedicationsSection,
  DatesTotalSection,
  ExistingTreatmentDialog,
  NotesSection,
  PatientProtocolSection,
  ProtocolMedicinesSection,
} from "./forms";
import { patientTreatmentSchema } from "@/schemas/patientTreatment";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import { treatmentProtocolService } from "@/services/treatmentProtocolService";
import type { PatientTreatmentFormSubmit } from "@/types/patientTreatment";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import type { ErrorResponse } from "@/types/common";
import type { Medicine } from "@/types/medicine";

interface PatientTreatmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: PatientTreatmentFormSubmit,
    autoEndExisting: boolean
  ) => void;
}

export const PatientTreatmentForm: React.FC<PatientTreatmentFormProps> = ({
  open,
  onClose,
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
  // Accordion state
  const [openProtocol, setOpenProtocol] = useState(true);
  const [openCustomMed, setOpenCustomMed] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<import("@/schemas/patientTreatment").PatientTreatmentFormValues>({
    resolver: zodResolver(patientTreatmentSchema),
    defaultValues: {
      patientId: undefined,
      protocolId: undefined,
      doctorId: undefined,
      customMedications: { additionalMeds: [] },
      notes: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: undefined,
      total: 0,
    },
    mode: "onChange",
  });

  // ===== Callbacks =====
  const handleCheckExisting = useCallback(async (patientId: number) => {
    try {
      const res = await patientTreatmentService.getByPatient(
        String(patientId),
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
  }, []);

  const searchProtocols = useCallback(async (query: string) => {
    const res = await treatmentProtocolService.getAllTreatmentProtocols({
      search: query,
      limit: "100000",
    });
    const list: TreatmentProtocol[] = res.data.data || [];
    return list.map((p) => ({ id: p.id, name: p.name }));
  }, []);

  const searchPatients = useCallback(async (query: string) => {
    if (query.length < 1) return [];
    const res = await patientTreatmentService.search({
      search: query,
      limit: 10,
    });
    return res.data.data.map((p) => ({
      id: p.patientId,
      name: p.patient?.name ?? "",
    }));
  }, []);

  // ===== Doctor info =====
  let doctorNameFromStorage: string | undefined;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      doctorNameFromStorage = user.name || user.doctorName;
    }
  } catch {
    toast.error("Không thể lấy thông tin bác sĩ.");
  }

  const watchedProtocolId = watch("protocolId");
  const watchedPatientId = watch("patientId");

  // ===== Effects =====

  // Lấy thông tin phác đồ khi watchedProtocolId thay đổi
  useEffect(() => {
    if (typeof watchedProtocolId === "number") {
      treatmentProtocolService
        .getTreatmentProtocolById(watchedProtocolId)
        .then((res) => {
          setProtocolDetail({
            ...res.data,
            medicines: Array.isArray(res.data?.medicines)
              ? res.data.medicines
              : [],
          });
        })
        .catch(() => setProtocolDetail(null));
    } else {
      setProtocolDetail(null);
    }
  }, [watchedProtocolId]);

  // Lấy danh sách thuốc khi mount
  useEffect(() => {
    import("@/services/medicineService").then(({ medicineService }) => {
      medicineService
        .getMedicines({ limit: 10000 })
        .then((res) => setMedicines(res.data.data || []))
        .catch(() => setMedicines([]));
    });
  }, []);

  // Watch patientId -> check existing
  useEffect(() => {
    if (typeof watchedPatientId === "number") {
      handleCheckExisting(watchedPatientId);
    }
  }, [watchedPatientId, handleCheckExisting]);

  // ===== Form logic =====
  const {
    fields: customMedFields,
    append: appendCustomMed,
    remove: removeCustomMed,
  } = useFieldArray({ control, name: "customMedications.additionalMeds" });

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg md:max-w-2xl bg-white rounded-xl shadow-xl p-0 overflow-hidden">
          <DialogHeader className="bg-primary/5 px-6 py-4 border-b">
            <DialogTitle className="text-xl font-bold text-primary">
              Tạo điều trị bệnh nhân
              {doctorNameFromStorage && (
                <span className="block text-base font-medium text-gray-700">
                  bởi <strong>{doctorNameFromStorage}</strong>
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(async (values) => {
              setSubmitError(null);
              try {
                const data: PatientTreatmentFormSubmit = {
                  patientId: values.patientId!,
                  protocolId: values.protocolId!,
                  doctorId: values.doctorId!,
                  customMedications: values.customMedications,
                  notes: values.notes,
                  startDate: values.startDate,
                  endDate: values.endDate ?? "",
                  total: values.total!,
                };
                onSubmit(data, autoEndExisting);
              } catch (err) {
                const be = err as ErrorResponse;
                if (be.response?.status === 409) {
                  const msg =
                    typeof be.response.data?.message === "object"
                      ? be.response.data.message.message
                      : be.response.data?.message || "Xung đột dữ liệu.";
                  setSubmitError(msg || "Đã xảy ra lỗi. Vui lòng thử lại.");
                  toast.error(msg || "Đã xảy ra lỗi. Vui lòng thử lại.");
                } else {
                  setSubmitError("Đã xảy ra lỗi. Vui lòng thử lại.");
                  toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
                }
              }
            })}
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

            {/* Protocol Medicines section */}
            {protocolDetail && (
              <ProtocolMedicinesSection
                open={openProtocol}
                setOpen={setOpenProtocol}
                protocolDetail={protocolDetail}
              />
            )}

            {/* Custom Medications section */}
            <CustomMedicationsSection
              open={openCustomMed}
              setOpen={setOpenCustomMed}
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
        </DialogContent>
      </Dialog>
    </>
  );
};
