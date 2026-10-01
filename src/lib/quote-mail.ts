/**
 * Server side delivery for the quote form. Imported only from the /api/quote
 * route handler, never from a component, so the SMTP password never reaches the
 * browser bundle.
 *
 * Everything here is written so the endpoint cannot claim a send that did not
 * happen: a missing mailbox configuration, a refused connection, a failed login
 * or a timeout each come back as a non 2xx with a machine readable reason, and
 * only a message the mail server actually accepted returns ok.
 */
import nodemailer from "nodemailer";

export type QuoteFields = {
  name: string;
  email: string;
  phone: string;
  postal: string;
  property: string;
  message: string;
};

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
};

/** Rejected before the body is even read, so an oversized post cannot cost much. */
export const MAX_BODY_BYTES = 8 * 1024;

/** A per IP enquiry limit, generous for a household and tight for a script. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

export const FIELD_LIMITS: Record<keyof QuoteFields, number> = {
  name: 80,
  email: 160,
  phone: 40,
  postal: 12,
  property: 60,
  message: 2000,
};

/** Field names as the customer sees them, so a rejection reads like English. */
export const FIELD_LABELS: Record<keyof QuoteFields, string> = {
  name: "Full name",
  email: "Email",
  phone: "Phone",
  postal: "Postal code",
  property: "Property type",
  message: "Message",
};

const EMAIL_SHAPE = /^[A-Za-z0-9._%+]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_SHAPE = /^[0-9+() .]+$/;

/**
 * Trim, drop control characters and, for single line fields, collapse runs of
 * whitespace. Newlines in a name or an address would otherwise be a way to
 * smuggle extra mail headers into the subject or the reply to.
 */
function clean(value: unknown, singleLine: boolean) {
  if (typeof value !== "string") return "";
  const withoutControl = value.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
    " ",
  );
  const text = singleLine
    ? withoutControl.replace(/\s+/g, " ")
    : withoutControl.replace(/\r\n?/g, "\n");
  return text.trim();
}

export type ValidationResult =
  | { ok: true; fields: QuoteFields }
  | { ok: false; reason: "invalid_fields" | "rejected"; fields: string[] };

/**
 * Server side validation, the authority. The browser checks the same shapes
 * first so a customer sees mistakes immediately, but nothing is trusted here.
 */
export function validateQuote(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return { ok: false, reason: "invalid_fields", fields: ["form"] };
  }
  const raw = payload as Record<string, unknown>;

  // Honeypot: a real customer never sees this field, so anything in it is a
  // bot filling every input it can find.
  const trap = clean(raw.company ?? raw.honeypot ?? "", true);
  if (trap) return { ok: false, reason: "rejected", fields: [] };

  const fields: QuoteFields = {
    name: clean(raw.name, true),
    email: clean(raw.email, true),
    phone: clean(raw.phone, true),
    postal: clean(raw.postal, true),
    property: clean(raw.property, true),
    message: clean(raw.message, false),
  };

  const bad: string[] = [];
  const over = (key: keyof QuoteFields) => fields[key].length > FIELD_LIMITS[key];
  const missing = (key: keyof QuoteFields) => fields[key] === "";

  if (missing("name") || over("name")) bad.push(FIELD_LABELS.name);
  if (missing("email") || over("email") || !EMAIL_SHAPE.test(fields.email)) {
    bad.push(FIELD_LABELS.email);
  }
  if (
    missing("phone") ||
    over("phone") ||
    !PHONE_SHAPE.test(fields.phone) ||
    (fields.phone.match(/\d/g) ?? []).length < 9
  ) {
    bad.push(FIELD_LABELS.phone);
  }
  if (missing("postal") || !/^\d{4,10}$/.test(fields.postal.replace(/\s/g, ""))) {
    bad.push(FIELD_LABELS.postal);
  }
  if (missing("property") || over("property")) bad.push(FIELD_LABELS.property);
  if (over("message")) bad.push(FIELD_LABELS.message);

  if (bad.length > 0) return { ok: false, reason: "invalid_fields", fields: bad };
  return { ok: true, fields };
}

/**
 * Fixed window counter per client, kept in memory. A single process serves this
 * site, which is all the protection an enquiry form needs, and the map is swept
 * once it grows so a busy day cannot leak memory.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, now = Date.now()) {
  if (hits.size > 500) {
    for (const [existing, times] of hits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(existing);
    }
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(key, recent);
    const waitMs = RATE_WINDOW_MS - (now - recent[0]);
    return { allowed: false as const, retryAfter: Math.max(1, Math.ceil(waitMs / 1000)) };
  }
  recent.push(now);
  hits.set(key, recent);
  return { allowed: true as const, retryAfter: 0 };
}

/** The visitor's address, as seen through the platform's proxy. */
export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const first = forwarded.split(",")[0]?.trim();
  const address = first || request.headers.get("x-real-ip")?.trim() || "unknown";
  return address.slice(0, 45);
}

