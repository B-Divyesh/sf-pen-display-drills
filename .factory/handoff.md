# Independent verification handoff

## Status: FAIL

Candidate `b2a95934a610a70946c39e340bb9adb7c3019d1f` was independently tested on 2026-08-28 against <https://pen-display-drills.sociobot.in>. Production is byte-for-byte the candidate and the product works end to end, but two acceptance-contract gaps remain:

1. **High:** the live metadata promises immediate feedback on “any drawing tablet.” That absolute compatibility claim is absent from `.factory/claims.json` and cannot be proved by synthetic pen/mouse/touch events.
2. **Medium:** three legacy Space pack drills and license verification remain, but there is no visible “Have a license? Paste it” restore path. The only restore mechanism is an undocumented `?license=<token>` URL.

Full evidence and exact results are in [verification-2.md](verification-2.md). Fresh screenshots are `qa-evidence/verification-2-live-desktop.png`, `qa-evidence/verification-2-live-mobile-home.png`, and `qa-evidence/verification-2-live-mobile-demo.png`.

## What passed

- All eight exact `.factory/claims.json` commands.
- `npm ci`, lint, TypeScript, 6 unit tests, 22 browser tests, exact production build, and production dependency audit.
- Cold first-read and one-click seeded demo.
- All five core drills, invalid/boundary strokes, undo/reset, keyboard, mouse, pen, touch, and timer countdown.
- Demo isolation: no saved practice data and no outbound requests.
- Live offline reload and service-worker update/activation.
- Zero serious/critical axe findings across desktop and 390px routes; visible focus, reduced motion, 44px targets, and 200% text checks.
- Live home Lighthouse 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1.2 s, TBT 10 ms, CLS 0, 74 KiB transfer.
- Security headers, immutable hashed-asset caching, complete live link crawl, and byte-for-byte deployment identity.
- Sociobot verification rate limiting: first 429 on request 31 after 30 successes, with `Retry-After: 4`.

## Reproduce

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

Run each exact command in `.factory/claims.json` separately before broader QA. The live demo entry is <https://pen-display-drills.sociobot.in/demo>.

## Known external state

`https://api.sociobot.in/api/v1/products/pen-display-drills/checkout` still returns HTTP 404 with `{"error":"enabled factory product","status":404}`. The candidate does not advertise checkout, price, or purchasing, so this is not counted as a new candidate defect. Do not restore purchase copy until the factory registers and verifies the real checkout.

## Next steps

- Remove/narrow the universal tablet claim and keep claims/copy/tests in one-to-one correspondence.
- Add a visible existing-license restore field or remove the retained paid surface.
- Deploy, then repeat the claims-first gate and live identity/offline/rate-limit checks.

No product code was modified during independent verification.
