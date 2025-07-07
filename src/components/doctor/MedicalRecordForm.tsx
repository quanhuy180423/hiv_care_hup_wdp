import { patientTreatmentSchema } from "@/schemas/patientTreatment";
import type { PatientTreatmentFormValues } from "@/types/patientTreatment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useTreatmentProtocols } from "@/hooks/useTreatmentProtocols";
import { useEffect, useMemo } from "react";

export interface PatientTreatmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PatientTreatmentFormValues) => void;
}

export const PatientTreatmentForm = ({
  open,
  onClose,
  onSubmit,
}: PatientTreatmentFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PatientTreatmentFormValues>({
    resolver: zodResolver(patientTreatmentSchema),
    defaultValues: {
      medicines: [{ name: "", dosage: "" }],
      tests: [],
    },
  });
  const {
    fields: medicineFields,
    append: appendMedicine,
    remove: removeMedicine,
  } = useFieldArray({
    control,
    name: "medicines",
  });
  const {
    fields: testFields,
    append: appendTest,
    remove: removeTest,
  } = useFieldArray({
    control,
    name: "tests",
  });
  // Lấy token từ localStorage hoặc context
  const token = useMemo(() => localStorage.getItem("accessToken") || "", []);
  const { data: protocolsData, isLoading } = useTreatmentProtocols({
    page: 1,
    limit: 20,
    search: "",
    targetDisease: "HIV",
    token,
    enabled: open && !!token,
  });
  const protocols = useMemo(
    () => (Array.isArray(protocolsData) ? protocolsData : []),
    [protocolsData]
  );

  const selectedProtocol = control._formValues.treatmentProtocol;
  const selectedProtocolObj = protocols.find((p) => p.id === selectedProtocol);

  useEffect(() => {
    if (!protocols.length) {
      control._formValues.treatmentProtocol = "";
    }
  }, [protocols, control]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle>Tạo điều trị bệnh nhân</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <label className="block font-medium mb-1">Chẩn đoán</label>
            <Input {...register("diagnosis")} placeholder="Nhập chẩn đoán" />
            {errors.diagnosis && (
              <div className="text-red-500 text-sm mt-1">
                {errors.diagnosis.message}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Phác đồ điều trị</label>
            <select
              {...register("treatmentProtocol")}
              className="w-full border rounded px-2 py-1"
              disabled={isLoading}
            >
              <option value="">Chọn phác đồ</option>
              {protocols.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {selectedProtocolObj && (
              <div className="text-xs text-gray-600 mt-1 border-l-2 border-blue-400 pl-2 bg-blue-50">
                {selectedProtocolObj.description}
              </div>
            )}
            {errors.treatmentProtocol && (
              <div className="text-red-500 text-sm mt-1">
                {errors.treatmentProtocol.message}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Thuốc</label>
            {medicineFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <Input
                  {...register(`medicines.${idx}.name`)}
                  placeholder="Tên thuốc"
                />
                <Input
                  {...register(`medicines.${idx}.dosage`)}
                  placeholder="Liều dùng"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeMedicine(idx)}
                >
                  -
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendMedicine({ name: "", dosage: "" })}
            >
              + Thêm thuốc
            </Button>
            {errors.medicines && (
              <div className="text-red-500 text-sm mt-1">
                {Array.isArray(errors.medicines)
                  ? errors.medicines.map(
                      (err, i) =>
                        err?.message && <div key={i}>{err.message}</div>
                    )
                  : (errors.medicines as { message?: string })?.message}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Xét nghiệm</label>
            {testFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <Input
                  {...register(`tests.${idx}.name`)}
                  placeholder="Tên xét nghiệm"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeTest(idx)}
                >
                  -
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendTest({ name: "" })}
            >
              + Thêm xét nghiệm
            </Button>
          </div>
          <div>
            <label className="block font-medium mb-1">Ghi chú</label>
            <Textarea
              {...register("notes")}
              placeholder="Ghi chú thêm (nếu có)"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Tạo điều trị
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export type { PatientTreatmentFormValues };
