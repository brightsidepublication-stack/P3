import type { Timestamps, UUID } from './common.types';

export interface Building extends Timestamps {
  id: UUID;
  propertyId: UUID;

  name: string | null;

  floors: number | null;
  unitsCount: number | null;

  yearBuilt: number | null;

  description: string | null;
}

export interface PropertyUnit extends Timestamps {
  id: UUID;
  buildingId: UUID;

  unitNumber: string | null;

  floor: number | null;

  area: number | null;

  bedrooms: number | null;
  bathrooms: number | null;

  parkingCount: number | null;
  storageCount: number | null;

  condition: string | null;

  description: string | null;
}