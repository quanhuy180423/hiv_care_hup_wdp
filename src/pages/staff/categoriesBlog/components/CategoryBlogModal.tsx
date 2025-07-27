"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { useCategoryBlogModalStore } from "@/store/categoryBlogStore";
import {
  useCreateCategoryBlog,
  useUpdateCategoryBlog,
} from "@/hooks/useCategoryBlogs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  formCategoryBlogSchema,
  type CategoryBlogFormValues,
} from "@/schemas/categoryBlog";
import toast from "react-hot-toast";
import { 
  Loader2, 
  FolderPlus, 
  FolderEdit,
  Tag,
  FileText,
  Eye,
  EyeOff,
  Save,
  X,
  Sparkles
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CategoryBlogModal = ({ open, onClose }: Props) => {
  const { editingCategoryBlog } = useCategoryBlogModalStore();
  const isEditing = !!editingCategoryBlog;

  const { mutate: createCategoryBlog, isPending: creating } =
    useCreateCategoryBlog();
  const { mutate: updateCategoryBlog, isPending: updating } =
    useUpdateCategoryBlog();

  const form = useForm<CategoryBlogFormValues>({
    resolver: zodResolver(formCategoryBlogSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublished: true,
    },
  });

  const { handleSubmit, reset, watch } = form;
  const watchedIsPublished = watch("isPublished");

  useEffect(() => {
    if (editingCategoryBlog) {
      reset({
        title: editingCategoryBlog.title,
        description: editingCategoryBlog.description,
        isPublished: editingCategoryBlog.isPublished,
      });
    } else {
      reset({
        title: "",
        description: "",
        isPublished: true,
      });
    }
  }, [editingCategoryBlog, reset]);

  const onSubmit = (data: CategoryBlogFormValues) => {
    if (editingCategoryBlog) {
      updateCategoryBlog(
        { id: editingCategoryBlog.id, data },
        {
          onSuccess: () => {
            onClose();
            toast.success("Cập nhật danh mục thành công! 🎉");
          },
          onError: () => {
            toast.error("Có lỗi xảy ra khi cập nhật danh mục");
          },
        }
      );
    } else {
      createCategoryBlog(data, {
        onSuccess: () => {
          onClose();
          reset();
          toast.success("Tạo danh mục thành công! 🎉");
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi tạo danh mục");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg bg-white p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
              {isEditing ? (
                <>
                  <FolderEdit className="w-6 h-6" />
                  Chỉnh sửa danh mục
                </>
              ) : (
                <>
                  <FolderPlus className="w-6 h-6" />
                  Tạo danh mục mới
                </>
              )}
            </DialogTitle>
            <p className="text-white/80 text-sm mt-1">
              {isEditing 
                ? "Cập nhật thông tin danh mục bài viết" 
                : "Tạo danh mục mới để tổ chức bài viết tốt hơn"}
            </p>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Tag className="w-4 h-4 text-indigo-500" />
                      Tiêu đề danh mục
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="VD: Tin tức y tế, Kiến thức HIV..." 
                        className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <FileText className="w-4 h-4 text-purple-500" />
                      Mô tả
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả ngắn gọn về danh mục này..." 
                        className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 min-h-[80px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500 mt-1">
                      Mô tả giúp người dùng hiểu rõ hơn về nội dung danh mục
                    </FormDescription>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Published Status */}
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          {watchedIsPublished ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-slate-400" />
                          )}
                          Trạng thái hiển thị
                        </FormLabel>
                        <FormDescription className="text-xs text-slate-500">
                          {watchedIsPublished 
                            ? "Danh mục đang hiển thị công khai" 
                            : "Danh mục đang ẩn, chỉ admin xem được"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Sparkles className="w-3 h-3" />
                  <span>Thay đổi sẽ được áp dụng ngay lập tức</span>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
                    disabled={creating || updating}
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating || updating}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg cursor-pointer"
                  >
                    {creating || updating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {isEditing ? "Lưu thay đổi" : "Tạo danh mục"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryBlogModal;