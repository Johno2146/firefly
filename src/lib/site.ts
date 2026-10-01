/**
 * The published address of this site.
 *
 * One constant, read by the canonical link, `og:url` and the social image URL
 * on every route. `public/robots.txt` and `public/sitemap.xml` are static files
 * and cannot import this, so they carry the same host written out in full;
 * if the domain ever changes, those two files change with this one.
 */
export const SITE_URL = "https://de2e690c82a5f81556112a54bafb81f.ctonew.app";

/** Absolute URL for a route path, e.g. "/services" -> ".../services". */
export function absolute(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The social sharing image: one of the owner's own installation photographs
 * (the rooftop array from photo 13, the same frame the home page hero uses),
 * cut to the 1200 x 630 that social cards expect. Real photography, no plate
 * and no invented artwork.
 */
export const OG_IMAGE = absolute("/brand/og-image.jpg");

export const OG_IMAGE_ALT =
  "Solar panels covering a red tiled roof, with domed roof windows in front and trees and sky beyond.";

/**
 * The head tags every page carries, so no route can forget one and so the
 * social and search previews stay identical in shape from page to page. Each
 * route supplies its own exact title, description and path.
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
  return [
    { property: "og:url", content: url },
    { property: "og:site_name", content: "Firefly Solar" },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: OG_IMAGE_ALT },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE },
    { name: "twitter:image:alt", content: OG_IMAGE_ALT },
  ];
}
