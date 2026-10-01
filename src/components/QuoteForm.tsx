import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  IconArrowRight,
  IconCheck,
  IconMail,
  IconWhatsApp,
} from "~/components/Icons";
import { Reveal } from "~/components/Reveal";
import { CONTACT, whatsappLink } from "~/lib/content";

/**
 * The quote form tries to send the enquiry itself, through POST /api/quote, so
 * the customer presses send once and nothing else. What happens next depends on
 * what the server actually did, and the page only ever reports that.
 *
 * sent (a 2xx from the server): the enquiry is in the business inbox, and the
 * success panel appears. It can only appear on a 2xx.
 *
 * not switched on yet (the 503 not_configured answer, which is the real state
 * until the owner saves the mailbox credentials): the page does not dead end
 * there. It composes the enquiry as a mailto: with every field the customer
 * filled in, opens it through a real anchor click, and says plainly that the
 * site could not send it by itself, the email app is open with the details
 * ready, and the customer presses send there. The success panel stays hidden,
 * because nothing was sent by this site.
 *
 * a real failure (unreachable, auth_failed, timeout, rejected, send_failed and
 * the rest): the error panel explains what did not work, and the same
 * compose-it-yourself action sits beside it as a clear second way through, so a
 * struggling server never leaves a customer with no route to the business.
 *
 * The email and WhatsApp buttons are the other way round. They hand the enquiry
 * to the customer's own app, and the status line next to them says exactly
 * that: what the site opened, and the one tap the customer still has to make.
 * This page cannot see inside another app, so it never says an enquiry was
 * received on that route, and it never forgets what the customer typed.
 */

const NEXT_STEPS = [
  "Press send and your enquiry comes straight to our inbox.",
  "You get a design and a fixed price, not a hard sell.",
  "Nothing is booked until you say yes to the numbers.",
];

type Values = {
  name: string;
  email: string;
  phone: string;
  postal: string;
  property: string;
  message: string;
};

const EMPTY: Values = {
  name: "",
  email: "",
  phone: "",
  postal: "",
  property: "",
  message: "",
};

/** South African property types, the shape of home a solar design is built for. */
const PROPERTY_TYPES = [
  { value: "free-standing house", label: "Free standing house" },
  { value: "townhouse", label: "Townhouse or cluster home" },
  { value: "apartment", label: "Apartment or flat" },
  { value: "smallholding", label: "Smallholding" },
  { value: "other", label: "Something else" },
];

function propertyLabel(value: string) {
  return PROPERTY_TYPES.find((type) => type.value === value)?.label ?? value;
}

/** The enquiry as plain lines, shared by the email body and the WhatsApp text. */
function enquiryLines(values: Values) {
  // Only the fields the customer actually filled in, so a tap on WhatsApp
  // from an untouched form sends a short sensible message rather than a page
  // of empty labels.
  const lines = ["Hi Firefly Solar, I would like a quote for solar."];
  const details: string[] = [];
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const postal = values.postal.trim();
  if (name) details.push(`Name: ${name}`);
  if (email) details.push(`Email: ${email}`);
  if (phone) details.push(`Phone: ${phone}`);
  if (postal) details.push(`Postal code: ${postal}`);
  if (values.property) details.push(`Property type: ${propertyLabel(values.property)}`);
  if (details.length > 0) lines.push("", ...details);
  const message = values.message.trim();
  if (message) lines.push("", `Message: ${message}`);
  return lines;
}

