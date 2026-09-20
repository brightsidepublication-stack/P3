import type { PlatformAdapter } from './types';

export const browserAdapter: PlatformAdapter = {
  name: 'browser',

  async initialize(): Promise<void> {
    // No browser-specific initialization is required.
  },

  destroy(): void {
    // No browser-specific resources to clean up.
  },

  isAvailable(): boolean {
    return typeof window !== 'undefined';
  },
};
