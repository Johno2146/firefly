/**
 * The enquiry email the business receives: one table based, inline styled HTML
 * document plus a plain text alternative that carries every detail on its own.
 *
 * Built the way email actually has to be built, because the owner reads this in
 * a real mailbox and has already seen a badly rendered version of it:
 *
 * - tables for layout, every style inline, 600px wide, no external stylesheet,
 *   no web font, no JavaScript, no tracking pixel. The only remote image is the
 *   owner's own logo, and with images blocked the words still carry the meaning
 *   because the logo's alt text says the brand and every other element is text.
 * - `color-scheme: light` in the head plus the matching meta tag, so a client in
 *   dark mode renders the design as drawn instead of half inverting it into
 *   something nobody chose. Every surface is painted by a background colour on
 *   the cell that sits behind it, so nothing depends on a client default.
 * - the action links are real destinations: reply opens a message to the
 *   customer, call dials the customer, WhatsApp opens a chat with the customer
 *   with the opener already written. The business's own number, WhatsApp chat
 *   and address are tap links in the footer band.
 *
 * Colour discipline, measured rather than eyeballed (the brief's own figures):
 *   #231F20 on #F2521B  4.66:1  the filled reply button
 *   #231F20 on #F8AB0C  8.4:1   the tag in the header band
 *   #FFFFFF on #231F20  16.3:1  header and footer bands
 *   #231F20 on #FFFFFF  16.3:1  body text and button labels on white
 *   #3F3F46 on #FFFFFF  10.4:1  labels and secondary lines
 *   #F8AB0C on #231F20  8.4:1   the trading name in the footer band
 *   #231F20 on #F4F4F5  14.7:1  the customer's message in its own panel
 *   #F2521B is used for rules, the panel edge and button borders only, never as
 *   small text on a light surface (3.5:1 there), and white is never set small on
 *   orange (3.5:1 there).
 *
 * No dash characters of any kind in any visible text, the owner's rule. Nothing
 * here claims anything the form did not establish, and nothing in it is
 * invented: the only facts are the customer's own answers, the owner's own
 * contact details and the time the server built the message.
 */

/** The five answers plus the message, exactly as the form collects them. */
export type EmailFields = {
  name: string;
  email: string;
  phone: string;
  postal: string;
  property: string;
  message: string;
};

/** The owner's own contact details, the same ones the website shows. */
export const BUSINESS = {
  phone: "+27 71 300 7422",
  phoneHref: "tel:+27713007422",
  whatsapp: "https://wa.me/27713007422",
  email: "gavin@fireflysolar.co.za",
  emailHref: "mailto:gavin@fireflysolar.co.za",
  place: "Boksburg, Gauteng",
  trading: "G.A. Installations t/a Firefly Solar",
} as const;

/** Served from the live domain, so the mailbox resolves it with no attachment. */
export const LOGO_URL =
  "https://www.fireflysolar.co.za/brand/firefly-logo-on-dark.png";

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/** The same words the form's own picker shows, so the email reads like the form. */
const PROPERTY_LABELS: Record<string, string> = {
  "free-standing house": "Free standing house",
  townhouse: "Townhouse or cluster home",
  apartment: "Apartment or flat",
  smallholding: "Smallholding",
  other: "Something else",
};

