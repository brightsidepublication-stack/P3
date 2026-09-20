import type { PlatformAdapter, PlatformName } from './types';
import { baleAdapter } from './bale.adapter';
import { browserAdapter } from './browser.adapter';
import { eitaaAdapter } from './eitaa.adapter';
import { telegramAdapter } from './telegram.adapter';

export const platformAdapters: Record<PlatformName, PlatformAdapter> = {
  browser: browserAdapter,
  telegram: telegramAdapter,
  eitaa: eitaaAdapter,
  bale: baleAdapter,
};

export function getCurrentPlatform(): PlatformAdapter {
  if (telegramAdapter.isAvailable()) {
    return telegramAdapter;
  }

  if (eitaaAdapter.isAvailable()) {
    return eitaaAdapter;
  }

  if (baleAdapter.isAvailable()) {
    return baleAdapter;
  }

  return browserAdapter;
}
