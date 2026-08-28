# Demo sandbox

## Entry point

- Production: `https://pen-display-drills.sociobot.in/demo`
- Local: `http://127.0.0.1:4173/demo`

The `/demo` route enters demo mode directly. It starts on the box drill with two realistic sample results: 82 and 76. These values give the session meter useful context before the visitor draws.

## Isolation

Practice state is held in page memory only. Demo mode does not read or write IndexedDB, OPFS, cookies, or a `localStorage` practice key. It never calls the license service. The optional paid license uses the separate `sb_license:pen-display-drills` key outside the demo flow.

The sample target definitions ship in the JavaScript bundle and in the service-worker cache. They remain available offline.

## Reset and leave

“Reset demo” removes every demo stroke and score created during the visit. It restores the box drill and the two seed scores. “Start for real” opens `/practice` with an empty session. Nothing transfers from the demo.

## Verification

Run `npm test -- --grep @claim:demo-sandbox` from a clean install. Other claim tests use the same `/demo` entry point for geometric feedback, network interception, and offline reload.
