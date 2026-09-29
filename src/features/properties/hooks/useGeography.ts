import { useCallback, useEffect, useState } from 'react';
import {
  listActiveCities,
  listActiveDistricts,
  listActiveNeighborhoods,
  listActiveProvinces,
  type City,
  type District,
  type Neighborhood,
  type Province,
} from '@/services/geography.service';
import { toAppError } from '@/lib/errors';

export function useProvinces() {
  const [items, setItems] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const provinces = await listActiveProvinces();
      setItems(provinces);
    } catch (err) {
      setError(toAppError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, error, reload };
}

export function useCities(provinceId: string | undefined) {
  const [items, setItems] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!provinceId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cities = await listActiveCities(provinceId);
      setItems(cities);
    } catch (err) {
      setError(toAppError(err).message);
    } finally {
      setLoading(false);
    }
  }, [provinceId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, error, reload };
}

export function useDistricts(cityId: string | undefined) {
  const [items, setItems] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!cityId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const districts = await listActiveDistricts(cityId);
      setItems(districts);
    } catch (err) {
      setError(toAppError(err).message);
    } finally {
      setLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, error, reload };
}

export function useNeighborhoods(districtId: string | undefined) {
  const [items, setItems] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!districtId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const neighborhoods = await listActiveNeighborhoods(districtId);
      setItems(neighborhoods);
    } catch (err) {
      setError(toAppError(err).message);
    } finally {
      setLoading(false);
    }
  }, [districtId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, error, reload };
}