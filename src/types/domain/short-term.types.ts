import type { Timestamps, UUID } from './common.types';

export type ShortTermPropertyType =
  | 'APARTMENT'
  | 'SUITE'
  | 'VILLA'
  | 'GARDEN_VILLA'
  | 'RURAL_HOUSE'
  | 'CABIN'
  | 'ROOM'
  | 'ECOTOURISM'
  | 'TRADITIONAL_LODGING'
  | 'GUESTHOUSE'
  | 'COASTAL_LODGING'
  | 'FOREST_LODGING'
  | 'OTHER';

export interface ShortTermDetails extends Timestamps {
  id: UUID;
  listingId: UUID;

  propertyType: ShortTermPropertyType;

  capacity: number | null;
  beds: number | null;
  rooms: number | null;
  bathrooms: number | null;

  baseNightlyPrice: number | null;
  weekendNightlyPrice: number | null;
  holidayNightlyPrice: number | null;
  seasonalPrice: number | null;

  minimumNights: number | null;
  maximumNights: number | null;

  checkInTime: string | null;
  checkOutTime: string | null;

  amenities: string[];

  houseRules: string | null;
}