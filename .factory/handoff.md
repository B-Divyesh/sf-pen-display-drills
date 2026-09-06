# Verification 5 handoff

## Result

**FAIL** — one medium accessibility finding remains. There are zero untested claims.

- Implementation reviewed: `3c7f77f7c9a80a9f397b38c2d82754a80467e786`
- Documentation baseline: `acca723b36d33356875693f03d6706b13f5f1081`
- Live URL: <https://pen-display-drills.sociobot.in>
- Full report: [verification-5.md](verification-5.md)

## What was verified

- The deployed 404 repair is correct: a real HTTP 404 now says `Page not found`, explains the address mismatch, and returns to the landing page.
- Fresh phone and desktop sessions showed the job, audience, first action, expected result, and three facts before scrolling at normal text size.
- The one-click demo showed Box, `82/100 · 76/100`, its persistent sample label, Reset demo, and Start for real. Reset restored the seed. No demo state reached real storage.
- All 11 exact claim commands passed independently from a clean clone. Each claim ID appears in exactly one tagged test.
- Typecheck, lint, the full 6-unit/32-browser suite, build, and audit passed. `dist/` was produced.
- All five live drills completed with full target coverage at `100/100`. Invalid input, license recovery, missing-canvas recovery, timer completion, keyboard, touch, pen, and mouse paths passed.
- Offline reload and the service-worker update flow passed. All 15 public build files matched production byte for byte.
- Normal-size mobile structure, touch targets, routes, titles, links, focus, reduced motion, legal pages, and Axe scans passed.
- Lighthouse scored 100/100/100/100. LCP was 1.2 s, TBT 0 ms, CLS 0, and transfer size 74 KiB.

## Finding to fix

At a 390 px viewport with text enlarged to 200%, `main { overflow: clip; }` hides content that grows beyond the viewport. The landing, practice, demo, privacy, and terms pages are affected. The demo timer loses its last digit and several headings extend beyond the clipped edge.

Make enlarged headings and the session meter wrap or size within the available width. Remove clipping that hides resized text. Add a 390 px regression that increases root text to 200% and checks important text bounds against the visible main area.

## Re-run

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
```

Then run every exact command in `.factory/claims.json`, repeat the 200% phone check on all routes, and confirm the deployed build matches `dist/`.

## Evidence and remaining external work

Evidence is under `/work/.evidence/verification-5/`. The machine-readable result is `/work/.evidence/qa-result.json`.

No product code changed in this verification. New Space Pack checkout still depends on external billing registration. Existing-license restore remains available, and the product makes no new-sale claim.
