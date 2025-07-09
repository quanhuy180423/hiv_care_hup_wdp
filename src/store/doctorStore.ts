<<<<<<< HEAD
import { create } from "zustand";
import type { Doctor } from "@/types/doctor";

interface DoctorModalState {
  isOpen: boolean;
  editingDoctor: Doctor | null;
  openModal: (doctor?: Doctor | null) => void;
  closeModal: () => void;
}

interface DoctorDrawerState {
  isOpen: boolean;
  selectedDoctor: Doctor | null;
  openDrawer: (doctor: Doctor) => void;
  closeDrawer: () => void;
}

export const useDoctorModalStore = create<DoctorModalState>((set) => ({
  isOpen: false,
  editingDoctor: null,
  openModal: (doctor = null) => set({ isOpen: true, editingDoctor: doctor }),
  closeModal: () => set({ isOpen: false, editingDoctor: null }),
}));

export const useDoctorDrawerStore = create<DoctorDrawerState>((set) => ({
  isOpen: false,
  selectedDoctor: null,
  openDrawer: (doctor) => set({ isOpen: true, selectedDoctor: doctor }),
  closeDrawer: () => set({ isOpen: false, selectedDoctor: null }),
}));
=======
import type { Doctor } from "@/types/doctor";
import { create } from "zustand";

interface DoctorStoreState {
  selectedDoctor: Doctor | null;
  isDrawerOpen: boolean;
  isModalOpen: boolean;
  editingDoctor: Doctor | null;
  isScheduleModalOpen: boolean;
  isSwapModalOpen: boolean;
  isGenerateScheduleModalOpen: boolean;
}

interface DoctorStoreActions {
  selectDoctor: (doctor: Doctor | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openModal: (doctor?: Doctor | null) => void;
  closeModal: () => void;
  openScheduleModal: () => void;
  closeScheduleModal: () => void;
  openSwapModal: () => void;
  closeSwapModal: () => void;
  openGenerateScheduleModal: () => void;
  closeGenerateScheduleModal: () => void;
  reset: () => void;
}

const initialState: DoctorStoreState = {
  selectedDoctor: null,
  isDrawerOpen: false,
  isModalOpen: false,
  editingDoctor: null,
  isScheduleModalOpen: false,
  isSwapModalOpen: false,
  isGenerateScheduleModalOpen: false,
};

export const useDoctorStore = create<
  DoctorStoreState & DoctorStoreActions
>((set) => ({
  ...initialState,
  selectDoctor: (doctor) => set({ selectedDoctor: doctor }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  openModal: (doctor = null) =>
    set({ isModalOpen: true, editingDoctor: doctor }),
  closeModal: () => set({ isModalOpen: false, editingDoctor: null }),
  openScheduleModal: () => set({ isScheduleModalOpen: true }),
  closeScheduleModal: () => set({ isScheduleModalOpen: false }),
  openSwapModal: () => set({ isSwapModalOpen: true }),
  closeSwapModal: () => set({ isSwapModalOpen: false }),
  openGenerateScheduleModal: () => set({ isGenerateScheduleModalOpen: true }),
  closeGenerateScheduleModal: () => set({ isGenerateScheduleModalOpen: false }),
  reset: () => set(initialState),
})); 
>>>>>>> feature/admin
