import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBlogModalStore } from "@/store/blogStore";
import { useCreateBlog, useUpdateBlog } from "@/hooks/useBlogs";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import "../../../../styles/editor.css";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useCategoryBlogs } from "@/hooks/useCategoryBlogs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  PaintBucket,
  Underline as UnderlineIcon,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Loader,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formBlogSchema, type FormBlogSchema } from "@/schemas/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  open: boolean;
  onClose: () => void;
}

const BlogFormModal = ({ open, onClose }: Props) => {
  const { editingBlog } = useBlogModalStore();
  const isEditing = !!editingBlog;

  const { mutate: createBlog, isPending: creating } = useCreateBlog();
  const { mutate: updateBlog, isPending: updating } = useUpdateBlog();
  const { data: categories = [] } = useCategoryBlogs({page: 1, limit: 100});
  const { user } = useAuth();

  const form = useForm<FormBlogSchema>({
    resolver: zodResolver(formBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      authorId: Number(user?.id) || 1,
      cateId: 1,
    },
  });

  const { setValue, handleSubmit, reset, control } = form;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        inline: false,
        controls: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Color,
      TextStyle,
      Underline,
      Placeholder.configure({
        placeholder: "Viết nội dung bài viết ở đây...",
      }),
      HorizontalRule,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  const addImage = () => {
    const url = window.prompt("Nhập URL ảnh");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt("Nhập YouTube URL");
    if (url) {
      editor?.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  const addTable = () => {
    editor?.commands.insertTable({
      rows: 3,
      cols: 3,
      withHeaderRow: true,
    });
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  useEffect(() => {
    if (editingBlog) {
      reset({
        title: editingBlog.title,
        content: editingBlog.content,
        imageUrl: editingBlog.imageUrl,
        cateId: editingBlog.cateId,
        authorId: editingBlog.authorId,
      });

      if (editor) {
        editor.commands.setContent(editingBlog.content || "");
      }
    } else {
      reset({
        title: "",
        content: "",
        imageUrl: "",
        cateId: 1,
        authorId: Number(user?.id) || 1,
      });

      if (editor) {
        editor.commands.setContent("");
      }
    }
  }, [editingBlog, editor, reset, user]);

  const onSubmit = (data: FormBlogSchema) => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập.");
      return;
    }
    const payload = { ...data, authorId: Number(user.id) };
    if (isEditing && editingBlog) {
      updateBlog(
        { id: editingBlog.id, data: payload },
        {
          onSuccess: () => {
            onClose();
            toast.success("Cập nhật bài viết thành công.");
          },
        }
      );
    } else {
      createBlog(payload, {
        onSuccess: () => {
          onClose();
          reset();
          editor?.commands.setContent("");
          toast.success("Tạo bài viết thành công.");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !w-full !max-w-[90vw] md:!max-w-[1000px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Cập nhật bài viết" : "Tạo bài viết"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 flex-1 flex flex-col min-h-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Tiêu đề bài viết"
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-semibold" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="cateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full mt-1 align-top">
                          <SelectValue placeholder="Chọn danh mục bài viết" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {categories.map((cate) => (
                          <SelectItem key={cate.id} value={cate.id.toString()}>
                            {cate.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-600 font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh bài viết</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Đường dẫn ảnh"
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            {/* Editor */}
            <FormField
              control={control}
              name="content"
              render={() => (
                <FormItem className="space-y-2 flex-1 flex flex-col min-h-0">
                  <FormLabel>Nội dung bài viết</FormLabel>
                  <div className="editor-container">
                    {editor && (
                      <>
                        <div className="editor-toolbar">
                          <div className="flex flex-wrap gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("bold") ? "outline" : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleBold().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("italic") ? "outline" : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleItalic().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("underline")
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleUnderline().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <UnderlineIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("strike") ? "outline" : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleStrike().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Strikethrough className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("code") ? "outline" : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleCode().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Code className="h-4 w-4" />
                            </Button>

                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                >
                                  <PaintBucket className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2 bg-white">
                                <div className="flex flex-col gap-2">
                                  <Input
                                    type="color"
                                    onInput={(event) =>
                                      editor
                                        .chain()
                                        .focus()
                                        .setColor(event.currentTarget.value)
                                        .run()
                                    }
                                    value={
                                      editor?.getAttributes("textStyle")
                                        .color || "#000000"
                                    }
                                    className="h-10 w-10 p-0 border-none"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      editor.chain().focus().unsetColor().run()
                                    }
                                  >
                                    Xóa màu
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>

                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("heading", { level: 1 })
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 1 })
                                  .run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Heading1 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("heading", { level: 2 })
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 2 })
                                  .run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Heading2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("heading", { level: 3 })
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor
                                  .chain()
                                  .focus()
                                  .toggleHeading({ level: 3 })
                                  .run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Heading3 className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("bulletList")
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleBulletList().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <List className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("orderedList")
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleOrderedList().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <ListOrdered className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("blockquote")
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleBlockquote().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Quote className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive("codeBlock")
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor.chain().focus().toggleCodeBlock().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Code className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={setLink}
                              className="h-8 w-8 p-0"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={addImage}
                              className="h-8 w-8 p-0"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={addYoutubeVideo}
                              className="h-8 w-8 p-0"
                            >
                              <YoutubeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={addTable}
                              className="h-8 w-8 p-0"
                            >
                              <TableIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                editor.chain().focus().setHorizontalRule().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive({ textAlign: "left" })
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor
                                  .chain()
                                  .focus()
                                  .setTextAlign("left")
                                  .run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive({ textAlign: "center" })
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor
                                  .chain()
                                  .focus()
                                  .setTextAlign("center")
                                  .run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive({ textAlign: "right" })
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor
                                  .chain()
                                  .focus()
                                  .setTextAlign("right")
                                  .run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <AlignRight className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={
                                editor.isActive({ textAlign: "justify" })
                                  ? "outline"
                                  : "ghost"
                              }
                              onClick={() =>
                                editor
                                  .chain()
                                  .focus()
                                  .setTextAlign("justify")
                                  .run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <AlignJustify className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                editor.chain().focus().undo().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Undo className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                editor.chain().focus().redo().run()
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Redo className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {editor && (
                          <BubbleMenu
                            editor={editor}
                            tippyOptions={{ duration: 100 }}
                          >
                            <div className="flex gap-1 bg-white p-1 border rounded shadow-lg">
                              <Button
                                type="button"
                                size="sm"
                                variant={
                                  editor.isActive("bold")
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  editor.chain().focus().toggleBold().run()
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant={
                                  editor.isActive("italic")
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  editor.chain().focus().toggleItalic().run()
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant={
                                  editor.isActive("link")
                                    ? "default"
                                    : "outline"
                                }
                                onClick={setLink}
                                className="h-8 w-8 p-0"
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </BubbleMenu>
                        )}

                        <div className="editor-content flex-1">
                          <EditorContent editor={editor} />
                        </div>
                      </>
                    )}
                  </div>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={creating || updating}
                variant="outline"
                className="cursor-pointer"
              >
                {isEditing ? "Lưu thay đổi" : "Tạo mới"}
                {(creating || updating) && (
                  <span className="ml-2 animate-spin">
                    <Loader className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogFormModal;
