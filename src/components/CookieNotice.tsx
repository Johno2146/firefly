import { useEffect, useRef, useState } from "react";

/**
 * The one notice the site shows about storage.
 *
 * It is honest rather than conventional: this site sets no advertising and no
 * tracking cookies, and there is no analytics script anywhere on it, so the
 * notice says exactly that instead of implying a tracking choice that does not
 * exist. The only thing kept is the visitor's own answer, in this browser, so
 * the notice is not shown again to the same person.
 *
 * How it stays out of the way:
 *
 * - nothing about it is in the server rendered page, so it cannot delay or
 *   change the first paint; it is added after hydration like every other
 *   progressive enhancement here;
 * - it is `position: fixed`, so it never moves the page or the layout;
 * - while it is up the page body gains a matching bottom padding through
 *   `html[data-cookie="visible"]`, so the phone, WhatsApp and email actions in
 *   the footer are never sitting underneath it on a phone;
 * - one dismiss action, a real `<button>`, reachable by keyboard with the
 *   site's own focus ring, and it never traps focus or takes a scroll;
 * - the appearance animation is a fade the shared reduced motion rule in
 *   app.css shortens to nothing, so with `prefers-reduced-motion: reduce` the
 *   notice simply appears.
 */

const KEY = "firefly-cookie-choice";

export function CookieNotice() {
  const [shown, setShown] = useState(false);
  const noticeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let answer: string | null = null;
    try {
      answer = window.localStorage.getItem(KEY);
    } catch {
      // Storage can be refused (private windows). The notice still works for
      // this visit; there is simply nothing to remember it with.
    }
    if (answer === "dismissed") return;
    setShown(true);
    document.documentElement.setAttribute("data-cookie", "visible");
  }, []);

  /**
   * Hand the notice's real height to the stylesheet, which pays it back as
   * bottom padding on the body, so the end of the page is never underneath it.
   * Measured rather than guessed, and re-measured if the box changes size.
   */
  useEffect(() => {
    if (!shown) return;
    const el = noticeRef.current;
    if (!el) return;
    const root = document.documentElement;
    const apply = () => root.style.setProperty("--cookie-h", `${el.offsetHeight}px`);
    apply();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(apply);
    observer?.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", apply);
      root.style.removeProperty("--cookie-h");
    };
  }, [shown]);

  function dismiss() {
    try {
      window.localStorage.setItem(KEY, "dismissed");
    } catch {
      /* Nothing to remember the answer with. The notice still closes. */
    }
    setShown(false);
    document.documentElement.removeAttribute("data-cookie");
  }

  if (!shown) return null;

  return (
    <aside
      ref={noticeRef}
      aria-label="Storage notice"
      className="on-dark cookie-notice fixed inset-x-3 bottom-3 z-70 mx-auto flex max-w-xl flex-col items-start gap-3 rounded-2xl border border-white/12 bg-ink-950/97 p-4 shadow-[0_24px_60px_-30px_rgba(35,31,32,0.95)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
    >
      <p className="text-[0.82rem] leading-relaxed text-white/80">
        This site does not use advertising or tracking cookies. Your answer is
        only remembered on this device.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="btn btn-flame shrink-0 self-start px-5 py-2.5 text-sm sm:self-center"
      >
        Understood
      </button>
    </aside>
  );
}
