import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    // The router handles scroll position across the four pages: a new route
    // starts at the top, an in-page anchor (`/services#process`) is honoured,
    // and back/forward returns to where the visitor was. `instant` stops a page
    // swap from smooth-scrolling its way to the top, which reads as a stutter.
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
    defaultNotFoundComponent: () => <p>Not found</p>,
  });
}
