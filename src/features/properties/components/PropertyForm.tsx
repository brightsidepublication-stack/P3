import { useState, type FormEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { usePropertyCategories } from '../hooks/usePropertyCategories';
import {
  useProvinces,
  useCities,
  useDistricts,
  useNeighborhoods,
} from '../hooks/useGeography';
import { propertyFormSchema } from '../schemas/property.schema';
import type { PropertyFormInput } from '@/services/properties.service';

type RawForm = {
  title: string;
  description: string;
  category_id: string;
  province_id: string;
  city_id: string;
  district_id: string;
  neighborhood_id: string;
  address: string;
  latitude: string;
  longitude: string;
  land_area: string;
  building_area: string;
  year_built: string;
};

const EMPTY: RawForm = {
  title: '',
  description: '',
  category_id: '',
  province_id: '',
  city_id: '',
  district_id: '',
  neighborhood_id: '',
  address: '',
  latitude: '',
  longitude: '',
  land_area: '',
  building_area: '',
  year_built: '',
};

type Props = {
  initialValues?: Partial<RawForm>;
  submitting: boolean;
  submitLabel: string;
  errorMessage?: string | null;
  onSubmit: (values: PropertyFormInput) => void | Promise<void>;
  onCancel?: () => void;
};

export function PropertyForm({
  initialValues,
  submitting,
  submitLabel,
  errorMessage,
  onSubmit,
  onCancel,
}: Props) {
  const categories = usePropertyCategories();
  const provinces = useProvinces();

  const [v, setV] = useState<RawForm>(() => ({
    ...EMPTY,
    ...(initialValues ?? {}),
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = useCities(v.province_id || undefined);
  const districts = useDistricts(v.city_id || undefined);
  const neighborhoods = useNeighborhoods(
    v.district_id || undefined
  );

  const set = (key: keyof RawForm, value: string) => {
    setV((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = propertyFormSchema.safeParse(v);

    if (!parsed.success) {
      const map: Record<string, string> = {};

      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '_');

        if (!map[key]) {
          map[key] = issue.message;
        }
      }

      setErrors(map);
      return;
    }

    const d = parsed.data;

    const payload: PropertyFormInput = {
      title: d.title,
      description: d.description ?? null,
      category_id: d.category_id,
      province_id: d.province_id,
      city_id: d.city_id,
      district_id: d.district_id || null,
      neighborhood_id: d.neighborhood_id || null,
      address: d.address ?? null,
      latitude: d.latitude ?? null,
      longitude: d.longitude ?? null,
      land_area: d.land_area ?? null,
      building_area: d.building_area ?? null,
      year_built: d.year_built ?? null,
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      noValidate
    >
      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          اطلاعات اصلی
        </h2>

        <div className="flex flex-col gap-3">
          <FormField
            label="عنوان ملک"
            id="pf-title"
            required
            error={errors.title}
          >
            <Input
              id="pf-title"
              value={v.title}
              onChange={(e) => set('title', e.target.value)}
              disabled={submitting}
              placeholder="مثلاً: آپارتمان ۹۰ متری در سعادت‌آباد"
            />
          </FormField>

          <FormField
            label="دسته‌بندی"
            id="pf-category"
            required
            error={errors.category_id}
          >
            <Select
              id="pf-category"
              value={v.category_id}
              onChange={(e) =>
                set('category_id', e.target.value)
              }
              disabled={submitting || categories.loading}
            >
              <option value="">— انتخاب کنید —</option>

              {categories.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            {!categories.loading &&
            categories.items.length === 0 ? (
              <p className="mt-1 text-xs text-slate-500">
                دسته‌بندی‌ای در سیستم ثبت نشده است.
              </p>
            ) : null}
          </FormField>

          <FormField
            label="توضیحات"
            id="pf-desc"
            error={errors.description}
          >
            <Textarea
              id="pf-desc"
              value={v.description}
              onChange={(e) =>
                set('description', e.target.value)
              }
              disabled={submitting}
              rows={4}
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          موقعیت
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            label="استان"
            id="pf-province"
            required
            error={errors.province_id}
          >
            <Select
              id="pf-province"
              value={v.province_id}
              onChange={(e) => {
                const id = e.target.value;

                setV((prev) => ({
                  ...prev,
                  province_id: id,
                  city_id: '',
                  district_id: '',
                  neighborhood_id: '',
                }));
              }}
              disabled={submitting || provinces.loading}
            >
              <option value="">— انتخاب کنید —</option>

              {provinces.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>

            {!provinces.loading &&
            provinces.items.length === 0 ? (
              <p className="mt-1 text-xs text-slate-500">
                استانی در سیستم ثبت نشده است.
              </p>
            ) : null}
          </FormField>

          <FormField
            label="شهر"
            id="pf-city"
            required
            error={errors.city_id}
          >
            <Select
              id="pf-city"
              value={v.city_id}
              onChange={(e) => {
                const id = e.target.value;

                setV((prev) => ({
                  ...prev,
                  city_id: id,
                  district_id: '',
                  neighborhood_id: '',
                }));
              }}
              disabled={
                submitting ||
                !v.province_id ||
                cities.loading
              }
            >
              <option value="">— انتخاب کنید —</option>

              {cities.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="منطقه (اختیاری)"
            id="pf-district"
            error={errors.district_id}
          >
            <Select
              id="pf-district"
              value={v.district_id}
              onChange={(e) => {
                const id = e.target.value;

                setV((prev) => ({
                  ...prev,
                  district_id: id,
                  neighborhood_id: '',
                }));
              }}
              disabled={
                submitting ||
                !v.city_id ||
                districts.loading
              }
            >
              <option value="">— بدون منطقه —</option>

              {districts.items.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="محله (اختیاری)"
            id="pf-neighbor"
            error={errors.neighborhood_id}
          >
            <Select
              id="pf-neighbor"
              value={v.neighborhood_id}
              onChange={(e) =>
                set('neighborhood_id', e.target.value)
              }
              disabled={
                submitting ||
                !v.district_id ||
                neighborhoods.loading
              }
            >
              <option value="">— بدون محله —</option>

              {neighborhoods.items.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="sm:col-span-2">
            <FormField
              label="آدرس"
              id="pf-address"
              error={errors.address}
            >
              <Textarea
                id="pf-address"
                value={v.address}
                onChange={(e) =>
                  set('address', e.target.value)
                }
                disabled={submitting}
                rows={2}
              />
            </FormField>
          </div>

          <FormField
            label="عرض جغرافیایی (اختیاری)"
            id="pf-lat"
            error={errors.latitude}
          >
            <Input
              id="pf-lat"
              inputMode="decimal"
              value={v.latitude}
              onChange={(e) =>
                set('latitude', e.target.value)
              }
              disabled={submitting}
              placeholder="35.6892"
            />
          </FormField>

          <FormField
            label="طول جغرافیایی (اختیاری)"
            id="pf-lng"
            error={errors.longitude}
          >
            <Input
              id="pf-lng"
              inputMode="decimal"
              value={v.longitude}
              onChange={(e) =>
                set('longitude', e.target.value)
              }
              disabled={submitting}
              placeholder="51.3890"
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          مشخصات
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FormField
            label="متراژ زمین (متر)"
            id="pf-land"
            error={errors.land_area}
          >
            <Input
              id="pf-land"
              inputMode="numeric"
              value={v.land_area}
              onChange={(e) =>
                set('land_area', e.target.value)
              }
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="متراژ بنا (متر)"
            id="pf-build"
            error={errors.building_area}
          >
            <Input
              id="pf-build"
              inputMode="numeric"
              value={v.building_area}
              onChange={(e) =>
                set('building_area', e.target.value)
              }
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="سال ساخت"
            id="pf-year"
            error={errors.year_built}
          >
            <Input
              id="pf-year"
              inputMode="numeric"
              value={v.year_built}
              onChange={(e) =>
                set('year_built', e.target.value)
              }
              disabled={submitting}
            />
          </FormField>
        </div>
      </Card>

      {errorMessage ? (
        <p
          className="text-sm text-red-600"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'در حال ذخیره...' : submitLabel}
        </Button>

        {onCancel ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            انصراف
          </Button>
        ) : null}
      </div>
    </form>
  );
}