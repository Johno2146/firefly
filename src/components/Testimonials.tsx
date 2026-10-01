import { IconQuote, IconStar } from "~/components/Icons";
import { Reveal } from "~/components/Reveal";
import { REVIEWS } from "~/lib/content";

/**
 * HELD FOR REAL REVIEWS. Neither of these components is rendered on any page
 * right now. The quotes in REVIEWS (~/lib/content) were written for the first
 * draft and are not real customers, so no invented testimonial appears on the
 * site. Render Testimonials again, with REVIEWS replaced by real quotes the
 * owner has permission to publish, and the section comes straight back.
 */

export type Review = (typeof REVIEWS)[number];

/** One review card. Sized for a grid on the Home page or on its own. */
export function ReviewCard({
  review,
  wide = false,
}: {
  review: Review;
  wide?: boolean;
}) {
  return (
    <div
      className={`card-lift flex h-full flex-col rounded-3xl border border-flame-100 bg-white p-7 shadow-[0_24px_60px_-48px_rgba(35,31,32,0.5)] hover:border-flame-200 ${
        wide ? "sm:p-9" : ""
      }`}
    >
      <IconQuote className="h-7 w-7 text-flame-400/60" />
      <div className="mt-4 flex gap-1" aria-hidden>
        {Array.from({ length: 5 }).map((_, star) => (
          <IconStar key={star} className="h-4 w-4 text-flame-500" />
        ))}
      </div>
      <blockquote
        className={`mt-4 flex-1 leading-relaxed text-ink-600 ${
          wide ? "text-[1.15rem]" : "text-[1.02rem]"
        }`}
      >
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span
          aria-hidden
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-sm font-extrabold text-ink-950"
        >
          {review.name.charAt(0)}
        </span>
        <span className="text-sm">
          <span className="block font-bold text-ink-950">{review.name}</span>
          <span className="block text-ink-400">{review.location}</span>
        </span>
      </footer>
    </div>
  );
}

/** A grid of review cards with a heading, ready for real reviews to arrive. */
export function Testimonials({
  items = REVIEWS,
  title = "What customers said.",
  intro = "In their own words, from homes we have worked on.",
  className = "bg-flame-50",
}: {
  items?: readonly Review[];
  title?: string;
  intro?: string;
  className?: string;
}) {
  return (
    <section
      id="reviews"
      className={`relative px-5 py-20 sm:px-8 lg:py-24 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-flame-700">
            <span aria-hidden className="h-px w-6 bg-flame-600" />
            Reviews
          </p>
          <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.4rem]">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">{intro}</p>
        </Reveal>

        <div
          className={`mt-14 grid gap-6 ${
            items.length > 1 ? "md:grid-cols-3" : "max-w-3xl"
          }`}
        >
          {items.map((review, index) => (
            <Reveal key={review.name} delay={index * 90} className="h-full">
              <ReviewCard review={review} wide={items.length === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
