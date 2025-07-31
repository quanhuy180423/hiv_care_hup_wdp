import Breadcrumb from "@/components/doctor/Breadcrumb";
import ProtocolFormCard from "@/components/doctor/ProtocolFormCard";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  usePatientTreatment,
  useUpdatePatientTreatment,
} from "@/hooks/usePatientTreatments";
import { useTestResultsByPatientTreatmentId } from "@/hooks/useTestResult";
import {
  calculateEndDate,
  hasDurationFields,
} from "@/lib/utils/patientTreatmentUtils";
import { CustomMedicineSchema } from "@/schemas/medicine";
import type { CustomMedicationItem } from "@/schemas/patientTreatment";
import { medicineService } from "@/services/medicineService";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import { treatmentProtocolService } from "@/services/treatmentProtocolService";
import type { Medicine } from "@/types/medicine";
import { DurationUnit, MedicationSchedule } from "@/types/medicine";
import type {
  PatientTreatmentType,
  ProtocolMedicineInfo,
} from "@/types/patientTreatment";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import TestResultDetail from "../../testResult/components/TestResultDetail";

export default function ConsultationPage() {
  const [protocolMedDeletedIdxs, setProtocolMedDeletedIdxs] = useState<
    number[]
  >([]);
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
  const [selectedProtocol, setSelectedProtocol] =
    useState<TreatmentProtocol | null>(null);
  const [protocolLoading, setProtocolLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [customMeds, setCustomMeds] = useState<CustomMedicationItem[]>([]);
  const [editingProtocolMedIdx, setEditingProtocolMedIdx] = useState<
    number | null
  >(null);
  const [editingCustomMedIdx, setEditingCustomMedIdx] = useState<number | null>(
    null
  );
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
  const { data: testResultsData } = useTestResultsByPatientTreatmentId(
    Number(treatmentId)
  );
  console.log("Test Results Data:", testResultsData);
  // ===== Derived Data =====
  const patientData: PatientTreatmentType | undefined =
    data && typeof data === "object" && "data" in data
      ? (data as { data: PatientTreatmentType }).data
      : undefined;
  const patient = patientData?.patient;

  // Use protocol from patientData if available, otherwise use selectedProtocol
  const protocol: TreatmentProtocol | null = selectedProtocol;
  const isEnded = patientData?.status === false;

  // Sync customMeds with patientData.customMedications after each refetch
  useEffect(() => {
    setCustomMeds(
      Array.isArray(patientData?.customMedications)
        ? patientData.customMedications
        : []
    );
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
      durationUnit: DurationUnit.DAY,
      quantity: 1,
      frequency: "",
      schedule: MedicationSchedule.MORNING,
      notes: "",
      unitPrice: undefined,
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
    if (patientData?.protocol) {
      setSelectedProtocolId(patientData.protocol.id);
      // Map protocol from patientData to TreatmentProtocol shape
      const mapScheduleToEnum = (schedule: string): MedicationSchedule => {
        switch (schedule?.toUpperCase()) {
          case "MORNING":
            return MedicationSchedule.MORNING;
          case "AFTERNOON":
            return MedicationSchedule.AFTERNOON;
          case "NIGHT":
            return MedicationSchedule.NIGHT;
          default:
            return MedicationSchedule.MORNING;
        }
      };

      const initialProto: TreatmentProtocol | null = patientData?.protocol
        ? {
            id: patientData.protocol.id,
            name: patientData.protocol.name,
            description: patientData.protocol.description,
            targetDisease: patientData.protocol.targetDisease,
            createdById: patientData.protocol.createdById,
            updatedById: patientData.protocol.updatedById,
            createdAt: patientData.protocol.createdAt,
            updatedAt: patientData.protocol.updatedAt,
            medicines: Array.isArray(patientData.protocol.medicines)
              ? patientData.protocol.medicines.map((pi) => ({
                  id: pi.id,
                  medicineId: pi.medicineId,
                  dosage: pi.dosage,
                  duration: mapScheduleToEnum(pi.schedule),
                  notes: pi.notes,
                  frequency: undefined,
                  medicine: pi.medicine
                    ? {
                        id: pi.medicine.id,
                        name: pi.medicine.name,
                        unit:
                          "unit" in pi.medicine &&
                          typeof pi.medicine.unit === "string"
                            ? pi.medicine.unit
                            : "",
                        dose:
                          "dose" in pi.medicine &&
                          typeof pi.medicine.dose === "string"
                            ? pi.medicine.dose
                            : "",
                        price:
                          typeof pi.medicine.price === "string"
                            ? Number(pi.medicine.price)
                            : typeof pi.medicine.price === "number"
                            ? pi.medicine.price
                            : 0,
                        createdAt: pi.medicine.createdAt,
                        updatedAt: pi.medicine.updatedAt,
                      }
                    : undefined,
                  createdAt: pi.createdAt,
                  updatedAt: pi.updatedAt,
                }))
              : [],
            ...(typeof (patientData.protocol as { durationValue?: number })
              .durationValue !== "undefined" && {
              durationValue: (
                patientData.protocol as { durationValue?: number }
              ).durationValue,
            }),
            ...(typeof (patientData.protocol as { durationUnit?: string })
              .durationUnit !== "undefined" && {
              durationUnit: (patientData.protocol as { durationUnit?: string })
                .durationUnit,
            }),
            ...(typeof (patientData.protocol as { startDate?: string })
              .startDate !== "undefined" && {
              startDate: (patientData.protocol as { startDate?: string })
                .startDate,
            }),
            ...(typeof (patientData.protocol as { endDate?: string })
              .endDate !== "undefined" && {
              endDate: (patientData.protocol as { endDate?: string }).endDate,
            }),
            createdBy: undefined,
            updatedBy: undefined,
          }
        : null;
      setSelectedProtocol(initialProto);
    } else {
      setSelectedProtocol(null);
    }
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
    patientData?.protocol,
    patientData?.startDate,
    patientData?.endDate,
    patientData?.notes,
  ]);

  // Tự động tính ngày kết thúc khi chọn protocol hoặc thay đổi ngày bắt đầu
  useEffect(() => {
    if (protocol && startDate && hasDurationFields(protocol)) {
      const validUnits = ["DAY", "WEEK", "MONTH", "YEAR"];
      if (validUnits.includes(String(protocol.durationUnit))) {
        setEndDate(calculateEndDate(protocol, startDate));
      } else {
        setEndDate("");
      }
    } else {
      setEndDate("");
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

  /**
   * Tính tổng giá thuốc dựa trên quantity (số lượng), không nhân với liều lượng (dosage).
   * Nếu có quantity, trả về unitPrice * quantity. Nếu không, chỉ trả về unitPrice.
   */
  function calcUnitPrice(
    med: Partial<
      CustomMedicationItem & {
        price?: number;
        unitPrice?: number;
        quantity?: number;
      }
    >,
    found?: Medicine
  ): number {
    let unitPrice = 0;
    if (typeof med.unitPrice === "number" && !isNaN(med.unitPrice)) {
      unitPrice = med.unitPrice;
    } else if (typeof med.price === "number" && !isNaN(med.price)) {
      unitPrice = med.price;
    } else if (
      found &&
      typeof found.price === "number" &&
      !isNaN(found.price)
    ) {
      unitPrice = found.price;
    }
    const quantity =
      typeof med.quantity === "number" && !isNaN(med.quantity)
        ? med.quantity
        : 1;
    return unitPrice * quantity;
  }

  const handleSubmitForm = async () => {
    setFormError(null);

    // Validate required fields
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
      // Map custom medicines to API format
      const mappedCustomMeds = customMeds.length
        ? customMeds
            .map((med) => {
              const found = medicines.find((m) => m.name === med.medicineName);
              if (!found) return undefined;
              const unitPrice = calcUnitPrice(med, found);
              return {
                medicineId: found.id,
                medicineName: med.medicineName,
                dosage: med.dosage,
                unit: med.unit,
                durationValue: med.durationValue
                  ? Number(med.durationValue)
                  : undefined,
                durationUnit: med.durationUnit
                  ? String(med.durationUnit).toUpperCase()
                  : undefined,
                schedule: med.schedule
                  ? String(med.schedule).toUpperCase()
                  : undefined,
                frequency:
                  typeof med.frequency === "string" &&
                  med.frequency.trim() !== ""
                    ? med.frequency
                    : "1 lần/ngày",
                notes: med.notes,
                price:
                  typeof found.price === "number"
                    ? found.price
                    : Number(found.price) || 0,
                unitPrice,
                quantity:
                  typeof med.quantity === "number" && !isNaN(med.quantity)
                    ? med.quantity
                    : 1,
              };
            })
            .filter((med): med is NonNullable<typeof med> => med !== undefined)
        : [];

      const payload = {
        patientId: patient.id,
        protocolId: selectedProtocolId,
        doctorId:
          typeof patientData?.doctorId === "number" ? patientData.doctorId : 1,
        startDate,
        endDate: endDate || startDate, // ensure endDate is always present
        notes,
        customMedications: mappedCustomMeds,
        total: 0,
      };

      // Update or create patient treatment
      if (patientData?.id && protocol) {
        console.log("Updated patient treatment:", payload);
        await updatePatientTreatmentMutation.mutateAsync({
          id: patientData.id,
          data: payload,
        });
        toast.success("Cập nhật hồ sơ điều trị thành công!");
        navigate("/doctor/patient-treatments");
      } else {
        console.log("Created new patient treatment:", payload);
        await patientTreatmentService.create(payload, true);
        toast.success("Tạo hồ sơ điều trị thành công!");
        await refetch(); // Sync UI
        navigate("/doctor/patient-treatments");
      }
    } catch {
      toast.error(
        patientData?.id && protocol
          ? "Lỗi khi cập nhật hồ sơ."
          : "Lỗi khi tạo hồ sơ."
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
        <div className="bg-white rounded-2xl shadow p-8 min-h-[350px] flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <UserCircle2 className="w-16 h-16 text-gray-300" />
              </div>
              <div className="font-bold text-lg text-primary text-center">
                {patient?.name || ""}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="text-sm">
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
              <div className="text-sm">
                <div className="font-semibold mb-1">Thông tin y tế</div>
                <div>
                  <span className="font-medium">Phác đồ hiện tại:</span>
                  <span className="text-gray-700">
                    {patientData?.protocol?.name || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mt-2 mb-3">
              Kết quả xét nghiệm
            </h3>
            {testResultsData && testResultsData.length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {testResultsData.map((result) => (
                  <AccordionItem key={result.id} value={`test-${result.id}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        <span className="font-medium text-primary">
                          {result.test?.name || "Xét nghiệm không rõ tên"}
                        </span>
                        <span className="text-xs text-gray-500 md:ml-auto">
                          {new Date(result.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span
                          className={[
                            "inline-block text-xs px-2 py-1 rounded-full font-semibold ml-2",
                            result.status === "Completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : result.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : "bg-gray-200 text-gray-600 border border-gray-300",
                          ].join(" ")}
                        >
                          {result.status || "-"}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        <TestResultDetail TestResult={result} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Chưa có kết quả xét nghiệm nào
              </div>
            )}
          </div>
        </div>
        {/* Protocol Form Card */}
        <ProtocolFormCard
          protocol={protocol}
          protocolOptions={protocolOptions}
          protocolLoading={protocolLoading}
          selectedProtocolId={selectedProtocolId}
          setSelectedProtocolId={setSelectedProtocolId}
          setSelectedProtocol={setSelectedProtocol}
          formError={formError}
          medicines={medicines}
          protocolMedDeletedIdxs={protocolMedDeletedIdxs}
          setProtocolMedDeletedIdxs={setProtocolMedDeletedIdxs}
          undoStack={undoStack}
          setUndoStack={setUndoStack}
          customMeds={customMeds}
          setCustomMeds={setCustomMeds}
          editingProtocolMedIdx={editingProtocolMedIdx}
          setEditingProtocolMedIdx={setEditingProtocolMedIdx}
          editingCustomMedIdx={editingCustomMedIdx}
          setEditingCustomMedIdx={setEditingCustomMedIdx}
          addMedOpen={addMedOpen}
          setAddMedOpen={setAddMedOpen}
          isEnded={isEnded}
          isAddingMed={isAddingMed}
          errors={errors}
          register={register}
          watch={watch}
          reset={reset}
          handleSubmit={handleSubmit}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          notes={notes}
          setNotes={setNotes}
          isSubmitting={isSubmitting}
          handleSubmitForm={handleSubmitForm}
          toast={toast}
        />
      </div>
    </div>
  );
}
