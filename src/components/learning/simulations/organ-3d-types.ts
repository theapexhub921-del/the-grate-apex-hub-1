// What a simulation sends to its 3D organ (public/sim3d/organ.html): per group of parts,
// how much to scale it, how much it glows, its colour and opacity. Group names are the
// scene's (public/sim3d/scenes.js).
export type OrganFrame = {
  move?: Record<string, number | [number, number, number]>;
  glow?: Record<string, number>;
  glowColor?: Record<string, string>;
  color?: Record<string, string>;
  opacity?: Record<string, number>;
};

export type Organ3DProps = {
  scene: string; // a scene in public/sim3d/scenes.js
  frame: OrganFrame;
  label: string; // what the model shows now, for screen readers
  height?: number;
};
