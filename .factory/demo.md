# Demo sandbox

## Entry point

- Production: `https://pen-display-drills.sociobot.in/demo`
- Local: `http://127.0.0.1:4173/demo`
- Compatibility entry: `/?demo=1`

The `/demo` route and `/?demo=1` query entry both enter demo mode directly. The query entry is replaced with the canonical `/demo` URL before the service worker registers, so offline reloads use one stable cache key. Both start on the box drill with two realistic sample results: 82 and 76.

## Isolation

Practice state is held in page memory only. Demo mode does not read or write IndexedDB, OPFS, cookies, or a `localStorage` practice key. It never calls the license service. The optional paid license uses the separate `sb_license:pen-display-drills` key outside the demo flow.

The sample target definitions ship in the JavaScript bundle and in the service-worker cache. They remain available offline.

## Reset and leave

“Reset demo” removes every demo stroke and score created during the visit. It restores the box drill and the two seed scores. “Start for real” opens `/practice` with an empty session. Nothing transfers from the demo.

## Verification

Run `npm test -- --grep @claim:demo-sandbox` from a clean install. The offline claim uses `/?demo=1`, waits for service-worker control, reloads without a network, and draws on the restored canvas.
