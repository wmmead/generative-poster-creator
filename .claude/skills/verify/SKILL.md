---
name: verify
description: How to run and verify the generative poster creator end-to-end in headless Chrome.
---

# Verifying changes to the poster creator

Static site, no build step, no npm deps. ES modules require HTTP (not `file://`).

## Launch

```bash
# Serve the repo root (from the repo root):
python3 -m http.server 8917 &
```

## Drive (headless Chrome via Playwright)

The project itself has no node_modules — install `playwright-core` in a scratch
dir and drive the system Chrome (`/Applications/Google Chrome.app`), no browser
download needed:

```js
const { chromium } = require('playwright-core');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('http://localhost:8917/index.html');
await page.waitForSelector('#layersList .layer-panel');
```

## Useful handles

- Layer panels: `#layersList .layer-panel` (one `<details>` per layer; first is created on load).
- Per-slider read-out box: `input[name="<field>"] ~ input.slider-value` inside the panel.
- Generated glyphs: `main .layer .addedtext` — to assert a setting reached the
  output, set min = max for that setting, click `.startBtn`, wait for a glyph,
  read `getComputedStyle`.
- The "Layer Transform" `<details>` is collapsed by default — click its
  `summary` before touching those inputs.
- Layer container transform: `main .layer` `el.style.transform`.
- Add layer: `#addLayerBtn`. Start/Stop/Clear: `.startBtn` / `.stopBtn` / `.clearBtn` in the panel.

## Gotchas

- Layer state (`layers` array) is module-scoped — not reachable from the page
  console. Verify through rendered output instead.
- Glyphs appear every 500ms after Start; allow ~1–2s timeouts.
- Poster is at the page's top-left; the control panel is fixed on the right —
  screenshot clip `{ x: viewportWidth-400, y: 0, width: 400 }` captures it.
