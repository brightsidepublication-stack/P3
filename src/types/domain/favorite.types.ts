import type { Timestamps, UUID } from './common.types';

export interface Favorite extends Timestamps {
  id: UUID;

  userId: UUID;
  listingId: UUID;
}