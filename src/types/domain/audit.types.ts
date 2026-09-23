import type { ISODateString, JsonObject, UUID } from './common.types';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PUBLISH'
  | 'REJECT'
  | 'ARCHIVE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'VERIFY'
  | 'OTHER';

export interface AuditLog {
  id: UUID;

  actorUserId: UUID | null;

  action: AuditAction;

  entityType: string;
  entityId: UUID | null;

  oldData: JsonObject | null;
  newData: JsonObject | null;

  createdAt: ISODateString;
}