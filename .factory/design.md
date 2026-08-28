# Pen Display Drills visual thesis

## Direction

The product is a **mid-century instrument panel for hand control**. The drawing area behaves like a cream drafting surface set into a dark navy machine. Brass knobs, stamped labels, calibration ticks, and amber lamps make feedback feel measured rather than judged. This fits a physical-skill trainer: the artist is tuning an instrument, not filling another blank canvas.

The page avoids the centered SaaS hero. On wide screens, the opening is an offset two-column workbench with the copy on the left and a cropped calibration illustration on the right. Sections are separated by ruled scales and serial-number labels. On phones, the copy leads and the instrument face follows.

## Tokens

- `--panel: #122b31` — deep oxidized navy, the main chassis.
- `--panel-raised: #1c3a3f` — raised instruments and dark-theme surfaces.
- `--paper: #f3ecd8` — warm drafting paper and light-theme background.
- `--paper-deep: #dfd3b6` — inset wells and ruled areas.
- `--ink: #172b2d` — body copy on paper.
- `--muted: #536765` — secondary copy on paper; tested above 4.5:1.
- `--cream: #fff8e7` — copy on the dark panel.
- `--amber: #edae49` — primary controls and current target.
- `--amber-ink: #332000` — text on amber.
- `--signal: #d95d45` — errors and high deviation, always paired with text.
- `--good: #2f7968` — on-target feedback, always paired with text.
- `--focus: #8fd4cf` — high-contrast focus ring.

The experience is deliberately single-mode. Drafting paper and a dark chassis define the object; an automatic light/dark inversion would weaken its physical metaphor. Browser chrome uses `#122b31`.

## Type

- Display: `Arial Narrow`, `Roboto Condensed`, `Franklin Gothic Condensed`, sans-serif. Condensed uppercase labels echo engraved instrument legends without requiring a network font.
- Body: `Avenir Next`, `Segoe UI`, `Helvetica Neue`, sans-serif. This keeps instructions clear at 16px and above.
- Scores and timers use tabular figures. Utility labels use 0.08–0.14em letter spacing.

No fonts load from a CDN. The chosen system families keep the first load small and work offline immediately.

## Spacing and shape

Spacing follows an 8px base: 8, 16, 24, 32, 48, 64, 96. Maximum copy measure is 68 characters. Controls are at least 44px high with 12px gaps. Corners are restrained: 2px for paper, 6px for controls, and full circles only for dials and status lamps. Borders are 1–2px ruled lines with an occasional inset shadow, like enamelled equipment rather than floating cards.

## Interaction grammar

- Amber means “act or aim.” Teal means “within tolerance.” Red means “try again.” Text and shapes repeat every color signal.
- Primary buttons depress by 2px. Toggle switches slide in the direction of the state change.
- The canvas cursor starts as a crosshair. Pointer capture keeps pen strokes intact when the hand drifts outside the target.
- Each stroke gets one immediate result. A slim deviation gauge moves; it does not spray confetti.
- Keyboard drawing uses arrows to move the crosshair, Space to lower or lift the pen, `R` to reset, and `N` for the next drill.

## Motion

The signature motion is a single gauge needle settling over 220ms after a stroke. Route content fades and rises 8px over 180ms. Buttons depress over 120ms. Nothing loops. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling stop, route changes are instant, and the needle snaps to its value.

## Asset plan and provenance

One original hero illustration shows an oblique 1960s drafting console with a stylus tracing a precise amber line over cream graph paper. It sets the product world without pretending to be the live interface. The social image is composed from that same art with real HTML metadata copy outside the bitmap; icons and interface diagrams are hand-authored SVG or CSS.

Prompt sheet:

- Subject: compact 1960s technical drafting console, blank pen stylus, geometric line and ellipse calibration targets.
- World: industrial design studio workbench, no person.
- Materials: enamelled navy metal, cream paper, brushed brass, bakelite knobs.
- Light/lens: warm directional studio light, crisp shallow oblique view, print-poster finish.
- Palette words: oxidized navy, drafting cream, safety amber, muted coral, brass.
- Negative list: no words, no letters, no logos, no watermark, no brand, no hands, no screens with UI, no gradients, no neon, no glossy sci-fi.

Generation prompt: “A wide editorial illustration of a compact 1960s technical drafting console on an industrial design workbench, enamelled oxidized navy metal body, inset cream graph paper, slim blank stylus tracing one precise safety-amber line through geometric calibration marks, two restrained brass dials and a muted coral indicator, shallow oblique perspective, warm directional studio light, tactile screen-print grain, clean negative space at upper left, mid-century industrial product manual aesthetic. No people, no hands, no words, no letters, no numbers, no logos, no watermark, no brands, no computer UI, no neon, no glossy sci-fi.”

Generated through `/opt/fleet/lib/gen-image.sh` using the factory image deployment on 2026-08-28. The selected output is original to this product. Source PNG and prompt sidecar live in `assets/src/`; derived WebP files live in `public/assets/`.

## Accessibility intent

The ruled visual language never carries meaning alone. Status lights have text, the gauge has a number, and canvas instructions are exposed to assistive technology. Focus uses a 3px cyan ring plus a 2px dark offset. At 390px, all controls stack, the timer remains visible, and the canvas uses the viewport width without horizontal scrolling.
