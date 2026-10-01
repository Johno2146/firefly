import { createFileRoute } from "@tanstack/react-router";

import {
  MAX_BODY_BYTES,
  clientKey,
  rateLimit,
  readMailConfig,
  sendQuoteMail,
  validateQuote,
} from "~/lib/quote-mail";

/**
 * POST /api/quote: the quote form's only way to claim an enquiry was sent.
 *
 * A 200 from here means the business mailbox accepted the message. Anything
 * else is a non 2xx with a machine readable `reason`, so the form can tell the
 * customer the truth: `not_configured`, `invalid_fields`, `rejected`,
 * `rate_limited`, `payload_too_large`, `auth_failed`, `unreachable`, `timeout`,
 * `rejected_by_server` or `send_failed`.
 */
function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

/** Anything that is not a POST is answered here rather than by a page. */
function methodNotAllowed() {
  return json(405, {
    ok: false,
    reason: "method_not_allowed",
    message: "Send the enquiry as a POST request.",
  }, { allow: "POST" });
}

export const Route = createFileRoute("/api/quote")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const type = request.headers.get("content-type") ?? "";
        if (!type.toLowerCase().includes("application/json")) {
          return json(415, {
            ok: false,
            reason: "unsupported_media_type",
            message: "This endpoint takes JSON only.",
          });
        }

        const declared = Number.parseInt(request.headers.get("content-length") ?? "", 10);
        if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
          return json(413, {
            ok: false,
            reason: "payload_too_large",
            message: "That enquiry is too long to send.",
          });
        }

        const limit = rateLimit(clientKey(request));
        if (!limit.allowed) {
          return json(
            429,
            {
              ok: false,
              reason: "rate_limited",
              retryAfter: limit.retryAfter,
              message: "Too many enquiries from this connection just now.",
            },
            { "retry-after": String(limit.retryAfter) },
          );
        }

        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) {
          return json(413, {
            ok: false,
            reason: "payload_too_large",
            message: "That enquiry is too long to send.",
          });
        }

        let payload: unknown;
        try {
          payload = JSON.parse(raw);
        } catch {
          return json(400, {
            ok: false,
            reason: "invalid_body",
            message: "The enquiry could not be read.",
          });
        }

        const checked = validateQuote(payload);
        if (!checked.ok) {
          return json(checked.reason === "rejected" ? 400 : 422, {
            ok: false,
            reason: checked.reason,
            fields: checked.fields,
            message:
              checked.reason === "rejected"
                ? "The enquiry was not accepted."
                : "Some details need another look.",
          });
        }

        const mail = readMailConfig();
        if (!mail.ok) {
          // The owner has not saved the mailbox credentials yet. Say so plainly
          // rather than pretending anything was sent.
          return json(503, {
            ok: false,
            reason: "not_configured",
            message: "Automatic sending is not switched on yet.",
          });
        }

        const sent = await sendQuoteMail(checked.fields, mail.config);
        if (!sent.ok) {
          return json(502, {
            ok: false,
            reason: sent.reason,
            message: "The enquiry did not reach our inbox.",
          });
        }

        return json(200, { ok: true, sent: true });
      },
      GET: () => methodNotAllowed(),
      PUT: () => methodNotAllowed(),
      PATCH: () => methodNotAllowed(),
      DELETE: () => methodNotAllowed(),
      OPTIONS: () => methodNotAllowed(),
      HEAD: () => new Response(null, { status: 405, headers: { allow: "POST" } }),
    },
  },
});
