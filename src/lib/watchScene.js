/* Procedural Three.js watch. THREE is passed in (dynamic import), so this file is lazy-loaded with it.
   `rig` is a plain object the caller mutates: ry/rx/dist/tx/ty/tz (camera), auto (spin weight), explode (0..1),
   labels (bool), suspend, fade, and the configuration: dial, bezel, bracelet, leather (index), caseTone.
   The scene writes rig.angle each frame. */
export const SPEED = (Math.PI * 2) / 24; // one full turn every 24 s
const STEEL = 0xd6d9de, GOLD = 0xd4b06a, DARK = 0x3a3d43;
const LEATHER = ["#141416", "#6a4327", "#3c4047"]; // keep in sync with FINISHES in data.js
export const DIAL = {
  black: { bg: ["#34353b", "#08080a"], ink: "#f3ecdc", marker: 0xe0cd9c, hand: 0xe9e6dc },
  blue: { bg: ["#2a62ad", "#0b2550"], ink: "#f3ecdc", marker: 0xeaeef2, hand: 0xeaeef2 },
  green: { bg: ["#2c7e55", "#0a3524"], ink: "#f3ecdc", marker: 0xe6d3a3, hand: 0xe6d3a3 },
  champagne: { light: true, bg: ["#f4e8c6", "#bb9d56"], ink: "#2b2417", marker: 0x7a5f26, hand: 0x4a3a18 },
  silver: { light: true, bg: ["#f1f2f4", "#aeb3ba"], ink: "#23262b", marker: 0x2d3035, hand: 0x2d3035 },
  skeleton: { skel: true, bg: ["#202125", "#0a0a0c"], ink: "#f3ecdc", marker: 0xe0cd9c, hand: 0xe9e6dc },
};
const canvas2d = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

