// Physiology → Central Nervous System — layer 1 (learn by answering) and
// reading-layer extras. Checkpoint IDs: cN-xx; recall prompts: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, fill, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { bg, br, cb, mo, pn, s1, s2, sc, type ConceptId } from '@/data/topics/central-nervous-system/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  // ─── Lesson 1 — Organisation and sensory receptors ─────────────────
  'central-nervous-system-1': [
    ask(
      mcq('c1-01', 'cns-organisation', 'A cluster of neuronal cell bodies with a similar function sits just outside the spinal cord, on the dorsal root. What is it called?', 'A ganglion', ['A nucleus (of cell bodies)', 'A tract', 'A nerve'], {
        explanation: 'A ganglion is cell bodies outside the CNS (the dorsal root ganglion holds sensory cell bodies). A nucleus is the same thing inside the CNS (Sensory I, p. 2; Spinal Cord, slide 2).',
        skill: 'terminology',
      })
    ),
    learn('Receptors are transducers', [
      'Receptors convert a stimulus — mechanical, thermal, chemical or electromagnetic — into nerve impulses. Each has an adequate stimulus it responds to best.',
      'Classified by stimulus: mechano-, thermo-, noci-, electromagnetic and chemoreceptors. By source: tele-, extero-, intero- (visceral) and proprioceptors.',
    ], { sourceRefs: s1([4, 6]) }),
    ask(
      match('c1-02', 'receptor-classes', 'Match each receptor to what it detects.', [
        ['Mechanoreceptor', 'Deformation of the receptor or nearby cells'],
        ['Nociceptor', 'Physical or chemical tissue damage'],
        ['Chemoreceptor', 'Osmolality, CO₂ and oxygen levels'],
        ['Electromagnetic receptor', 'Light on the retina'],
      ], { explanation: 'Sensory I, p. 6.' })
    ),
    learn('From stimulus to signal', ['Stimulus → generator potential (a graded, EPSP-like potential) → summation → action potentials in the afferent nerve. A stronger stimulus recruits more receptors and raises the firing frequency.'], {
      sourceRefs: s1([9]),
    }),
    ask(
      multi('c1-03', 'generator-potential', 'How is a stronger stimulus signalled to the CNS? Select all that apply.', ['More receptors are stimulated', 'Action potentials fire at a higher frequency'], ['Each action potential becomes bigger', 'The impulses travel faster'], {
        explanation: 'Sensory I, p. 9. Action potentials are all-or-none, so intensity is coded by number of receptors and frequency.',
        skill: 'cause-effect',
      })
    ),
    ask(
      mcq('c1-04', 'adaptation-muller', 'You put on a watch and soon stop feeling it, yet your carotid baroreceptors keep reporting blood pressure all day. Why the difference?', 'Touch receptors adapt rapidly (phasic); BP receptors adapt slowly (tonic)', ['Touch receptors are damaged by the steady pressure of the watch', 'Baroreceptors are pain receptors, which never adapt at all', 'Touch signals from the wrist cannot reach the cerebral cortex'], {
        explanation: 'Sensory I, p. 10: rapid (phasic) adaptors — touch, smell; slow (tonic) — lung inflation, BP, temperature.',
        skill: 'application',
      })
    ),
    ask(
      mcq('c1-05', 'adaptation-muller', 'A tumour irritates the sensory nerve from the thumb partway along its course. Where does the patient feel the sensation?', 'In the thumb', ['Where the tumour is', 'Nowhere — only the receptor can start a sensation', 'Over the whole arm'], {
        explanation: 'Müller’s doctrine (Sensory I, p. 10): a signal started anywhere along the pathway is projected as coming from the receptors.',
        skill: 'prediction',
      })
    ),
    recall('r1-01', 'generator-potential', 'Explain how a stimulus on a receptor becomes a train of action potentials, and how the CNS can tell a weak stimulus from a strong one.', [
      'The stimulus produces a local, graded generator potential in the receptor (like an EPSP).',
      'Generator potentials summate; when threshold is reached, action potentials fire in the afferent nerve.',
      'A stronger stimulus stimulates more receptors and increases the frequency of action potentials.',
      'With a constant stimulus the frequency falls over time — adaptation, fast in phasic and slow in tonic receptors.',
    ], s1([9, 10])),
  ],

  // ─── Lesson 2 — Reflexes ───────────────────────────────────────────
  'central-nervous-system-2': [
    ask(
      order('c2-01', 'reflex-arc', 'Put the parts of a reflex arc in order.', ['Receptor', 'Afferent neuron', 'Integrating centre', 'Efferent neuron', 'Effector organ'], {
        explanation: 'Sensory I, p. 11.',
      })
    ),
    learn('The muscle spindle', [
      '2–10 intrafusal fibres (nuclear bag and nuclear chain) in a capsule, in parallel with the extrafusal fibres.',
      'Ia annulospiral endings wrap bag and chain fibres; II flower-spray endings are on chain fibres only. Motor supply: γ-efferents.',
    ], { sourceRefs: s1([14]) }),
    ask(
      mcq('c2-02', 'stretch-reflex', 'Why is the knee jerk called monosynaptic?', 'The spindle afferent synapses directly on the α-motor neuron', ['Only one muscle fibre contracts in the quadriceps', 'It uses one inhibitory interneuron between afferent and motor neuron', 'Only one spinal segment supplies the whole knee'], {
        explanation: 'Sensory I, pp. 12–13: afferent → α-motor neuron, one synapse.',
        skill: 'cause-effect',
      })
    ),
    learn('γ sets the gain', ['γ discharge contracts the ends of the intrafusal fibres, stretching the middle of the spindle. The spindle becomes more sensitive, so the same stretch gives more afferent firing and a stronger contraction.'], {
      sourceRefs: s1([24]),
    }),
    ask(
      mcq('c2-03', 'gamma-efferents', 'A nervous student’s knee jerks are brisk. What explains it?', 'Descending signals raise γ discharge, making the spindles more sensitive', ['Anxiety damages the Golgi tendon organs, removing their inhibition', 'Anxiety blocks the α-motor neurons until the reflex suddenly bursts through', 'The spindles stop adapting because adrenaline acts on them directly'], {
        explanation: 'Sensory I, p. 25: γ-efferents are controlled by descending tracts; hyperactive reflexes can be seen in anxious people. Jendrassik’s manoeuvre works the same way.',
        skill: 'application',
      })
    ),
    ask(
      mcq('c2-04', 'gamma-efferents', 'When the biceps is reflexly made to contract, what happens to the triceps?', 'It is inhibited and relaxes', ['It contracts too, to steady the elbow', 'It is unaffected by the biceps reflex', 'It goes into spasm to oppose the biceps'], {
        explanation: 'Reciprocal innervation (Sensory I, p. 25): Ia impulses pass to the antagonist to inhibit it.',
        skill: 'prediction',
      })
    ),
    learn('The Golgi tendon organ', ['In series with the extrafusal fibres, it senses tension. Strong contraction or excessive stretch fires it; its impulses cause IPSPs in the motor neurons and the muscle relaxes — the inverse stretch reflex, protecting the tendon.'], {
      sourceRefs: s1([26, 27]),
    }),
    ask(
      fill('c2-05', 'inverse-stretch', 'The receptor for the inverse stretch reflex is the ____.', ['Golgi tendon organ', 'golgi tendon organ', 'Golgi tendon organs', 'GTO'], {
        explanation: 'Sensory I, p. 27: 3–25 fibres per tendon organ, in series with the extrafusal fibres.',
        skill: 'terminology',
      })
    ),
    recall('r2-01', 'stretch-reflex', 'Compare the muscle spindle and the Golgi tendon organ: where each lies, what it senses and what its reflex does.', [
      'Spindle: intrafusal fibres in parallel with the extrafusal fibres; senses stretch (length).',
      'Its Ia afferent excites the α-motor neuron directly → the muscle contracts (stretch reflex, monosynaptic); antagonists are inhibited.',
      'Its sensitivity is set by γ-efferents from descending tracts.',
      'Golgi tendon organ: in series, in the tendon; senses tension.',
      'Its impulses cause IPSPs in motor neurons → the muscle relaxes (inverse stretch reflex), protecting the tendon.',
    ], s1([12, 14, 24, 26, 27])),
  ],

  // ─── Lesson 3 — Somatic sensation and pathways ─────────────────────
  'central-nervous-system-3': [
    ask(
      match('c3-01', 'sensation-types', 'Match each afferent fibre to what it carries.', [
        ['Aβ — large, myelinated', 'Mechanical'],
        ['Aδ — small, myelinated', 'Mechanical, thermal and noxious'],
        ['C — unmyelinated', 'Pain and temperature'],
      ], { explanation: 'Sensory I, p. 30.' })
    ),
    learn('Two ways up', [
      'Dorsal columns: fine touch, proprioception, vibration. Ascend on the same side; cross in the medulla; thalamus; cortex.',
      'Spinothalamic: pain, temperature (lateral) and crude touch (ventral). Cross in the spinal cord; thalamus.',
    ], { sourceRefs: s2([7, 9]) }),
    ask(
      mcq('c3-02', 'dorsal-columns', 'Where does the dorsal column pathway cross to the other side?', 'In the medulla', ['In the spinal cord, at the level of entry', 'In the thalamus', 'It never crosses'], {
        explanation: 'Sensory II, p. 7: ipsilateral transmission, crossing at the level of the medulla.',
      })
    ),
    ask(
      mcq('c3-03', 'spinothalamic', 'A knife cuts the right half of the spinal cord at T10. Where is pain and temperature lost?', 'In the left leg', ['In the right leg', 'In both legs', 'In the right arm'], {
        explanation: 'The spinothalamic fibres have already crossed in the cord below the cut, so the right tract carries the left side (Sensory II, p. 9; Motor Activity, slide 14).',
        skill: 'pathway-reasoning',
      })
    ),
    ask(
      mcq('c3-04', 'dorsal-columns', 'Same lesion — right half of the cord at T10. Where is vibration and joint position sense lost?', 'In the right leg', ['In the left leg', 'In both legs', 'Nowhere — it crosses higher up'], {
        explanation: 'The dorsal columns ascend on the same side until the medulla.',
        skill: 'pathway-reasoning',
      })
    ),
    learn('The sensory cortex', ['Postcentral gyrus (SI, SII). The homunculus is upside down, and each part’s area matches its number of receptors. Removing it: poor localisation, astereognosis, cannot judge weight, pressure or texture.'], {
      sourceRefs: s2([3, 5]),
    }),
    ask(
      fill('c3-05', 'sensory-cortex', 'Inability to recognise an object’s shape by touch is called ____.', ['astereognosis', 'Astereognosis'], {
        explanation: 'Sensory II, p. 3.',
        skill: 'terminology',
      })
    ),
    ask(
      mcq('c3-06', 'temperature', 'A hand is held in water at 47 °C. What does the person feel?', 'Pain — above 45 °C pain replaces temperature', ['Warmth that soon fades by adaptation', 'Cold, as the cold receptors fire paradoxically', 'Nothing — temperature receptors adapt fully at this heat'], {
        explanation: 'Sensory II, p. 15: no adaptation above 40 °C; above 45 °C tissue damage and pain.',
        skill: 'prediction',
      })
    ),
    recall('r3-01', 'spinothalamic', 'Explain why a lesion of one half of the spinal cord loses some sensations on the same side and others on the opposite side.', [
      'Fine touch, vibration and proprioception travel in the dorsal columns, which ascend on the same side and cross only in the medulla — so they are lost on the side of the lesion.',
      'Pain, temperature and crude touch travel in the spinothalamic tracts, which cross in the spinal cord near the level of entry — so they are lost on the opposite side.',
      'This is the Brown-Séquard pattern.',
    ], [...s2([7, 9]), ...mo([14])]),
  ],

  // ─── Lesson 4 — Pain ───────────────────────────────────────────────
  'central-nervous-system-4': [
    ask(
      mcq('c4-01', 'pain-types', 'You stub your toe: a sharp jab, then a few seconds later a deep, throbbing ache. Which fibres carry the ache?', 'C fibres', ['Aδ fibres', 'Aβ fibres', 'γ-efferents'], {
        explanation: 'Sensory II, p. 17: fast, sharp pain — Aδ; slow, burning, gnawing pain — C.',
        skill: 'application',
      })
    ),
    learn('Pain barely adapts', ['Pain receptors are free nerve endings. They adapt very little, and prolonged stimulation may increase their excitation. Pain chemicals: bradykinin, histamine, K⁺, proteolytic enzymes, acids, prostaglandins.'], {
      sourceRefs: s2([17, 18]),
    }),
    ask(
      multi('c4-02', 'pain-features', 'Which chemicals cause pain (Sensory II, p. 18)? Select all that apply.', ['Bradykinin', 'Histamine', 'K⁺', 'Prostaglandins'], ['Enkephalin', 'Dopamine'], {
        explanation: 'Sensory II, p. 18. Enkephalin is one of the brain’s own opiates — it reduces pain.',
      })
    ),
    learn('The slow pathway', ['C fibres → laminae II and III → relay to lamina V → cross → paleospinothalamic tract → mostly brainstem (reticular nuclei, tectum, periaqueductal grey); only 10–25% reach the thalamus. Transmitter: substance P — slow to build up and slow to clear.'], {
      sourceRefs: s2([21]),
    }),
    ask(
      mcq('c4-03', 'pain-pathways', 'Why does slow pain build up gradually and last long after the injury?', 'Its transmitter, substance P, is slow to build up and slow to be destroyed', ['C fibres are thickly myelinated, so the signal is delayed at each node', 'It travels in the dorsal columns, which relay slowly through the medulla', 'It is relayed through the cerebellum and red nucleus before reaching the cortex'], {
        explanation: 'Sensory II, p. 21.',
        skill: 'cause-effect',
      })
    ),
    ask(
      mcq('c4-04', 'pain-control', 'Why does rubbing a bumped elbow ease the pain?', 'Large tactile fibres from the same area inhibit transmission of the pain signals', ['Rubbing releases bradykinin, which blocks the nociceptors', 'Rubbing blocks the thalamus from relaying the pain signals', 'Rubbing speeds up the C fibres so the pain passes more quickly'], {
        explanation: 'Local suppression (Sensory II, p. 22): stimulating large sensory fibres depresses pain transmission from the same area, by pre- or post-synaptic inhibition.',
        skill: 'cause-effect',
      })
    ),
    ask(
      multi('c4-05', 'pain-control', 'Which belong to the brain’s analgesic system? Select all that apply.', ['Periaqueductal grey area', 'Raphe magnus nucleus', 'Pain-inhibiting complex in the dorsal horn'], ['Substantia nigra', 'Dentate nucleus'], {
        explanation: 'Sensory II, p. 24.',
      })
    ),
    ask(
      mcq('c4-06', 'referred-pain', 'A patient with a headache asks why “the brain hurts”. Which statement is correct?', 'The brain itself is insensitive; the pain comes from structures like the venous sinuses, tentorium and meninges', ['Neurons in the cerebral cortex carry many pain receptors of their own, so any swelling of the brain itself hurts', 'Headache is always caused by a tumour pressing on the brain tissue', 'Headache travels to the cortex in the dorsal columns of the cord'], {
        explanation: 'Sensory II, p. 28: headache is usually referred pain from deep structures.',
        clinical: true,
      })
    ),
    recall('r4-01', 'pain-pathways', 'Contrast the fast and slow pain pathways from receptor to brain.', [
      'Fast: Aδ fibres → dorsal horn → cross → neospinothalamic tract → thalamus → sensory cortex. Sharp, well localised.',
      'Slow: C fibres → laminae II/III → relay to lamina V → cross → paleospinothalamic tract → reticular nuclei, tectum and periaqueductal grey; only 10–25% reach the thalamus.',
      'Slow pain uses substance P: slow onset, increasing intensity, long-lasting.',
    ], [...s2([20, 21]), ...pn([2, 3])]),
  ],

  // ─── Lesson 5 — The spinal cord ────────────────────────────────────
  'central-nervous-system-5': [
    ask(
      mcq('c5-01', 'cord-structure', 'Where in the spinal cord are the cell bodies of motor neurons and the synapses of reflexes?', 'In the grey matter', ['In the white matter', 'In the dorsal root ganglion', 'In the meninges'], {
        explanation: 'Spinal Cord, slides 3–4: grey matter holds cell bodies and synapses; white matter is myelinated tracts.',
      })
    ),
    learn('31 pairs of spinal nerves', ['8 cervical, 12 thoracic, 5 lumbar, 5 sacral, 1 coccygeal. C1 exits between skull and atlas; C8 between C7 and T1; all the rest exit below their vertebra. The cord itself ends at about L2.'], {
      sourceRefs: sc([4, 5]),
    }),
    ask(
      fill('c5-02', 'cord-structure', 'How many pairs of cervical spinal nerves are there? ____', ['8', 'eight'], {
        explanation: 'Spinal Cord, slide 5: C1–C8, though there are only seven cervical vertebrae.',
      })
    ),
    ask(
      mcq('c5-03', 'cord-tracts', 'A tract is called the “spinocerebellar” tract. What can you tell from its name?', 'It is sensory, running from the spinal cord to the cerebellum', ['It is motor, running from the cerebellum to the spinal cord', 'It is a plexus of spinal nerves that runs up beside the cerebellum', 'It is a cranial nerve that leaves the brainstem'], {
        explanation: 'Spinal Cord, slide 8: spino- first means it starts in the cord and ascends; the ending names its destination.',
        skill: 'application',
      })
    ),
    learn('The dorsal horn is layered', ['Laminae I–II (II = substantia gelatinosa): nociceptor input from C and Aδ; NS and WDR cells. Laminae III–VI: Aβ touch input; low-threshold cells. Some lamina V cells are WDR, receiving both.'], {
      sourceRefs: sc([12, 13]),
    }),
    ask(
      mcq('c5-04', 'dorsal-horn-laminae', 'A dorsal horn cell fires to light touch and fires even harder to a pinprick. What kind of cell is it?', 'Wide dynamic range (WDR)', ['Nociceptive-specific (NS)', 'Low-threshold (LT)', 'A γ-motor neuron'], {
        explanation: 'Spinal Cord, slide 13: WDR cells respond to both innocuous and noxious stimuli.',
        skill: 'application',
      })
    ),
    ask(
      match('c5-05', 'plexuses', 'Match each nerve to its plexus.', [
        ['Phrenic', 'Cervical'],
        ['Median', 'Brachial'],
        ['Femoral', 'Lumbar'],
        ['Sciatic', 'Sacral'],
      ], { explanation: 'Spinal Cord, slide 11.' })
    ),
    recall('r5-01', 'dorsal-horn-laminae', 'Describe the laminae of the dorsal horn: which fibres arrive in each and what kinds of cell they contain.', [
      'Lamina I: large cells whose axons join the spinothalamic tract, with small inhibitory interneurons.',
      'Lamina II (substantia gelatinosa): mostly inhibitory cells; controls the connectivity of the other laminae.',
      'Laminae I–II (superficial dorsal horn): input from C and Aδ nociceptors; NS and WDR cells.',
      'Laminae III–VI: input from Aβ non-nociceptive fibres; low-threshold cells. Some lamina V cells are WDR.',
      'The dorsal horn modulates pain, not just relays it.',
    ], sc([12, 13])),
  ],

  // ─── Lesson 6 — Motor cortex and descending control ────────────────
  'central-nervous-system-6': [
    ask(
      mcq('c6-01', 'final-common-path', 'Why are the spinal and cranial motor neurons called the “final common pathway”?', 'Every motor command — cortical, brainstem, reflex — must pass through them to reach muscle', ['They are the last neurons in the nervous system to develop before birth', 'They are shared by both sides of the body, so commands from each side converge', 'They carry all sensation back from the muscles to the brain and cerebellum'], {
        explanation: 'Motor Activity, slide 3: they receive input from all over and are the only route to muscle.',
        skill: 'cause-effect',
      })
    ),
    learn('Down from the cortex', ['Motor, premotor, supplementary and postcentral cortex → cerebral peduncles → pons → pyramids → most fibres cross in the caudal medulla. Lateral (crossed) tract: limbs. Medial (uncrossed): axial and trunk muscles.'], {
      sourceRefs: mo([9, 10, 11]),
    }),
    ask(
      mcq('c6-02', 'corticospinal', 'A stroke damages the left motor cortex’s hand area. Which hand is weak?', 'The right hand', ['The left hand', 'Both hands', 'Neither — the face is affected instead'], {
        explanation: 'The lateral corticospinal tract crosses at the pyramids; the body (except the face) is represented contralaterally (Motor Activity, slides 5, 10–11).',
        skill: 'pathway-reasoning',
      })
    ),
    ask(
      mcq('c6-03', 'brainstem-motor', 'Which brainstem nucleus inhibits antigravity muscles?', 'The medullary reticular nucleus', ['The pontine reticular nucleus (excitatory)', 'The lateral vestibular nucleus', 'The red nucleus'], {
        explanation: 'Motor Activity, slide 16: medullary reticular inhibits; pontine reticular and vestibular nuclei excite.',
      })
    ),
    learn('UMN versus LMN', ['LMN (the α-motor neuron itself): flaccid paralysis, atrophy, reduced reflexes, fibrillation. UMN (neurons that activate it): spastic paralysis, no atrophy, exaggerated reflexes.'], {
      sourceRefs: mo([19]),
    }),
    ask(
      mcq('c6-04', 'motor-lesions', 'A patient’s leg is weak, wasted, flaccid, with absent knee jerk and fibrillation. Where is the lesion?', 'Lower motor neuron', ['Upper motor neuron', 'Cerebellum', 'Basal ganglia'], {
        explanation: 'Motor Activity, slide 19: atrophy, flaccidity and fibrillation are LMN signs.',
        skill: 'application',
        clinical: true,
      })
    ),
    ask(
      mcq('c6-05', 'motor-lesions', 'Three days after a complete cord transection, what are the reflexes below the cut like?', 'Depressed — spinal shock', ['Exaggerated', 'Normal', 'Only the stretch reflexes are lost'], {
        explanation: 'Motor Activity, slides 14 and 17: all reflexes below the cut are depressed for about 2 weeks, then return as spasticity.',
        skill: 'prediction',
      })
    ),
    ask(
      match('c6-06', 'myotomes', 'Match each movement to its myotome.', [
        ['Diaphragm', 'C3, 4, 5'],
        ['Straightening the elbow', 'C7'],
        ['Straightening the knee', 'L3'],
        ['Pulling the foot down', 'S1'],
      ], { explanation: 'Motor Activity, slide 15.' })
    ),
    recall('r6-01', 'motor-lesions', 'Describe the Brown-Séquard syndrome and explain each feature.', [
      'Hemisection of the cord.',
      'Same side below the lesion: loss of motor function (the lateral corticospinal tract has already crossed), and loss of joint position, vibration and fine touch (dorsal columns, crossing only in the medulla).',
      'Opposite side: loss of pain, temperature and crude touch (spinothalamic tracts cross in the cord).',
    ], [...mo([14]), ...s2([7, 9])]),
  ],

  // ─── Lesson 7 — The cerebellum ─────────────────────────────────────
  'central-nervous-system-7': [
    ask(
      mcq('c7-01', 'cerebellum-anatomy', 'Which part of the cerebellum controls the neck, shoulders and hips?', 'The vermis', ['The lateral zone', 'The intermediate zone', 'The dentate nucleus'], {
        explanation: 'Cerebellum, slide 6: vermis — axial body; intermediate — distal limbs; lateral — planning.',
      })
    ),
    learn('Intention versus performance', ['The motor cortex and red nucleus tell the cerebellum what is intended for the next fractions of a second; spinocerebellar feedback tells it what is actually happening. It compares the two and adjusts agonists and antagonists.'], {
      sourceRefs: cb([13]),
    }),
    ask(
      mcq('c7-02', 'cerebellum-inputs', 'Which input brings feedback from spindles, Golgi tendon organs and joints?', 'Spinocerebellar', ['Corticopontocerebellar', 'Vestibulocerebellar', 'Olivocerebellar'], {
        explanation: 'Cerebellum, slide 10. It is also the fastest-conducting pathway (slide 11).',
      })
    ),
    learn('The damper', ['Movements are naturally pendular. The cerebellum damps them so a limb stops on target. Without it the limb overshoots, corrects, overshoots again — intention tremor and dysmetria.'], {
      sourceRefs: cb([16, 18]),
    }),
    ask(
      mcq('c7-03', 'cerebellum-function', 'A patient’s hand shakes more and more as the finger nears the nose, but is steady at rest. Which function is lost?', 'Damping of pendular movement', ['The brake on unwanted movement', 'The stretch reflex', 'Sensation from the fingertip'], {
        explanation: 'Cerebellum, slide 16: destroying the cerebellum leads to overshooting — intention tremor.',
        skill: 'application',
        clinical: true,
      })
    ),
    ask(
      multi('c7-04', 'cerebellar-signs', 'Which are signs of cerebellar disease? Select all that apply.', ['Past-pointing', 'Nystagmus', 'Dysdiadochokinesia', 'Hypotonia'], ['Lead-pipe rigidity', 'Muscle wasting'], {
        explanation: 'PINDAH (Cerebellum, slide 18). Rigidity is a basal ganglia (Parkinson’s) sign; wasting is LMN.',
      })
    ),
    recall('r7-01', 'cerebellum-function', 'Explain how the cerebellum makes a movement smooth and accurate, and what happens to a reach when it is damaged.', [
      'It receives the intended movement from the motor cortex and red nucleus, and feedback of the actual movement from the periphery.',
      'It compares intention with performance and coordinates agonists and antagonists, timing successive movements.',
      'It damps the pendular movement so the limb stops on target; ballistic movements are preplanned.',
      'Damage: overshoot and compensation (dysmetria, past-pointing), intention tremor, poorly timed sequences.',
    ], cb([13, 16, 17, 18])),
  ],

  // ─── Lesson 8 — The basal ganglia ──────────────────────────────────
  'central-nervous-system-8': [
    ask(
      mcq('c8-01', 'bg-structure', 'Which two nuclei make up the striatum?', 'Caudate nucleus and putamen', ['Putamen and globus pallidus', 'Substantia nigra and subthalamic nucleus', 'Thalamus and hypothalamus'], {
        explanation: 'Basal Ganglia, slide 3. Putamen + globus pallidus = the lentiform nucleus.',
      })
    ),
    learn('Transmitters', ['Dopamine: substantia nigra → caudate and putamen, inhibitory. GABA: caudate → globus pallidus and substantia nigra, inhibitory. Acetylcholine: cortex → caudate and putamen, excitatory.'], {
      sourceRefs: bg([6]),
    }),
    ask(
      match('c8-02', 'bg-transmitters', 'Match each transmitter to its pathway.', [
        ['Dopamine', 'Substantia nigra → caudate and putamen'],
        ['GABA', 'Caudate → globus pallidus and substantia nigra'],
        ['Acetylcholine', 'Cortex → caudate and putamen'],
      ], { explanation: 'Basal Ganglia, slide 6.' })
    ),
    learn('The brake', ['Overall the basal ganglia inhibit — a brake. To sit still, brake every movement except postural reflexes. To move, brake some postural reflexes and release the brake on the voluntary movement. Too much brake: hypokinetic. Too little: hyperkinetic.'], {
      sourceRefs: bg([7]),
    }),
    ask(
      mcq('c8-03', 'bg-disorders', 'In Parkinson’s disease, which neurons are lost?', 'Dopaminergic neurons of the substantia nigra', ['GABA neurons of the striatum (caudate)', 'Purkinje cells of the cerebellar cortex', 'Glutamate neurons of the subthalamic nucleus'], {
        explanation: 'Basal Ganglia, slide 8: degeneration of the nigrostriatal dopamine system.',
      })
    ),
    ask(
      mcq('c8-04', 'bg-disorders', 'Using the lecture’s model, why does losing dopamine make muscles rigid?', 'Dopamine normally inhibits the caudate and putamen; without it their excitatory influence dominates', ['Dopamine normally excites the muscles directly at the neuromuscular junction', 'Dopamine loss damages the muscle spindles, so tone cannot be sensed', 'The cerebellum takes over the movement and stiffens every joint'], {
        explanation: 'Basal Ganglia, slide 9: cutting off the inhibitory influence of dopamine leads to overactivity and rigidity.',
        skill: 'cause-effect',
      })
    ),
    ask(
      match('c8-05', 'bg-disorders', 'Match each movement disorder to its lesion.', [
        ['Chorea', 'Degeneration of the caudate nucleus'],
        ['Athetosis', 'Lesion of the lenticular nucleus'],
        ['Hemiballismus', 'Damage to the subthalamic nucleus'],
        ['Parkinson’s disease', 'Loss of nigrostriatal dopamine neurons'],
      ], { explanation: 'Basal Ganglia, slides 8–10.' })
    ),
    recall('r8-01', 'bg-disorders', 'Compare Parkinson’s disease and Huntington’s disease: what is lost, and what does the patient look like?', [
      'Parkinson’s: slow loss of dopaminergic neurons in the substantia nigra; the striatum loses dopamine’s inhibition and becomes overactive.',
      'It is hypokinetic: tremor, lead-pipe or cogwheel rigidity, bradykinesia and difficulty starting movement.',
      'Huntington’s: hereditary (dominant), onset 30–50; loss of cholinergic and GABA neurons in the striatum (caudate and putamen).',
      'It is hyperkinetic: continuous dance-like movements (chorea) of face and limbs, with dementia.',
    ], bg([8, 9])),
  ],

  // ─── Lesson 9 — The brain ──────────────────────────────────────────
  'central-nervous-system-9': [
    ask(
      mcq('c9-01', 'brain-overview', 'A tumour is described as “infratentorial”. Where is it?', 'In the cerebellum or brainstem', ['In the frontal lobe', 'Anywhere above the tentorium', 'In the cervical spinal cord or meninges'], {
        explanation: 'The Brain, slide 15: infratentorial = below the tentorium, in the hindbrain or brainstem.',
        skill: 'terminology',
      })
    ),
    learn('Four lobes', ['Frontal: thought, personality, movement, speech production. Temporal: hearing, memory, comprehension. Parietal: sensation and integration; reading, writing, naming (left), attention and space (right). Occipital: vision.'], {
      sourceRefs: br([7, 9, 11, 13]),
    }),
    ask(
      mcq('c9-02', 'brain-lobes', 'A patient speaks fluently but cannot understand what is said to them. Which lobe is damaged?', 'Temporal — Wernicke’s aphasia', ['Frontal — Broca’s aphasia', 'Occipital — visual agnosia', 'Parietal — dyscalculia and agraphia'], {
        explanation: 'The Brain, slide 10: difficulty understanding spoken words is Wernicke’s aphasia, a temporal lobe sign.',
        skill: 'application',
      })
    ),
    ask(
      mcq('c9-03', 'brain-lobes', 'Only the visual association area of the occipital lobe is destroyed. What happens?', 'The person can see but cannot recognise what they see', ['Total blindness in both visual fields', 'Loss of the pupillary light reflex', 'Loss of colour vision only, nothing else'], {
        explanation: 'The Brain, slides 13–14. Destroying the visuosensory centre instead causes blindness.',
        skill: 'prediction',
      })
    ),
    learn('The brainstem', ['Midbrain: visual reflexes, some hearing, unconscious motor coordination. Pons: relay to the cerebellum; reticular activating system (sleep–wake, alertness). Medulla: heart rate, BP, swallowing, breathing; tracts cross here.'], {
      sourceRefs: br([18]),
    }),
    ask(
      mcq('c9-04', 'brainstem', 'Damage to which part of the brainstem most directly disturbs the sleep–wake cycle and level of consciousness?', 'The pons (reticular activating system)', ['The medulla only (cardiovascular centre)', 'The midbrain only (red nucleus)', 'The cerebellum (vermis)'], {
        explanation: 'The Brain, slide 18: the pons holds fibres of the reticular formation and reticular activating system.',
      })
    ),
    ask(
      mcq('c9-05', 'cortex-dominance', 'A right-handed man has a stroke in his left hemisphere. Which problem is most likely?', 'Aphasia with weakness of the right side', ['Loss of spatial perception only', 'Weakness of the left side of the body', 'Loss of smell on both sides, with no weakness'], {
        explanation: 'The Brain, slide 23: about 87% are left-hemisphere dominant; a left stroke usually brings aphasia, apraxia and right-sided difficulty.',
        skill: 'application',
        clinical: true,
      })
    ),
    ask(
      mcq('c9-06', 'deep-structures', 'Which sense does NOT pass through the thalamus on its way to the cortex?', 'Smell', ['Vision', 'Touch', 'Hearing'], {
        explanation: 'The Brain, slide 25.',
      })
    ),
    recall('r9-01', 'brain-lobes', 'For each lobe, give its main functions and two effects of damage.', [
      'Frontal: thought, personality, movement, speech production. Damage: paralysis, sequencing problems, perseveration, personality change, Broca’s aphasia.',
      'Temporal: hearing, memory, language comprehension, faces. Damage: Wernicke’s aphasia, prosopagnosia, short-term memory loss.',
      'Parietal: sensation, integration; reading, writing, naming; attention and space. Damage: anomia, agraphia, alexia, dyscalculia, left–right confusion.',
      'Occipital: vision. Damage: blindness (primary area), visual agnosia (association area), field cuts.',
    ], br([7, 8, 10, 11, 12, 13, 14])),
  ],
};

