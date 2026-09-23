import type { JsonObject, Timestamps, UUID } from './common.types';

export type LandLegalUse =
  | 'RESIDENTIAL'
  | 'AGRICULTURAL'
  | 'COMMERCIAL'
  | 'INDUSTRIAL'
  | 'MIXED_USE'
  | 'TOURISM'
  | 'GARDEN'
  | 'OTHER'
  | 'UNCLASSIFIED';

export type LandCurrentUse =
  | 'VACANT'
  | 'AGRICULTURAL'
  | 'GARDEN'
  | 'RESIDENTIAL'
  | 'COMMERCIAL'
  | 'INDUSTRIAL'
  | 'MIXED_USE'
  | 'OTHER'
  | 'UNKNOWN';

export interface Land extends Timestamps {
  id: UUID;
  propertyId: UUID;

  totalArea: number;

  legalUse: LandLegalUse;
  currentUse: LandCurrentUse;

  buildable: boolean | null;
  accessDescription: string | null;

  flexibleAttributes: JsonObject;
}

export interface LandParcel extends Timestamps {
  id: UUID;
  landId: UUID;

  area: number;

  legalUse: LandLegalUse;
  currentUse: LandCurrentUse;

  buildable: boolean | null;

  accessDescription: string | null;
  utilitiesDescription: string | null;
  notes: string | null;
}