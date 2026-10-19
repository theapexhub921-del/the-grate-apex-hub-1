// Turning model values into OrganFrame messages for the 3D heart scenes (public/sim3d/scenes.js).
import type { OrganFrame } from './organ-3d-types';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// lv: ventricular filling 0 (empty, end-systole) – 1 (full, end-diastole); la: atrial filling;
// pressure: LV pressure 0–1 (the muscle glows); atria / ventricles: electrical activity 0–1.
export function heartFrame({ lv, la = 1, pressure = 0, atria = 0, ventricles = 0, extra }: { lv: number; la?: number; pressure?: number; atria?: number; ventricles?: number; extra?: OrganFrame }): OrganFrame {
  return {
    move: { ventricles: 0.9 + 0.1 * clamp01(lv), atria: 0.93 + 0.07 * clamp01(la), ...(extra?.move ?? {}) },
    glow: { lv: 0.8 * clamp01(pressure), atria: 0.7 * clamp01(atria), ventricles: 0.5 * clamp01(ventricles), ...(extra?.glow ?? {}) },
    glowColor: { atria: '#ffd25a', ventricles: '#ffd25a', ...(extra?.glowColor ?? {}) },
    color: extra?.color,
    opacity: extra?.opacity,
  };
}

// Round values so the frame (and the message) only changes when something visible changes.
export function rounded(n: number, step = 0.02) {
  return Math.round(n / step) * step;
}

// A simple heartbeat at a given rate, for scenes where the model has no cycle of its own:
// ventricles empty in the first third of the beat and refill over the next half.
export function beatAt(time: number, hr: number) {
  const f = (((time * Math.max(20, hr)) / 60) % 1 + 1) % 1;
  const lv = f < 0.33 ? 1 - f / 0.33 : Math.min(1, (f - 0.33) / 0.45);
  const atria = f > 0.88 ? 0 : 1;
  return { lv: rounded(lv, 0.05), la: atria, systole: f < 0.33 ? 1 : 0 };
}

// The chest scene: inflate 0 (after a quiet breath out) – 1 (deep breath in). Lungs swell
// outwards and down while the diaphragm flattens; a collapsed lung shrinks to its root.
export function chestFrame({ inflate, collapseRight = 0, collapseLeft = 0, extra }: { inflate: number; collapseRight?: number; collapseLeft?: number; extra?: OrganFrame }): OrganFrame {
  const i = Math.max(-0.4, Math.min(1.3, inflate));
  const lung = (c: number): [number, number, number] => {
    const k = 1 - 0.45 * c;
    return [rounded((0.97 + 0.07 * i) * k, 0.01), rounded((0.95 + 0.11 * i) * k, 0.01), rounded((0.97 + 0.07 * i) * k, 0.01)];
  };
  return {
    move: { rightLung: lung(collapseRight), leftLung: lung(collapseLeft), diaphragm: [1, rounded(1 - 0.18 * Math.max(0, i), 0.01), 1], lungs: lung(0), ...(extra?.move ?? {}) },
    glow: extra?.glow,
    glowColor: extra?.glowColor,
    color: extra?.color,
    opacity: extra?.opacity,
  };
}
