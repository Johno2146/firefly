import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function IconRoof(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.2 12 4l9 7.2" />
      <path d="M5.5 9.6V20h13V9.6" />
      <path d="M9.2 20v-5.4h5.6V20" />
      <path d="M8.6 12.6h6.8" />
    </svg>
  );
}

export function IconBattery(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7.5" width="15" height="9" rx="2.4" />
      <path d="M21 10.6v2.8" />
      <path d="M10.6 9.8 8.4 12.6h3.2l-2.2 2.8" />
    </svg>
  );
}

export function IconMonitor(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 15.4a8 8 0 0 1 16 0" />
      <path d="M12 15.4V9.6" />
      <circle cx="12" cy="15.6" r="1.5" />
      <path d="M4.4 19.2h15.2" />
    </svg>
  );
}

/** Intruder alarms: a bell on its hanger with the clapper below. */
export function IconAlarm(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.4 16.4c1.4-1.6 1.6-2.9 1.6-5.4a5 5 0 0 1 10 0c0 2.5.2 3.8 1.6 5.4Z" />
      <path d="M10.3 16.4a1.7 1.7 0 0 0 3.4 0" />
      <path d="M12 6V4.4" />
    </svg>
  );
}

/** CCTV: a camera body and lens on a bracket, looking to one side. */
export function IconCamera(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6.4" width="12.6" height="10.6" rx="2.8" />
      <circle cx="8.6" cy="11.7" r="2.5" />
      <circle cx="8.6" cy="11.7" r="0.9" fill="currentColor" />
      <path d="M15.6 9.6l4.8-1.7v7.8l-4.8-1.7" />
    </svg>
  );
}

/** Electric fencing: three pickets behind two run wires. */
export function IconFence(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.6 4.6 4.2 6.8V19h2.8V6.8Z" />
      <path d="M12 4.6 10.6 6.8V19h2.8V6.8Z" />
      <path d="M18.4 4.6 17 6.8V19h2.8V6.8Z" />
      <path d="M2.6 9.6h18.8M2.6 14.2h18.8" />
    </svg>
  );
}

/** Gate and garage door automation: a door in its frame, on the floor. */
export function IconGate(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.2" y="4.6" width="17.6" height="14.2" rx="2.4" />
      <path d="M3.2 9.6h17.6M3.2 14.4h17.6" />
      <path d="M2.4 21h19.2" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.6 4.4 4.2L19 7.2" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h13" />
      <path d="m12.6 6.2 6 5.8-6 5.8" />
    </svg>
  );
}

export function IconArrowUp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 19V5.6" />
      <path d="m6.2 11.4 5.8-5.8 5.8 5.8" />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.4 3.6h3l1.4 3.6-2 1.4a10.4 10.4 0 0 0 5.2 5.2l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2A15.6 15.6 0 0 1 4.4 5.8a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.6" width="18" height="12.8" rx="2.4" />
      <path d="m4.4 7.6 7.6 5.4 7.6-5.4" />
    </svg>
  );
}

/** WhatsApp: speech bubble with a handset, the standard glyph shape. */
export function IconWhatsApp(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12.04 2.4a9.5 9.5 0 0 0-8.1 14.44L2.6 21.6l4.9-1.28a9.5 9.5 0 1 0 4.54-17.92Zm0 1.74a7.76 7.76 0 0 1 0 15.52 7.7 7.7 0 0 1-3.93-1.07l-.34-.2-2.9.76.78-2.83-.21-.35a7.76 7.76 0 0 1 6.6-11.83Zm-3.1 3.6c-.18 0-.47.07-.72.34-.24.27-.93.91-.93 2.2 0 1.3.95 2.55 1.08 2.72.13.18 1.83 2.92 4.53 3.98 2.24.88 2.7.7 3.19.66.48-.05 1.56-.64 1.78-1.26.22-.61.22-1.14.16-1.25-.07-.11-.26-.18-.54-.31-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.13-.61.14-.18.27-.7.9-.86 1.08-.16.18-.32.2-.59.07a7.6 7.6 0 0 1-2.23-1.38 8.4 8.4 0 0 1-1.54-1.92c-.16-.27-.02-.42.12-.56.13-.13.28-.32.42-.48.14-.16.18-.27.28-.45.09-.18.04-.34-.03-.48-.07-.14-.6-1.48-.83-2.02-.21-.5-.43-.44-.6-.45h-.5Z" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s6.4-5.4 6.4-10.4a6.4 6.4 0 0 0-12.8 0C5.6 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.8 1.1-5.9L3.5 9.8l5.9-.8Z" />
    </svg>
  );
}

export function IconQuote(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M9.6 5.4C6.2 6.6 4 9.4 4 12.8c0 3.3 1.9 5.8 4.6 5.8 2.2 0 3.8-1.6 3.8-3.7 0-2-1.4-3.5-3.3-3.5-.4 0-.7 0-1 .2.3-1.6 1.6-3 3.4-3.8Zm9 0c-3.4 1.2-5.6 4-5.6 7.4 0 3.3 1.9 5.8 4.6 5.8 2.2 0 3.8-1.6 3.8-3.7 0-2-1.4-3.5-3.3-3.5-.4 0-.7 0-1 .2.3-1.6 1.6-3 3.4-3.8Z" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M4 7.6h16M4 12h16M4 16.4h16" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6" />
    </svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4.6" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.6 8.4h2.2V5.6h-2.4a3.6 3.6 0 0 0-3.6 3.6v1.6H8.6v2.8h2.2V20h3V13.6h2.3l.5-2.8h-2.8V9.4c0-.6.4-1 1-1Z" />
    </svg>
  );
}

export function IconLinkedIn(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="3.4" />
      <path d="M8 10.6V16M8 7.9v.1M12 16v-3.1a1.9 1.9 0 0 1 3.8 0V16" />
    </svg>
  );
}

export function IconYouTube(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.8" y="6" width="18.4" height="12" rx="3.4" />
      <path d="m10.6 9.8 4.6 2.6-4.6 2.6Z" />
    </svg>
  );
}
