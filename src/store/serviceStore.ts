import type { Service } from "@/types/service";
import { create } from "zustand";

interface ServiceStoreState {
  selectedService: Service | null;
  isDrawerOpen: boolean;
  isModalOpen: boolean;
  editingService: Service | null;
}

interface ServiceStoreActions {
  selectService: (service: Service) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openModal: (service?: Service) => void;
  closeModal: () => void;
  reset: () => void;
}

type ServiceStore = ServiceStoreState & ServiceStoreActions;

const initialState: ServiceStoreState = {
  selectedService: null,
  isDrawerOpen: false,
  isModalOpen: false,
  editingService: null,
};

export const useServiceStore = create<ServiceStore>((set) => ({
  ...initialState,

  selectService: (service) => set({ selectedService: service }),
  
  openDrawer: () => set({ isDrawerOpen: true }),
  
  closeDrawer: () => set({ isDrawerOpen: false, selectedService: null }),
  
  openModal: (service) => set({ 
    isModalOpen: true, 
    editingService: service || null 
  }),
  
  closeModal: () => set({ 
    isModalOpen: false, 
    editingService: null 
  }),
  
  reset: () => set(initialState),
})); 