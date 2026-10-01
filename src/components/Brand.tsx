/**
 * The owner's real logo, the only mark the site ships.
 *
 * Two files, cut from the same artwork by the same renderer, and the
 * difference between them is deliberate:
 *
 * - `firefly-logo-on-dark.png` is the one the site uses. The wordmark, the
 *   little house and the "G.A. Installations t/a" line are white instead of
 *   near black, and the brush greys are lifted, so the lockup reads directly
 *   on the dark header and footer. Orange, gold and red are the owner's own
 *   hexes, untouched.
 * - `firefly-logo.png` is the light surface version, near black wordmark
 *   intact. Nothing on the site points at it today; it is kept for anything
 *   that lands on white, and for the favicon and touch icon plates.
 *
 * The width and height are the file's real pixel size, so the browser
 * reserves the right box before the image arrives and nothing shifts. The
 * display size comes from `--brand-logo-h`.
 */
export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <img
      src="/brand/firefly-logo-on-dark.png"
      alt="Firefly Solar"
      width={290}
      height={156}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className="brand-logo"
    />
  );
}
