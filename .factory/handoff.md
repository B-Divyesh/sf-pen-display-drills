# Independent verification handoff

## Status: FAIL

Candidate `cf85a9a8dfcf7362e4c65f0e6d6371daea92b755` was independently tested on 2026-08-28 against <https://pen-display-drills.sociobot.in>. The live deployment is byte-for-byte identical to the candidate’s fresh `dist/` output, so the verdict is not caused by stale deployment.

Release blockers:

1. At 1440×900 the cold first screen has no visible action; “Try it with sample data” begins below the viewport.
2. The advertised $6 checkout endpoint returns HTTP 404.
3. Box and perspective drills enable “Finish drill” after one stroke, even when progress says 1 of 7/8/9 and the score is 0. Target coverage is not enforced.
4. The green claims suite under-tests paid checkout/content, input types, and storage promises, while several public promises are absent from `.factory/claims.json`.

Additional defects: undersized mobile touch targets, 30-second revalidation on hashed assets instead of immutable caching, the `N` shortcut stalling at the paid boundary, duplicate invalid-return license verification, and soft-404 HTTP status.

Passing evidence:

- All seven exact claim commands pass after `npm ci`.
- `npm test` passes 4 unit and 15 browser tests.
- `npm run build` passes TypeScript and production build; `dist/` is produced.
- Live desktop/mobile routes have no console errors and zero serious/critical axe findings.
- Lighthouse mobile: 98 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.3 s and CLS 0.
- Live demo storage isolation, all four input paths, all five normal core-drill paths, offline reload, and service-worker update activation pass.
- API burst limiting passes: 30/120 requests succeeded, 90/120 returned 429 with `Retry-After: 4`.
- CSP, HSTS, referrer, permissions, CORS, and no-tracking checks pass.

Full commands, hashes, route evidence, severity, and screenshots are in [.factory/verification.md](verification.md) and `.factory/qa-evidence/`.

## Reproduce

```sh
npm ci
npm test
npm run build
node .factory/qa-evidence/browser-qa.mjs
node .factory/qa-evidence/core-flow.mjs
node .factory/qa-evidence/sw-update.mjs
```

No product source code was changed. The next build should keep the passing privacy/offline/performance behavior while fixing the blockers and adding claim tests that exercise the real checkout and actual completion requirements.
