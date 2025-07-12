"use client";

import { useCategoryBlogs } from "@/hooks/useCategoryBlogs";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  useCategoryBlogDrawerStore,
  useCategoryBlogModalStore,
} from "@/store/categoryBlogStore";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import CategoryBlogModal from "./components/CategoryBlogModal";
import CategoryBlogDetail from "./components/CategoryBlogDetail";
import { PlusIcon, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CateBlogQueryParams } from "@/types/categoryBlog";
import { useDebounce } from "@/hooks/useDebounce";

const CategoryBlogManagement = () => {
  const [params, setParams] = useState<CateBlogQueryParams>({
    page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const {
    isOpen: isModalOpen,
    openModal,
    closeModal,
  } = useCategoryBlogModalStore();
  const { data: categories, isLoading } = useCategoryBlogs(params);
  const { isOpen: isDrawerOpen, closeDrawer } = useCategoryBlogDrawerStore();

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: debouncedSearch.trim(),
    }));
  }, [debouncedSearch]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
        <Button
          onClick={() => openModal()}
          variant="outline"
          className="cursor-pointer"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm danh mục..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Danh sách danh mục
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categories || []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      <CategoryBlogModal open={isModalOpen} onClose={closeModal} />
      <CategoryBlogDetail open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default CategoryBlogManagement;
