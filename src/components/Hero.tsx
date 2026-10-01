import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";

import {
  IconArrowRight,
  IconBattery,
  IconMonitor,
  IconRoof,
} from "~/components/Icons";
import { Photo } from "~/components/Photo";
import { photo } from "~/lib/content";
import { useMagnetic } from "~/lib/hooks";

/** A real rooftop array from the owner's own installation photographs. */
const HERO_PHOTO = photo("13");

/**
 * Drifting light motes behind the hero. Positions are hard-coded (never random)
 * so the server and client renders match, and the layer is `aria-hidden`,
 * switched off entirely under reduced motion and paused whenever the hero is
 * off screen (see usePauseOffscreenDecor). Kept to a handful of motes: each one
 * is a continuously animating composited layer.
 */
const MOTES = [
  { left: "8%", top: "34%", size: 6, dur: 18, delay: 0, x: 44, y: -70, opacity: 0.7 },
  { left: "19%", top: "70%", size: 5, dur: 22, delay: 2.5, x: -36, y: -92, opacity: 0.55 },
  { left: "41%", top: "14%", size: 4, dur: 20, delay: 5, x: 28, y: 82, opacity: 0.45 },
  { left: "56%", top: "72%", size: 7, dur: 23, delay: 0.8, x: -50, y: -80, opacity: 0.65 },
  { left: "73%", top: "28%", size: 4, dur: 19, delay: 3.6, x: 38, y: 74, opacity: 0.45 },
  { left: "88%", top: "66%", size: 6, dur: 21, delay: 1.6, x: -40, y: -72, opacity: 0.55 },
];

function FireflyField() {
  return (
    <div
      aria-hidden
      className="decor-motion pointer-events-none absolute inset-0 overflow-hidden"
    >
      {MOTES.map((mote, index) => (
        <span
          key={index}
          className="anim-drift absolute rounded-full"
          style={
            {
              left: mote.left,
              top: mote.top,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              background:
                "radial-gradient(circle, rgba(252,220,208,0.98) 0%, rgba(244,112,60,0.75) 45%, rgba(242,82,27,0) 72%)",
              boxShadow: "0 0 12px 3px rgba(242,82,27,0.38)",
              "--ff-dur": `${mote.dur}s`,
              "--ff-delay": `${mote.delay}s`,
              "--ff-x": `${mote.x}px`,
              "--ff-y": `${mote.y}px`,
              "--ff-opacity": `${mote.opacity}`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

const HIGHLIGHTS = [
  { icon: IconRoof, label: "Designed around your roof" },
  { icon: IconBattery, label: "Battery ready from day one" },
  { icon: IconMonitor, label: "Monitoring & aftercare" },
];

export function Hero() {
  const magnetRef = useMagnetic<HTMLSpanElement>(10);

  return (
    <section
      id="top"
      className="on-dark surface-dark relative isolate overflow-hidden px-5 pt-28 pb-20 sm:px-8 sm:pt-32 lg:pt-36 lg:pb-28"
    >
      <div
        aria-hidden
        data-decor
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2">
          <div className="glow-flame anim-breathe h-full w-full" />
        </div>
        <div className="absolute top-24 -right-32 h-[26rem] w-[26rem]">
          <div className="glow-flame h-full w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
        <FireflyField />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="anim-spin-slow h-[38rem] w-[38rem] rounded-full border border-dashed border-white/8 sm:h-[44rem] sm:w-[44rem]" />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="eyebrow hero-rise text-flame-300" style={{ animationDelay: "30ms" }}>
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-flame-400" />
            Residential solar · design, install, aftercare
          </p>

          <h1
            className="hero-rise mt-5 text-[2.5rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-white sm:text-[3.4rem] lg:text-[3.9rem]"
            style={{ animationDelay: "70ms" }}
          >
            Own the <span className="gradient-text-light">sunlight</span> that
            hits your roof.
          </h1>

          <p
            className="hero-rise mt-6 text-lg leading-relaxed text-white/70"
            style={{ animationDelay: "120ms" }}
          >
            Firefly Solar designs, installs and looks after home solar and
            battery systems, from the first roof survey to the morning you
            stop thinking about your meter.
          </p>

          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "170ms" }}
          >
            <span ref={magnetRef} className="magnet">
              <Link to="/contact" className="btn btn-flame px-7 py-4 text-base">
                Get a free quote
                <IconArrowRight className="h-4.5 w-4.5" />
              </Link>
            </span>
            <Link to="/services" className="btn btn-ghost-dark py-4 text-base">
              See how it works
            </Link>
          </div>

          <ul
            className="hero-rise mt-10 flex flex-wrap gap-x-6 gap-y-3"
            style={{ animationDelay: "215ms" }}
          >
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-sm font-medium text-white/65"
              >
                <Icon className="h-4.5 w-4.5 text-flame-400" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-rise relative" style={{ animationDelay: "140ms" }}>
          <div aria-hidden data-decor className="absolute -inset-8 -z-10 hidden lg:block">
            <div className="glow-flame anim-breathe h-full w-full" />
          </div>

          <div className="relative">
            <div className="on-dark relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/12 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)] lg:max-w-none">
              <Photo
                item={HERO_PHOTO}
                sizes="(min-width: 1024px) 46vw, 92vw"
                priority
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-ink-950/5 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
