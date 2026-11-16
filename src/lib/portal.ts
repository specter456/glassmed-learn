/**
 * Dedicated container for React portals (modal overlays).
 *
 * Overlays used to be portalled straight into `document.body`. That makes the
 * portal's DOM nodes siblings of everything else that writes to `<body>` —
 * the plain-DOM crash guard, the platform's injected tooling and html2canvas
 * screenshots. When any of that detaches a node React owns, React's commit
 * phase throws
 *   `NotFoundError: Failed to execute 'removeChild' ... not a child of this node`
 * from `removeChildFromContainer` and the whole app unmounts.
 *
 * Portalling into our own container gives React exclusive ownership of the
 * nodes it removes. The container has no layout or stacking context of its
 * own, so the fixed-position overlays inside it still stack globally.
 */

const PORTAL_ROOT_ID = "glassmed-portal-root";

export function getPortalRoot(): HTMLElement {
  if (typeof window === "undefined") return document.body;

  const existing = document.getElementById(PORTAL_ROOT_ID);
  if (existing) return existing;

  const el = document.createElement("div");
  el.id = PORTAL_ROOT_ID;
  document.body.appendChild(el);
  return el;
}
