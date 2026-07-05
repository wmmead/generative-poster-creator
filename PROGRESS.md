# Generative Poster Creator — Project Progress

## Purpose

A personal-use tool (not intended for distribution) for creating generative posters
from pieces of text. Posters are composed of stacked layers, each with its own
generative settings, and are exported by printing to PDF from the browser.

Longer-term ideas:
- **SVG elements** as an additional layer content type (beyond text characters).
- **3D-printed plates**: export individual layers so they can be 3D-printed as
  plates for a modern take on block printing with ink. This is why each layer's
  state is kept as plain serializable data and why layers can be hidden
  individually (print one layer at a time to its own PDF).

## How it works

Open with VS Code Live Server (ES modules don't load over `file://`). The poster
is the `<main>` element (default 11"×17" at 96px/inch). A fixed control panel on
the right has document settings (size in inches, zoom) and one collapsible panel
per layer. Each layer "sprinkles" a random character from its character pool onto
the page every 500ms while running, with randomized size, weight, style, opacity,
rotation, color lightness, and position drawn from that layer's min/max settings.

## Architecture (vanilla JS, no build step)

- `index.html` — control panel markup and a `<template id="layerTemplate">` cloned per layer
- `styles.css` — all styling, including the `@media print` rules
- `js/main.js` — entry point; first layer, Add Layer button (capped at 10 layers)
- `js/state.js` — `layers` array, `createLayer()` factory with all defaults, remove/move helpers; layer order in the array = paint order (first = back of stack)
- `js/render.js` — `addChar(layer, container)` generation logic; per-layer `setTimeout` timers in a `Map` keyed by `layerId` (kept off layer objects so they stay serializable)
- `js/layerUI.js` — builds each layer panel from the template, wires all inputs to update the layer object live, handles Start/Stop/Clear, Hide/Show, ▲▼ reorder, remove, and whole-layer transforms
- `js/pageUI.js` — document size form, zoom slider, Print/Export PDF button
- `js/fonts.js` — font list with per-font variable weight ranges and italic availability
- `js/color.js` — `hexToRgb`, `hexToHsl` helpers

Each layer renders into its own `div.layer` inside `<main>`; DOM order of those
divs (and of the panels) is kept in sync with the `layers` array on reorder.

## Work done (July 2026 rework of summer-2025 prototype)

1. **Fixed disconnected controls from the prototype**: sliders previously wrote to
   a dead `layers[0]` object while rendering read a separate hardcoded `pv` object,
   so no control affected output. Also fixed: font weight never applied; color
   picker hue/saturation discarded (rendering was grayscale-only); width/height
   percent sliders unwired (now control centered placement spread); rotation
   simplified to a plain min/max range; print no longer affected by screen zoom.
2. **Restructured** the single `script.js` into the ES modules above; removed the
   hidden Alt+P/Alt+R keyboard shortcuts in favor of visible buttons.
3. **Multi-layer support**: up to 10 layers, each with its own full settings panel,
   independent Start/Stop/Clear, remove, and ▲▼ reordering (panel order = paint
   order; stacking follows).
4. **Per-layer Hide/Show** (header button): hidden layers are `display: none`, which
   also excludes them from printing — hide all but one layer to print individual
   plate PDFs. Generation keeps running while hidden (view state, not a pause).
5. **Per-layer transform** (collapsible "Layer Transform" section): scale (10–300%),
   rotation (±180°), and X/Y offset (±100%) applied to the whole layer container,
   independent of the per-character generation settings.

All of the above was verified end-to-end in headless Chrome (Playwright driving
the real UI); committed by Bill after review.

## Conventions / decisions

- Vanilla HTML/CSS/JS only — no frameworks, bundlers, or npm dependencies.
- No persistence: settings reset on reload (a save/load-project feature could come later).
- Export = browser Print-to-PDF; no PDF library.
- Layer names ("Layer 3") come from creation order and stay stable through reordering.
- Layer objects must stay serializable (numbers/strings/arrays only) for future export features.

## Status / next steps

Bill is experimenting with the current feature set before deciding direction.
Open ideas, none committed to yet: SVG element layers, per-layer export for 3D
plates, save/load of poster settings.
