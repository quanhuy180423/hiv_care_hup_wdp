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
