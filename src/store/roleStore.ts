import type { Role } from "@/types/role";
import { create } from "zustand";

interface RoleModalState {
  isOpen: boolean;
  editingRole: Role | null;
  openModal: (role?: Role | null) => void;
  closeModal: () => void;
}

interface RoleDrawerState {
  isOpen: boolean;
  selectedRole: Role | null;
  openDrawer: (role: Role) => void;
  closeDrawer: () => void;
}

export const useRoleModalStore = create<RoleModalState>((set) => ({
  isOpen: false,
  editingRole: null,
  openModal: (role = null) => set({ isOpen: true, editingRole: role }),
  closeModal: () => set({ isOpen: false, editingRole: null }),
}));

export const useRoleDrawerStore = create<RoleDrawerState>((set) => ({
  isOpen: false,
  selectedRole: null,
  openDrawer: (role) => set({ isOpen: true, selectedRole: role }),
  closeDrawer: () => set({ isOpen: false, selectedRole: null }),
}));
