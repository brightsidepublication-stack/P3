import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { ListingForm } from '@/features/listings/components/ListingForm';
import { toAppError } from '@/lib/errors';
import {
  createListing,
  type ListingFormInput,
} from '@/services/listings.service';
import {
  listOwnProperties,
  type PropertyRow,
} from '@/services/properties.service';
import { ROUTES } from '@/constants/routes';

export function ListingCreatePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      setLoadingProperties(true);
      setPropertiesError(null);

      try {
        const rows = await listOwnProperties();
        if (active) setProperties(rows);
      } catch (cause) {
        if (active) setPropertiesError(toAppError(cause).userMessage);
      } finally {
        if (active) setLoadingProperties(false);
      }
    }

    void loadProperties();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (values: ListingFormInput) => {
    setSubmitting(true);
    setError(null);

    try {
      await createListing(values);
      navigate(ROUTES.listings.root, { replace: true });
    } catch (cause) {
      setError(toAppError(cause).userMessage);
      setSubmitting(false);
    }
  };

  if (loadingProperties) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (propertiesError) {
    return (
      <ErrorState
        title="دریافت املاک انجام نشد"
        message={propertiesError}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="ثبت آگهی جدید"
        description="یک ملک ثبت‌شده را انتخاب کنید و آگهی آن را به‌صورت پیش‌نویس ذخیره کنید."
      />
      <div className="mt-6">
        <ListingForm
          properties={properties}
          submitting={submitting}
          errorMessage={error}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.listings.root)}
        />
      </div>
    </div>
  );
}
