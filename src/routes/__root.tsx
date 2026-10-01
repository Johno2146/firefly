import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { Footer } from "~/components/Footer";
import { Nav } from "~/components/Nav";
import { BrandFlourish } from "~/components/BrandFlourish";
import { CookieNotice } from "~/components/CookieNotice";
import { NotFoundPanel } from "~/components/NotFoundPanel";
import {
  useHashAnchor,
  usePauseOffscreenDecor,
  useRevealOnScroll,
} from "~/lib/hooks";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "color-scheme", content: "light" },
      { name: "theme-color", content: "#231f20" },
      // Fallback only: every page below sets its own title and description,
      // and the deepest match wins (see headContentUtils).
      {
        title: "Firefly Solar: residential solar, battery storage & maintenance",
      },
      {
        name: "description",
        content:
          "Firefly Solar designs, installs and looks after home solar and battery systems in Boksburg, Gauteng, along with alarms, cameras, fencing and gate automation. Call or WhatsApp +27 71 300 7422.",
      },
      { property: "og:title", content: "Firefly Solar" },
      {
        property: "og:description",
        content:
          "Residential solar, battery storage and maintenance in Boksburg, Gauteng. Call or WhatsApp +27 71 300 7422.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // The mark on a white plate, so the tab icon reads on dark and light
      // browser chrome alike. Plain PNG files, no icon font and no request
      // to anyone else's server.
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/brand/favicon-32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/brand/favicon-96.png",
      },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/brand/apple-touch-icon.png" },
      {
        rel: "preload",
        href: "/fonts/plus-jakarta-sans-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  /**
   * The not found page. It is the router's own component for an unknown
   * address, so the server answers with a real 404 status (not a 200 with a
   * friendly page inside it), and it renders inside the shared shell, which
   * means the header, the navigation and the footer come with it.
   */
  notFoundComponent: () => <NotFoundPanel />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <PageShell />
    </RootDocument>
  );
}

/**
 * The shared shell every page renders inside: skip link, header, the page
 * content, footer.
 *
 * The header and footer live here once instead of on each page, so a route
 * change only swaps the middle. The content wrapper gets a short fade-and-rise
 * on a *client-side* navigation, `page-enter` is added by JavaScript after the
 * first render, never in the server HTML, so a fresh load, a deep link or a
 * failed script always shows the page fully painted and readable. The CSS class
 * is the only thing the transition touches: no overlay, no blank frame, and
 * nothing under `prefers-reduced-motion`.
 *
 * Reveals and the decorative-layer pausing are also driven from here, keyed on
 * the pathname, so every page gets them without repeating the call.
 */
function PageShell() {
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hash = useRouterState({ select: (state) => state.location.hash });

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // The first pass is the page the visitor asked for: no entrance animation
    // on a fresh load, a deep link or a reload, only on a later navigation.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.remove("page-enter");
    // Read a layout value to force the animation to restart from the top.
    void el.offsetWidth;
    el.classList.add("page-enter");
  }, [pathname]);

  // Anchors first (so an in-page link lands correctly), then the reveal scan
  // measures "below the fold" from where the visitor really is.
  useHashAnchor(hash);
  useRevealOnScroll(pathname);
  usePauseOffscreenDecor(pathname);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-flame-500 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink-950"
      >
        Skip to content
      </a>
      <Nav />
      <div ref={contentRef}>
        <main id="main">
          <Outlet />
        </main>
      </div>
      <Footer />
      {/* Both are additive and neither is in the server rendered page: the
          flourish is created after hydration and removes itself, and the
          storage notice only exists for a visitor who has not answered it
          yet. */}
      <BrandFlourish />
      <CookieNotice />
    </>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
