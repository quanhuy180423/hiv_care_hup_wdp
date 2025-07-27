"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCategoryBlogDrawerStore } from "@/store/categoryBlogStore";
import {
  FolderOpen,
  FileText,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Tag,
  Edit,
  Trash2,
  Share2,
  BarChart3,
} from "lucide-react";
import { formatDate } from "@/lib/utils/dates/formatDate";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CategoryBlogDetail = ({ open, onClose }: Props) => {
  const { selectedCategoryBlog } = useCategoryBlogDrawerStore();

  if (!selectedCategoryBlog) return null;

  const handleShare = () => {
    // Logic để chia sẻ
    if (navigator.share) {
      navigator.share({
        title: selectedCategoryBlog.title,
        text: selectedCategoryBlog.description,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white w-full max-w-2xl p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">
                    Chi tiết danh mục
                  </DialogTitle>
                  <p className="text-white/80 text-sm mt-1">
                    Thông tin chi tiết về danh mục bài viết
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Tag className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Tiêu đề danh mục
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {selectedCategoryBlog.title}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 mb-1">Mô tả</p>
                <p className="text-base text-slate-700 leading-relaxed">
                  {selectedCategoryBlog.description || "Chưa có mô tả"}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {selectedCategoryBlog.isPublished ? (
                  <Eye className="w-5 h-5 text-emerald-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Trạng thái
                </p>
                <Badge
                  variant={
                    selectedCategoryBlog.isPublished ? "default" : "secondary"
                  }
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium
                    ${
                      selectedCategoryBlog.isPublished
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }
                  `}
                >
                  {selectedCategoryBlog.isPublished ? (
                    <>
                      <Eye className="w-3 h-3" />
                      Đã xuất bản
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Bản nháp
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Created Date */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Ngày tạo</p>
                <p className="text-sm font-medium text-slate-700">
                  {formatDate(selectedCategoryBlog.createdAt, "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            {/* Updated Date */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Cập nhật lần cuối</p>
                <p className="text-sm font-medium text-slate-700">
                  {formatDate(
                    selectedCategoryBlog.updatedAt,
                    "dd/MM/yyyy HH:mm"
                  )}
                </p>
              </div>
            </div>

            {/* Statistics (Mock data) */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Số bài viết</p>
                <p className="text-sm font-medium text-slate-700">
                  12 bài viết
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryBlogDetail;
