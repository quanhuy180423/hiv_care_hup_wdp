"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

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
import { Loader } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CategoryBlogModal = ({ open, onClose }: Props) => {
  const { editingCategoryBlog } = useCategoryBlogModalStore();

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

  const { handleSubmit, reset } = form;

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
            toast.success("Cập nhật danh mục thành công.");
          },
        }
      );
    } else {
      createCategoryBlog(data, {
        onSuccess: () => {
          onClose();
          reset();
          toast.success("Tạo danh mục thành công.");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>
            {editingCategoryBlog ? "Chỉnh sửa" : "Tạo mới"} danh mục
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mô tả" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="cursor-pointer"
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={creating || updating}
                variant="outline"
                className="cursor-pointer"
              >
                {editingCategoryBlog ? "Lưu" : "Tạo"}
                {(creating || updating) && (
                  <Loader className="animate-spin ml-2" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryBlogModal;
