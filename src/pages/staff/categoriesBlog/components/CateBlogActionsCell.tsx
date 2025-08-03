"use client";

import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChangeCategoryBlogStatus, useDeleteCategoryBlog } from "@/hooks/useCategoryBlogs";
import {
  useCategoryBlogDrawerStore,
  useCategoryBlogModalStore,
} from "@/store/categoryBlogStore";
import type { CategoryBlog } from "@/types/categoryBlog";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  categoryBlog: CategoryBlog;
}

const CateBlogActionsCell = ({ categoryBlog }: Props) => {
  const { openDrawer } = useCategoryBlogDrawerStore();
  const { openModal } = useCategoryBlogModalStore();
  const { mutate: deleteCategoryBlog } = useDeleteCategoryBlog();
  const [open, setOpen] = useState(false);
  const { mutate: changeStatus } = useChangeCategoryBlogStatus();

  const handleDelete = () => {
    deleteCategoryBlog(categoryBlog.id, {
      onSuccess: () => {
        toast.success("Xoá bài viết thành công");
        setOpen(false);
      },
    });
  };

  const handleChangeStatus = () => {
    const nextStatus = categoryBlog.isPublished === true ? false : true;
    changeStatus(
      { id: categoryBlog.id, isPublished: nextStatus },
      {
        onSuccess: () => {
          toast.success("Đổi trạng thái bài viết thành công");
          setOpen(false);
        },
      }
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem
          onClick={() => openDrawer(categoryBlog)}
          className="cursor-pointer"
        >
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openModal(categoryBlog)}
          className="cursor-pointer"
        >
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChangeStatus()}
          className="cursor-pointer"
        >
          Đổi trạng thái
        </DropdownMenuItem>
        <ConfirmDelete
          onConfirm={handleDelete}
          title="Xác nhận xoá danh mục bài viết"
          description={`Bạn có chắc chắn muốn xoá danh mục "${categoryBlog.title}"? Hành động này không thể hoàn tác.`}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-600 cursor-pointer w-full"
            >
              Xoá
            </DropdownMenuItem>
          }
          asChild
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CateBlogActionsCell;
