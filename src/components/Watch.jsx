import { useId } from "react";
import { Gear } from "./Movement.jsx";

export const MODELS = {
  obsidian: { name: "NOIR OBSIDIAN", d0: "#3a3b41", d1: "#09090b", ink: "#f3ecdc", g0: "#e6d3a3", g1: "#a8873f",
    c: ["#8a8e95", "#2c2f34", "#9aa0a7", "#1c1e22", "#60646b"], s: ["#0b0b0c", "#2a2623"] },
  champagne: { name: "NOIR CHAMPAGNE", d0: "#f3e7c4", d1: "#b89a52", ink: "#2a2316", g0: "#a98a42", g1: "#6f5522",
    c: ["#fafbfc", "#8d939b", "#e9ecef", "#6a6f77", "#c9ccd1"], s: ["#3a2012", "#7a4a28"] },
  blue: { name: "Blue dial", d0: "#2a62ad", d1: "#0b2550", ink: "#f3ecdc", g0: "#eaeef2", g1: "#aeb6c0", c: ["#8a8e95", "#2c2f34", "#9aa0a7", "#1c1e22", "#60646b"], s: ["#0b0b0c", "#2a2623"] },
  green: { name: "Green dial", d0: "#2c7e55", d1: "#0a3524", ink: "#f3ecdc", g0: "#e6d3a3", g1: "#a8873f", c: ["#8a8e95", "#2c2f34", "#9aa0a7", "#1c1e22", "#60646b"], s: ["#0b0b0c", "#2a2623"] },
  silver: { name: "Silver dial", d0: "#f1f2f4", d1: "#aeb3ba", ink: "#23262b", g0: "#4a4d52", g1: "#23262b", c: ["#fafbfc", "#8d939b", "#e9ecef", "#6a6f77", "#c9ccd1"], s: ["#0b0b0c", "#2a2623"] },
  skeleton: { name: "NOIR SKELETON", d0: "#1f2024", d1: "#050506", ink: "#f3ecdc", g0: "#e6d3a3", g1: "#a8873f", skel: true,
    c: ["#e4e7eb", "#6c7178", "#c9cdd2", "#3e4247", "#9aa0a8"], s: ["#0b0b0c", "#26282b"] },
};
const mins = Array.from({ length: 60 }, (_, i) => i);
const hrs = Array.from({ length: 12 }, (_, i) => i).filter((i) => i !== 6);
const rays = Array.from({ length: 90 }, (_, i) => i);

function Hand({ top, w, cls, rot, fill, edge }) {
  const d = `M200 ${top}L${200 + w} 297L200 307L${200 - w} 297Z`;
  return (
    <g className={cls} transform={`rotate(${rot} 200 300)`}>
      <path d={d} fill="#000" opacity=".32" transform="translate(2.5 4)" />
      <path d={d} fill={fill} stroke={edge} strokeWidth=".8" />
      <path d={`M200 ${top}L${200 + w} 297L200 307Z`} fill="#000" opacity=".2" />
    </g>
  );
}

