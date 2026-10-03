import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { ROUTES } from '@/constants/routes';

export function MyPropertiesPage() {
  const {
    items,
    loading,
    error,
    reload,
  } = useProperties();

  if (loading) {
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
          onRetry={() => void reload()}
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
          actions={
            <Link to={ROUTES.properties.new}>
              <Button type="button">
                ثبت ملک جدید
              </Button>
            </Link>
          }
        />

        {items.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-base font-semibold text-slate-800">
              هنوز ملکی ثبت نکرده‌اید
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              برای شروع، اولین ملک خود را ثبت کنید.
            </p>

            <div className="mt-5">
              <Link to={ROUTES.properties.new}>
                <Button type="button">
                  ثبت ملک جدید
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((property) => (
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