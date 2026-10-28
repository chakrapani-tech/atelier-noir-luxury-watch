# ATELIER NOIR - Time, Refined.

A scroll-driven luxury watch website for an Itzfizz Digital internship assignment.
Stack: React 18, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), GSAP 3 + ScrollTrigger, Three.js (`three`, new in this version).

## The watch: real 3D, built in code

`lib/watchScene.js` builds a **procedural Three.js watch** (original geometry; no licensed model, no photo textures; not a Rolex, and it does not imitate Rolex marks or the cyclops lens):

- **Case:** brushed (anisotropic) steel flanks, chamfer rings, bevelled lugs, a toothed crown with a gold-toned cap.
- **Bezels (configurable):** *smooth* satin, *fluted* (60 machined grooves, extruded and bevelled), *polished* with an engraved-look minute scale (a texture on a flat ring).
- **Dial (configurable):** sunburst texture, brand text, date window at 3 o'clock, and 11 applied, bevelled 3D hour markers. Five colours (black, blue, green, champagne, silver) plus an open-work version. Bevelled hands at 10:10 and a sweeping seconds hand. Domed, tinted crystal above.
- **Bracelet (configurable):** *stainless steel* and *two-tone* are built **link by link**: every row has a brushed centre link and two polished outer links (84 link meshes), tapering to a folding clasp. *Leather strap* is a segmented calfskin strap with grain, stitching and a pin buckle, in three finishes.
- **Movement:** plate, wheel train, mainspring barrel, balance wheel with hairspring, bridges with screws, rotor and a glass caseback. The skeleton dial shows it from the front.

Every selector changes the 3D model, not just text: dial colour cross-fades, metals and leather ease to their new colour, and the bezel and bracelet swap geometry. Choices are shared through `lib/rigs.js`, so the hero, configurator and viewer always show the same watch (the scroll story keeps its own fixed showcase watch).

