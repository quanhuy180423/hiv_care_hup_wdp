import { create } from "zustand";
import type { Appointment } from "@/types/appointment";

interface MeetingRecordDialogState {
  isOpen: boolean;
  appointment: Appointment | null;
  open: (appointment: Appointment) => void;
  close: () => void;
  hide: () => void;
}

export const useMeetingRecordDialogStore = create<MeetingRecordDialogState>(
  (set) => ({
    isOpen: false,
    appointment: null,
    open: (appointment) => set({ isOpen: true, appointment }),
    close: () => set({ isOpen: false, appointment: null }),
    hide: () => set({ isOpen: false }),
  })
);
