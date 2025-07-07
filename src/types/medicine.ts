export type MedicineType = {
  id: number;
  name: string;
  description?: string | null;
  unit: string;
  dose: string;
  price: string; // decimal as string
  createdAt: string;
  updatedAt: string;
};
