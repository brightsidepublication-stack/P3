import type { UUID, Timestamps } from './common.types';

export interface Province extends Timestamps {
  id: UUID;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface City extends Timestamps {
  id: UUID;
  provinceId: UUID;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface District extends Timestamps {
  id: UUID;
  cityId: UUID;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface Neighborhood extends Timestamps {
  id: UUID;
  districtId: UUID;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface PropertyLocation {
  provinceId: UUID;
  cityId: UUID;
  districtId: UUID | null;
  neighborhoodId: UUID | null;

  address: string | null;

  latitude: number | null;
  longitude: number | null;
}