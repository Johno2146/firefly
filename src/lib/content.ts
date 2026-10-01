/**
 * Single source of truth for the site's copy and imagery.
 *
 * Every page (Home, Services, Portfolio, Contact) reads from here, so the same
 * service / step text can appear in a short form on one page and a long form on
 * another without being duplicated in two components.
 *
 * Contact details below are the owner's own, supplied 23 September. Nothing on
 * this site carries a certification, a price, a savings claim or a customer
 * quote: the only figures presented as the owner's are the ones in STATS.
 */

import type { ComponentType, SVGProps } from "react";

import {
  IconAlarm,
  IconBattery,
  IconCamera,
  IconFence,
  IconGate,
  IconMonitor,
  IconRoof,
} from "~/components/Icons";

/* ------------------------------------------------------------------ *
 *  Services
 * ------------------------------------------------------------------ */

export type Service = {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  /** One line, used on the home page cards. */
  summary: string;
  points: string[];
  /** Lead service: gets the main service treatment on the services page. */
  featured?: boolean;
  /** Real installation photo shown beside this service (see PHOTOS below). */
  photoId?: string;
};

/**
 * Every service, in the order they appear on /services: solar first as the
 * featured one, then maintenance and battery, then the security and automation
 * services. The four newest have no photograph of their own, so they render
 * icon only rather than borrowing a solar installation shot.
 */
export const SERVICES: Service[] = [
  {
    id: "solar",
    icon: IconRoof,
    featured: true,
    photoId: "11",
    title: "Residential solar installation",
    body: "A roof by roof survey, shading study and panel layout designed around your home rather than a template. We handle scaffolding, wiring and the paperwork that comes with it.",
    summary:
      "Roof by roof survey, shading study and a panel layout designed around your home.",
    points: ["Roof & shading survey", "Panel layout design", "Scaffolding and wiring"],
  },
  {
    id: "maintenance",
    icon: IconMonitor,
    photoId: "04",
    title: "Maintenance & monitoring",
    body: "Live generation data from day one, an annual health check, and a phone number that reaches a person when a reading looks wrong.",
    summary:
      "Live generation data from day one, annual health checks and a person on the phone.",
    points: ["Live generation data", "Annual health checks", "Human on the phone"],
  },
  {
    id: "battery",
    icon: IconBattery,
    photoId: "01",
    title: "Battery storage",
    body: "Keep the afternoon's sunshine for the evening. Battery systems sized to how your household actually uses power, with a small backup supply for the lights when the grid dips.",
    summary:
      "Store the afternoon's sunshine for the evening, sized to how you actually use power.",
    points: ["Sized to your evening usage", "Backup for essentials", "Retrofit friendly"],
  },
  {
    id: "alarms",
    icon: IconAlarm,
    title: "Intruder alarms",
    body: "An alarm planned around the doors, windows and outbuildings that actually get left open. We agree where the sensors go before anything is fitted, then walk you through setting and unsetting the system before we leave.",
    summary:
      "Sensors planned room by room, fitted tidily and explained before we leave.",
    points: [
      "Sensors planned room by room",
      "Keypad and app control",
      "Set and unset explained",
    ],
  },
  {
    id: "cctv",
    icon: IconCamera,
    title: "CCTV",
    body: "Cameras placed to cover the entrances and the drive, pointed at your own property rather than anyone else's. We agree the positions with you first, keep the cabling out of sight where the building allows it, and set the recording up so you can view it yourself.",
    summary:
      "Camera positions agreed with you first, then fitted with the cabling kept tidy.",
    points: [
      "Positions agreed in advance",
      "Cabling kept tidy",
      "Recording you can view yourself",
    ],
  },
  {
    id: "fencing",
    icon: IconFence,
    title: "Electric fencing",
    body: "Perimeter fencing for gardens, yards and small holdings. We plan a run that follows your boundary and leaves a proper gap at the gate, then fit and test the energiser with you on site.",
    summary:
      "A perimeter run planned around your boundary, fitted and tested with you there.",
    points: [
      "Boundary run planned with you",
      "Gate gap left where you need it",
      "Tested with you on site",
    ],
  },
  {
    id: "automation",
    icon: IconGate,
    title: "Gate and garage door automation",
    body: "Automatic gates and garage doors for homes that would rather not get out of the car in the rain. We look at the gate or door you already have, tell you honestly whether it suits automation, and fit the motor, the safety sensors and the controls as one job.",
    summary:
      "Automatic gates and garage doors, fitted as one job with the safety sensors that go with them.",
    points: [
      "Existing gate or door assessed first",
      "Motor and sensors fitted together",
      "Controls shown and explained",
    ],
  },
];

/** Looks one service up by id. */
const SERVICE_BY_ID: Record<string, Service> = Object.fromEntries(
  SERVICES.map((service) => [service.id, service]),
);

/**
 * The solar services kept on the home page summary, in display order: the
 * panels, the battery and the aftercare. The security and automation services
 * are named in one quiet line underneath rather than given their own cards.
 */
