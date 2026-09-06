# Repair 5 handoff

## What changed

- Implementation commit: `3c7f77f7c9a80a9f397b38c2d82754a80467e786`.
- Documentation baseline before this repair: `84b7a20a8f345a6fe657f914822ec54a81d75254`.
- Replaced the 404-page metaphor with the direct `Page not found` heading and removed its metaphorical eyebrow.
- Added a browser regression that opens an unknown address, checks the visible recovery page, follows its return action, and confirms the landing job heading. It tests the visitor outcome rather than source text.
- Added the 404 copy to the plain-words audit. The catalog description remains verb-first, 72 characters, and is copied to `/work/.evidence/catalog-description.txt`.

## Verification

The pushed implementation was checked from a fresh clone after `npm ci`:

- All 11 exact commands from `.factory/claims.json` passed independently.
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm audit --omit=dev` passed. The full suite has 6 Vitest tests and 32 Chromium tests.
- Production build sizes: JavaScript 9.78 kB gzip; CSS 5.54 kB gzip.
- `/opt/fleet/lib/verify-url.sh https://pen-display-drills.sociobot.in/demo /work/.evidence/repair-5-verify-url` passed with no browser console errors.
- A fresh live phone and desktop visit showed the job, audience, `Try it with sample data` action, its outcome, and all three facts before scrolling. Desktop facts ended at 808 px of 900 px; phone facts ended at 723 px of 844 px.
- The live demo started with `82/100 · 76/100`, kept its sample banner, reset to the same scores, then opened an empty real practice desk with no local or session storage and no cookies.
- The live unknown route returned HTTP 404, titled `Page not found — Pen Display Drills`, showed the direct heading and explanation, and returned to the landing page. Live Playwright Axe found no serious or critical issue on that route; the full suite covers all routes.
- Current live offline reload of `/demo` returned HTTP 200 and scored a keyboard stroke. The update simulation showed the update notice, activated the new worker, replaced the cache, and kept the demo banner with no errors.
- Current mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, TBT 20 ms, CLS 0. Evidence is `/work/.evidence/repair-5-lighthouse.json`.

## Deployment

- Deployed the implementation to the existing static product with deployment `6cb7b60a-c62a-477e-a125-3fdd5a29572a`.
- Used the product's existing `dist/staticwebapp.config.json`. DNS, domains, replica settings, volumes, and other infrastructure were not changed.
- The HTTPS product now serves the new `index-wufrWTtZ.js` bundle on <https://pen-display-drills.sociobot.in>.

## Remaining notes

No product defect remains from review 5. The five core drills remain free and complete. Existing Space Pack licenses can still be restored, but a new paid checkout is not advertised because billing registration has not made one available. Enabling a new sale remains a factory billing dependency; no price, checkout link, or payment credential was invented.
