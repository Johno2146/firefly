import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "~/components/CtaBand";
import { PageHeader } from "~/components/PageHeader";
import { Gallery } from "~/components/PortfolioGrid";
import { Reveal } from "~/components/Reveal";
import { GALLERY } from "~/lib/content";
import { absolute, socialMeta } from "~/lib/site";

const TITLE = "Portfolio: installation photographs | Firefly Solar";
const DESCRIPTION =
  "Fifteen installation photographs supplied by Firefly Solar: rooftop solar arrays, battery and inverter installations and the details in between, from work around Boksburg and Gauteng.";
const URL = absolute("/portfolio");

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: TITLE },
      {
        name: "description",
        content: DESCRIPTION,
      },
      {
        property: "og:title",
        content: "Portfolio: Firefly Solar installation photographs",
      },
      {
        property: "og:description",
        content:
          "Rooftop solar arrays, battery and inverter installations. Photographs supplied by Firefly Solar.",
      },
      ...socialMeta({ url: URL, title: TITLE, description: DESCRIPTION }),
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: PortfolioPage,
});

/**
 * Gallery page. Every photograph comes from `GALLERY` in ~/lib/content, so
 * swapping one is a data change. Each tile reserves its frame from the
 * declared width and height, and clicking one opens it full size in the
 * lightbox (see ~/components/Lightbox).
 */
function PortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title={
          <>
            Roofs we have <span className="gradient-text-light">worked on</span>.
          </>
        }
        intro="Photographs from Firefly Solar installations: panels, batteries and the tidy details afterwards."
      />

      <section
        id="gallery"
        className="on-dark surface-dark relative px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-flame-300">
              <span aria-hidden className="h-px w-6 bg-flame-500" />
              All fifteen
            </p>
            <h2 className="mt-4 text-[1.7rem] leading-tight font-extrabold tracking-[-0.02em] text-white sm:text-[2.1rem]">
              Installation gallery
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-white/70">
              Rooftop arrays, battery and inverter installations, and the rooms and
              walls they end up on. Open any photograph to see it full size.
              The arrow keys move along the set and Escape closes it.
            </p>
          </Reveal>

          <div className="mt-12">
            <Gallery items={GALLERY} />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Next step"
        title="Want a system like these?"
        body="Tell us about your roof and what you would like to change, and we will come back with a design and a fixed price."
      />
    </>
  );
}
