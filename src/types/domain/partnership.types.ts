import type { Timestamps, UUID } from './common.types';

export type PartnershipAllocationType =
  | 'PERCENTAGE'
  | 'UNIT_COUNT'
  | 'FLOOR'
  | 'PARKING'
  | 'STORAGE';

export interface ConstructionPartnership extends Timestamps {
  id: UUID;

  projectId: UUID | null;

  agreementDate: string | null;

  description: string | null;

  status:
    | 'DRAFT'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED';
}

export interface PartnershipParty extends Timestamps {
  id: UUID;

  partnershipId: UUID;
  userId: UUID;

  partyRole:
    | 'LAND_OWNER'
    | 'DEVELOPER'
    | 'BUILDER'
    | 'OTHER';
}

export interface PartnershipAllocation extends Timestamps {
  id: UUID;

  partnershipId: UUID;
  userId: UUID;

  allocationType: PartnershipAllocationType;

  percentage: number | null;
  quantity: number | null;

  description: string | null;
}