// GI Lesson 2 — Digestion and absorption of carbohydrate, protein and fat.
//
// Lecture (slides 16–34): salivary amylase starts starch digestion; acid stops it; pancreatic
// amylase finishes it; brush-border enzymes (lactase, sucrase, maltase, α-dextrinase) make
// monosaccharides, absorbed by SGLT1/GLUT5 → GLUT2 into blood; lack of lactase = lactose
// intolerance. Pepsin (needs acid, pH 1.5–2.5) digests 10–15% of protein; enterokinase activates
// trypsin, which activates the other pancreatic proteases; brush-border peptidases finish; peptides
// and amino acids enter the blood. Bile emulsifies fat; pancreatic lipase with colipase does most
// of the digestion; micelles carry the products to the brush border; chylomicrons leave in the
// lymph (lacteals).
// The sizes of the losses when a step is missing are illustrative; that unabsorbed lactose and fat
// reach the colon (gas, diarrhoea; fatty stools) is textbook.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const NUTRIENTS = ['Starch', 'Milk sugar (lactose)', 'Protein', 'Fat'];
export const PROBLEMS = ['None', 'No pancreatic enzymes', 'No bile', 'No enterokinase', 'Lactase deficiency', 'No stomach acid'];
export const PRODUCTS = ['Glucose', 'Glucose and galactose', 'Amino acids and small peptides', 'Fatty acids and monoglycerides'];
export const ROUTES = ['Blood (portal vein)', 'Lymph (lacteals)'];

export type NutrientState = SimState & { nutrient: number; problem: number; digested: number; absorbed: number };

function model(values: Record<string, number>): NutrientState {
  const { nutrient, problem } = values;
  const pancreas = problem !== 1;
  let digested = 0;
  let absorbed = 0;
  if (nutrient === 0) {
    digested = 0.05 + 0.95 * (pancreas ? 0.98 : 0.3);
    absorbed = digested * 0.99;
  } else if (nutrient === 1) {
    digested = problem === 4 ? 0.1 : 0.98;
    absorbed = digested * 0.99;
  } else if (nutrient === 2) {
    const pepsin = problem === 5 ? 0 : 0.12;
    const trypsin = pancreas && problem !== 3 ? 0.97 : 0.15;
    digested = pepsin + (1 - pepsin) * trypsin;
    absorbed = digested * 0.98;
  } else {
    const lipase = pancreas ? (problem === 2 ? 0.55 : 0.97) : 0.15;
    digested = lipase;
    absorbed = digested * (problem === 2 ? 0.5 : 0.98);
  }
  const notes: string[] = [];
  if (nutrient === 1 && problem === 4) notes.push('Lactose stays in the gut: bacteria in the colon ferment it — gas, bloating and diarrhoea (lactose intolerance).');
  if (nutrient === 3 && problem === 2) notes.push('Without bile the fat stays in large droplets (little surface for lipase) and no micelles form: much of it reaches the colon.');
  if (nutrient === 2 && problem === 3) notes.push('Without enterokinase, trypsinogen is not activated — and trypsin is what activates the other proteases.');
  if (nutrient === 2 && problem === 5) notes.push('Without acid there is no pepsin, but pepsin only digests 10–15% of protein: the pancreas does most of the work.');
  return {
    readouts: { digested: digested * 100, absorbed: absorbed * 100, toColon: (1 - absorbed) * 100, route: nutrient === 3 ? 1 : 0, product: nutrient },
    notes,
    nutrient,
    problem,
    digested,
    absorbed,
  };
}

const START = { nutrient: 0, problem: 0 };

export const nutrientDigestion: SimDefinition<NutrientState> = {
  id: 'nutrient-digestion',
  name: 'Digesting a meal',
  controls: [
    { kind: 'choice', key: 'nutrient', label: 'Nutrient', options: NUTRIENTS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'problem', label: 'What is missing', options: PROBLEMS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'digested', label: 'Digested', unit: '%', primary: true },
    { key: 'absorbed', label: 'Absorbed', unit: '%', primary: true },
    { key: 'toColon', label: 'Reaches the colon', unit: '%' },
    { key: 'product', label: 'Absorbed as', noDelta: true, text: (v) => PRODUCTS[v] ?? '' },
    { key: 'route', label: 'Leaves the gut in', noDelta: true, text: (v) => ROUTES[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'starch', label: 'Starch', values: START, caption: 'Amylase (saliva, then pancreas) and the brush-border enzymes: glucose into the blood.' },
    { id: 'fat', label: 'Fat', values: { nutrient: 3, problem: 0 }, caption: 'Bile, lipase and colipase; micelles; chylomicrons into the lymph.' },
    { id: 'lactose', label: 'Lactose intolerance', values: { nutrient: 1, problem: 4 }, caption: 'No lactase: lactose reaches the colon.' },
    { id: 'pancreas', label: 'Pancreatic failure', values: { nutrient: 3, problem: 1 }, caption: 'Without pancreatic lipase most fat is not digested.' },
  ],
  challenges: [
    {
      id: 'protein',
      label: 'Which loss matters most?',
      prompt: 'For protein, find the missing step that leaves less than 30% digested.',
      rules: ['Protein is fixed.'],
      start: { nutrient: 2, problem: 5 },
      locked: ['nutrient'],
      goals: [{ readout: 'digested', atMost: 30, label: 'Less than 30% digested' }],
      debrief: 'Losing stomach acid barely matters, but losing enterokinase (or the pancreas) stops trypsin — and with it the other pancreatic proteases.',
    },
  ],
  modelNote:
    'Simplified teaching model. Each enzyme, where it acts, what activates it, the transporters and the routes (blood or lymph) are from the lecture (slides 16–34). How much is lost when a step is missing is illustrative; the colonic symptoms of unabsorbed lactose and fat are textbook.',
};
