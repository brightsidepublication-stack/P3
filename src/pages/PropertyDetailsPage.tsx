import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { useProperty } from '@/features/properties/hooks/useProperty';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { property, loading, error } = useProperty(id);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;

  if (!property || !id) {
    return (
      <ErrorState
        title="ملک یافت نشد"
        message="این ملک در دسترس نیست."
      />
    );
  }

  const isOwn = !!user && property.created_by === user.id;

  return (
    <div>
      <PageHeader
        title={property.title}
        actions={
          isOwn ? (
            <Link to={ROUTES.properties.edit(id)}>
              <Button variant="secondary" size="sm">
                ویرایش
              </Button>
            </Link>
          ) : null
        }
      />

      <Card>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Row
            label="متراژ زمین"
            value={fmtNumber(property.land_area, ' متر')}
          />

          <Row
            label="متراژ بنا"
            value={fmtNumber(property.building_area, ' متر')}
          />

          <Row
            label="سال ساخت"
            value={fmtNumber(property.year_built)}
          />

          <Row
            label="آدرس"
            value={property.address ?? '—'}
          />

          <Row
            label="عرض جغرافیایی"
            value={
              property.latitude != null
                ? String(property.latitude)
                : '—'
            }
          />

          <Row
            label="طول جغرافیایی"
            value={
              property.longitude != null
                ? String(property.longitude)
                : '—'
            }
          />
        </dl>

        {property.description ? (
          <p className="mt-4 whitespace-pre-line text-sm text-slate-700">
            {property.description}
          </p>
        ) : null}
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

function fmtNumber(
  n: number | null | undefined,
  suffix: string = ''
): string {
  if (n == null) return '—';

  try {
    return new Intl.NumberFormat('fa-IR').format(n) + suffix;
  } catch {
    return String(n) + suffix;
  }
}