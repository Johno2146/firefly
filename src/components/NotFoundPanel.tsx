import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  IconArrowRight,
  IconMail,
  IconPhone,
  IconWhatsApp,
} from "~/components/Icons";
import { CONTACT } from "~/lib/content";

/**
 * The not found page.
 *
 * It is the router's `notFoundComponent` on the root route, so it renders for
 * any address that does not match a route and the server answers with a real
 * 404 status rather than a 200 with a kind message in it.
 *
 * A lost visitor gets three things without having to scroll: the address was
 * wrong, the four pages that do exist, and the owner's phone, WhatsApp and
 * email so the enquiry does not die here. The contact details come from
 * `CONTACT`, the same source the header, footer and contact page read.
 */

const TITLE = "Page not found | Firefly Solar";

const ROUTES = [
  { to: "/", label: "Home", body: "What Firefly Solar does, in one page." },
  {
    to: "/services",
    label: "Services",
    body: "Solar, batteries and aftercare, plus alarms, cameras and fencing.",
  },
  {
    to: "/portfolio",
    label: "Portfolio",
    body: "Fifteen photographs from installations around Gauteng.",
  },
  {
    to: "/contact",
    label: "Contact",
    body: "Ask for a free quote, or just send us a message.",
  },
] as const;

const CARD =
  "group flex h-full flex-col rounded-2xl border border-white/12 bg-white/5 p-5 transition-colors duration-300 hover:border-flame-500/60 hover:bg-white/8";

export function NotFoundPanel() {
  /**
   * A wrong address should say so in the browser tab as well. The title is
   * written onto the title element that is already there rather than rendered
   * as a second one, because two `<title>` elements in one head is invalid
   * markup and the first one is the one browsers use.
   */
  useEffect(() => {
    const previous = document.title;
    document.title = TITLE;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      <section className="on-dark surface-dark relative overflow-hidden px-5 pt-32 pb-20 sm:px-8 sm:pt-36 lg:pt-40 lg:pb-28">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <p className="eyebrow text-flame-300">
              <span aria-hidden className="h-px w-6 bg-flame-500" />
              404
            </p>
            <h1 className="mt-5 text-[2.3rem] leading-[1.06] font-extrabold tracking-[-0.03em] text-white sm:text-[3rem]">
              That page is not here.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Sorry about that. The address you followed does not match anything
              on this site, which usually means an old link or a small typo.
              Every page that does exist is below, and the phone number still
              works.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map((route) => (
              <li key={route.to} className="h-full">
                <Link to={route.to} className={CARD}>
                  <span className="text-base font-bold text-white">
                    {route.label}
                  </span>
                  <span className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-white/65">
                    {route.body}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-flame-300">
                    Go to {route.label}
                    <IconArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 border-t border-white/10 pt-10">
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Rather speak to someone?
            </h2>
            <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-white/65">
              Call, send a WhatsApp message or email us. Whichever you pick, it
              reaches the same person who does the work.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={CONTACT.phoneHref}
                aria-label={`Call Firefly Solar on ${CONTACT.phone}`}
                className="btn btn-flame px-6 py-3.5"
              >
                <IconPhone className="h-4.5 w-4.5" />
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Send Firefly Solar a WhatsApp message on ${CONTACT.phone}`}
                className="btn btn-ghost-dark px-6 py-3.5"
              >
                <IconWhatsApp className="h-4.5 w-4.5" />
                WhatsApp
              </a>
              <a
                href={CONTACT.emailHref}
                aria-label={`Email Firefly Solar at ${CONTACT.email}`}
                className="btn btn-ghost-dark px-6 py-3.5"
              >
                <IconMail className="h-4.5 w-4.5" />
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
