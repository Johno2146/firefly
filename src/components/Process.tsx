import { Link } from "@tanstack/react-router";

import { IconArrowRight } from "~/components/Icons";
import { Reveal } from "~/components/Reveal";
import { STEPS } from "~/lib/content";

/**
 * The four-step process.
 *
 * `full` is the section from the one-pager, with the connector line drawn on
 * scroll, and lives on the Services page at `/services#process`. `compact` is
 * the strip on the Home page: same four steps, one line each, with a link
 * through to the full version.
 *
 * The steps describe a solar and battery installation, which is the lead
 * service and where most jobs start. Both variants say so in the eyebrow and
 * the full one says it again in the intro, so the section is never mistaken for
 * a description of the alarm, camera, fencing or automation work.
 */
export function Process({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <section
        id="process"
        className="relative bg-flame-50 px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-flame-700">
              <span aria-hidden className="h-px w-6 bg-flame-600" />
              The solar journey
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.4rem]">
              Four steps, no surprises.
            </h2>
          </Reveal>

          <div className="relative mt-12">
            <div
              aria-hidden
              data-from="scaleX"
              className="connector reveal absolute top-[1.15rem] right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-flame-500 via-flame-400/70 to-flame-200 md:block"
            />
            <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
              {STEPS.map((step, index) => (
                <Reveal
                  as="li"
                  key={step.number}
                  delay={index * 90}
                  className="flex gap-4 border-l border-flame-200 pl-5 md:block md:border-l-0 md:pl-0"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-flame-500 text-xs font-extrabold tracking-tight text-ink-950 shadow-[0_12px_28px_-14px_rgba(242,82,27,0.9)]">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-base font-bold tracking-tight md:mt-4">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-500">
                      {step.short}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal delay={100}>
            <Link
              to="/services"
              hash="process"
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-flame-700 transition-colors hover:text-flame-600"
            >
              Read the full process
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section
      id="process"
      className="relative bg-white px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-flame-700">
            <span aria-hidden className="h-px w-6 bg-flame-600" />
            The solar journey
          </p>
          <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-[2.6rem]">
            Four steps, no surprises.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            These four steps cover a solar and battery installation, from first
            call to first sunny morning. Alarms, cameras, fencing and automation
            are planned and quoted as their own job.
          </p>
        </Reveal>
        <div className="relative mt-16">
          <div
            aria-hidden
            data-from="scaleX"
            className="connector reveal absolute top-[1.45rem] right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-flame-500 via-flame-400/70 to-flame-200 md:block"
          />
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((step, index) => (
              <Reveal
                as="li"
                key={step.number}
                delay={index * 110}
                className="border-l border-line pl-6 md:border-l-0 md:pl-0"
              >
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-flame-500 text-sm font-extrabold tracking-tight text-ink-950 shadow-[0_12px_28px_-14px_rgba(242,82,27,0.9)]">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-500">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
