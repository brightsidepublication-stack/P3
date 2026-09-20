import { useMemo } from 'react';
import { getCurrentPlatform } from '@/lib/platform';

export function usePlatform() {
  return useMemo(() => getCurrentPlatform(), []);
}
