import Watch from "./Watch.jsx";
import Movement from "./Movement.jsx";

/* Crop: frames a point (x, y) of a 400-wide artwork at a given zoom inside a square window. */
const Crop = ({ Art, x, y, zoom, round, overlay, ...props }) => (
  <div className={`reveal relative mx-auto aspect-square w-full max-w-md overflow-hidden border border-gold/40 ${round ? "rounded-full" : ""}`}>
    <div className="absolute" style={{ width: `${zoom * 100}%`, left: `calc(50% - ${(x / 400) * zoom * 100}%)`, top: `calc(50% - ${(y / 400) * zoom * 100}%)` }}>
      <Art className="block w-full" {...props} />
    </div>
    {overlay && <div className="absolute inset-0" style={{ background: overlay }} aria-hidden="true" />}
  </div>
);

const chapters = [
  { id: "movement", k: "THE MECHANICAL MOVEMENT", t: "A small machine, in full view.", dark: true,
    p: "The fictional Calibre 01 pairs an automatic rotor with bridges and jewelled pivots. This illustration shows the idea of an open-heart view, not a real caliber.",
    v: <div className="idle reveal mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border border-gold/30"><Movement className="block w-full" /></div> },
  { id: "case", k: "PRECISION CASE FINISHING", t: "Brushed, then polished, then judged by eye.", dark: false,
    p: "Alternating brushed flanks and polished bevels give the case its edge. Each transition is imagined as a hand-checked line.",
    v: <Crop Art={Watch} x={282} y={218} zoom={2.5} model="champagne" /> },
  { id: "crystal", k: "SAPPHIRE-INSPIRED CRYSTAL", t: "Glass that disappears, until the light moves.", dark: true,
    p: "A domed crystal, drawn here with soft reflections and a rim highlight, keeps the dial clear and the glare controlled.",
    v: <Crop Art={Watch} x={200} y={300} zoom={2.1} round model="obsidian" overlay="linear-gradient(118deg, rgba(255,255,255,.26) 0%, rgba(255,255,255,.06) 34%, rgba(255,255,255,0) 36%), radial-gradient(circle at 70% 78%, rgba(255,255,255,.1), transparent 40%)" /> },
  { id: "strap", k: "PREMIUM STRAP MATERIALS", t: "Calfskin that softens with wear.", dark: false,
    p: "Tonal stitching, punched holes and a polished keeper, imagined in black, cognac or slate calfskin.",
    v: <Crop Art={Watch} x={200} y={500} zoom={2.2} model="champagne" /> },
  { id: "assembly", k: "THE ART OF ASSEMBLY", t: "Hundreds of parts. One quiet sound.", dark: true,
    p: "In this story the watch is assembled slowly, part by part, regulated and then worn in. A narrative device for the design study, not a manufacturing claim.",
    v: <div className="idle reveal mx-auto aspect-square w-full max-w-md overflow-hidden border border-gold/30"><div className="w-[200%] -translate-x-[18%] -translate-y-[20%]"><Movement className="block w-full" /></div></div> },
];

export function Craft() {
  return (
    <div id="craft">
      {chapters.map((c, i) => (
        <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className={`px-6 py-24 md:px-[4vw] md:py-36 ${c.dark ? "bg-ink text-ivory" : "bg-paper text-ink"}`}>
          <div className={`mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="reveal">
              <p className={`flex items-center gap-4 text-xs tracking-[0.4em] ${c.dark ? "text-gold" : "text-brass"}`}><span className="font-display text-3xl tracking-normal">0{i + 1}</span><span className={`h-px w-10 ${c.dark ? "bg-gold" : "bg-brass"}`} />{c.k}</p>
              <h2 id={`${c.id}-h`} className="mt-5 font-display text-4xl leading-[1.02] md:text-6xl">{c.t}</h2>
              <p className={`mt-5 max-w-md leading-relaxed ${c.dark ? "text-silver/80" : "text-ink/65"}`}>{c.p}</p>
            </div>
            {c.v}
          </div>
        </section>
      ))}
    </div>
  );
}

export function Footer() {
  const links = [["Overview", "#top"], ["Explorer", "#explorer"], ["Collection", "#collection"], ["Craftsmanship", "#craft"], ["Compare", "#compare"]];
  return (
    <footer className="border-t border-silver/10 bg-ink px-6 py-12 md:px-[4vw]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <p className="tracking-[0.4em] text-gold">ATELIER NOIR</p>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-silver/60">Fictional brand and products, created for an Itzfizz Digital internship assignment. Not affiliated with Apple.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-6 text-xs tracking-[0.2em] text-silver">
          {links.map(([n, h]) => <a key={n} href={h} className="u">{n.toUpperCase()}</a>)}
          <a href="#top" className="u">BACK TO TOP</a>
        </nav>
      </div>
    </footer>
  );
}
