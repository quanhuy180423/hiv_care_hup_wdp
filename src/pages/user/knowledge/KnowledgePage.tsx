import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "@/hooks/useBlogs";
import { blogService } from "@/services/blogService";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Search, Calendar, Tag, Star, ArrowRight, BookOpen, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Blog } from "@/types/blog";
import { cn } from "@/lib/utils";

export function KnowledgePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const limit = 9;
  const debouncedSearch = useDebounce(searchQuery, 400);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: blogList, isLoading } = useBlogs({
    page,
    limit,
    isPublished: true,
  });

  const handleNavigate = (slug: string) => {
    navigate(`/blogs/${slug}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Auto search with debounce
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    blogService
      .getAllBlogs({
        search: debouncedSearch,
        page: 1,
        limit: 5,
        isPublished: true,
      })
      .then((res) => {
        setSearchResults(res.data.data);
      })
      .finally(() => setIsSearching(false));
  }, [debouncedSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kiến thức & Thông tin hữu ích
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
          Nơi tập hợp những thông tin, kiến thức chính xác và cập nhật nhất về HIV/AIDS dành cho bạn.
        </p>
        <div className="max-w-2xl mx-auto relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-11 pr-4 py-3 border border-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all bg-white shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown Results */}
          {searchQuery && (
            <div
              className="absolute left-0 right-0 mt-2 bg-white border border-blue-100 shadow-xl rounded-2xl z-50 max-h-72 overflow-auto scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {isSearching ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 flex items-center gap-2 text-blue-500">
                  <Info className="w-4 h-4" />
                  <span>Không tìm thấy bài viết</span>
                </div>
              ) : (
                <ul>
                  {searchResults.map((blog) => (
                    <li
                      key={blog.id}
                      onClick={() => handleNavigate(blog.slug)}
                      className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer rounded-xl transition"
                    >
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-10 h-10 rounded object-cover mr-3 border border-blue-100"
                      />
                      <div>
                        <p className="text-sm font-medium text-blue-700">{blog.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{blog.category?.title}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blog List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Bài viết nổi bật
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <Card key={index} className="rounded-2xl shadow">
                <CardHeader>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-48 w-full rounded-xl" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : blogList?.data.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">
              Không tìm thấy bài viết phù hợp
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogList?.data.data.map((blog) => (
              <Card
                key={blog.id}
                className="hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col rounded-2xl border border-blue-100"
                onClick={() => handleNavigate(blog.slug)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-end mb-2">
                    <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-medium">
                      <Star className="h-3 w-3" />
                      Nổi bật
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl line-clamp-2 text-blue-900">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{blog.category?.title || "Không có danh mục"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    Đọc tiếp <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {blogList?.data.meta.totalPages && blogList.data.meta.totalPages > 1 && (
        <div className="flex items-center gap-2 justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer rounded-full border-blue-200"
          >
            Trang trước
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({
              length: Math.min(5, blogList.data.meta.totalPages),
            }).map((_, idx) => {
              const pageNum =
                page <= 3
                  ? idx + 1
                  : page >= blogList.data.meta.totalPages - 2
                  ? blogList.data.meta.totalPages - 4 + idx
                  : page - 2 + idx;
              return (
                <Button
                  key={idx}
                  variant={page === pageNum ? "default" : "ghost"}
                  onClick={() => setPage(pageNum)}
                  disabled={
                    pageNum < 1 || pageNum > blogList.data.meta.totalPages
                  }
                  className={cn(
                    "rounded-full",
                    page === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-blue-600"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            onClick={() =>
              setPage((p) => (p < blogList.data.meta.totalPages ? p + 1 : p))
            }
            disabled={page === blogList.data.meta.totalPages}
            className="cursor-pointer rounded-full border-blue-200"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}