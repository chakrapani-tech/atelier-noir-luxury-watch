import { useEffect, useState } from "react";
import Magnetic from "./Magnetic.jsx";

export const NAV = [["Overview", "#top"], ["Configure", "#configure"], ["Collection", "#collection"], ["Movement", "#movement"], ["Craftsmanship", "#craft"], ["Compare", "#compare"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6 md:px-[4vw]">
        <a href="#top" className="text-sm tracking-[0.4em] text-ivory">ATELIER NOIR</a>
        <nav aria-label="Primary" className="hidden gap-9 text-[11px] tracking-[0.25em] text-silver xl:flex">
          {NAV.map(([n, h]) => <a key={n} href={h} className="u transition-colors hover:text-ivory">{n.toUpperCase()}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <Magnetic><a href="#explorer" className="inline-block rounded-full bg-gold px-5 py-2 text-[11px] tracking-[0.25em] text-ink transition hover:bg-ivory">EXPLORE</a></Magnetic>
          <button className="grid h-10 w-10 place-items-center xl:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <span className="relative block h-3 w-5"><span className={`absolute left-0 h-px w-5 bg-ivory transition ${open ? "top-1.5 rotate-45" : "top-0"}`} /><span className={`absolute left-0 h-px w-5 bg-ivory transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} /></span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="grid border-t border-white/10 bg-ink px-6 py-3 xl:hidden">
          {NAV.map(([n, h]) => <a key={n} href={h} onClick={() => setOpen(false)} className="border-b border-white/5 py-4 text-xs tracking-[0.3em] text-ivory last:border-0">{n.toUpperCase()}</a>)}
        </nav>
      )}
    </header>
  );
}
