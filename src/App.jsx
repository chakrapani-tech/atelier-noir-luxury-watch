import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Explorer from "./components/Explorer.jsx";
import Configurator from "./components/Configurator.jsx";
import Viewer from "./components/Viewer.jsx";
import Wrist from "./components/Wrist.jsx";
import Collection from "./components/Collection.jsx";
import Compare from "./components/Compare.jsx";
import { Craft, Footer } from "./components/Sections.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const viewer = useRef(null);
  const openViewer = (id, fin) => viewer.current?.open(id, fin);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll progress bar: written straight to the DOM, no React state
      const setX = gsap.quickSetter(".progress", "scaleX");
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => setX(s.progress) });
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".reveal", { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(".reveal", {
          start: "top 88%", once: true,
          onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out", overwrite: true }),
        });
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => { window.removeEventListener("load", refresh); ctx.revert(); };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
      <Header />
      <main id="main">
        <Hero onOpen={() => openViewer()} />
        <Explorer />
        <Configurator onOpen={() => openViewer()} />
        <Wrist />
        <Collection onOpen={openViewer} />
        <Compare />
        <Craft />
      </main>
      <Footer />
      <Viewer ref={viewer} />
    </>
  );
}
