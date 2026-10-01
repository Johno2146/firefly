import type { ReactNode } from "react";

import {
  IconArrowRight,
  IconMail,
  IconPhone,
  IconPin,
  IconWhatsApp,
} from "~/components/Icons";
import { Reveal } from "~/components/Reveal";
import { CONTACT } from "~/lib/content";

/**
 * The owner's contact details.
 *
 * Phone, WhatsApp and email are real anchors, so a tap on a phone dials,
 * opens a WhatsApp chat or starts an email, and a keyboard user can tab
 * through them with a label that says what the link does. The address is
 * deliberately not a link: there is nothing to open, so it is plain text on a
 * static card with no hover state, no lift and no focus target.
 */

const CARD =
  "flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-[0_24px_60px_-52px_rgba(35,31,32,0.5)]";

/** The inside of every card: icon badge, heading, the detail, an optional cue. */
function CardFace({
  icon,
  title,
  value,
  cue,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  cue?: string;
}) {
  return (
    <>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
        {icon}
      </span>
      <h3 className="mt-5 text-base font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-[0.97rem] break-words text-ink-600">{value}</p>
      {cue ? (
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-flame-700">
          {cue}
          <IconArrowRight className="h-4 w-4" />
        </span>
      ) : null}
    </>
  );
}

export function ContactDetails() {
  return (
    <section className="relative bg-white px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-flame-700">
            <span aria-hidden className="h-px w-6 bg-flame-600" />
            Get in touch
          </p>
          <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.4rem]">
            How to reach us.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Prefer to talk it through rather than fill in a form? Call, send a
            WhatsApp message or email us, whichever suits you.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal as="li" className="h-full">
            <a
              href={CONTACT.phoneHref}
              aria-label={`Call Firefly Solar on ${CONTACT.phone}`}
              className={`${CARD} card-lift hover:border-flame-200`}
            >
              <CardFace
                icon={<IconPhone className="h-6 w-6" />}
                title="Phone"
                value={CONTACT.phone}
                cue="Call us"
              />
            </a>
          </Reveal>

          <Reveal as="li" delay={80} className="h-full">
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Send Firefly Solar a WhatsApp message on ${CONTACT.phone}`}
              className={`${CARD} card-lift hover:border-flame-200`}
            >
              <CardFace
                icon={<IconWhatsApp className="h-6 w-6" />}
                title="WhatsApp"
                value={CONTACT.phone}
                cue="Start a chat"
              />
            </a>
          </Reveal>

          <Reveal as="li" delay={160} className="h-full">
            <a
              href={CONTACT.emailHref}
              aria-label={`Email Firefly Solar at ${CONTACT.email}`}
              className={`${CARD} card-lift hover:border-flame-200`}
            >
              <CardFace
                icon={<IconMail className="h-6 w-6" />}
                title="Email"
                value={CONTACT.email}
                cue="Send an email"
              />
            </a>
          </Reveal>

          <Reveal as="li" delay={240} className="h-full">
            <div className={CARD}>
              <CardFace
                icon={<IconPin className="h-6 w-6" />}
                title="Where we are"
                value={CONTACT.address}
              />
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
