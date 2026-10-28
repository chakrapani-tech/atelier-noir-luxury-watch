import { useRef, useState } from "react";
import Watch from "./Watch.jsx";
import { FINISHES, LIST, PRESETS } from "../data.js";

const Swatches = ({ value, onPick, dark }) => (
  <div role="group" aria-label="Strap finish" className="flex items-center gap-2">
    {FINISHES.map((f, i) => (
      <button key={f.n} onClick={() => onPick(i)} aria-pressed={value === i} aria-label={f.n} title={f.n}
        className={`h-6 w-6 rounded-full border-2 transition ${value === i ? (dark ? "border-gold" : "border-brass") : "border-transparent"}`}
        style={{ background: `linear-gradient(135deg,${f.s[0]},${f.s[1]})`, boxShadow: "0 0 0 1px rgba(128,128,128,.4)" }} />
    ))}
  </div>
);

function Card({ m, onOpen }) {
  const def = PRESETS[m.id].leather, [fin, setFin] = useState(def);
  // Each model keeps its own default strap; picking a finish overrides it.
  const strap = fin === def ? undefined : FINISHES[fin].s;
  return (
    <article className="w-[78vw] max-w-[500px] shrink-0 snap-center border border-white/10 bg-char p-6">
      <div className="idle grid h-[400px] place-items-center overflow-hidden" style={{ background: "radial-gradient(circle at 50% 45%, #2a2b2f, #141416 70%)" }}>
        <Watch model={m.id} strap={strap} className="h-[470px] w-auto drop-shadow-[0_24px_30px_rgba(0,0,0,.7)]" label={`${m.name} watch`} />
      </div>
      <p className="mt-5 text-[11px] tracking-[0.35em] text-gold">{m.tag.toUpperCase()}</p>
      <h3 className="mt-2 font-display text-3xl text-ivory">{m.name}</h3>
      <p className="mt-2 min-h-[3.2rem] text-sm leading-relaxed text-silver/75">{m.d}</p>
      <div className="mt-5 flex items-center justify-between">
        <Swatches value={fin} onPick={setFin} dark />
        <button onClick={() => onOpen(m, fin)} className="u text-[11px] tracking-[0.3em] text-ivory">VIEW DETAILS</button>
      </div>
    </article>
  );
}

export default function Collection({ onOpen }) {
  const rail = useRef(null);
  const step = (dir) => { const r = rail.current; r.scrollBy({ left: dir * (r.firstElementChild.offsetWidth + 24), behavior: "smooth" }); };
  const key = (e) => { if (e.key === "ArrowRight") { e.preventDefault(); step(1); } if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); } };
  return (
    <section id="collection" aria-labelledby="col-h" className="bg-ink py-24 md:py-32">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-6 md:px-[4vw]">
        <div className="reveal">
          <p className="flex items-center gap-4 text-xs tracking-[0.4em] text-gold"><span className="h-px w-10 bg-gold" />THE COLLECTION</p>
          <h2 id="col-h" className="mt-4 font-display text-4xl leading-[1.02] text-ivory md:text-6xl">Three watches. One character each.</h2>
          <p className="mt-4 text-xs text-silver/55">Fictional models and finishes, for design demonstration only. &ldquo;View details&rdquo; opens the interactive 3D viewer.</p>
        </div>
        <div className="hidden gap-3 md:flex">
          {[["Previous model", -1, "\u2190"], ["Next model", 1, "\u2192"]].map(([l, d, g]) => (
            <button key={l} aria-label={l} onClick={() => step(d)} className="grid h-12 w-12 place-items-center rounded-full border border-silver/30 text-ivory transition hover:border-gold hover:text-gold">{g}</button>
          ))}
        </div>
      </div>
      <div ref={rail} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Watch collection, use left and right arrow keys" onKeyDown={key}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 md:px-[4vw]">
        {LIST.map((x) => <Card key={x.id} m={x} onOpen={(m, fin) => onOpen?.(m.id, fin)} />)}
      </div>
      <p className="mt-4 px-6 text-xs text-silver/50 md:hidden">Swipe to browse.</p>
    </section>
  );
}
