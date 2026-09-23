import type { Timestamps, UUID } from './common.types';

export type ContactRequestStatus =
  | 'PENDING'
  | 'RESPONDED'
  | 'CLOSED'
  | 'CANCELLED';

export type ContactMethod =
  | 'PHONE'
  | 'MESSAGE'
  | 'PLATFORM';

export interface ContactRequest extends Timestamps {
  id: UUID;

  listingId: UUID;

  requesterUserId: UUID;
  advertiserUserId: UUID;

  method: ContactMethod;

  message: string | null;

  status: ContactRequestStatus;

  respondedAt: string | null;
}