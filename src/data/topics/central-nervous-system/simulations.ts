// Physiology → Central Nervous System — one simulation per lesson (models
// in data/simulations/). Each starts with predictions: checkpoint
// questions answered BEFORE the model runs the change, recorded like any
// other checkpoint. Prediction IDs: sN-xx.
//
// A simulation goes just before a lesson's final recall prompt: learn the
// idea, play with it, then recall it.
import type { InteractiveDraft, QuestionDraft } from '@/data/topics/build';
import { mcq, simulate } from '@/data/topics/build';
import { bg, br, cb, mo, s1, s2, sc, type ConceptId } from '@/data/topics/central-nervous-system/sources';

type Step = InteractiveDraft<ConceptId>;

const DIRECTIONS = ['It increases', 'It decreases', 'It stays about the same'];

// "Which way will it go?" — always in the same order.
function direction(id: string, conceptId: ConceptId, prompt: string, answer: 'up' | 'down' | 'same', explanation: string): QuestionDraft<ConceptId> {
  return {
    id,
    type: 'choice',
    conceptId,
    prompt,
    options: DIRECTIONS,
    answer: answer === 'up' ? 0 : answer === 'down' ? 1 : 2,
    fixedOrder: true,
    explanation,
    skill: 'prediction',
    label: 'Predict',
  } as QuestionDraft<ConceptId>;
}

const predict = { skill: 'prediction' as const, label: 'Predict' };

