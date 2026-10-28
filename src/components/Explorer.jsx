import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Watch from "./Watch.jsx";
import WatchSide from "./WatchSide.jsx";
import Movement from "./Movement.jsx";
import Watch3D from "./Watch3D.jsx";
import { registerRig } from "../lib/rigs.js";

gsap.registerPlugin(ScrollTrigger);

const ring = { fill: "none", stroke: "#b8913f", strokeWidth: 1.4, strokeDasharray: "3 4" };
const PI = Math.PI;
/* v = camera for the SVG fallback (x, y, zoom s, tilt, layers). r = camera rig for the 3D watch
   (ry/rx = turn and tilt in radians, dist, look-at tx/ty/tz). tg = callout position (SVG only). */
const FEATURES = [
  { k: "Dial & Hands", h: "Quiet, legible, exact.", tag: "APPLIED MARKERS, HANDS, DATE WINDOW", tg: [200, 136], v: { s: 2.7, x: 200, y: 262 }, r: { ry: 0, rx: 0, dist: 3.6, tx: 0, ty: 0.05, tz: 0.2 },
    p: "Applied, bevelled hour markers, tapered hands set to a classic 10:10 and a date window at 3 o\u2019clock, on a sunburst dial under a domed, sapphire-style crystal.",
    fx: <><circle cx="200" cy="300" r="128" {...ring} /><circle cx="297" cy="244" r="7" {...ring} /></> },
  { k: "Fluted Bezel", h: "Sixty grooves, cut to catch light.", tag: "FLUTED BEZEL (DEMO)", tg: [296, 126], v: { s: 3.3, x: 296, y: 196 }, r: { ry: 0.35, rx: -0.3, dist: 2.2, tx: 0.55, ty: 0.6, tz: 0.3 },
    p: "A bezel machined with sixty radial flutes that break the light as the watch turns. Choose smooth or polished in the configurator. The illustrated fallback shows the case macro instead.",
    fx: <><circle cx="200" cy="300" r="156" {...ring} />{[[110, 184], [290, 184]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="22" {...ring} />)}</> },
  { k: "Side Profile & Crown", h: "A crown with grip.", tag: "CROWN (ILLUSTRATED)", tg: [336, 248], v: { s: 2.7, x: 345, y: 300, side: 1 }, r: { ry: -PI / 2, rx: -0.1, dist: 2.6, tx: 0, ty: 0, tz: 1.0 },
    p: "Seen from the side, a toothed crown sits proud of the case, with chamfered edges, bevelled lugs and the domed crystal rising above the flank.",
    fx: <><circle cx="359" cy="301" r="26" {...ring} /><path d="M359 275V256" stroke="#b8913f" strokeWidth="1" /></> },
  { k: "Bracelet Links", h: "Brushed, then polished.", tag: "BRACELET LINKS", tg: [200, 400], v: { s: 2.3, x: 200, y: 500 }, r: { ry: 0.2, rx: -0.15, dist: 4.6, tx: 0, ty: -1.9, tz: -0.4 },
    p: "Every link is modelled on its own: a brushed centre link between two polished outer links, tapering towards a folding clasp. The illustrated fallback shows the leather strap.",
    fx: <rect x="134" y="414" width="132" height="186" rx="12" {...ring} /> },
  { k: "Caseback & Movement", h: "A heartbeat you can see.", tag: "MOVEMENT, SEEN FROM THE BACK", tg: [200, 136], v: { s: 2.4, x: 200, y: 300, sm: 1 }, r: { ry: PI, rx: 0, dist: 3.4, tx: 0, ty: 0, tz: 0.2 },
    p: "Turned over, the watch shows gears, jewels, bridges and a swinging rotor through a glass caseback. The movement is an illustration of the idea, not a working mechanism.",
    fx: <circle cx="200" cy="300" r="130" {...ring} /> },
];
const N = FEATURES.length, TOTAL = N + 1.5;
const HERO_R = { ry: 0.55, rx: -0.12, dist: 7.2, tx: 0, ty: 0, tz: 0 };
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

const Tag = ({ x, y, children }) => {
  const cx = +x, cy = +y, w = children.length * 5.8 + 12;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - 9} width={w} height="15" rx="7.5" fill="#f4f2ee" opacity=".95" stroke="#b8913f" strokeWidth=".6" />
      <text x={cx} y={cy + 1.5} textAnchor="middle" fontSize="6.5" letterSpacing="1.2" fill="#6b5420" fontFamily="system-ui, sans-serif">{children}</text>
    </g>
  );
};

