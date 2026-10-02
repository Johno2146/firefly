/**
 * The address every page says it lives at.
 *
 * There is no single hard coded address for this site, because the same code is
 * served on two hosts: the business's own domain and our working copy on the
 * platform. Telling a crawler that a page on the owner's domain really lives at
 * the platform address (which is what a fixed constant does) splits the site in
 * two in Google's index, so the address is worked out per request instead:
 *
 *   1. The host the request actually arrived on, honouring the proxy headers
 *      that sit in front of both hosts (`x-forwarded-host` first, then `host`),
 *      and the forwarded protocol (`x-forwarded-proto`).
 *   2. That host is only published if it is a public name: a loopback or private
 *      address, an IPv6 literal, or one of the platform proxy's own hop names
 *      (which no visitor ever types) is refused.
 *   3. If the request carries no usable public host, we fall back to
 *      `FALLBACK_ORIGIN`: our own working copy's published address, which is the
 *      one case that happens in practice (the platform's proxy masks the host).
 *
 * So the owner's domain names itself, our copy names itself, and changing the
 * domain later needs no code edit. `public/robots.txt` and `public/sitemap.xml`
 * are no longer static files for the same reason: they are served by
 * `src/routes/robots[.]txt.ts` and `src/routes/sitemap[.]xml.ts` so their
 * addresses come from this same function.
 */

/**
 * The address of our own working copy, and the last resort whenever a request
 * arrives without a usable public host (a build time render, or a proxy that
 * masks the host, as the platform's does). This is the only hard coded address
 * left in the site, and it is only ever used when nothing better is available.
 */
export const FALLBACK_ORIGIN = "https://de2e690c82da5f81556112a54bafb81f.ctonew.app";

/**
 * Host names we will never publish as a page's own address.
 *
 * The first group is anything that is not a public name a visitor could have
 * typed: loopback, the private IPv4 ranges, and link local. IPv4 literals are
 * refused separately below. The second group is the platform proxy's own hop
 * names: our copy is reached through a proxy that rewrites `host` to an internal
 * data centre name and sets `x-forwarded-host` to its preview alias, neither of
 * which is an address the site is published at, so both are refused in favour of
 * `FALLBACK_ORIGIN`.
 */
const UNPUBLISHABLE_HOSTS = [
  /^localhost$/,
  /\.localhost$/,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /\.local$/,
  /\.internal$/,
  /\.bl\.run$/,
  /(^|\.)beamlit\.net$/,
];

/** The trimmed, lower cased first value of a possibly comma separated header. */
function firstHeaderValue(headers: Headers, name: string): string | null {
  const raw = headers.get(name);
  if (!raw) return null;
  const value = raw.split(",")[0]?.trim().toLowerCase() ?? "";
  return value.length > 0 ? value : null;
}

/** A host name we are willing to publish, port included. */
function isPublishableHost(host: string | null): host is string {
  if (!host) return false;
  const name = host.replace(/:\d+$/, "");
  // A public name has at least one dot, is ASCII letters, digits, dots and
  // hyphens only, and is not an IPv4 literal.
  if (!name.includes(".") || !/^[a-z0-9.-]+$/.test(name)) return false;
  if (/^\d+(\.\d+){3}$/.test(name)) return false;
  return !UNPUBLISHABLE_HOSTS.some((pattern) => pattern.test(name));
}

/** `https` unless the proxy in front says otherwise. */
function protocolFor(headers: Headers): string {
  return firstHeaderValue(headers, "x-forwarded-proto") === "http" ? "http" : "https";
}

/** One origin from a request's headers, or null when no host can be published. */
function originFromHeaders(headers: Headers): string | null {
  const host = [firstHeaderValue(headers, "x-forwarded-host"), firstHeaderValue(headers, "host")]
    .find(isPublishableHost);
  if (!host) return null;
  return `${protocolFor(headers)}://${host}`;
}

/**
 * The current request's headers, server side only.
 *
 * The framework keeps the request being rendered in an `AsyncLocalStorage`
 * under this well known symbol (`getRequestHeaders` reads the same store), and
 * an origin is needed inside a route's `head`, which is a synchronous function
 * that React runs during the render. Reading the store directly keeps the
 * server runtime out of the client bundle: `@tanstack/react-start/server` must
 * never be imported from a module the browser also loads. Anything unexpected
 * (no store, an unfamiliar shape) yields null and the caller falls back.
 */
function requestHeaders(): Headers | null {
  if (typeof window !== "undefined") return null;
  const storage = (globalThis as Record<symbol, unknown>)[
    Symbol.for("tanstack-start:event-storage")
  ] as { getStore?: () => unknown } | undefined;
  const store = storage?.getStore?.() as { h3Event?: { req?: { headers?: unknown } } } | undefined;
  const headers = store?.h3Event?.req?.headers;
  if (headers instanceof Headers) return headers;
  // Defensive: accept anything with a working `get(name)`.
  if (headers && typeof (headers as Headers).get === "function") return headers as Headers;
  return null;
}

/**
 * The address the page was rendered with, read back from the browser.
 *
 * Once the server has decided an address for a page, every later client side
 * navigation keeps it, so a page never carries two different addresses for
 * itself (which is what happens if the browser's own origin is used and it
 * disagrees with the server: on our own copy behind the platform proxy it
 * does). A page that arrives without a canonical (the not found page) falls
 * back to the address bar, which is right in that case.
 */
function publishedOrigin(): string | null {
  if (typeof document === "undefined" || !window.location?.origin) return null;
  const href = document
    .querySelector('link[rel="canonical"]')
    ?.getAttribute("href");
  if (!href) return null;
  try {
    return new URL(href, window.location.origin).origin;
  } catch {
    return null;
  }
}

/**
 * The origin (scheme and host, no trailing slash) this page is being served
 * from: the host the request actually arrived on, server side, and the address
 * the page was rendered with, in the browser.
 */
export function origin(): string {
  const published = publishedOrigin();
  if (published) return published;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  const headers = requestHeaders();
  return (headers && originFromHeaders(headers)) ?? FALLBACK_ORIGIN;
}

/** Absolute URL for a route path, e.g. "/services" -> ".../services". */
export function absolute(path: string): string {
  return `${origin()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The social sharing image: one of the owner's own installation photographs
 * (the rooftop array from photo 13, the same frame the home page hero uses),
 * cut to the 1200 x 630 that social cards expect. Real photography, no plate
 * and no invented artwork. Absolute, so it follows whatever host is serving
 * the page.
 */
export function ogImage(): string {
  return absolute("/brand/og-image.jpg");
}

export const OG_IMAGE_ALT =
  "Solar panels covering a red tiled roof, with domed roof windows in front and trees and sky beyond.";

/**
 * The head tags every page carries, so no route can forget one and so the
 * social and search previews stay identical in shape from page to page. Each
 * route supplies its own exact title, description and path, and the URL stems
 * from the host serving the page.
 */
export function socialMeta({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description: string;
}) {
  const image = ogImage();
  return [
    { property: "og:url", content: url },
    { property: "og:site_name", content: "Firefly Solar" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: OG_IMAGE_ALT },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: OG_IMAGE_ALT },
  ];
}

/**
 * The four real routes, in one place, for the sitemap. The 404 route is not a
 * page and is deliberately absent: a sitemap only lists addresses worth
 * crawling.
 */
export const SITEMAP_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/portfolio", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "yearly", priority: "0.8" },
] as const;

/** The date the four routes were last edited, for `lastmod`. */
export const SITEMAP_LASTMOD = "2026-10-02";
