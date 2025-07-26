"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  Loader,
} from "lucide-react";
import type {
  MeetingRecord,
  MeetingRecordFormValues,
} from "@/types/meetingRecord";
import { meetingRecordSchema } from "@/schemas/meetingRecord";
import {
  useCreateMeetingRecord,
  useUpdateMeetingRecord,
} from "@/hooks/useMeetingRecord";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { uploadAvatarToSupabase } from "@/lib/utils/uploadImage/uploadImage";
import type { Appointment } from "@/types/appointment";
import "../../../../styles/editor.css";

interface Props {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
  appointmentId: number;
  recordedById: number;
  initialData?: MeetingRecord | null;
  onSuccess?: () => void;
}

function getNowDatetimeLocal(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    now.getFullYear() +
    "-" +
    pad(now.getMonth() + 1) +
    "-" +
    pad(now.getDate()) +
    "T" +
    pad(now.getHours()) +
    ":" +
    pad(now.getMinutes())
  );
}

function generateMeetingContent(appointment?: Appointment) {
  const user = appointment?.user;
  const doctor = appointment?.doctor;
  return `
<h2 style="text-align:center"><strong>BIÊN BẢN TƯ VẤN TRỰC TUYẾN VỀ HIV/AIDS</strong></h2>
<ol>
  <li>
    <strong>Thông tin người được tư vấn:</strong>
    <ul>
      <li>Họ và tên: <u>${user?.name || ".................................................."}</u></li>
      <li>Ngày sinh: <u>....................</u></li>
      <li>Giới tính: <u>....................</u></li>
      <li>Số điện thoại: <u>${user?.phoneNumber || ".................................................."}</u></li>
      <li>Email (nếu có): <u>${user?.email || ".................................................."}</u></li>
      <li>Lý do tư vấn:
        <ul style="list-style-type:none;">
          <li><input type="checkbox" disabled /> Nghi ngờ bị phơi nhiễm HIV</li>
          <li><input type="checkbox" disabled /> Mong muốn xét nghiệm HIV</li>
          <li><input type="checkbox" disabled /> Quan hệ không an toàn</li>
          <li><input type="checkbox" disabled /> Khác: <u>...................................................</u></li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <strong>Thời gian tư vấn:</strong>
    <ul>
      <li>Ngày: <u>${formatDate(getNowDatetimeLocal(), "dd/MM/yyyy")}</u></li>
      <li>Giờ bắt đầu: <u>${formatDate(getNowDatetimeLocal(), "HH:mm")}</u></li>
      <li>Giờ kết thúc: <u>..........</u></li>
    </ul>
  </li>
  <li>
    <strong>Nội dung tư vấn:</strong>
    <div style="min-height:60px; border-bottom:1px dotted #ccc;"></div>
  </li>
  <li>
    <strong>Thông tin bác sĩ tư vấn:</strong>
    <ul>
      <li>Họ và tên: <u>${doctor?.user.name ||"............................"}</u></li>
      <li>Đơn vị công tác: <u>..................................................</u></li>
      <li>Chức danh: <u>${ doctor?.specialization ||"................................................."}</u></li>
      <li>Số điện thoại liên hệ: <u>${ doctor?.user.phoneNumber || ".................................................."}</u></li>
    </ul>
  </li>
  <li>
    <strong>Hướng dẫn sau tư vấn:</strong>
    <ul style="list-style-type:none;">
      <li><input type="checkbox" disabled /> Khuyến khích xét nghiệm HIV sau 28 ngày từ thời điểm có nguy cơ.</li>
      <li><input type="checkbox" disabled /> Cần sử dụng thuốc PEP (phơi nhiễm) nếu còn trong 72 giờ.</li>
      <li><input type="checkbox" disabled /> Tư vấn an toàn tình dục và sử dụng bao cao su đúng cách.</li>
      <li><input type="checkbox" disabled /> Tư vấn điều trị ARV nếu đã xét nghiệm dương tính.</li>
      <li><input type="checkbox" disabled /> Khác: <u>...................................................</u></li>
    </ul>
  </li>
  <li>
    <strong>Ghi chú thêm (nếu có):</strong>
    <div style="min-height:40px; border-bottom:1px dotted #ccc;"></div>
  </li>
</ol>
<hr />
<p><strong>Xác nhận của người được tư vấn</strong><br />
Tôi xác nhận đã được tư vấn đầy đủ, rõ ràng, dễ hiểu về HIV/AIDS và các phương án phù hợp.</p>
<p>Chữ ký (nếu có): <u>.................................</u></p>
<p><strong>Ngày lập biên bản</strong>: <u>${formatDate(getNowDatetimeLocal(), "dd/MM/yyyy")}</u></p>
`;
}