/* One scrubbed, pinned timeline is the single source of truth. Scroll drives the camera (the 3D rig, plus the
   SVG fallback camera); the active feature is derived from scroll progress. A selector click only scrolls to
   that feature's point, or, with reduced motion / no pin, sets the view directly. Clicks and scroll never fight. */
export default function Explorer() {
  const root = useRef(null), win = useRef(null), st = useRef(null), cur = useRef(0), instant = useRef(() => {});
  const rig = useRef({ ...HERO_R, dist: 10, auto: 0, fade: 0 }).current;
  const [active, setActive] = useState(0);

  useEffect(() => registerRig(rig, true), [rig]); // locked: the story always shows the showcase watch
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)", small: "(max-width: 767px)" },
        (c) => {
          const { reduce, small } = c.conditions;
          const k = small ? 0.72 : 1;
          const cam = (v) => { const s = Math.max(1.1, v.s * k);
            return { scale: s, xPercent: (-(v.x - 200) / 4) * s, yPercent: (-(v.y - 300) / 6) * s, rotationX: v.rx || 0, rotationY: v.ry || 0 }; };
          gsap.set(".sw, .face", { transformPerspective: 1200 });

          if (reduce) {
            instant.current = (i) => { const f = FEATURES[i], v = f.v;
              Object.assign(rig, f.r, { fade: 1, auto: 0 });
              gsap.set(".sw", cam(v)); gsap.set(".sm", { autoAlpha: v.sm ? 1 : 0 });
              gsap.set(".side", { autoAlpha: v.side ? 1 : 0, scaleY: 1 }); gsap.set(".face", { autoAlpha: v.side ? 0 : 1, rotationX: 0 });
              gsap.set(".fx", { autoAlpha: 0 }); gsap.set(`.fx-${i}`, { autoAlpha: 1 }); };
            instant.current(cur.current);
            return () => { instant.current = () => {}; };
          }

          const setBar = gsap.quickSetter(".sel-bar", "scaleY");
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: ".ex-stage", start: "top top", end: small ? "+=480%" : "+=620%", pin: true, scrub: 1,
              anticipatePin: 1, invalidateOnRefresh: true,
              onUpdate: (self) => {
                const t = self.progress * TOTAL;
                setBar(clamp((t - 1) / (N - 1), 0, 1));
                const i = clamp(Math.round(t - 1), 0, N - 1);
                if (i !== cur.current) { cur.current = i; setActive(i); }
              } },
          });
          st.current = tl.scrollTrigger;
          // Scene B: the watch emerges from darkness and settles at the hero composition
          tl.fromTo(rig, { fade: 0, dist: 10 }, { fade: 1, dist: HERO_R.dist, duration: 0.45 }, 0)
            .fromTo(".sw", { scale: 0.55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45 }, 0);
          let side = 0;
          FEATURES.forEach((f, i) => {
            const t0 = i + 0.45, v = f.v;
            tl.to(rig, { ...f.r, duration: 0.55, ease: "power1.inOut" }, t0)
              .to(".sw", { ...cam(v), duration: 0.55, ease: "power1.inOut" }, t0)
              .to(".sm", { autoAlpha: v.sm ? 1 : 0, duration: 0.3 }, t0 + 0.1);
            if (!!v.side !== !!side) {
              if (v.side) tl.to(".face", { rotationX: -78, duration: 0.3 }, t0).to(".face", { autoAlpha: 0, duration: 0.05 }, t0 + 0.3)
                .fromTo(".side", { autoAlpha: 0, scaleY: 0.3 }, { autoAlpha: 1, scaleY: 1, duration: 0.25 }, t0 + 0.3);
              else tl.to(".side", { autoAlpha: 0, scaleY: 0.3, duration: 0.25 }, t0)
                .to(".face", { autoAlpha: 1, duration: 0.05 }, t0 + 0.2).to(".face", { rotationX: 0, duration: 0.3 }, t0 + 0.25);
            }
            side = v.side || 0;
            FEATURES.forEach((_, j) => tl.to(`.fx-${j}`, { autoAlpha: j === i ? 1 : 0, duration: 0.25 }, t0 + 0.3));
          });
          // Scene I: return to the full hero composition, then a short hold before the pin releases
          tl.to(rig, { ...HERO_R, duration: 0.55, ease: "power1.inOut" }, N + 0.45)
            .to(".sw", { scale: 1, xPercent: 0, yPercent: 0, rotationX: 0, rotationY: 0, duration: 0.55, ease: "power1.inOut" }, N + 0.45)
            .to(`.fx-${N - 1}`, { autoAlpha: 0, duration: 0.25 }, N + 0.45)
            .to({}, { duration: 0.5 }, N + 1);
          // SVG fallback gears and seconds hand turn with scroll (the 3D watch animates its own)
          tl.to(".gear-a", { rotation: 540, duration: TOTAL }, 0).to(".gear-b", { rotation: -720, duration: TOTAL }, 0)
            .to(".gear-c", { rotation: 900, duration: TOTAL }, 0).to(".dgear", { rotation: 1080, duration: TOTAL }, 0)
            .to(".w-sec", { rotation: 1800, svgOrigin: "200 300", duration: TOTAL }, 0);
          return () => { st.current = null; };
        }
      );
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => { window.removeEventListener("load", refresh); ctx.revert(); };
  }, []);

  const go = (i) => {
    const s = st.current;
    if (s) window.scrollTo({ top: s.start + ((1 + i) / TOTAL) * (s.end - s.start), behavior: "smooth" });
    else { cur.current = i; setActive(i); instant.current(i); }
  };
  const f = FEATURES[active];

  return (
    <section ref={root} id="explorer" aria-label="Feature explorer" className="bg-paper text-ink">
      <div className="ex-stage grid h-svh grid-cols-1 grid-rows-[1fr_auto] pt-14 md:grid-cols-[minmax(300px,34%)_1fr] md:grid-rows-1">
        <div ref={win} data-mode="loading" className="relative order-1 overflow-hidden md:order-2 md:border-l md:border-ink/10" style={{ background: "radial-gradient(circle at 50% 45%, #fff, #e9e6df 72%)" }}>
          <div className="absolute inset-0 grid place-items-center">
            <div className="sw relative w-[min(52vw,28svh)] md:w-[min(30vw,400px)]">
              <div className="face"><Watch className="block w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.28)]" /></div>
              <div className="side invisible absolute inset-0 opacity-0"><WatchSide className="block w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.28)]" /></div>
              <div className="sm invisible absolute left-[18.5%] top-[29%] w-[63%] overflow-hidden rounded-full opacity-0"><Movement className="block w-full" /></div>
              <svg viewBox="0 0 400 600" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                {FEATURES.map((x, i) => (
                  <g key={x.k} className={`fx fx-${i} invisible opacity-0`}>{x.fx}<Tag x={x.tg[0]} y={x.tg[1]}>{x.tag}</Tag></g>
                ))}
              </svg>
            </div>
          </div>
          <Watch3D rig={rig} sway={false} onMode={(m) => win.current?.setAttribute("data-mode", m)} />
          <p className="tag3d pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-full border border-brass/50 bg-paper/90 px-4 py-1.5 text-[10px] tracking-[0.3em] text-brass" aria-hidden="true">{f.tag}</p>
        </div>

        <div className="order-2 flex flex-col justify-center gap-4 px-6 pb-5 pt-3 md:order-1 md:gap-8 md:px-[3vw] md:py-8">
          <div className="relative">
            <span className="absolute bottom-0 left-0 top-0 hidden w-px bg-ink/10 md:block"><span className="sel-bar block h-full w-px origin-top scale-y-0 bg-brass" /></span>
            <div role="group" aria-label="Watch features" className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0">
              {FEATURES.map((x, i) => (
                <button key={x.k} onClick={() => go(i)} aria-pressed={i === active}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs transition md:rounded-none md:border-0 md:border-b md:border-ink/10 md:py-3.5 md:pl-6 md:text-left md:text-base ${i === active ? "border-ink bg-ink text-paper md:bg-transparent md:font-medium md:text-ink" : "border-ink/20 text-ink/60 hover:text-ink md:border-ink/10"}`}>
                  <span className="mr-3 hidden font-display text-brass md:inline">0{i + 1}</span>{x.k}
                </button>
              ))}
            </div>
          </div>
          <div key={active} className="fade-in min-h-[13.5rem] md:min-h-0" aria-live="polite">
            <p className="text-[11px] tracking-[0.4em] text-brass">0{active + 1} / 0{N}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight md:mt-3 md:text-5xl">{f.h}</h2>
            <p className="mt-2 min-h-[4.2rem] text-sm leading-relaxed text-ink/70 md:mt-4 md:text-base">{f.p}</p>
          </div>
          <p className="hidden text-[11px] text-ink/45 md:block">Concept specifications are illustrative demo content, not verified product data.</p>
        </div>
      </div>
    </section>
  );
}
