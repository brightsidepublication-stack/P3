import { useState, type FormEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { usePropertyCategories } from '../hooks/usePropertyCategories';
import {
  useProvinces,
  useCities,
  useDistricts,
  useNeighborhoods,
} from '../hooks/useGeography';
import { propertyFormSchema } from '../schemas/property.schema';
import type { PropertyFormInput } from '@/services/properties.service';

/**
 * Raw string-based form state. All fields are strings during editing.
 * Conversion to numbers happens once, via the Zod schema, on submit.
 */
type RawForm = {
  title: string;
  description: string;
  category_id: string;
  province_id: string;
  city_id: string;
  district_id: string;
  neighborhood_id: string;
  address: string;
  latitude: string;
  longitude: string;
  land_area: string;
  building_area: string;
  year_built: string;
};

const EMPTY: RawForm = {
  title: '',
  description: '',
  category_id: '',
  province_id: '',
  city_id: '',
  district_id: '',
  neighborhood_id: '',
  address: '',
  latitude: '',
  longitude: '',
  land_area: '',
  building_area: '',
  year_built: '',
};

type Props = {
  initialValues?: Partial<RawForm>;
  submitting: boolean;
  submitLabel: string;
  errorMessage?: string | null;
  onSubmit: (values: PropertyFormInput) => void | Promise<void>;
  onCancel?: () => void;
};

export function PropertyForm({
  initialValues,
  submitting,
  submitLabel,
  errorMessage,
  onSubmit,
  onCancel,
}: Props) {
  const categories = usePropertyCategories();
  const provinces = useProvin