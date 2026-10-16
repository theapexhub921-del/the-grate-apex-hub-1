// Shared shapes for the lesson simulations.
//
// A simulation is a small, pure model: control values in, readouts out.
// The model files (this folder) hold the numbers and the teaching text;
// the drawings live in components/learning/simulations/. Keeping the
// models pure lets tests/simulations.test.mjs check that every
// prediction's answer matches what the model then shows.
//
// Every model is a simplified teaching model: it shows which way things
// move and roughly how far, anchored to the lecture's resting values.
import type { SimulationId } from '@/data/lesson-types';

export type SimValues = Record<string, number>;

export type SimControl =
  | {
      kind: 'slider';
      key: string;
      label: string;
      min: number;
      max: number;
      step: number;
      unit?: string;
      hint?: string;
      format?: (value: number) => string;
    }
  | {
      kind: 'choice';
      key: string;
      label: string;
      options: { value: number; label: string }[];
      hint?: string;
    };

export type SimReadout = {
  key: string;
  label: string;
  unit?: string;
  decimals?: number;
  primary?: boolean; // shown highlighted
  // Text instead of a number (e.g. "Systolic"). Gets every readout, so a
  // tile can combine values (e.g. "120/80").
  text?: (value: number, all: Record<string, number>) => string;
  // Hide the "↑ +3 vs start" line (for categories, not amounts).
  noDelta?: boolean;
  // Not shown as a tile (used by goals, predictions or the drawing).
  hidden?: boolean;
};

// Every model returns at least its readouts and any warnings to show.
export type SimState = {
  readouts: Record<string, number>;
  notes: string[];
};

export type SimScenario = {
  id: string;
  label: string;
  values: SimValues; // a complete set of control values
  caption: string;
};

export type SimGoal = {
  readout: string;
  atLeast?: number;
  atMost?: number;
  label: string; // e.g. "Cardiac output at least 5.5 L/min"
};

export type SimChallenge = {
  id: string;
  label: string;
  prompt: string;
  rules: string[];
  start: SimValues;
  locked?: string[]; // control keys the learner cannot move
  limits?: Record<string, { min?: number; max?: number }>;
  goals: SimGoal[];
  debrief: string;
};

export type SimDefinition<S extends SimState = SimState> = {
  id: SimulationId;
  name: string; // short name, e.g. "Pressure–volume loop"
  controls: SimControl[];
  initial: SimValues;
  readouts: SimReadout[];
  model: (values: SimValues) => S;
  scenarios: SimScenario[];
  challenges: SimChallenge[];
  modelNote: string; // what is simplified, and where the numbers come from
  // Animated drawings run on a clock; a static model has none.
  animated?: boolean;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// A readout formatted for display, e.g. "85 mL" or "Systolic".
export function formatReadout(readout: SimReadout, all: Record<string, number>): string {
  const value = all[readout.key] ?? 0;
  if (readout.text) return readout.text(value, all);
  const fixed = value.toFixed(readout.decimals ?? 0);
  return readout.unit ? `${fixed} ${readout.unit}` : fixed;
}

export function goalMet(goal: SimGoal, readouts: Record<string, number>): boolean {
  const value = readouts[goal.readout];
  if (value === undefined) return false;
  if (goal.atLeast !== undefined && value < goal.atLeast - 1e-9) return false;
  if (goal.atMost !== undefined && value > goal.atMost + 1e-9) return false;
  return true;
}

// Control values with a challenge's locks and limits applied.
export function controlRange(control: SimControl, challenge?: SimChallenge) {
  if (control.kind !== 'slider') return null;
  const limit = challenge?.limits?.[control.key];
  return {
    min: Math.max(control.min, limit?.min ?? control.min),
    max: Math.min(control.max, limit?.max ?? control.max),
  };
}
