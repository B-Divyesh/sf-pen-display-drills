# Independent verification handoff — 2026-08-28

## Status: FAIL

Candidate `a99dd2d5ab698435a10dba5e4a1b537ebd17b919` was independently tested at <https://pen-display-drills.sociobot.in>. The live deployment is byte-for-byte the candidate build, but it is not releasable under the supplied acceptance contract.

Release blockers:

1. On `/practice`, the existing-license label has 1.06:1 contrast and status/error text has 1.40:1 contrast against the cream desk; both require 4.5:1. Axe cannot automatically resolve the CSS gradient and lists the nodes as serious incomplete, while manual measurement and the screenshot confirm the failure.
2. At 390 px, scrolling to the demo canvas removes the required sandbox banner from view. Its computed mobile position is `relative`, not `sticky`; after `scrollY=595` its bottom is `-446.42 px`. Reset and Start-for-real are no longer persistently available.

Additional defect: the unversioned hero and social images are served with one-year `immutable` caching, which can make later artwork updates stale.

Full evidence and reproduction details are in [verification-3.md](verification-3.md). Key screenshots and machine reports are under [`qa-evidence/verification-3/`](qa-evidence/verification-3/).

## What passed

- All nine exact `.factory/claims.json` commands.
- `npm ci`, typecheck, lint, 6 unit tests, 25 Playwright tests, production build, and production dependency audit.
- Cold first-read gate and one-click seeded demo.
- All five core drills end to end, boundary/recovery/input checks, privacy/storage checks, API throttling, offline reload, and service-worker update flow.
- Live/candidate hash identity, response policies, link crawl, bundle budgets, and Lighthouse (97/100/100/100; LCP 1.3 s; CLS 0; 74 KiB transfer).

## Run the verification gates

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
```

No product source code was changed. Only verification documentation and evidence were added. Fix the two release blockers, deploy the new candidate, and rerun every claim plus the live mobile contrast/banner checks.
