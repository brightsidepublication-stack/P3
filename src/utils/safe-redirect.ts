export function getSafeRedirect(
  value: string | null | undefined,
  fallback = '/',
): string {
  if (!value) return fallback;

  const trimmed = value.trim();

  if (!trimmed.startsWith('/')) return fallback;
  if (trimmed.startsWith('//')) return fallback;
  if (trimmed.includes('://')) return fallback;
  if (trimmed.includes('\\')) return fallback;
  if (/\s/.test(trimmed)) return fallback;

  return trimmed;
}
