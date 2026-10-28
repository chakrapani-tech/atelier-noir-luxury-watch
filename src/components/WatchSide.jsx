import { useId } from "react";
import { MODELS } from "./Watch.jsx";

/* Side profile (viewed from 3 o'clock): domed sapphire, case flank, caseback, knurled crown, curved strap.
   Shares the 400x600 viewBox with <Watch /> so the two cross-fade when the case is tilted edge-on. */
export default function WatchSide({ className = "", model = "obsidian", strap }) {
  const t = MODELS[model] || MODELS.obsidian;
  const st = strap || t.s;
  const u = useId().replace(/:/g, "");
  const f = (n) => `url(#${n}${u})`;
  return (
    <svg viewBox="0 0 400 600" className={className} role="img" aria-label="Atelier Noir watch, side profile with crown">
      <defs>
        <linearGradient id={`m${u}`} x1="0" y1="0" x2="0" y2="1">{t.c.map((c, i) => <stop key={i} offset={[0, 0.18, 0.5, 0.85, 1][i]} stopColor={c} />)}</linearGradient>
        <linearGradient id={`l${u}`} x1="0" x2="1"><stop offset="0" stopColor={st[0]} /><stop offset=".5" stopColor={st[1]} /><stop offset="1" stopColor={st[0]} /></linearGradient>
        <linearGradient id={`k${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9eaf2" stopOpacity=".5" /><stop offset="1" stopColor="#1a2a33" stopOpacity=".7" /></linearGradient>
        <linearGradient id={`o${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e6d3a3" /><stop offset="1" stopColor="#a8873f" /></linearGradient>
      </defs>
      <path d="M54 322C22 362 14 450 24 570H72C68 460 80 390 98 340Z" fill={f("l")} />
      <path d="M346 322C378 362 386 450 376 570H328C332 460 320 390 302 340Z" fill={f("l")} />
      <path d="M40 330C52 410 60 470 52 560M360 330C348 410 340 470 348 560" stroke="#c8a96a" strokeOpacity=".4" strokeDasharray="6 5" fill="none" />
      <rect x="38" y="316" width="40" height="34" rx="12" fill={f("m")} /><rect x="322" y="316" width="40" height="34" rx="12" fill={f("m")} />
      <path d="M84 330C104 358 296 358 316 330Z" fill="#6a6f77" /><path d="M96 338C130 352 270 352 304 338" stroke="#fff" strokeOpacity=".35" fill="none" />
      <rect x="56" y="270" width="288" height="62" rx="14" fill={f("m")} />
      <rect x="56" y="270" width="288" height="7" rx="3" fill="#fff" opacity=".55" />
      <path d="M62 301H338" stroke="#000" strokeOpacity=".12" /><path d="M62 305H338" stroke="#fff" strokeOpacity=".25" />
      <path d="M68 270Q200 232 332 270Z" fill={f("k")} /><path d="M96 262Q190 240 270 252" stroke="#fff" strokeOpacity=".7" strokeWidth="2" fill="none" />
      <path d="M68 270H332" stroke={f("o")} strokeWidth="2" />
      <rect x="344" y="284" width="30" height="34" rx="6" fill={f("m")} />
      {[0, 1, 2, 3, 4, 5].map((i) => (<path key={i} d={`M${350 + i * 4} 286V316`} stroke="#2a2d31" strokeOpacity=".6" />))}
      <rect x="370" y="290" width="4" height="22" rx="2" fill={f("o")} />
    </svg>
  );
}
