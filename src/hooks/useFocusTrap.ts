import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"])',
].join(',');

export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  active: boolean
): void {
  useEffect(() => {
    if (!active) return;

    const root = ref.current;
    if (!root) return;

    const previouslyFocused =
      (document.activeElement as HTMLElement | null) ?? null;

    const getFocusable = (): HTMLElement[] => {
      const nodes = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const out: HTMLElement[] = [];

      nodes.forEach((el) => {
        if (el.tabIndex < 0) return;
        if (el.offsetParent === null) return;
        out.push(el);
      });

      return out;
    };

    const initial = getFocusable();

    if (initial.length > 0) {
      initial[0].focus();
    } else {
      if (!root.hasAttribute('tabindex')) {
        root.setAttribute('tabindex', '-1');
      }

      root.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const items = getFocusable();

      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      const inside = activeEl ? root.contains(activeEl) : false;

      if (e.shiftKey) {
        if (!inside || activeEl === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!inside || activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);

      if (
        previouslyFocused &&
        previouslyFocused.isConnected &&
        typeof previouslyFocused.focus === 'function'
      ) {
        try {
          previouslyFocused.focus();
        } catch {
          // Best-effort.
        }
      }
    };
  }, [ref, active]);
}