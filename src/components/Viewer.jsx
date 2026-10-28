import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { gsap } from "gsap";
import Watch from "./Watch.jsx";
import Watch3D from "./Watch3D.jsx";
import ConfigControls, { fallbackLook, useConfig } from "./ConfigControls.jsx";
import { BODY_PARTS, DEMO_PRICE, LIST, MOVEMENT_PARTS, PARTS, PRESETS, specFor } from "../data.js";
import { heroRig, registerRig, setConfig } from "../lib/rigs.js";

const PI = Math.PI;
const VIEWS = {
  front: { n: "Front", ry: 0, rx: 0, dist: 6, tx: 0, ty: 0, tz: 0.2, explode: 0, labels: false },
  side: { n: "Side", ry: -PI / 2, rx: -0.05, dist: 5.2, tx: 0, ty: 0, tz: 0.5, explode: 0, labels: false },
  back: { n: "Back", ry: PI, rx: 0, dist: 5.2, tx: 0, ty: 0, tz: 0.2, explode: 0, labels: false },
  crown: { n: "Crown view", ry: -PI / 2, rx: -0.1, dist: 2.6, tx: 0, ty: 0, tz: 1.0, explode: 0, labels: false },
  dial: { n: "Dial macro", ry: 0, rx: 0, dist: 2.2, tx: 0, ty: 0.05, tz: 0.2, explode: 0, labels: false },
  movement: { n: "Explore movement", ry: PI - 0.75, rx: -0.28, dist: 7.2, tx: 0, ty: 0, tz: 0, explode: 1, labels: true },
};
const wrap = (d) => Math.atan2(Math.sin(d), Math.cos(d));

/* Full-screen product viewer: a native <dialog> (focus trap, Esc) holding an interactive 3D watch.
   Drag to rotate, wheel / pinch / buttons to zoom, view presets, part picking, exploded movement. */
