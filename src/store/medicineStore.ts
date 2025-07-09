import type { Medicine } from "@/types/medicine";
import { create } from "zustand";

interface MedicineStoreState {
  selectedMedicine: Medicine | null;
  isDrawerOpen: boolean;
  isModalOpen: boolean;
  editingMedicine: Medicine | null;
  isBulkCreateModalOpen: boolean;
  isAdvancedSearchModalOpen: boolean;
  isPriceRangeModalOpen: boolean;
}

interface MedicineStoreActions {
  selectMedicine: (medicine: Medicine | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openModal: (medicine?: Medicine | null) => void;
  closeModal: () => void;
  openBulkCreateModal: () => void;
  closeBulkCreateModal: () => void;
  openAdvancedSearchModal: () => void;
  closeAdvancedSearchModal: () => void;
  openPriceRangeModal: () => void;
  closePriceRangeModal: () => void;
  reset: () => void;
}

const initialState: MedicineStoreState = {
  selectedMedicine: null,
  isDrawerOpen: false,
  isModalOpen: false,
  editingMedicine: null,
  isBulkCreateModalOpen: false,
  isAdvancedSearchModalOpen: false,
  isPriceRangeModalOpen: false,
};

export const useMedicineStore = create<
  MedicineStoreState & MedicineStoreActions
>((set) => ({
  ...initialState,
  selectMedicine: (medicine) => set({ selectedMedicine: medicine }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  openModal: (medicine = null) =>
    set({ isModalOpen: true, editingMedicine: medicine }),
  closeModal: () => set({ isModalOpen: false, editingMedicine: null }),
  openBulkCreateModal: () => set({ isBulkCreateModalOpen: true }),
  closeBulkCreateModal: () => set({ isBulkCreateModalOpen: false }),
  openAdvancedSearchModal: () => set({ isAdvancedSearchModalOpen: true }),
  closeAdvancedSearchModal: () => set({ isAdvancedSearchModalOpen: false }),
  openPriceRangeModal: () => set({ isPriceRangeModalOpen: true }),
  closePriceRangeModal: () => set({ isPriceRangeModalOpen: false }),
  reset: () => set(initialState),
})); 