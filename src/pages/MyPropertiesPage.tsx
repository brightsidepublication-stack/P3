import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { ROUTES } from '@/constants/routes';

export function MyPropertiesPage() {
  const { items, loading, error, reload } = useProperties();

  return (
    <div>
      <PageHeader
        title="املاک من"
        description="فهرست ملک‌هایی که ثبت کرده‌اید."
        actions={
          <Link to={ROUTES.properties.new}>
            <Button size="sm">ثبت ملک جدید</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : items.length === 0 ? (
        <EmptyState
          title="هنوز ملکی ثبت نکرده‌اید."
          description="برای شروع، اولین ملک خود را ثبت کنید."
          action={
            <Link to={ROUTES.properties.new}>
              <Button size="sm">ثبت ملک جدید</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}