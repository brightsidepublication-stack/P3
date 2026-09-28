import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import type { PropertyRow } from '@/services/properties.service';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';

  try {
    return new Intl.DateTimeFormat('fa-IR').format(new Date(iso));
  } catch {
    return iso;
  }
}

export function PropertyCard({
  property,
}: {
  property: PropertyRow;
}) {
  const area =
    property.building_area ??
    property.land_area ??
    null;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <Link
          to={ROUTES.properties.details(property.id)}
          className="text-base font-semibold text-slate-900 hover:text-brand-700"
        >
          {property.title}
        </Link>

        <Badge variant="neutral">
          {formatDate(property.created_at)}
        </Badge>
      </div>

      {area != null ? (
        <p className="text-sm text-slate-500">
          متراژ:{' '}
          {new Intl.NumberFormat('fa-IR').format(area)} متر
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Link
          to={ROUTES.properties.details(property.id)}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
        >
          مشاهده
        </Link>

        <Link
          to={ROUTES.properties.edit(property.id)}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
        >
          ویرایش
        </Link>
      </div>
    </Card>
  );
}