import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";

import { IconArrowRight, IconClose } from "~/components/Icons";
import { Photo } from "~/components/Photo";
import type { GalleryItem } from "~/lib/content";

type LightboxProps = {
  items: readonly GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const BUTTON =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors duration-200 hover:border-flame-400/60 hover:bg-flame-500/15 hover:text-flame-200";

/**
 * Full-size view of one installation photograph.
 *
 * Rendered only once a tile is clicked, so nothing about it exists in the
 * server-rendered page or on first paint. It is a plain fixed overlay,  * opaque background, no `backdrop-filter`, no animation of its own beyond the
 * site-wide colour transitions, with:
 *
 *  - Escape to close, ArrowLeft/ArrowRight to move between photos;
 *  - focus moved to the close button on open, and returned to the tile that
 *    opened it by the caller when it closes;
 *  - Tab kept inside the overlay while it is open;
 *  - body scroll locked with the lost scrollbar width paid back as padding,
 *    so nothing behind the overlay moves.
 *
 * Under `prefers-reduced-motion` the shared stylesheet already reduces every
 * transition to 0.001ms, so the overlay simply appears and disappears.
 */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const item = items[index];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Lock the page behind the overlay without moving it: the scrollbar that
  // disappears is paid back as body padding.
  useEffect(() => {
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const overflow = body.style.overflow;
    const padding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = overflow;
      body.style.paddingRight = padding;
    };
  }, []);

  useEffect(() => {
    const total = items.length;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onNavigate((index - 1 + total) % total);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate((index + 1) % total);
        return;
      }
      if (event.key !== "Tab") return;

      // Keep Tab inside the overlay: it is modal, so the page behind it is
      // not reachable while it is open.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, items.length, onClose, onNavigate]);

  const step = (delta: number) =>
    onNavigate((index + delta + items.length) % items.length);

  const onBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${index + 1} of ${items.length}: ${item.caption}`}
      onMouseDown={onBackdrop}
      className="fixed inset-0 z-80 flex flex-col bg-ink-950/96 px-4 py-4 sm:px-8 sm:py-6"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <p className="text-[0.7rem] font-bold tracking-[0.16em] text-flame-300 uppercase">
          Photo {index + 1} / {items.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photo"
            className={BUTTON}
          >
            <IconArrowRight className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photo"
            className={BUTTON}
          >
            <IconArrowRight className="h-5 w-5" />
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className={BUTTON}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4 sm:py-6">
        <Photo
          key={item.id}
          item={item}
          sizes="(min-width: 1440px) 1200px, 94vw"
          priority
          className="h-auto max-h-full w-auto max-w-full rounded-2xl object-contain shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]"
        />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <p className="text-center text-xs text-white/40">
          Use the arrow keys to move between photos, Escape to close.
        </p>
      </div>
    </div>
  );
}
