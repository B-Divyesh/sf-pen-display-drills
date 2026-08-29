# Review 3 handoff

## Status

**FAIL.** This was a read-only adversarial review. No product source, assets,
configuration, or tests were changed.

## What was done

- Opened the deployed site in fresh 390×844 and 1440×900 Chromium contexts.
- Completed normal one-click demo, reset, exit, storage, request, route,
  metadata, link, accessibility, and history checks.
- Read the brief, design thesis, claim manifest, demo contract, earlier review
  and polish reports, prior handoff, and verification records.
- Ran fresh `npm ci`, every exact command from `.factory/claims.json`,
  `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and
  `npm audit --omit=dev`.

## Verification result

All declared claim commands and repository quality commands passed. The normal
demo was isolated. A fresh live browser opening
`/?demo=1&license=demo-license-sentinel`, however, canonicalized to
`/demo` while writing `sb_license:pen-display-drills` to real
`localStorage`. The demo banner still stated that nothing is saved. This is
the blocking F-3-1 documented in [review-3.md](review-3.md).

F-3-2 records three non-informative decorative labels that do not meet the
attached plain-words contract.

## Required next steps

1. Prevent all demo routes from reading, writing, or verifying a returned
   license token.
2. Add a clean-context claim assertion for
   `/?demo=1&license=demo-license-sentinel`.
3. Replace or remove the labels identified in F-3-2.
4. Rerun the full independent review after deployment.
