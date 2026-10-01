/**
 * The two clocks that decide how long the quote form waits, kept in one place so
 * they cannot drift apart. Plain numbers only, so both the server route and the
 * browser component can read them without dragging any mail code into the
 * browser bundle.
 *
 * The browser must always give up after the mailer does. If the page gave up
 * first, a customer would be shown a failure for an enquiry the business mailbox
 * had already accepted, and the page would have no answer from the server to say
 * what really happened. So the request limit is derived from the mailer's own
 * worst case rather than typed in by hand.
 *
 * The mailer's worst case is the sum of the phases nodemailer bounds one after
 * the other, each one reached only if the phase before it succeeded: the DNS
 * lookup for the mailbox host, the TCP connection and TLS upgrade, the SMTP
 * greeting, and then silence on an open, greeted session. A mailbox that is
 * simply down or misconfigured ends in the first or second phase, well before
 * that sum, so a dead mailbox is reported in about five seconds while a working
 * but slow one is still given room to finish.
 *
 * The values are sized against measurements of the owner's own mail server
 * (mail.fireflysolar.co.za), taken from the team machine: TCP connect 651 ms and
 * the SMTP greeting 400 ms after that, with each later command answered well
 * inside a second. Every limit below is many times that, so a working send is
 * never cut off, while a broken one is bounded instead of hanging. The numbers
 * nodemailer would otherwise use are far larger (dnsTimeout 30 s,
 * connectionTimeout 2 min, greetingTimeout 30 s, socketTimeout 10 min), which put
 * the mailer's worst case beyond the browser's patience.
 */
export const MAIL_TIMEOUTS = {
  /** DNS lookup for the mailbox host. nodemailer's own default is 30 seconds. */
  dnsTimeout: 4000,
  /** TCP connect and the TLS upgrade. nodemailer's own default is 2 minutes. */
  connectionTimeout: 5000,
  /** The server's SMTP greeting once the socket is open. Default is 30 seconds. */
  greetingTimeout: 6000,
  /** Silence on an open, greeted session. Default is 10 minutes. */
  socketTimeout: 12000,
} as const;

/** Every phase at its limit, one after the other: the mailer's worst case. */
export const MAIL_WORST_CASE_MS =
  MAIL_TIMEOUTS.dnsTimeout +
  MAIL_TIMEOUTS.connectionTimeout +
  MAIL_TIMEOUTS.greetingTimeout +
  MAIL_TIMEOUTS.socketTimeout;

/** Room for the answer to travel back to the browser once the mailer has decided. */
const REQUEST_HEADROOM_MS = 6000;

/** How long the form's fetch waits before it stops and says it cannot be sure. */
export const QUOTE_REQUEST_TIMEOUT_MS = MAIL_WORST_CASE_MS + REQUEST_HEADROOM_MS;
