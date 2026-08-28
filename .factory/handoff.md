# Verification handoff — 2026-08-28

## Status: PASS

Candidate `82956d8369e951bd3bd0e467beb0b17dbe2207d7` is releasable at <https://pen-display-drills.sociobot.in>. Independent verification found no critical, high, medium, or low product defects. The full report is in `.factory/verification-4.md`; fresh artifacts are under `.factory/qa-evidence/verification-4/`.

## Verified

- All nine exact `.factory/claims.json` commands pass after clean `npm ci`.
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm audit --omit=dev` pass. The suite has 6 unit and 28 Chromium tests.
- Precise live traces complete all five free drills with correct target coverage and feedback. Empty, far-off, undo/reset, keyboard, pointer-device, invalid-license, and network-retry paths behave correctly.
- Desktop and 390 px mobile pass first-read, layout, 44 px target, keyboard/focus, 200% text, reduced-motion, and axe serious/critical checks.
- The demo remains isolated and sticky on mobile. Pen pressure, strokes, and scores produce no storage or outbound data.
- Live offline reload and service-worker update activation pass.
- Security headers, CORS, cache policy, links, and API throttling pass. The verify endpoint allows 30 rapid requests; request 31 returns 429 with `Retry-After`.
- Every deployed public file matches the candidate build by SHA-256.
- Lighthouse mobile: 97 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, TBT 190 ms, CLS 0, 74 KiB transferred.

## Reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
node .factory/qa-evidence/verification-4/live-independent-qa.mjs
node .factory/qa-evidence/sw-update.mjs
```

Run each command in `.factory/claims.json` separately for the claims gate. The demo entry points are `/demo` and `/?demo=1`.

## Known external state

The unadvertised Sociobot checkout endpoint for this slug returns 404. The shipped product makes no purchase or price promise; it accurately presents the five free drills as the complete release and supports existing Space Pack license restoration. Registering a future paid sale is factory billing work, not a repository release blocker.

No product source code was modified during verification.
