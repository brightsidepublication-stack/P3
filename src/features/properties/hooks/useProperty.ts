import { useCallback, useEffect, useState } from 'react';
import {
  getPropertyById,
  type PropertyRow,
} from '@/services/properties.service';
import { toAppError } from '@/lib/errors';

export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<PropertyRow | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) {
      setProperty(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getPropertyById(id);
      setProperty(result);
    } catch (err) {
      setProperty(null);
      setError(toAppError(err).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    property,
    loading,
    error,
    reload,
  };
}