export const HOME_SERVICES: Service[] = ["solar", "battery", "maintenance"].map(
  (id) => {
    const found = SERVICE_BY_ID[id];
    if (!found) throw new Error(`No service with id "${id}"`);
    return found;
  },
);

/* ------------------------------------------------------------------ *
 *  Process
 * ------------------------------------------------------------------ */
export const STEPS = [
  {
    number: "01",
    title: "Consultation",
    body: "A short call about your roof, your bills and what you want to change. No site visit needed to get started, and no obligation afterwards.",
    short: "A short call about your roof, your bills and what you want to change.",
  },
  {
    number: "02",
    title: "Design & quote",
    body: "We model pitch, shading and usage, then send a fixed price design you can read in one sitting, with the assumptions written down.",
    short: "We model pitch, shading and usage, then send a fixed price design.",
  },
  {
    number: "03",
    title: "Installation",
    body: "One crew, usually one day for a standard roof. We protect the roof, tidy the cabling and walk you through the app before we leave.",
    short: "One crew, usually one day, with the cabling tidied before we leave.",
  },
  {
    number: "04",
    title: "Monitor & maintain",
    body: "Your generation is visible from day one. We come back after the first year and stay reachable for the life of the system.",
    short: "Generation visible from day one, and a visit after the first year.",
  },
];

/* ------------------------------------------------------------------ *
 *  Why Firefly. Both figures are the owner's own numbers, supplied
 *  23 September. There is no third tile: a yearly generation figure was
 *  never supplied, so nothing invented stands beside these two.
 * ------------------------------------------------------------------ */
export const STATS = [
  { target: 200, suffix: "+", label: "Installs completed" },
  { target: 5, suffix: "/5", label: "Average customer rating" },
];

export const TRUST = [
  "A fixed price quote, agreed before any work starts",
  "Shading and roof survey on every single design",
  "Monitoring set up and explained before we leave site",
];

/* ------------------------------------------------------------------ *
 *  Reviews
 *
 *  NOT RENDERED ANYWHERE. These quotes and names were written for the
 *  first draft of the site and are not real customers, so no page shows
 *  them. The data and the Testimonials components are held here ready
 *  for the owner to supply real reviews with permission to publish.
 * ------------------------------------------------------------------ */
export const REVIEWS = [
  {
    quote:
      "The survey picked up shading from next door's tree that two other quotes had missed. Four months in, the app shows we're covering most of our daytime use.",
    name: "Priya",
    location: "Bristol",
  },
  {
    quote:
      "One day on site, no mess left behind, and they walked my dad through the monitoring app twice without once sounding impatient.",
    name: "Daniel",
    location: "Leeds",
  },
  {
    quote:
      "Clear fixed quote and no upselling. The battery was sized to how we actually use power in the evening, not to the biggest unit they could sell.",
    name: "Marcus",
    location: "Cardiff",
  },
];

/* ------------------------------------------------------------------ *
 *  Portfolio gallery
 *
 *  The owner's own installation photographs, all fifteen of them. Every
 *  entry below points at webp derivatives in /public/install, generated from
 *  the supplied JPEGs at 480 / 960 / 1440 px wide (never upscaled past the
 *  source, so a few photos only have the smaller tiers). `src` is the widest
 *  file that exists for that photo; `srcSet` lists every tier so the browser
 *  picks the smallest one that is still sharp. `width`/`height` are the real
 *  pixel size of that widest file, so the frame is reserved before the image
 *  loads and nothing on the page shifts.
 *
 *  Alt text and captions describe only what is visible in each frame: no
 *  figures, no savings, no customer names or addresses.
 * ------------------------------------------------------------------ */
export type GalleryItem = {
  id: string;
  /** Widest available file, also the fallback for browsers without srcset. */
  src: string;
  /** Every available tier, narrowest first. */
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** Optional CSS `object-position`, for frames that get cropped hard. */
  focus?: string;
};

/** Builds `src`/`srcSet` for one photo's generated tiers. */
function variants(id: string, widths: readonly number[]) {
  const widest = widths[widths.length - 1];
  return {
    src: `/install/${id}-${widest}.webp`,
    srcSet: widths.map((w) => `/install/${id}-${w}.webp ${w}w`).join(", "),
  };
}

const W2 = [480, 960] as const;
const W3 = [480, 960, 1440] as const;

