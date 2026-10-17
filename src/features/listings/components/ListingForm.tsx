import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { listingSchema } from '@/features/listings/schemas/listing.schema';
import type { PropertyRow } from '@/services/properties.service';
import type { ListingFormInput } from '@/services/listings.service';

type RawForm = {
  property_id: string;
  title: string;
  description: string;
  advertiser_type: 'owner' | 'agent' | 'authorized_representative';
  transaction_type: 'sale' | 'rent' | 'mortgage_rent' | 'presale' | 'exchange';
};

type Props = {
  properties: PropertyRow[];
  submitting: boolean;
  errorMessage?: string | null;
  onSubmit: (values: ListingFormInput) => void | Promise<void>;
  onCancel?: () => void;
};

const EMPTY: RawForm = {
  property_id: '',
  title: '',
  description: '',
  advertiser_type: 'owner',
  transaction_type: 'sale',
};

export function ListingForm({
  properties,
  submitting,
  errorMessage,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState<RawForm>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof RawForm,>(key: K, value: RawForm[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const parsed = listingSchema.safeParse({
      ...values,
      description: values.description.trim() || null,
      listing_kind: 'standard',
    });

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '_');
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    const data = parsed.data;
    await onSubmit({
      property_id: data.property_id,
      title: data.title,
      description: data.description ?? null,
      advertiser_type: data.advertiser_type,
      transaction_type: data.transaction_type,
      listing_kind: 'standard',
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Card>
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          اطلاعات آگهی
        </h2>

        <div className="flex flex-col gap-4">
          <FormField
            label="ملک مرتبط"
            id="lf-property"
            required
            error={errors.property_id}
            hint="ابتدا باید اطلاعات پایه ملک را در بخش «املاک من» ثبت کرده باشید."
          >
            <Select
              id="lf-property"
              value={values.property_id}
              onChange={(event) => set('property_id', event.target.value)}
              disabled={submitting || properties.length === 0}
              required
            >
              <option value="">— انتخاب ملک —</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </Select>
            {properties.length === 0 ? (
              <p className="mt-1 text-xs text-amber-700">
                هنوز ملکی ثبت نکرده‌اید. ابتدا یک ملک ثبت کنید و سپس آگهی آن را بسازید.
              </p>
            ) : null}
          </FormField>

          <FormField
            label="عنوان آگهی"
            id="lf-title"
            required
            error={errors.title}
          >
            <Input
              id="lf-title"
              value={values.title}
              onChange={(event) => set('title', event.target.value)}
              disabled={submitting}
              maxLength={200}
              placeholder="مثلاً: فروش آپارتمان دوخوابه نزدیک مرکز شهر"
              required
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="نوع معامله"
              id="lf-transaction"
              required
              error={errors.transaction_type}
            >
              <Select
                id="lf-transaction"
                value={values.transaction_type}
                onChange={(event) =>
                  set('transaction_type', event.target.value as RawForm['transaction_type'])
                }
                disabled={submitting}
              >
                <option value="sale">خرید و فروش</option>
                <option value="rent">اجاره</option>
                <option value="mortgage_rent">رهن و اجاره</option>
                <option value="presale">پیش‌فروش</option>
                <option value="exchange">معاوضه</option>
              </Select>
            </FormField>

            <FormField
              label="آگهی‌دهنده"
              id="lf-advertiser"
              required
              error={errors.advertiser_type}
            >
              <Select
                id="lf-advertiser"
                value={values.advertiser_type}
                onChange={(event) =>
                  set('advertiser_type', event.target.value as RawForm['advertiser_type'])
                }
                disabled={submitting}
              >
                <option value="owner">مالک</option>
                <option value="agent">مشاور املاک</option>
                <option value="authorized_representative">نماینده مجاز</option>
              </Select>
            </FormField>
          </div>

          <FormField
            label="توضیحات آگهی"
            id="lf-description"
            error={errors.description}
            hint="جزئیات تکمیلی، شرایط معامله و اطلاعات مهم ملک را وارد کنید."
          >
            <Textarea
              id="lf-description"
              value={values.description}
              onChange={(event) => set('description', event.target.value)}
              disabled={submitting}
              rows={5}
              maxLength={10000}
              placeholder="توضیحات ملک و شرایط معامله..."
            />
          </FormField>
        </div>
      </Card>

      <p className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-900">
        آگهی ابتدا به‌صورت پیش‌نویس ذخیره می‌شود. پس از ثبت، می‌توانید آن را برای بررسی ارسال کنید؛
        انتشار عمومی فقط پس از تأیید و از مسیر مجاز انجام می‌شود.
      </p>

      {errorMessage ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={submitting || properties.length === 0}>
          {submitting ? 'در حال ذخیره...' : 'ذخیره پیش‌نویس آگهی'}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            انصراف
          </Button>
        ) : null}
      </div>
    </form>
  );
}
