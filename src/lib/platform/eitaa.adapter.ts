import type { PlatformAdapter } from './types';

export const eitaaAdapter: PlatformAdapter = {
  name: 'eitaa',

  async initialize(): Promise<void> {
    // Eitaa Mini App integration is intentionally deferred
    // until the official Eitaa documentation is verified.
  },

  destroy(): void {
    // No Eitaa resources are initialized in Phase 1.
  },

  isAvailable(): boolean {
    return false;
  },
};
