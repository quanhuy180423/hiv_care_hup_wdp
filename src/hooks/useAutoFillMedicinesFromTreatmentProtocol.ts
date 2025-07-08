import type { CustomMedication } from "@/types/patientTreatment";
import type { TreatmentProtocolType } from "@/types/treatmentProtocol";
import { useEffect } from "react";

type AutoFillMedicinesFromTreatmentProtocol = {
  protocols: TreatmentProtocolType[];
  selectedProtocolId: string | number;
  medicineFields: CustomMedication[];
  appendMedicine: (value: CustomMedication) => void;
  removeMedicine: (index: number) => void;
};

export function useAutoFillMedicinesFromTreatmentProtocol({
  protocols,
  selectedProtocolId,
  medicineFields,
  appendMedicine,
  removeMedicine,
}: AutoFillMedicinesFromTreatmentProtocol) {
  useEffect(() => {
    if (!selectedProtocolId) return;
    const selected = protocols.find(
      (p) => String(p.id) === String(selectedProtocolId)
    );
    if (
      selected &&
      Array.isArray(selected.medicines) &&
      selected.medicines.length > 0
    ) {
      // Reset medicines to protocol's medicines
      while (medicineFields.length > 0) removeMedicine(0);
      selected.medicines.forEach((med) => {
        appendMedicine({
          id: med.medicine?.id || Date.now(),
          name: med.medicine?.name || "",
          unit: med.medicine?.unit || "",
          dose: med.medicine?.dose || med.dosage || "",
          price: med.medicine?.price || "",
          createdAt:
            med.medicine?.createdAt || new Date().toISOString().slice(0, 16),
          updatedAt:
            med.medicine?.updatedAt || new Date().toISOString().slice(0, 16),
          duration: med.duration || "",
          notes: med.notes || "",
        });
      });
    }
  }, [
    appendMedicine,
    medicineFields.length,
    protocols,
    removeMedicine,
    selectedProtocolId,
  ]);
}
