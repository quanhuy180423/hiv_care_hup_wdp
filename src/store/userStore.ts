import type { User } from "@/types/user";
import { create } from "zustand";

interface UserStoreState {
  selectedUser: User | null;
  isDrawerOpen: boolean;
  isModalOpen: boolean;
  editingUser: User | null;
}

interface UserStoreActions {
  selectUser: (user: User | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openModal: (user?: User | null) => void;
  closeModal: () => void;
  reset: () => void;
}

const initialState: UserStoreState = {
  selectedUser: null,
  isDrawerOpen: false,
  isModalOpen: false,
  editingUser: null,
};

export const useUserStore = create<
  UserStoreState & UserStoreActions
>((set) => ({
  ...initialState,
  selectUser: (user) => set({ selectedUser: user }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  openModal: (user = null) =>
    set({ isModalOpen: true, editingUser: user }),
  closeModal: () => set({ isModalOpen: false, editingUser: null }),
  reset: () => set(initialState),
})); 