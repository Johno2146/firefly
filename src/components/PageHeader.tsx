import type { ReactNode } from "react";

/**
 * The dark banner at the top of Services, Portfolio and Contact.
 *
 * Every page keeps the same shared shell, so this only has to supply the
 * headline block, and the padding clears the fixed header. Decorative glows are
 * wrapped in `[data-decor]` so they pause when scrolled past.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="on-dark surface-dark relative isolate overflow-hidden px-5 pt-28 pb-16 sm:px-8 sm:pt-32 lg:pt-36 lg:pb-20">
      <div
        aria-hidden
        data-decor
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2">
          <div className="glow-flame anim-breathe h-full w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-3xl">
          <p className="eyebrow hero-rise text-flame-300">
            <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-flame-400" />
            {eyebrow}
          </p>
          <h1
            className="hero-rise mt-5 text-[2.3rem] leading-[1.06] font-extrabold tracking-[-0.03em] text-white sm:text-[3rem] lg:text-[3.4rem]"
            style={{ animationDelay: "60ms" }}
          >
            {title}
          </h1>
          <p
            className="hero-rise mt-6 text-lg leading-relaxed text-white/70"
            style={{ animationDelay: "110ms" }}
          >
            {intro}
          </p>
          {children ? (
            <div
              className="hero-rise mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "160ms" }}
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