/** Everything the customer typed, as a mailto: their own email app will open. */
function mailtoHref(values: Values) {
  const subject = `Quote request: ${values.name.trim() || "solar for my home"}`;
  const body = enquiryLines(values).join("\n");
  return `${CONTACT.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** What the page shows while the server is working, and afterwards. */
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed"; title: string; body: string }
  | { kind: "unconfigured" };

type Channel = "whatsapp" | "email";

/**
 * The handoff note. `opened` is shown the moment the customer taps one of the
 * two buttons; `returned` replaces it gently once they come back to the page,
 * and only says thank you if they say they sent it.
 */
type Handoff = { channel: Channel; stage: "opened" | "returned" };

const HANDOFF_TEXT: Record<Channel, Record<Handoff["stage"], string>> = {
  whatsapp: {
    opened: `WhatsApp is open with your details ready in a new chat with Firefly Solar on ${CONTACT.phone}. WhatsApp is a separate app, so this page cannot see inside it. Press send there and your enquiry reaches us.`,
    returned:
      "Welcome back. If you pressed send in WhatsApp, thank you, your enquiry is on its way to our inbox. If WhatsApp did not open, or the message is still sitting there unsent, use the email button instead.",
  },
  email: {
    opened: `Your email app is open with your details ready in a new message to ${CONTACT.email}. Your email app is a separate programme, so this page cannot see inside it. Press send there and your enquiry reaches us.`,
    returned:
      "Welcome back. If you pressed send in your email app, thank you, your enquiry is on its way to our inbox. If it did not open, use the WhatsApp button instead.",
  },
};

const NOT_SENT_TITLE = "Your details did not go through.";

/**
 * The two step wording for the fallback, used for both the automatic handoff on
 * the not configured answer and the error panel's second action. It never says
 * an enquiry was sent: the site could not send it, the customer's own email app
 * is open with the details ready, and the customer presses send there. No dash
 * characters anywhere, by the owner's rule.
 */
const FALLBACK_PANEL_TITLE = "This form cannot send your enquiry by itself yet.";
const FALLBACK_PANEL_BODY = `Automatic sending is not switched on at the moment, so nothing has been sent from this page. Your email app has been opened with everything you typed already written into a message to ${CONTACT.email}. Press send there and your enquiry reaches our inbox. If it did not open, the button below opens it again. Everything you typed is still in the form.`;
const FALLBACK_PANEL_NOTE =
  "WhatsApp works the same way: the buttons just below hand it the same details and you press send there.";

const FALLBACK_BUTTON_LABEL = "Open my email app";
const FAILURE_FALLBACK_LABEL = "Send it from my own email app instead";
const FAILURE_FALLBACK_NOTE =
  "Your email app opens with everything you typed already written in, and you press send there. WhatsApp works the same way with the buttons just below.";

/** The wording for each machine readable reason the server can send back. */
function failureFrom(reason: string, fields: unknown): { title: string; body: string } {
  const fallback =
    "Something went wrong before your message reached our inbox. Everything you typed is still in the form, so press send again in a moment, or use the email or WhatsApp buttons just below.";
  if (reason === "rate_limited") {
    return {
      title: NOT_SENT_TITLE,
      body: "Too many enquiries came from this connection in the last few minutes, so this one was held back. Wait a few minutes and press send again, or use the email or WhatsApp buttons just below.",
    };
  }
  if (reason === "invalid_fields" || reason === "rejected" || reason === "invalid_body") {
    const list = Array.isArray(fields)
      ? fields.filter((field): field is string => typeof field === "string")
      : [];
    return {
      title: NOT_SENT_TITLE,
      body:
        list.length > 0
          ? `Please check these details and press send again: ${list.join(", ")}. Everything you typed is still in the form.`
          : "Please check your details and press send again. Everything you typed is still in the form.",
    };
  }
  return { title: NOT_SENT_TITLE, body: fallback };
}

export function QuoteForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const composeRef = useRef<HTMLAnchorElement>(null);
  const handoffRef = useRef<Handoff | null>(null);
  const handoffAt = useRef(0);

  const set = <K extends keyof Values>(field: K, value: Values[K]) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  /**
   * Opens the enquiry in the customer's own email app through a real click on a
   * real anchor, so the browser treats it as the same navigation the customer
   * would get from pressing the email button themselves. The href is set from
   * the values that were just submitted, never from a stale snapshot.
   */
  const composeInOwnApp = (submitted: Values) => {
    const anchor = composeRef.current;
    if (!anchor) return;
    anchor.href = mailtoHref(submitted);
    anchor.click();
  };

  const showHandoff = (next: Handoff | null) => {
    handoffRef.current = next;
    if (next) handoffAt.current = Date.now();
    setHandoff(next);
  };

  /** Move focus to the panel so a keyboard or screen reader user lands on it. */
  useEffect(() => {
    if (status.kind === "sent" || status.kind === "failed" || status.kind === "unconfigured") {
      const frame = requestAnimationFrame(() => panelRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [status]);

  /**
   * Coming back from WhatsApp or a mail app. The gentle extra line is only
   * shown if the customer was away for a moment, so a stray focus event right
   * after the tap cannot promote the note early.
   */
  useEffect(() => {
    const onBack = () => {
      if (document.visibilityState !== "visible") return;
      const current = handoffRef.current;
      if (!current || current.stage === "returned") return;
      if (Date.now() - handoffAt.current < 2500) return;
      showHandoff({ channel: current.channel, stage: "returned" });
    };
    document.addEventListener("visibilitychange", onBack);
    window.addEventListener("focus", onBack);
    return () => {
      document.removeEventListener("visibilitychange", onBack);
      window.removeEventListener("focus", onBack);
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === "sending") return;
    const form = formRef.current;
    if (form && !form.reportValidity()) return;

    // A new attempt clears the note from a previous handoff, so nothing stale
    // is left on screen beside a fresh send.
    showHandoff(null);
    setStatus({ kind: "sending" });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          company: honeypotRef.current?.value ?? "",
        }),
        signal: controller.signal,
      });
      let payload: { ok?: boolean; reason?: string; fields?: unknown } | null = null;
      try {
        payload = (await response.json()) as typeof payload;
      } catch {
        payload = null;
      }

      if (response.ok && payload?.ok === true) {
        setStatus({ kind: "sent" });
        return;
      }

      const reason = typeof payload?.reason === "string" ? payload.reason : "";
      if (reason === "not_configured") {
        // Automatic sending is not switched on, so the site must not pretend it
        // sent anything. Instead the enquiry is composed exactly as it was
        // before server side sending existed and handed to the customer's own
        // email app, which is a route that genuinely reaches the business today.
        setStatus({ kind: "unconfigured" });
        composeInOwnApp(values);
        return;
      }
      setStatus({ kind: "failed", ...failureFrom(reason, payload?.fields) });
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      setStatus({
        kind: "failed",
        title: timedOut ? "Your enquiry was taking too long to send." : NOT_SENT_TITLE,
        body: timedOut
          ? "The request to our inbox timed out before it finished, so nothing was sent. Everything you typed is still in the form, so press send again, or use the email or WhatsApp buttons just below."
          : "This page could not reach our inbox just now, which usually means the connection dropped. Everything you typed is still in the form, so press send again in a moment, or use the email or WhatsApp buttons just below.",
      });
    } finally {
      clearTimeout(timer);
    }
  };

  const whatsappHref = whatsappLink(enquiryLines(values).join("\n"));
  const emailHref = mailtoHref(values);
  const sending = status.kind === "sending";
  const handoffText = handoff ? HANDOFF_TEXT[handoff.channel][handoff.stage] : "";

  /** The compose action offered inside the panels, with the same feedback. */
  const openEmailHandoff = () => showHandoff({ channel: "email", stage: "opened" });

  const fallbackButtonClass =
    "btn mt-4 w-full bg-white/10 py-3.5 text-sm text-white hover:bg-white/16";

  return (
    <section
      id="quote"
      className="on-dark surface-dark relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28"
    >
      <div aria-hidden data-decor className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -bottom-40 h-[28rem] w-[28rem]">
          <div className="glow-flame anim-breathe h-full w-full" />
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow text-flame-300">
            <span aria-hidden className="h-px w-6 bg-flame-500" />
            Get a quote
          </p>
          <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] text-white sm:text-[2.6rem]">
            Tell us about your roof.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            Name, phone, email, postal code and property type: that is all it
            takes to start. Fill in the form and press send, and your enquiry
            comes straight to our inbox.
          </p>

          <ul className="mt-8 space-y-4">
            {NEXT_STEPS.map((step) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-flame-500/15 text-flame-300">
                  <IconCheck className="h-4 w-4" />
                </span>
                <span className="text-[0.97rem] leading-relaxed text-white/80">
                  {step}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-[0.7rem] font-bold tracking-[0.14em] text-flame-200 uppercase">
              How it reaches us
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              The form sends your enquiry to our inbox as an email. Nothing is
              kept on this website. If you would rather send it yourself, the
              buttons on the form open your own email app or WhatsApp with the
              details already written in. Prefer to talk it through? Call{" "}
              <a
                href={CONTACT.phoneHref}
                className="font-semibold text-white transition-colors hover:text-flame-300"
              >
                {CONTACT.phone}
              </a>
              .
            </p>
          </div>
        </Reveal>

        <Reveal from="right" delay={80}>
          {/*
            Before React hydrates, the send button is an ordinary submit button
            with no handler attached yet, so a press would trigger a native
            submit. With no method the browser default is GET, which puts the
            customer's name, email and phone straight into the URL bar and into
            the browser's history. POSTing to the endpoint the form really uses
            keeps every value out of the query string: the worst that window can
            do is show the endpoint's plain "JSON only" answer, and nothing is
            stored anywhere. Once hydration is done this path is never taken,
            because handleSubmit calls preventDefault and the fetch below is the
            only way an enquiry leaves the page.
          */}
          <form
            ref={formRef}
            method="post"
            action="/api/quote"
            className="relative rounded-3xl border border-white/12 bg-ink-900/85 p-6 sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-white/85"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={values.name}
                  onChange={(event) => set("name", event.target.value)}
                  placeholder="John Smith"
                  className="field"
                />
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-white/85"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => set("email", event.target.value)}
                  placeholder="yourname@yourdomain.co.za"
                  className="field"
                />
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-white/85"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="[0-9+() ]{9,16}"
                  value={values.phone}
                  onChange={(event) => set("phone", event.target.value)}
                  placeholder="071 300 7422"
                  className="field"
                />
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="postal"
                  className="mb-2 block text-sm font-semibold text-white/85"
                >
                  Postal code
                </label>
                <input
                  id="postal"
                  name="postal"
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={values.postal}
                  onChange={(event) => set("postal", event.target.value)}
                  placeholder="1459"
                  className="field"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="property"
                  className="mb-2 block text-sm font-semibold text-white/85"
                >
                  Property type
                </label>
                <select
                  id="property"
                  name="property"
                  className={values.property ? "field" : "field field-empty"}
                  value={values.property}
                  onChange={(event) => set("property", event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose a property type
                  </option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-white/85"
                >
                  Message{" "}
                  <span className="font-normal text-white/45">(optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={(event) => set("message", event.target.value)}
                  placeholder="Roof direction, what you would like to change about your bills, questions…"
                  className="field resize-y"
                />
              </div>
            </div>

            {/*
              Honeypot. A customer never sees or reaches this field, so anything
              in it is a script filling every input it can find, and the server
              throws the enquiry away.
            */}
            <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input
                ref={honeypotRef}
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            {/*
              The anchor the automatic fallback clicks. It lives in the DOM as a
              real <a href="mailto:..."> so the click is an ordinary navigation
              rather than a scripted one, and it is kept out of sight and out of
              the tab order because the visible buttons are the ones a customer
              uses. Its href is rewritten from the submitted values each time.
            */}
            <a
              ref={composeRef}
              href={emailHref}
              tabIndex={-1}
              aria-hidden
              className="sr-only"
            >
              Open my email app with this enquiry
            </a>

            <div className="mt-7">
              <button
                type="submit"
                disabled={sending}
                className="btn btn-flame w-full py-4 text-base disabled:cursor-progress disabled:opacity-70"
              >
                {sending ? "Sending your enquiry…" : "Send my enquiry"}
                <IconArrowRight className="h-4.5 w-4.5" />
              </button>

              <div
                ref={panelRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="focus-visible:outline-none"
              >
                {status.kind === "sending" ? (
                  <p className="mt-4 text-center text-xs leading-relaxed text-white/60">
                    Sending your enquiry to our inbox now.
                  </p>
                ) : null}

                {status.kind === "sent" ? (
                  <div className="notice-panel mt-5 rounded-2xl border border-flame-400/40 bg-flame-500/12 p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-flame-100">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-flame-500/20">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      Your enquiry has been sent.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      Thank you, it reached the Firefly Solar inbox with the
                      details you filled in. Next comes a design and a fixed
                      price for your roof, and nothing is booked until you say
                      yes to the numbers.
                    </p>
                  </div>
                ) : null}

                {status.kind === "failed" ? (
                  <div className="notice-panel mt-5 rounded-2xl border border-white/25 bg-white/[0.07] p-5">
                    <p className="text-sm font-bold text-white">{status.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {status.body}
                    </p>
                    {/*
                      The second way through. A server that is configured but
                      struggling must never leave the customer with no route to
                      the business, so the same compose it yourself action is
                      offered right here, clearly labelled as a different thing
                      from the send that just failed.
                    */}
                    <a
                      href={emailHref}
                      onClick={openEmailHandoff}
                      className={fallbackButtonClass}
                    >
                      <IconMail className="h-4.5 w-4.5" />
                      {FAILURE_FALLBACK_LABEL}
                    </a>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {FAILURE_FALLBACK_NOTE}
                    </p>
                  </div>
                ) : null}

                {status.kind === "unconfigured" ? (
                  <div className="notice-panel mt-5 rounded-2xl border border-white/25 bg-white/[0.07] p-5">
                    <p className="text-sm font-bold text-white">
                      {FALLBACK_PANEL_TITLE}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {FALLBACK_PANEL_BODY}
                    </p>
                    <a
                      href={emailHref}
                      onClick={openEmailHandoff}
                      className={fallbackButtonClass}
                    >
                      <IconMail className="h-4.5 w-4.5" />
                      {FALLBACK_BUTTON_LABEL}
                    </a>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {FALLBACK_PANEL_NOTE}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.04] p-4">
              <p className="text-[0.7rem] font-bold tracking-[0.14em] text-flame-200 uppercase">
                Or send it yourself
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Both buttons open your own app with the details already written
                in. You press send there, and this page cannot see whether it
                went.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <a
                  href={emailHref}
                  onClick={openEmailHandoff}
                  className="btn bg-white/10 py-3.5 text-sm text-white hover:bg-white/16"
                >
                  <IconMail className="h-4.5 w-4.5" />
                  Open my email app
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => showHandoff({ channel: "whatsapp", stage: "opened" })}
                  className="btn bg-white/10 py-3.5 text-sm text-white hover:bg-white/16"
                >
                  <IconWhatsApp className="h-4.5 w-4.5" />
                  Open WhatsApp
                </a>
              </div>

              <p
                role="status"
                aria-live="polite"
                className={
                  handoff
                    ? "notice-panel mt-3 rounded-xl border border-flame-400/40 bg-flame-500/12 p-4 text-xs leading-relaxed text-flame-100"
                    : "sr-only"
                }
              >
                {handoffText}
              </p>
            </div>

            <p className="mt-3.5 text-center text-xs leading-relaxed text-white/50">
              Your details go to our inbox as an email when you press send. The
              two buttons above hand the same details to your own email app or
              WhatsApp, and you press send there.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
