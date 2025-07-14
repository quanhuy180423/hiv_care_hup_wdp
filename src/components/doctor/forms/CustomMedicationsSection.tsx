import type { PatientTreatmentFormValues } from "@/schemas/patientTreatment";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import type {
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

import AsyncComboBox from "@/components/ui/async-combo-box";
import type { Medicine } from "@/types/medicine";

interface CustomMedicationsSectionProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  customMedFields: UseFieldArrayReturn<
    PatientTreatmentFormValues,
    "customMedications.additionalMeds"
  >["fields"];
  appendCustomMed: (v: {
    name: string;
    dosage: string;
    medicineId?: number;
    price?: number;
  }) => void;
  removeCustomMed: (idx: number) => void;
  register: UseFormRegister<PatientTreatmentFormValues>;
  errors: FieldErrors<PatientTreatmentFormValues>;
  medicines: Medicine[];
}

const CustomMedicationsSection: React.FC<CustomMedicationsSectionProps> = ({
  open,
  setOpen,
  customMedFields,
  appendCustomMed,
  removeCustomMed,
  register,
  errors,
  medicines,
}) => {
  const handleSearchMedicine = React.useCallback(
    async (query: string) => {
      if (!query) {
        return medicines.map((med) => ({
          id: med.id,
          name: `${med.name} (${med.unit}) - ${med.price?.toLocaleString()}đ`,
        }));
      }
      return medicines
        .filter((med) => med.name.toLowerCase().includes(query.toLowerCase()))
        .map((med) => ({
          id: med.id,
          name: `${med.name} (${med.unit}) - ${med.price?.toLocaleString()}đ`,
        }));
    },
    [medicines]
  );

  return (
    <div className="bg-white p-0 rounded-lg border shadow-sm mb-2">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg transition"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>Thuốc bổ sung (Custom)</span>
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2">
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                appendCustomMed({
                  name: "",
                  dosage: "",
                  medicineId: undefined,
                  price: undefined,
                })
              }
            >
              + Thêm
            </Button>
          </div>
          <div className="space-y-2">
            {customMedFields.length === 0 && (
              <div className="text-gray-400 text-sm italic">
                Chưa có thuốc bổ sung nào.
              </div>
            )}
            {customMedFields.map((f, idx) => (
              <div key={f.id} className="flex gap-2 items-center">
                <AsyncComboBox
                  value={f.medicineId || ""}
                  onChange={(val) => {
                    const event = {
                      target: {
                        value: val,
                        name: `customMedications.additionalMeds.${idx}.medicineId`,
                      },
                    };
                    register(
                      `customMedications.additionalMeds.${idx}.medicineId`
                    ).onChange(event);
                  }}
                  onSearch={handleSearchMedicine}
                  placeholder="Chọn thuốc"
                />
                <Input
                  {...register(
                    `customMedications.additionalMeds.${idx}.dosage` as const
                  )}
                  placeholder="Liều/Hàm lượng"
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeCustomMed(idx)}
                  type="button"
                  title="Xóa thuốc"
                >
                  -
                </Button>
              </div>
            ))}
            {errors.customMedications?.additionalMeds && (
              <p className="text-red-500 text-sm">
                {errors.customMedications.additionalMeds.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMedicationsSection;
