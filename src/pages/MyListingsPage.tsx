import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { useListings } from '@/features/listings/hooks/useListings';
import { toAppError } from '@/lib/errors';
import { submitListingForReview } from '@/services/listings.service';
import { ROUTES } from '@/constants/routes';

const STATUS_LABELS: Record<string, string> = {
  draft: 'پیش‌نویس',
  pending_review: 'در انتظار بررسی',
  published: 'منتشرشده',
  rejected: 'ردشده',
  archived: 'بایگانی‌شده',
};

const TRANSACTION_LABELS: Record<string, string> = {
  sale: 'خرید و فروش',
  rent: 'اجاره',
  mortgage_rent: 'رهن و اجاره',
  presale: 'پیش‌فروش',
  exchange: 'معاوضه',
};

export function MyListingsPage() {
  const { items, loading, error, reload } = useListings();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmitForReview = async (id: string) => {
    setBusyId(id);
    setActionError(null);
    setNotice(null);

    try {
      await submitListingForReview(id);
      setNotice('آگهی با موفقیت برای بررسی ارسال شد.');
      await reload();
    } catch (cause) {
      setActionError(toAppError(cause).userMessage);
    } finally {
      setBusyId(null);
    }
  };

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
        title="آگهی‌های من"
        description="پیش‌نویس‌ها و وضعیت بررسی آگهی‌های شما"
        actions={
          <Link to={ROUTES.listings.new}>
            <Button type="button">
              <Plus aria-hidden="true" className="me-2 h-4 w-4" />
              ثبت آگهی
            </Button>
          </Link>
        }
      />

      {notice ? (
        <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </p>
      ) : null}

      {items.length === 0 ? (
        <Card>
          <div className="py-6 text-center">
            <h2 className="font-semibold text-slate-900">هنوز آگهی‌ای ثبت نکرده‌اید</h2>
            <p className="mt-2 text-sm text-slate-600">
              ابتدا اطلاعات ملک را ثبت کنید، سپس برای آن آگهی بسازید.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link to={ROUTES.listings.new}>
                <Button>ثبت آگهی جدید</Button>
              </Link>
              <Link to={ROUTES.properties.root}>
                <Button variant="secondary">مشاهده املاک من</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((listing) => (
            <Card key={listing.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="break-words text-base font-semibold text-slate-900">
                    {listing.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                      {STATUS_LABELS[listing.status] ?? listing.status}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-800">
                      {TRANSACTION_LABELS[listing.transaction_type] ?? listing.transaction_type}
                    </span>
                  </div>
                  {listing.description ? (
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {listing.description}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs text-slate-500">
                    تاریخ ثبت: {new Date(listing.created_at).toLocaleDateString('fa-IR')}
                  </p>
                  {listing.status === 'rejected' && listing.rejected_reason ? (
                    <p className="mt-2 text-sm text-red-700">
                      علت رد: {listing.rejected_reason}
                    </p>
                  ) : null}
                </div>

                {(listing.status === 'draft' || listing.status === 'rejected') ? (
                  <div className="flex flex-wrap gap-2">
                    <Link to={ROUTES.listings.edit(listing.id)}>
                      <Button type="button" variant="secondary" size="sm">
                        ویرایش
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      disabled={busyId === listing.id}
                      onClick={() => void handleSubmitForReview(listing.id)}
                    >
                      {busyId === listing.id ? 'در حال ارسال...' : 'ارسال برای بررسی'}
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <Button type="button" variant="ghost" onClick={() => void reload()}>
          <RefreshCw aria-hidden="true" className="me-2 h-4 w-4" />
          به‌روزرسانی فهرست
        </Button>
      </div>
    </div>
  );
}