function propertyLabel(value: string) {
  return PROPERTY_LABELS[value.trim().toLowerCase()] ?? value;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * When the server built the message, in the owner's own clock. South Africa
 * keeps a fixed offset of two hours all year, so the date is shifted and then
 * read in UTC: no locale data, no daylight saving, no surprise.
 */
export function formatSast(at: Date): string {
  const sast = new Date(at.getTime() + 2 * 60 * 60 * 1000);
  const hours = String(sast.getUTCHours()).padStart(2, "0");
  const minutes = String(sast.getUTCMinutes()).padStart(2, "0");
  return `${sast.getUTCDate()} ${MONTHS[sast.getUTCMonth()]} ${sast.getUTCFullYear()} at ${hours}:${minutes} (SAST)`;
}

export type PhoneLinks = {
  /** What the customer typed, shown as is so the owner recognises it. */
  display: string;
  /** Always dialable: a local number is lifted to its country form. */
  tel: string;
  /** A chat with the customer on WhatsApp, or null when the number is not a mobile. */
  whatsapp: string | null;
};

const SA_MOBILE = /^27[678]/;

/**
 * Turns the customer's number into the two links worth putting in an email.
 *
 * A South African number typed locally (071 300 7422) is lifted to its country
 * form so a phone anywhere dials it. A South African landline gets a call link
 * but no WhatsApp link, because WhatsApp does not reach a landline and a button
 * that cannot work is worse than no button. An unknown shape still gets a call
 * link, since dialling is harmless.
 */
export function phoneLinks(raw: string): PhoneLinks {
  const display = raw.trim();
  const typedInternational = /^\s*\+/.test(raw);
  const digits = raw.replace(/\D/g, "");

  let lifted: string | null = null;
  if (/^0\d{9}$/.test(digits)) lifted = `27${digits.slice(1)}`;
  else if (/^27\d{9}$/.test(digits)) lifted = digits;
  else if (digits.length >= 9 && digits.length <= 15) lifted = digits;

  if (!lifted) return { display, tel: "", whatsapp: null };

  let whatsapp: string | null = lifted;
  if (lifted.startsWith("27") && lifted.length === 11 && !SA_MOBILE.test(lifted)) {
    whatsapp = null;
  }
  // A number with no country code and no recognisable prefix is a guess, so it
  // keeps its call link and loses its WhatsApp button.
  if (!typedInternational && !lifted.startsWith("27")) whatsapp = null;

  return { display, tel: `+${lifted}`, whatsapp };
}

/** `mailto:` to the customer, no query: the plain address, nothing glued on. */
export function customerMailto(fields: EmailFields) {
  return `mailto:${fields.email}`;
}

/** `mailto:` to the customer with the reply already started. */
export function replyHref(fields: EmailFields) {
  const subject = "Your Firefly Solar quote request";
  const body = `Hi ${fields.name.split(" ")[0] || fields.name},`;
  return `${customerMailto(fields)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * The WhatsApp opener, with the enquiry already written, so a tap from the
 * owner's phone opens the chat ready to send. Kept short on purpose: WhatsApp
 * carries this text in the URL, and a parcel of a URL is the one thing a phone
 * can quietly truncate.
 */
export function whatsappOpener(fields: EmailFields) {
  const first = fields.name.split(" ")[0] || fields.name;
  return `Hi ${first}, this is Firefly Solar. Thank you for your quote request on our website. I would like to find out more about what you need. When is a good time to talk?`;
}

export function whatsappHref(fields: EmailFields, number: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappOpener(fields))}`;
}

/** The hidden first line, so the inbox preview says something useful. */
function preheader(fields: EmailFields) {
  const parts = [fields.name];
  const property = propertyLabel(fields.property);
  if (property) parts.push(property);
  if (fields.postal) parts.push(`postal code ${fields.postal}`);
  return `${parts.join(", ")}. New quote request from the Firefly Solar website.`;
}

/** One row of the details table: a label, a value, an optional last row flag. */
function detailRow(label: string, value: string, last = false) {
  const edge = last ? "" : "border-bottom:1px solid #F2521B;";
  return `<tr>
              <td width="132" valign="top" style="width:132px;padding:14px 16px 14px 0;${edge}font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.09em;text-transform:uppercase;color:#3F3F46;">${escapeHtml(label)}</td>
              <td valign="top" style="padding:14px 0;${edge}font-family:${FONT};font-size:16px;line-height:1.5;color:#231F20;">${escapeHtml(value)}</td>
            </tr>`;
}

/**
 * A bulletproof button: the colour sits on the cell, so Outlook's Word engine
 * paints the whole block, and the anchor fills it everywhere else. `filled`
 * carries brand black on orange (4.66:1); the outlined pair carries brand black
 * on white with an orange hairline, which is an accent, never text.
 */
function button(href: string, label: string, filled: boolean, last = false) {
  const background = filled ? "#F2521B" : "#FFFFFF";
  const border = filled ? "" : "border:2px solid #F2521B;";
  return `<tr>
                <td style="padding:0 0 ${last ? "0" : "10px"};">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td align="center" bgcolor="${background}" style="background-color:${background};${border}border-radius:8px;">
                        <a href="${escapeHtml(href)}" style="display:block;padding:15px 18px;font-family:${FONT};font-size:17px;font-weight:bold;line-height:1.3;color:#231F20;text-decoration:none;">${escapeHtml(label)}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>`;
}

/** A hairline rule in the given colour, as its own row so padding cannot paint it. */
function rule(colour: string, spaceBefore: number) {
  return `<tr>
                <td style="padding:${spaceBefore}px 0 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                    <tr><td height="1" bgcolor="${colour}" style="height:1px;background-color:${colour};font-size:0;line-height:0;">&nbsp;</td></tr>
                  </table>
                </td>
              </tr>`;
}

/** The whole message: the plain text alternative and the HTML document. */
export function enquiryEmail(fields: EmailFields, at = new Date()) {
  const received = formatSast(at);
  const phone = phoneLinks(fields.phone);
  const message = fields.message.trim();
  const firstName = fields.name.split(" ")[0] || fields.name;
  const property = propertyLabel(fields.property);

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Quote request from ${escapeHtml(fields.name)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F4F5;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;color:#F4F4F5;mso-hide:all;">${escapeHtml(preheader(fields))}&#8203;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<!--[if mso | IE]>
<table role="presentation" align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr><td>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
  <tr>
    <td align="center" style="padding:24px 12px;background-color:#F4F4F5;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border-radius:10px;overflow:hidden;">

        <tr>
          <td bgcolor="#231F20" style="background-color:#231F20;padding:22px 18px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
              <tr>
                <td align="left" valign="middle" width="140" style="width:140px;color:#FFFFFF;font-family:${FONT};font-size:17px;font-weight:bold;">
                  <img src="${LOGO_URL}" width="140" height="76" alt="Firefly Solar" style="display:block;width:140px;height:76px;border:0;outline:none;text-decoration:none;">
                </td>
                <td align="right" valign="middle" style="font-family:${FONT};">
                  <span style="display:inline-block;padding:7px 12px;background-color:#F8AB0C;border-radius:999px;font-size:12px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#231F20;">New quote request</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:26px 26px 0;background-color:#FFFFFF;">
            <p style="margin:0;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.11em;text-transform:uppercase;color:#3F3F46;">From the website quote form</p>
            <h1 style="margin:10px 0 0;font-family:${FONT};font-size:26px;line-height:1.25;font-weight:bold;color:#231F20;">${escapeHtml(fields.name)}</h1>
            <p style="margin:12px 0 0;font-family:${FONT};font-size:15px;line-height:1.9;color:#3F3F46;">
              <a href="${escapeHtml(customerMailto(fields))}" style="color:#231F20;text-decoration:underline;word-wrap:break-word;">${escapeHtml(fields.email)}</a><br>
              ${phone.tel ? `<a href="${escapeHtml(phone.tel)}" style="color:#231F20;text-decoration:underline;white-space:nowrap;">${escapeHtml(phone.display)}</a>` : `<span style="white-space:nowrap;">${escapeHtml(phone.display)}</span>`}
            </p>
          </td>
        </tr>

        ${rule("#F2521B", 22)}

        <tr>
          <td style="padding:8px 26px 0;background-color:#FFFFFF;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              ${detailRow("Property type", property || "Not given")}
              ${detailRow("Postal code", fields.postal || "Not given")}
              ${detailRow("Received", received, true)}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:22px 26px 0;background-color:#FFFFFF;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#F4F4F5;border-left:4px solid #F2521B;border-radius:0 8px 8px 0;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.09em;text-transform:uppercase;color:#3F3F46;">What ${escapeHtml(firstName)} wrote</p>
                  <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.6;color:#231F20;">${
                    message
                      ? escapeHtml(message).replace(/\n/g, "<br>")
                      : "No message was added to this request."
                  }</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:26px 26px 0;background-color:#FFFFFF;">
            <p style="margin:0 0 14px;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.11em;text-transform:uppercase;color:#3F3F46;">Answer this enquiry</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              ${button(replyHref(fields), `Reply to ${firstName}`, true)}
              ${phone.tel ? button(`tel:${phone.tel}`, `Call ${firstName} on ${phone.display}`, false, !(phone.tel && phone.whatsapp)) : ""}
              ${phone.tel && phone.whatsapp ? button(whatsappHref(fields, phone.whatsapp), `WhatsApp ${firstName}`, false, true) : ""}
            </table>
            ${
              phone.tel && !phone.whatsapp
                ? `<p style="margin:12px 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:#3F3F46;">There is no WhatsApp link for ${escapeHtml(phone.display)}, because that number is not a mobile.</p>`
                : ""
            }
          </td>
        </tr>

        <tr>
          <td style="padding:20px 26px 26px;background-color:#FFFFFF;">
            <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.7;color:#3F3F46;">Replying to this email answers ${escapeHtml(fields.name)} directly. It was sent automatically by the quote form on the Firefly Solar website on ${escapeHtml(received)}.</p>
          </td>
        </tr>

        <tr>
          <td bgcolor="#231F20" style="background-color:#231F20;padding:24px 26px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
              <tr>
                <td valign="top" style="font-family:${FONT};font-size:15px;line-height:1.9;color:#FFFFFF;">
                  <a href="${BUSINESS.phoneHref}" style="color:#FFFFFF;text-decoration:underline;">${BUSINESS.phone}</a><br>
                  <a href="${BUSINESS.whatsapp}" style="color:#FFFFFF;text-decoration:underline;">WhatsApp Firefly Solar</a><br>
                  <a href="${BUSINESS.emailHref}" style="color:#FFFFFF;text-decoration:underline;">${BUSINESS.email}</a><br>
                  <span style="color:#FFFFFF;">${BUSINESS.place}</span>
                </td>
              </tr>
              ${rule("#F8AB0C", 18)}
            </table>
            <p style="margin:18px 0 0;font-family:${FONT};font-size:13px;font-weight:bold;color:#F8AB0C;">${BUSINESS.trading}</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
<!--[if mso | IE]>
</td></tr></table>
<![endif]-->
</body>
</html>`;

  /**
   * The plain text part, written to stand alone: a reader of this version gets
   * every field, the message, both sets of contact details and the same note
   * about what replying does.
   */
  const text = [
    "New quote request from the Firefly Solar website.",
    "",
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `Property type: ${property || "Not given"}`,
    `Postal code: ${fields.postal || "Not given"}`,
    `Received: ${received}`,
    "",
    `What ${firstName} wrote:`,
    message || "No message was added to this request.",
    "",
    "Answer this enquiry:",
    `Reply by email to ${fields.email}`,
    phone.tel ? `Call ${fields.phone} (${phone.tel})` : `Call ${fields.phone}`,
    phone.tel && phone.whatsapp
      ? `WhatsApp ${fields.phone}: ${whatsappHref(fields, phone.whatsapp)}`
      : `WhatsApp: no link, because ${fields.phone} is not a mobile number`,
    "",
    "Firefly Solar",
    `Phone: ${BUSINESS.phone}`,
    `WhatsApp: ${BUSINESS.whatsapp}`,
    `Email: ${BUSINESS.email}`,
    BUSINESS.place,
    BUSINESS.trading,
    "",
    `Replying to this email answers ${fields.name} directly. It was sent automatically by the quote form on the Firefly Solar website on ${received}.`,
  ].join("\n");

  return { text, html };
}
