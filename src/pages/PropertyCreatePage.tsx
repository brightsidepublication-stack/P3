import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { PropertyForm } from '@/features/properties/components/PropertyForm';
import {
  createProperty,
  type PropertyFormInput,
} from '@/services/properties.service';
import { toAppError } from '@/lib/errors';
import { ROUTES } from '@/constants/routes';

export function PropertyCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: PropertyFormInput) => {
    setSubmitting(true);
    setError(null);

    try {
      const created = await createProperty(values);

      navigate(ROUTES.properties.details(created.id), {
        replace: true,
      });
    } catch (e) {
      setError(toAppError(e).userMessage);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="ثبت ملک جدید"
        description="اطلاعات پایه ملک را وارد کنید."
      />

      <PropertyForm
        submitting={submitting}
        submitLabel="ثبت ملک"
        errorMessage={error}
        onSubmit={onSubmit}
        onCancel={() => navigate(ROUTES.properties.root)}
      />
    </div>
  );
}