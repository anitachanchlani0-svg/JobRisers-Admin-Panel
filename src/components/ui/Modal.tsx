import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  dataTestId?: string;
  closeButtonTestId?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  eyebrow,
  children,
  footer,
  maxWidth = 'max-w-[480px]',
  dataTestId = 'center-modal',
  closeButtonTestId,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div
      data-testid={dataTestId}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm transition-opacity"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all`}
      >
        <div className="flex items-start justify-between gap-4 shrink-0">
          {eyebrow || title || subtitle ? (
            <div className="min-w-0 flex-1">
              {eyebrow && (
                <p className="text-[10px] font-bold tracking-[.15em] text-primary uppercase">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 id="modal-title" className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <button
            type="button"
            data-testid={closeButtonTestId}
            aria-label="Close modal"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {children && (
          <div className="mt-4 flex-1 overflow-y-auto pr-0.5">
            {children}
          </div>
        )}

        {footer && (
          <div className="mt-6 flex justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
