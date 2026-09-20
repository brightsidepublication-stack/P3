import type { PlatformAdapter } from './types';

export const baleAdapter: PlatformAdapter = {
  name: 'bale',

  async initialize(): Promise<void> {
    // Bale Mini App integration is intentionally deferred
    // until the official Bale documentation is verified.
  },

  destroy(): void {
    // No Bale resources are initialized in Phase 1.
  },

  isAvailable(): boolean {
    return false;
  },
};
