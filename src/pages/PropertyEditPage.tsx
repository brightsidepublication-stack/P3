import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { PropertyForm } from '@/features/properties/components/PropertyForm';
import { useProperty } from '@/features/properties/hooks/useProperty';
import {
  updateProperty,
  type PropertyFormInput,
} from '@/services/properties.service';
import { toAppError } from '@/lib/errors';
import { ROUTES } from '@/constants/routes';

export function PropertyEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading, error } = useProperty(id);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !property && !error) {
      navigate(ROUTES.properties.root, { replace: true });
    }
  }, [loading, property, error, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;

  if (!property || !id) return null;

  const onSubmit = async (values: PropertyFormInput) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      await updateProperty(id, values);

      navigate(ROUTES.properties.details(id), {
        replace: true,
      });
    } catch (e) {
      setSubmitError(toAppError(e).userMessage);
      setSubmitting(false);
    }
  };

  const initialValues = {
    title: property.title ?? '',
    description: property.description ?? '',
    category_id: property.category_id ?? '',
    province_id: property.province_id ?? '',
    city_id: property.city_id ?? '',
    district_id: property.district_id ?? '',
    neighborhood_id: property.neighborhood_id ?? '',
    address: property.address ?? '',
    latitude:
      property.latitude != null
        ? String(property.latitude)
        : '',
    longitude:
      property.longitude != null
        ? String(property.longitude)
        : '',
    land_area:
      property.land_area != null
        ? String(property.land_area)
        : '',
    building_area:
      property.building_area != null
        ? String(property.building_area)
        : '',
    year_built:
      property.year_built != null
        ? String(property.year_built)
        : '',
  };

  return (
    <div>
      <PageHeader title="ویرایش ملک" />

      <PropertyForm
        initialValues={initialValues}
        submitting={submitting}
        submitLabel="ذخیره تغییرات"
        errorMessage={submitError}
        onSubmit={onSubmit}
        onCancel={() =>
          navigate(ROUTES.properties.details(id))
        }
      />
    </div>
  );
}