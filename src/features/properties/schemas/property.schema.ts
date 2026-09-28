import { z } from 'zod';

/**
 * Property form schema (MVP).
 * Persian messages for UX only — NOT a security boundary.
 * The DB remains authoritative.
 */

const optionalText = (max: number, msg: string) =>
  z
    .string()
    .trim()
    .max(max, msg)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v));

const optionalNumber = (opts: {
  min: number;
  max: number;
  message: string;
}) =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === '' || v === null) return undefined;

      const n = typeof v === 'number' ? v : Number(v);

      return Number.isFinite(n) ? n : NaN;
    })
    .refine(
      (v) =>
        v === undefined ||
        (!Number.isNaN(v) && v >= opts.min && v <= opts.max),
      {
        message: opts.message,
      }
    );

export const propertyFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'عنوان ملک الزامی است')
    .max(200, 'عنوان حداکثر ۲۰۰ کاراکتر است'),

  description: optionalText(
    5000,
    'توضیحات حداکثر ۵۰۰۰ کاراکتر است'
  ),

  category_id: z.string().min(1, 'انتخاب دسته‌بندی الزامی است'),
  province_id: z.string().min(1, 'انتخاب استان الزامی است'),
  city_id: z.string().min(1, 'انتخاب شهر الزامی است'),

  district_id: z.string().optional().or(z.literal('')),
  neighborhood_id: z.string().optional().or(z.literal('')),

  address: optionalText(
    500,
    'آدرس حداکثر ۵۰۰ کاراکتر است'
  ),

  latitude: optionalNumber({
    min: -90,
    max: 90,
    message: 'عرض جغرافیایی باید بین ‎-۹۰‎ و ‎۹۰‎ باشد',
  }),

  longitude: optionalNumber({
    min: -180,
    max: 180,
    message: 'طول جغرافیایی باید بین ‎-۱۸۰‎ و ‎۱۸۰‎ باشد',
  }),

  land_area: optionalNumber({
    min: 0,
    max: 1_000_000,
    message: 'متراژ زمین نمی‌تواند منفی باشد',
  }),

  building_area: optionalNumber({
    min: 0,
    max: 1_000_000,
    message: 'متراژ بنا نمی‌تواند منفی باشد',
  }),

  // Aligned with the DB constraint (1000–2500).
  year_built: optionalNumber({
    min: 1000,
    max: 2500,
    message: 'سال ساخت باید بین ۱۰۰۰ و ۲۵۰۰ باشد',
  }),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;