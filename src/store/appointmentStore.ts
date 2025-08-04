import type { Appointment } from "@/types/appointment";
import { create } from "zustand";

interface AppointmentDrawerState {
  isOpen: boolean;
  viewingAppointment: Appointment | null;
  openDrawer: (appointment: Appointment) => void;
  closeDrawer: () => void;
}

export const useAppointmentDrawerStore = create<AppointmentDrawerState>(
  (set) => ({
    isOpen: false,
    viewingAppointment: null,
    openDrawer: (appointment) =>
      set({ isOpen: true, viewingAppointment: appointment }),
    closeDrawer: () => set({ isOpen: false, viewingAppointment: null }),
  })
);

interface AppointmentModalState {
  isOpen: boolean;
  editingAppointment: Appointment | null;
  openModal: (appointment: Appointment) => void;
  closeModal: () => void;
}

export const useAppointmentModalStore = create<AppointmentModalState>(
  (set) => ({
    isOpen: false,
    editingAppointment: null,
    openModal: (appointment) =>
      set({ isOpen: true, editingAppointment: appointment }),
    closeModal: () => set({ isOpen: false, editingAppointment: null }),
  })
);

interface AppointmentStoreState {
  isPayment: boolean;
  setIsPayment: (isPayment: boolean) => void;
}

export const useAppointmentOrderStore = create<AppointmentStoreState>(
  (set) => ({
    isPayment: false,
    setIsPayment: (isPayment: boolean) => set({ isPayment }),
  })
);
