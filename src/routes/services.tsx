import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "~/components/CtaBand";
import { PageHeader } from "~/components/PageHeader";
import { Process } from "~/components/Process";
import { ServicesDetail } from "~/components/Services";
import { WhyFirefly } from "~/components/WhyFirefly";
import { absolute, socialMeta } from "~/lib/site";

const TITLE = "Services: solar, batteries, alarms & CCTV | Firefly Solar";
const DESCRIPTION =
  "Residential solar and battery storage first, then intruder alarms, CCTV, electric fencing and gate and garage door automation. What each service covers, the solar process, and how to ask about your home.";
/** The route path: the canonical and `og:url` are built from it per request. */
const PATH = "/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      {
        name: "description",
        content: DESCRIPTION,
      },
      {
        property: "og:title",
        content: "Services: Firefly Solar",
      },
      {
        property: "og:description",
        content:
          "Solar and batteries at the core, plus alarms, CCTV, electric fencing and gate and garage door automation.",
      },
      ...socialMeta({ url: absolute(PATH), title: TITLE, description: DESCRIPTION }),
    ],
    links: [{ rel: "canonical", href: absolute(PATH) }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title={
          <>
            Everything between your{" "}
            <span className="gradient-text-light">roof</span> and your socket.
          </>
        }
        intro="Solar and batteries at the core, then the security and automation that belongs in the same home. Ask about one service or the whole set."
      />
      <ServicesDetail />
      <Process />
      <WhyFirefly />
      <CtaBand
        eyebrow="Get a quote"
        title="Tell us about your roof."
        body="A design and a fixed price, with the assumptions written down. Nothing is booked until you say yes to the numbers."
      />
    </>
  );
}
