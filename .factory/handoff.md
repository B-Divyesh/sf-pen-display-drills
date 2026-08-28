# Review handoff — 2026-08-28

## Status: FAIL

This independent adversarial review added [review-1.md](review-1.md) and no product-code changes. The release has one blocking demo/claim defect, one medium unlisted privacy-storage claim, and three minor README-copy findings.

## What was verified

- Cold live first-read at 390×844 and 1440×900: headline, audience, action, and facts are all visible; the sample action reaches `/demo` in one click.
- Live demo isolation: no off-origin request, storage, cookie, or IndexedDB data during demo draw/reset/leave; mobile banner remains sticky; Start for real starts empty.
- Live service-worker offline reload: a controlled demo reload returns 200 offline with the demo banner.
- Direct routes, Back/focus behavior, metadata, designed 404, sitemap/robots, internal links, and visual identity pass the review checks.
- From an isolated clean clone, `npm ci` and all nine exact claim commands pass.

## Required follow-up

1. Render the claimed demo scores `82/100` and `76/100`, restore them on Reset demo, and make `@claim:demo-sandbox` assert them. This is blocking.
2. Add and test the README’s specific license-storage promise, or remove/narrow it.
3. Apply the three README rewrites in review F-1-2, F-1-3, and F-1-5.

## Reproduce

```sh
review_clone=$(mktemp -d)
git clone /work/repo "$review_clone"
cd "$review_clone"
npm ci
npm test -- --grep @claim:demo-sandbox
npm test -- --grep @claim:geometric-feedback
npm test -- --grep @claim:five-core-free
npm test -- --grep @claim:local-practice
npm test -- --grep @claim:offline-reload
npm test -- --grep @claim:input-methods
npm test -- --grep @claim:license-restore
npm test -- --grep @claim:five-minute-session
npm test -- --grep @claim:account-free
```

Open the production `/demo` route after the first command. It currently shows `2 sample drills complete`, but not the promised two sample scores.