export type ConfigResult =
  | { ok: true; config: MailConfig }
  | { ok: false; missing: string[] };

/**
 * Reads the business mailbox credentials. Every value comes from the
 * environment: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, with MAIL_TO as an
 * optional override of the recipient. Nothing is logged here.
 */
export function readMailConfig(env: NodeJS.ProcessEnv = process.env): ConfigResult {
  const host = (env.SMTP_HOST ?? "").trim();
  const user = (env.SMTP_USER ?? "").trim();
  const pass = env.SMTP_PASS ?? "";
  const missing: string[] = [];
  if (!host) missing.push("SMTP_HOST");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (missing.length > 0) return { ok: false, missing };

  const parsedPort = Number.parseInt((env.SMTP_PORT ?? "").trim(), 10);
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 587;
  const setting = (env.SMTP_SECURE ?? "").trim().toLowerCase();
  const secure = setting ? setting === "1" || setting === "true" : port === 465;

  return {
    ok: true,
    config: {
      host,
      port,
      secure,
      user,
      pass,
      to: (env.MAIL_TO ?? "").trim() || "gavin@fireflysolar.co.za",
    },
  };
}

export function enquirySubject(fields: QuoteFields) {
  return `Quote request from ${fields.name}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Every field the customer filled in, laid out to read well in a mail client. */
export function enquiryBodies(fields: QuoteFields) {
  const rows: Array<[string, string]> = [
    ["Full name", fields.name],
    ["Email", fields.email],
    ["Phone", fields.phone],
    ["Postal code", fields.postal],
    ["Property type", fields.property],
  ];
  const text = [
    "New quote request from the Firefly Solar website.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    fields.message || "(none)",
    "",
    `Answer this email to reply to ${fields.name} directly.`,
  ].join("\n");

  const html = [
    "<h2 style=\"margin:0 0 12px;font-family:sans-serif\">Quote request from the Firefly Solar website</h2>",
    "<table cellpadding=\"6\" cellspacing=\"0\" style=\"border-collapse:collapse;font-family:sans-serif;font-size:14px\">",
    ...rows
      .map(
        ([label, value]) =>
          `<tr><td style="font-weight:bold;padding-right:12px">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
      )
      .join(""),
    "</table>",
    `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap"><strong>Message</strong><br>${escapeHtml(fields.message || "(none)")}</p>`,
    `<p style="font-family:sans-serif;font-size:13px;color:#555">Answer this email to reply to ${escapeHtml(fields.name)} directly.</p>`,
  ].join("\n");

  return { text, html };
}

export type SendFailure = {
  reason: "auth_failed" | "unreachable" | "timeout" | "rejected" | "send_failed";
  code: string;
};

/** Turns a nodemailer failure into a short machine readable reason. */
function describeFailure(error: unknown): SendFailure {
  const code = String((error as { code?: unknown })?.code ?? "");
  const message = String((error as { message?: unknown })?.message ?? "");
  if (code === "EAUTH" || /invalid login|authentication|535/i.test(message)) {
    return { reason: "auth_failed", code };
  }
  if (code === "ETIMEDOUT" || /timeout|timed out/i.test(message)) {
    return { reason: "timeout", code };
  }
  if (
    ["ECONNECTION", "ESOCKET", "ECONNREFUSED", "ENOTFOUND", "EHOSTUNREACH", "ECONNRESET", "EDNS"].includes(
      code,
    ) ||
    /refused|getaddrinfo|connect/i.test(message)
  ) {
    return { reason: "unreachable", code };
  }
  if (code === "EENVELOPE") return { reason: "rejected", code };
  return { reason: "send_failed", code };
}

/**
 * Hands the enquiry to the owner's own mailbox. Resolves with a failure instead
 * of throwing so the route can answer with a clear status, and the transport is
 * closed either way so a dead connection cannot pile up.
 */
export async function sendQuoteMail(
  fields: QuoteFields,
  config: MailConfig,
): Promise<{ ok: true } | ({ ok: false } & SendFailure)> {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
  });

  const { text, html } = enquiryBodies(fields);

  try {
    await transport.sendMail({
      from: { name: "Firefly Solar website", address: config.user },
      to: config.to,
      replyTo: { name: fields.name, address: fields.email },
      subject: enquirySubject(fields),
      text,
      html,
    });
    return { ok: true };
  } catch (error) {
    const failure = describeFailure(error);
    // Deliberately no payload and no password here.
    console.error("[api/quote] send failed", {
      reason: failure.reason,
      code: failure.code,
      host: config.host,
      port: config.port,
    });
    return { ok: false, ...failure };
  } finally {
    transport.close();
  }
}
