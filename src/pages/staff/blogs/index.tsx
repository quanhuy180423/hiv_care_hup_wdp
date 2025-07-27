import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  Search,
  FileText,
  Download,
  RefreshCw,
  BookOpen,
  Users,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useBlogDrawerStore, useBlogModalStore } from "@/store/blogStore";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { useBlogs } from "@/hooks/useBlogs";
import BlogFormModal from "./components/BlogFormModal";
import BlogDetailsDrawer from "./components/BlogDetailsDrawer";
import type { Blog, BlogQueryParams } from "@/types/blog";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BlogsManagement = () => {
  const [params, setParams] = useState<BlogQueryParams>({
    page: 1,
    limit: 10,
  });
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);
  const { data, isLoading, refetch } = useBlogs(params);
  const { isOpen: isModalOpen, openModal, closeModal } = useBlogModalStore();
  const { isOpen: isDrawerOpen, closeDrawer } = useBlogDrawerStore();
  const [status, setStatus] = useState("all");

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: debouncedSearch.trim(),
    }));
  }, [debouncedSearch]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      isPublished:
        status === "all" ? undefined : status === "published" ? true : false,
    }));
  }, [status]);

  const handleRefresh = () => {
    refetch();
  };

  // Mock statistics data
  const total = data?.data.meta.total || 0;
  const blogList = data?.data.data || [];

  const published = blogList.filter((item: Blog) => item.isPublished).length;
  const drafts = blogList.filter((item: Blog) => !item.isPublished).length;

  const stats = {
    total,
    published,
    drafts,
    views: 12543,
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 px-2">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
        <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Quản lý bài viết
                    </h1>
                    <p className="text-slate-600">
                      Tạo và quản lý nội dung blog của bạn
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/30">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">
                        Tổng bài viết
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {stats.total}
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-700">
                        Đã xuất bản
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">
                      {stats.published}
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/30">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700">
                        Bản nháp
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">
                      {stats.drafts}
                    </p>
                  </div>

                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-200/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-violet-500" />
                      <span className="text-sm font-medium text-violet-700">
                        Lượt xem
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-violet-900">
                      {stats.views.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Làm mới
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                >
                  <Download className="w-4 h-4" />
                  Xuất dữ liệu
                </Button>

                <Button
                  onClick={() => openModal()}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <PlusIcon className="w-4 h-4" />
                  Tạo bài viết mới
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung..."
                className="pl-10 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 bg-white"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-60 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 bg-white">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Results Info */}
          {debouncedSearch && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200/50">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Tìm thấy <strong>{data?.data.meta.total || 0}</strong> kết quả
                  cho từ khóa "{debouncedSearch}"
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <TrendingUp className="w-6 h-6 text-indigo-500" />
              Danh sách bài viết
            </CardTitle>

            {data?.data.meta && (
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-700 px-3 py-1 text-sm font-medium"
              >
                {data.data.meta.total} bài viết
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-2">
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
                  <span className="text-slate-600">Đang tải dữ liệu...</span>
                </div>
              </div>
            )}

            <DataTable
              columns={getColumns(params.page || 1, params.limit || 10)}
              data={data?.data.data || []}
              isLoading={isLoading}
              enablePagination={true}
              currentPage={params.page || 1}
              pageSize={params.limit || 10}
              pageCount={data?.data.meta.totalPages || 1}
              totalItems={data?.data.meta.total || 0}
              onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              onPageSizeChange={(limit) =>
                setParams((prev) => ({ ...prev, page: 1, limit }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {!isLoading && (!data?.data.data || data.data.data.length === 0) && (
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800">
                  {debouncedSearch
                    ? "Không tìm thấy bài viết"
                    : "Chưa có bài viết nào"}
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {debouncedSearch
                    ? `Không có bài viết nào phù hợp với từ khóa "${debouncedSearch}". Hãy thử từ khóa khác.`
                    : "Bắt đầu tạo bài viết đầu tiên của bạn để chia sẻ nội dung với mọi người."}
                </p>
              </div>

              {!debouncedSearch && (
                <Button
                  onClick={() => openModal()}
                  className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Tạo bài viết đầu tiên
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal và Drawer */}
      <BlogFormModal open={isModalOpen} onClose={closeModal} />
      <BlogDetailsDrawer open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default BlogsManagement;
