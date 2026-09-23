import type { Timestamps, UUID } from './common.types';

export type ListingReportReason =
  | 'INCORRECT_INFORMATION'
  | 'DUPLICATE'
  | 'FRAUD'
  | 'UNAVAILABLE_PROPERTY'
  | 'INAPPROPRIATE_CONTENT'
  | 'OTHER';

export type ListingReportStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'RESOLVED'
  | 'REJECTED';

export interface ListingReport extends Timestamps {
  id: UUID;

  listingId: UUID;
  reporterUserId: UUID;

  reason: ListingReportReason;

  description: string | null;

  status: ListingReportStatus;

  reviewedBy: UUID | null;
  reviewedAt: string | null;
}