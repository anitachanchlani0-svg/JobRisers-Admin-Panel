import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  size?: 'default' | 'wide';
  dataTestId?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  headerActions,
  footer,
  children,
  width,
  size = 'default',
  dataTestId = 'drawer-slide-over',
}: DrawerProps) {
  const resolvedWidth = width ?? (size === 'wide' ? 'max-w-[740px]' : 'max-w-[650px]');

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
      className="fixed inset-0 z-50 flex justify-end p-2.5 sm:p-4 lg:p-5 bg-slate-950/45 backdrop-blur-sm transition-opacity"
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
        aria-label={typeof title === 'string' ? title : 'Entity details drawer'}
        className={`relative flex h-full w-full ${resolvedWidth} flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_25px_60px_-15px_rgba(0,0,0,0.32)] animate-drawer-in`}
      >
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 sm:px-6 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {typeof title === 'string' ? (
                  <h2 className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl truncate">
                    {title}
                  </h2>
                ) : (
                  title
                )}
                {badge}
              </div>
              {subtitle && (
                <div className="mt-0.5 text-xs text-muted-foreground truncate">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {headerActions}
            <button
              type="button"
              data-testid="drawer-close-button"
              aria-label="Close drawer"
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {children}
        </div>

        {footer && (
          <footer className="sticky bottom-0 z-20 border-t border-border bg-card/95 px-5 py-3.5 sm:px-6 backdrop-blur flex items-center justify-end gap-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
