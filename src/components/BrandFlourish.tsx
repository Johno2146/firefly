import { useEffect, useState } from "react";

/**
 * The brand flourish on a first load: the owner's own lockup drawn in, in the
 * brand gradient, then gone.
 *
 * It is deliberately the least important thing on the page:
 *
 * - it does not exist in the server rendered HTML at all. The element is
 *   created by this effect, after hydration, so the page has already painted
 *   exactly as it does without it. Nothing waits on it, and a failed script
 *   means no flourish rather than a missing page.
 * - it is `position: fixed` with `pointer-events: none`: no layout shift, no
 *   scroll trap, no blocked click. It sits in the middle of the viewport, so it
 *   never covers the header or the navigation.
 * - the artwork is the header logo used as a CSS mask, so it costs no
 *   additional image bytes: the mask is the file the header is already
 *   loading with `fetchpriority="high"`.
 * - it is removed after 900ms, and with `prefers-reduced-motion: reduce` it is
 *   never created at all, which is the settled state.
 *
 * It runs on a first load only. A client side route change already has the
 * short fade and rise on the page content, and stacking a second flourish on
 * top of that would make navigation feel slower than it is.
 */

const LIFE = 900;

export function BrandFlourish() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setRunning(true);
    const timer = window.setTimeout(() => setRunning(false), LIFE);
    return () => window.clearTimeout(timer);
  }, []);

  if (!running) return null;

  return (
    <div aria-hidden className="brand-flourish">
      <span className="brand-flourish-glow" />
      <span className="brand-flourish-mark" />
    </div>
  );
}