export const GALLERY: GalleryItem[] = [
  {
    id: "01",
    ...variants("01", W2),
    width: 960,
    height: 1280,
    alt: "Three white battery units with small blue displays standing on a tiled floor below an inverter mounted on the wall, with a meter enclosure beside it.",
    caption: "Inverter and battery bank, indoors",
  },
  {
    id: "02",
    ...variants("02", W2),
    // 02 is the one landscape photograph in the set that is not 1440 wide: its
    // source is 1280x960 and its widest tier is 960x720, which is what the
    // frame below reserves. (It was declared as a portrait by mistake.)
    width: 960,
    height: 720,
    alt: "Solar panels across the tiled roof of a single storey house, seen past a swimming pool and paved patio.",
    caption: "Panels over a tiled roof, pool below",
  },
  {
    id: "03",
    ...variants("03", W3),
    width: 1440,
    height: 1080,
    alt: "An inverter mounted on the wall and two battery units on a cream wall, with monitoring displays and consumer units on a rail beside them.",
    caption: "Inverter, batteries and monitoring kit",
  },
  {
    id: "04",
    ...variants("04", W2),
    width: 960,
    height: 1280,
    alt: "An inverter mounted on the wall with a green display between two meter enclosures, and a second white unit mounted below on a beige wall.",
    caption: "Inverter, meters and battery unit",
  },
  {
    id: "05",
    ...variants("05", W3),
    width: 1440,
    height: 1080,
    alt: "A row of solar panels on a tiled roof with a corrugated metal roof below and a leafy hillside suburb behind.",
    caption: "Array on a tiled roof, hills behind",
    focus: "50% 45%",
  },
  {
    id: "06",
    ...variants("06", W2),
    width: 960,
    height: 1280,
    alt: "An inverter mounted on the wall above two stacked white battery modules with black diagonal stripes, on a tiled floor beside a coiled hose.",
    caption: "Stacked battery modules under an inverter",
  },
  {
    id: "07",
    ...variants("07", W2),
    width: 960,
    height: 1280,
    alt: "Four lithium battery modules stacked in an open metal rack, each with red terminals and black cable links.",
    caption: "Lithium modules in an open rack",
  },
  {
    id: "08",
    ...variants("08", W3),
    width: 1440,
    height: 1080,
    alt: "A rack of solar panels tilted on a flat roof, looking out over trees towards a building of two storeys.",
    caption: "Tilted array on a flat roof",
  },
  {
    id: "09",
    ...variants("09", W3),
    width: 1440,
    height: 1080,
    alt: "An inverter above two white battery boxes with red terminal covers, mounted on a beige wall beside meter enclosures.",
    caption: "Inverter and battery boxes on a wall",
  },
  {
    id: "10",
    ...variants("10", W3),
    width: 1440,
    height: 1080,
    alt: "A white van and a small trailer parked on a brick driveway in front of a house with solar panels on its roof.",
    caption: "Van and trailer on a driveway",
  },
  {
    id: "11",
    ...variants("11", W3),
    width: 1440,
    height: 1080,
    alt: "Solar panels fitted along a grey tiled roof, with an aluminium ladder resting against the wall beneath the roof edge and neighbouring rooftops beyond.",
    caption: "Rooftop array with the ladder still up",
  },
  {
    id: "12",
    ...variants("12", W3),
    width: 1440,
    height: 1080,
    alt: "Four white battery units fixed in a row on a wall bracket above two inverters with green displays and two meter enclosures.",
    caption: "Four batteries above a pair of inverters",
  },
  {
    id: "13",
    ...variants("13", W3),
    width: 1440,
    height: 1080,
    alt: "Rows of solar panels covering a red tiled roof, with two domed roof windows on the flat roof in front and a blue sky with light cloud.",
    caption: "Panels across a full tiled roof",
    focus: "50% 35%",
  },
  {
    id: "14",
    ...variants("14", W2),
    width: 960,
    height: 1280,
    alt: "Three battery units standing on the floor with green indicator strips, below an inverter mounted on the wall, beside a storage shelf in a garage.",
    caption: "Three battery cabinets in a wall run",
  },
  {
    id: "15",
    ...variants("15", W2),
    width: 960,
    height: 432,
    alt: "A wide garage wall with an inverter cabinet and meters on the left, three small battery units on a high wall bracket, and a yellow handled tool with a folded blue cover resting to the right.",
    caption: "Garage wall: inverter cabinet and batteries",
  },
];

/** Look one photo up by id, used by the hero, the service cards, Contact. */
export const PHOTOS: Record<string, GalleryItem> = Object.fromEntries(
  GALLERY.map((item) => [item.id, item]),
);

export function photo(id: string): GalleryItem {
  const found = PHOTOS[id];
  if (!found) throw new Error(`No installation photo with id "${id}"`);
  return found;
}

/* ------------------------------------------------------------------ *
 *  Contact details. The owner's own, supplied 23 September, used
 *  verbatim in the header, the footer, the contact page and the form.
 * ------------------------------------------------------------------ */
export const CONTACT = {
  /** Display form. */
  phone: "+27 71 300 7422",
  phoneHref: "tel:+27713007422",
  whatsapp: "https://wa.me/27713007422",
  email: "gavin@fireflysolar.co.za",
  emailHref: "mailto:gavin@fireflysolar.co.za",
  /** Display only: deliberately not a link. */
  address: "Boksburg, Gauteng",
};

/**
 * A WhatsApp chat link with the message already typed, so the customer only
 * has to press send. Spaces and line breaks are percent encoded for the URL.
 */
export function whatsappLink(message: string) {
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
