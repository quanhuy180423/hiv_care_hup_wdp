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
import { Search, Calendar, Tag, Star, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Blog } from "@/types/blog";

export function KnowledgePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const limit = 9;
  const debouncedSearch = useDebounce(searchQuery);
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
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Kiến thức và thông tin hữu ích
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Nơi tập hợp những thông tin, kiến thức chính xác và cập nhật nhất về
          HIV/AIDS
        </p>
        <div className="max-w-2xl mx-auto relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown Results */}
          {searchQuery && (
            <div
              className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg z-50 max-h-72 overflow-auto scrollbar-none"
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
                <div className="p-4 text-sm text-muted-foreground">
                  Không tìm thấy bài viết
                </div>
              ) : (
                <ul>
                  {searchResults.map((blog) => (
                    <li
                      key={blog.id}
                      onClick={() => handleNavigate(blog.slug)}
                      className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium">{blog.title}</p>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bài viết nổi bật
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-48 w-full rounded" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : blogList?.data.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Không tìm thấy bài viết phù hợp
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogList?.data.data.map((blog) => (
              <Card
                key={blog.id}
                className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                onClick={() => handleNavigate(blog.slug)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-end mb-2">
                    <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-medium">
                      <Star className="h-3 w-3" />
                      Nổi bật
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl line-clamp-2 text-gray-900">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                  <Button variant="ghost" size="sm" className="text-primary">
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
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer"
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
                  variant={page === pageNum ? "outline" : "ghost"}
                  onClick={() => setPage(pageNum)}
                  disabled={
                    pageNum < 1 || pageNum > blogList.data.meta.totalPages
                  }
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
            className="cursor-pointer"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
