// Physiology → Gastrointestinal Physiology — one simulation per lesson (models in
// data/simulations/). Each starts with predictions answered BEFORE the model runs the change.
// Prediction IDs: sN-xx.
import type { InteractiveDraft } from '@/data/topics/build';
import { mcq, simulate } from '@/data/topics/build';
import { ds, TOPIC_ID, type ConceptId } from '@/data/topics/gastrointestinal-physiology/sources';
import { direction, insertSimulation, predict } from '@/data/topics/sim-helpers';

type Step = InteractiveDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const simulations: Record<string, Step> = {
  [L(1)]: simulate({
    sim: 'gut-transit',
    title: 'A meal through the gut',
    intro: 'Follow one meal hour by hour through the real digestive tract — stomach, small intestine, colon — and see which of the five processes is happening where. Then change the meal, the fibre and the nerves.',
    sourceRefs: ds([2, 3, 12, 13, 14, 15]),
    predictions: [
      {
        question: mcq('s1-01', 'digestive-processes', 'Six hours after a mixed meal it has left the stomach. Where are most of its nutrients being absorbed?', 'The small intestine', ['The stomach', 'The large intestine'], {
          ...predict,
          explanation: 'Absorption — moving the small units into blood or lymph — happens mainly in the small intestine; the colon absorbs mostly water and electrolytes (slides 14–15).',
        }),
        set: { time: 6 },
        watch: 'place',
        expect: [
          { readout: 'place', equals: 1 },
          { readout: 'absorbed', change: 'up' },
        ],
      },
      {
        question: direction('s1-02', 'digestive-processes', 'The meal is fatty instead. Four hours after eating, how much of it has been absorbed compared with a mixed meal?', 'down', 'Undigested fat reaching the small intestine delays gastric emptying, so the meal stays longer in the stomach and absorption starts later (slide 154).'),
        from: { time: 4 },
        set: { meal: 1 },
        watch: 'absorbed',
        expect: [{ readout: 'absorbed', change: 'down' }],
      },
      {
        question: direction('s1-03', 'gi-functions', 'The person eats a high-fibre diet. What happens to the time from mouth to anus?', 'down', 'Fibre softens the stool and strengthens colonic contractions, so the residue passes sooner (slide 173).'),
        set: { fibre: 1 },
        watch: 'total',
        expect: [{ readout: 'total', change: 'down' }],
      },
    ],
  }),

  [L(2)]: simulate({
    sim: 'nutrient-digestion',
    title: 'Digesting starch, protein and fat',
    intro: 'Choose a nutrient and take away one step — pancreatic enzymes, bile, enterokinase, lactase or stomach acid — and see how much is digested, absorbed, or left for the colon.',
    sourceRefs: ds([16, 18, 21, 23, 24, 25, 30, 31, 32, 34]),
    predictions: [
      {
        question: direction('s2-01', 'lipid-digestion', 'Bile cannot reach the duodenum. What happens to the fat absorbed?', 'down', 'Without bile the fat stays in large droplets, so lipase reaches only their surface, and no micelles carry the products to the brush border (slides 30–33).'),
        from: { nutrient: 3 },
        set: { problem: 2 },
        watch: 'absorbed',
        expect: [{ readout: 'absorbed', change: 'down' }],
      },
      {
        question: direction('s2-02', 'protein-digestion', 'The duodenum makes no enterokinase. What happens to protein digestion?', 'down', 'Enterokinase converts trypsinogen to trypsin, and trypsin activates the other proteases. Without it the pancreatic proteases stay inactive; pepsin alone digests only 10–15% (slides 23–24).'),
        from: { nutrient: 2 },
        set: { problem: 3 },
        watch: 'digested',
        expect: [{ readout: 'digested', change: 'down' }],
      },
      {
        question: mcq('s2-03', 'carbohydrate-digestion', 'Someone without lactase drinks milk. Where does most of the lactose end up?', 'In the colon', ['Absorbed in the jejunum', 'In the lymph'], {
          ...predict,
          explanation: 'Only monosaccharides can be absorbed. Without brush-border lactase, lactose passes on to the colon: lactose intolerance (slides 17–18).',
        }),
        from: { nutrient: 1 },
        set: { problem: 4 },
        watch: 'toColon',
        expect: [
          { readout: 'toColon', change: 'up' },
          { readout: 'absorbed', change: 'down' },
        ],
      },
    ],
  }),

  [L(3)]: simulate({
    sim: 'gut-water',
    title: 'Water and salt',
    intro: 'Follow the 9 litres that enter the gut each day. Change how much is drunk, add cholera toxin, and try a glucose–salt drink.',
    sourceRefs: ds([36, 37, 38, 41, 43, 89, 90]),
    predictions: [
      {
        question: direction('s3-01', 'water-absorption', 'The person drinks an extra litre of water a day. How much does the small intestine absorb?', 'up', 'Water moves by osmosis, following the Na⁺ and nutrients absorbed; about 90% of what enters is absorbed in the small intestine (slide 36).'),
        set: { drink: 3 },
        watch: 'small',
        expect: [{ readout: 'small', change: 'up' }],
      },
      {
        question: direction('s3-02', 'intestinal-secretion', 'Cholera toxin raises cAMP in the crypt cells. What happens to the water lost in the faeces?', 'up', 'cAMP opens CFTR: Cl⁻ pours into the gut, with Na⁺ and water following — far more than the colon can absorb (slides 89–90).'),
        set: { cholera: 1 },
        watch: 'faeces',
        expect: [{ readout: 'faeces', change: 'up' }],
      },
      {
        question: direction('s3-03', 'sodium-absorption', 'The cholera patient drinks a glucose–salt solution instead of plain water. What happens to the water lost in the faeces?', 'down', 'SGLT1 absorbs Na⁺ with glucose, and cholera does not block it; water follows the Na⁺ back into the body — oral rehydration therapy (slide 43).'),
        from: { cholera: 1 },
        set: { ors: 1 },
        watch: 'faeces',
        expect: [{ readout: 'faeces', change: 'down' }],
      },
    ],
  }),

  [L(4)]: simulate({
    sim: 'saliva',
    title: 'Saliva',
    intro: 'Smell food, taste something sour, block the parasympathetic nerves or add stress, and watch the salivary glands and what comes out of them.',
    sourceRefs: ds([61, 62, 63, 65, 117, 118]),
    predictions: [
      {
        question: direction('s4-01', 'saliva-control', 'A slice of lemon touches the tongue. What happens to the flow of saliva?', 'up', 'Taste is the main stimulus for salivation, sour most strongly; the salivatory nuclei drive the parasympathetic supply (slides 117–118).'),
        set: { stimulus: 2 },
        watch: 'flow',
        expect: [{ readout: 'flow', change: 'up' }],
      },
      {
        question: mcq('s4-02', 'saliva', 'At that fast flow, what is the saliva like compared with plasma?', 'Still hypotonic', ['Isotonic', 'Hypertonic'], {
          ...predict,
          explanation: 'The ducts reabsorb Na⁺ and Cl⁻ but are impermeable to water, so final saliva is always hypotonic — even though, flowing fast, it keeps a little more Na⁺ (slides 61–63).',
        }),
        set: { stimulus: 2 },
        watch: 'osm',
        expect: [{ readout: 'osm', change: 'up' }],
      },
      {
        question: direction('s4-03', 'saliva-control', 'The person is anxious before an exam (strong sympathetic activity). What happens to the protein content of their saliva?', 'up', 'Sympathetic stimulation (noradrenaline, cAMP) produces a sparse, protein-rich saliva (slide 117).'),
        set: { nerves: 2 },
        watch: 'protein',
        expect: [{ readout: 'protein', change: 'up' }],
      },
    ],
  }),

  [L(5)]: simulate({
    sim: 'pancreatic-secretion',
    title: 'Pancreatic secretion',
    intro: 'Move through the phases of a meal, put acid or fat into the duodenum, and cut the vagus — and watch the pancreas send bicarbonate and enzymes.',
    sourceRefs: ds([80, 83, 121, 122, 124, 125, 126, 127]),
    predictions: [
      {
        question: direction('s5-01', 'pancreas-control', 'Acid chyme enters the duodenum. What happens to the pancreas’s HCO₃⁻ secretion?', 'up', 'Acid releases secretin from S cells; secretin raises cAMP in the duct cells, which secrete HCO₃⁻ and water (slides 83, 125).'),
        from: { phase: 3 },
        set: { acid: 1 },
        watch: 'hco3',
        expect: [{ readout: 'hco3', change: 'up' }],
      },
      {
        question: direction('s5-02', 'pancreas-control', 'Fatty acids and peptides arrive in the duodenum. What happens to enzyme secretion?', 'up', 'They release CCK from I cells, which stimulates the acinar cells to secrete enzymes (slide 125).'),
        from: { phase: 3 },
        set: { fat: 1 },
        watch: 'enzymes',
        expect: [{ readout: 'enzymes', change: 'up' }],
      },
      {
        question: direction('s5-03', 'pancreas-control', 'During the cephalic phase, the vagus is cut. What happens to enzyme secretion?', 'down', 'The cephalic phase (20–25% of the response) works through the dorsal vagal complex and the vagus, releasing ACh (slides 122–123).'),
        from: { phase: 1 },
        set: { vagus: 1 },
        watch: 'enzymes',
        expect: [{ readout: 'enzymes', change: 'down' }],
      },
    ],
  }),

  [L(6)]: simulate({
    sim: 'gastric-phases',
    title: 'The three phases of acid secretion',
    intro: 'Move through a meal — smelling it, swallowing it, passing it to the duodenum — and watch the stomach’s acid. Then cut the vagus or block the parietal cell.',
    sourceRefs: ds([70, 72, 110, 111, 112, 113, 114, 115]),
    predictions: [
      {
        question: direction('s6-01', 'gastric-phases', 'You smell and see your dinner before eating it. What happens to acid secretion?', 'up', 'The cephalic phase: the cortex and hypothalamus drive the vagus, whose ACh stimulates parietal cells directly and through gastrin and histamine — up to about 40% of the maximum (slides 110–111).'),
        set: { phase: 1 },
        watch: 'acid',
        expect: [{ readout: 'acid', change: 'up' }],
      },
      {
        question: direction('s6-02', 'extrinsic-nerves', 'The vagus has been cut (vagotomy). In the cephalic phase, how much acid is secreted compared with an intact vagus?', 'down', 'The cephalic phase runs through the vagal nuclei and the vagus; without it, the sight and smell of food no longer reach the stomach (slide 111).'),
        from: { phase: 1 },
        set: { vagus: 1 },
        watch: 'acid',
        expect: [{ readout: 'acid', change: 'down' }],
      },
      {
        question: direction('s6-03', 'gastric-phases', 'Later in the meal, acid chyme (pH < 2) and fat fill the duodenum. Compared with the gastric phase, what happens to acid secretion?', 'down', 'The intestinal phase now inhibits: the enterogastric reflex, and secretin, GIP and CCK, switch gastric secretion off (slides 114–115).'),
        from: { phase: 2 },
        set: { phase: 4 },
        watch: 'acid',
        expect: [{ readout: 'acid', change: 'down' }],
      },
    ],
  }),

  [L(7)]: simulate({
    sim: 'gut-muscle',
    title: 'Slow waves and contractions',
    intro: 'Watch the membrane potential of gut smooth muscle: slow waves from the interstitial cells of Cajal, and spikes when they cross threshold. Add stretch, ACh or noradrenaline, compare regions, and see what slows gastric emptying.',
    sourceRefs: ds([131, 132, 153, 154, 163, 164]),
    predictions: [
      {
        question: direction('s7-01', 'gi-smooth-muscle', 'ACh is released by the vagus onto the antrum. What happens to the number of spikes on each slow wave?', 'up', 'ACh and parasympathetic stimulation depolarise the fibres, so more of each slow wave lies above threshold and more spikes fire (slides 131–132).'),
        set: { input: 2 },
        watch: 'spikes',
        expect: [
          { readout: 'spikes', change: 'up' },
          { readout: 'force', change: 'up' },
        ],
      },
      {
        question: direction('s7-02', 'gi-smooth-muscle', 'Noradrenaline from sympathetic nerves reaches the muscle instead. What happens to the strength of contraction?', 'down', 'Noradrenaline hyperpolarises the fibres: the slow waves stay below threshold, so no spikes fire (slide 132).'),
        set: { input: 3 },
        watch: 'force',
        expect: [{ readout: 'force', change: 'down' }],
      },
      {
        question: direction('s7-03', 'gastric-motility', 'Acid arrives in the duodenum. What happens to gastric emptying?', 'down', 'Excess acid (or undigested fat) in the small intestine delays emptying, so the intestine receives chyme no faster than it can handle it (slides 153–154).'),
        set: { duodenum: 1 },
        watch: 'emptying',
        expect: [{ readout: 'emptying', change: 'down' }],
      },
    ],
  }),

  [L(8)]: simulate({
    sim: 'defecation',
    title: 'Continence and defecation',
    intro: 'Fill the rectum, decide whether to hold on or defecate, and damage the pelvic or pudendal nerves — and watch the sphincters and the pelvic floor.',
    sourceRefs: ds([174, 175, 179, 180, 181, 182]),
    predictions: [
      {
        question: direction('s8-01', 'defecation', 'A mass movement pushes 150 mL of faeces into the rectum. What happens to the urge to defecate?', 'up', 'Rectal distension starts the defecation reflex: the internal sphincter relaxes and the external contracts — producing the urge (slides 180–181).'),
        set: { volume: 150 },
        watch: 'urge',
        expect: [{ readout: 'urge', change: 'up' }],
      },
      {
        question: direction('s8-02', 'defecation', 'With 200 mL in the rectum, the person decides to defecate. What happens to the anorectal angle?', 'up', 'The puborectalis relaxes and the angle straightens; the external sphincter relaxes and the Valsalva manoeuvre helps expel the faeces (slides 175, 182).'),
        from: { volume: 200 },
        set: { decide: 1 },
        watch: 'angle',
        expect: [
          { readout: 'angle', change: 'up' },
          { readout: 'emptied', change: 'up' },
        ],
      },
      {
        question: mcq('s8-03', 'defecation', 'The pudendal nerve is damaged and the rectum fills. What happens?', 'The external sphincter cannot be held shut: incontinence', ['Nothing — the internal sphincter keeps continence', 'The urge is lost, so the rectum overfills'], {
          ...predict,
          explanation: 'The external anal sphincter is skeletal muscle supplied by the pudendal nerve; it is how the person holds on once the reflex relaxes the internal sphincter (slides 174, 182).',
        }),
        from: { volume: 200 },
        set: { injury: 2 },
        watch: 'continent',
        expect: [{ readout: 'continent', equals: 0 }],
      },
    ],
  }),

  [L(9)]: simulate({
    sim: 'bilirubin',
    title: 'Bilirubin and jaundice',
    intro: 'Break down more red cells, damage the liver or block the bile duct, and watch the bilirubin, the liver, the gallbladder — and which kind of jaundice appears.',
    sourceRefs: ds([203, 209, 211, 212, 213, 214, 215]),
    predictions: [
      {
        question: direction('s9-01', 'jaundice', 'Malaria destroys red cells six times faster than normal. What happens to the unconjugated bilirubin?', 'up', 'Excess haemolysis makes more bilirubin than the liver can take up and conjugate: pre-hepatic jaundice, with unconjugated bilirubin (slides 212–213).'),
        set: { haemolysis: 6 },
        watch: 'unconjugated',
        expect: [{ readout: 'unconjugated', change: 'up' }],
      },
      {
        question: mcq('s9-02', 'jaundice', 'A gallstone blocks the common bile duct. Which bilirubin rises most?', 'Conjugated', ['Unconjugated', 'Neither'], {
          ...predict,
          explanation: 'The liver still conjugates bilirubin, but it cannot drain in bile, so conjugated bilirubin backs up into the blood: post-hepatic jaundice (slides 215–216).',
        }),
        set: { obstruction: 1 },
        watch: 'conjugated',
        expect: [
          { readout: 'conjugated', change: 'up' },
          { readout: 'type', equals: 3 },
        ],
      },
      {
        question: direction('s9-03', 'bile-secretion', 'A fatty meal reaches the duodenum. What happens to the size of the gallbladder?', 'down', 'Fatty acids release CCK, which contracts the gallbladder and relaxes the sphincter of Oddi, emptying bile into the duodenum (slide 209).'),
        set: { meal: 1 },
        watch: 'gallbladder',
        expect: [{ readout: 'gallbladder', change: 'down' }],
      },
    ],
  }),
};

export function withSimulation(lessonId: string, steps: Step[] | undefined): Step[] | undefined {
  return insertSimulation(steps, simulations[lessonId]);
}
