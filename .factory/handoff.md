# Pen Display Drills handoff

## What shipped

- A responsive Vite and TypeScript PWA at `/`, with real routes for `/demo`, `/practice`, `/privacy`, `/terms`, and a designed 404 state.
- Five free geometry drills: straight lines, ellipses, boxes, one-point perspective, and two-point perspective.
- Immediate per-stroke average deviation scoring, an amber tolerance band, undo, reset, finish, next-drill flow, five-minute timer, and session summary.
- Pointer Events for pen, mouse, and touch, with explicit mouse listeners and a keyboard drawing path. Arrow keys move the crosshair, Space lifts or lowers the pen, `R` resets, and `N` advances.
- A one-click `/demo` sandbox seeded with two sample scores. Demo practice remains in page memory and resets without touching real data.
- A $6 one-time space drafting pack with orbital rings, radar spokes, and gantry depth drills. Checkout and license verification follow the Sociobot API contract. Returned and pasted licenses use `sb_license:pen-display-drills`; verdicts refresh at most daily.
- Offline app-shell caching, a manifest, install icons, offline fallback, update toast, and generated build-asset injection for reliable offline reloads.
- A product-specific mid-century instrument-panel design at 390px through desktop sizes. The generated console artwork is 52 KB WebP; its prompt and source are recorded under `assets/src/`.
- Route titles, canonical metadata, Open Graph and Twitter art, sitemap, robots policy, security headers, skip link, landmarks, focus states, reduced-motion behavior, and legal pages.

## How to run

```sh
npm install
npm run dev
npm test
npm run build
npm run preview -- --port 4173
```

The deploy command is `npm run build`. Static output is `dist/`, with `dist/index.html` at its root.

## Verification on 2026-08-28

- `npm test`: passed. This ran 4 Vitest unit tests and 15 Playwright tests.
- Claim tests passed for demo reset, geometric feedback, five free core drills, local-only practice, offline reload, input methods, and paid pack activation.
- Axe Playwright scans found no serious or critical WCAG A/AA issues on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, or the 404 route.
- The 390×844 Playwright check found no horizontal overflow and kept the canvas within the viewport.
- Offline verification loaded `/demo`, waited for the service worker, disabled the network, reloaded, and found the complete drawing desk.
- Production build sizes: 26.53 KB JavaScript raw / 9.54 KB gzip; 20.12 KB CSS raw / 5.48 KB gzip; 52.49 KB hero WebP.
- Local Lighthouse 12.8.2 mobile run: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.6 s, CLS 0, total blocking time 20 ms, FCP 1.0 s.
- Visual review completed at desktop and 390px. The browser console stayed clear during the automated flows.
- `npm run build`: passed and regenerated `dist/` with the service-worker asset manifest.

## Known gaps and next steps

- Production checkout needs the factory to register the `pen-display-drills` product and price. The repository contains no product ID or secret.
- The paid license test mocks the documented Sociobot verification response. A staging checkout should be exercised after registration.
- Practice is intentionally session-only, as the brief requests. There is no history export because no drawing or score history is stored.
- Geometric feedback measures proximity to target segments. It does not judge pressure, anatomy, or artistic quality.
