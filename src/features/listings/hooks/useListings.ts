import { useCallback, useEffect, useState } from 'react';

import { toAppError } from '@/lib/errors';
import { listOwnListings, type ListingRow } from '@/services/listings.service';

export function useListings() {
  const [items, setItems] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setItems(await listOwnListings());
    } catch (cause) {
      setError(toAppError(cause).userMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, error, reload };
}
