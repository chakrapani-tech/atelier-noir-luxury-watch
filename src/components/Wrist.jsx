import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Watch from "./Watch.jsx";

gsap.registerPlugin(ScrollTrigger);
// Found at build time: no runtime probing, no 404. Empty when the photo is not installed.
const found = import.meta.glob("../assets/media/wrist.{jpg,jpeg,png,webp}", { eager: true, query: "?url", import: "default" });
const SRC = Object.values(found)[0] || null;

/* "On the wrist": shows src/assets/media/wrist.jpg when it exists and loads. Otherwise an intentional editorial
   panel with a clearly captioned studio render. No illustration is composited onto a hand and nothing implies a photo. */
export default function Wrist() {
  const root = useRef(null), [bad, setBad] = useState(false), photo = !!SRC && !bad;
  useLayoutEffect(() => {
    if (!photo) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".wr-img", { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, [photo]);

  return (
    <section ref={root} id="wrist" aria-labelledby="wr-h" className="bg-paper px-6 py-24 text-ink md:px-[4vw] md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.15fr]">
        <div className="reveal">
          <p className="flex items-center gap-4 text-xs tracking-[0.4em] text-brass"><span className="h-px w-10 bg-brass" />ON THE WRIST</p>
          <h2 id="wr-h" className="mt-4 font-display text-4xl leading-[1.02] md:text-6xl">Made to be worn.</h2>
          <p className="mt-5 max-w-md leading-relaxed text-ink/70">A watch is finished when it sits quietly under a cuff and still catches the light when the sleeve moves. The campaign portrait for Calibre 01 belongs here.</p>
          {!photo && import.meta.env.DEV && <p className="mt-6 text-xs text-ink/45">Dev note: drop a licensed landscape photo at <code>src/assets/media/wrist.jpg</code> and this panel will use it.</p>}
        </div>
        <figure className="reveal relative aspect-[4/5] overflow-hidden border border-ink/15 bg-char md:aspect-[5/4]">
          {photo ? (
            <img className="wr-img h-full w-full object-cover" src={SRC} onError={() => setBad(true)} alt="A man wearing the Atelier Noir watch, dark tailored sleeve" />
          ) : (
            <>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 45%, #2b2c30, #141416 62%, #0b0b0c)" }} />
              <div className="absolute inset-0 grid place-items-center"><Watch className="h-[88%] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,.7)]" label="Studio render of the Atelier Noir watch" /></div>
              <figcaption className="absolute bottom-4 left-5 text-[11px] tracking-[0.3em] text-silver/55">STUDIO RENDER</figcaption>
            </>
          )}
        </figure>
      </div>
    </section>
  );
}
