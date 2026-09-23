import type { Timestamps, UUID } from './common.types';

export type ProjectStatus =
  | 'PLANNING'
  | 'PERMITTED'
  | 'UNDER_CONSTRUCTION'
  | 'NEAR_COMPLETION'
  | 'COMPLETED'
  | 'CANCELLED';

export type ConstructionStage =
  | 'LAND'
  | 'PERMITS'
  | 'EXCAVATION'
  | 'FOUNDATION'
  | 'STRUCTURE'
  | 'ROOF'
  | 'WALLS'
  | 'MEP'
  | 'FACADE'
  | 'FINISHING'
  | 'FINAL_WORK'
  | 'READY';

export type ProjectUnitStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'SOLD'
  | 'UNAVAILABLE';

export interface Project extends Timestamps {
  id: UUID;

  propertyId: UUID;

  developerUserId: UUID | null;

  name: string;
  description: string | null;

  status: ProjectStatus;

  expectedDeliveryDate: string | null;
}

export interface ProjectBlock extends Timestamps {
  id: UUID;
  projectId: UUID;

  name: string;
  floors: number | null;
  unitsCount: number | null;
}

export interface ProjectUnit extends Timestamps {
  id: UUID;
  blockId: UUID;

  unitNumber: string | null;

  floor: number | null;

  area: number | null;

  bedrooms: number | null;
  parkingCount: number | null;
  storageCount: number | null;

  status: ProjectUnitStatus;
}

export interface ProjectUnitPricing extends Timestamps {
  id: UUID;
  projectUnitId: UUID;

  totalPrice: number | null;
  pricePerArea: number | null;

  initialPayment: number | null;
}

export interface PaymentScheduleItem extends Timestamps {
  id: UUID;
  projectUnitPricingId: UUID;

  title: string;

  amount: number;

  dueDate: string | null;

  milestone: ConstructionStage | null;

  sortOrder: number;
}

export interface ProjectProgress extends Timestamps {
  id: UUID;
  projectId: UUID;

  stage: ConstructionStage;

  declaredPercentage: number | null;

  lastUpdateAt: string | null;

  description: string | null;
}

export type ProjectDocumentType =
  | 'PERMIT'
  | 'LAND_DOCUMENT'
  | 'PLAN'
  | 'LICENSE'
  | 'CONTRACT'
  | 'OTHER';

export interface ProjectDocument extends Timestamps {
  id: UUID;
  projectId: UUID;

  documentType: ProjectDocumentType;

  title: string;

  storagePath: string;

  description: string | null;

  isPublic: boolean;
}