import { Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";

import { IconArrowRight } from "~/components/Icons";
import { Lightbox } from "~/components/Lightbox";
import { Photo } from "~/components/Photo";
import { Reveal } from "~/components/Reveal";
import type { GalleryItem } from "~/lib/content";

/** How wide a tile really is, so the browser can pick the right tier. */
const TEASER_SIZES = "(min-width: 1024px) 33vw, 46vw";
const GALLERY_SIZES = "(min-width: 1024px) 31vw, 46vw";

/**
 * A fixed frame for every tile, chosen from the photograph's orientation, so
 * portraits, landscapes and the one wide shot all sit in a steady rhythm
 * instead of a ragged one. The photo fills its frame with `object-cover`.
 */
function frame(item: GalleryItem) {
  const ratio = item.width / item.height;
  if (ratio > 1.8) return "aspect-16/9";
  if (ratio < 1) return "aspect-3/4";
  return "aspect-4/3";
}

/**
 * The Portfolio page gallery: all of the owner's installation photographs in
 * a three-column masonry, each one clickable into the lightbox.
 *
 * Data-driven on purpose, the grid reads only src/srcSet/width/height/alt/
 * caption, so a photo can be swapped by editing `GALLERY` in ~/lib/content.
 */
export function Gallery({ items }: { items: readonly GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const tiles = useRef<Array<HTMLButtonElement | null>>([]);
  const lastOpened = useRef(0);

  const close = useCallback(() => {
    setOpenIndex(null);
    // Focus goes back where the visitor left it: the tile they opened.
    tiles.current[lastOpened.current]?.focus();
  }, []);

  const open = (index: number) => {
    lastOpened.current = index;
    setOpenIndex(index);
  };

  return (
    <>
      <ul className="columns-2 gap-4 lg:columns-3 lg:gap-5">
        {items.map((item, index) => (
          <Reveal
            as="li"
            key={item.id}
            delay={Math.min(index * 45, 180)}
            className="mb-4 break-inside-avoid lg:mb-5"
          >
            <figure>
              <button
                type="button"
                ref={(node) => {
                  tiles.current[index] = node;
                }}
                onClick={() => open(index)}
                aria-label={`Open ${item.caption}, photo ${index + 1} of ${items.length}`}
                className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900 text-left transition-colors duration-300 hover:border-flame-500/60"
              >
                <Photo
                  item={item}
                  sizes={GALLERY_SIZES}
                  className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${frame(item)}`}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-flame-400/40 bg-ink-950/85 px-3 py-1.5 text-[0.68rem] font-bold tracking-[0.1em] text-flame-200 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  View
                  <IconArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </figure>
          </Reveal>
        ))}
      </ul>

      {openIndex !== null && (
        <Lightbox
          items={items}
          index={openIndex}
          onClose={close}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}

/**
 * Home page teaser: three tiles, each a link through to the Portfolio page.
 * The frame keeps each photo's own proportions here, three mixed
 * orientations side by side is the point.
 */
export function PortfolioTeaser({ items }: { items: readonly GalleryItem[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal as="li" key={item.id} delay={index * 80}>
          <Link
            to="/portfolio"
            aria-label={`${item.caption}, see the portfolio page`}
            className="group block"
          >
            <div
              className="relative overflow-hidden rounded-3xl border border-line bg-ink-900"
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
            >
              <Photo
                item={item}
                sizes={TEASER_SIZES}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