type ReadingExtras = {
  estimatedMinutes: number;
  xp: number;
  highYield: string[];
  confusions: LessonConfusion[];
};

export const readingExtras: Record<string, ReadingExtras> = {
  'central-nervous-system-1': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: [
      'Ganglion = cell bodies outside the CNS; nucleus = inside.',
      'Generator potential → summation → action potential; intensity = more receptors + higher frequency.',
      'Phasic (rapid) adaptors: touch, smell. Tonic (slow): BP, lung inflation, temperature.',
    ],
    confusions: [
      { confusion: 'A stronger stimulus makes bigger action potentials.', clarification: 'Action potentials are all-or-none; a stronger stimulus recruits more receptors and fires them faster (Sensory I, p. 9).' },
      { confusion: 'The sensation depends on what stimulated the nerve.', clarification: 'Müller: it depends on the part of the brain the signal reaches (p. 10).' },
    ],
  },
  'central-nervous-system-2': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: [
      'Stretch reflex: spindle → Ia → α-motor neuron → contraction. Monosynaptic.',
      'γ discharge stretches the spindle’s middle → more sensitive; raised by anxiety and Jendrassik’s manoeuvre.',
      'Golgi tendon organ (in series) → IPSPs → relaxation: the inverse stretch reflex.',
    ],
    confusions: [
      { confusion: 'The γ-efferents make the whole muscle contract.', clarification: 'They contract only the ends of the intrafusal fibres, setting spindle sensitivity (Sensory I, p. 24).' },
      { confusion: 'The spindle and tendon organ both lie in parallel with the muscle.', clarification: 'The spindle is in parallel (senses length); the tendon organ is in series (senses tension).' },
    ],
  },
  'central-nervous-system-3': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: [
      'Dorsal columns: fine touch, proprioception, vibration — cross in the medulla.',
      'Spinothalamic: lateral = pain and temperature, ventral = crude touch — cross in the cord.',
      'Hemisection: position and vibration lost on the same side; pain and temperature on the opposite side.',
    ],
    confusions: [
      { confusion: 'All sensory tracts cross in the medulla.', clarification: 'Only the dorsal columns do; the spinothalamic tracts cross in the spinal cord (Sensory II, p. 9).' },
      { confusion: 'The biggest body parts have the biggest areas on the sensory cortex.', clarification: 'Area matches the number of receptors, not size — hence the large lips and hands of the homunculus (p. 5).' },
    ],
  },
  'central-nervous-system-4': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: [
      'Fast pain: Aδ, neospinothalamic. Slow pain: C, paleospinothalamic, substance P.',
      'Pain receptors barely adapt.',
      'Analgesia: local suppression by touch fibres; periaqueductal grey, raphe magnus, dorsal horn; endorphins, dynorphins, enkephalin.',
    ],
    confusions: [
      { confusion: 'Most slow pain fibres end in the thalamus.', clarification: 'Only 10–25% reach the thalamus; most end in the brainstem (Sensory II, p. 21).' },
      { confusion: 'Pain receptors adapt like touch receptors.', clarification: 'They adapt very little, and prolonged stimulation can increase excitation (p. 18).' },
    ],
  },
  'central-nervous-system-5': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: [
      '31 pairs: 8 C, 12 T, 5 L, 5 S, 1 Co. The cord ends at about L2.',
      'spino-… = sensory; cortico-… = motor.',
      'Laminae I–II: C and Aδ (NS, WDR). III–VI: Aβ (LT). Lamina II = substantia gelatinosa.',
    ],
    confusions: [
      { confusion: 'A nerve contains cell bodies.', clarification: 'Nerves are fibres only; cell bodies are in ganglia or grey matter (Spinal Cord, slide 2).' },
      { confusion: 'The dorsal horn just relays pain.', clarification: 'It modulates pain through afferents, interneurons and descending fibres (slide 13).' },
    ],
  },
  'central-nervous-system-6': {
    estimatedMinutes: 14,
    xp: 25,
    highYield: [
      'Corticospinal fibres cross at the pyramids (caudal medulla); lateral tract = limbs, medial = axial.',
      'UMN: spastic, brisk reflexes, no wasting. LMN: flaccid, reduced reflexes, wasting, fibrillation.',
      'Transection → spinal shock (~2 weeks) → spasticity. Hemisection → Brown-Séquard.',
    ],
    confusions: [
      { confusion: 'A cord transection causes spasticity straight away.', clarification: 'First spinal shock — all reflexes depressed for about 2 weeks — then hyperreflexia and spasticity (Motor Activity, slide 17).' },
      { confusion: 'The face is represented only on the opposite motor cortex.', clarification: 'Facial representation is bilateral (slide 5).' },
    ],
  },
  'central-nervous-system-7': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: [
      'Vermis: axial; intermediate: distal limbs; lateral: planning.',
      'Compares intention (cortex) with performance (periphery); damps pendular movement.',
      'PINDAH: past-pointing, intention tremor, nystagmus, dysdiadochokinesia, ataxia, hypotonia.',
    ],
    confusions: [
      { confusion: 'Cerebellar tremor is worst at rest.', clarification: 'It is an intention tremor — it appears during movement, from loss of damping (Cerebellum, slide 16).' },
      { confusion: 'The cerebellum starts movements.', clarification: 'It coordinates and times them, comparing the plan with what happens (slide 13).' },
    ],
  },
  'central-nervous-system-8': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: [
      'Striatum = caudate + putamen; lentiform = putamen + globus pallidus.',
      'Dopamine (SN → striatum) and GABA (caudate → GP, SN) inhibitory; ACh (cortex → striatum) excitatory.',
      'Parkinson’s (dopamine loss): tremor, rigidity, bradykinesia. Huntington’s: chorea, dementia. Hemiballismus: subthalamic nucleus.',
    ],
    confusions: [
      { confusion: 'The basal ganglia mainly excite movement.', clarification: 'Their overall function is inhibitory — a brake (Basal Ganglia, slide 7).' },
      { confusion: 'Parkinson’s is a hyperkinetic disorder because of the tremor.', clarification: 'It is hypokinetic: akinesia, bradykinesia and difficulty starting movement (slides 7–8).' },
    ],
  },
  'central-nervous-system-9': {
    estimatedMinutes: 14,
    xp: 25,
    highYield: [
      'Broca (frontal, left): speech production. Wernicke (temporal, left): comprehension.',
      'Primary visual area lost → blind; association area lost → sees but cannot recognise.',
      'Thalamus relays every sense except smell; hypothalamus holds set-points; hippocampus files new memories.',
    ],
    confusions: [
      { confusion: 'Each hemisphere controls the same side of the body.', clarification: 'Tracts cross in the medulla, so each hemisphere controls the opposite side (The Brain, slides 4, 18).' },
      { confusion: 'Without the hippocampus, all memory is lost.', clarification: 'Old memories, working memory and skill learning remain; new declarative memories cannot be laid down (slide 28).' },
    ],
  },
};
