import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* Subtle magnetic pull toward the pointer. Hover devices with motion allowed only. */
export default function Magnetic({ children, strength = 0.28 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      const move = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * strength);
        yTo((e.clientY - r.top - r.height / 2) * strength);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });
    return () => mm.revert();
  }, [strength]);
  return <span ref={ref} className="inline-block">{children}</span>;
}
