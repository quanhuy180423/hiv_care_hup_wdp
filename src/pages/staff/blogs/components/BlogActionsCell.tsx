"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogDrawerStore, useBlogModalStore } from "@/store/blogStore";
import type { Blog } from "@/types/blog";
import { useChangeBlogStatus, useDeleteBlog } from "@/hooks/useBlogs";
import toast from "react-hot-toast";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { useState } from "react";

interface Props {
  blog: Blog;
}

const BlogActionsCell = ({ blog }: Props) => {
  const { openDrawer } = useBlogDrawerStore();
  const { openModal } = useBlogModalStore();
  const { mutate: deleteBlog } = useDeleteBlog();
  const [open, setOpen] = useState(false);
  const { mutate: changeStatus } = useChangeBlogStatus();

  const handleDelete = () => {
    deleteBlog(blog.id, {
      onSuccess: () => {
        toast.success("Xoá bài viết thành công");
        setOpen(false);
      },
    });
  };

  const handleChangeStatus = () => {
    const nextStatus = blog.isPublished === true ? false : true;
    changeStatus(
      { id: blog.id, isPublished: nextStatus },
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
          onClick={() => openDrawer(blog)}
          className="cursor-pointer"
        >
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openModal(blog)}
          className="cursor-pointer"
        >
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleChangeStatus}
          className="cursor-pointer"
        >
          Đổi trạng thái
        </DropdownMenuItem>

        <ConfirmDelete
          onConfirm={handleDelete}
          title="Xác nhận xoá bài viết"
          description={`Bạn có chắc chắn muốn xoá bài viết "${blog.title}"? Hành động này không thể hoàn tác.`}
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

export default BlogActionsCell;
