import { Link } from "@tanstack/react-router";

import { IconMail, IconWhatsApp } from "~/components/Icons";
import { Reveal } from "~/components/Reveal";
import {
  EMAIL_QUOTE_ARIA,
  EMAIL_QUOTE_HREF,
  WHATSAPP_QUOTE_ARIA,
  WHATSAPP_QUOTE_HREF,
} from "~/lib/actions";

/**
 * Closing call-to-action band. Dark, with the same glow treatment as the rest
 * of the site.
 *
 * The first action is a real WhatsApp link, because that is how this kind of
 * business actually gets asked for work: a tap opens the chat with the opener
 * already typed and the customer presses send there. The second is a real
 * `mailto:` in the same tab, so it behaves like every other email link on the
 * site. The quote form stays as a quiet third option underneath them, not
 * replaced by either.
 *
 * Both anchors are ordinary links, so middle click and long press do what the
 * browser normally does with them. Neither one claims anything was sent: the
 * two apps are the customer's own, and the customer sends from inside them.
 */

/** The quiet third option. Underlined text, not a third button. */
const FORM_LINK_CLASS =
  "inline-flex items-center gap-2 text-[0.95rem] font-bold text-white/70 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white";

export function CtaBand({
  eyebrow = "Next step",
  title = "Ready to talk about your roof?",
  body = "Send the short version of your details and we will come back with a design and a fixed price. No site visit needed to start, and no obligation afterwards.",
  formLabel = "Get a free quote",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  /** Label for the quiet route into the quote form. */
  formLabel?: string;
}) {
  return (
    <section className="on-dark surface-dark relative overflow-hidden px-5 py-20 sm:px-8 lg:py-24">
      <div
        aria-hidden
        data-decor
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -bottom-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2">
          <div className="glow-flame anim-breathe h-full w-full" />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <Reveal className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          <div className="max-w-2xl">
            <p className="eyebrow text-flame-300">
              <span aria-hidden className="h-px w-6 bg-flame-500" />
              {eyebrow}
            </p>
            <h2 className="mt-4 text-[1.9rem] leading-[1.1] font-extrabold tracking-[-0.025em] text-white sm:text-[2.4rem]">
              {title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">{body}</p>
          </div>

          {/*
            One column of actions on every screen size. Three actions in a
            wrapped row crowded the band and split awkwardly at 320px, and a
            fixed width column beside the copy stays tidy from 320px up to
            desktop without reordering anything.
          */}
          <div className="flex w-full flex-col items-stretch gap-3 sm:max-w-sm lg:w-72 lg:max-w-none lg:shrink-0">
            <a
              href={WHATSAPP_QUOTE_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={WHATSAPP_QUOTE_ARIA}
              className="btn btn-flame w-full px-6 py-4 text-base"
            >
              <IconWhatsApp className="h-4.5 w-4.5" />
              Chat on WhatsApp
            </a>
            <a
              href={EMAIL_QUOTE_HREF}
              aria-label={EMAIL_QUOTE_ARIA}
              className="btn btn-ghost-dark w-full px-6 py-4 text-base"
            >
              <IconMail className="h-4.5 w-4.5" />
              Email us
            </a>
            <Link to="/contact" className={FORM_LINK_CLASS}>
              {formLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