const Viewer = forwardRef(function Viewer(_, ref) {
  const dlg = useRef(null), rig = useRef({ ry: 0.55, rx: -0.12, dist: 6, tx: 0, ty: 0, tz: 0, auto: 1, fade: 1, explode: 0, labels: false, suspend: false, angle: 0.55 }).current;
  const [open, setOpen] = useState(false), [shown, setShown] = useState(false);
  const [view, setView] = useState("front"), cfg = useConfig();
  const [part, setPart] = useState(null), [mode, setMode] = useState("loading"), [spin, setSpin] = useState(true);
  const preset = Object.entries(PRESETS).find(([, p]) => Object.keys(p).every((k) => p[k] === cfg[k]))?.[0], m = LIST.find((x) => x.id === preset);
  const title = m ? m.name : "YOUR NOIR";

  useImperativeHandle(ref, () => ({ open: (id, f) => {
    Object.assign(rig, { ry: 0.55, rx: -0.12, dist: 6, tx: 0, ty: 0, tz: 0, auto: 1, explode: 0, labels: false, angle: 0.55 });
    if (id && PRESETS[id]) setConfig({ ...PRESETS[id], ...(f === undefined ? {} : { leather: f }) });
    setView("front"); setPart(null); setSpin(true); setMode("loading"); setOpen(true); heroRig.suspend = true;
  } }));
  useEffect(() => registerRig(rig), [rig]);
  useEffect(() => {
    if (!open) return;
    dlg.current?.showModal(); const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id);
  }, [open]);
  useEffect(() => () => { heroRig.suspend = false; }, []);

  const close = () => { setShown(false); gsap.killTweensOf(rig); setTimeout(() => { dlg.current?.close(); setOpen(false); heroRig.suspend = false; }, 280); };
  const go = (key) => {
    const { n, labels, ...t } = VIEWS[key]; setView(key); setSpin(false);
    rig.ry = rig.angle; rig.auto = 0; rig.labels = labels; gsap.killTweensOf(rig);
    gsap.to(rig, { ...t, ry: rig.angle + wrap(t.ry - rig.angle), duration: 0.9, ease: "power2.inOut" });
  };
  const zoom = (f) => { rig.dist = Math.min(9, Math.max(1.6, rig.dist * f)); };
  const toggleSpin = () => { if (spin) { rig.ry = rig.angle; rig.auto = 0; } else rig.auto = 1; setSpin(!spin); };
  const pick = (id) => { setPart(id); if (MOVEMENT_PARTS.includes(id) || id === "plate") { if (view !== "movement") go("movement"); } };
  const info = part && PARTS[part];

  if (!open) return <dialog ref={dlg} aria-hidden="true" />;
  return (
    <dialog ref={dlg} aria-labelledby="viewer-h" onCancel={(e) => { e.preventDefault(); close(); }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-ink p-0 text-ivory">
      <div className={`grid h-full transition duration-300 ease-out md:grid-cols-[1fr_minmax(340px,30rem)] ${shown ? "scale-100 opacity-100" : "scale-[.98] opacity-0"} grid-rows-[minmax(0,50svh)_minmax(0,1fr)] md:grid-rows-1`}>
        <div className="relative min-h-0 overflow-hidden" style={{ background: "radial-gradient(circle at 50% 45%, #2b2c30, #0b0b0c 72%)" }}>
          {mode === "fallback" && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div><Watch {...fallbackLook(cfg)} className="mx-auto h-[min(32svh,420px)] w-auto drop-shadow-[0_24px_30px_rgba(0,0,0,.7)] md:h-[min(60svh,460px)]" label={`${title} illustration`} />
                <p className="mt-2 px-4 text-[11px] leading-snug text-silver/60">3D is unavailable in this browser. This simplified illustration shows dial colour, strap finish and metal tone only; part details still work from the list.</p></div>
            </div>
          )}
          <Watch3D rig={rig} interactive sway={false} label={`Interactive 3D model of ${title}. Drag to rotate, scroll or pinch to zoom.`} onMode={setMode} onPick={pick} />
          {mode === "3d" && <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] tracking-[0.2em] text-silver/55">DRAG TO ROTATE &middot; SCROLL OR PINCH TO ZOOM &middot; TAP A PART</p>}
          <button onClick={close} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-silver/30 bg-ink/70 text-lg text-ivory transition hover:border-gold hover:text-gold" aria-label="Close viewer (Esc)">&times;</button>
        </div>

        <div className="min-h-0 overflow-y-auto border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8">
          <p className="text-[11px] tracking-[0.4em] text-gold">{(m ? m.tag : "Configured by you").toUpperCase()}</p>
          <h2 id="viewer-h" className="mt-2 font-display text-4xl md:text-5xl">{title}</h2>
          <p className="mt-2 text-sm text-silver/80">{m ? m.d : "Your own combination of dial, bezel and bracelet."}</p>
          <p className="mt-3 text-sm text-ivory">{DEMO_PRICE}</p>

          <div role="group" aria-label="Collection presets" className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] tracking-[0.25em] text-silver/60">PRESET</span>
            {LIST.map((x) => (
              <button key={x.id} aria-pressed={x.id === preset} onClick={() => setConfig({ ...PRESETS[x.id] })}
                className={`border px-3 py-1.5 text-[11px] tracking-[0.18em] transition ${x.id === preset ? "border-gold text-gold" : "border-silver/20 text-silver hover:border-gold/60"}`}>{x.name.replace("NOIR ", "")}</button>
            ))}
          </div>
          <div className="mt-6"><ConfigControls /></div>

          <div role="group" aria-label="Viewing angle" className="mt-6 flex flex-wrap gap-2">
            {Object.entries(VIEWS).map(([k, v]) => (
              <button key={k} aria-pressed={view === k} onClick={() => go(k)}
                className={`rounded-full border px-3 py-1.5 text-[11px] tracking-[0.15em] transition ${view === k ? "border-gold bg-gold text-ink" : "border-silver/25 text-silver hover:border-gold/60"}`}>{v.n}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] tracking-[0.15em]">
            <button onClick={() => zoom(0.8)} aria-label="Zoom in" className="border border-silver/25 px-3 py-1.5 text-silver hover:border-gold/60">ZOOM +</button>
            <button onClick={() => zoom(1.25)} aria-label="Zoom out" className="border border-silver/25 px-3 py-1.5 text-silver hover:border-gold/60">ZOOM &minus;</button>
            <button onClick={toggleSpin} aria-pressed={spin} className="border border-silver/25 px-3 py-1.5 text-silver hover:border-gold/60">{spin ? "PAUSE ROTATION" : "RESUME ROTATION"}</button>
          </div>

          <div aria-live="polite" className="mt-6 min-h-[7rem] border border-gold/30 p-4">
            {info ? (<><p className="text-[11px] tracking-[0.3em] text-gold">{info.n.toUpperCase()}</p><p className="mt-2 text-sm leading-relaxed text-silver/90">{info.t}</p></>)
              : <p className="text-sm text-silver/60">Select a part below, or tap it on the watch, to read about it. Tapping the caseback opens the movement.</p>}
          </div>
          <p className="mt-4 text-[11px] tracking-[0.25em] text-silver/60">PARTS</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {BODY_PARTS.map((id) => (<button key={id} aria-pressed={part === id} onClick={() => setPart(id)} className={`border px-2.5 py-1 text-[11px] ${part === id ? "border-gold text-gold" : "border-silver/20 text-silver hover:border-gold/60"}`}>{PARTS[id].n}</button>))}
          </div>
          <p className="mt-4 text-[11px] tracking-[0.25em] text-silver/60">MOVEMENT (ILLUSTRATIVE, NOT A WORKING MECHANISM)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOVEMENT_PARTS.map((id) => (<button key={id} aria-pressed={part === id} onClick={() => pick(id)} className={`border px-2.5 py-1 text-[11px] ${part === id ? "border-gold text-gold" : "border-silver/20 text-silver hover:border-gold/60"}`}>{PARTS[id].n}</button>))}
          </div>

          <dl className="mt-6 divide-y divide-white/10 border-y border-white/10 text-sm">
            {Object.entries(specFor(cfg)).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 py-2.5"><dt className="text-silver/55">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] text-silver/50">Fictional product. Price, dimensions and specifications are demo placeholders, not verified data.</p>
        </div>
      </div>
    </dialog>
  );
});
export default Viewer;
