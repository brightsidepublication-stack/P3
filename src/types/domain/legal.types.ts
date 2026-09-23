import type { ISODateString, Timestamps, UUID } from './common.types';

export type OwnershipEvidenceType =
  | 'OFFICIAL_DEED'
  | 'ORDINARY_DEED'
  | 'SALE_AGREEMENT'
  | 'PURCHASE_AGREEMENT'
  | 'NASQ'
  | 'POWER_OF_ATTORNEY'
  | 'OTHER';

export type OfficialDocumentType =
  | 'SINGLE_PAGE'
  | 'CADASTRAL'
  | 'BOOKLET'
  | 'OTHER';

export type DocumentColor =
  | 'GREEN'
  | 'OTHER'
  | 'UNKNOWN';

export type OwnershipType =
  | 'SIX_DANG'
  | 'SHARED'
  | 'LAND_ONLY'
  | 'BUILDING_ONLY'
  | 'LAND_AND_BUILDING';

export type LegalStatusType =
  | 'WAQF'
  | 'INHERITED'
  | 'MORTGAGED'
  | 'SEIZED'
  | 'TRANSFER_RESTRICTED'
  | 'CONTESTED'
  | 'LEGAL_DISPUTE'
  | 'OTHER';

export interface LegalDocument extends Timestamps {
  id: UUID;
  propertyId: UUID;

  ownershipEvidenceType: OwnershipEvidenceType;

  officialDocumentType: OfficialDocumentType | null;
  documentColor: DocumentColor | null;

  issueDate: ISODateString | null;

  ownershipType: OwnershipType | null;

  registrationMainNumber: string | null;
  registrationSubNumber: string | null;
  registrationSection: string | null;
  parcelNumber: string | null;

  hasBuildingPermit: boolean | null;
  hasCompletionCertificate: boolean | null;
  hasSubdivisionPlan: boolean | null;
  hasSeparateDeed: boolean | null;

  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface PropertyLegalStatus extends Timestamps {
  id: UUID;
  propertyId: UUID;

  status: LegalStatusType;

  description: string | null;

  verified: boolean;
}

export interface PropertyOwner extends Timestamps {
  id: UUID;
  propertyId: UUID;
  userId: UUID;

  ownershipShare: number | null;

  verificationStatus:
    | 'UNVERIFIED'
    | 'PENDING'
    | 'VERIFIED'
    | 'REJECTED';

  verifiedAt: ISODateString | null;
}