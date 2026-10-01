import { Link } from "@tanstack/react-router";

import { IconArrowRight } from "~/components/Icons";
import { Photo } from "~/components/Photo";
import { Reveal } from "~/components/Reveal";
import { HOME_SERVICES, SERVICES, photo } from "~/lib/content";

/**
 * Home: a compact three-card summary of the solar services. Each card is a link
 * into /services, and one quiet line underneath names the wider range so the
 * three cards never read as the whole business.
 */
export function ServicesSummary() {
  return (
    <section
      id="services"
      className="relative bg-white px-5 py-20 sm:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-flame-700">
            <span aria-hidden className="h-px w-6 bg-flame-600" />
            What we do
          </p>
          <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.6rem]">
            Everything between your roof and your socket.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Start with what the roof can make, add storage for the evening, then
            keep the whole system in good shape for the years after.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {HOME_SERVICES.map(({ id, icon: Icon, title, summary }, index) => (
            <Reveal
              as="li"
              key={id}
              delay={index * 90}
              className="h-full"
            >
              <Link
                to="/services"
                aria-label={`${title}, read more on the services page`}
                className="group card-lift relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-[0_24px_60px_-48px_rgba(35,31,32,0.6)] hover:border-flame-200 hover:shadow-[0_34px_70px_-40px_rgba(242,82,27,0.45)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-flame-600 via-flame-400 to-transparent transition-transform duration-700 group-hover:scale-x-100"
                />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 transition-colors duration-300 group-hover:bg-flame-500 group-hover:text-ink-950">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight">{title}</h3>
                <p className="mt-3 flex-1 text-[0.97rem] leading-relaxed text-ink-500">
                  {summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 border-t border-line pt-5 text-sm font-bold text-flame-700">
                  Read more
                  <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={140}>
          <p className="mt-8 text-[0.95rem] leading-relaxed text-ink-500">
            We also fit intruder alarms, CCTV, electric fencing, and gate and
            garage door automation for the same homes.{" "}
            <Link
              to="/services"
              className="font-bold text-flame-700 underline decoration-flame-200 decoration-2 underline-offset-4 transition-colors hover:text-flame-600"
            >
              See all services
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Services page: every service in full, solar first with the main service
 * treatment. The four security and automation services have no photograph of
 * their own, so they are icon only rather than borrowing a solar shot.
 */
export function ServicesDetail() {
  return (
    <section
      id="services"
      className="relative bg-white px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-flame-700">
            <span aria-hidden className="h-px w-6 bg-flame-600" />
            What we do
          </p>
          <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.6rem]">
            The full range, start to finish.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Most homes start with the panels, add a battery when the evening
            usage justifies it, and come back to us later for an alarm, a camera
            or a gate that opens itself.
          </p>
        </Reveal>

        <div className="mt-14 space-y-6 sm:space-y-8">
          {SERVICES.map((service, index) => {
            const { id, icon: Icon, title, body, points, photoId, featured } =
              service;

            return (
              <Reveal key={id} delay={Math.min(index * 80, 160)}>
                <article
                  id={id}
                  className={`group relative overflow-hidden border transition-colors duration-300 ${
                    featured
                      ? "rounded-[2.4rem] border-flame-200 bg-gradient-to-b from-flame-50 via-white to-white p-8 shadow-[0_40px_90px_-60px_rgba(242,82,27,0.7)] sm:p-12 lg:p-14"
                      : "rounded-[2rem] border-line bg-white p-7 shadow-[0_24px_60px_-52px_rgba(35,31,32,0.55)] hover:border-flame-200 sm:p-10"
                  }`}
                >
                  {featured ? (
                    // The lead service keeps its flame hairline drawn at rest.
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-flame-600 via-flame-400 to-flame-200"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-flame-600 via-flame-400 to-transparent transition-transform duration-700 group-hover:scale-x-100"
                    />
                  )}

                  <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
                    <div>
                      {featured ? (
                        <p className="inline-flex items-center gap-2 rounded-full bg-flame-500 px-3.5 py-1.5 text-[0.68rem] font-bold tracking-[0.16em] text-ink-950 uppercase">
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 rounded-full bg-ink-950"
                          />
                          Main service
                        </p>
                      ) : null}

                      <span
                        className={`inline-flex items-center justify-center bg-flame-50 text-flame-600 transition-colors duration-300 group-hover:bg-flame-500 group-hover:text-ink-950 ${
                          featured
                            ? "mt-5 h-16 w-16 rounded-[1.4rem]"
                            : "h-14 w-14 rounded-2xl"
                        }`}
                      >
                        <Icon className={featured ? "h-8 w-8" : "h-7 w-7"} />
                      </span>

                      <h3
                        className={`mt-6 leading-tight font-extrabold tracking-[-0.02em] ${
                          featured
                            ? "text-[1.6rem] sm:text-[2.05rem]"
                            : "text-[1.45rem] sm:text-[1.7rem]"
                        }`}
                      >
                        {title}
                      </h3>
                      <p
                        className={`mt-4 max-w-2xl leading-relaxed text-ink-500 ${
                          featured ? "text-[1.06rem]" : "text-[1.02rem]"
                        }`}
                      >
                        {body}
                      </p>
                      <Link
                        to="/contact"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-flame-700 transition-colors hover:text-flame-600"
                      >
                        Ask about this
                        <IconArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {/* A real photograph of this kind of work, from the
                          owner's own installations, no stock imagery. The four
                          newer services have none, so they stay icon only. */}
                      {photoId ? (
                        <figure className="overflow-hidden rounded-3xl border border-line bg-ink-900">
                          <Photo
                            item={photo(photoId)}
                            sizes="(min-width: 1024px) 430px, 92vw"
                            className="aspect-4/3 w-full object-cover"
                          />
                        </figure>
                      ) : null}

                      <div className="rounded-3xl border border-line bg-flame-50/60 p-6 sm:p-7">
                        <p className="text-[0.7rem] font-bold tracking-[0.16em] text-flame-700 uppercase">
                          What that covers
                        </p>
                        <ul className="mt-4 space-y-3">
                          {points.map((point) => (
                            <li
                              key={point}
                              className="flex items-start gap-3 text-[0.97rem] leading-relaxed font-medium text-ink-600"
                            >
                              <span
                                aria-hidden
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flame-500"
                              />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
