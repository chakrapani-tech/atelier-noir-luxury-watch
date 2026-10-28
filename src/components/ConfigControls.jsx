import { useSyncExternalStore } from "react";
import { BEZELS, BRACELETS, DIALS, FINISHES } from "../data.js";
import { SHOWCASE, getConfig, setConfig, subscribe } from "../lib/rigs.js";

/* Look of the simplified SVG illustration used when 3D is unavailable: dial colour, strap finish and metal tone only.
   Bezel style and individual bracelet links need the 3D model. */
export const fallbackLook = (c) => ({
  model: ["black", "blue", "green", "champagne", "silver", "skeleton"].includes(c.dial) ? (c.dial === "black" ? "obsidian" : c.dial) : "obsidian",
  strap: c.bracelet === "leather" ? FINISHES[c.leather]?.s : c.bracelet === "twotone" ? ["#a8873f", "#e6d3a3"] : ["#8d939b", "#e9ecef"],
});
export const useConfig = () => useSyncExternalStore(subscribe, getConfig);

/* Dial / bezel / bracelet selectors. Every click goes through setConfig(), which updates the 3D model on every canvas. */
export default function ConfigControls({ light = false, onChange }) {
  const c = useConfig(), set = (p) => { setConfig(p); onChange?.(p); };
  const ink = light ? "text-ink" : "text-ivory", mute = light ? "text-ink/55" : "text-silver/60", on = light ? "border-ink bg-ink text-paper" : "border-gold bg-gold text-ink", off = light ? "border-ink/20 text-ink/70 hover:border-ink" : "border-silver/25 text-silver hover:border-gold/60", ring = light ? "border-ink" : "border-gold";
  const Label = ({ k, v }) => <p className={`text-[11px] tracking-[0.3em] ${mute}`}>{k} <span className={`${ink} tracking-[0.15em]`}>&middot; {v}</span></p>;
  const Pill = ({ active, onClick, children }) => <button aria-pressed={active} onClick={onClick} className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.15em] transition ${active ? on : off}`}>{children}</button>;
  return (
    <div className="space-y-6">
      <div role="group" aria-label="Dial">
        <Label k="DIAL" v={DIALS.find((d) => d.id === c.dial)?.n} />
        <div className="mt-3 flex flex-wrap gap-3">
          {DIALS.map((d) => (
            <button key={d.id} aria-pressed={c.dial === d.id} aria-label={`${d.n} dial`} title={d.n} onClick={() => set({ dial: d.id })}
              className={`h-10 w-10 rounded-full border-2 p-0.5 transition ${c.dial === d.id ? ring : "border-transparent"}`}><span className="block h-full w-full rounded-full" style={{ background: d.sw, boxShadow: "inset 0 0 0 1px rgba(128,128,128,.4)" }} /></button>
          ))}
        </div>
      </div>
      <div role="group" aria-label="Bezel">
        <Label k="BEZEL" v={BEZELS.find((b) => b.id === c.bezel)?.n} />
        <div className="mt-3 flex flex-wrap gap-2">{BEZELS.map((b) => <Pill key={b.id} active={c.bezel === b.id} onClick={() => set({ bezel: b.id })}>{b.n}</Pill>)}</div>
      </div>
      <div role="group" aria-label="Bracelet">
        <Label k="BRACELET" v={BRACELETS.find((b) => b.id === c.bracelet)?.n} />
        <div className="mt-3 flex flex-wrap gap-2">{BRACELETS.map((b) => <Pill key={b.id} active={c.bracelet === b.id} onClick={() => set({ bracelet: b.id })}>{b.n}</Pill>)}</div>
        {c.bracelet === "leather" && (
          <div role="group" aria-label="Leather finish" className="mt-3 flex items-center gap-3">
            <span className={`text-[11px] tracking-[0.25em] ${mute}`}>LEATHER</span>
            {FINISHES.map((f, i) => (
              <button key={f.n} aria-pressed={c.leather === i} aria-label={f.n} title={f.n} onClick={() => set({ leather: i })}
                className={`h-6 w-6 rounded-full border-2 ${c.leather === i ? ring : "border-transparent"}`} style={{ background: `linear-gradient(135deg,${f.s[0]},${f.s[1]})`, boxShadow: "0 0 0 1px rgba(128,128,128,.4)" }} />
            ))}
          </div>
        )}
      </div>
      <button onClick={() => set({ ...SHOWCASE })} className={`text-[11px] tracking-[0.3em] underline-offset-4 hover:underline ${mute}`}>RESET</button>
    </div>
  );
}
