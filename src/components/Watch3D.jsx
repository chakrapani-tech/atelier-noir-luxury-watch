import { useEffect, useRef } from "react";
import { createWatchScene } from "../lib/watchScene.js";

/* React wrapper. Three.js is imported dynamically; if WebGL or the import fails, onMode("fallback") is called
   and the caller keeps showing its SVG watch. `rig` is a plain mutable object (no React state per frame). */
const webglOK = () => {
  try {
    const gl = document.createElement("canvas").getContext("webgl2") || document.createElement("canvas").getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // release the probe context immediately
    return !!gl;
  } catch { return false; }
};

export default function Watch3D({ rig, sway = true, interactive = false, inline = false, onMode, onPick, label = "Rotating 3D model of the Atelier Noir watch (procedural, for design demonstration)" }) {
  const host = useRef(null), pickRef = useRef(onPick);
  pickRef.current = onPick;
  useEffect(() => {
    let dead = false, cleanup = () => {};
    (async () => {
      try {
        if (!webglOK()) throw new Error("WebGL unavailable");
        const THREE = await import("three");
        const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
        if (dead) return;
        cleanup = createWatchScene(THREE, RoomEnvironment, host.current, rig, { sway, interactive, wheel: interactive && !inline, touch: inline ? "pan-y" : "none", onPick: (id) => pickRef.current?.(id), onLost: () => onMode?.("fallback") });
        onMode?.("3d");
      } catch (e) { console.warn("Watch3D fallback:", e.message); onMode?.("fallback"); }
    })();
    return () => { dead = true; cleanup(); };
  }, []); // eslint-disable-line
  return <div ref={host} className="absolute inset-0 overflow-hidden" role="img" aria-label={label} />;
}
