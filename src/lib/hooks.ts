import { useEffect, useRef, useState } from "react";

/**
 * True when the visitor asked for reduced motion. Every JS animation on the page
 * checks this: with it on, nothing animates and decorative layers are switched
 * off by the CSS media query in app.css as well.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/* ------------------------------------------------------------------ *
 *  One rAF-throttled scroll bus for the whole page.
 *
 *  Every scroll-driven effect subscribes here instead of adding its own
 *  listener, so a scroll burst costs one animation frame and no React
 *  render: subscribers write to the DOM directly (class, dataset,
 *  transform). React state is never updated from a scroll event.
 * ------------------------------------------------------------------ */
type ScrollTask = (scrollY: number) => void;

const tasks = new Set<ScrollTask>();
let frameId = 0;

function flush() {
  frameId = 0;
  const y = window.scrollY;
  for (const task of tasks) task(y);
}

function schedule() {
  if (!frameId) frameId = requestAnimationFrame(flush);
}

function addScrollListeners() {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function removeScrollListeners() {
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

/** Runs `task` at most once per animation frame while the page scrolls. */
export function useScrollTask(task: ScrollTask, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const first = tasks.size === 0;
    tasks.add(task);
    if (first) addScrollListeners();
    schedule();
    return () => {
      tasks.delete(task);
      if (tasks.size === 0) {
        removeScrollListeners();
        if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        }
      }
    };
  }, [task, enabled]);
}

/* ------------------------------------------------------------------ *
 *  Reveal on scroll, additive, never a precondition for reading.
 *
 *  The markup ships visible: `.reveal` has no opacity:0 in CSS. Only
 *  when this runs (client-side, after hydration) does it hide the blocks
 *  that are still *below the fold*, blocks the visitor cannot see yet,  *  and hand them to an IntersectionObserver that fades them in. Anything
 *  already on screen, any deep link, any restored scroll position, any
 *  blocked or failed script therefore still shows complete content,
 *  because nothing was ever hidden.
 *
 *  `key` re-runs the scan for a new page (the router's pathname), so the
 *  reveals work the same on a client-side navigation as on a fresh load.
 *  The scan waits one frame, because a route change has scrolled the new
 *  page to the top by then, "below the fold" must mean where the visitor
 *  actually is.
 * ------------------------------------------------------------------ */
export function useRevealOnScroll(key: unknown = null) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | null = null;
    let safety = 0;

    const raf = requestAnimationFrame(() => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal"),
      );
      const fold = window.innerHeight;
      const pending = new Set<HTMLElement>();

      for (const node of nodes) {
        if (node.classList.contains("is-visible")) continue;
        const top = node.getBoundingClientRect().top;
        if (top > fold * 0.96) {
          // Only arm what has not been seen yet, so hiding is never visible.
          node.classList.add("reveal-armed");
          pending.add(node);
        } else if (node.classList.contains("reveal-armed")) {
          // Nothing currently on screen may ever be left faded out, a block
          // armed on a previous page and now in view is simply shown.
          node.classList.add("is-visible");
        }
      }
      if (pending.size === 0) return;

      let fired = false;
      observer = new IntersectionObserver(
        (entries) => {
          fired = true;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            el.classList.add("is-visible");
            pending.delete(el);
            observer?.unobserve(el);
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0 },
      );

      for (const el of pending) observer.observe(el);

      // Safety net: if the observer never fired (unusual embedding, print
      // preview, timing edge case) un-hide everything rather than leave a
      // blank page behind.
      safety = window.setTimeout(() => {
        if (fired) return;
        for (const el of pending) el.classList.add("is-visible");
        pending.clear();
      }, 1200);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      observer?.disconnect();
    };
  }, [key]);
}

/**
 * Pauses decorative layers (particles, glows) while they are off screen or
 * while the tab is in the background, so nothing burns frames for a section
 * nobody is looking at. One observer for the whole page; `key` re-scans when
 * the route (and therefore the set of decorative layers) changes.
 */
export function usePauseOffscreenDecor(key: unknown = null) {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-decor]"),
    );
    let observer: IntersectionObserver | null = null;

    if (nodes.length && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            (entry.target as HTMLElement).classList.toggle(
              "is-offscreen",
              !entry.isIntersecting,
            );
          }
        },
        { rootMargin: "120px" },
      );
      for (const node of nodes) observer.observe(node);
    }

    const onVisibility = () => {
      document.documentElement.dataset.tab = document.hidden
        ? "hidden"
        : "visible";
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [key]);
}

/**
 * Scrolls the current deep link (`/services#process`) into view, once, after the
 * route has rendered, a plain `scrollIntoView` so a direct load of an anchored
 * URL lands in the right place whatever the router did beforehand. Without a
 * hash this does nothing at all, which leaves the router's own scroll-to-top
 * and back/forward restoration in charge.
 */
export function useHashAnchor(hash: string) {
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ block: "start", behavior: "instant" });
  }, [hash]);
}

/**
 * Cursor-following "magnetic" pull on the primary CTA. The element's box is
 * measured once per pointer entry (never per move) and the transform is
 * written on the next animation frame, so hovering never triggers layout.
 */
export function useMagnetic<T extends HTMLElement = HTMLSpanElement>(
  strength = 12,
) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let box: DOMRect | null = null;
    let queued = false;
    let x = 0;
    let y = 0;

    const apply = () => {
      queued = false;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };

    const onEnter = () => {
      box = el.getBoundingClientRect();
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!box) box = el.getBoundingClientRect();
      x = ((event.clientX - (box.left + box.width / 2)) / box.width) * strength;
      y =
        ((event.clientY - (box.top + box.height / 2)) / box.height) *
        strength *
        0.6;
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    };
    const reset = () => {
      box = null;
      el.style.transform = "";
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointercancel", reset);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      el.removeEventListener("pointercancel", reset);
      el.style.transform = "";
    };
  }, [reduced, strength]);

  return ref;
}
