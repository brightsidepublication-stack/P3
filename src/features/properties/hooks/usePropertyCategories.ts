import { useCallback, useEffect, useState } from 'react';
import {
  listActivePropertyCategories,
  type PropertyCategory,
} from '@/services/property-categories.service';
import { toAppError } from '@/lib/errors';

export function usePropertyCategories() {
  const [items, setItems] = useState<PropertyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const categories = await listActivePropertyCategories();
      setItems(categories);
    } catch (err) {
      setError(toAppError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    items,
    loading,
    error,
    reload,
  };
}