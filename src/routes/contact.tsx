import { createFileRoute } from "@tanstack/react-router";

import { ContactDetails } from "~/components/ContactDetails";
import { IconMail, IconWhatsApp } from "~/components/Icons";
import { PageHeader } from "~/components/PageHeader";
import { Photo } from "~/components/Photo";
import { QuoteForm } from "~/components/QuoteForm";
import { Reveal } from "~/components/Reveal";
import {
  EMAIL_QUOTE_ARIA,
  EMAIL_QUOTE_HREF,
  WHATSAPP_QUOTE_ARIA,
  WHATSAPP_QUOTE_HREF,
} from "~/lib/actions";
import { photo } from "~/lib/content";
import { absolute, socialMeta } from "~/lib/site";

/** One real photograph on the way down the page, no stock imagery. */
const CONTACT_PHOTO = photo("10");

const TITLE = "Contact & free quote | Firefly Solar";
const DESCRIPTION =
  "Request a free solar quote from Firefly Solar in Boksburg, Gauteng: name, email, postal code and property type is all it takes to start. Call or WhatsApp +27 71 300 7422, or email gavin@fireflysolar.co.za.";
/** The route path: the canonical and `og:url` are built from it per request. */
const PATH = "/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      {
        name: "description",
        content: DESCRIPTION,
      },
      {
        property: "og:title",
        content: "Contact & free quote: Firefly Solar",
      },
      {
        property: "og:description",
        content:
          "Tell us about your roof and we come back with a design and a fixed price. Send your details by email or WhatsApp, or call +27 71 300 7422.",
      },
      ...socialMeta({ url: absolute(PATH), title: TITLE, description: DESCRIPTION }),
    ],
    links: [{ rel: "canonical", href: absolute(PATH) }],
  }),
  component: ContactPage,
});

/**
 * The quote form sends the enquiry straight to the owner's inbox from the
 * server, with the customer's own email app and WhatsApp as the way round a
 * failure. This page adds the owner's contact details around it.
 */
function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get a quote"
        title={
          <>
            Start with a <span className="gradient-text-light">free quote</span>
          </>
        }
        intro="Name, phone, email, postal code and property type: that is all it takes to start. Fill in the form and press send, and your enquiry comes straight to our inbox. Prefer to start with a message? Tap WhatsApp or email below and press send in your own app."
      >
        <a
          href={WHATSAPP_QUOTE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={WHATSAPP_QUOTE_ARIA}
          className="btn btn-flame px-6 py-3.5 text-base"
        >
          <IconWhatsApp className="h-4.5 w-4.5" />
          Chat on WhatsApp
        </a>
        <a
          href={EMAIL_QUOTE_HREF}
          aria-label={EMAIL_QUOTE_ARIA}
          className="btn btn-ghost-dark px-6 py-3.5 text-base"
        >
          <IconMail className="h-4.5 w-4.5" />
          Email us
        </a>
      </PageHeader>
      <QuoteForm />

      <section className="on-dark surface-dark px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <figure className="relative overflow-hidden rounded-[2rem] border border-white/10">
              <Photo
                item={CONTACT_PHOTO}
                sizes="(min-width: 1024px) 1100px, 92vw"
                className="aspect-16/9 w-full object-cover sm:aspect-21/9"
              />
            </figure>
          </Reveal>
        </div>
      </section>

      <ContactDetails />
    </>
  );
}
