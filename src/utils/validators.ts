import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .email('ایمیل معتبر نیست.');

export const passwordSchema = z
  .string()
  .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد.');

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, 'نام باید حداقل ۲ کاراکتر باشد.')
  .max(100, 'نام بیش از حد طولانی است.');

export const phoneSchema = z
  .string()
  .trim()
  .max(30, 'شماره تلفن بیش از حد طولانی است.');

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'رمز عبور را وارد کنید.'),
});

export const profileUpdateSchema = z.object({
  displayName: displayNameSchema.optional(),
  phone: phoneSchema.optional(),
  avatarUrl: z.string().url('آدرس تصویر معتبر نیست.').optional().or(z.literal('')),
});
