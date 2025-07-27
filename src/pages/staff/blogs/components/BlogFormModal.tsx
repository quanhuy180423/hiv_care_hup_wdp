import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Underline as UnderlineIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Loader,
  FileText,
  Save,
  Palette,
  Type,
  Layout,
  Sparkles,
  ImageIcon as ImagePlaceholder,
  Tag,
  User,
  Calendar,
  type LucideIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { uploadAvatarToSupabase } from "@/lib/utils/uploadImage/uploadImage";

interface Props {
  open: boolean;
  onClose: () => void;
}

const BlogFormModal = ({ open, onClose }: Props) => {
  const { editingBlog } = useBlogModalStore();
  const isEditing = !!editingBlog;

  const { mutate: createBlog, isPending: creating } = useCreateBlog();
  const { mutate: updateBlog, isPending: updating } = useUpdateBlog();
  const { data: categories = [] } = useCategoryBlogs({ page: 1, limit: 100 });
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const { setValue, handleSubmit, reset, control, watch } = form;
  const watchedTitle = watch("title");
  const watchedImageUrl = watch("imageUrl");

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
        placeholder: "Bắt đầu viết nội dung tuyệt vời của bạn...",
      }),
      HorizontalRule,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadAvatarToSupabase(file, String(user?.id));
      editor?.chain().focus().setImage({ src: url }).run();
      toast.success("Tải ảnh lên thành công!");
    } catch (err) {
      console.log(err);
      toast.error("Tải ảnh thất bại!");
    } finally {
      e.target.value = "";
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt("Nhập YouTube URL:");
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
    const url = window.prompt("🔗 Nhập URL liên kết:", previousUrl);

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
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    const payload = { ...data, authorId: Number(user.id) };
    if (isEditing && editingBlog) {
      updateBlog(
        { id: editingBlog.id, data: payload },
        {
          onSuccess: () => {
            onClose();
            toast.success("Cập nhật bài viết thành công!");
          },
        }
      );
    } else {
      createBlog(payload, {
        onSuccess: () => {
          onClose();
          reset();
          editor?.commands.setContent("");
          toast.success("Tạo bài viết thành công!");
        },
      });
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    tooltip,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: LucideIcon;
    tooltip: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant={isActive ? "default" : "ghost"}
            onClick={onClick}
            className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white !w-full !max-w-[95vw] md:!max-w-[1200px] h-[95vh] overflow-auto p-0 gap-0">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <DialogHeader className="p-6 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                  </DialogTitle>
                  <p className="text-white/80 text-sm mt-1">
                    {isEditing
                      ? "Cập nhật nội dung bài viết của bạn"
                      : "Chia sẻ ý tưởng tuyệt vời với mọi người"}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Info */}
            {watchedTitle && (
              <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-start gap-4">
                  {watchedImageUrl ? (
                    <img
                      src={watchedImageUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border-2 border-white/30"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <ImagePlaceholder className="w-6 h-6 text-white/60" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {watchedTitle}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/70">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {user?.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date().toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>
        </div>

        {/* Form Content */}
        <div>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full flex flex-col"
            >
              {/* Basic Info */}
              <div className="p-6 bg-slate-50/50 border-b">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Type className="w-4 h-4 text-indigo-500" />
                          Tiêu đề bài viết
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập tiêu đề hấp dẫn..."
                            className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 bg-white"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="cateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Tag className="w-4 h-4 text-emerald-500" />
                          Danh mục
                        </FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="w-full border-slate-200 focus:border-indigo-400 bg-white">
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {categories.map((cate) => (
                              <SelectItem
                                key={cate.id}
                                value={cate.id.toString()}
                              >
                                <div className="flex items-center gap-2">
                                  <Tag className="w-3 h-3 text-emerald-500" />
                                  {cate.title}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <ImageIcon className="w-4 h-4 text-purple-500" />
                          Ảnh đại diện
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com/image.jpg"
                            className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 bg-white"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Editor */}
              <FormField
                control={control}
                name="content"
                render={() => (
                  <FormItem className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 pt-4 pb-2">
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <Layout className="w-4 h-4 text-indigo-500" />
                        Nội dung bài viết
                      </FormLabel>
                    </div>

                    <div className="flex-1 flex flex-col min-h-[400px] mx-6 mb-4">
                      <div className="editor-container flex-1 flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        {editor && (
                          <>
                            {/* Toolbar */}
                            <div className="editor-toolbar bg-slate-50/80 border-b border-slate-200 p-3">
                              <div className="flex flex-wrap gap-1">
                                {/* Text Formatting */}
                                <div className="flex gap-1 mr-2">
                                  <ToolbarButton
                                    onClick={() =>
                                      editor.chain().focus().toggleBold().run()
                                    }
                                    isActive={editor.isActive("bold")}
                                    icon={Bold}
                                    tooltip="In đậm (Ctrl+B)"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleItalic()
                                        .run()
                                    }
                                    isActive={editor.isActive("italic")}
                                    icon={Italic}
                                    tooltip="In nghiêng (Ctrl+I)"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleUnderline()
                                        .run()
                                    }
                                    isActive={editor.isActive("underline")}
                                    icon={UnderlineIcon}
                                    tooltip="Gạch chân (Ctrl+U)"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleStrike()
                                        .run()
                                    }
                                    isActive={editor.isActive("strike")}
                                    icon={Strikethrough}
                                    tooltip="Gạch ngang"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor.chain().focus().toggleCode().run()
                                    }
                                    isActive={editor.isActive("code")}
                                    icon={Code}
                                    tooltip="Mã inline"
                                  />
                                </div>

                                <Separator
                                  orientation="vertical"
                                  className="h-8 mx-1"
                                />

                                {/* Color */}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-9 w-9 p-0 hover:bg-blue-50"
                                    >
                                      <Palette className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-3 bg-white">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-slate-600" />
                                        <span className="text-sm font-medium">
                                          Màu chữ
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="color"
                                          onInput={(event) =>
                                            editor
                                              .chain()
                                              .focus()
                                              .setColor(
                                                event.currentTarget.value
                                              )
                                              .run()
                                          }
                                          value={
                                            editor?.getAttributes("textStyle")
                                              .color || "#000000"
                                          }
                                          className="h-10 w-16 p-1 border rounded"
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            editor
                                              .chain()
                                              .focus()
                                              .unsetColor()
                                              .run()
                                          }
                                          className="text-xs"
                                        >
                                          Đặt lại
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                <Separator
                                  orientation="vertical"
                                  className="h-8 mx-1"
                                />

                                {/* Headings */}
                                <div className="flex gap-1 mr-2">
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 1 })
                                        .run()
                                    }
                                    isActive={editor.isActive("heading", {
                                      level: 1,
                                    })}
                                    icon={Heading1}
                                    tooltip="Tiêu đề 1"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run()
                                    }
                                    isActive={editor.isActive("heading", {
                                      level: 2,
                                    })}
                                    icon={Heading2}
                                    tooltip="Tiêu đề 2"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 3 })
                                        .run()
                                    }
                                    isActive={editor.isActive("heading", {
                                      level: 3,
                                    })}
                                    icon={Heading3}
                                    tooltip="Tiêu đề 3"
                                  />
                                </div>

                                <Separator
                                  orientation="vertical"
                                  className="h-8 mx-1"
                                />

                                {/* Lists */}
                                <div className="flex gap-1 mr-2">
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                    }
                                    isActive={editor.isActive("bulletList")}
                                    icon={List}
                                    tooltip="Danh sách"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                    }
                                    isActive={editor.isActive("orderedList")}
                                    icon={ListOrdered}
                                    tooltip="Danh sách số"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                    }
                                    isActive={editor.isActive("blockquote")}
                                    icon={Quote}
                                    tooltip="Trích dẫn"
                                  />
                                </div>

                                <Separator
                                  orientation="vertical"
                                  className="h-8 mx-1"
                                />

                                {/* Media */}
                                <div className="flex gap-1 mr-2">
                                  <ToolbarButton
                                    onClick={setLink}
                                    isActive={editor.isActive("link")}
                                    icon={LinkIcon}
                                    tooltip="Thêm liên kết"
                                  />
                                  <ToolbarButton
                                    onClick={addImage}
                                    isActive={false}
                                    icon={ImageIcon}
                                    tooltip="Thêm ảnh"
                                  />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                  />
                                  <ToolbarButton
                                    onClick={addYoutubeVideo}
                                    isActive={false}
                                    icon={YoutubeIcon}
                                    tooltip="Thêm video YouTube"
                                  />
                                  <ToolbarButton
                                    onClick={addTable}
                                    isActive={false}
                                    icon={TableIcon}
                                    tooltip="Thêm bảng"
                                  />
                                </div>

                                <Separator
                                  orientation="vertical"
                                  className="h-8 mx-1"
                                />

                                {/* Alignment */}
                                <div className="flex gap-1 mr-2">
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("left")
                                        .run()
                                    }
                                    isActive={editor.isActive({
                                      textAlign: "left",
                                    })}
                                    icon={AlignLeft}
                                    tooltip="Căn trái"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("center")
                                        .run()
                                    }
                                    isActive={editor.isActive({
                                      textAlign: "center",
                                    })}
                                    icon={AlignCenter}
                                    tooltip="Căn giữa"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("right")
                                        .run()
                                    }
                                    isActive={editor.isActive({
                                      textAlign: "right",
                                    })}
                                    icon={AlignRight}
                                    tooltip="Căn phải"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("justify")
                                        .run()
                                    }
                                    isActive={editor.isActive({
                                      textAlign: "justify",
                                    })}
                                    icon={AlignJustify}
                                    tooltip="Căn đều"
                                  />
                                </div>

                                <Separator
                                  orientation="vertical"
                                  className="h-8 mx-1"
                                />

                                {/* Actions */}
                                <div className="flex gap-1">
                                  <ToolbarButton
                                    onClick={() =>
                                      editor.chain().focus().undo().run()
                                    }
                                    isActive={false}
                                    icon={Undo}
                                    tooltip="Hoàn tác (Ctrl+Z)"
                                  />
                                  <ToolbarButton
                                    onClick={() =>
                                      editor.chain().focus().redo().run()
                                    }
                                    isActive={false}
                                    icon={Redo}
                                    tooltip="Làm lại (Ctrl+Y)"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Bubble Menu */}
                            {editor && (
                              <BubbleMenu
                                editor={editor}
                                tippyOptions={{ duration: 100 }}
                              >
                                <div className="flex gap-1 bg-white p-2 border rounded-lg shadow-xl border-slate-200">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={
                                      editor.isActive("bold")
                                        ? "default"
                                        : "ghost"
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
                                        : "ghost"
                                    }
                                    onClick={() =>
                                      editor
                                        .chain()
                                        .focus()
                                        .toggleItalic()
                                        .run()
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
                                        : "ghost"
                                    }
                                    onClick={setLink}
                                    className="h-8 w-8 p-0"
                                  >
                                    <LinkIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </BubbleMenu>
                            )}

                            {/* Editor Content */}
                            <div className="editor-content flex-1 overflow-auto p-6">
                              <EditorContent
                                editor={editor}
                                className="prose max-w-none"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <FormMessage className="text-red-500 text-xs mx-6" />
                  </FormItem>
                )}
              />

              {/* Footer Actions */}
              <div className="p-6 bg-slate-50/50 border-t">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Sparkles className="w-4 h-4" />
                    <span>Lưu tự động khi bạn gõ</span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="px-6 hover:bg-slate-50 cursor-pointer"
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      type="submit"
                      disabled={creating || updating}
                      className="px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg cursor-pointer"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? "Cập nhật bài viết" : "Xuất bản ngay"}
                      {(creating || updating) && (
                        <Loader className="w-4 h-4 ml-2 animate-spin" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogFormModal;