export default function MeetingRecordFormModal({
  open,
  onClose,
  appointment,
  appointmentId,
  recordedById,
  initialData,
  onSuccess,
}: Props) {
  const form = useForm<MeetingRecordFormValues>({
    resolver: zodResolver(meetingRecordSchema),
    defaultValues: {
      appointmentId: appointmentId ?? 0,
      recordedById: recordedById ?? 0,
      title: "",
      content: "",
      startTime: "",
      endTime: "",
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      Underline,
      Placeholder.configure({
        placeholder: "Nhập nội dung biên bản cuộc họp...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

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

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadAvatarToSupabase(file, String(recordedById));
      editor?.chain().focus().setImage({ src: url }).run();
      toast.success("Tải ảnh lên thành công!");
    } catch (err) {
      console.log(err);
      toast.error("Tải ảnh thất bại!");
    } finally {
      e.target.value = "";
    }
  };

  const { mutate: createMeetingRecord, isPending: isCreating } =
    useCreateMeetingRecord();
  const { mutate: updateMeetingRecord, isPending: isUpdating } =
    useUpdateMeetingRecord();

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        appointmentId,
        recordedById,
        title: initialData.title,
        content: initialData.content,
        startTime: formatDate(initialData.startTime, "yyyy-MM-dd'T'HH:mm"),
        endTime: formatDate(initialData.endTime, "yyyy-MM-dd'T'HH:mm"),
      });
    } else {
      reset({
        appointmentId,
        recordedById,
        title: "",
        content: generateMeetingContent(appointment),
        startTime: getNowDatetimeLocal(),
        endTime: "",
      });
    }
  }, [initialData, appointmentId, recordedById, reset, appointment]);

  useEffect(() => {
    if (!editor) return;

    if (open) {
      if (initialData?.content) {
        editor.commands.setContent(initialData.content);
      } else {
        editor.commands.setContent(generateMeetingContent(appointment));
      }
    }
  }, [editor, open, initialData, appointment]);

  const onSubmit = (values: MeetingRecordFormValues) => {
    const finalData = {
      ...values,
      appointmentId,
      recordedById,
      endTime: values.endTime || getNowDatetimeLocal(),
    };
    if (isEditMode && initialData) {
      updateMeetingRecord(
        { id: initialData.id, data: finalData },
        {
          onSuccess: () => {
            toast.success("Cập nhật biên bản thành công");
            onSuccess?.();
            onClose();
          },
        }
      );
    } else {
      createMeetingRecord(finalData, {
        onSuccess: () => {
          toast.success("Tạo biên bản thành công");
          onSuccess?.();
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-3xl max-h-[90vh] flex flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? "Chỉnh sửa biên bản cuộc họp"
              : "Tạo biên bản cuộc họp"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 flex-1 flex flex-col min-h-0"
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề biên bản" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="content"
              render={() => (
                <FormItem className="flex-1 flex flex-col">
                  <FormLabel>Nội dung biên bản</FormLabel>
                  <div className="editor-container border rounded-md flex-1 flex flex-col">
                    {editor && (
                      <>
                        <div className="editor-toolbar p-2 border-b flex flex-wrap gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant={
                              editor.isActive("bold") ? "default" : "outline"
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
                              editor.isActive("italic") ? "default" : "outline"
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
                                ? "default"
                                : "outline"
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
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant={
                              editor.isActive({ textAlign: "left" })
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              editor.chain().focus().setTextAlign("left").run()
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
                                ? "default"
                                : "outline"
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
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              editor.chain().focus().setTextAlign("right").run()
                            }
                            className="h-8 w-8 p-0"
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={
                              editor.isActive("bulletList")
                                ? "default"
                                : "outline"
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
                                ? "default"
                                : "outline"
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
                            variant="outline"
                            onClick={() => editor.chain().focus().undo().run()}
                            className="h-8 w-8 p-0"
                          >
                            <Undo className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => editor.chain().focus().redo().run()}
                            className="h-8 w-8 p-0"
                          >
                            <Redo className="h-4 w-4" />
                          </Button>
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

                        <div className="editor-content flex-1 overflow-y-auto p-4">
                          <EditorContent editor={editor} />
                        </div>
                      </>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isCreating || isUpdating}
                className="cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                variant="outline"
                className="cursor-pointer"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Đang xử lý...
                  </>
                ) : isEditMode ? (
                  "Cập nhật biên bản"
                ) : (
                  "Tạo biên bản"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
