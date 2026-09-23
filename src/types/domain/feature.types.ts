import type { Timestamps, UUID } from './common.types';

export type FeatureValueType =
  | 'BOOLEAN'
  | 'NUMBER'
  | 'TEXT'
  | 'SELECT'
  | 'MULTI_SELECT';

export interface FeatureDefinition extends Timestamps {
  id: UUID;

  categoryId: UUID | null;

  key: string;
  label: string;

  valueType: FeatureValueType;

  isSearchable: boolean;
  isFilterable: boolean;
  isActive: boolean;

  sortOrder: number;
}

export interface PropertyFeatureValue extends Timestamps {
  id: UUID;

  propertyId: UUID;
  featureDefinitionId: UUID;

  booleanValue: boolean | null;
  numberValue: number | null;
  textValue: string | null;

  selectedValues: string[] | null;
}