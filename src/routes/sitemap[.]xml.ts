import { createFileRoute } from "@tanstack/react-router";
import { SITEMAP_LASTMOD, SITEMAP_ROUTES, origin } from "~/lib/site";

/**
 * /sitemap.xml, served per request rather than as a static file.
 *
 * The four real routes are listed, each as an absolute address on the host this
 * request arrived on. A static file can only name one host, which is how the
 * owner's domain came to publish a sitemap full of platform addresses. The 404
 * route is not a page and is not listed: nothing is added to this list by
 * accident, `SITEMAP_ROUTES` is the whole of it.
 *
 * `no-store`, because the body depends on the host it was asked for.
 */
function sitemapXml(): string {
  const base = origin();
  const urls = SITEMAP_ROUTES.map((route) => {
    const loc = route.path === "/" ? `${base}/` : `${base}${route.path}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${SITEMAP_LASTMOD}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      "  </url>",
    ].join("\n");
  }).join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapXml(), {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "no-store",
          },
        }),
      HEAD: () =>
        new Response(null, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "no-store",
          },
        }),
    },
  },
});
