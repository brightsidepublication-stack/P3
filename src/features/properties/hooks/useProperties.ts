import { useCallback, useEffect, useState } from 'react';
import {
  listOwnProperties,
  type PropertyRow,
} from '@/services/properties.service';
import { toAppError } from '@/lib/errors';

export function useProperties() {
  const [items, setItems] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const properties = await listOwnProperties();
      setItems(properties);
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