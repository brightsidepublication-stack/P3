import type {
  ISODateString,
  JsonObject,
  Timestamps,
  UUID,
} from './common.types';

export type TransactionType =
  | 'SALE'
  | 'RENT'
  | 'MORTGAGE_RENT'
  | 'PRESALE'
  | 'EXCHANGE';

export type AdvertiserType =
  | 'OWNER'
  | 'AGENT'
  | 'AUTHORIZED_REPRESENTATIVE';

export type ListingStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export type ListingResult =
  | 'ACTIVE'
  | 'UNDER_NEGOTIATION'
  | 'UNDER_CONTRACT'
  | 'SOLD'
  | 'RENTED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface Listing extends Timestamps {
  id: UUID;

  propertyId: UUID;

  /**
   * User who created/submitted the listing.
   */
  createdBy: UUID;

  /**
   * Registered user responsible for advertising the property.
   * This may differ from createdBy.
   */
  advertiserUserId: UUID;

  advertiserType: AdvertiserType;

  transactionType: TransactionType;

  /**
   * Optional project references for project/presale listings.
   */
  projectId: UUID | null;
  projectUnitId: UUID | null;

  title: string;
  description: string | null;

  status: ListingStatus;
  result: ListingResult;

  publishedAt: ISODateString | null;

  rejectedReason: string | null;

  flexibleAttributes: JsonObject;
}

export interface ListingPrice extends Timestamps {
  id: UUID;
  listingId: UUID;

  totalPrice: number | null;
  pricePerArea: number | null;

  deposit: number | null;
  monthlyRent: number | null;

  negotiable: boolean;

  currency: 'IRR';
}

export interface ListingMedia extends Timestamps {
  id: UUID;
  listingId: UUID;

  storagePath: string;
  publicUrl: string | null;

  mediaType: 'IMAGE' | 'VIDEO';

  sortOrder: number;

  isPrimary: boolean;
}