export const simulations: Record<string, Step> = {
  // ─── Lesson 1 ──────────────────────────────────────────────────────
  'central-nervous-system-1': simulate({
    sim: 'receptor-adaptation',
    title: 'Inside a receptor',
    intro: 'Press on a receptor and watch the generator potential and the impulses it fires. Then hold the stimulus steady and see which receptors keep reporting it.',
    sourceRefs: s1([9, 10]),
    predictions: [
      {
        question: direction(
          's1-01',
          'generator-potential',
          'The stimulus on a touch receptor is made stronger, from 50% to 90%. What happens to the firing rate in its nerve fibre?',
          'up',
          'A stronger stimulus gives a bigger generator potential, so the fibre fires faster — and more receptors are recruited too (Sensory I, p. 9).'
        ),
        set: { strength: 90 },
        watch: 'frequency',
        expect: [
          { readout: 'frequency', change: 'up' },
          { readout: 'recruited', change: 'up' },
        ],
      },
      {
        question: mcq(
          's1-02',
          'adaptation-muller',
          'The same touch is held, unchanged, for 5 seconds. What happens to the firing?',
          'It falls to nothing — the receptor adapts',
          ['It stays the same, because the stimulus has not changed', 'It keeps increasing'],
          { ...predict, explanation: 'Touch receptors are rapid (phasic) adaptors: with a constant stimulus the generator potential falls below threshold (Sensory I, p. 10).' }
        ),
        set: { t: 5 },
        watch: 'frequency',
        expect: [{ readout: 'frequency', equals: 0 }],
      },
      {
        question: direction(
          's1-03',
          'adaptation-muller',
          'Still 5 seconds in, but now the receptor is a blood pressure receptor instead of a touch receptor. Compared with the touch receptor, its firing is…',
          'up',
          'Blood pressure receptors are slow (tonic) adaptors: they keep firing at nearly the same rate, reporting a steady state (Sensory I, p. 10).'
        ),
        from: { t: 5 },
        set: { receptor: 1 },
        watch: 'frequency',
        expect: [{ readout: 'frequency', change: 'up' }],
      },
    ],
  }),

  // ─── Lesson 2 ──────────────────────────────────────────────────────
  'central-nervous-system-2': simulate({
    sim: 'stretch-reflex',
    title: 'Tap the knee',
    intro: 'Tap the patellar tendon and follow the signal round the reflex arc. Then turn up γ discharge, cut a nerve root, or load the tendon.',
    sourceRefs: s1([12, 13, 24, 25, 26, 27]),
    predictions: [
      {
        question: direction(
          's2-01',
          'gamma-efferents',
          'The patient is anxious and γ-efferent discharge rises from 30% to 80%. Same tap. What happens to the knee jerk?',
          'up',
          'γ discharge contracts the ends of the intrafusal fibres, stretching the spindle’s middle: the same tap gives more Ia firing and a brisker jerk (Sensory I, pp. 24–25).'
        ),
        set: { gamma: 80 },
        watch: 'kick',
        expect: [
          { readout: 'kick', change: 'up' },
          { readout: 'ia', change: 'up' },
        ],
      },
      {
        question: mcq(
          's2-02',
          'stretch-reflex',
          'The dorsal root at this level is cut. The tendon is tapped. What happens?',
          'The spindle still fires, but there is no knee jerk',
          ['The spindle stops firing and the jerk is brisk', 'The knee jerk is normal — the motor root is intact'],
          { ...predict, explanation: 'The Ia afferent enters through the dorsal root. Cut it and the signal never reaches the α-motor neuron, even though the spindle still fires.' }
        ),
        set: { lesion: 1 },
        watch: 'kick',
        expect: [
          { readout: 'kick', equals: 0 },
          { readout: 'ia', change: 'same' },
        ],
      },
      {
        question: direction(
          's2-03',
          'gamma-efferents',
          'Before any tap, the hamstrings have a little background activity. The tendon is now tapped. What happens to hamstring activity?',
          'down',
          'Reciprocal innervation: Ia impulses also pass to the antagonist and inhibit it, so it relaxes (Sensory I, p. 25).'
        ),
        from: { tap: 0 },
        set: { tap: 5 },
        watch: 'hamstrings',
        expect: [{ readout: 'hamstrings', change: 'down' }],
      },
      {
        question: direction(
          's2-04',
          'inverse-stretch',
          'The quadriceps is pulling very hard against a heavy load (tendon tension 95%). What happens to the α-motor neuron’s firing?',
          'down',
          'High tension fires the Golgi tendon organ, which causes IPSPs in the motor neuron: the muscle relaxes before the tendon is damaged (Sensory I, pp. 26–27).'
        ),
        set: { tension: 95 },
        watch: 'alpha',
        expect: [{ readout: 'alpha', change: 'down' }],
      },
    ],
  }),

  // ─── Lesson 3 ──────────────────────────────────────────────────────
  'central-nervous-system-3': simulate({
    sim: 'sensory-tracts',
    title: 'Where do the pathways cross?',
    intro: 'Follow the dorsal column and spinothalamic pathways from each leg to the brain, then cut them in different places and examine both legs.',
    sourceRefs: [...s2([7, 9]), ...mo([10, 14])],
    predictions: [
      {
        question: mcq('s3-01', 'spinothalamic', 'The right half of the cord is cut at T10. Where is pain and temperature lost?', 'In the left leg', ['In the right leg', 'In both legs'], {
          ...predict,
          explanation: 'The left leg’s pain fibres cross in the cord just above where they enter and ascend on the right — through the cut (Sensory II, p. 9).',
        }),
        set: { lesion: 1 },
        watch: 'painL',
        expect: [
          { readout: 'painL', equals: 0 },
          { readout: 'painR', equals: 1 },
        ],
      },
      {
        question: mcq('s3-02', 'dorsal-columns', 'Only the right dorsal column is cut at T10. Where is vibration and joint position sense lost?', 'In the right leg', ['In the left leg', 'In both legs'], {
          ...predict,
          explanation: 'The dorsal columns ascend on the same side and cross only in the medulla (Sensory II, p. 7).',
        }),
        set: { lesion: 2 },
        watch: 'touchR',
        expect: [
          { readout: 'touchR', equals: 0 },
          { readout: 'touchL', equals: 1 },
        ],
      },
      {
        question: mcq('s3-03', 'dorsal-columns', 'A small stroke destroys the right thalamus. Which leg loses both vibration and pain sensation?', 'The left leg', ['The right leg', 'Neither — the thalamus only relays smell'], {
          ...predict,
          explanation: 'Above the medulla both pathways have crossed, and both relay in the thalamus — so everything from the left side is lost (Sensory II, pp. 7, 9).',
        }),
        set: { lesion: 5 },
        watch: 'touchL',
        expect: [
          { readout: 'touchL', equals: 0 },
          { readout: 'painL', equals: 0 },
          { readout: 'touchR', equals: 1 },
        ],
      },
    ],
  }),

  // ─── Lesson 4 ──────────────────────────────────────────────────────
  'central-nervous-system-4': simulate({
    sim: 'pain-gate',
    title: 'Stub your toe',
    intro: 'Watch fast and slow pain unfold over 20 seconds after an injury, then turn them down with rubbing and with the brain’s own analgesic system.',
    sourceRefs: s2([16, 17, 21, 22, 23, 24]),
    predictions: [
      {
        question: mcq('s4-01', 'pain-types', 'Ten seconds after the injury, which kind of pain is the main one?', 'Slow, burning pain carried by C fibres', ['Fast, sharp pain carried by Aδ fibres', 'Neither — pain receptors have adapted'], {
          ...predict,
          explanation: 'Fast pain is brief. Slow pain builds steadily because its transmitter, substance P, is slow to build up and slow to be destroyed (Sensory II, p. 21).',
        }),
        set: { t: 10 },
        watch: 'dominant',
        expect: [
          { readout: 'dominant', equals: 1 },
          { readout: 'slow', change: 'up' },
          { readout: 'fast', change: 'down' },
        ],
      },
      {
        question: direction('s4-02', 'pain-control', 'Ten seconds in, you rub the injured area hard. What happens to the pain felt?', 'down', 'Large touch fibres from the same area depress transmission of the pain signals — local suppression (Sensory II, p. 22).'),
        from: { t: 10 },
        set: { rubbing: 80 },
        watch: 'felt',
        expect: [{ readout: 'felt', change: 'down' }],
      },
      {
        question: direction('s4-03', 'pain-control', 'Instead of rubbing, the brain’s analgesic system is switched on strongly. What happens to the pain felt?', 'down', 'Endorphins, dynorphins and enkephalin act in the periaqueductal grey and the dorsal horn to suppress pain (Sensory II, pp. 23–24).'),
        from: { t: 10 },
        set: { analgesia: 80 },
        watch: 'felt',
        expect: [{ readout: 'felt', change: 'down' }],
      },
    ],
  }),

  // ─── Lesson 5 ──────────────────────────────────────────────────────
  'central-nervous-system-5': simulate({
    sim: 'dorsal-horn',
    title: 'Inside the dorsal horn',
    intro: 'Send touch and pain into the dorsal horn and watch which cells in which laminae answer — and how descending fibres turn the output down.',
    sourceRefs: sc([12, 13]),
    predictions: [
      {
        question: mcq('s5-01', 'dorsal-horn-laminae', 'Only light touch reaches the dorsal horn. Which cell stays silent?', 'The nociceptive-specific (NS) cell', ['The low-threshold (LT) cell', 'The wide-dynamic-range (WDR) cell'], {
          ...predict,
          explanation: 'NS cells respond only to noxious stimuli. LT cells (laminae III–VI) and WDR cells respond to touch (Spinal Cord, slide 13).',
        }),
        set: { touch: 60 },
        watch: 'ns',
        expect: [
          { readout: 'ns', equals: 0 },
          { readout: 'lt', change: 'up' },
          { readout: 'wdr', change: 'up' },
        ],
      },
      {
        question: direction('s5-02', 'dorsal-horn-laminae', 'With the touch still on, a pinprick is added. What happens to the WDR cell’s firing?', 'up', 'WDR cells receive both low-threshold (Aβ) and high-threshold (C, Aδ) input, so they sum the two (Spinal Cord, slide 13).'),
        from: { touch: 60 },
        set: { noxious: 60 },
        watch: 'wdr',
        expect: [{ readout: 'wdr', change: 'up' }],
      },
      {
        question: direction('s5-03', 'dorsal-horn-laminae', 'A pinprick is firing the dorsal horn. Descending fibres from the brainstem now become active. What happens to the pain signal sent up the spinothalamic tract?', 'down', 'The dorsal horn is not just a relay: descending fibres modulate pain transmission (Spinal Cord, slide 13).'),
        from: { noxious: 60 },
        set: { descending: 80 },
        watch: 'output',
        expect: [{ readout: 'output', change: 'down' }],
      },
    ],
  }),

  // ─── Lesson 6 ──────────────────────────────────────────────────────
  'central-nervous-system-6': simulate({
    sim: 'motor-lesion',
    title: 'Examine the leg',
    intro: 'Choose a lesion and examine the right leg — strength, tone, knee jerk, bulk — then move through the days after the injury.',
    sourceRefs: mo([14, 17, 18, 19]),
    predictions: [
      {
        question: mcq('s6-01', 'motor-lesions', 'The right femoral nerve was cut a month ago. What does the quadriceps look like?', 'Wasted and flaccid, with no knee jerk', ['Stiff, with a brisk knee jerk', 'Normal bulk, weak and spastic'], {
          ...predict,
          explanation: 'A lower motor neuron lesion: flaccid paralysis, atrophy, lost reflexes and fibrillation (Motor Activity, slide 19).',
        }),
        set: { lesion: 2 },
        watch: 'bulk',
        expect: [
          { readout: 'bulk', change: 'down' },
          { readout: 'reflex', equals: 0 },
          { readout: 'tone', equals: 0 },
        ],
      },
      {
        question: direction('s6-02', 'motor-lesions', 'Three days after a complete cord transection the knee jerk is absent. By day 30, what has happened to it?', 'up', 'Spinal shock depresses all reflexes below the cut for about 2 weeks; then they return, hyperactive, with spasticity (Motor Activity, slides 14, 17).'),
        from: { lesion: 3, days: 3 },
        set: { days: 30 },
        watch: 'reflex',
        expect: [{ readout: 'reflex', change: 'up' }],
      },
      {
        question: direction('s6-03', 'motor-lesions', 'A stroke in the left motor cortex weakens the right leg. Compared with normal, what happens to the bulk of the right quadriceps by day 30?', 'same', 'An upper motor neuron lesion: spastic paralysis without muscle atrophy — the lower motor neuron still supplies the muscle (Motor Activity, slide 19).'),
        set: { lesion: 1 },
        watch: 'bulk',
        expect: [
          { readout: 'bulk', change: 'same' },
          { readout: 'strength', change: 'down' },
        ],
      },
    ],
  }),

  // ─── Lesson 7 ──────────────────────────────────────────────────────
  'central-nervous-system-7': simulate({
    sim: 'cerebellar-reach',
    title: 'Finger to target',
    intro: 'Reach for a target and watch the finger’s path. Then take away cerebellar function and see how the reach changes — and what helps.',
    sourceRefs: cb([13, 16, 18]),
    predictions: [
      {
        question: direction('s7-01', 'cerebellum-function', 'Cerebellar function falls from 100% to 10%. Same reach. What happens to the overshoot?', 'up', 'The cerebellum damps the pendular movement; without it the finger overshoots — dysmetria and intention tremor (Cerebellum, slides 16, 18).'),
        set: { cerebellum: 10 },
        watch: 'overshoot',
        expect: [{ readout: 'overshoot', change: 'up' }],
      },
      {
        question: direction('s7-02', 'cerebellar-signs', 'With the cerebellum damaged, the patient reaches more slowly. What happens to the overshoot?', 'down', 'A slower movement leaves time for feedback to brake it; fast, ballistic movements depend most on the cerebellum’s preplanning (Cerebellum, slide 16).'),
        from: { cerebellum: 10, speed: 1 },
        set: { speed: 0.5 },
        watch: 'overshoot',
        expect: [{ readout: 'overshoot', change: 'down' }],
      },
    ],
  }),

  // ─── Lesson 8 ──────────────────────────────────────────────────────
  'central-nervous-system-8': simulate({
    sim: 'basal-ganglia',
    title: 'The brake on movement',
    intro: 'Run the basal ganglia as a brake. Take away dopamine, striatal neurons or the subthalamic nucleus and watch how a simple movement changes.',
    sourceRefs: bg([6, 7, 8, 9, 10]),
    predictions: [
      {
        question: direction('s8-01', 'bg-disorders', 'Dopamine from the substantia nigra falls to 20% (Parkinson’s disease). What happens to the speed of movement?', 'down', 'Without dopamine’s inhibition the caudate and putamen are overactive and there is too much brake: bradykinesia and difficulty starting movement (Basal Ganglia, slides 8–9).'),
        set: { dopamine: 20 },
        watch: 'speed',
        expect: [
          { readout: 'speed', change: 'down' },
          { readout: 'rigidity', change: 'up' },
        ],
      },
      {
        question: mcq('s8-02', 'bg-disorders', 'Instead, 70% of the striatum’s GABA and cholinergic neurons are lost (Huntington’s disease). What appears?', 'Unwanted, dance-like movements (chorea)', ['Rigidity and slowness', 'Nothing — the striatum is not needed for movement'], {
          ...predict,
          explanation: 'Loss of striatal GABA and cholinergic neurons removes brake: chorea — a hyperkinetic disorder (Basal Ganglia, slides 8–9).',
        }),
        set: { striatum: 30 },
        watch: 'involuntary',
        expect: [
          { readout: 'involuntary', change: 'up' },
          { readout: 'kind', equals: 1 },
        ],
      },
    ],
  }),

  // ─── Lesson 9 ──────────────────────────────────────────────────────
  'central-nervous-system-9': simulate({
    sim: 'brain-lesion',
    title: 'Lesion explorer',
    intro: 'Damage one part of the brain at a time and see which functions are affected, then work backwards from a patient to the lesion.',
    sourceRefs: br([7, 8, 10, 12, 13, 14, 19, 24, 28]),
    predictions: [
      {
        question: mcq('s9-01', 'brain-lobes', 'Broca’s area in the left frontal lobe is damaged. What does the patient find hardest?', 'Producing speech', ['Understanding speech', 'Seeing'], {
          ...predict,
          explanation: 'Broca’s aphasia is an inability to express language; understanding is a temporal (Wernicke) function (The Brain, slides 8, 10).',
        }),
        set: { region: 1 },
        watch: 'speak',
        expect: [
          { readout: 'speak', equals: 0 },
          { readout: 'understand', equals: 1 },
        ],
      },
      {
        question: mcq('s9-02', 'brain-lobes', 'Only the visual association area is destroyed. What happens?', 'She can see, but cannot recognise what she sees', ['She is blind', 'Nothing — the primary visual area is intact'], {
          ...predict,
          explanation: 'The Brain, slides 13–14: destroying the visuosensory centre causes blindness; destroying only the association area removes recognition.',
        }),
        set: { region: 7 },
        watch: 'recognise',
        expect: [
          { readout: 'recognise', equals: 0 },
          { readout: 'see', equals: 1 },
        ],
      },
      {
        question: mcq('s9-03', 'deep-structures', 'Both hippocampi are removed. What is lost?', 'The ability to form new memories', ['Memories of childhood', 'The ability to speak'], {
          ...predict,
          explanation: 'The hippocampus is needed to file new memories into long-term storage; old memories remain (The Brain, slide 28).',
        }),
        set: { region: 8 },
        watch: 'memory',
        expect: [{ readout: 'memory', equals: 0 }],
      },
    ],
  }),
};

// The lesson's interactive steps with its simulation added before the
// final recall prompt (or at the end if there is none).
export function withSimulation(lessonId: string, steps: Step[] | undefined): Step[] | undefined {
  const sim = simulations[lessonId];
  if (!steps || !sim) return steps;
  const last = steps[steps.length - 1];
  return last?.type === 'recall' ? [...steps.slice(0, -1), sim, last] : [...steps, sim];
}