function dialCanvas(D) {
  const S = 1024, c = canvas2d(S, S), g = c.getContext("2d");
  if (!D.skel) { const rg = g.createRadialGradient(S * 0.4, S * 0.35, 0, S / 2, S / 2, S * 0.62); rg.addColorStop(0, D.bg[0]); rg.addColorStop(1, D.bg[1]); g.fillStyle = rg; g.fillRect(0, 0, S, S); }
  g.translate(S / 2, S / 2);
  if (D.skel) { g.beginPath(); g.arc(0, 0, S * 0.5, 0, Math.PI * 2); g.arc(0, 0, S * 0.36, 0, Math.PI * 2, true); g.fillStyle = D.bg[0]; g.fill("evenodd"); }
  g.strokeStyle = D.light ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.05)"; g.lineWidth = 2;
  for (let i = 0; i < 180; i++) { g.rotate(Math.PI / 90); g.beginPath(); g.moveTo(0, -(D.skel ? S * 0.36 : 70)); g.lineTo(0, -S * 0.5); g.stroke(); }
  g.strokeStyle = D.ink; g.globalAlpha = 0.55;
  for (let i = 0; i < 60; i++) { g.save(); g.rotate((i * Math.PI) / 30); g.lineWidth = i % 5 ? 2 : 4; g.beginPath(); g.moveTo(0, -S * 0.465); g.lineTo(0, -S * (i % 5 ? 0.45 : 0.435)); g.stroke(); g.restore(); }
  g.globalAlpha = 1; g.fillStyle = D.ink; g.textAlign = "center"; g.textBaseline = "middle";
  if (!D.skel) {
    if ("letterSpacing" in g) g.letterSpacing = "10px";
    g.font = "600 44px Georgia, serif"; g.fillText("ATELIER NOIR", 0, -S * 0.17);
    g.font = "500 22px system-ui, sans-serif"; g.globalAlpha = 0.7; g.fillText("AUTOMATIC", 0, S * 0.17); g.globalAlpha = 1;
    g.fillStyle = "#0c0c0d"; g.fillRect(S * 0.27, -36, 110, 72); g.fillStyle = "#f1ece0"; g.fillRect(S * 0.27 + 5, -31, 100, 62); // date window at 3 o'clock
    g.fillStyle = "#16130c"; g.font = "600 46px system-ui, sans-serif"; if ("letterSpacing" in g) g.letterSpacing = "0px"; g.fillText("25", S * 0.27 + 55, 2);
  }
  return c;
}
function bezelCanvas(base, ink, scale) {
  // The flat ring only shows the outer band (radius 0.84..1.0 of the texture), so ticks and numerals live inside it.
  const S = 1024, c = canvas2d(S, S), g = c.getContext("2d");
  g.fillStyle = base; g.fillRect(0, 0, S, S); if (!scale) return c;
  g.translate(S / 2, S / 2); g.strokeStyle = ink; g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i < 60; i++) { g.save(); g.rotate((i * Math.PI) / 30); g.lineWidth = i % 5 ? 3 : 6; g.beginPath(); g.moveTo(0, -S * (i % 5 ? 0.478 : 0.462)); g.lineTo(0, -S * 0.497); g.stroke(); g.restore(); }
  g.font = "600 30px system-ui, sans-serif";
  for (let i = 1; i <= 12; i++) { g.save(); g.rotate((i * Math.PI) / 6); g.translate(0, -S * 0.437); g.fillText(String(i * 5), 0, 0); g.restore(); }
  return c;
}
function leatherCanvases() {
  const mk = (stitch) => { const c = canvas2d(256, 512), g = c.getContext("2d"); g.fillStyle = stitch ? "#cfcfcf" : "#808080"; g.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 3500; i++) { const v = 90 + Math.random() * 120; g.fillStyle = `rgba(${v},${v},${v},.35)`; g.fillRect(Math.random() * 256, Math.random() * 512, 2 + Math.random() * 3, 2 + Math.random() * 3); }
    if (stitch) { g.strokeStyle = "#f4f4f4"; g.lineWidth = 5; g.setLineDash([46, 30]); [20, 236].forEach((x) => { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); }); }
    return c; };
  return [mk(true), mk(false)];
}
const roundRect = (THREE, w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
function toothShape(THREE, r, teeth, hole) {
  const s = new THREE.Shape(), n = teeth * 4;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rad = i % 4 === 1 || i % 4 === 2 ? r : r * 0.86; const x = Math.cos(a) * rad, y = Math.sin(a) * rad; i ? s.lineTo(x, y) : s.moveTo(x, y); }
  s.closePath();
  if (hole) { const h = new THREE.Path(); h.absarc(0, 0, r * hole, 0, Math.PI * 2, true); s.holes.push(h); }
  return s;
}
function flutedGeo(THREE, flutes) { // bezel with machined radial grooves
  const s = new THREE.Shape(), n = flutes * 8;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, r = 1.0 - 0.016 * (0.5 + 0.5 * Math.cos(flutes * a)); const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? s.lineTo(x, y) : s.moveTo(x, y); }
  s.closePath(); const h = new THREE.Path(); h.absarc(0, 0, 0.78, 0, Math.PI * 2, true); s.holes.push(h);
  return new THREE.ExtrudeGeometry(s, { depth: 0.09, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.008, bevelSegments: 2, curveSegments: 12 });
}
function makeGear(THREE, r, teeth, mat, depth, solid) {
  const g = new THREE.Group(), ex = (s, d) => new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  g.add(new THREE.Mesh(ex(toothShape(THREE, r, teeth, solid ? 0 : 0.62), depth), mat));
  if (solid) { const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, depth * 1.4, 32).rotateX(Math.PI / 2), mat); cap.position.z = depth * 0.7; g.add(cap); }
  else {
    for (let k = 0; k < 3; k++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(r * 1.24, r * 0.07, depth * 0.8), mat); sp.position.z = depth * 0.4; sp.rotation.z = (k * Math.PI) / 3; g.add(sp); }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.14, r * 0.14, depth * 1.6, 16).rotateX(Math.PI / 2), mat); hub.position.z = depth * 0.5; g.add(hub);
  }
  return g;
}

