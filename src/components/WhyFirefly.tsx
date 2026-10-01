import { useEffect, useRef } from "react";

import { IconCheck } from "~/components/Icons";
import { Photo } from "~/components/Photo";
import { Reveal } from "~/components/Reveal";
import { STATS, TRUST, photo } from "~/lib/content";

/** A real rooftop array for the wide band at the foot of this section. */
const WHY_PHOTO = photo("05");

type StatProps = {
  target?: number;
  suffix?: string;
  decimals?: number;
  value?: string;
  label: string;
};

/** Same formatting on the server, in the count-up and at rest. */
function format(target: number, decimals: number) {
  return target.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Counters are written straight into the DOM by one rAF loop, so animating
 * four numbers never re-renders React. The rendered markup already contains
 * the final figure, which means the numbers are correct with JS blocked or
 * reduced motion on, and there is no layout shift when the count starts.
 */
function useCounters() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    if (!nodes.length) return;

    const run = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals ?? 0);
      const duration = 900;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(target * eased, decimals);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = format(target, decimals);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          run(entry.target as HTMLElement);
        }
      },
      { threshold: 0.4 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return rootRef;
}

function Stat({ target, suffix, decimals = 0, value, label }: StatProps) {
  const counted = target === undefined ? null : format(target, decimals);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-5 transition-colors duration-300 hover:border-flame-400/40 hover:bg-white/10 sm:p-6">
      <p className="flex items-baseline gap-1 text-3xl font-extrabold tracking-tight tabular-nums sm:text-[2.1rem]">
        {value ? (
          <span className="gradient-text-light">{value}</span>
        ) : (
          <span
            className="gradient-text-light"
            data-count={target}
            data-decimals={decimals}
          >
            {counted}
          </span>
        )}
        {suffix ? (
          <span className="text-lg text-flame-300 sm:text-xl">{suffix}</span>
        ) : null}
      </p>
      <p className="mt-2 text-sm leading-snug font-medium text-white/60">
        {label}
      </p>
    </div>
  );
}

/**
 * The figures block: the owner's install count and customer rating, nothing
 * else. `full` is the version with the heading and the wide photograph and is
 * used on the Services page. `compact` is the same two tiles on their own, as
 * used on the Home page.
 */
export function WhyFirefly({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const statsRef = useCounters();
  const compact = variant === "compact";

  const statBlock = (
    <>
      {/* Two tiles, both the owner's own figures. One across on the narrowest
          screens, two abreast from `sm` up, so there is never an empty cell. */}
      <div ref={statsRef} className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {STATS.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>
    </>
  );

  if (compact) {
    return (
      <section
        id="why"
        className="on-dark surface-dark relative overflow-hidden px-5 py-20 sm:px-8 lg:py-24"
      >
        <div
          aria-hidden
          data-decor
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-32 -left-32 h-[26rem] w-[26rem]">
            <div className="glow-flame anim-breathe h-full w-full" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-flame-300">
              <span aria-hidden className="h-px w-6 bg-flame-500" />
              Why Firefly
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] text-white sm:text-[2.4rem]">
              A small crew, careful work, no pressure.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              We are installers first. That means honest numbers, a design that
              fits the roof you actually have, and a phone that still gets
              answered years after the scaffolding comes down.
            </p>
          </Reveal>
          <Reveal from="right" delay={80} className="mt-10">
            {statBlock}
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section
      id="why"
      className="on-dark surface-dark relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28"
    >
      <div
        aria-hidden
        data-decor
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-32 -left-32 h-[26rem] w-[26rem]">
          <div className="glow-flame anim-breathe h-full w-full" />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow text-flame-300">
              <span aria-hidden className="h-px w-6 bg-flame-500" />
              Why Firefly
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] text-white sm:text-[2.6rem]">
              A small crew, careful work, no pressure.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              We are installers first. That means honest numbers, a design that
              fits the roof you actually have, and a phone that still gets
              answered years after the scaffolding comes down.
            </p>

            <ul className="mt-8 space-y-4">
              {TRUST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-flame-500/15 text-flame-300">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <span className="text-[0.97rem] leading-relaxed text-white/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal from="right" delay={80}>
            {statBlock}
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-16 lg:mt-20">
          <div className="on-dark relative overflow-hidden rounded-[2rem] border border-white/10">
            <Photo
              item={WHY_PHOTO}
              sizes="(min-width: 1024px) 1100px, 92vw"
              className="aspect-16/10 w-full object-cover sm:aspect-21/9"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
