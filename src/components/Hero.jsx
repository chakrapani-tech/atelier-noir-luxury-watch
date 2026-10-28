import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Watch from "./Watch.jsx";
import Watch3D from "./Watch3D.jsx";
import { heroRig } from "../lib/rigs.js";
import Magnetic from "./Magnetic.jsx";

const stats = [
  { v: 42, unit: "h", text: "Power reserve" },
  { v: 28800, unit: "vph", text: "Beat frequency" },
  { v: 100, unit: "m", text: "Water resistance" },
  { v: 21, unit: "j", text: "Jewels" },
];

export default function Hero({ onOpen }) {
  const ref = useRef(null), wref = useRef(null);
  // Hero rig (shared module object): slow automatic 360-degree turn, three-quarter start angle
  const rig = heroRig, [spinning, setSpinning] = useState(true);
  const toggleSpin = () => { if (spinning) { rig.ry = rig.angle; rig.auto = 0; } else rig.auto = 1; setSpinning(!spinning); };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".h-brand", { autoAlpha: 0, y: 20, duration: 0.9 })
          .from(".h-welcome", { autoAlpha: 0, y: 14, duration: 1.4 }, 0.15)
          .from(".h-line", { yPercent: 110, duration: 1.1, stagger: 0.14 }, 0.5)
          .from(".h-in", { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.12 }, 1.0)
          .from(".h-watch", { autoAlpha: 0, scale: 0.9, y: 50, duration: 1.8 }, 0.4)
          .from(".h-stat", { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.14 }, 1.5)
          .from(".h-cue", { autoAlpha: 0, duration: 1 }, 2.0);
        gsap.utils.toArray(".h-num").forEach((el) => {
          const o = { v: 0 };
          gsap.to(o, { v: +el.dataset.v, duration: 2.2, delay: 1.6, ease: "power2.out",
            onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-US")) });
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="top" className="relative grid min-h-screen items-center overflow-hidden px-6 pb-28 pt-28 md:grid-cols-[1fr_1.05fr] md:px-[7vw]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 70% at 72% 50%, rgba(200,169,106,.16), transparent 62%), radial-gradient(ellipse 40% 50% at 72% 45%, rgba(201,204,209,.12), transparent 70%)" }} />
      <div className="sweep pointer-events-none absolute -top-10 bottom-0 left-0 hidden w-40 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent md:block" aria-hidden="true" />
      <div className="relative z-10">
        <p className="h-welcome whitespace-nowrap text-[13px] tracking-[0.18em] text-ivory sm:text-base md:text-xl" aria-label="Welcome Itzfizz">W E L C O M E&nbsp; I T Z F I Z Z</p>
        <p className="h-brand mt-6 flex items-center gap-4 text-xs tracking-[0.45em] text-gold"><span className="h-px w-10 bg-gold" />ATELIER NOIR</p>
        <h1 className="mt-4 font-display text-[clamp(3.6rem,9vw,8rem)] leading-[0.92]">
          <span className="block overflow-hidden"><span className="h-line block">TIME,</span></span>
          <span className="block overflow-hidden pb-2"><span className="h-line block text-gold">REFINED.</span></span>
        </h1>
        <p className="h-in mt-6 max-w-md leading-relaxed text-silver/80">
          A mechanical soul. An enduring expression of precision.
        </p>
        <div className="h-in mt-8"><Magnetic><button onClick={onOpen} className="inline-block rounded-full bg-gold px-8 py-3 text-xs tracking-[0.3em] text-ink transition hover:bg-ivory">EXPLORE WATCH</button></Magnetic></div>
        <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.text} className="h-stat border-t border-gold/30 pt-3">
              <dt className="sr-only">{s.text}</dt>
              <dd className="font-display text-3xl md:text-4xl">
                <span className="h-num" data-v={s.v}>{s.v.toLocaleString("en-US")}</span><span className="ml-1 text-sm text-gold">{s.unit}</span>
                <span className="mt-1 block font-sans text-[11px] text-silver/70">{s.text}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[10px] text-silver/50">Metrics are illustrative demo values for a fictional watch, not verified product claims.</p>
      </div>
      <div className="relative mx-auto mt-10 w-[min(64vw,320px)] md:mt-0 md:w-[min(40vw,540px)]">
        <div ref={wref} data-mode="loading" className="h-watch idle relative w-full" style={{ WebkitMaskImage: "linear-gradient(#000 78%, transparent)", maskImage: "linear-gradient(#000 78%, transparent)" }}>
          <Watch className="svgwatch block w-full drop-shadow-[0_40px_70px_rgba(0,0,0,.85)]" />
          <Watch3D rig={rig} onMode={(m) => wref.current?.setAttribute("data-mode", m)} />
          <button onClick={onOpen} aria-label="Open the interactive 3D product viewer" className="absolute inset-0 z-10 cursor-pointer" />
        </div>
        <div className="relative z-20 mt-1 flex items-center justify-center gap-3 text-[11px] tracking-[0.2em]">
          <button onClick={toggleSpin} aria-pressed={!spinning} className="rounded-full border border-silver/25 px-4 py-2 text-silver transition hover:border-gold/60">{spinning ? "PAUSE ROTATION" : "RESUME ROTATION"}</button>
        </div>
      </div>
      <a href="#explorer" className="h-cue absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] tracking-[0.4em] text-silver/70">
        SCROLL TO DISCOVER<span className="cue-line h-8 w-px bg-gold" />
      </a>
    </section>
  );
}
