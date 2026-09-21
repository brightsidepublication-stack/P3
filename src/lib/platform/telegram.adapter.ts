import type { PlatformAdapter } from './types';

export const telegramAdapter: PlatformAdapter = {
  name: 'telegram',

  async initialize(): Promise<void> {
    // Telegram Mini App integration is intentionally deferred
    // until the official Telegram Mini Apps documentation is verified.
  },

  destroy(): void {
    // No Telegram resources are initialized in Phase 1.
  },

  isAvailable(): boolean {
    return false;
  },
};
