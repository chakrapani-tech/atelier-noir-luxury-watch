// Shared configuration store. Every 3D canvas registers a "rig" (a plain mutable object the scene reads each frame).
// setConfig() copies the visitor's choice onto all unlocked rigs, so hero, configurator and viewer stay in sync.
export const SHOWCASE = { dial: "black", bezel: "fluted", bracelet: "steel", leather: 0, caseTone: "steel" };
let config = { ...SHOWCASE };
const entries = new Set(), subs = new Set();

export const heroRig = { ry: 0.55, rx: -0.12, dist: 7.2, tx: 0, ty: 0, tz: 0, auto: 1, fade: 1, suspend: false };
export const registerRig = (rig, locked = false) => {
  Object.assign(rig, locked ? SHOWCASE : config);
  const e = { rig, locked }; entries.add(e);
  return () => entries.delete(e);
};
registerRig(heroRig);
export const getConfig = () => config;
export const setConfig = (patch) => {
  config = { ...config, ...patch };
  entries.forEach(({ rig, locked }) => { if (!locked) Object.assign(rig, config); });
  subs.forEach((f) => f());
};
export const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
