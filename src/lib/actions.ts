/**
 * The two one tap conversation actions, in one place.
 *
 * The closing band (home, services, portfolio) and the contact page hero both
 * offer the same two actions, so the hrefs, the prefilled text and the
 * accessible names live here rather than being written out twice and drifting
 * apart. The quote form keeps building its own hrefs from what the customer
 * typed, but it opens with the same line.
 *
 * Everything here is a real link target: a `wa.me` chat and a `mailto:` the
 * customer's own apps open. Nothing on this site can see inside those apps, so
 * nothing claims a message was sent. The customer presses send.
 *
 * No dash characters in any of this text, by the owner's rule.
 */

import { CONTACT, whatsappLink } from "~/lib/content";

/** The opener the customer sees already typed in the WhatsApp chat. */
export const WHATSAPP_OPENER =
  "Hi Firefly Solar, I would like a quote for solar.";

/** A plain subject line, and a short opener for the body. */
export const EMAIL_SUBJECT = "Quote request";
export const EMAIL_BODY = "Hi Firefly Solar, I would like a quote for solar.";

/** `https://wa.me/27713007422` with the opener percent encoded. */
export const WHATSAPP_QUOTE_HREF = whatsappLink(WHATSAPP_OPENER);

/**
 * `mailto:gavin@fireflysolar.co.za` with the subject and body percent encoded.
 * The whole thing is encoded, so an `&` inside the subject or body could never
 * break the query into a second parameter.
 */
export const EMAIL_QUOTE_HREF = `${CONTACT.emailHref}?subject=${encodeURIComponent(
  EMAIL_SUBJECT,
)}&body=${encodeURIComponent(EMAIL_BODY)}`;

/**
 * Accessible names that still contain the visible label, so a screen reader
 * gets the destination and voice control can still say what is on screen.
 */
export const WHATSAPP_QUOTE_ARIA = `Chat on WhatsApp with Firefly Solar on ${CONTACT.phone}`;
export const EMAIL_QUOTE_ARIA = `Email us at ${CONTACT.email}`;
