import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBlogDrawerStore } from "@/store/blogStore";
import {
  Calendar,
  User,
  Download,
  Share2,
  Clock,
} from "lucide-react";
import "../../../../styles/editor-renderer.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

const BlogDetailsDialog = ({ open, onClose }: Props) => {
  const { selectedBlog } = useBlogDrawerStore();

  if (!selectedBlog) return null;

  const handleDownload = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedBlog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !w-full !max-w-[95vw] md:!max-w-[900px] h-[95vh] p-0 overflow-auto border-0 shadow-2xl scrollbar-none hide-scrollbar">
        {/* Header */}
        <div className="relative">
          {selectedBlog.imageUrl && (
            <img
              src={selectedBlog.imageUrl}
              alt={selectedBlog.title}
              className="w-full h-48 md:h-64 object-cover rounded-t-lg"
              style={{ objectPosition: "center" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-t-lg" />
          <div className="absolute left-0 bottom-0 w-full px-6 pb-4 flex flex-col md:flex-row md:items-end md:justify-between z-10">
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {selectedBlog.title}
              </DialogTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  {selectedBlog.category.title}
                </Badge>
                <Badge
                  variant={selectedBlog.isPublished ? "default" : "destructive"}
                  className={
                    selectedBlog.isPublished
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : ""
                  }
                >
                  {selectedBlog.isPublished ? "Đã xuất bản" : "Nháp"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="bg-white/80 hover:bg-white text-blue-700 border border-blue-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="bg-white/80 hover:bg-white text-blue-700 border border-blue-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <User className="h-4 w-4" />
            <span>{selectedBlog.author.name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(selectedBlog.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              Cập nhật:{" "}
              {new Date(selectedBlog.updatedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 w-full h-full bg-white">
          <div className="p-8 pb-2">
            <div
              className="blog-content prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
          </div>
          <Separator className="mb-4" />
          {/* Footer Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-8 pb-6 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 ml-4" />
              <span>Tác giả: {selectedBlog.author.name}</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetailsDialog;