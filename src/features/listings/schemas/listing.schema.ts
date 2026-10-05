import { z } from 'zod';

const requiredText = (message: string) =>
  z.string().trim().min(1, message);

const nullableText = z
  .string()
  .trim()
  .optional()
  .nullable();

export const listingSchema = z.object({
  property_id: requiredText('انتخاب ملک الزامی است.'),

  title: requiredText('عنوان آگهی الزامی است.')
    .min(3, 'عنوان آگهی باید حداقل ۳ کاراکتر باشد.')
    .max(200, 'عنوان آگهی نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد.'),

  description: nullableText,

  advertiser_type: z.enum([
    'owner',
    'agent',
    'authorized_representative',
  ]),

  transaction_type: z.enum([
    'sale',
    'rent',
    'mortgage_rent',
    'presale',
    'exchange',
  ]),

  listing_kind: z
    .enum([
      'standard',
      'short_term',
    ])
    .default('standard'),

  advertiser_user_id: z
    .string()
    .uuid('شناسه کاربر آگهی‌دهنده معتبر نیست.')
    .optional()
    .nullable(),
});

export type ListingSchemaInput = z.input<
  typeof listingSchema
>;

export type ListingSchemaOutput = z.output<
  typeof listingSchema
>;