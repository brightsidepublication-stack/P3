import type { UUID, Timestamps } from './common.types';

export interface PropertyCategory extends Timestamps {
  id: UUID;
  parentId: UUID | null;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}