export function createWatchScene(THREE, RoomEnvironment, host, rig, opts) {
  const { sway = true, interactive = false, wheel = interactive, touch = "none", onPick, onLost } = opts;
  const D0 = { explode: 0, labels: false, suspend: false, auto: 1, fade: 1, angle: 0, dial: "black", bezel: "fluted", bracelet: "steel", leather: 0, caseTone: "steel" };
  Object.keys(D0).forEach((k) => { if (rig[k] === undefined) rig[k] = D0[k]; });

  const canvas = document.createElement("canvas"); canvas.style.cssText = "width:100%;height:100%;display:block" + (interactive ? `;touch-action:${touch};cursor:grab` : ""); host.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene(), pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; scene.environment = envTex;
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const key = new THREE.DirectionalLight(0xffe7bf, 2.2); scene.add(key);
  const rimL = new THREE.DirectionalLight(0xbfd4ff, 1.2); rimL.position.set(-4, 1, -3); scene.add(rimL);
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const metal = (color, rough) => new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: rough, envMapIntensity: 1.35 });
  const body = metal(STEEL, 0.24), ringMat = metal(STEEL, 0.08), bezelMetal = metal(STEEL, 0.07), brushed = metal(STEEL, 0.36), polishedLink = metal(STEEL, 0.07);
  body.anisotropy = 0.6; brushed.anisotropy = 0.7; body.side = THREE.DoubleSide;
  const brass = metal(0xb8975a, 0.28), steel = metal(0xc9ccd1, 0.18), gold = metal(0xd9bd7a, 0.2), handMat = metal(0xe9e6dc, 0.16), markerMat = metal(0xe0cd9c, 0.12);
  const plateMat = Object.assign(metal(0x3a3d42, 0.45), { side: THREE.DoubleSide });
  const dialMat = new THREE.MeshStandardMaterial({ metalness: 0.55, roughness: 0.42 });
  const dialFade = new THREE.MeshStandardMaterial({ metalness: 0.55, roughness: 0.42, transparent: true, opacity: 0 });
  const bezelMat = new THREE.MeshStandardMaterial({ metalness: 0.9, roughness: 0.22 });
  const [leatherMap, leatherBump] = leatherCanvases().map((c) => { const t = new THREE.CanvasTexture(c); t.anisotropy = aniso; return t; });
  leatherMap.colorSpace = THREE.SRGBColorSpace;
  const leather = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.62, metalness: 0, map: leatherMap, bumpMap: leatherBump, bumpScale: 0.8 });
  const rubyMat = new THREE.MeshPhysicalMaterial({ color: 0xb0122a, roughness: 0.2, clearcoat: 1 });
  const glassMat = Object.assign(new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0, envMapIntensity: 1.5 }), { side: THREE.DoubleSide });

  const watch = new THREE.Group(); watch.rotation.order = "YXZ"; scene.add(watch);
  const groups = [], pickables = [], labels = [];
  const grp = (dz) => { const g = new THREE.Group(); g.userData.dz = dz; watch.add(g); groups.push(g); return g; };
  const put = (parent, geo, mat, x, y, z, part) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (part) { m.userData.part = part; pickables.push(m); } parent.add(m); return m; };
  const tagAll = (obj, part) => obj.traverse((o) => { if (o.isMesh) { o.userData.part = part; pickables.push(o); } });
  const anchor = (parent, x, y, z, id, text) => { const a = new THREE.Object3D(); a.position.set(x, y, z); parent.add(a);
    if (interactive) { const b = document.createElement("button"); b.type = "button"; b.className = "wlabel"; b.textContent = text; b.tabIndex = -1; b.setAttribute("aria-label", "Show details: " + text.toLowerCase());
      b.addEventListener("pointerdown", (e) => e.stopPropagation()); b.addEventListener("click", () => onPick?.(id)); host.appendChild(b); labels.push({ a, b }); } };

  const gFront = grp(0.85), gDial = grp(0.45), gHands = grp(0.62), gPlate = grp(0.12), gTrain = grp(-0.12), gBridge = grp(-0.32), gRotor = grp(-0.52), gBack = grp(-0.8);
  // crystal (not pickable, so clicks reach the dial), then the three bezel variants
  const a = 0.88, h = 0.09, R = (a * a + h * h) / (2 * h), th = Math.asin(a / R);
  put(gFront, new THREE.SphereGeometry(R, 64, 10, 0, Math.PI * 2, 0, th).rotateX(Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xeaf6ff, metalness: 0, roughness: 0, transparent: true, opacity: 0.14, envMapIntensity: 1.9, clearcoat: 1 }), 0, 0, 0.33 - R);
  const bezelTorus = put(gFront, new THREE.TorusGeometry(0.93, 0.075, 24, 120), bezelMetal, 0, 0, 0.2, "bezel");
  const bezelFlat = put(gFront, new THREE.RingGeometry(0.78, 0.93, 128), bezelMat, 0, 0, 0.274, "bezel");
  const bezelFluted = put(gFront, flutedGeo(THREE, 60), bezelMetal, 0, 0, 0.185, "bezel");
  // dial, a fade-in twin for smooth colour changes, and applied 3D hour markers
  put(gDial, new THREE.CircleGeometry(0.88, 96), dialMat, 0, 0, 0.17, "dial");
  const dialTwin = put(gDial, new THREE.CircleGeometry(0.88, 96), dialFade, 0, 0, 0.1712, "dial"); dialTwin.visible = false;
  const markerGeo = new THREE.ExtrudeGeometry(roundRect(THREE, 0.05, 0.15, 0.015), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 });
  for (let i = 0; i < 12; i++) { if (i === 3) continue; // 3 o'clock is the date window
    const m = put(gDial, markerGeo, markerMat, Math.sin((i * Math.PI) / 6) * 0.72, Math.cos((i * Math.PI) / 6) * 0.72, 0.172, "dial"); m.rotation.z = -(i * Math.PI) / 6; if (i === 0) m.scale.set(1.3, 1.25, 1); }
  // case, chamfer rings, bevelled lugs, toothed crown
  put(watch, new THREE.CylinderGeometry(1, 1, 0.4, 96, 1, true).rotateX(Math.PI / 2), body, 0, 0, 0, "case");
  [0.2, -0.2].forEach((z) => put(watch, new THREE.TorusGeometry(0.99, 0.022, 12, 120), ringMat, 0, 0, z, "case"));
  const lugShape = roundRect(THREE, 0.26, 0.56, 0.04);
  [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sy]) => put(watch, new THREE.ExtrudeGeometry(lugShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 2 }).translate(0, 0, -0.1), body, sx * 0.62, sy * 1.0, 0, "case"));
  put(watch, new THREE.ExtrudeGeometry(toothShape(THREE, 0.12, 22, 0), { depth: 0.26, bevelEnabled: false }).rotateY(Math.PI / 2), steel, 1.0, 0, 0, "crown");
  put(watch, new THREE.CylinderGeometry(0.085, 0.085, 0.04, 28).rotateZ(Math.PI / 2), gold, 1.27, 0, 0, "crown");
  // hands at 10:10 and a sweeping seconds hand
  const hand = (len, w, z, deg) => { const s = new THREE.Shape(); s.moveTo(-w, -0.1); s.lineTo(w, -0.1); s.lineTo(w * 0.75, len * 0.9); s.lineTo(0, len); s.lineTo(-w * 0.75, len * 0.9); s.closePath();
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1 }), handMat); m.userData.part = "hands"; pickables.push(m);
    const g = new THREE.Group(); g.add(m); g.position.z = z; g.rotation.z = -THREE.MathUtils.degToRad(deg); gHands.add(g); };
  hand(0.52, 0.045, 0.19, 305); hand(0.8, 0.034, 0.205, 60);
  const sec = new THREE.Group(); sec.position.z = 0.222; gHands.add(sec);
  const sm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.95, 0.008), gold); sm.position.y = 0.3; sec.add(sm); sec.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 24).rotateX(Math.PI / 2), gold));
  // movement: plate, wheel train, barrel, balance wheel, bridges, screws, rotor, glass caseback
  const plate = put(gPlate, new THREE.CircleGeometry(0.86, 64), plateMat, 0, 0, -0.06, "plate");
  const gears = [[0.34, 24, -0.3, 0.22, 0.5], [0.25, 18, 0.31, 0.3, -0.667], [0.2, 14, 0.05, -0.2, 0.857]].map(([r, n, x, y, w]) => { const g = makeGear(THREE, r, n, brass, 0.035); g.position.set(x, y, -0.11); tagAll(g, "gears"); gTrain.add(g);
    put(gTrain, new THREE.SphereGeometry(0.035, 16, 12), rubyMat, x, y, -0.07, "gears"); return { g, w }; });
  const barrel = makeGear(THREE, 0.24, 20, gold, 0.04, true); barrel.position.set(-0.42, -0.38, -0.11); tagAll(barrel, "barrel"); gTrain.add(barrel);
  const balance = new THREE.Group(); balance.position.set(0.45, -0.12, -0.11); gTrain.add(balance);
  put(balance, new THREE.TorusGeometry(0.17, 0.02, 12, 48), steel, 0, 0, 0, "balance");
  [0, Math.PI / 2].forEach((r) => { const sp = put(balance, new THREE.BoxGeometry(0.34, 0.018, 0.018), steel, 0, 0, 0, "balance"); sp.rotation.z = r; });
  const spiral = []; for (let i = 0; i < 120; i++) { const t = i * 0.25, r = 0.015 + i * 0.0011; spiral.push(new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r, 0.012)); }
  const hair = new THREE.Line(new THREE.BufferGeometry().setFromPoints(spiral), new THREE.LineBasicMaterial({ color: 0xe6d3a3 })); hair.userData.part = "balance"; balance.add(hair);
  const bs = new THREE.Shape(); bs.absarc(0, 0, 0.86, 0.55 * Math.PI, 1.15 * Math.PI, false); bs.absarc(0, 0, 0.5, 1.15 * Math.PI, 0.55 * Math.PI, true); bs.closePath();
  put(gBridge, new THREE.ExtrudeGeometry(bs, { depth: 0.03, bevelEnabled: false }), steel, 0, 0, -0.15, "bridge");
  const bar = roundRect(THREE, 0.2, 0.8, 0.02);
  const bar1 = put(gBridge, new THREE.ExtrudeGeometry(bar, { depth: 0.03, bevelEnabled: false }), steel, 0, -0.3, -0.15, "bridge"); bar1.rotation.z = -1.05;
  [[-0.62, 0.32], [-0.2, 0.75], [0.5, -0.35], [-0.5, -0.6]].forEach(([x, y]) => { put(gBridge, new THREE.CylinderGeometry(0.034, 0.034, 0.05, 20).rotateX(Math.PI / 2), brass, x, y, -0.175, "bridge"); });
  const rs = new THREE.Shape(); rs.absarc(0, 0, 0.8, 0.2 * Math.PI, 0.8 * Math.PI, false); rs.absarc(0, 0, 0.55, 0.8 * Math.PI, 0.2 * Math.PI, true); rs.closePath();
  const rotor = put(gRotor, new THREE.ExtrudeGeometry(rs, { depth: 0.03, bevelEnabled: false }), gold, 0, 0, -0.205, "rotor");
  put(gBack, new THREE.TorusGeometry(0.86, 0.06, 20, 96), steel, 0, 0, -0.2, "caseback");
  put(gBack, new THREE.CircleGeometry(0.84, 64), glassMat, 0, 0, -0.215, "caseback");

  // bracelet: every link is its own mesh (brushed centre, polished outer links), tapering to a folding clasp
  const curveOf = (dir) => new THREE.CatmullRomCurve3([0, 0.55, 1.15, 1.75, 2.05].map((d, i) => new THREE.Vector3(0, dir * (1.1 + d), -[0.02, 0.07, 0.25, 0.62, 1.2][i])));
  const poseAt = (curve, u) => { const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangentAt(u).normalize()); return { p: curve.getPointAt(u), q }; };
  const braceG = new THREE.Group(), leatherG = new THREE.Group(), claspG = new THREE.Group(), buckleG = new THREE.Group(); watch.add(braceG, leatherG, claspG, buckleG);
  const N = 14, LEN = 0.19, bevel = { depth: 0.08, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.014, bevelSegments: 2 };
  const linkC = new THREE.ExtrudeGeometry(roundRect(THREE, 0.4, LEN, 0.03), bevel).translate(0, 0, -0.04), linkO = new THREE.ExtrudeGeometry(roundRect(THREE, 0.26, LEN, 0.03), bevel).translate(0, 0, -0.04);
  [1, -1].forEach((dir) => { const curve = curveOf(dir);
    for (let i = 0; i < N; i++) { const u = (i + 0.5) / N, { p, q } = poseAt(curve, u), row = new THREE.Group(); row.position.copy(p); row.quaternion.copy(q); row.scale.x = 1 - 0.16 * u; braceG.add(row);
      put(row, linkC, brushed, 0, 0, 0, "bracelet"); put(row, linkO, polishedLink, -0.34, 0, 0, "bracelet"); put(row, linkO, polishedLink, 0.34, 0, 0, "bracelet"); } });
  const endPose = poseAt(curveOf(-1), 1);
  claspG.position.copy(endPose.p); claspG.quaternion.copy(endPose.q); claspG.translateZ(0.06);
  put(claspG, new THREE.ExtrudeGeometry(roundRect(THREE, 0.84, 0.46, 0.05), { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 }), polishedLink, 0, 0.1, 0, "clasp");
  put(claspG, new THREE.BoxGeometry(0.3, 0.1, 0.03), brushed, 0, -0.04, 0.055, "clasp");
  // leather strap (segmented along the same curves) with a pin buckle
  [1, -1].forEach((dir) => { const curve = curveOf(dir);
    for (let i = 0; i < N; i++) { const p0 = curve.getPointAt(i / N), p1 = curve.getPointAt((i + 1) / N), len = p0.distanceTo(p1);
      const m = put(leatherG, new THREE.BoxGeometry(1.0, len * 1.06, 0.1), leather, 0, 0, 0, "bracelet"); m.position.copy(p0.clone().add(p1).multiplyScalar(0.5)); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize()); } });
  buckleG.position.copy(endPose.p); buckleG.quaternion.copy(endPose.q); buckleG.translateZ(0.06);
  const fs = roundRect(THREE, 1.3, 0.44, 0.04); const fh = new THREE.Path(); fh.moveTo(-0.5, -0.1); fh.lineTo(-0.5, 0.1); fh.lineTo(0.5, 0.1); fh.lineTo(0.5, -0.1); fh.closePath(); fs.holes.push(fh);
  put(buckleG, new THREE.ExtrudeGeometry(fs, { depth: 0.07, bevelEnabled: false }), steel, 0, 0, 0, "clasp"); put(buckleG, new THREE.BoxGeometry(0.06, 0.5, 0.05), steel, 0, 0.05, 0.05, "clasp");
  // labels for the exploded movement view
  anchor(gRotor, 0, 0.78, -0.205, "rotor", "ROTOR"); anchor(gBridge, -0.62, 0.32, -0.15, "bridge", "BRIDGES"); anchor(gTrain, -0.3, 0.22, -0.11, "gears", "WHEEL TRAIN");
  anchor(gTrain, 0.45, -0.12, -0.11, "balance", "BALANCE WHEEL"); anchor(gTrain, -0.42, -0.38, -0.11, "barrel", "MAINSPRING BARREL"); anchor(gBack, 0, -0.84, -0.215, "caseback", "CASEBACK"); anchor(gPlate, 0.62, -0.5, -0.06, "plate", "MOVEMENT PLATE");

  // configuration -> model. Colours ease towards their targets; the dial cross-fades.
  const tgt = { body: new THREE.Color(STEEL), ring: new THREE.Color(STEEL), bezel: new THREE.Color(STEEL), brushed: new THREE.Color(STEEL), leather: new THREE.Color(LEATHER[0]) };
  const tex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
  let sigApplied = null, first = true, skelNow = false, fade = 0, pending = null;
  const sigOf = () => [rig.dial, rig.bezel, rig.bracelet, rig.leather, rig.caseTone].join("|");
  const applyConfig = () => {
    sigApplied = sigOf();
    const D = DIAL[rig.dial] || DIAL.black, skel = !!D.skel, dark = rig.caseTone === "dark", two = rig.bracelet === "twotone", metalLeather = rig.bracelet === "leather";
    tgt.body.setHex(dark ? DARK : STEEL); tgt.ring.copy(tgt.body); tgt.bezel.setHex(two ? GOLD : dark ? 0x2a2c31 : STEEL); tgt.brushed.setHex(two ? GOLD : STEEL); tgt.leather.set(LEATHER[rig.leather] || LEATHER[0]);
    bezelTorus.visible = bezelFlat.visible = rig.bezel !== "fluted"; bezelFluted.visible = rig.bezel === "fluted";
    bezelMetal.roughness = rig.bezel === "smooth" ? 0.32 : 0.07;
    const base = two ? "#d9bd7a" : dark ? "#2b2d32" : "#dfe2e6", ink = two ? "#2a2012" : dark ? "#dad5c9" : "#2a2d31";
    bezelMat.map?.dispose(); bezelMat.map = tex(bezelCanvas(base, ink, rig.bezel === "polished")); bezelMat.needsUpdate = true;
    braceG.visible = claspG.visible = !metalLeather; leatherG.visible = buckleG.visible = metalLeather;
    markerMat.color.setHex(D.marker); handMat.color.setHex(D.hand); plate.visible = !skel;
    const t = tex(dialCanvas(D));
    if (first || skel !== skelNow || skel) { dialMat.map?.dispose(); dialMat.map = t; dialMat.alphaTest = skel ? 0.5 : 0; dialMat.needsUpdate = true; dialTwin.visible = false; fade = 0; pending = null; }
    else { pending?.dispose(); pending = t; dialFade.map = t; dialFade.opacity = 0; dialFade.needsUpdate = true; dialTwin.visible = true; fade = 1; }
    skelNow = skel;
    if (first) { body.color.copy(tgt.body); ringMat.color.copy(tgt.ring); bezelMetal.color.copy(tgt.bezel); brushed.color.copy(tgt.brushed); leather.color.copy(tgt.leather); first = false; }
  };

  // picking, drag, pinch, wheel (viewer / configurator)
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), vec = new THREE.Vector3();
  const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
  const pick = (ev) => { const r = canvas.getBoundingClientRect(); ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam); const hit = ray.intersectObjects(pickables, false).find((x) => x.object.userData.part && shown(x.object)); if (hit) onPick?.(hit.object.userData.part); };
  const pts = new Map(); let down = null, pinch = 0;
  const d2 = () => { const [p, q] = [...pts.values()]; return Math.hypot(p.x - q.x, p.y - q.y) || 1; };
  const clampD = (d) => Math.min(11, Math.max(1.6, d));
  const onDown = (e) => { canvas.setPointerCapture?.(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) { down = { t: performance.now(), moved: 0 }; rig.ry = rig.angle; rig.auto = 0; canvas.style.cursor = "grabbing"; } if (pts.size === 2) pinch = d2(); };
  const onMove = (e) => { const p = pts.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
    if (pts.size === 1) { rig.ry += dx * 0.008; rig.rx = Math.max(-1.2, Math.min(1.2, rig.rx + (touch === "none" ? dy * 0.006 : 0))); if (down) down.moved += Math.abs(dx) + Math.abs(dy); }
    else if (pts.size === 2) { const d = d2(); if (pinch) rig.dist = clampD((rig.dist * pinch) / d); pinch = d; if (down) down.moved += 99; } };
  const onUp = (e) => { pts.delete(e.pointerId); if (!pts.size) { canvas.style.cursor = "grab"; if (down && down.moved < 6 && performance.now() - down.t < 600) pick(e); down = null; } pinch = 0; };
  const onWheel = (e) => { e.preventDefault(); rig.dist = clampD(rig.dist * Math.exp(e.deltaY * 0.001)); };
  if (interactive) { canvas.addEventListener("pointerdown", onDown); canvas.addEventListener("pointermove", onMove); canvas.addEventListener("pointerup", onUp); canvas.addEventListener("pointercancel", onUp); }
  if (wheel) canvas.addEventListener("wheel", onWheel, { passive: false });

  // render loop
  let raf = 0, timer = 0, last = performance.now(), t = 0, ang = rig.ry || 0, ex = 0, visible = true, hidden = document.hidden, gone = false;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cur = { dist: rig.dist, tx: rig.tx, ty: rig.ty, tz: rig.tz, rx: rig.rx };
  const resize = () => { const w = host.clientWidth || 1, hh = host.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 600 ? 1.5 : 2)); renderer.setSize(w, hh, false); cam.aspect = w / hh; cam.updateProjectionMatrix(); };
  const frame = (now) => {
    raf = 0; if (gone || !visible || hidden) return;
    if (rig.suspend) { timer = setTimeout(kick, 250); return; } // e.g. the full-screen viewer is open
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    if (sigOf() !== sigApplied) applyConfig();
    const kc = reduce ? 1 : 1 - Math.exp(-dt * 8);
    body.color.lerp(tgt.body, kc); ringMat.color.lerp(tgt.ring, kc); bezelMetal.color.lerp(tgt.bezel, kc); brushed.color.lerp(tgt.brushed, kc); leather.color.lerp(tgt.leather, kc);
    if (fade > 0) { fade = Math.max(0, fade - dt / (reduce ? 0.01 : 0.45)); dialFade.opacity = 1 - fade;
      if (fade === 0) { dialMat.map?.dispose(); dialMat.map = pending; pending = null; dialMat.needsUpdate = true; dialTwin.visible = false; } }
    const auto = reduce ? 0 : rig.auto;
    if (auto > 0.001) ang += dt * SPEED * auto; else { const d = Math.atan2(Math.sin(rig.ry - ang), Math.cos(rig.ry - ang)); ang += d * (1 - Math.exp(-dt * 5)); }
    rig.angle = ang;
    const k = 1 - Math.exp(-dt * (reduce ? 30 : 4));
    for (const p of ["dist", "tx", "ty", "tz", "rx"]) cur[p] += (rig[p] - cur[p]) * k;
    ex += (rig.explode - ex) * k; groups.forEach((g) => { g.position.z = g.userData.dz * ex; });
    const mul = Math.max(1, 1 / cam.aspect), sw = sway && !reduce;
    cam.position.set(cur.tx + (sw ? Math.sin(t * 0.35) * 0.12 : 0), cur.ty + (sw ? Math.cos(t * 0.27) * 0.06 : 0), cur.tz + cur.dist * mul);
    cam.lookAt(cur.tx, cur.ty, cur.tz); watch.rotation.set(cur.rx, ang, 0);
    key.position.set(Math.cos(t * 0.3) * 4, 3.5, 4 + Math.sin(t * 0.3) * 2);
    gears.forEach(({ g, w }) => { g.rotation.z = t * w; }); barrel.rotation.z = -t * 0.3; balance.rotation.z = Math.sin(t * 5) * 0.7; rotor.rotation.z = t * 0.6; sec.rotation.z = -t * (Math.PI / 30);
    if (labels.length) { const w = host.clientWidth, hh = host.clientHeight, on = rig.labels;
      labels.forEach(({ a: an, b }) => { an.getWorldPosition(vec); vec.project(cam); const vis = on && vec.z < 1; b.classList.toggle("on", vis); b.tabIndex = vis ? 0 : -1;
        b.style.transform = `translate(calc(${((vec.x * 0.5 + 0.5) * w).toFixed(1)}px - 50%), calc(${((-vec.y * 0.5 + 0.5) * hh).toFixed(1)}px - 50%))`; }); }
    canvas.style.opacity = rig.fade;
    renderer.render(scene, cam); raf = requestAnimationFrame(frame);
  };
  const kick = () => { timer = 0; if (!raf && visible && !hidden && !gone) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const ro = new ResizeObserver(resize); ro.observe(host);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); }); io.observe(host);
  const vis = () => { hidden = document.hidden; kick(); }; document.addEventListener("visibilitychange", vis);
  const lost = (ev) => { ev.preventDefault(); onLost?.(); }; canvas.addEventListener("webglcontextlost", lost);
  applyConfig(); resize(); kick();
  return () => {
    gone = true; cancelAnimationFrame(raf); clearTimeout(timer); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", vis);
    canvas.removeEventListener("webglcontextlost", lost);
    if (interactive) { canvas.removeEventListener("pointerdown", onDown); canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerup", onUp); canvas.removeEventListener("pointercancel", onUp); }
    if (wheel) canvas.removeEventListener("wheel", onWheel);
    labels.forEach(({ b }) => b.remove()); pending?.dispose();
    scene.traverse((o) => { o.geometry?.dispose(); [].concat(o.material || []).forEach((m) => { m.map?.dispose(); m.bumpMap?.dispose(); m.dispose(); }); });
    leatherMap.dispose(); leatherBump.dispose(); envTex.dispose(); pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss?.(); canvas.remove();
  };
}
export { dialCanvas, bezelCanvas };
