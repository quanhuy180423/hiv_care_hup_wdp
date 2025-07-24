import Breadcrumb from "@/components/doctor/Breadcrumb";
import MedicineCard from "@/components/doctor/MedicinesCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  usePatientTreatment,
  useUpdatePatientTreatment,
} from "@/hooks/usePatientTreatments";
import { cn } from "@/lib/utils";
import {
  calculateEndDate,
  hasDurationFields,
} from "@/lib/utils/patientTreatmentUtils";
import { treatmentProtocolService } from "@/services/treatmentProtocolService";
import type { Medicine } from "@/types/medicine";
import { DurationUnit, MedicationSchedule } from "@/types/medicine";
import type {
  PatientTreatmentType,
  ProtocolMedicineInfo,
} from "@/types/patientTreatment";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { z } from "zod";

import { CustomMedicineSchema } from "@/schemas/medicine";
import type { CustomMedicationItem } from "@/schemas/patientTreatment";
import { medicineService } from "@/services/medicineService";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import toast from "react-hot-toast";

export default function PatientTreatmentProtocolPage() {
  // ...existing code...
  // State để lưu index các thuốc phác đồ đã xoá (chỉ ẩn trên UI)
  const [protocolMedDeletedIdxs, setProtocolMedDeletedIdxs] = useState<
    number[]
  >([]);
  // Undo stack cho thuốc phác đồ bị xoá
  const [undoStack, setUndoStack] = useState<
    { idx: number; med: ProtocolMedicineInfo }[]
  >([]);
  // ===== State =====
  const [selectedProtocolId, setSelectedProtocolId] = useState<number | null>(
    null
  );
  const [protocolOptions, setProtocolOptions] = useState<TreatmentProtocol[]>(
    []
  );
  const [protocolLoading, setProtocolLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [customMeds, setCustomMeds] = useState<CustomMedicationItem[]>([]);
  const [editingProtocolMedIdx, setEditingProtocolMedIdx] = useState<
    number | null
  >(null);
  const [editProtocolMedForm, setEditProtocolMedForm] =
    useState<Partial<ProtocolMedicineInfo> | null>(null);
  const [editingCustomMedIdx, setEditingCustomMedIdx] = useState<number | null>(
    null
  );
  const [editCustomMedForm, setEditCustomMedForm] =
    useState<Partial<CustomMedicationItem> | null>(null);
  const [addMedOpen, setAddMedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // ===== Hooks =====
  const navigate = useNavigate();
  const { id: treatmentId } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = usePatientTreatment(
    Number(treatmentId)
  );
  const updatePatientTreatmentMutation = useUpdatePatientTreatment();

  // ===== Derived Data =====
  const patientData: PatientTreatmentType | undefined =
    data && typeof data === "object" && "data" in data
      ? (data as { data: PatientTreatmentType }).data
      : undefined;
  const patient = patientData?.patient;
  const protocol = patientData?.protocol;
  const isEnded = patientData?.status === false;

  // Đồng bộ customMeds với patientData.customMedications sau mỗi lần refetch
  useEffect(() => {
    const meds = patientData?.customMedications;
    if (Array.isArray(meds)) {
      setCustomMeds(meds);
    } else {
      setCustomMeds([]);
    }
  }, [patientData?.customMedications]);

  // ===== Form (React Hook Form) =====
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting: isAddingMed },
  } = useForm<z.infer<typeof CustomMedicineSchema>>({
    resolver: zodResolver(CustomMedicineSchema),
    defaultValues: {
      medicineName: "",
      dosage: "",
      unit: "",
      durationValue: "",
      durationUnit: undefined,
      frequency: "",
      schedule: undefined,
      notes: "",
    },
  });

  // ===== Effects =====
  // Lấy danh sách thuốc khi mount
  useEffect(() => {
    medicineService.getMedicines({ limit: 1000 }).then((res) => {
      setMedicines(res.data.data || []);
    });
  }, []);

  // Sync state khi có protocol/patientData
  useEffect(() => {
    if (protocol) setSelectedProtocolId(protocol.id);
    setStartDate(
      patientData?.startDate ? patientData.startDate.slice(0, 10) : ""
    );
    setEndDate(patientData?.endDate ? patientData.endDate.slice(0, 10) : "");
    setNotes(patientData?.notes || "");
    // Reset các state liên quan khi đổi phác đồ
    setProtocolMedDeletedIdxs([]);
    setUndoStack([]);
    setCustomMeds([]);
  }, [
    protocol,
    patientData?.startDate,
    patientData?.endDate,
    patientData?.notes,
  ]);

  // Tự động tính ngày kết thúc khi chọn protocol hoặc thay đổi ngày bắt đầu
  useEffect(() => {
    if (protocol && startDate && hasDurationFields(protocol)) {
      const autoEnd = calculateEndDate(protocol, startDate);
      setEndDate(autoEnd);
    }
  }, [protocol, startDate]);

  // Lấy danh sách phác đồ điều trị khi mount
  useEffect(() => {
    let mounted = true;
    const fetchProtocols = async () => {
      setProtocolLoading(true);
      try {
        const res = await treatmentProtocolService.getAllTreatmentProtocols({
          limit: "100000",
        });
        let options: TreatmentProtocol[] = res.data.data || [];
        // Nếu có protocol hiện tại mà không nằm trong options, thêm vào đầu danh sách
        if (protocol && !options.some((p) => p.id === protocol.id)) {
          const mapped: TreatmentProtocol = {
            id: protocol.id,
            name: protocol.name,
            description: protocol.description,
            targetDisease: protocol.targetDisease,
            medicines:
              protocol.medicines as unknown as TreatmentProtocol["medicines"],
            createdById: protocol.createdById,
            updatedById: protocol.updatedById,
            createdAt: protocol.createdAt,
            updatedAt: protocol.updatedAt,
            durationValue: undefined,
            durationUnit: undefined,
            startDate: undefined,
            endDate: undefined,
            createdBy: undefined,
            updatedBy: undefined,
          };
          options = [mapped, ...options];
        }
        if (mounted) setProtocolOptions(options);
      } finally {
        if (mounted) setProtocolLoading(false);
      }
    };
    fetchProtocols();
    return () => {
      mounted = false;
    };
  }, [protocol]);

  // ===== Handlers =====
  const handleAddMedicine = () => {
    setAddMedOpen(true);
    reset();
  };

  const onAddCustomMed = (values: z.infer<typeof CustomMedicineSchema>) => {
    setCustomMeds((prev) => [
      ...prev,
      {
        ...values,
        durationValue:
          values.durationValue === "" || values.durationValue === undefined
            ? undefined
            : Number(values.durationValue),
        medicineId: undefined, // For custom, let user pick from select, or leave undefined
      },
    ]);
    setAddMedOpen(false);
  };

  const handleSubmitForm = async () => {
    setFormError(null);
    // Validate
    if (!selectedProtocolId) {
      setFormError("Vui lòng chọn phác đồ điều trị.");
      return;
    }
    if (!startDate) {
      setFormError("Vui lòng chọn ngày bắt đầu.");
      return;
    }
    if (endDate && endDate < startDate) {
      setFormError("Ngày kết thúc không hợp lệ.");
      return;
    }
    if (!patient?.id) {
      setFormError("Không xác định được bệnh nhân.");
      return;
    }
    setIsSubmitting(true);
    try {
      const mappedCustomMeds =
        customMeds.length > 0
          ? customMeds
              .map((med) => {
                const found = medicines.find(
                  (m) => m.name === med.medicineName
                );
                if (!found) return undefined;
                // Ensure enum values are uppercased for API
                const durationUnit = med.durationUnit
                  ? String(med.durationUnit).toUpperCase()
                  : undefined;
                const schedule = med.schedule
                  ? String(med.schedule).toUpperCase()
                  : undefined;
                return {
                  medicineId: found.id,
                  medicineName: med.medicineName,
                  dosage: med.dosage,
                  unit: med.unit,
                  durationValue: med.durationValue
                    ? Number(med.durationValue)
                    : undefined,
                  durationUnit,
                  schedule,
                  frequency: med.frequency ?? "",
                  notes: med.notes,
                };
              })
              .filter(
                (med): med is NonNullable<typeof med> => med !== undefined
              )
          : [];

      const payload = {
        patientId: patient.id,
        protocolId: selectedProtocolId,
        doctorId:
          typeof patientData?.doctorId === "number" ? patientData.doctorId : 1,
        startDate,
        endDate,
        notes,
        customMedications: mappedCustomMeds,
        total: 0,
      };

      // =========================
      // CHỈ HỖ TRỢ TẠO MỚI (CREATE MODE)
      // =========================
      // Đã loại bỏ logic cập nhật (update) để đảm bảo nghiệp vụ xoá thuốc phác đồ chỉ ẩn trên UI,
      // không ảnh hưởng backend. Nếu cần update, hãy bổ sung lại logic phù hợp.
      //
      // --- CODE UPDATE ĐỂ THAM KHẢO ---
      // if (patientData?.id) {
      //   await updatePatientTreatmentMutation.mutateAsync({
      //     id: patientData.id,
      //     data: payload,
      //   });
      //   toast.success("Cập nhật hồ sơ điều trị thành công!");
      //   navigate("/doctor/patient-treatments");
      // } else {
      // Create mode
      await patientTreatmentService.create(payload, true);
      toast.success("Tạo hồ sơ điều trị thành công!");
      // Refetch lại dữ liệu để đồng bộ UI
      await refetch();
      navigate("/doctor/patient-treatments");
    } catch {
      toast.error(
        patientData?.id ? "Lỗi khi cập nhật hồ sơ." : "Lỗi khi tạo hồ sơ."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync state khi có protocol/patientData
  useEffect(() => {
    if (protocol) setSelectedProtocolId(protocol.id);
    setStartDate(
      patientData?.startDate ? patientData.startDate.slice(0, 10) : ""
    );
    setEndDate(patientData?.endDate ? patientData.endDate.slice(0, 10) : "");
    setNotes(patientData?.notes || "");
  }, [
    protocol,
    patientData?.startDate,
    patientData?.endDate,
    patientData?.notes,
  ]);

  // Lấy danh sách phác đồ điều trị khi mount
  useEffect(() => {
    let mounted = true;
    const fetchProtocols = async () => {
      setProtocolLoading(true);
      try {
        const res = await treatmentProtocolService.getAllTreatmentProtocols({
          limit: "100000",
        });
        let options: TreatmentProtocol[] = res.data.data || [];
        // Nếu có protocol hiện tại mà không nằm trong options, thêm vào đầu danh sách
        if (protocol && !options.some((p) => p.id === protocol.id)) {
          const mapped: TreatmentProtocol = {
            id: protocol.id,
            name: protocol.name,
            description: protocol.description,
            targetDisease: protocol.targetDisease,
            medicines:
              protocol.medicines as unknown as TreatmentProtocol["medicines"],
            createdById: protocol.createdById,
            updatedById: protocol.updatedById,
            createdAt: protocol.createdAt,
            updatedAt: protocol.updatedAt,
            durationValue: undefined,
            durationUnit: undefined,
            startDate: undefined,
            endDate: undefined,
            createdBy: undefined,
            updatedBy: undefined,
          };
          options = [mapped, ...options];
        }
        if (mounted) setProtocolOptions(options);
      } finally {
        if (mounted) setProtocolLoading(false);
      }
    };
    fetchProtocols();
    return () => {
      mounted = false;
    };
  }, [protocol]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-gray-500">
        Đang tải thông tin bệnh nhân...
      </div>
    );
  }
  if (isError || !patientData) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-red-500">
        Không tìm thấy thông tin bệnh nhân.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 min-h-screen">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/doctor" },
          { label: "Phác đồ điều trị", href: "/doctor/patient-treatments" },
          { label: patient?.name || "", active: true },
        ]}
        className="mb-8"
      />
      <h1 className="text-2xl font-bold mb-5 text-center text-primary">
        {protocol
          ? `Cập nhật phác đồ điều trị - ${protocol.name}`
          : `Tạo phác đồ điều trị - ${patient?.name || ""}`}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl shadow p-7 min-h-[350px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle2 className="w-14 h-14 text-gray-300" />
              </div>
              <div>
                <div className="font-semibold text-lg">
                  {patient?.name || ""}
                </div>
              </div>
            </div>
            <div className="text-sm mb-3 space-y-1">
              <div className="font-semibold mb-1">Thông tin cá nhân</div>
              <div>
                <span className="font-medium">SĐT:</span>{" "}
                <span className="text-gray-700">
                  {patient?.phoneNumber || "-"}
                </span>
              </div>
              <div>
                <span className="font-medium">Email:</span>{" "}
                <span className="text-gray-700">{patient?.email || "-"}</span>
              </div>
            </div>
            <div className="text-sm mt-5 space-y-1">
              <div className="font-semibold mb-1">Thông tin y tế</div>
              <div>
                <span className="font-medium">Phác đồ hiện tại:</span>
                <span className="text-gray-700">-</span>
              </div>
            </div>
          </div>
        </div>
        {/* Protocol Form Card */}
        <div className="bg-white rounded-2xl shadow p-7 col-span-1 md:col-span-2">
          {/* Chọn phác đồ điều trị */}
          <div className="mb-8">
            <label
              className="block text-base font-semibold mb-2"
              htmlFor="protocol-select"
            >
              Phác đồ điều trị
            </label>
            <Select
              value={selectedProtocolId ? String(selectedProtocolId) : ""}
              onValueChange={(val) =>
                setSelectedProtocolId(val ? Number(val) : null)
              }
              disabled={isEnded || protocolLoading}
            >
              <SelectTrigger
                id="protocol-select"
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <SelectValue
                  placeholder={
                    protocolLoading ? "Đang tải..." : "Chọn phác đồ điều trị"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {protocolOptions.length === 0 && !protocolLoading ? (
                  <div className="px-3 py-2 text-gray-400 text-sm">
                    Không có phác đồ
                  </div>
                ) : (
                  protocolOptions.map((option) => (
                    <SelectItem key={option.id} value={String(option.id)}>
                      {option.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {formError && !selectedProtocolId && (
              <div className="text-red-500 text-sm mt-1">{formError}</div>
            )}

            {protocol?.description && (
              <div className="text-gray-500 text-sm mt-1 italic">
                {protocol.description}
              </div>
            )}
          </div>
          {/* Danh sách thuốc trong phác đồ */}
          <div className="mb-8">
            <div className="font-semibold text-base mb-2 flex items-center gap-2">
              Thuốc trong phác đồ
              {protocol?.medicines && (
                <span className="text-xs text-gray-400">
                  (
                  {
                    protocol.medicines.filter((_, idx) => {
                      // Ẩn nếu đã xoá (theo protocolMedDeletedIdxs) hoặc đã bị sửa (có customMed thay thế và deleted: true)
                      const deletedByUI = protocolMedDeletedIdxs.includes(idx);
                      const deletedByEdit = customMeds.some(
                        (c) =>
                          c.medicineId ===
                            (protocol.medicines[idx].medicineId ??
                              protocol.medicines[idx].id) &&
                          (c as { deleted?: boolean }).deleted
                      );
                      return !deletedByUI && !deletedByEdit;
                    }).length
                  }
                  )
                </span>
              )}
            </div>
            {protocol?.medicines && protocol.medicines.length > 0 ? (
              <div className="space-y-2">
                {protocol?.medicines.map((med: ProtocolMedicineInfo, idx) => {
                  // Ẩn nếu đã xoá (theo protocolMedDeletedIdxs) hoặc đã bị sửa (có customMed thay thế và deleted: true)
                  const deletedByUI = protocolMedDeletedIdxs.includes(idx);
                  const deletedByEdit = customMeds.some(
                    (c) =>
                      c.medicineId === (med.medicineId ?? med.id) &&
                      (c as { deleted?: boolean }).deleted
                  );
                  const isEditing = editingProtocolMedIdx === idx;
                  if (deletedByUI || deletedByEdit) return null;
                  return (
                    <div
                      key={med.id ?? med.medicineId ?? idx}
                      className="relative group border rounded p-2"
                    >
                      <MedicineCard
                        med={med}
                        idx={idx}
                        isProtocol={true}
                        isCustom={false}
                      />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-80 group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (isEnded) return;
                            setEditingProtocolMedIdx(idx);
                            setEditProtocolMedForm({ ...med });
                          }}
                          title="Sửa"
                          disabled={isEnded}
                          aria-disabled={isEnded}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (isEnded) return;
                            if (
                              window.confirm(
                                "Bạn có chắc chắn muốn xoá thuốc này khỏi phác đồ?"
                              )
                            ) {
                              setProtocolMedDeletedIdxs((prev) => [
                                ...prev,
                                idx,
                              ]);
                              setUndoStack((prev) => [{ idx, med }, ...prev]);
                              toast.success("Đã xoá thuốc khỏi phác đồ!");
                            }
                          }}
                          title="Xoá"
                          disabled={isEnded}
                          aria-disabled={isEnded}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {/* Undo thuốc phác đồ đã xoá */}
                      {undoStack.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const last = undoStack[0];
                              setProtocolMedDeletedIdxs((prev) =>
                                prev.filter((i) => i !== last.idx)
                              );
                              setUndoStack((prev) => prev.slice(1));
                            }}
                          >
                            Hoàn tác xoá thuốc gần nhất
                          </Button>
                          {undoStack.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setProtocolMedDeletedIdxs([]);
                                setUndoStack([]);
                              }}
                            >
                              Hoàn tác tất cả
                            </Button>
                          )}
                        </div>
                      )}
                      {isEditing && (
                        <div className="bg-white border rounded p-4 mt-2">
                          <div className="font-semibold mb-2">
                            Sửa thuốc phác đồ
                          </div>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!editProtocolMedForm) return;
                              const existedDeletedEdit = customMeds.some(
                                (c) =>
                                  c.medicineId === (med.medicineId ?? med.id) &&
                                  (c as { deleted?: boolean }).deleted
                              );
                              const deletedCustomMedEdit = !existedDeletedEdit
                                ? {
                                    medicineId:
                                      med.medicineId ?? med.id ?? undefined,
                                    medicineName: med.medicine?.name || "",
                                    dosage: med.dosage,
                                    unit: med.medicine?.unit || "",
                                    durationValue: med.durationValue,
                                    durationUnit: med.durationUnit,
                                    schedule: med.schedule,
                                    notes: med.notes,
                                    frequency: "2",
                                    deleted: true,
                                  }
                                : undefined;
                              // Kiểm tra custom mới đã tồn tại chưa (so sánh medicineName, dosage, unit, durationValue...)
                              const editedCustomMedEdit = {
                                medicineId: undefined,
                                medicineName:
                                  editProtocolMedForm.medicine?.name ||
                                  med.medicine?.name ||
                                  "",
                                dosage:
                                  editProtocolMedForm.dosage || med.dosage,
                                unit:
                                  editProtocolMedForm.medicine?.unit ||
                                  med.medicine?.unit ||
                                  "",
                                durationValue:
                                  editProtocolMedForm.durationValue ??
                                  med.durationValue ??
                                  undefined,
                                durationUnit:
                                  editProtocolMedForm.durationUnit ||
                                  med.durationUnit ||
                                  "",
                                schedule:
                                  (editProtocolMedForm.schedule as MedicationSchedule) ||
                                  (med.schedule as MedicationSchedule),
                                notes: editProtocolMedForm.notes || med.notes,
                                frequency: "2",
                                deleted: false,
                              };
                              const existedCustomEdit = customMeds.some(
                                (c) =>
                                  !c.deleted &&
                                  c.medicineName ===
                                    editedCustomMedEdit.medicineName &&
                                  c.dosage === editedCustomMedEdit.dosage &&
                                  c.unit === editedCustomMedEdit.unit &&
                                  c.durationValue ===
                                    editedCustomMedEdit.durationValue &&
                                  c.durationUnit ===
                                    editedCustomMedEdit.durationUnit &&
                                  c.schedule === editedCustomMedEdit.schedule &&
                                  c.notes === editedCustomMedEdit.notes
                              );
                              // Cập nhật local state
                              setCustomMeds((prev) => {
                                const next = [...prev];
                                if (deletedCustomMedEdit) {
                                  const existed = next.some(
                                    (c) =>
                                      c.medicineId ===
                                        deletedCustomMedEdit.medicineId &&
                                      (c as { deleted?: boolean }).deleted
                                  );
                                  if (!existed) next.push(deletedCustomMedEdit);
                                }
                                if (!existedCustomEdit)
                                  next.push(editedCustomMedEdit);
                                return next;
                              });
                              // Đồng bộ backend qua hàm async
                              const syncCustomMeds = async () => {
                                const currentCustomMeds = Array.isArray(
                                  patientData.customMedications
                                )
                                  ? [...patientData.customMedications]
                                  : [];
                                const newCustomMedsArr = [...currentCustomMeds];
                                if (deletedCustomMedEdit) {
                                  const existed = newCustomMedsArr.some(
                                    (c) =>
                                      c.medicineId ===
                                        deletedCustomMedEdit.medicineId &&
                                      (c as { deleted?: boolean }).deleted
                                  );
                                  if (!existed)
                                    newCustomMedsArr.push(deletedCustomMedEdit);
                                }
                                if (!existedCustomEdit)
                                  newCustomMedsArr.push(editedCustomMedEdit);
                                if (patientData?.id) {
                                  await updatePatientTreatmentMutation.mutateAsync(
                                    {
                                      id: patientData.id,
                                      data: {
                                        customMedications: newCustomMedsArr,
                                      },
                                    }
                                  );
                                  if (typeof refetch === "function") {
                                    await refetch();
                                  }
                                }
                              };
                              syncCustomMeds();
                              setEditingProtocolMedIdx(null);
                              setEditProtocolMedForm(null);
                            }}
                            className="grid grid-cols-2 gap-3"
                          >
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Tên thuốc
                              </label>
                              <Input
                                value={
                                  editProtocolMedForm?.medicine?.name ||
                                  med.medicine?.name ||
                                  ""
                                }
                                onChange={(e) =>
                                  setEditProtocolMedForm((f) => ({
                                    ...f,
                                    medicine: {
                                      ...(f?.medicine ?? med.medicine),
                                      name: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Liều dùng
                              </label>
                              <Input
                                value={
                                  editProtocolMedForm?.dosage || med.dosage
                                }
                                onChange={(e) =>
                                  setEditProtocolMedForm((f) => ({
                                    ...f,
                                    dosage: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Đơn vị
                              </label>
                              <Input
                                value={
                                  editProtocolMedForm?.medicine?.unit ||
                                  med.medicine?.unit ||
                                  ""
                                }
                                onChange={(e) =>
                                  setEditProtocolMedForm((f) => ({
                                    ...f,
                                    medicine: {
                                      ...(f?.medicine ?? med.medicine),
                                      unit: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Thời gian dùng
                              </label>
                              <Input
                                value={
                                  editProtocolMedForm?.durationValue !==
                                  undefined
                                    ? String(editProtocolMedForm.durationValue)
                                    : med.durationValue !== undefined
                                    ? String(med.durationValue)
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditProtocolMedForm((f) => ({
                                    ...f,
                                    durationValue: Number(e.target.value),
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Đơn vị TG
                              </label>
                              <Select
                                value={
                                  editProtocolMedForm?.durationUnit ||
                                  med.durationUnit ||
                                  ""
                                }
                                onValueChange={(val) =>
                                  setEditProtocolMedForm((f) => ({
                                    ...f,
                                    durationUnit: val,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full border rounded px-2 text-xs h-10">
                                  <SelectValue placeholder="Chọn đơn vị" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={DurationUnit.DAY}>
                                    Ngày
                                  </SelectItem>
                                  <SelectItem value={DurationUnit.WEEK}>
                                    Tuần
                                  </SelectItem>
                                  <SelectItem value={DurationUnit.MONTH}>
                                    Tháng
                                  </SelectItem>
                                  <SelectItem value={DurationUnit.YEAR}>
                                    Năm
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {/* Tần suất (frequency) is not shown for protocol medicines, only for custom medicines */}
                            {/* <div>
                              <label className="block text-xs font-medium mb-1">
                                Thời điểm uống
                              </label>
                              <select
                                className="w-full border rounded px-2 text-xs"
                                value={
                                  editProtocolMedForm?.schedule ||
                                  med.schedule ||
                                  ""
                                }
                                onChange={(e) =>
                                  setEditProtocolMedForm((f) => ({
                                    ...f,
                                    schedule: e.target
                                      .value as MedicationSchedule,
                                  }))
                                }
                              >
                                <option value="">Chọn thời điểm</option>
                                <option value={MedicationSchedule.MORNING}>
                                  Sáng
                                </option>
                                <option value={MedicationSchedule.AFTERNOON}>
                                  Chiều
                                </option>
                                <option value={MedicationSchedule.NIGHT}>
                                  Tối
                                </option>
                              </select>
                            </div> */}
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Ghi chú
                              </label>
                              <Input
                                value={
                                  editProtocolMedForm?.notes || med.notes || ""
                                }
                                onChange={(e) =>
                                  setEditProtocolMedForm((f) => ({
                                    ...f,
                                    notes: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="col-span-2 flex gap-2 mt-2">
                              <Button type="submit" size="sm" variant="default">
                                Lưu
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProtocolMedIdx(null);
                                  setEditProtocolMedForm(null);
                                }}
                              >
                                Huỷ
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-400 italic">
                Chưa có thuốc trong phác đồ
              </div>
            )}
            <div className="flex justify-end mt-3">
              <Button
                variant="outline"
                className={cn(
                  "border-2 text-primary font-semibold px-4 py-2 bg-primary/5 hover:bg-primary/10 transition pointer-events-auto flex items-center gap-2",
                  isEnded ? "cursor-not-allowed border-dashed opacity-60" : ""
                )}
                disabled={isEnded}
                title={
                  isEnded ? "Chỉ thao tác khi hồ sơ đang điều trị" : undefined
                }
                onClick={handleAddMedicine}
                aria-disabled={isEnded}
              >
                <span className="text-lg leading-none">+</span>
                <span>Thêm thuốc bổ sung</span>
              </Button>
            </div>
            {/* Hiển thị custom medicines đã thêm */}
            {customMeds.length > 0 && (
              <div className="mt-4">
                <div className="font-semibold text-sm text-gray-700 mb-1">
                  Thuốc bổ sung:
                </div>
                <div className="space-y-2">
                  {customMeds.map((med, idx) => {
                    const isEditing = editingCustomMedIdx === idx;
                    return (
                      <div
                        key={med.medicineName + idx}
                        className="relative group border rounded p-2"
                      >
                        <MedicineCard
                          med={med}
                          idx={idx}
                          isProtocol={false}
                          isCustom={true}
                          onDelete={() =>
                            setCustomMeds((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                        />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-80 group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (isEnded) return;
                              setEditingCustomMedIdx(idx);
                              setEditCustomMedForm({ ...med });
                            }}
                            title="Sửa"
                            disabled={isEnded}
                            aria-disabled={isEnded}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (isEnded) return;
                              if (
                                window.confirm(
                                  "Bạn có chắc chắn muốn xoá thuốc bổ sung này?"
                                )
                              ) {
                                setCustomMeds((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                );
                              }
                            }}
                            title="Xoá"
                            disabled={isEnded}
                            aria-disabled={isEnded}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {isEditing && (
                          <div className="bg-white border rounded p-4 mt-2">
                            <div className="font-semibold mb-2">
                              Sửa thuốc bổ sung
                            </div>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!editCustomMedForm) return;
                                setCustomMeds((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? {
                                          ...item,
                                          medicineName:
                                            editCustomMedForm.medicineName ??
                                            med.medicineName,
                                          dosage:
                                            editCustomMedForm.dosage ??
                                            med.dosage,
                                          unit:
                                            editCustomMedForm.unit ?? med.unit,
                                          durationValue:
                                            editCustomMedForm.durationValue ??
                                            med.durationValue,
                                          durationUnit:
                                            editCustomMedForm.durationUnit ??
                                            med.durationUnit,
                                          frequency:
                                            editCustomMedForm.frequency ??
                                            med.frequency,
                                          schedule:
                                            editCustomMedForm.schedule ??
                                            med.schedule,
                                          notes:
                                            editCustomMedForm.notes ??
                                            med.notes,
                                        }
                                      : item
                                  )
                                );
                                setEditingCustomMedIdx(null);
                                setEditCustomMedForm(null);
                              }}
                              className="grid grid-cols-2 gap-3"
                            >
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Tên thuốc
                                </label>
                                <Input
                                  value={
                                    editCustomMedForm?.medicineName ??
                                    med.medicineName
                                  }
                                  onChange={(e) =>
                                    setEditCustomMedForm((f) => ({
                                      ...f,
                                      medicineName: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Liều dùng
                                </label>
                                <Input
                                  value={
                                    editCustomMedForm?.dosage ?? med.dosage
                                  }
                                  onChange={(e) =>
                                    setEditCustomMedForm((f) => ({
                                      ...f,
                                      dosage: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Đơn vị
                                </label>
                                <Input
                                  value={editCustomMedForm?.unit ?? med.unit}
                                  onChange={(e) =>
                                    setEditCustomMedForm((f) => ({
                                      ...f,
                                      unit: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Thời gian dùng
                                </label>
                                <Input
                                  value={
                                    editCustomMedForm?.durationValue !==
                                    undefined
                                      ? String(editCustomMedForm.durationValue)
                                      : med.durationValue !== undefined
                                      ? String(med.durationValue)
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditCustomMedForm((f) => ({
                                      ...f,
                                      durationValue:
                                        val === "" ? undefined : Number(val),
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Đơn vị TG
                                </label>
                                <select
                                  className="w-full border rounded px-2 text-xs"
                                  value={
                                    editCustomMedForm?.durationUnit ??
                                    med.durationUnit
                                  }
                                  onChange={(e) =>
                                    setEditCustomMedForm((f) => ({
                                      ...f,
                                      durationUnit: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">Chọn đơn vị</option>
                                  <option value={DurationUnit.DAY}>Ngày</option>
                                  <option value={DurationUnit.WEEK}>
                                    Tuần
                                  </option>
                                  <option value={DurationUnit.MONTH}>
                                    Tháng
                                  </option>
                                  <option value={DurationUnit.YEAR}>Năm</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Tần suất
                                </label>
                                <Input
                                  value={
                                    editCustomMedForm?.frequency ??
                                    med.frequency ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    setEditCustomMedForm((f) => ({
                                      ...f,
                                      frequency: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Thời điểm uống
                                </label>
                                <select
                                  className="w-full border rounded px-2 text-xs"
                                  value={
                                    editCustomMedForm?.schedule ??
                                    med.schedule ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    setEditCustomMedForm((f) => ({
                                      ...f,
                                      schedule: e.target
                                        .value as MedicationSchedule,
                                    }))
                                  }
                                >
                                  <option value="">Chọn thời điểm</option>
                                  <option value={MedicationSchedule.MORNING}>
                                    Sáng
                                  </option>
                                  <option value={MedicationSchedule.AFTERNOON}>
                                    Chiều
                                  </option>
                                  <option value={MedicationSchedule.NIGHT}>
                                    Tối
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Ghi chú
                                </label>
                                <Input
                                  value={
                                    editCustomMedForm?.notes ?? med.notes ?? ""
                                  }
                                  onChange={(e) =>
                                    setEditCustomMedForm((f) => ({
                                      ...f,
                                      notes: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="col-span-2 flex gap-2 mt-2">
                                <Button
                                  type="submit"
                                  size="sm"
                                  variant="default"
                                >
                                  Lưu
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingCustomMedIdx(null);
                                    setEditCustomMedForm(null);
                                  }}
                                >
                                  Huỷ
                                </Button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Form thêm thuốc bổ sung chỉ hiện khi addMedOpen = true */}
            {addMedOpen && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <div className="font-semibold text-base mb-2 text-primary">
                  Thêm thuốc bổ sung
                </div>
                <form
                  onSubmit={handleSubmit(onAddCustomMed)}
                  className="space-y-4 mt-2"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tên thuốc <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={
                        medicines.find((m) => m.name === watch("medicineName"))
                          ?.id
                          ? String(
                              medicines.find(
                                (m) => m.name === watch("medicineName")
                              )!.id
                            )
                          : ""
                      }
                      onValueChange={(val) => {
                        const med = medicines.find((m) => String(m.id) === val);
                        if (med) {
                          reset(
                            {
                              medicineName: med.name,
                              dosage: med.dose,
                              unit: med.unit,
                              durationValue: "",
                              durationUnit: undefined,
                              frequency: "",
                              schedule: undefined,
                              notes: "",
                            },
                            { keepErrors: true, keepDirty: true }
                          );
                        } else {
                          reset((prev) => ({ ...prev, medicineName: "" }), {
                            keepErrors: true,
                            keepDirty: true,
                          });
                        }
                      }}
                      disabled={isAddingMed}
                    >
                      <SelectTrigger className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <SelectValue placeholder="Chọn thuốc" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {medicines.map((med: Medicine) => (
                          <SelectItem key={med.id} value={String(med.id)}>
                            {med.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.medicineName && (
                      <div className="text-xs text-red-500 mt-1">
                        {errors.medicineName.message}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Liều dùng <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("dosage")}
                        placeholder="VD: 1 viên/lần"
                        disabled={isAddingMed}
                      />
                      {errors.dosage && (
                        <div className="text-xs text-red-500 mt-1">
                          {errors.dosage.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Đơn vị <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("unit")}
                        placeholder="VD: viên, ml"
                        disabled={isAddingMed}
                      />
                      {errors.unit && (
                        <div className="text-xs text-red-500 mt-1">
                          {errors.unit.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Thời gian dùng <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("durationValue")}
                        placeholder="VD: 7"
                        disabled={isAddingMed}
                        type="number"
                        min={1}
                      />
                      {errors.durationValue && (
                        <div className="text-xs text-red-500 mt-1">
                          {errors.durationValue.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Đơn vị TG <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("durationUnit")}
                        className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        disabled={isAddingMed}
                      >
                        <option value="" disabled selected>
                          Chọn đơn vị
                        </option>
                        <option value={DurationUnit.DAY}>Ngày</option>
                        <option value={DurationUnit.WEEK}>Tuần</option>
                        <option value={DurationUnit.MONTH}>Tháng</option>
                        <option value={DurationUnit.YEAR}>Năm</option>
                      </select>
                      {errors.durationUnit && (
                        <div className="text-xs text-red-500 mt-1">
                          {errors.durationUnit.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tần suất <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("frequency")}
                        placeholder="VD: 2 lần/ngày"
                        disabled={isAddingMed}
                      />
                      {errors.frequency?.message && (
                        <div className="text-xs text-red-500 mt-1">
                          {String(errors.frequency.message)}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Thời điểm uống
                      </label>
                      <select
                        {...register("schedule")}
                        className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        disabled={isAddingMed}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Chọn thời điểm
                        </option>
                        <option value={MedicationSchedule.MORNING}>Sáng</option>
                        <option value={MedicationSchedule.AFTERNOON}>
                          Chiều
                        </option>
                        <option value={MedicationSchedule.NIGHT}>Tối</option>
                      </select>
                      {errors.schedule && (
                        <div className="text-xs text-red-500 mt-1">
                          {String(errors.schedule.message)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ghi chú
                    </label>
                    <Input
                      {...register("notes")}
                      placeholder="Ghi chú thêm (tùy chọn)"
                      disabled={isAddingMed}
                    />
                    {errors.notes && (
                      <div className="text-xs text-red-500 mt-1">
                        {errors.notes.message}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="submit"
                      variant="default"
                      disabled={isAddingMed}
                      className="min-w-[120px] flex items-center justify-center gap-2 text-base font-semibold"
                    >
                      {isAddingMed ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                          Đang thêm...
                        </>
                      ) : (
                        <>
                          <span className="text-lg leading-none">+</span>
                          Thêm thuốc
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
          {/* Ngày bắt đầu và kết thúc */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-base font-semibold mb-2"
                htmlFor="startDate"
              >
                * Ngày bắt đầu
              </label>
              <Input
                id="startDate"
                type="date"
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isEnded}
                placeholder="dd/mm/yyyy"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                className="block text-base font-semibold mb-2"
                htmlFor="endDate"
              >
                Ngày kết thúc (tùy chọn)
              </label>
              <Input
                id="endDate"
                type="date"
                className="w-full h-12 border border-gray-300 rounded-lg px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isEnded}
                placeholder="dd/mm/yyyy"
                min={startDate || undefined}
              />
            </div>
          </div>
          {/* Ghi chú */}
          <div className="mb-6">
            <label
              className="block text-base font-semibold mb-2"
              htmlFor="notes"
            >
              Ghi chú
            </label>
            <Textarea
              id="notes"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={3}
              placeholder="Nhập ghi chú về phác đồ điều trị"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              disabled={isEnded}
              aria-describedby="notesHelp"
            />
            <div id="notesHelp" className="text-xs text-gray-400 mt-1">
              Tối đa 500 ký tự
            </div>
          </div>
          {/* Nút lưu */}
          <div className="flex flex-col items-end gap-2">
            {formError && (
              <div className="text-red-500 text-sm mb-1">{formError}</div>
            )}
            <Button
              disabled={(isEnded && !!protocol) || isSubmitting}
              variant="outline"
              className="min-w-[200px] text-base font-semibold"
              title={
                isEnded && !!protocol
                  ? "Chỉ thao tác khi hồ sơ đang điều trị"
                  : undefined
              }
              aria-disabled={(isEnded && !!protocol) || isSubmitting}
              onClick={handleSubmitForm}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-primary rounded-full"></span>
                  Đang lưu...
                </span>
              ) : (
                <>
                  ✓{" "}
                  {protocol
                    ? "Cập nhật phác đồ điều trị"
                    : "Tạo phác đồ điều trị"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
