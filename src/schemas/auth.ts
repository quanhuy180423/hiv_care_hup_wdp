import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().optional(),
  totpCode: z.string().optional(),
  code: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên là bắt buộc")
      .min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    phoneNumber: z
      .string()
      .min(1, "Số điện thoại là bắt buộc")
      .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    code: z.string().min(1, "Mã xác thực là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const sentOtpSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  type: z.enum(['REGISTER', 'FORGOT_PASSWORD', 'LOGIN', 'DISABLE_2FA']),
});

export type SentOtpFormData = z.infer<typeof sentOtpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  code: z.string().min(1, "Mã xác thực là bắt buộc"),
  newPassword: z
    .string()
    .min(1, "Mật khẩu mới là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Mật khẩu hiện tại là bắt buộc"),
  newPassword: z
    .string()
    .min(1, "Mật khẩu mới là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
