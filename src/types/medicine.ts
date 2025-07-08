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

export type MedicineResponse = {
  data: MedicineType[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
