import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  TreatmentProtocol,
  QueryTreatmentProtocol,
  AdvancedSearchTreatmentProtocol,
} from "@/types/treatmentProtocol";

interface TreatmentProtocolState {
  // State
  protocols: TreatmentProtocol[];
  selectedProtocol: TreatmentProtocol | null;
  isLoading: boolean;
  error: string | null;
  
  // Search and filter state
  searchQuery: string;
  targetDisease: string;
  sortBy: 'name' | 'targetDisease' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  
  // Modal states
  isCreateModalOpen: boolean;
  isUpdateModalOpen: boolean;
  isDetailsDrawerOpen: boolean;
  isCloneModalOpen: boolean;
  isBulkCreateModalOpen: boolean;
  isAdvancedSearchModalOpen: boolean;
  
  // Actions
  setProtocols: (protocols: TreatmentProtocol[]) => void;
  setSelectedProtocol: (protocol: TreatmentProtocol | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Search and filter actions
  setSearchQuery: (query: string) => void;
  setTargetDisease: (disease: string) => void;
  setSortBy: (sortBy: 'name' | 'targetDisease' | 'createdAt') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  
  // Pagination actions
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setTotalItems: (total: number) => void;
  setItemsPerPage: (perPage: number) => void;
  
  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openUpdateModal: () => void;
  closeUpdateModal: () => void;
  openDetailsDrawer: () => void;
  closeDetailsDrawer: () => void;
  openCloneModal: () => void;
  closeCloneModal: () => void;
  openBulkCreateModal: () => void;
  closeBulkCreateModal: () => void;
  openAdvancedSearchModal: () => void;
  closeAdvancedSearchModal: () => void;
  
  // Utility actions
  resetFilters: () => void;
  resetPagination: () => void;
  resetModals: () => void;
  reset: () => void;
  
  // Computed values
  getQueryParams: () => QueryTreatmentProtocol;
  getAdvancedSearchParams: () => AdvancedSearchTreatmentProtocol;
}

const initialState = {
  protocols: [],
  selectedProtocol: null,
  isLoading: false,
  error: null,
  
  // Search and filter state
  searchQuery: "",
  targetDisease: "",
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
  
  // Pagination state
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  
  // Modal states
  isCreateModalOpen: false,
  isUpdateModalOpen: false,
  isDetailsDrawerOpen: false,
  isCloneModalOpen: false,
  isBulkCreateModalOpen: false,
  isAdvancedSearchModalOpen: false,
};

export const useTreatmentProtocolStore = create<TreatmentProtocolState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Actions
      setProtocols: (protocols) => set({ protocols }),
      setSelectedProtocol: (protocol) => set({ selectedProtocol: protocol }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Search and filter actions
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setTargetDisease: (targetDisease) => set({ targetDisease }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      
      // Pagination actions
      setCurrentPage: (currentPage) => set({ currentPage }),
      setTotalPages: (totalPages) => set({ totalPages }),
      setTotalItems: (totalItems) => set({ totalItems }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      
      // Modal actions
      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),
      openUpdateModal: () => set({ isUpdateModalOpen: true }),
      closeUpdateModal: () => set({ isUpdateModalOpen: false }),
      openDetailsDrawer: () => set({ isDetailsDrawerOpen: true }),
      closeDetailsDrawer: () => set({ isDetailsDrawerOpen: false }),
      openCloneModal: () => set({ isCloneModalOpen: true }),
      closeCloneModal: () => set({ isCloneModalOpen: false }),
      openBulkCreateModal: () => set({ isBulkCreateModalOpen: true }),
      closeBulkCreateModal: () => set({ isBulkCreateModalOpen: false }),
      openAdvancedSearchModal: () => set({ isAdvancedSearchModalOpen: true }),
      closeAdvancedSearchModal: () => set({ isAdvancedSearchModalOpen: false }),
      
      // Utility actions
      resetFilters: () => set({
        searchQuery: "",
        targetDisease: "",
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
      
      resetPagination: () => set({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      }),
      
      resetModals: () => set({
        isCreateModalOpen: false,
        isUpdateModalOpen: false,
        isDetailsDrawerOpen: false,
        isCloneModalOpen: false,
        isBulkCreateModalOpen: false,
        isAdvancedSearchModalOpen: false,
      }),
      
      reset: () => set(initialState),
      
      // Computed values
      getQueryParams: () => {
        const state = get();
        return {
          page: state.currentPage.toString(),
          limit: state.itemsPerPage.toString(),
          search: state.searchQuery || undefined,
          targetDisease: state.targetDisease || undefined,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        };
      },
      
      getAdvancedSearchParams: () => {
        const state = get();
        return {
          page: state.currentPage.toString(),
          limit: state.itemsPerPage.toString(),
          query: state.searchQuery || undefined,
          targetDisease: state.targetDisease || undefined,
        };
      },
    }),
    {
      name: "treatment-protocol-store",
    }
  )
); 