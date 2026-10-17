import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { toAppError } from '@/lib/errors';
import {
  listListingsForReview,
  publishListing,
  rejectListing,
  type ListingRow,
} from '@/services/listings.service';

const TRANSACTION_LABELS: Record<string, string> = {
  sale: 'خرید و فروش',
  rent: 'اجاره',
  mortgage_rent: 'رهن و اجاره',
  presale: 'پیش‌فروش',
  exchange: 'معاوضه',
};

const ADVERTISER_LABELS: Record<string, string> = {
  owner: 'مالک',
  agent: 'مشاور املاک',
  authorized_representative: 'نماینده مجاز',
};

export function AdminListingsPage() {
  const [items, setItems] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listListingsForReview());
    } catch (cause) {
      setError(toAppError(cause).userMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handlePublish = async (id: string) => {
    setBusyId(id);
    setActionError(null);
    setNotice(null);
    try {
      await publishListing(id);
      setNotice('آگهی منتشر شد.');
      await reload();
    } catch (cause) {
      setActionError(toAppError(cause).userMessage);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = reasons[id]?.trim() ?? '';
    if (!reason) {
      setActionError('پیش از رد آگهی، دلیل رد را وارد کنید.');
      return;
    }

    setBusyId(id);
    setActionError(null);
    setNotice(null);
    try {
      await rejectListing(id, reason);
      setNotice('آگهی رد شد و دلیل برای صاحب آگهی ثبت شد.');
      setReasons((current) => ({ ...current, [id]: '' }));
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
        title="دریافت آگهی‌های در انتظار بررسی انجام نشد"
        message={error}
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="بررسی آگهی‌ها"
        description="آگهی‌های ارسال‌شده را بررسی کنید؛ انتشار عمومی فقط از این مسیر و با مجوز مدیر انجام می‌شود."
        actions={
          <Button type="button" variant="secondary" onClick={() => void reload()}>
            به‌روزرسانی
          </Button>
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
          <div className="py-8 text-center">
            <h2 className="font-semibold text-slate-900">آگهی در انتظار بررسی وجود ندارد</h2>
            <p className="mt-2 text-sm text-slate-600">
              با ارسال آگهی جدید برای بررسی، موارد در این صفحه نمایش داده می‌شوند.
            </p>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((listing) => (
            <Card key={listing.id}>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{listing.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-800">
                      {TRANSACTION_LABELS[listing.transaction_type] ?? listing.transaction_type}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                      {ADVERTISER_LABELS[listing.advertiser_type] ?? listing.advertiser_type}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">
                      {listing.listing_kind === 'short_term' ? 'اقامت کوتاه‌مدت' : 'آگهی معمولی'}
                    </span>
                  </div>
                  {listing.description ? (
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
                      {listing.description}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">توضیحی ثبت نشده است.</p>
                  )}
                  <p className="mt-3 break-all text-xs text-slate-500">
                    شناسه ملک: {listing.property_id}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    تاریخ ارسال: {new Date(listing.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>

                {listing.listing_kind === 'short_term' ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                    پیش از انتشار، اطلاعات اقامت کوتاه‌مدت باید در جدول اطلاعات تکمیلی ثبت شده باشد. اگر ثبت نشده باشد، پایگاه داده انتشار را رد می‌کند.
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label htmlFor={`reject-${listing.id}`} className="mb-1.5 block text-sm font-medium text-slate-700">
                      دلیل رد (در صورت رد آگهی)
                    </label>
                    <Input
                      id={`reject-${listing.id}`}
                      value={reasons[listing.id] ?? ''}
                      onChange={(event) => setReasons((current) => ({
                        ...current,
                        [listing.id]: event.target.value,
                      }))}
                      disabled={busyId === listing.id}
                      placeholder="مثلاً: لطفاً آدرس یا اطلاعات قیمت را تکمیل کنید"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      disabled={busyId === listing.id}
                      onClick={() => void handlePublish(listing.id)}
                    >
                      {busyId === listing.id ? 'در حال انجام...' : 'تأیید و انتشار'}
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      disabled={busyId === listing.id}
                      onClick={() => void handleReject(listing.id)}
                    >
                      رد آگهی
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
