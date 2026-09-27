import { X } from 'lucide-react';
import {
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  ariaLabel,
  children,
  className = '',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const accessibleName = ariaLabel ?? title ?? 'گفت‌وگو';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-900/50"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={accessibleName}
        className={`relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl ${className}`}
      >
        {title ? (
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}