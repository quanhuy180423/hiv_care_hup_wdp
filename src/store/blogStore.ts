import { create } from "zustand";
import type { Blog } from "@/types/blog";

interface BlogModalState {
  isOpen: boolean;
  editingBlog: Blog | null;
  openModal: (blog?: Blog | null) => void;
  closeModal: () => void;
}

interface BlogDrawerState {
  isOpen: boolean;
  selectedBlog: Blog | null;
  openDrawer: (blog: Blog) => void;
  closeDrawer: () => void;
}

export const useBlogModalStore = create<BlogModalState>((set) => ({
  isOpen: false,
  editingBlog: null,
  openModal: (blog = null) => set({ isOpen: true, editingBlog: blog }),
  closeModal: () => set({ isOpen: false, editingBlog: null }),
}));

export const useBlogDrawerStore = create<BlogDrawerState>((set) => ({
  isOpen: false,
  selectedBlog: null,
  openDrawer: (blog) => set({ isOpen: true, selectedBlog: blog }),
  closeDrawer: () => set({ isOpen: false, selectedBlog: null }),
}));
