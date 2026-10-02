/**
 * What the site tells Google about the business, in structured data.
 *
 * One JSON-LD block, on the home page only, built from facts the owner has
 * given us and from copy that is already on the site:
 *
 *   - the trading name and the legal name as the footer states them,
 *   - the website's own address (whatever host is serving the page),
 *   - the telephone number, the email address and the logo,
 *   - a description taken from the home page's own description,
 *   - Boksburg, Gauteng as the base the business works from,
 *   - the area served, which the owner has told us is anywhere in South Africa,
 *     expressed as the town, then the province, then the country.
 *
 * What is deliberately absent, because we cannot substantiate it: a street
 * address or any suggestion of premises (the business is a service area
 * business and the visible site names no street), opening hours, a price range,
 * a founding date, a rating, a review count, and any social profile. There is
 * no street address field here at all, and nothing in this block contradicts
 * the visible page.
 *
 * The type is the plainest accurate one: `LocalBusiness` says the business
 * serves customers in a place, which is true, without claiming a storefront or
 * a more specific trade designation we have no evidence for.
 */
import { CONTACT } from "~/lib/content";

/** The country the business serves, as the owner stated it. */
const COUNTRY = "South Africa";
/** And its ISO code, as a postal address carries it. */
const COUNTRY_CODE = "ZA";

/**
 * The single place the owner's Google Business Profile URL goes.
 *
 * They are completing that profile now. The moment they give us the link, put
 * it in the `sameAs` list below, in this one line, and nothing else changes:
 *
 *   sameAs: ["https://maps.google.com/..."],
 *
 * It stays empty until then: an empty list claims nothing, a guessed URL would
 * claim a profile that may not be theirs.
 */
const SAME_AS: string[] = [];

/** "Boksburg, Gauteng" as the site shows it, split into its two parts. */
function addressParts(): { locality: string; region: string } {
  const [locality = "Boksburg", region = "Gauteng"] = CONTACT.address
    .split(",")
    .map((part) => part.trim());
  return { locality, region };
}

/** The layout of an address, which is not a street address: no streetAddress. */
type PostalAddress = {
  "@type": "PostalAddress";
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
};

/**
 * The whole block, as an object ready for `JSON.stringify`. `url` is the
 * absolute address of the home page on the host serving it, so the business's
 * `url`, `@id` and `logo` all point at the same host as the page itself.
 */
export function businessStructuredData({ url }: { url: string }) {
  const { locality, region } = addressParts();
  const base = url.replace(/\/$/, "");
  const address: PostalAddress = {
    "@type": "PostalAddress",
    addressLocality: locality,
    addressRegion: region,
    addressCountry: COUNTRY_CODE,
  };
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}/#business`,
    name: "Firefly Solar",
    legalName: "G.A. Installations",
    alternateName: "G.A. Installations t/a Firefly Solar",
    url: `${base}/`,
    logo: `${base}/brand/firefly-logo.png`,
    description:
      "Firefly Solar designs, installs and looks after home solar and battery systems in Boksburg, Gauteng, with battery storage and the security and automation that belongs in the same home. Start with a free quote.",
    telephone: CONTACT.phoneHref.replace(/^tel:/, ""),
    email: CONTACT.email,
    address,
    areaServed: [
      { "@type": "City", name: locality },
      { "@type": "AdministrativeArea", name: region },
      { "@type": "Country", name: COUNTRY },
    ],
    sameAs: SAME_AS,
  };
}
