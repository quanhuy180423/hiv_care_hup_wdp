"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategoryBlogDrawerStore } from "@/store/categoryBlogStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CategoryBlogDetail = ({ open, onClose }: Props) => {
  const { selectedCategoryBlog } = useCategoryBlogDrawerStore();

  if (!selectedCategoryBlog) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>Chi tiết danh mục</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p>
            <strong>Tiêu đề:</strong> {selectedCategoryBlog.title}
          </p>
          <p>
            <strong>Mô tả:</strong> {selectedCategoryBlog.description}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {selectedCategoryBlog.isPublished ? "Đã xuất bản" : "Nháp"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryBlogDetail;
