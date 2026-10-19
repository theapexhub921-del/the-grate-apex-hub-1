// Physiology → Special Senses — one simulation per lesson (models in data/simulations/). Each
// starts with predictions answered BEFORE the model runs the change. Prediction IDs: sN-xx.
import type { InteractiveDraft } from '@/data/topics/build';
import { mcq, simulate } from '@/data/topics/build';
import { av, cs, TOPIC_ID, vs, type ConceptId } from '@/data/topics/special-senses/sources';
import { direction, insertSimulation, predict } from '@/data/topics/sim-helpers';

type Step = InteractiveDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const simulations: Record<string, Step> = {
  [L(1)]: simulate({
    sim: 'aqueous-humour',
    title: 'Aqueous humour and eye pressure',
    intro: 'Change how much aqueous the ciliary epithelium makes and how well the trabecular meshwork drains it, close the filtration angle — and watch the pressure inside the real eye.',
    sourceRefs: vs([11, 12, 14]),
    predictions: [
      {
        question: direction('s1-01', 'aqueous-humour', 'The trabecular meshwork drains less aqueous. What happens to the intraocular pressure?', 'up', 'The pressure is set by the balance of production and drainage: with drainage reduced, aqueous builds up (slides 11–12).'),
        set: { drainage: 40 },
        watch: 'iop',
        expect: [{ readout: 'iop', change: 'up' }],
      },
      {
        question: direction('s1-02', 'aqueous-humour', 'The ciliary epithelium makes less aqueous while drainage is normal. What happens to the pressure?', 'down', 'Less production with the same drainage lowers the pressure — the basis of treatments that reduce aqueous production (slide 12).'),
        set: { production: 60 },
        watch: 'iop',
        expect: [{ readout: 'iop', change: 'down' }],
      },
      {
        question: mcq('s1-03', 'aqueous-humour', 'The iris suddenly closes the filtration angle. What happens to the optic nerve?', 'It is put at risk of damage as the pressure climbs', ['Nothing: the vitreous absorbs the extra fluid', 'The pressure falls and the eyeball softens'], {
          ...predict,
          explanation: 'Aqueous can no longer reach the trabecular meshwork and canal of Schlemm; the raised pressure damages the retina and optic nerve — glaucoma (slides 11–12).',
        }),
        set: { angle: 1 },
        watch: 'nerve',
        expect: [{ readout: 'nerve', equals: 2 }],
      },
    ],
  }),

  [L(2)]: simulate({
    sim: 'accommodation',
    title: 'Focusing near and far',
    intro: 'Move an object closer, age the eye, make it myopic or hyperopic and try lenses — and watch the lens change shape and where the light focuses.',
    sourceRefs: vs([16, 18, 22, 23, 24, 25]),
    predictions: [
      {
        question: direction('s2-01', 'accommodation', 'The object moves from 6 m to 30 cm. How much does the lens have to accommodate?', 'up', 'For a near object the ciliary muscle contracts, the zonules relax and the lens rounds, adding power (slide 18).'),
        set: { distance: 30 },
        watch: 'used',
        expect: [{ readout: 'used', change: 'up' }],
      },
      {
        question: mcq('s2-02', 'refractive-errors', 'In a myopic eye, where does light from a distant object focus?', 'In front of the retina', ['On the retina', 'Behind the retina'], {
          ...predict,
          explanation: 'The eye has too much power (too long, or the cornea or lens too strong), so light focuses in front of the retina; a biconcave lens corrects it (slides 23–24).',
        }),
        set: { eye: 1 },
        watch: 'focus',
        expect: [{ readout: 'focus', equals: 0 }],
      },
      {
        question: mcq('s2-03', 'accommodation', 'A 60-year-old with otherwise normal eyes tries to read at 30 cm. What happens?', 'The print blurs: light focuses behind the retina', ['It is perfectly sharp', 'Light focuses in front of the retina'], {
          ...predict,
          explanation: 'With age the lens and ciliary muscle lose elasticity, so accommodation fails — presbyopia, corrected with bifocals (slide 22).',
        }),
        from: { distance: 30 },
        set: { age: 60 },
        watch: 'focus',
        expect: [{ readout: 'focus', equals: 2 }],
      },
    ],
  }),

  [L(3)]: simulate({
    sim: 'phototransduction',
    title: 'From light to signal',
    intro: 'Shine light on a rod or a cone and follow the cascade: cGMP, the CNG channels, the membrane potential and glutamate release. Then take away vitamin A.',
    sourceRefs: vs([47, 48, 49, 51, 52, 58, 83]),
    predictions: [
      {
        question: direction('s3-01', 'phototransduction', 'Light falls on a rod. What happens to its membrane potential?', 'down', 'Light → metarhodopsin II → transducin → phosphodiesterase → cGMP falls → CNG channels close → the cell hyperpolarises from about −30 towards −90 mV (slides 51–52).'),
        set: { light: 3 },
        watch: 'potential',
        expect: [
          { readout: 'potential', change: 'down' },
          { readout: 'cgmp', change: 'down' },
        ],
      },
      {
        question: direction('s3-02', 'phototransduction', 'And its release of glutamate?', 'down', 'Depolarised in the dark, the photoreceptor releases glutamate; hyperpolarised by light, it releases less (slides 49, 52).'),
        set: { light: 3 },
        watch: 'glutamate',
        expect: [{ readout: 'glutamate', change: 'down' }],
      },
      {
        question: direction('s3-03', 'photopigment-recovery', 'In dim light, a rod short of vitamin A is compared with a normal rod. How large is its hyperpolarisation?', 'down', 'Rhodopsin is regenerated from retinol (vitamin A); without it rods lose their sensitivity — night blindness (slides 58, 83).'),
        from: { light: 1.5 },
        set: { vitaminA: 0 },
        watch: 'response',
        expect: [{ readout: 'response', change: 'down' }],
      },
    ],
  }),

  [L(4)]: simulate({
    sim: 'visual-fields',
    title: 'Lesions of the optic pathway',
    intro: 'Cut the pathway at the optic nerve, the chiasm, the optic tract or the optic radiation, and see which parts of each eye’s field are lost.',
    sourceRefs: vs([68, 69, 71, 72]),
    predictions: [
      {
        question: mcq('s4-01', 'field-defects', 'A pituitary tumour presses on the centre of the optic chiasm. Which fields are lost?', 'Both temporal fields (bitemporal hemianopia)', ['Both nasal fields', 'The left half of each field'], {
          ...predict,
          explanation: 'Only the nasal fibres cross at the chiasm, and they carry the temporal fields (slides 68, 71).',
        }),
        set: { lesion: 2 },
        watch: 'defect',
        expect: [{ readout: 'defect', equals: 2 }],
      },
      {
        question: mcq('s4-02', 'field-defects', 'The right optic tract is damaged. What does the patient lose?', 'The left half of the field in both eyes', ['The right half of the field in both eyes', 'All of the right eye'], {
          ...predict,
          explanation: 'Behind the chiasm the right tract carries fibres from the right half of each retina — the left half of the field: left homonymous hemianopia (slide 71).',
        }),
        set: { lesion: 3 },
        watch: 'defect',
        expect: [{ readout: 'defect', equals: 3 }],
      },
      {
        question: direction('s4-03', 'optic-pathway', 'The right optic nerve is cut. How much of the right eye’s field is lost?', 'up', 'In front of the chiasm all of the right eye’s fibres run in its own optic nerve: the right eye is blind (slide 71).'),
        set: { lesion: 1 },
        watch: 'lostRight',
        expect: [
          { readout: 'lostRight', change: 'up' },
          { readout: 'lostLeft', change: 'same' },
        ],
      },
    ],
  }),

  [L(5)]: simulate({
    sim: 'pupil-reflex',
    title: 'The pupillary light reflex',
    intro: 'Shine a torch into one eye and watch both pupils. Then cut an optic nerve, an oculomotor nerve, or put atropine in one eye.',
    sourceRefs: vs([86, 87, 88, 89]),
    predictions: [
      {
        question: direction('s5-01', 'pupil', 'A torch is shone into the right eye only. What happens to the left pupil?', 'down', 'The pretectal nucleus signals both Edinger–Westphal nuclei, so the unlit pupil constricts too — the consensual reflex (slides 87–88).'),
        set: { light: 1 },
        watch: 'left',
        expect: [
          { readout: 'left', change: 'down' },
          { readout: 'right', change: 'down' },
        ],
      },
      {
        question: direction('s5-02', 'pupil', 'The right optic nerve is cut and the torch shines into the right eye. Compared with the dim room, what does the left pupil do?', 'same', 'The signal never leaves the right eye, so neither Edinger–Westphal nucleus is driven: no direct and no consensual reflex (slide 88).'),
        from: { lesion: 1 },
        set: { light: 1 },
        watch: 'left',
        expect: [{ readout: 'left', change: 'same' }],
      },
      {
        question: mcq('s5-03', 'pupil', 'The right oculomotor nerve is cut. A torch shines into the left eye. What does the right pupil do?', 'Stays dilated', ['Constricts normally', 'Constricts more than the left'], {
          ...predict,
          explanation: 'The parasympathetic fibres to the constrictor travel in III to the ciliary ganglion; without them the right pupil cannot constrict, whatever eye is lit (slides 88–89).',
        }),
        from: { lesion: 2 },
        set: { light: 2 },
        watch: 'right',
        expect: [{ readout: 'right', equals: 7.5 }],
      },
    ],
  }),

  [L(6)]: simulate({
    sim: 'sound-transmission',
    title: 'Sound through the ear',
    intro: 'Turn the volume up, change the pitch, and block the canal or stiffen the ossicles — and watch the eardrum, the ossicles, the cochlea and the basilar membrane.',
    sourceRefs: av([2, 14, 30, 31, 32, 33]),
    predictions: [
      {
        question: direction('s6-01', 'sound-transmission', 'The ossicles become fixed. What happens to the sound reaching the cochlea?', 'down', 'The ossicles match the impedance of air to the inner-ear fluid; without them most of the sound is reflected (slide 32).'),
        set: { ear: 4 },
        watch: 'atCochlea',
        expect: [{ readout: 'atCochlea', change: 'down' }],
      },
      {
        question: direction('s6-02', 'cochlea', 'The pitch rises from 1 kHz to 8 kHz. Where does the wave peak on the basilar membrane?', 'down', 'High frequencies peak near the narrow, stiff base; low frequencies near the wide, flexible apex (slide 14). The distance from the base gets smaller.'),
        set: { freq: 6 },
        watch: 'place',
        expect: [{ readout: 'place', change: 'down' }],
      },
      {
        question: mcq('s6-03', 'sound', 'Sound reaches 120 dB, as at a rock concert. What is the risk?', 'It can damage hearing', ['None, if it is brief', 'It cannot be heard at all'], {
          ...predict,
          explanation: 'Any sound above 85 dB can damage hearing; 140 dB causes immediate damage and pain (slide 30).',
        }),
        set: { level: 120, freq: 5 },
        watch: 'danger',
        expect: [{ readout: 'danger', equals: 1 }],
      },
    ],
  }),

  [L(7)]: simulate({
    sim: 'hearing-loss',
    title: 'Hearing loss on the audiogram',
    intro: 'Test each ear across the frequencies: wax, infection, noise, ageing, a nerve tumour, or a stroke above the cochlear nuclei.',
    sourceRefs: av([44, 48, 49, 50, 51]),
    predictions: [
      {
        question: direction('s7-01', 'deafness', 'Wax blocks the right ear canal. What happens to the gap between air- and bone-conduction thresholds?', 'up', 'The blockage is in the outer ear: air-conducted sound is reduced but bone conduction bypasses it — a conductive loss (slides 49–50).'),
        set: { condition: 1 },
        watch: 'gap',
        expect: [
          { readout: 'gap', change: 'up' },
          { readout: 'type', equals: 1 },
        ],
      },
      {
        question: direction('s7-02', 'deafness', 'Years of loud noise. What happens to the threshold at 4 kHz?', 'up', 'Loud noise damages the inner-ear hair cells: a permanent sensorineural loss (slide 50).'),
        set: { condition: 3 },
        watch: 'at4k',
        expect: [{ readout: 'at4k', change: 'up' }],
      },
      {
        question: direction('s7-03', 'auditory-pathway', 'A stroke damages the left auditory cortex. What happens to the right ear’s thresholds?', 'same', 'Above the cochlear nuclei the pathway is bilateral, so a lesion there does not cause one-sided deafness (slide 44).'),
        set: { condition: 6 },
        watch: 'air',
        expect: [{ readout: 'air', change: 'same' }],
      },
    ],
  }),

  [L(8)]: simulate({
    sim: 'vestibular',
    title: 'Spinning and stopping',
    intro: 'Turn the head, keep turning, then stop — and watch the cupula inside the ampulla, the nerve firing and what you feel. Then accelerate in a car or a lift.',
    sourceRefs: av([54, 55, 56, 57, 62, 68, 71, 72]),
    predictions: [
      {
        question: direction('s8-01', 'semicircular-canals', 'The head starts turning to the right. What happens to the firing of the right horizontal canal?', 'up', 'The endolymph lags, bending the cupula towards the kinocilium: the hair cells depolarise and the firing rises above its resting rate (slides 56–57).'),
        set: { phase: 1 },
        watch: 'right',
        expect: [
          { readout: 'right', change: 'up' },
          { readout: 'left', change: 'down' },
        ],
      },
      {
        question: direction('s8-02', 'semicircular-canals', 'After 30 seconds of steady turning, how does the right canal’s firing compare with when the head was still?', 'same', 'The canals sense angular acceleration: once the endolymph moves with the head, the cupula straightens and firing returns to its resting rate.'),
        set: { phase: 2 },
        watch: 'right',
        expect: [{ readout: 'right', change: 'same' }],
      },
      {
        question: mcq('s8-03', 'vestibular-pathway', 'The person stops after spinning right. What do they feel?', 'As if turning left, with dizziness and nystagmus', ['Nothing — they have stopped', 'As if still turning right'], {
          ...predict,
          explanation: 'The endolymph keeps moving and bends the cupula the other way; the disturbance brings dizziness and nystagmus (slides 56, 72).',
        }),
        set: { phase: 3 },
        watch: 'sense',
        expect: [{ readout: 'sense', equals: 2 }],
      },
    ],
  }),

  [L(9)]: simulate({
    sim: 'taste',
    title: 'Five tastes',
    intro: 'Pick a taste and a concentration, touch the front or the back of the tongue, and block the G-protein pathway — and follow the signal to the brain.',
    sourceRefs: cs([5, 9, 12, 15, 17, 18, 19, 20, 24]),
    predictions: [
      {
        question: direction('s9-01', 'taste-transduction', 'The gustducin–PLC-β2–TRPM5 pathway is blocked. What happens to the response to sugar?', 'down', 'Sweet is detected by T1R2 + T1R3 receptors on type II cells, which signal through gustducin, PLC-β2 and TRPM5 (slide 18).'),
        set: { block: 1 },
        watch: 'firing',
        expect: [{ readout: 'firing', change: 'down' }],
      },
      {
        question: direction('s9-02', 'taste-transduction', 'With the same block, salt is placed on the tongue instead. Compared with salt without the block, what is the response?', 'same', 'Salty taste uses an Na⁺ ion channel on type I cells, not the G-protein pathway (slide 17).'),
        from: { taste: 0 },
        set: { block: 1 },
        watch: 'firing',
        expect: [{ readout: 'firing', change: 'same' }],
      },
      {
        question: mcq('s9-03', 'taste-pathway', 'A bitter drug touches the back third of the tongue. Which nerve carries the taste?', 'Glossopharyngeal (IX)', ['Facial (VII)', 'Hypoglossal (XII)'], {
          ...predict,
          explanation: 'Taste from the front two-thirds runs in the facial nerve, from the back third in the glossopharyngeal, and from further back in the vagus — all to the nucleus of the solitary tract (slide 24).',
        }),
        set: { taste: 3, place: 1 },
        watch: 'nerve',
        expect: [{ readout: 'nerve', equals: 1 }],
      },
    ],
  }),

  [L(10)]: simulate({
    sim: 'smell',
    title: 'Smell',
    intro: 'Change the odour’s strength, give the nose a heavy cold, or fracture the cribriform plate — and follow the signal from the receptors to the limbic system.',
    sourceRefs: cs([28, 29, 30, 31, 32, 33]),
    predictions: [
      {
        question: direction('s10-01', 'olfactory-transduction', 'The odour becomes much stronger. What happens to the receptors’ firing?', 'up', 'More odorant binds more receptors → more cAMP → more cation channels open: the firing rate depends on the concentration (slides 30–31).'),
        set: { odour: 5 },
        watch: 'firing',
        expect: [{ readout: 'firing', change: 'up' }],
      },
      {
        question: direction('s10-02', 'olfactory-epithelium', 'A heavy cold coats the epithelium in thick mucus. What happens to the firing?', 'down', 'Odorants must dissolve in the mucus to reach the cilia; with thick mucus far fewer arrive (slide 28).'),
        set: { cold: 1 },
        watch: 'firing',
        expect: [{ readout: 'firing', change: 'down' }],
      },
      {
        question: mcq('s10-03', 'olfactory-pathway', 'A head injury fractures the cribriform plate. The receptors still fire. What does the person smell?', 'Nothing', ['Everything, but more weakly', 'Smells only on one side'], {
          ...predict,
          explanation: 'The receptor axons form the olfactory nerve, which passes through the cribriform plate to the olfactory bulb; torn there, no signal reaches the brain (slide 32).',
        }),
        set: { fracture: 1 },
        watch: 'perceived',
        expect: [{ readout: 'perceived', equals: 0 }],
      },
    ],
  }),
};

export function withSimulation(lessonId: string, steps: Step[] | undefined): Step[] | undefined {
  return insertSimulation(steps, simulations[lessonId]);
}
