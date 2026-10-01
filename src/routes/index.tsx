import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "~/components/CtaBand";
import { Hero } from "~/components/Hero";
import { PortfolioTeaser } from "~/components/PortfolioGrid";
import { Process } from "~/components/Process";
import { Reveal } from "~/components/Reveal";
import { ServicesSummary } from "~/components/Services";
import { WhyFirefly } from "~/components/WhyFirefly";
import { photo } from "~/lib/content";
import { absolute, socialMeta } from "~/lib/site";

/** Three mixed-orientation photographs for the home page teaser tiles. */
const TEASER_PHOTOS = [photo("02"), photo("01"), photo("11")];

const TITLE = "Firefly Solar: home solar, battery storage & aftercare";
const DESCRIPTION =
  "Firefly Solar designs, installs and looks after home solar and battery systems in Boksburg, Gauteng, with battery storage and the security and automation that belongs in the same home. Start with a free quote.";
const URL = absolute("/");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      {
        name: "description",
        content: DESCRIPTION,
      },
      {
        property: "og:title",
        content: "Firefly Solar: own the sunlight that hits your roof",
      },
      {
        property: "og:description",
        content:
          "Residential solar design, installation, battery storage and aftercare in Boksburg, Gauteng. Ask for a free quote by email or WhatsApp.",
      },
      ...socialMeta({ url: URL, title: TITLE, description: DESCRIPTION }),
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Home,
});

/**
 * Landing page. The reveal and decorative-layer hooks live in the shared shell,
 * so this file is only the order of the sections.
 */
function Home() {
  return (
    <>
      <Hero />
      <ServicesSummary />
      <WhyFirefly variant="compact" />
      <Process variant="compact" />

      <section
        id="portfolio"
        className="relative bg-white px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-flame-700">
              <span aria-hidden className="h-px w-6 bg-flame-600" />
              Our work
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.4rem]">
              Roofs we have worked on.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              Three of them here. The full gallery of fifteen photographs is on
              the portfolio page.
            </p>
          </Reveal>

          <div className="mt-12">
            <PortfolioTeaser items={TEASER_PHOTOS} />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Get a quote"
        title="Tell us about your roof."
        body="Name, email, postal code and property type: that is all it takes to start. Send the short version now and we can talk through the details afterwards."
      />
    </>
  );
}
