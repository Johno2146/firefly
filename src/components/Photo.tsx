import type { GalleryItem } from "~/lib/content";

type PhotoProps = {
  item: GalleryItem;
  /** CSS `sizes`, matching how wide this photo is actually displayed. */
  sizes: string;
  /** Above-the-fold photographs load eagerly; everything else waits. */
  priority?: boolean;
  className?: string;
  /** Overrides the crop point (CSS `object-position`). */
  focus?: string;
};

/**
 * One installation photograph.
 *
 * Every `<img>` on the site goes through here so three things are never
 * forgotten: real `width`/`height` (the frame is reserved before the bytes
 * arrive, so nothing shifts), `srcSet`/`sizes` (the browser downloads the
 * smallest tier that is still sharp on the visitor's screen) and lazy
 * loading for anything below the fold. The photograph's own intrinsic size
 * comes from the file it points at, 480/960/1440-wide webp derivatives of
 * the owner's originals.
 */
export function Photo({
  item,
  sizes,
  priority = false,
  className = "",
  focus,
}: PhotoProps) {
  return (
    <img
      src={item.src}
      srcSet={item.srcSet}
      sizes={sizes}
      width={item.width}
      height={item.height}
      alt={item.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      style={{ objectPosition: focus ?? item.focus }}
      className={className}
    />
  );
}
