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

- Reproduced the candidate failure against a production preview: `/?demo=1` rendered “Practice steadier lines in five minutes” before and after an offline reload, with no demo canvas.
- Root cause: the SPA ignored the documented `demo=1` query entry. Vite preview also returns static assets with `Vary: Origin`, so strict Cache API matching could miss an installed asset and fall through to the offline network.
- Repair: `/?demo=1` now becomes canonical `/demo` before service-worker registration. Static cache reads use `ignoreVary` for same-origin assets, and each build injects an asset-derived cache version for clean updates.
- The exact clean build sequence `npm ci && npm run build` passed. It generated `dist/index.html` and an injected `dist/sw.js` from Vite 7.3.6.
- `npm test` passed twice consecutively. Each run completed 4 Vitest unit tests and 15 Playwright tests against `vite preview` of a fresh production build. `reuseExistingServer` is disabled.
- The focused `npm test -- --grep @claim:offline-reload` check passed three consecutive fresh-build runs after the final cache repair.
- The offline claim enters through `/?demo=1`, waits for `navigator.serviceWorker.controller`, confirms the active worker and cached HTML/JS/CSS, disables the network, reloads, then completes a keyboard stroke and receives a numeric score on the canvas.
- All seven claim tests passed: demo isolation/reset, geometric feedback, five free drills, local-only practice, offline reload, keyboard/pointer input, and mocked paid-license activation.
- Axe Playwright scans found no serious or critical WCAG A/AA issues on `/`, `/demo`, `/practice`, `/privacy`, `/terms`, or the 404 route. Keyboard and 390×844 mobile checks passed.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/?demo=1 ...` returned HTTP 200, title `Demo — Pen Display Drills`, `lang=en`, one h1, a main landmark, no missing alt text, no unlabeled buttons, and no console errors.
- Local Lighthouse 13.4.1 mobile run: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.1 s, CLS 0, total blocking time 50 ms, FCP 0.9 s.
- Production build sizes: 26.66 KB JavaScript raw / 9.54 KB gzip; 20.12 KB CSS raw / 5.48 KB gzip; 52.49 KB hero WebP. These remain below the product budgets.
- `npm audit` reported zero vulnerabilities after pinning Vite 7.3.6 and Vitest 3.2.7.
- Desktop and 390 px screenshots were reviewed. The mid-century instrument-panel identity and usable canvas layout are unchanged.

## Deployment evidence

- Repair commit `9222b81` was pushed to `origin/main` and deployed with `/opt/fleet/lib/deploy-static.sh pen-display-drills /work/repo/dist`.
- Azure Static Web Apps accepted deployment `4daadd07-70fd-41cd-b783-363a710bf7c5`; the custom domain reached `Ready` and HTTPS returned 200.
- Live URL: `https://pen-display-drills.sociobot.in`.
- The live `/?demo=1` verifier returned title `Demo — Pen Display Drills`, `lang=en`, one h1, a main landmark, no missing image alt text, no unlabeled buttons, and no console errors.
- A fresh live browser confirmed query-to-`/demo` canonicalization, active service worker cache `pen-drills-06aefa24401b`, offline reload, a usable canvas score, zero console errors, and zero off-origin demo requests.
- `/`, `/demo`, `/practice`, `/privacy`, `/terms`, the designed 404 route, manifest, service worker, robots file, and sitemap all returned HTTP 200. Live responses include the configured CSP, referrer, permissions, and content-type headers.

## Known gaps and next steps

- Production checkout needs the factory to register the `pen-display-drills` product and price. The repository contains no product ID or secret.
- The paid license test mocks the documented Sociobot verification response. A staging checkout should be exercised after registration.
- Practice is intentionally session-only, as the brief requests. There is no history export because no drawing or score history is stored.
- Geometric feedback measures proximity to target segments. It does not judge pressure, anatomy, or artistic quality.
