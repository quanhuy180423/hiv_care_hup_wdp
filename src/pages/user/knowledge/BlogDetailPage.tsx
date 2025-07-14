import { useParams } from "react-router-dom";
import "../../../styles/editor-renderer.css"
import { useBlogBySlug } from "@/hooks/useBlogs";
import { Loader } from "lucide-react";

export function BlogDetailPage() {
  const { slug } = useParams();
  const { data, isLoading } = useBlogBySlug(slug ?? "");

  if (isLoading) return (
  <div className="flex items-center justify-center min-h-screen">
    <Loader className="animate-spin h-8 w-8 mx-auto mt-20 text-gray-500" />
  </div>
  );

  if (!data) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: data.data.content }}
      />
    </div>
  );
}
