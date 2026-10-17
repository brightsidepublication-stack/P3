import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { toAppError } from '@/lib/errors';
import { listPublicListings, type ListingRow } from '@/services/listings.service';
import { ROUTES } from '@/constants/routes';

const TRANSACTION_LABELS: Record<string, string> = {
  sale: 'خرید و فروش',
  rent: 'اجاره',
  mortgage_rent: 'رهن و اجاره',
  presale: 'پیش‌فروش',
  exchange: 'معاوضه',
};

export function PublicListingsPage() {
  const [items, setItems] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listPublicListings());
    } catch (cause) {
      setError(toAppError(cause).userMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="دریافت آگهی‌ها انجام نشد"
        message={error}
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="آگهی‌های املاک"
        description="آگهی‌های تأییدشده و منتشرشده"
        actions={
          <Link to={ROUTES.listings.root}>
            <Button type="button" variant="secondary">آگهی‌های من</Button>
          </Link>
        }
      />

      {items.length === 0 ? (
        <Card>
          <div className="py-8 text-center">
            <h2 className="font-semibold text-slate-900">هنوز آگهی عمومی منتشر نشده است</h2>
            <p className="mt-2 text-sm text-slate-600">
              پس از بررسی و تأیید آگهی‌ها، آن‌ها در این صفحه نمایش داده می‌شوند.
            </p>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((listing) => (
            <Card key={listing.id} className="flex h-full flex-col">
              <div className="flex-1">
                <h2 className="text-base font-semibold leading-7 text-slate-900">
                  {listing.title}
                </h2>
                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
                  {TRANSACTION_LABELS[listing.transaction_type] ?? listing.transaction_type}
                </span>
                {listing.description ? (
                  <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {listing.description}
                  </p>
                ) : null}
                {listing.published_at ? (
                  <p className="mt-3 text-xs text-slate-500">
                    انتشار: {new Date(listing.published_at).toLocaleDateString('fa-IR')}
                  </p>
                ) : null}
              </div>
              <div className="mt-4">
                <Link to={ROUTES.listings.details(listing.id)}>
                  <Button type="button" className="w-full">مشاهده جزئیات</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
