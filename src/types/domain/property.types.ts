import type {
  ISODateString,
  JsonObject,
  Timestamps,
  UUID,
} from './common.types';
import type { PropertyCategory } from './category.types';
import type { PropertyLocation } from './geography.types';

export type PropertyCondition =
  | 'NEW'
  | 'GOOD'
  | 'NEEDS_RENOVATION'
  | 'RENOVATED'
  | 'UNDER_CONSTRUCTION'
  | 'OTHER';

export type PropertyAvailability =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'UNKNOWN';

export interface Property extends Timestamps {
  id: UUID;

  categoryId: UUID;
  category?: PropertyCategory;

  title: string;
  description: string | null;

  location: PropertyLocation;

  landArea: number | null;
  buildingArea: number | null;

  yearBuilt: number | null;

  condition: PropertyCondition | null;
  availability: PropertyAvailability;

  utilities: PropertyUtilities;

  flexibleAttributes: JsonObject;

  archivedAt: ISODateString | null;
}

export interface PropertyUtilities {
  electricity: boolean | null;
  water: boolean | null;
  gas: boolean | null;
  sewage: boolean | null;
  telephone: boolean | null;
  internet: boolean | null;
  heating: string | null;
  cooling: string | null;
}