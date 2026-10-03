import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { ROUTES } from '@/constants/routes';

export function MyPropertiesPage() {
  const { properties, isLoading, error, refetch } = useProperties();

  if (isLoading) {
    return (
      <main className="p-4">
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4">
        <ErrorState
          title="دریافت املاک انجام نشد"
          message={error}
          onRetry={() => void refetch()}
        />
      </main>
    );
  }

  return (
    <main className="p-4">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="املاک من"
          description="املاکی که توسط شما ثبت شده‌اند"
          action={
            <Link to={ROUTES.properties.new}>
              <Button type="button">
                ثبت ملک جدید
              </Button>
            </Link>
          }
        />

        {properties.length === 0 ? (
          <EmptyState
            title="هنوز ملکی ثبت نکرده‌اید"
            description="برای شروع، اولین ملک خود را ثبت کنید."
            action={
              <Link to={ROUTES.properties.new}>
                <Button type="button">
                  ثبت ملک جدید
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}