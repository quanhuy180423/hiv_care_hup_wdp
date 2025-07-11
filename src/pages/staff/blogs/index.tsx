"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import { useBlogDrawerStore, useBlogModalStore } from "@/store/blogStore";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { useBlogs } from "@/hooks/useBlogs";
import BlogFormModal from "./components/BlogFormModal";
import BlogDetailsDrawer from "./components/BlogDetailsDrawer";
import type { BlogQueryParams } from "@/types/blog";
import { useDebounce } from "@/hooks/useDebounce";

const BlogsManagement = () => {
  const [params, setParams] = useState<BlogQueryParams>({
    page: 1,
    limit: 10,
  });
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);
  const { data, isLoading } = useBlogs(params);
  const { isOpen: isModalOpen, openModal, closeModal } = useBlogModalStore();
  const { isOpen: isDrawerOpen, closeDrawer } = useBlogDrawerStore();

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: debouncedSearch.trim(),
    }));
  }, [debouncedSearch]);

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút tạo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
        <Button
          onClick={() => openModal()}
          className="cursor-pointer"
          variant="outline"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Tạo bài viết
        </Button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bài viết..."
          className="pl-10"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Bảng dữ liệu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Danh sách bài viết
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={getColumns(params.page || 1, params.limit || 10)}
            data={data?.data || []}
            isLoading={isLoading}
            enablePagination={true}
            currentPage={params.page || 1}
            pageSize={params.limit || 10}
            pageCount={data?.meta.totalPages || 1}
            totalItems={data?.meta.total || 0}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            onPageSizeChange={(limit) =>
              setParams((prev) => ({ ...prev, page: 1, limit }))
            }
          />
        </CardContent>
      </Card>

      {/* Modal và Drawer */}
      <BlogFormModal open={isModalOpen} onClose={closeModal} />
      <BlogDetailsDrawer open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default BlogsManagement;
