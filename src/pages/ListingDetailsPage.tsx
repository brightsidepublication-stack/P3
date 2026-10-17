import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { toAppError } from '@/lib/errors';
import {
  getListingById,
  type ListingRow,
} from '@/services/listings.service';
import {
  getPropertyById,
  type PropertyRow,
} from '@/services/properties.service';
import { ROUTES } from '@/constants/routes';

const TRANSACTION_LABELS: Record<string, string> = {
  sale: 'خرید و فروش',
  rent: 'اجاره',
  mortgage_rent: 'رهن و اجاره',
  presale: 'پیش‌فروش',
  exchange: 'معاوضه',
};

export function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingRow | null>(null);
  const [property, setProperty] = useState<PropertyRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!id) {
        setError('شناسه آگهی معتبر نیست.');
        return;
      }

      const foundListing = await getListingById(id);
      if (!foundListing || foundListing.status !== 'published' || foundListing.visibility !== 'public') {
        setError('این آگهی وجود ندارد یا در حال حاضر عمومی نیست.');
        return;
      }

      const foundProperty = await getPropertyById(foundListing.property_id);
      if (!foundProperty) {
        setError('اطلاعات ملک مرتبط با این آگهی در دسترس نیست.');
        return;
      }

      setListing(foundListing);
      setProperty(foundProperty);
    } catch (cause) {
      setError(toAppError(cause).userMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !listing || !property) {
    return (
      <ErrorState
        title="آگهی در دسترس نیست"
        message={error ?? 'اطلاعات آگهی کامل نیست.'}
        onRetry={() => void load()}
        action={
          <Link to={ROUTES.browse}>
            <Button type="button" variant="secondary">بازگشت به آگهی‌ها</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={listing.title}
        description={TRANSACTION_LABELS[listing.transaction_type] ?? listing.transaction_type}
        actions={
          <Link to={ROUTES.browse}>
            <Button type="button" variant="secondary">همه آگهی‌ها</Button>
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-slate-900">مشخصات ملک</h2>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Detail label="عنوان ملک" value={property.title} />
              <Detail label="متراژ زمین" value={formatNumber(property.land_area, ' متر')} />
              <Detail label="متراژ بنا" value={formatNumber(property.building_area, ' متر')} />
              <Detail label="سال ساخت" value={formatNumber(property.year_built)} />
              <Detail label="آدرس" value={property.address ?? 'ثبت نشده'} />
            </dl>
            {property.description ? (
              <p className="mt-5 whitespace-pre-line border-t border-slate-100 pt-4 text-sm leading-7 text-slate-700">
                {property.description}
              </p>
            ) : null}
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="mb-3 text-base font-semibold text-slate-900">درباره آگهی</h2>
            {listing.description ? (
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {listing.description}
              </p>
            ) : (
              <p className="text-sm text-slate-500">توضیحات تکمیلی ثبت نشده است.</p>
            )}
            {listing.published_at ? (
              <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                تاریخ انتشار: {new Date(listing.published_at).toLocaleDateString('fa-IR')}
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 break-words font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function formatNumber(value: number | null | undefined, suffix = ''): string {
  if (value == null) return 'ثبت نشده';
  return new Intl.NumberFormat('fa-IR').format(value) + suffix;
}
