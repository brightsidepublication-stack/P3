import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { ListingForm } from '@/features/listings/components/ListingForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toAppError } from '@/lib/errors';
import {
  getListingById,
  updateListing,
  type ListingFormInput,
  type ListingRow,
} from '@/services/listings.service';
import {
  listOwnProperties,
  type PropertyRow,
} from '@/services/properties.service';
import { ROUTES } from '@/constants/routes';

export function ListingEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [listing, setListing] = useState<ListingRow | null>(null);
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (authLoading) return;
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        setError('برای ویرایش آگهی ابتدا وارد حساب شوید.');
        return;
      }
      if (!id) {
        setError('شناسه آگهی معتبر نیست.');
        return;
      }

      const existing = await getListingById(id);
      if (!existing) {
        setError('آگهی موردنظر پیدا نشد.');
        return;
      }
      if (existing.created_by !== user.id) {
        setError('شما اجازه ویرایش این آگهی را ندارید.');
        return;
      }
      if (existing.status !== 'draft' && existing.status !== 'rejected') {
        setError('فقط آگهی‌های پیش‌نویس یا ردشده قابل ویرایش هستند.');
        return;
      }
      if (existing.listing_kind !== 'standard') {
        setError('ویرایش آگهی اقامت کوتاه‌مدت در فرم فعلی پشتیبانی نمی‌شود؛ برای جلوگیری از تغییر ناخواسته نوع آگهی، این مورد قابل ویرایش نیست.');
        return;
      }

      const ownProperties = await listOwnProperties();
      setListing(existing);
      setProperties(ownProperties);
    } catch (cause) {
      setError(toAppError(cause).userMessage);
    } finally {
      setLoading(false);
    }
  }, [authLoading, id, user]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (values: ListingFormInput) => {
    if (!id) return;
    setSubmitting(true);
    setError(null);

    try {
      await updateListing(id, values);
      navigate(ROUTES.listings.root, { replace: true });
    } catch (cause) {
      setError(toAppError(cause).userMessage);
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <ErrorState
        title="ویرایش آگهی ممکن نیست"
        message={error ?? 'آگهی موردنظر در دسترس نیست.'}
        onRetry={() => void load()}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="ویرایش آگهی"
        description="اطلاعات پیش‌نویس را اصلاح کنید. ملک مرتبط در این مرحله قابل تغییر نیست."
      />
      <div className="mt-6">
        <ListingForm
          key={listing.id}
          properties={properties}
          initialValues={{
            property_id: listing.property_id,
            title: listing.title,
            description: listing.description ?? '',
            advertiser_type: listing.advertiser_type,
            transaction_type: listing.transaction_type,
          }}
          propertyLocked
          submitLabel="ذخیره تغییرات"
          submitting={submitting}
          errorMessage={error}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.listings.root)}
        />
      </div>
    </div>
  );
}