/* Layered SVG watch (original artwork). Hands are classed (w-hour / w-min / w-sec), gears are classed (dgear). */
export default function Watch({ className = "", model = "obsidian", strap, label = "Atelier Noir mechanical watch, front view" }) {
  const u = useId().replace(/:/g, "");
  const t = MODELS[model] || MODELS.obsidian;
  const st = strap || t.s;
  const f = (n) => `url(#${n}${u})`;
  return (
    <svg viewBox="0 0 400 600" className={className} role="img" aria-label={label}>
      <defs>
        <linearGradient id={`c${u}`} x1="0" y1="0" x2="1" y2="1">{t.c.map((c, i) => <stop key={i} offset={[0, 0.3, 0.55, 0.8, 1][i]} stopColor={c} />)}</linearGradient>
        <linearGradient id={`v${u}`} x1="1" y1="1" x2="0" y2="0"><stop offset="0" stopColor={t.c[0]} /><stop offset=".5" stopColor={t.c[3]} /><stop offset="1" stopColor={t.c[2]} /></linearGradient>
        <radialGradient id={`d${u}`} cx=".38" cy=".32" r=".85"><stop offset="0" stopColor={t.d0} /><stop offset="1" stopColor={t.d1} /></radialGradient>
        <linearGradient id={`s${u}`} x1="0" x2="1"><stop offset="0" stopColor={st[0]} /><stop offset=".5" stopColor={st[1]} /><stop offset="1" stopColor={st[0]} /></linearGradient>
        <linearGradient id={`f${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity=".7" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
        <linearGradient id={`g${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={t.g0} /><stop offset="1" stopColor={t.g1} /></linearGradient>
        <linearGradient id={`r${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".28" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <clipPath id={`a${u}`}><circle cx="200" cy="366" r="22" /></clipPath>
        <clipPath id={`k${u}`}><circle cx="200" cy="300" r="126" /></clipPath>
      </defs>
      {/* strap with stitching, keepers and holes */}
      {[0, 410].map((y) => (
        <g key={y}>
          <rect x="140" y={y} width="120" height="190" rx="16" fill={f("s")} />
          <path d={`M153 ${y}V${y + 190}M247 ${y}V${y + 190}`} stroke={t.g0} strokeOpacity=".45" strokeDasharray="6 5" fill="none" />
        </g>
      ))}
      {[470, 500, 530].map((y) => (<circle key={y} cx="200" cy={y} r="4" fill="#000" opacity=".7" />))}
      <rect x="138" y="538" width="124" height="14" rx="4" fill={f("c")} /><rect x="138" y="578" width="124" height="22" rx="6" fill={f("c")} /><path d="M146 586H254" stroke="#fff" strokeOpacity=".6" />
      <rect x="140" y="130" width="120" height="50" fill={f("f")} /><rect x="140" y="420" width="120" height="50" fill={f("f")} transform="rotate(180 200 445)" />
      {/* lugs */}
      {[[-18, 131, 185], [18, 269, 185], [18, 131, 415], [-18, 269, 415]].map(([r, x, y]) => (
        <rect key={`${x}${y}`} x={x - 13} y={y - 35} width="26" height="70" rx="10" fill={f("c")} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      {/* crown, knurled */}
      <rect x="344" y="285" width="30" height="30" rx="6" fill={f("c")} />
      {[0, 1, 2, 3, 4, 5].map((i) => (<path key={i} d={`M${350 + i * 4} 287V313`} stroke="#2a2d31" strokeOpacity=".55" />))}
      <rect x="370" y="290" width="4" height="20" rx="2" fill={f("g")} />
      {/* case, brushed rings, polished bevel */}
      <circle cx="200" cy="300" r="152" fill={f("c")} />
      {[141, 144, 147, 150].map((r) => (<circle key={r} cx="200" cy="300" r={r} fill="none" stroke="#fff" strokeOpacity=".07" />))}
      <circle cx="200" cy="300" r="146" fill="none" stroke={f("v")} strokeWidth="3" opacity=".8" />
      <circle cx="200" cy="300" r="139" fill="#0d0d0f" />
      <circle cx="200" cy="300" r="136" fill="none" stroke={f("g")} strokeWidth="1.4" />
      {/* dial */}
      <circle cx="200" cy="300" r="126" fill={f("d")} />
      {t.skel && (
        <g clipPath={f("k")}>
          <circle cx="200" cy="300" r="126" fill="#050506" />
          <Gear cx="160" cy="282" r="50" teeth="22" className="dgear" w="9" />
          <Gear cx="246" cy="332" r="36" teeth="16" className="dgear" w="8" />
          <circle cx="238" cy="232" r="24" fill="none" stroke="#c9ccd1" strokeWidth="2.5" strokeDasharray="30 8" className="dgear" />
        </g>
      )}
      {!t.skel && rays.map((i) => (<line key={i} x1="200" y1="192" x2="200" y2="174" stroke={t.ink} strokeOpacity=".06" transform={`rotate(${i * 4} 200 300)`} />))}
      {mins.map((i) => (<line key={i} x1="200" y1="176" x2="200" y2={i % 5 ? 180 : 184} stroke={t.ink} strokeOpacity=".5" transform={`rotate(${i * 6} 200 300)`} />))}
      {hrs.map((i) => (
        <g key={i} transform={`rotate(${i * 30} 200 300)`}>
          <rect x={i % 3 ? 198.5 : 197.5} y="189" width={i % 3 ? 3 : 5} height={i % 3 ? 14 : 20} fill={f("g")} />
          <rect x="199.6" y="191" width=".9" height={i % 3 ? 10 : 16} fill="#fff" opacity=".55" />
        </g>
      ))}
      <g transform="rotate(180 200 300)"><rect x="196" y="189" width="3" height="16" fill={f("g")} /><rect x="201" y="189" width="3" height="16" fill={f("g")} /></g>
      <text x="200" y="250" textAnchor="middle" fontSize="10" letterSpacing="4" fill={t.ink} fontFamily="Georgia, serif">ATELIER NOIR</text>
      <path d="M184 257H216" stroke={f("g")} />
      <text x="200" y="338" textAnchor="middle" fontSize="6" letterSpacing="3" fill={t.ink} opacity=".7" fontFamily="sans-serif">AUTOMATIC</text>
      {/* open-heart aperture with live gears (closed-dial models) */}
      {!t.skel && <><circle cx="200" cy="366" r="24" fill={f("g")} />
      <g clipPath={f("a")}>
        <circle cx="200" cy="366" r="22" fill="#08080a" />
        <Gear cx="196" cy="366" r="14" teeth="12" className="dgear" w="5" />
        <Gear cx="214" cy="372" r="8" teeth="8" className="dgear" w="3.5" />
      </g>
      <circle cx="200" cy="366" r="22" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="2" /></>}
      {/* hands at 10:10 */}
      <Hand top={236} w={7} cls="w-hour" rot={305} fill={t.ink} edge={t.g1} />
      <Hand top={188} w={5.5} cls="w-min" rot={60} fill={t.ink} edge={t.g1} />
      <g className="w-sec"><rect x="199.2" y="182" width="1.6" height="140" fill={f("g")} /><circle cx="200" cy="318" r="5" fill={f("g")} /><circle cx="200" cy="300" r="4.5" fill={f("g")} /></g>
      <circle cx="200" cy="300" r="1.8" fill="#0b0b0c" />
      {/* sapphire reflections */}
      <path d="M78 235A126 126 0 0 1 248 176L200 300Z" fill={f("r")} />
      <path d="M96 392A126 126 0 0 0 240 424L200 300Z" fill="#fff" opacity=".035" />
      <circle cx="200" cy="300" r="126" fill="none" stroke="#fff" strokeOpacity=".12" />
    </svg>
  );
}
