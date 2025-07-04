import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBlogDrawerStore } from "@/store/blogStore";
import "../../../../styles/editor-renderer.css"

interface Props {
  open: boolean;
  onClose: () => void;
}

const BlogDetailsDialog = ({ open, onClose }: Props) => {
  const { selectedBlog } = useBlogDrawerStore();

  if (!selectedBlog) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !w-full !max-w-[90vw] md:!max-w-[1000px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chi tiết bài viết
          </DialogTitle>
        </DialogHeader>

          <div>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetailsDialog;
