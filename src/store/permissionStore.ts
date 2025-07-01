import type { Permission } from "@/types/permission";
import { create } from "zustand";

interface PermissionStoreState {
  selectedPermission: Permission | null;
  isDrawerOpen: boolean;
  isModalOpen: boolean;
  editingPermission: Permission | null;
}

interface PermissionStoreActions {
  selectPermission: (permission: Permission | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openModal: (permission?: Permission | null) => void;
  closeModal: () => void;
  reset: () => void;
}

const initialState: PermissionStoreState = {
  selectedPermission: null,
  isDrawerOpen: false,
  isModalOpen: false,
  editingPermission: null,
};

export const usePermissionStore = create<
  PermissionStoreState & PermissionStoreActions
>((set) => ({
  ...initialState,
  selectPermission: (permission) => set({ selectedPermission: permission }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  openModal: (permission = null) =>
    set({ isModalOpen: true, editingPermission: permission }),
  closeModal: () => set({ isModalOpen: false, editingPermission: null }),
  reset: () => set(initialState),
}));
