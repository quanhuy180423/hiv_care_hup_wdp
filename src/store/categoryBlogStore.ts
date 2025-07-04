import { create } from "zustand";
import type { CategoryBlog } from "@/types/categoryBlog";

interface CategoryBlogModalState {
  isOpen: boolean;
  editingCategoryBlog: CategoryBlog | null;
  openModal: (category?: CategoryBlog | null) => void;
  closeModal: () => void;
}

interface CategoryBlogDrawerState {
  isOpen: boolean;
  selectedCategoryBlog: CategoryBlog | null;
  openDrawer: (category: CategoryBlog) => void;
  closeDrawer: () => void;
}

export const useCategoryBlogModalStore = create<CategoryBlogModalState>(
  (set) => ({
    isOpen: false,
    editingCategoryBlog: null,
    openModal: (category = null) =>
      set({ isOpen: true, editingCategoryBlog: category }),
    closeModal: () => set({ isOpen: false, editingCategoryBlog: null }),
  })
);

export const useCategoryBlogDrawerStore = create<CategoryBlogDrawerState>(
  (set) => ({
    isOpen: false,
    selectedCategoryBlog: null,
    openDrawer: (category) =>
      set({ isOpen: true, selectedCategoryBlog: category }),
    closeDrawer: () => set({ isOpen: false, selectedCategoryBlog: null }),
  })
);
