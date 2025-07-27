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
import { 
  PlusIcon, 
  Search, 
  FolderOpen,
  Filter,
  Download,
  RefreshCw,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const { data: categories, isLoading, refetch } = useCategoryBlogs(params);
  const { isOpen: isDrawerOpen, closeDrawer } = useCategoryBlogDrawerStore();

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: debouncedSearch.trim(),
    }));
  }, [debouncedSearch]);

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // Logic xuất dữ liệu
    console.log("Export data");
  };

  const totalCategories = categories?.length || 0;
  const publishedCategories = categories?.filter(cat => cat.isPublished)?.length || 0;
  const draftCategories = totalCategories - publishedCategories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Quản lý và tổ chức các danh mục bài viết
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="hover:bg-gray-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Xuất dữ liệu
              </Button>
              <Button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Thêm danh mục
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Tổng danh mục</p>
                  <p className="text-2xl font-bold text-blue-900">{totalCategories}</p>
                </div>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Đã xuất bản</p>
                  <p className="text-2xl font-bold text-green-900">{publishedCategories}</p>
                </div>
                <div className="p-2 bg-green-200 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Bản nháp</p>
                  <p className="text-2xl font-bold text-orange-900">{draftCategories}</p>
                </div>
                <div className="p-2 bg-orange-200 rounded-lg">
                  <Filter className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên danh mục, mô tả..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Bộ lọc
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              Danh sách danh mục
              {search && (
                <Badge variant="secondary" className="ml-2">
                  Kết quả: {totalCategories}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={categories || []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        <CategoryBlogModal open={isModalOpen} onClose={closeModal} />
        <CategoryBlogDetail open={isDrawerOpen} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default CategoryBlogManagement;