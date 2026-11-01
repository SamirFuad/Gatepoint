# Window UI upgrade

The `window` branch evolves Gatepoint's forest, lime, and warm paper identity
across marketing, authentication, organizer workspaces, event discovery,
registration, and guest passes. Existing routes and business workflows remain
in place. The gate-shaped photography treatment echoes the existing logo.

## Interaction changes

- Public events support date/name sorting, grid/list views, and clear filters.
- Organizer event searches have a visible reset action.
- Workspace breadcrumbs link back to parent pages.
- Platform preview tabs support Up/Down, Left/Right, Home, and End keys.
- The marketing layout includes a keyboard skip link.
- Motion uses short CSS opacity/transform transitions, respects reduced motion,
  and avoids continuous animations, scroll handlers, and animation libraries.
- Narrow screens retain navigation through the mobile menu; below 380px the
  duplicate header create-event button yields space to that menu.

## Verification

- Production Next.js build and TypeScript check passed.
- All 17 existing auth, registration, event, and media regression tests passed.
- Browser checked desktop homepage/sign-in and mobile homepage/discovery at
  390px and 320px. Verified menu opening and Escape dismissal, feature switching,
  list view, alphabetical sorting, empty search feedback, and filter reset.
- Signed-in workspace and registration submission were not exercised in the
  browser; no organizer session was available in the test browser.

## Performance scope

No new dependencies or images. Server/client component boundaries are preserved.
Existing above-the-fold images use Next.js 16's `preload` API.

Baseline production static chunks totaled 508,630 bytes gzipped JavaScript and
26,646 bytes gzipped CSS. The final upgraded production build measured
509,243 bytes JavaScript and 29,857 bytes CSS: about 0.6 KB JS and 3.2 KB CSS
additional across all chunks, not per page. Chunk totals are a transfer-size guardrail, not a
Core Web Vitals benchmark; real-device/network performance remains to be measured.

Styles are grouped in `src/app/window.css`, imported after the existing global
styles, so the visual evolution remains easy to review and adjust independently
of event/authentication business logic.
