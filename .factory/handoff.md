# Polish 3 handoff

## Status

**PASS.** Repair commit `482e305ee4d1b89901efa228e5aa897acd209c8b` is deployed to <https://pen-display-drills.sociobot.in> as Azure Static Web Apps deployment `434b2619-2480-482f-a6de-e35579d84861`.

## What changed

- Demo entries now remove a returned `license` parameter before any storage or verification work. This applies to both `/?demo=1&license=…` and `/demo?license=…`; a pre-existing real-license value is untouched.
- The single `@claim:demo-sandbox` test now proves normal one-click seed/reset behavior, direct-entry canonicalization, no new demo state or off-origin request, and preservation of a real-license sentinel.
- The first screen now starts directly with the job headline. It removes the invented series/figure labels, names the feedback example plainly, and gives the illustration a useful target-comparison caption.
- The catalog description is now the verb-first “Practice tablet lines and perspective with five-minute feedback drills.”
- [`polish-3.md`](polish-3.md) maps every F-1, F-2, and F-3 finding to its current fix and evidence.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

Run each exact command in `.factory/claims.json` independently after `npm ci`. The final clean clone was `/tmp/pen-display-polish-3-adc6Pe` at repair commit `482e305ee4d1b89901efa228e5aa897acd209c8b`; all eleven claims passed, as did the 6-unit/31-browser full suite, typecheck, lint, build, and production-only audit.

Production was then opened in fresh cold contexts. The live audit in [`qa-evidence/polish-3-live/cold-check.json`](qa-evidence/polish-3-live/cold-check.json) confirms real 200 routes, a real 404, route metadata, zero serious/critical Axe issues, direct-demo isolation, seed/reset behavior, sentinel preservation, first-screen wording, and an offline demo reload that scored `40/100`. [`deployment-hashes.tsv`](qa-evidence/polish-3-live/deployment-hashes.tsv) confirms all 15 public build files match production byte-for-byte. Live Lighthouse scored 100/100/100/100 with LCP 1.2 s, TBT 0 ms, and CLS 0.

## Known gaps and next steps

None. The free five-drill product is complete as shipped. Existing Space Pack licenses can still be restored; new checkout activation remains intentionally absent until factory billing enables the product endpoint.
