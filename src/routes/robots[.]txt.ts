import { createFileRoute } from "@tanstack/react-router";
import { origin } from "~/lib/site";

/**
 * /robots.txt, served per request rather than as a static file.
 *
 * A static file can only ever name one host, and this site is served on two
 * (the business's own domain and our working copy on the platform), so a fixed
 * `Sitemap:` line would send a crawler that arrived on one host off to the
 * other. Both the comment line and the `Sitemap:` line therefore come from
 * `origin()`, which reads the host the request was actually made on.
 *
 * Every crawl rule is unchanged: ordinary crawlers, AI assistants and search
 * engines are all welcome, and nothing here is behind a paywall or a login.
 * There are no dash characters in the emitted file.
 *
 * `no-store`, because the body depends on the host it was asked for: a shared
 * cache must never hand one host's addresses to a visitor of the other.
 */
const BODY_LINES = [
  "# robots.txt for Firefly Solar",
  "# {origin}",
  "# Every ordinary crawler is welcome, and so is every AI assistant and answer",
  "# engine. The site is public marketing material for a solar installer, and",
  "# being quoted by an assistant is another way for the right customer to find",
  "# the business. Nothing here is behind a paywall or a login.",
  "User-agent: *",
  "Allow: /",
  "# AI and answer engine crawlers, named one by one so the intent is explicit.",
  "User-agent: GPTBot",
  "Allow: /",
  "User-agent: ChatGPT-User",
  "Allow: /",
  "User-agent: OAI-SearchBot",
  "Allow: /",
  "User-agent: ClaudeBot",
  "Allow: /",
  "User-agent: Claude-Web",
  "Allow: /",
  "User-agent: anthropic-ai",
  "Allow: /",
  "User-agent: PerplexityBot",
  "Allow: /",
  "User-agent: Perplexity-User",
  "Allow: /",
  "User-agent: Google-Extended",
  "Allow: /",
  "User-agent: Applebot",
  "Allow: /",
  "User-agent: Applebot-Extended",
  "Allow: /",
  "User-agent: CCBot",
  "Allow: /",
  "User-agent: Amazonbot",
  "Allow: /",
  "User-agent: meta-externalagent",
  "Allow: /",
  "User-agent: cohere-ai",
  "Allow: /",
  "User-agent: YouBot",
  "Allow: /",
  "# Search engines.",
  "User-agent: Googlebot",
  "Allow: /",
  "User-agent: Bingbot",
  "Allow: /",
  "User-agent: DuckDuckBot",
  "Allow: /",
  "User-agent: Slurp",
  "Allow: /",
  "Sitemap: {origin}/sitemap.xml",
  "",
];

function robotsTxt(): Response {
  const body = BODY_LINES.map((line) => line.replace("{origin}", origin())).join("\n");
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => robotsTxt(),
      HEAD: () =>
        new Response(null, {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
          },
        }),
    },
  },
});
