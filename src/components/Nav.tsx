import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { BrandLogo } from "~/components/Brand";
import { IconClose, IconMenu } from "~/components/Icons";
import { useScrollTask } from "~/lib/hooks";

/**
 * Real routes, not scroll anchors: the header is part of the shared shell, so
 * the active item comes from the current route rather than from whichever
 * section happens to be in view.
 */
const LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  /**
   * Both scroll reactions, the condensed header and the reading-progress
   * bar, are written straight to the DOM from the page's single
   * rAF-throttled scroll listener. No React state, so scrolling the page
   * never re-renders the header (or anything else).
   */
  const onScroll = useCallback((y: number) => {
    const header = headerRef.current;
    if (header) {
      const next = y > 24 ? "true" : "false";
      if (header.dataset.scrolled !== next) header.dataset.scrolled = next;
    }
    const bar = barRef.current;
    if (bar) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      bar.style.transform = `scaleX(${progress.toFixed(3)})`;
    }
  }, []);

  useScrollTask(onScroll);

  // A new page starts at the top, so the header must leave its condensed state.
  useEffect(() => {
    onScroll(window.scrollY);
  }, [pathname, onScroll]);

  // A route change closes the mobile menu.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      className="on-dark nav-bar fixed inset-x-0 top-0 z-50"
    >
      <div className="nav-inner mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          to="/"
          aria-label="Firefly Solar home"
          className="flex-none transition-opacity hover:opacity-90"
        >
          <BrandLogo priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                  active
                    ? "bg-white/10 text-flame-300"
                    : "text-white/75 hover:bg-white/8 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="btn btn-flame hidden px-5 py-3 text-sm sm:inline-flex"
          >
            Get a quote
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/12 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <IconClose className="h-5 w-5" />
            ) : (
              <IconMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        ref={barRef}
        aria-hidden
        className="nav-progress h-px w-full bg-gradient-to-r from-flame-600 via-gold-400 to-flame-200"
      />

      {open ? (
        <div
          id="mobile-nav"
          className="hero-rise border-t border-white/10 bg-ink-950 lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8"
          >
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.to) ? "page" : undefined}
                className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-semibold transition-colors hover:bg-white/8 hover:text-white ${
                  isActive(link.to) ? "text-flame-300" : "text-white/85"
                }`}
              >
                {link.label}
                <span aria-hidden className="text-flame-400">
                  →
                </span>
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-flame mt-2 w-full py-3.5"
            >
              Get a quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
