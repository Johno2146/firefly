import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";

import { BrandLogo } from "~/components/Brand";
import {
  IconArrowUp,
  IconMail,
  IconPhone,
  IconPin,
  IconWhatsApp,
} from "~/components/Icons";
import { Reveal } from "~/components/Reveal";
import { CONTACT } from "~/lib/content";

/** Real routes: one line per page, plus the two in-page anchors that remain. */
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/services#process", label: "Process" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

/**
 * No social buttons. The icon set still has them in ~/components/Icons, ready
 * to drop back in as soon as the owner supplies the real profile URLs.
 */
const LINK_CLASS =
  "font-medium text-white/75 transition-colors hover:text-flame-300";

export function Footer() {
  return (
    <footer className="on-dark bg-ink-950 px-5 pt-16 pb-10 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <Link
              to="/"
              aria-label="Firefly Solar home"
              className="inline-flex flex-none transition-opacity hover:opacity-90"
              style={{ "--brand-logo-h": "3rem" } as CSSProperties}
            >
              <BrandLogo />
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/60">
              Residential solar and battery storage, plus alarms, cameras,
              fencing and gate automation: designed roof by roof, installed by
              one crew, looked after afterwards.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[0.7rem] font-bold tracking-[0.16em] text-white/50 uppercase">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.95rem] font-medium text-white/70 transition-colors hover:text-flame-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.7rem] font-bold tracking-[0.16em] text-white/50 uppercase">
              Contact
            </h2>
            <ul className="mt-5 space-y-4 text-[0.95rem] text-white/70">
              <li className="flex items-start gap-3">
                <IconPhone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-flame-400" />
                <a
                  href={CONTACT.phoneHref}
                  aria-label={`Call Firefly Solar on ${CONTACT.phone}`}
                  className={LINK_CLASS}
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconWhatsApp className="mt-0.5 h-4.5 w-4.5 shrink-0 text-flame-400" />
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Send Firefly Solar a WhatsApp message on ${CONTACT.phone}`}
                  className={LINK_CLASS}
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconMail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-flame-400" />
                <a
                  href={CONTACT.emailHref}
                  aria-label={`Email Firefly Solar at ${CONTACT.email}`}
                  className={`${LINK_CLASS} break-all`}
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-flame-400" />
                <span>{CONTACT.address}</span>
              </li>
            </ul>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-white/50">
            © {new Date().getFullYear()} G.A. Installations t/a Firefly Solar.
            All rights reserved. Created by Design Corner.
          </p>
          <a
            href="#main"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/12 px-4 py-2.5 text-xs font-bold tracking-[0.08em] text-white/70 uppercase transition-colors hover:border-flame-400/40 hover:text-flame-300"
          >
            Back to top
            <IconArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
