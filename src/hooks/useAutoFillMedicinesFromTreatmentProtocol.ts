import type { CustomMedications } from "@/types/patientTreatment";
import type { TreatmentProtocolType } from "@/types/treatmentProtocol";
import { useEffect } from "react";

type AutoFillMedicinesFromTreatmentProtocol = {
  protocols: TreatmentProtocolType[];
  selectedProtocolId: string | number;
  replaceMedicine: (value: CustomMedications[]) => void;
};

export function useAutoFillMedicinesFromTreatmentProtocol({
  protocols,
  selectedProtocolId,
  replaceMedicine,
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
      // Fill medicines using replace
      const additionalMeds = selected.medicines.map((med) => ({
        id: med.medicine?.id ?? Date.now(),
        name: med.medicine?.name ?? "",
        unit: med.medicine?.unit ?? "",
        dose: med.medicine?.dose ?? med.dosage ?? "",
        price: med.medicine?.price ?? "",
        createdAt:
          med.medicine?.createdAt ?? new Date().toISOString().slice(0, 16),
        updatedAt:
          med.medicine?.updatedAt ?? new Date().toISOString().slice(0, 16),
        duration: med.duration ?? "",
        notes: med.notes ?? "",
      }));
      replaceMedicine([{ additionalMeds }]);
    }
  }, [protocols, replaceMedicine, selectedProtocolId]);
}
