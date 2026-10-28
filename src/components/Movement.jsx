import { useId } from "react";

/* Gear drawn with a dashed stroke for teeth. Shared by the dial aperture and the open-heart view. */
export function Gear({ cx, cy, r, teeth, className, w = 14 }) {
  const t = (2 * Math.PI * r) / (teeth * 2);
  const inner = r - w * 0.64;
  return (
    <g className={className}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#b8975a" strokeWidth={w} strokeDasharray={`${t} ${t}`} />
      <circle cx={cx} cy={cy} r={inner} fill="#17171a" stroke="#e6d3a3" strokeOpacity=".55" strokeWidth={w / 14} />
      {r > 30 && [0, 60, 120].map((a) => (
        <rect key={a} x={cx - 2} y={cy - inner} width="4" height={inner * 2} fill="#b8975a" transform={`rotate(${a} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={Math.max(2.5, w / 3)} fill="#d8dce0" />
    </g>
  );
}

const jewels = [[150, 170], [262, 232], [210, 320], [285, 110]];

/* Open-heart movement: bridge, counter-rotating gears at distinct speeds, balance wheel, rubies. */
export default function Movement({ className = "" }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Illustrated open-heart view of the mechanical movement">
      <defs>
        <radialGradient id={`p${u}`} cx=".35" cy=".3" r=".9"><stop offset="0" stopColor="#4a4b50" /><stop offset="1" stopColor="#0c0c0e" /></radialGradient>
        <linearGradient id={`b${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#eceef1" /><stop offset=".5" stopColor="#8d939b" /><stop offset="1" stopColor="#c9ccd1" /></linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#p${u})`} />
      {Array.from({ length: 40 }, (_, i) => (<line key={i} x1="0" y1={i * 10} x2="400" y2={i * 10 + 40} stroke="#fff" strokeOpacity=".04" />))}
      {[[150, 170, 70], [262, 232, 52], [210, 320, 34]].map(([x, y, r]) => (<circle key={x} cx={x + 4} cy={y + 5} r={r + 8} fill="#000" opacity=".38" />))}
      <Gear cx="150" cy="170" r="70" teeth="28" className="gear-a" />
      <Gear cx="262" cy="232" r="52" teeth="21" className="gear-b" />
      <Gear cx="210" cy="320" r="34" teeth="14" className="gear-c" w="10" />
      <g className="gear-c">
        <circle cx="285" cy="110" r="38" fill="none" stroke="#c9ccd1" strokeWidth="3" strokeDasharray="60 12" />
        <path d="M285 110m-4 0a4 4 0 1 1 8 0a8 8 0 1 1-16 0a12 12 0 1 1 24 0a16 16 0 1 1-32 0a20 20 0 1 1 40 0" fill="none" stroke="#e6d3a3" strokeOpacity=".8" />
      </g>
      <path d="M30 70Q190 -5 372 96L346 150Q196 86 56 128Z" fill={`url(#b${u})`} opacity=".92" />
      <path d="M30 70Q190 -5 372 96" fill="none" stroke="#fff" strokeOpacity=".7" />
      {[[70, 98], [190, 62], [330, 118]].map(([x, y]) => (<g key={x}><circle cx={x} cy={y} r="6" fill="#3a3d42" /><path d={`M${x - 4} ${y}H${x + 4}`} stroke="#c9ccd1" strokeWidth="1.4" /></g>))}
      {jewels.map(([x, y]) => (
        <g key={x}><circle cx={x} cy={y} r="9" fill="#c8a96a" /><circle cx={x} cy={y} r="5" fill="#a3122a" /><circle cx={x - 1.5} cy={y - 1.5} r="1.6" fill="#fff" opacity=".7" /></g>
      ))}
    </svg>
  );
}
