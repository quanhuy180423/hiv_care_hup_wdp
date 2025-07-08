import { useAutoFillMedicinesFromTreatmentProtocol } from "@/hooks/useAutoFillMedicinesFromTreatmentProtocol";
import { useTreatmentProtocols } from "@/hooks/useTreatmentProtocols";
import { patientTreatmentSchema } from "@/schemas/patientTreatment";
import type {
  CustomMedication,
  PatientTreatmentFormValues,
} from "@/types/patientTreatment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export interface PatientTreatmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PatientTreatmentFormValues) => void;
}

const defaultMedicine = (): CustomMedication => ({
  id: Date.now(),
  name: "",
  unit: "",
  dose: "",
  price: "",
  createdAt: new Date().toISOString().slice(0, 16),
  updatedAt: new Date().toISOString().slice(0, 16),
  duration: "",
  notes: "",
});

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
    reset,
  } = useForm<PatientTreatmentFormValues>({
    resolver: zodResolver(patientTreatmentSchema),
    defaultValues: {
      medicines: [defaultMedicine()],
      tests: [],
    },
    mode: "onChange",
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

  const token = useMemo(() => localStorage.getItem("accessToken") || "", []);
  const { data: protocolsData, isLoading: isLoadingProtocols } =
    useTreatmentProtocols({
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

  const selectedProtocolId = useWatch({ control, name: "treatmentProtocol" });
  const selectedProtocolObj = protocols.find(
    (p) => String(p.id) === String(selectedProtocolId)
  );

  useEffect(() => {
    if (!protocols.length) {
      reset((prev) => ({ ...prev, treatmentProtocol: "" }));
    }
  }, [protocols, reset]);

  useAutoFillMedicinesFromTreatmentProtocol({
    protocols,
    selectedProtocolId,
    medicineFields,
    appendMedicine,
    removeMedicine,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle>Tạo điều trị bệnh nhân</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) =>
            onSubmit(values as unknown as PatientTreatmentFormValues)
          )}
          className="space-y-4 mt-2"
        >
          <div>
            <label htmlFor="diagnosis" className="block font-medium mb-1">
              Chẩn đoán
            </label>
            <Input
              id="diagnosis"
              {...register("diagnosis")}
              placeholder="Nhập chẩn đoán"
              className="text-gray-900 placeholder-gray-400"
              aria-invalid={!!errors.diagnosis}
            />
            {errors.diagnosis && (
              <div className="text-red-500 text-sm mt-1">
                {errors.diagnosis.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="treatmentProtocol"
              className="block font-medium mb-1"
            >
              Phác đồ điều trị
            </label>
            <select
              id="treatmentProtocol"
              {...register("treatmentProtocol")}
              className="w-full border rounded px-2 py-1 text-gray-900"
              disabled={isLoadingProtocols}
              aria-invalid={!!errors.treatmentProtocol}
            >
              <option value="" className="text-gray-400">
                {isLoadingProtocols ? "Đang tải..." : "Chọn phác đồ"}
              </option>
              {protocols.map((p) => (
                <option key={p.id} value={p.id} className="text-gray-900">
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
            {medicineFields.length === 0 && (
              <div className="text-gray-500 text-sm mb-2">
                Chưa có thuốc nào.
              </div>
            )}
            {medicineFields.map((field, idx) => (
              <div
                key={field.id}
                className="flex flex-wrap gap-2 mb-2 border-b pb-2 last:border-b-0 last:pb-0"
              >
                <Input
                  {...register(`medicines.${idx}.name`)}
                  placeholder="Tên thuốc"
                  className="text-gray-900 placeholder-gray-400 flex-1 min-w-[120px]"
                  aria-label="Tên thuốc"
                />
                <Input
                  {...register(`medicines.${idx}.dose`)}
                  placeholder="Liều dùng/Hàm lượng"
                  className="text-gray-900 placeholder-gray-400 flex-1 min-w-[90px]"
                  aria-label="Liều dùng/Hàm lượng"
                />
                <Input
                  {...register(`medicines.${idx}.unit`)}
                  placeholder="Đơn vị"
                  className="text-gray-900 placeholder-gray-400 flex-1 min-w-[80px]"
                  aria-label="Đơn vị"
                />
                <Input
                  {...register(`medicines.${idx}.price`)}
                  placeholder="Giá"
                  type="number"
                  className="text-gray-900 placeholder-gray-400 flex-1 min-w-[80px]"
                  aria-label="Giá"
                />
                <Input
                  {...register(`medicines.${idx}.createdAt`)}
                  placeholder="Ngày tạo"
                  type="datetime-local"
                  className="text-gray-900 placeholder-gray-400 flex-1 min-w-[140px]"
                  aria-label="Ngày tạo"
                />
                <Input
                  {...register(`medicines.${idx}.updatedAt`)}
                  placeholder="Ngày cập nhật"
                  type="datetime-local"
                  className="text-gray-900 placeholder-gray-400 flex-1 min-w-[140px]"
                  aria-label="Ngày cập nhật"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeMedicine(idx)}
                  aria-label="Xóa thuốc"
                >
                  -
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendMedicine(defaultMedicine())}
              className="mt-1"
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
            {testFields.length === 0 && (
              <div className="text-gray-500 text-sm mb-2">
                Chưa có xét nghiệm nào.
              </div>
            )}
            {testFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <Input
                  {...register(`tests.${idx}.name`)}
                  placeholder="Tên xét nghiệm"
                  className="text-gray-900 placeholder-gray-400"
                  aria-label="Tên xét nghiệm"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeTest(idx)}
                  aria-label="Xóa xét nghiệm"
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
              className="mt-1"
            >
              + Thêm xét nghiệm
            </Button>
          </div>
          <div>
            <label htmlFor="notes" className="block font-medium mb-1">
              Ghi chú
            </label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Ghi chú thêm (nếu có)"
              className="text-gray-900 placeholder-gray-400"
              aria-invalid={!!errors.notes}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo điều trị"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export type { PatientTreatmentFormValues };
