import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger, in milliseconds. Capped so nothing ever feels like it is waiting. */
  delay?: number;
  from?: "bottom" | "left" | "right" | "scale";
  className?: string;
  as?: "div" | "li" | "section" | "span" | "article";
};

/**
 * Fades and lifts its children when they scroll into view.
 *
 * The element is rendered fully visible, the fade is applied by JavaScript
 * *after* hydration and only to blocks that are still below the fold (see
 * useRevealOnScroll). Opacity + transform only, no layout, no React state.
 */
export function Reveal({
  children,
  delay = 0,
  from = "bottom",
  className = "",
  as = "div",
}: RevealProps) {
  const Tag = as as "div";
  const step = delay > 0 ? Math.min(delay, 120) : 0;

  return (
    <Tag
      className={`reveal ${className}`.trim()}
      data-from={from === "bottom" ? undefined : from}
      style={step ? ({ "--reveal-delay": `${step}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
