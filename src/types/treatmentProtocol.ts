export type MedicationSchedule = "MORNING" | "AFTERNOON" | "NIGHT";

export type TreatmentProtocolType = {
  id: number;
  name: string;
  description?: string | null;
  targetDisease: string;
  medicines: Array<{
    id: number;
    medicineId: number;
    dosage: string;
    duration: MedicationSchedule; // MedicationSchedule enum: MORNING, AFTERNOON, NIGHT
    notes?: string | null;
    medicine: {
      id: number;
      name: string;
      description?: string | null;
      unit: string;
      dose: string;
      price: string; // decimal as string
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
};
