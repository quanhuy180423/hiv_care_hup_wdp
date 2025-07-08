export type MedicationSchedule = "MORNING" | "AFTERNOON" | "NIGHT";

export type ProtocolMedicine = {
  id: number;
  medicineId: number;
  dosage: string;
  duration: MedicationSchedule;
  notes?: string | null;
  medicine: {
    id: number;
    name: string;
    description?: string | null;
    unit: string;
    dose: string;
    price: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type TreatmentProtocolType = {
  id: number;
  name: string;
  description?: string | null;
  targetDisease: string;
  medicines: ProtocolMedicine[];
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
};