- **Hero:** loads with a large rotating watch (one turn about every 24 s), slow camera sway, a moving key light, pause/resume, and a primary **EXPLORE WATCH** button that opens the viewer (the watch itself is also a button). With reduced motion it holds a three-quarter angle. Rendering pauses when the tab is hidden or the canvas is off-screen.
- **Configurator (`Configurator.jsx`):** inline 3D canvas (drag sideways to rotate; page scrolling is never captured) beside the dial, bezel and bracelet controls.
- **Full-screen viewer (`Viewer.jsx`):** native `<dialog>` (Esc, focus trap). Drag to rotate, wheel or pinch to zoom, Front / Side / Back / Crown view / Dial macro / Explore movement, the same configurator controls, collection presets, demo price and specifications. Click the dial, bezel, crown, bracelet, clasp or caseback to read about it; the same parts are buttons for keyboard users.
- **Explore movement:** an exploded view separating crystal, dial, hands, plate, wheel train, bridges, rotor and caseback, with 7 labelled, clickable components. The motion is an illustration, **not a working mechanism**, and is labelled so.
- **Scroll story:** five beats (dial and hands, fluted bezel, side profile and crown, bracelet links, caseback and movement) drive the 3D camera from one scrubbed timeline; hero rotation hands over to scroll without a jump. If WebGL or `three` fails, a simplified SVG illustration takes over; it shows dial colour, strap finish and metal tone but **not** bezel style or links.
- Not implemented: ambient occlusion and soft ground shadows (the watch floats, lit by an environment map and two lights), side pushers (it is a three-hand watch).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run deploy     # build + publish dist/ to gh-pages (only when you choose to)
```

## Demo content disclosure

ATELIER NOIR and every product are **fictional**. All of the following is illustrative demo content, not verified product data: the hero metrics (42 h, 28,800 vph, 100 m, 21 jewels), the 40 mm case, every model description and "specification" in the collection, detail dialog and comparison, and the movement artwork (an illustration of the idea, not a real caliber). No pricing, orders, certifications or manufacturing claims are made. The visual direction is inspired by premium product pages; no Apple code, text, branding or imagery is used.

## Structure

| File | Role |
| --- | --- |
| `components/Header.jsx` | Sticky header, animated underlines, mobile menu (`aria-expanded`, Esc to close) |
| `components/Hero.jsx` | Cinematic hero, staggered reveal, four demo metrics |
| `lib/watchScene.js` | The 3D scene: geometry, materials, models, exploded movement, picking, drag/zoom, render loop, cleanup |
| `components/Watch3D.jsx` | React wrapper: dynamic `three` import, WebGL check, fallback |
| `components/Viewer.jsx` | Full-screen interactive viewer and part/movement panels |
| `components/Explorer.jsx` | Pinned feature explorer: one timeline drives the 3D rig and the SVG fallback camera |
| `components/Wrist.jsx` | "On the wrist": your photo if installed and loadable, otherwise an editorial panel with a captioned studio render |
| `components/Collection.jsx` | Three-model carousel, finish swatches, native `<dialog>` detail view |
| `components/Compare.jsx` | Illustrative comparison of the three models |
| `components/Sections.jsx` | Five alternating dark/light craft chapters, footer |
| `components/Watch.jsx`, `WatchSide.jsx`, `Movement.jsx` | Front view (3 models, clasp, open-heart), side profile, open-heart movement |
| `data.js` | Model and finish data |

## The feature explorer: one state architecture

`Explorer.jsx` builds **one** pinned, scrubbed timeline (7.5 units). Scroll position is the single source of truth:

- **Scroll -> view.** The timeline moves a camera over one watch (scale, position, tilt) and cross-fades layers (front face, side profile, open-heart movement, focus markers). `onUpdate` derives the active feature from progress and calls `setActive` only when the index changes, never per frame.
- **Click -> scroll.** A selector button scrolls to that feature's point in the timeline (`ScrollTrigger.start/end`). It never sets the view itself, so clicks and scroll cannot fight, and reverse scrolling works because the camera is a pure function of progress.
- **Reduced motion / no pin.** No timeline is created; the same buttons set the view directly with `gsap.set`.

Beats: appear and settle at centre, Movement (open-heart close-up), Dial & Hands, Sapphire Crystal (three-quarter tilt), Precision Case (bezel macro), Crown & Controls (side profile), Premium Strap (strap, keeper, end cap), then back to the full product view and release. The three-quarter and edge-on views are tilts of layered flat artwork, **not** a rotatable 3D model.

Also: `gsap.matchMedia()` for mobile scales and reduced motion; everything in `gsap.context()` and reverted on unmount; transforms and opacity only; scroll-progress bar and magnetic buttons write straight to the DOM.

## Assets: what is and is not included

| Asset | Status |
| --- | --- |
| 3D watch model file | None used. The watch is procedural code. |
| Wrist lifestyle photograph | **Not included.** Add `src/assets/media/wrist.jpg` (landscape, 2400x1600+). It is picked up at build time (restart `npm run dev`). Until then the section shows an editorial panel with a clearly captioned studio render, and it falls back the same way if the image fails to load. Nothing is composited onto a hand. |
| Product film / video | None. Nothing depends on one. |
| Photographs of watches | None. All watch visuals are SVG or procedural 3D. |

## What has and has not been tested

Built without network access (DNS fails, no `node_modules`, no copy of Three.js on the machine), so these were **never run**: `npm install`, `npm run dev`, `npm run build`, **any real Three.js rendering**, and the real GSAP scroll timeline. The 3D watch has never been drawn by a real WebGL renderer. Its geometry, materials, lighting, framing, picking, drag/pinch, link layout, clasp placement, the fluted bezel and the exploded view are all unverified and will need tuning; nothing here supports a claim that it looks realistic.

What was run (Chromium via Playwright; the real components bundled with esbuild; GSAP replaced by a stand-in; Tailwind 3.4 stand-in for v4 CSS, so styling is approximate):
- **Real canvas code:** every dial texture (6) and the bezel textures were drawn by the actual functions and inspected; this found and fixed engraved numerals that would have been hidden by the ring edge (now 0 hidden pixels).
- **Configurator:** every dial, bezel, bracelet and leather option updates the shared rig object the scene reads, shows its selected state and updates the summary; Reset; leather finishes appear only for the strap; choices carry into the viewer and back.
- **Viewer:** opens from the hero, configurator and Collection; custom configurations are titled YOUR NOIR and presets apply whole configurations; six views; part panels (bracelet, clasp, rotor); Esc and close; no overflow at 375 px.
- **Fake `three`** (accepts any call, built from the names the scene uses): runs `createWatchScene` and its config-switching code end to end without a JavaScript error and drives the 7 movement labels. This does **not** validate Three.js API usage.
- **Three.js unavailable:** hero, configurator, viewer and story fall back to the SVG illustration.
- **First screen:** EXPLORE WATCH is visible without scrolling at 1440x900, 1024x768, 768x1024, 430x932 and 375x667.
- **Layout:** no horizontal overflow at 1440, 1024, 768, 430 and 375 px; wrist section handles no photo, a photo, and a broken photo URL; no unexpected console output.

## Assets still needed

| Asset | Status |
| --- | --- |
| Wrist lifestyle photograph | **Missing.** Add `src/assets/media/wrist.jpg` (landscape, 2400x1600+, licensed). Until then visitors see an elegant studio-render panel; a developer note appears only in dev mode. |
| Photoreal 3D model (`.glb`) | Not used. Replacing the procedural geometry with a licensed, high-quality model is the biggest realism upgrade available. |
