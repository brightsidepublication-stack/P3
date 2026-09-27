import { useEffect, useRef, useState, type ReactNode } from 'react';

export type DropdownItem = {
  key: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
};

export type DropdownTriggerProps = {
  type: 'button';
  onClick: () => void;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-label'?: string;
};

type Props = {
  trigger: (props: DropdownTriggerProps) => ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end';
  ariaLabel?: string;
  triggerAriaLabel?: string;
};

export function Dropdown({
  trigger,
  items,
  align = 'end',
  ariaLabel = 'منو',
  triggerAriaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;

      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);

    const t = window.setTimeout(() => {
      firstItemRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  const triggerProps: DropdownTriggerProps = {
    type: 'button',
    onClick: () => setOpen((v) => !v),
    'aria-haspopup': 'menu',
    'aria-expanded': open,
  };

  if (triggerAriaLabel) {
    triggerProps['aria-label'] = triggerAriaLabel;
  }

  return (
    <div className="relative inline-block" ref={rootRef}>
      {trigger(triggerProps)}

      {open ? (
        <div
          role="menu"
          aria-label={ariaLabel}
          className={`absolute z-30 mt-2 min-w-40 rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-100 ${
            align === 'end' ? 'end-0' : 'start-0'
          }`}
        >
          {items.map((it, i) => (
            <button
              key={it.key}
              ref={i === 0 ? firstItemRef : undefined}
              type="button"
              role="menuitem"
              disabled={it.disabled}
              onClick={() => {
                setOpen(false);
                it.onSelect();
              }}
              className="block w-full rounded-lg px-3 py-2 text-start text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {it.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}