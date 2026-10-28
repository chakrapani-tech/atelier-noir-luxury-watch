// Fictional demo content. Nothing here is a verified specification.
export const FINISHES = [
  { n: "Black calfskin", s: ["#0b0b0c", "#2a2623"], c: "#141416" },
  { n: "Cognac calfskin", s: ["#3a2012", "#7a4a28"], c: "#6a4327" },
  { n: "Slate calfskin", s: ["#1d2024", "#4a4f57"], c: "#3c4047" },
];
export const DIALS = [
  { id: "black", n: "Black", sw: "radial-gradient(circle at 35% 30%, #4a4b52, #08080a)" },
  { id: "blue", n: "Blue", sw: "radial-gradient(circle at 35% 30%, #3b78c4, #0b2550)" },
  { id: "green", n: "Green", sw: "radial-gradient(circle at 35% 30%, #3c9a69, #0a3524)" },
  { id: "champagne", n: "Champagne", sw: "radial-gradient(circle at 35% 30%, #f6ecce, #bb9d56)" },
  { id: "silver", n: "Silver", sw: "radial-gradient(circle at 35% 30%, #f6f7f8, #aeb3ba)" },
  { id: "skeleton", n: "Open-work", sw: "conic-gradient(#202125, #8e949c, #202125, #8e949c, #202125)" },
];
export const BEZELS = [{ id: "smooth", n: "Smooth" }, { id: "fluted", n: "Fluted" }, { id: "polished", n: "Polished" }];
export const BRACELETS = [{ id: "steel", n: "Stainless steel" }, { id: "twotone", n: "Two-tone metal" }, { id: "leather", n: "Leather strap" }];
// The three collection models are presets of the same configurable watch.
export const PRESETS = {
  obsidian: { dial: "black", bezel: "smooth", bracelet: "leather", leather: 0, caseTone: "dark" },
  champagne: { dial: "champagne", bezel: "polished", bracelet: "leather", leather: 1, caseTone: "steel" },
  skeleton: { dial: "skeleton", bezel: "fluted", bracelet: "leather", leather: 2, caseTone: "steel" },
};
export const specFor = (c) => ({
  Dial: DIALS.find((d) => d.id === c.dial)?.n + (c.dial === "skeleton" ? " dial, movement visible" : " dial"),
  Bezel: BEZELS.find((b) => b.id === c.bezel)?.n,
  Bracelet: c.bracelet === "leather" ? FINISHES[c.leather]?.n + " strap" : BRACELETS.find((b) => b.id === c.bracelet)?.n + " bracelet",
  Case: c.caseTone === "dark" ? "Dark brushed finish" : "Brushed and polished steel",
  Movement: "Automatic, glass caseback (illustrative)",
  Size: "40 mm (concept)",
  "Water resistance": "100 m (demo value)",
});
export const DEMO_PRICE = "\u20AC X,XXX (demo placeholder)";
export const LIST = [
  { id: "obsidian", name: "NOIR OBSIDIAN", tag: "Nocturnal, discreet",
    d: "A black sunburst dial in a dark metallic case, on a black strap. The quiet one.",
    spec: { Dial: "Black sunburst", Case: "Dark brushed finish", Strap: "Black calfskin", Movement: "Closed dial, glass caseback", Character: "Discreet and nocturnal", Size: "40 mm (concept)", "Water resistance": "100 m (demo value)" } },
  { id: "champagne", name: "NOIR CHAMPAGNE", tag: "Warm, classical",
    d: "A champagne dial in a silver case, on brown leather. Made for daylight.",
    spec: { Dial: "Champagne sunburst", Case: "Polished and brushed steel", Strap: "Brown leather", Movement: "Closed dial, glass caseback", Character: "Warm and classical", Size: "40 mm (concept)", "Water resistance": "100 m (demo value)" } },
  { id: "skeleton", name: "NOIR SKELETON", tag: "Open and mechanical",
    d: "An open-heart dial with visible gears behind the indices, on a dark strap.",
    spec: { Dial: "Open-heart, visible gears", Case: "Light brushed steel", Strap: "Dark calfskin", Movement: "Open-work dial, fully visible", Character: "Technical and expressive", Size: "40 mm (concept)", "Water resistance": "50 m (demo value)" } },
];

// Part descriptions for the 3D viewer. All illustrative: this is a fictional watch.
export const PARTS = {
  crown: { n: "Crown", t: "A knurled, toothed crown for winding and setting. Drawn here with a gold-toned cap; the grip pattern is illustrative." },
  dial: { n: "Dial", t: "A sunburst-textured dial with applied, bevelled hour markers and a date window at 3 o\u2019clock. Five colours are available, plus an open-work version that shows the movement." },
  hands: { n: "Hands", t: "Tapered, bevelled hour and minute hands set to a classic 10:10, with a sweeping seconds hand." },
  crystal: { n: "Crystal", t: "A domed, sapphire-style crystal with a faint tint and soft reflections. A concept feature, not a verified material claim." },
  bezel: { n: "Bezel", t: "Three bezels: smooth satin, fluted (60 machined grooves) or polished with an engraved-look minute scale. The scale is a texture on a flat ring." },
  case: { n: "Case and lugs", t: "A 40 mm concept case with brushed flanks, chamfered edges and bevelled lugs." },
  bracelet: { n: "Bracelet / strap", t: "Metal options are modelled link by link: a brushed centre link between two polished outer links, tapering towards the clasp. The leather option is a segmented calfskin strap with stitching." },
  clasp: { n: "Clasp / buckle", t: "A folding clasp on the metal bracelets, or a pin buckle on the leather strap. Both are simplified concept designs." },
  caseback: { n: "Caseback", t: "A glass caseback showing the movement. In the exploded view it separates from the case so each layer can be read." },
  rotor: { n: "Rotor", t: "A gold-toned oscillating weight that winds the mainspring in an automatic movement. Its motion here is an illustrative animation, not a working mechanism." },
  gears: { n: "Wheel train", t: "The gears that carry energy from the barrel to the escapement. They turn at different speeds in this illustration; the tooth counts are not engineered." },
  balance: { n: "Balance wheel", t: "The oscillating regulator with its hairspring. The swing shown is decorative and much slower than a real balance." },
  bridge: { n: "Bridges", t: "Steel bridges hold the wheel train in place, fixed with screws. Their shapes here are simplified." },
  barrel: { n: "Mainspring barrel", t: "The drum that stores the energy of the mainspring and drives the wheel train." },
  plate: { n: "Movement plate", t: "The base plate on which the movement is built. Hidden in the Skeleton model so the movement is visible from the dial side." },
};
export const MOVEMENT_PARTS = ["rotor", "bridge", "gears", "balance", "barrel", "caseback"];
export const BODY_PARTS = ["crown", "dial", "hands", "crystal", "bezel", "case", "bracelet", "clasp"];
