import { useEffect, useRef, useState } from "react";
import Watch from "./Watch.jsx";
import Watch3D from "./Watch3D.jsx";
import ConfigControls, { fallbackLook, useConfig } from "./ConfigControls.jsx";
import { registerRig } from "../lib/rigs.js";
import { specFor } from "../data.js";

/* Inline configurator: its own 3D canvas (drag to rotate; page scroll is never captured). */
export default function Configurator({ onOpen }) {
  const rig = useRef({ ry: 0.55, rx: -0.1, dist: 7.2, tx: 0, ty: 0, tz: 0, auto: 1, fade: 1 }).current;
  const [mode, setMode] = useState("loading"), c = useConfig(), s = specFor(c);
  useEffect(() => registerRig(rig), [rig]);
  return (
    <section id="configure" aria-labelledby="cfg-h" className="bg-char px-6 py-24 md:px-[4vw] md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div className="reveal relative aspect-[4/5] overflow-hidden border border-white/10" style={{ background: "radial-gradient(circle at 50% 45%, #2b2c30, #0b0b0c 72%)" }}>
          {mode === "fallback" && <div className="absolute inset-0 grid place-items-center"><Watch {...fallbackLook(c)} className="h-[85%] w-auto drop-shadow-[0_24px_30px_rgba(0,0,0,.7)]" label="Simplified illustration of the configured watch" /></div>}
          <Watch3D rig={rig} inline interactive sway={false} onMode={setMode} label="Interactive 3D model of the configured watch. Drag sideways to rotate." />
          <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] tracking-[0.2em] text-silver/55">{mode === "fallback" ? "SIMPLIFIED ILLUSTRATION: 3D IS UNAVAILABLE, SO BEZEL AND LINKS ARE NOT SHOWN" : "DRAG SIDEWAYS TO ROTATE"}</p>
        </div>
        <div className="reveal">
          <p className="flex items-center gap-4 text-xs tracking-[0.4em] text-gold"><span className="h-px w-10 bg-gold" />CONFIGURE</p>
          <h2 id="cfg-h" className="mt-4 font-display text-4xl leading-[1.02] text-ivory md:text-6xl">Make it yours.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-silver/75">Every choice rebuilds the watch on the left: dial colour, bezel, and bracelet are real changes to the 3D model.</p>
          <div className="mt-8"><ConfigControls /></div>
          <p className="mt-8 text-sm text-silver/80">{s.Dial} &middot; {s.Bezel} bezel &middot; {s.Bracelet}</p>
          <button onClick={() => onOpen?.()} className="mt-5 rounded-full bg-gold px-8 py-3 text-xs tracking-[0.3em] text-ink transition hover:bg-ivory">EXPLORE WATCH</button>
          <p className="mt-3 text-[11px] text-silver/45">Fictional configuration. No pricing or ordering.</p>
        </div>
      </div>
    </section>
  );
}
