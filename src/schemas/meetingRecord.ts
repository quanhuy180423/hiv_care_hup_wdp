import { z } from "zod";

export const meetingRecordSchema = z.object({
  appointmentId: z.number().int().positive("ID cuộc hẹn không hợp lệ"),
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Thời gian bắt đầu không hợp lệ",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Thời gian kết thúc không hợp lệ",
  }),
  recordedById: z.number().int().positive("ID người ghi biên bản không hợp lệ"),
});
