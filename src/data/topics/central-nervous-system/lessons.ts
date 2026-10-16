// Physiology → Central Nervous System — the nine lessons (reading layer).
// Sources: the eight CNS lectures (s1, s2, pn, sc, mo, cb, bg, br in
// sources.ts). Guyton only clarifies points within their scope, always
// labelled. References name the lecture: "Sensory I, p. 6" or
// "Spinal Cord, slide 4".
import type { LessonDraft } from '@/data/topics/build';
import { interactive, readingExtras } from '@/data/topics/central-nervous-system/interactive';
import { withSimulation } from '@/data/topics/central-nervous-system/simulations';
import { bg, br, cb, GUYTON, mo, pn, s1, s2, sc, type ConceptId } from '@/data/topics/central-nervous-system/sources';

type Draft = LessonDraft<ConceptId>;

// ─── Lesson 1 ───────────────────────────────────────────────────────

const lesson1: Draft = {
  id: 'central-nervous-system-1',
  title: 'Organisation of the CNS and Sensory Receptors',
  description: 'What the CNS does, the senses, how receptors are classified, how a stimulus becomes impulses, and adaptation.',
  xp: 25,
  sourceRefs: s1([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  objectives: [
    'Describe the CNS as a network with sensory, integrative and motor parts',
    'Distinguish a ganglion from a nucleus',
    'Classify sensory receptors by the stimulus they detect and by where it comes from',
    'Explain how a generator potential produces action potentials and how intensity is coded',
    'Explain adaptation and Müller’s doctrine of specific nerve energies',
  ],
  chunks: [
    {
      title: 'The nervous system as a communication network',
      kind: 'overview',
      paragraphs: [
        'The nervous system is a communication network with three components: a sensory component, an integrative component and a motor component. It is divided into the central and the peripheral nervous system (Sensory I, p. 1).',
        'The CNS gathers information, processes it and perceives it; it organises reflexes and behavioural responses; and it is responsible for learning, cognition, memory, plans to execute voluntary movement, emotions and thought processes (p. 2).',
      ],
      sourceRefs: s1([1, 2]),
    },
    {
      title: 'Ganglion, nucleus, nerve and tract',
      kind: 'definitions',
      terms: [
        { term: 'Ganglion', meaning: 'An aggregation of neuronal cell bodies with similar function (Sensory I, p. 2) — located outside the CNS, e.g. the dorsal root ganglia, which hold the cell bodies of sensory neurons (Spinal Cord, slide 2).' },
        { term: 'Nucleus', meaning: 'A collection of neurons in the CNS with a similar function (Sensory I, p. 2).' },
        { term: 'Nerve', meaning: 'A group of fibres (axons) outside the CNS. A nerve contains no cell bodies (Spinal Cord, slide 2).' },
        { term: 'Tract', meaning: 'A group of fibres inside the CNS; tracts are always part of white matter (Spinal Cord, slide 3).' },
      ],
      keyPoints: ['Outside the CNS: ganglion (cell bodies) and nerve (fibres). Inside the CNS: nucleus (cell bodies) and tract (fibres).'],
      sourceRefs: [...s1([2]), ...sc([2, 3])],
    },
    {
      title: 'The sensory system',
      kind: 'overview',
      paragraphs: [
        'The sensory system is the part of the nervous system that processes sensory information. It consists of sensory receptors, neural pathways and the parts of the brain involved in sensory perception. Receptive fields have been identified for the visual, auditory and somatosensory systems (Sensory I, p. 3).',
        'Its function is to receive information from the external and internal environment and send it to the CNS, using receptors (transducers), nerves (afferents) and sense organs. Stimuli are mechanical, thermal, chemical or electromagnetic; each receptor has an adequate stimulus (p. 4).',
      ],
      table: {
        columns: ['Conscious', 'Unconscious', 'Special senses'],
        rows: [
          ['Vision, hearing, taste, smell', 'Blood pressure', 'Hearing'],
          ['Rotational and linear acceleration', 'Lung inflation', 'Smell'],
          ['Touch, temperature, pain, itch', 'pH, osmolality', 'Vision'],
          ['Joint position, muscle tension', 'Glucose', 'Acceleration, taste'],
        ],
      },
      sourceRefs: s1([3, 4, 5]),
    },
    {
      title: 'Classifying sensory receptors',
      kind: 'classification',
      paragraphs: ['By the stimulus they detect (Sensory I, p. 6):'],
      terms: [
        { term: 'Mechanoreceptors', meaning: 'Mechanical deformation of the receptor or of cells next to it.' },
        { term: 'Thermoreceptors', meaning: 'Changes in temperature — some detect cold, others warmth.' },
        { term: 'Nociceptors (pain receptors)', meaning: 'Damage in the tissues, physical or chemical.' },
        { term: 'Electromagnetic receptors', meaning: 'Light on the retina.' },
        { term: 'Chemoreceptors', meaning: 'Taste, smell, oxygen level, osmolality, CO₂ concentration and the other chemistry of the body.' },
      ],
      keyPoints: [
        'By where the stimulus comes from: teleceptors (things at a distance), exteroceptors (external environment), interoceptors and visceral receptors (internal environment), proprioceptors (joint position).',
      ],
      sourceRefs: s1([6]),
    },
    {
      title: 'From stimulus to impulses',
      kind: 'mechanism',
      paragraphs: ['A stimulus does not fire the nerve directly (Sensory I, p. 9):'],
      steps: [
        { label: 'Stimulus on the receptor' },
        { label: 'Generator potential', detail: 'A local, EPSP-like potential in the receptor — graded with the stimulus.' },
        { label: 'Summation of generator potentials' },
        { label: 'Action potential', detail: 'Fired in the afferent nerve once threshold is reached.' },
      ],
      keyPoints: ['A stronger stimulus is signalled in two ways: it stimulates more receptors, and it increases the frequency of action potentials (p. 9).'],
      notes: [
        { kind: 'textbook', text: 'Guyton: above threshold, the greater the generator (receptor) potential, the higher the rate of action potentials. The lecture lists “receptive field” and “sensory unit” (p. 8) without defining them: the receptive field is the area a single afferent fibre serves, and a sensory unit is one afferent neuron with all its receptor endings.' },
      ],
      sourceRefs: [...s1([8, 9]), ...GUYTON],
    },
    {
      title: 'Adaptation',
      kind: 'mechanism',
      paragraphs: [
        'When a stimulus of constant strength is maintained, the frequency of action potentials in its sensory nerve diminishes over time. This is adaptation (Sensory I, p. 10).',
      ],
      table: {
        columns: ['Rapid adaptors (phasic)', 'Slow adaptors (tonic)'],
        rows: [
          ['Touch', 'Lung inflation'],
          ['Smell', 'Blood pressure'],
          ['', 'Temperature'],
        ],
      },
      keyPoints: ['Slow (tonic) receptors keep reporting a steady state — useful for blood pressure and lung inflation. Rapid (phasic) receptors signal change.'],
      sourceRefs: s1([10]),
    },
    {
      title: 'Müller’s doctrine of specific nerve energies',
      kind: 'mechanism',
      paragraphs: [
        'The sensation evoked by impulses from a receptor depends on the specific part of the brain they ultimately activate. Any part of the pathway stimulated, from the receptor to the brain, produces the same sensation: if you stimulate a nerve along the pathway, it is projected on the brain as coming from the receptors. Example: stimulation of the brain itself (Sensory I, p. 10).',
      ],
      keyPoints: ['The sensation depends on where the signal ends up in the brain, not on what started it.'],
      sourceRefs: s1([10]),
    },
  ],
  summary: [
    'The CNS is a communication network: sensory, integrative and motor components.',
    'Ganglion = cell bodies outside the CNS; nucleus = cell bodies inside; nerve = fibres outside; tract = fibres inside (white matter).',
    'Receptors: mechano-, thermo-, noci-, electromagnetic and chemoreceptors; tele-, extero-, intero- and proprioceptors.',
    'Stimulus → generator potential (EPSP-like) → summation → action potential. Intensity: more receptors and a higher frequency.',
    'Adaptation: firing falls with a constant stimulus. Phasic (rapid): touch, smell. Tonic (slow): lung inflation, BP, temperature.',
    'Müller: the sensation depends on the part of the brain activated, wherever along the pathway the signal starts.',
  ],
};

// ─── Lesson 2 ───────────────────────────────────────────────────────

const lesson2: Draft = {
  id: 'central-nervous-system-2',
  title: 'Reflexes: the Muscle Spindle and Golgi Tendon Organ',
  description: 'The reflex arc, the muscle spindle and stretch reflex, γ-efferents, reciprocal innervation, the inverse stretch reflex and muscle tone.',
  xp: 25,
  sourceRefs: s1([11, 12, 13, 14, 20, 22, 24, 25, 26, 27, 28, 29]),
  objectives: [
    'Name the five parts of a reflex arc',
    'Describe the muscle spindle: its fibres and its sensory and motor supply',
    'Trace the stretch reflex and explain why it is monosynaptic',
    'Explain how γ-efferent discharge changes spindle sensitivity, and what controls it',
    'Explain reciprocal innervation and the inverse stretch reflex',
    'Describe hypotonic, normotonic and hypertonic muscle tone',
  ],
  chunks: [
    {
      title: 'The reflex arc',
      kind: 'pathway',
      paragraphs: [
        'A reflex is a simple, relatively stereotyped response to a specific type of stimulus. The neuronal circuit responsible for it is the reflex arc — the basic unit of integrated neural activity (Sensory I, p. 11).',
      ],
      steps: [
        { label: 'Receptor' },
        { label: 'Afferent neuron' },
        { label: 'Integrating centre' },
        { label: 'Efferent neuron' },
        { label: 'Effector organ' },
      ],
      keyPoints: ['Sensation enters the cord through the dorsal horn; motor neurons leave from the ventral horn (Bell–Magendie law, p. 13).'],
      notes: [{ kind: 'textbook', text: 'The Bell–Magendie law: dorsal roots carry sensory (afferent) fibres and ventral roots carry motor (efferent) fibres.' }],
      sourceRefs: [...s1([11, 13]), ...GUYTON],
    },
    {
      title: 'Muscle fibres and the muscle spindle',
      kind: 'structure',
      paragraphs: [
        'Muscle has two kinds of fibre: extrafusal fibres, which contract, and intrafusal fibres, which form the spindle. A muscle spindle is 2–10 muscle fibres enclosed in connective tissue, lying in parallel with the extrafusal fibres and attached to the connective tissue (endomysium) (Sensory I, p. 14). The intrafusal fibres are attached to the tendons at both ends (p. 12).',
      ],
      table: {
        columns: ['Part', 'Details'],
        rows: [
          ['Intrafusal fibres', 'Nuclear bag fibres and nuclear chain fibres'],
          ['Primary (Ia) endings', 'Annulospiral — wrapped round both bag and chain fibres'],
          ['Secondary (II) endings', 'Flower-spray — only on chain fibres'],
          ['Motor supply', 'γ-efferents (of Leksell); β fibres'],
        ],
      },
      notes: [{ kind: 'clarified', text: 'The slide lists the motor supply as “γ efferents of Leksell; β fibres”. Guyton: intrafusal fibres are supplied by small γ motor neurons, and some β fibres supply both intrafusal and extrafusal fibres. The γ supply is the one that matters here.' }],
      sourceRefs: [...s1([14]), ...GUYTON],
    },
    {
      title: 'The stretch (myotatic) reflex',
      kind: 'pathway',
      paragraphs: ['Tapping a tendon stretches the muscle, and with it the spindles (Sensory I, p. 12):'],
      steps: [
        { label: 'Muscle and tendon stretched' },
        { label: 'Spindle stretched', detail: 'The intrafusal fibres lie in parallel with the muscle, so they stretch too.' },
        { label: 'Nerve endings distorted', detail: 'The annulospiral endings fire.' },
        { label: 'Afferent neuron transmits to the α-motor neuron', detail: 'Directly, in the ventral horn.' },
        { label: 'Muscle contracts' },
      ],
      keyPoints: ['There is only one synapse between afferent and efferent: the stretch reflex is monosynaptic. Examples: the knee jerk and ankle jerk (p. 13).'],
      sourceRefs: s1([12, 13, 20]),
    },
    {
      title: 'γ-efferent discharge sets the sensitivity',
      kind: 'regulation',
      steps: [
        { label: 'γ discharge' },
        { label: 'The ends of the intrafusal fibres contract' },
        { label: 'The middle of the spindle is stretched' },
        { label: 'Nerve endings distorted → afferent fires → α-motor neuron → muscle contracts' },
      ],
      paragraphs: [
        'Increased γ discharge increases the sensitivity of the spindles to stretch. If the spindles are stretched further by external activity during γ discharge, more afferent impulses are sent out and the muscle (extrafusal fibres) contracts more (Sensory I, p. 24).',
        'γ-efferent discharge is controlled by descending tracts from areas in the brain. It rises with anxiety — hyperactive reflexes can be seen in anxious people — and with reinforcement (Jendrassik’s manoeuvre) (p. 25).',
      ],
      sourceRefs: s1([22, 24, 25]),
    },
    {
      title: 'Reciprocal innervation',
      kind: 'mechanism',
      paragraphs: [
        'When a muscle is stimulated to contract on one side, impulses from its Ia fibres also pass to the antagonistic muscles to inhibit them, so they relax. Example: biceps and triceps (Sensory I, p. 25).',
      ],
      sourceRefs: s1([25]),
    },
    {
      title: 'The inverse stretch reflex',
      kind: 'regulation',
      paragraphs: [
        'The Golgi tendon reflex is a protective feedback mechanism that controls the tension of an active muscle, causing relaxation before tendon tension becomes high enough to cause damage (Sensory I, p. 26).',
      ],
      steps: [
        { label: 'Excessive stretch or a strong contraction', detail: 'Tension in the tendon rises.' },
        { label: 'Golgi tendon organ fires', detail: '3–25 muscle fibres per tendon organ; it lies in series with the extrafusal fibres.' },
        { label: 'IPSPs in the motor neurons', detail: 'The impulses inhibit the α-motor neurons.' },
        { label: 'Relaxation' },
      ],
      keyPoints: ['Spindle: in parallel, senses length, makes the muscle contract. Golgi tendon organ: in series, senses tension, makes the muscle relax.'],
      sourceRefs: s1([26, 27, 28]),
    },
    {
      title: 'Muscle tone',
      kind: 'definitions',
      paragraphs: ['Muscle tone is the resistance of muscle to stretch (Sensory I, p. 27). The withdrawal reflex is shown on p. 29.'],
      terms: [
        { term: 'Hypotonic (flaccid)', meaning: 'Less resistance than normal.' },
        { term: 'Normotonic', meaning: 'Normal resistance.' },
        { term: 'Hypertonic (spastic)', meaning: 'More resistance than normal.' },
      ],
      sourceRefs: s1([27, 29]),
    },
  ],
  summary: [
    'Reflex arc: receptor → afferent → integrating centre → efferent → effector. Sensory in through the dorsal horn, motor out through the ventral horn.',
    'Spindle: 2–10 intrafusal fibres (nuclear bag and chain) in parallel with extrafusal fibres. Ia annulospiral on bag and chain; II flower-spray on chain only; motor supply γ (and β).',
    'Stretch reflex: stretch → spindle → Ia afferent → α-motor neuron → contraction. Monosynaptic (knee, ankle jerk).',
    'γ discharge contracts the spindle ends, stretching its middle → more sensitive spindle. Raised by descending tracts, anxiety and Jendrassik’s manoeuvre.',
    'Reciprocal innervation: Ia impulses inhibit the antagonist (biceps–triceps).',
    'Inverse stretch reflex: Golgi tendon organ (in series) → IPSPs on motor neurons → relaxation, protecting the tendon.',
    'Tone = resistance to stretch: hypotonic (flaccid), normotonic, hypertonic (spastic).',
  ],
};

// ─── Lesson 3 ───────────────────────────────────────────────────────

const lesson3: Draft = {
  id: 'central-nervous-system-3',
  title: 'Somatic Sensation and the Ascending Pathways',
  description: 'Afferent fibre types, the dorsal column and spinothalamic pathways, the somatic sensory cortex and temperature.',
  xp: 25,
  sourceRefs: [...s1([30]), ...s2([2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15])],
  objectives: [
    'Name the three types of sensation and the three types of afferent fibre',
    'Trace the dorsal column pathway and say where it crosses',
    'Trace the spinothalamic pathway, say where it crosses and what each part carries',
    'Predict the sensory loss from a one-sided cord lesion',
    'Describe the somatic sensory cortex and what is lost when it is damaged',
    'Describe how temperature is sensed and carried',
  ],
  chunks: [
    {
      title: 'Cutaneous, deep and visceral sensation',
      kind: 'overview',
      paragraphs: [
        'There are three types of sensation: cutaneous, deep and visceral. Specialised organs convert energy into action potentials; each sensation has a discrete pathway to the brain, and a specific area of the brain is activated by specific sensory input. Sensation enters the cord through the dorsal horn (Sensory I, p. 30).',
      ],
      table: {
        columns: ['Afferent fibre', 'Myelin', 'Carries'],
        rows: [
          ['Aβ', 'Large, myelinated', 'Mechanical'],
          ['Aδ', 'Small, myelinated', 'Mechanical, thermal, noxious'],
          ['C', 'Unmyelinated', 'Pain and temperature'],
        ],
      },
      sourceRefs: s1([30]),
    },
    {
      title: 'The dorsal column (lemniscal) pathway',
      kind: 'pathway',
      paragraphs: ['Carries fine touch, proprioception and vibration (Sensory II, p. 7):'],
      steps: [
        { label: 'Enters the cord and ascends on the same side', detail: 'Ipsilateral transmission in the dorsal columns.' },
        { label: 'Crosses over in the medulla' },
        { label: 'Thalamus' },
        { label: 'Somatic sensory cortex' },
      ],
      keyPoints: ['Fine touch: precise touch and gradations of sensation travel in the dorsal columns. Proprioception (joints) travels in the dorsal columns, most of it to the cerebellum; destruction causes ataxia (p. 14).'],
      sourceRefs: s2([7, 8, 13, 14]),
    },
    {
      title: 'The spinothalamic (anterolateral) pathway',
      kind: 'pathway',
      paragraphs: [
        'The spinothalamic tract originates in the spinal cord and carries information to the thalamus about pain, temperature, itch and crude touch (and tickle and sexual sensations). Unlike the dorsal columns, it crosses (decussates) at the level of the spinal cord, not the brainstem (Sensory II, p. 9).',
      ],
      table: {
        columns: ['Part', 'Carries'],
        rows: [
          ['Lateral spinothalamic', 'Pain and temperature'],
          ['Ventral (anterior) spinothalamic', 'Crude touch'],
        ],
      },
      keyPoints: ['Touch travels in both systems — fine touch in the dorsal columns, crude touch in the ventral spinothalamics — so only extensive cord lesions interrupt touch completely (p. 14).'],
      sourceRefs: s2([9, 10, 11, 12, 14]),
    },
    {
      title: 'Where the pathways cross decides the side of the loss',
      kind: 'clinical',
      paragraphs: [
        'Because the dorsal columns cross high (medulla) and the spinothalamic tracts cross low (at the level of entry in the cord), damage to one half of the cord loses fine touch, vibration and joint position on the same side but pain, temperature and crude touch on the opposite side. This pattern is the Brown-Séquard syndrome (Motor Activity, slide 14).',
      ],
      sourceRefs: [...s2([7, 9]), ...mo([14])],
    },
    {
      title: 'The somatic sensory cortex',
      kind: 'structure',
      paragraphs: [
        'The somatic sensory areas I and II lie in the postcentral gyrus (Sensory II, p. 3). The body is represented upside down, and the size of each part’s receiving area corresponds to the number of its receptors, not its size: the homunculus (p. 5).',
        'What the cortex does is known by elimination — from what is lost when it is removed (p. 3):',
      ],
      steps: [
        { label: 'Unable to localise the different sensations discretely' },
        { label: 'Unable to judge critical degrees of pressure' },
        { label: 'Unable to judge the weight of objects' },
        { label: 'Unable to judge the shape or form of objects', detail: 'Astereognosis.' },
        { label: 'Unable to judge the texture of materials' },
      ],
      keyPoints: ['The somatic association areas help decipher the messages. Removing them loses the form of the body — the person forgets the opposite side: amorphosynthesis (p. 3).'],
      sourceRefs: s2([2, 3, 5]),
    },
    {
      title: 'Temperature',
      kind: 'mechanism',
      paragraphs: [
        'There are two types of temperature receptor: those for temperatures below body temperature and those for temperatures above it. The sense organ is sub-epithelial, and the signals travel in the lateral spinothalamic tracts (Sensory II, p. 15).',
        'Mild adaptation occurs, but not above 40 °C or below 20 °C. Above 45 °C tissue is damaged and pain replaces the sensation of temperature.',
      ],
      sourceRefs: s2([15]),
    },
  ],
  summary: [
    'Cutaneous, deep and visceral sensation. Aβ (large myelinated): mechanical; Aδ (small myelinated): mechanical, thermal, noxious; C (unmyelinated): pain and temperature.',
    'Dorsal columns: fine touch, proprioception, vibration — ipsilateral, cross in the medulla → thalamus → cortex.',
    'Spinothalamic: lateral = pain and temperature; ventral = crude touch — cross in the spinal cord → thalamus.',
    'Hemisection: same-side loss of fine touch, vibration and position; opposite-side loss of pain, temperature and crude touch.',
    'Postcentral gyrus (SI, SII): upside-down homunculus sized by receptor number. Loss → poor localisation, astereognosis; association areas → amorphosynthesis.',
    'Temperature: cold and warm receptors, lateral spinothalamics; no adaptation above 40 °C or below 20 °C; above 45 °C → pain.',
  ],
};

// ─── Lesson 4 ───────────────────────────────────────────────────────

const lesson4: Draft = {
  id: 'central-nervous-system-4',
  title: 'Pain',
  description: 'Fast and slow pain, pain receptors and chemicals, the two pain pathways, how the body controls pain, referred pain, headache and dermatomes.',
  xp: 25,
  sourceRefs: [...s2([16, 17, 18, 19, 20, 21, 22, 23, 24, 28, 29]), ...pn([2, 3, 4, 5, 6, 9, 10])],
  objectives: [
    'Compare fast (Aδ) and slow (C) pain',
    'List the chemicals that cause pain and explain why pain receptors barely adapt',
    'Contrast superficial with deep and visceral pain',
    'Trace the fast and slow pain pathways and explain the role of substance P',
    'Explain local suppression of pain and the brain’s analgesic system',
    'Define referred pain and dermatomes, and list causes of headache',
  ],
  chunks: [
    {
      title: 'Fast and slow pain',
      kind: 'comparison',
      paragraphs: ['Pain is a protective mechanism, occurring when tissue is being damaged — for example pressure sores from sitting too long (Sensory II, p. 18). There are two types (pp. 16–17):'],
      table: {
        columns: ['', 'Fast pain', 'Slow pain'],
        rows: [
          ['Fibre', 'Aδ', 'C'],
          ['Onset', 'Rapid: acute, sharp, electric', 'Slow, increasing steadily: burning, gnawing, chronic'],
          ['Where', 'Mainly superficial', 'Superficial and deep'],
          ['Examples', 'Needle stick, knife injury, electric shock', 'Abdominal pain, muscle strain'],
        ],
      },
      keyPoints: ['The pain pathway connects to the thalamus, which is why pain has an emotional component (p. 16).'],
      sourceRefs: s2([16, 17, 18]),
    },
    {
      title: 'Pain receptors and pain chemicals',
      kind: 'mechanism',
      paragraphs: [
        'Pain receptors are free nerve endings, superficial and in deep tissues such as the periosteum, joint surfaces and the capsules of viscera. Deeper tissues do not have an extensive supply, but marked tissue damage recruits many receptors (Sensory II, p. 17).',
        'Pain receptors adapt very little; prolonged stimulation may even increase their excitation. Tissue ischaemia (e.g. a BP cuff left inflated) and muscle spasm cause pain (p. 18).',
      ],
      terms: [{ term: 'Chemicals that cause pain', meaning: 'Bradykinin, histamine, K⁺, proteolytic enzymes, acids and prostaglandins (p. 18).' }],
      sourceRefs: s2([17, 18]),
    },
    {
      title: 'Superficial, deep and visceral pain',
      kind: 'comparison',
      table: {
        columns: ['Superficial pain', 'Deep and visceral pain'],
        rows: [
          ['Localised', 'Poorly localised'],
          ['', 'Nauseating, with sweating and changes in BP — autonomic symptoms, because the afferents reach the CNS via the ANS'],
        ],
      },
      keyPoints: [
        'Visceral pain may be referred; it is sensitive to distension; many receptors must be stimulated; it involves contraction of adjacent muscle; and it is caused by spasm, chemical stimuli and ischaemia (Sensory II, p. 19).',
      ],
      sourceRefs: s2([19]),
    },
    {
      title: 'The fast pain pathway',
      kind: 'pathway',
      steps: [
        { label: 'Receptor → spinal nerve (Aδ)' },
        { label: 'Dorsal horn' },
        { label: 'Crosses to the opposite side' },
        { label: 'Neospinothalamic tract', detail: 'Through the brainstem, with branches to the reticular formation.' },
        { label: 'Thalamus' },
        { label: 'Sensory cortex' },
      ],
      sourceRefs: [...s2([20]), ...pn([2])],
    },
    {
      title: 'The slow pain pathway',
      kind: 'pathway',
      steps: [
        { label: 'Receptor → spinal nerve (C)' },
        { label: 'Dorsal horn laminae II and III', detail: 'A relay neuron passes the signal to lamina V.' },
        { label: 'Crosses to the opposite side' },
        { label: 'Paleospinothalamic tract' },
        { label: 'Brainstem', detail: 'Ends mainly in the reticular nuclei of the brainstem, the tectal area of the midbrain and the periaqueductal area around the aqueduct of Sylvius.' },
        { label: 'Thalamus', detail: 'Only 10–25% of the fibres reach it.' },
      ],
      keyPoints: ['The transmitter is substance P. It is slow to build up and slow to be destroyed — hence the slow onset, increasing intensity and long-lasting effect of slow pain (Sensory II, p. 21).'],
      sourceRefs: [...s2([21]), ...pn([3])],
    },
    {
      title: 'Pain control I: local suppression',
      kind: 'regulation',
      paragraphs: [
        'The degree of pain is subjective, and the brain is able to control pain input (Sensory II, p. 22).',
        'Local suppression: stimulating large sensory fibres from peripheral tactile receptors depresses the transmission of pain signals from the same area of the body, by pre- or post-synaptic inhibition (lateral inhibition). Examples: acupuncture, liniment, and a child blowing on or rubbing a hurt.',
      ],
      sourceRefs: [...s2([22]), ...pn([4])],
    },
    {
      title: 'Pain control II: the brain’s analgesic (opiate) system',
      kind: 'regulation',
      paragraphs: [
        'The brain has morphine-like substances that reduce pain, acting on receptors: naturally occurring opiates — endorphins, dynorphins and enkephalin. They act in the periaqueductal nucleus and grey area, and in the dorsal horn of the spinal cord (Sensory II, p. 23).',
      ],
      table: {
        columns: ['Component of the analgesic system', 'Where'],
        rows: [
          ['Periaqueductal grey area', 'Pons and midbrain'],
          ['Raphe magnus nucleus', 'Lower pons and upper medulla'],
          ['Pain-inhibiting complex', 'Dorsolateral horn of the spinal cord'],
        ],
      },
      sourceRefs: [...s2([23, 24]), ...pn([5, 6])],
    },
    {
      title: 'Referred pain, headache and dermatomes',
      kind: 'clinical',
      paragraphs: [
        'Referred pain is pain felt in a part of the body considerably removed from the tissue causing it (Sensory II, p. 28).',
        'Headache is usually referred pain from deep structures, inside or outside the cranium. The brain itself is insensitive, but the venous sinuses, tentorium and meninges are not.',
      ],
      table: {
        columns: ['Causes inside the cranium', 'Causes outside the cranium'],
        rows: [
          ['Inflammation', 'Muscular spasm'],
          ['Low CSF', 'Nasal sinuses'],
          ['Migraine', 'Eye disorders'],
          ['Alcohol, constipation', ''],
        ],
      },
      keyPoints: ['A dermatome is the skin area innervated by the sensory fibres of a single nerve root — the somatic area served by a specific spinal nerve (p. 29).'],
      sourceRefs: [...s2([28, 29]), ...pn([9, 10])],
    },
  ],
  summary: [
    'Fast pain: Aδ, sharp, superficial, rapid. Slow pain: C, burning, superficial and deep, builds slowly.',
    'Pain receptors are free nerve endings that barely adapt. Chemicals: bradykinin, histamine, K⁺, proteolytic enzymes, acids, prostaglandins.',
    'Deep/visceral pain: poorly localised, nauseating, autonomic signs; may be referred; caused by distension, spasm, chemicals and ischaemia.',
    'Fast: dorsal horn → cross → neospinothalamic → thalamus → cortex. Slow: laminae II/III → lamina V → cross → paleospinothalamic → brainstem (reticular, tectum, periaqueductal); only 10–25% reach the thalamus. Substance P.',
    'Local suppression: large tactile fibres inhibit pain from the same area (rubbing, liniment, acupuncture).',
    'Analgesic system: periaqueductal grey, raphe magnus, dorsal horn complex; endorphins, dynorphins, enkephalin.',
    'Referred pain; headache from sinuses, tentorium and meninges (the brain is insensitive); a dermatome is the skin of one nerve root.',
  ],
};

// ─── Lesson 5 ───────────────────────────────────────────────────────

const lesson5: Draft = {
  id: 'central-nervous-system-5',
  title: 'The Spinal Cord',
  description: 'Grey and white matter, the spinal nerves, how tracts are named, the plexuses and the laminae of the dorsal horn.',
  xp: 25,
  sourceRefs: sc([2, 3, 4, 5, 8, 10, 11, 12, 13, 14]),
  objectives: [
    'Describe the grey and white matter of the cord and what each contains',
    'Count the spinal nerves and explain how they are numbered',
    'Tell from a tract’s name whether it is sensory or motor',
    'Name the four plexuses and the main nerves of each',
    'Describe the laminae of the dorsal horn and the cells they contain',
  ],
  chunks: [
    {
      title: 'Grey and white matter',
      kind: 'structure',
      paragraphs: [
        'Grey matter is where cell bodies and synapses are: the synapses between sensory neurons, interneurons and motor neurons happen here, and it holds the cell bodies of the interneurons and motor neurons. White matter is myelinated fibre tracts (Spinal Cord, slide 3).',
        'In the cord the white matter surrounds the grey matter and contains the tracts that ascend and descend. The meninges surround both the cord and the brain (slide 4).',
      ],
      sourceRefs: sc([2, 3, 4]),
    },
    {
      title: 'The cord and its connections',
      kind: 'structure',
      paragraphs: [
        'The spinal cord is the connection centre for reflexes, and carries the afferent (sensory) and efferent (motor) pathways for most of the body below the head and neck. It begins at the brainstem and ends at about the second lumbar vertebra (Spinal Cord, slide 4).',
      ],
      steps: [
        { label: 'Sensory neuron cell body', detail: 'In the spinal (dorsal root) ganglion.' },
        { label: 'Axon through the dorsal root into the grey matter', detail: 'Where it may connect with interneurons.' },
        { label: 'Motor neuron in the grey matter', detail: 'Its axon leaves the cord through the ventral root.' },
      ],
      sourceRefs: sc([4]),
    },
    {
      title: 'The spinal nerves',
      kind: 'structure',
      paragraphs: [
        'Spinal nerves contain both sensory and motor fibres. Their numbers indicate the part of the vertebral column where they arise (Spinal Cord, slide 3).',
        'There are 8 cervical (C1–C8), 12 thoracic (T1–T12), 5 lumbar (L1–L5), 5 sacral (S1–S5) and 1 coccygeal nerve — 31 pairs. C1 arises between the cranium and the atlas, and C8 between the 7th cervical and 1st thoracic vertebrae. All the others arise below their vertebra (slide 5).',
      ],
      keyPoints: ['There are 8 cervical nerves but only 7 cervical vertebrae — that is why C8 exits below C7 and every nerve after it exits below its own vertebra.'],
      sourceRefs: sc([3, 5]),
    },
    {
      title: 'Naming the tracts',
      kind: 'definitions',
      paragraphs: ['Ascending tracts travel toward the brain and are sensory; descending tracts are motor. For most, the name tells you which (Spinal Cord, slide 8):'],
      table: {
        columns: ['Name begins with', 'Type', 'Example'],
        rows: [
          ['spino- (origin in the cord) and ends with its destination', 'Sensory (ascending)', 'Spinothalamic'],
          ['A part of the brain', 'Motor (descending)', 'Corticospinal'],
        ],
      },
      sourceRefs: sc([8, 9]),
    },
    {
      title: 'The plexuses',
      kind: 'classification',
      paragraphs: ['A plexus is an interconnection of fibres that form new combinations as the named peripheral nerves. There are four voluntary plexuses (Spinal Cord, slides 10–11):'],
      table: {
        columns: ['Plexus', 'Nerves (what they supply)'],
        rows: [
          ['Cervical', 'Phrenic (the diaphragm)'],
          ['Brachial', 'Axillary (deltoid, shoulder, back of upper arm); musculocutaneous (skin of front of upper arm, elbow flexors); radial (back of arm; extensors of elbow, wrist, fingers; thumb abduction); median (middle elbow, wrist and finger flexors; adducts thumb); ulnar (medial wrist and finger flexors)'],
          ['Lumbar', 'Genitofemoral (external genitalia); obturator (adductors); femoral (skin and muscles of upper thigh, including quadriceps)'],
          ['Sacral', 'Superior gluteal (gluteus medius, minimus); inferior gluteal (gluteus maximus); sciatic — the body’s largest nerve (tibial and common peroneal; most of the leg)'],
        ],
      },
      sourceRefs: sc([10, 11]),
    },
    {
      title: 'The laminae of the dorsal horn',
      kind: 'structure',
      paragraphs: ['The dorsal horn is divided into six layers (laminae) and processes sensory information (Spinal Cord, slides 12–13):'],
      table: {
        columns: ['Lamina', 'Contents and input'],
        rows: [
          ['I (most dorsal)', 'Thin layer of large cells with small inhibitory interneurons; the large cells’ axons form part of the spinothalamic tract'],
          ['II — substantia gelatinosa', 'Mostly inhibitory cells (some excitatory); believed to control the connectivity of the other laminae'],
          ['I–II together (superficial dorsal horn)', 'Input from nociceptors (high-threshold C and Aδ); nociceptive-specific (NS) and wide-dynamic-range (WDR) cells'],
          ['III–VI', 'Input from Aβ non-nociceptive afferents; low-threshold (LT) cells for innocuous sensation'],
          ['V (some cells)', 'WDR cells receiving both Aβ and C/Aδ input, as their dendrites reach up into laminae I–II'],
        ],
      },
      terms: [
        { term: 'NS (nociceptive-specific)', meaning: 'Responds only to noxious stimuli.' },
        { term: 'WDR (wide dynamic range)', meaning: 'Responds to both innocuous and noxious stimuli.' },
        { term: 'LT (low threshold)', meaning: 'Responds to innocuous sensations.' },
      ],
      keyPoints: ['The dorsal horn is not just a relay station: through primary afferents, spinal interneurons and descending fibres it modulates pain transmission (slide 13).'],
      sourceRefs: sc([4, 12, 13, 14]),
    },
  ],
  summary: [
    'Grey matter: cell bodies and synapses. White matter: myelinated tracts, surrounding the grey in the cord.',
    'The cord runs from the brainstem to about L2. Sensory cell bodies in the dorsal root ganglion; motor axons leave by the ventral root.',
    '31 pairs of spinal nerves: 8 C, 12 T, 5 L, 5 S, 1 Co. C1–C7 exit above their vertebra, C8 below C7, the rest below theirs.',
    'spino-… = sensory (ascending); a brain part first (cortico-…) = motor (descending).',
    'Plexuses: cervical (phrenic), brachial (axillary, musculocutaneous, radial, median, ulnar), lumbar (genitofemoral, obturator, femoral), sacral (gluteals, sciatic).',
    'Dorsal horn: lamina I (spinothalamic cells), II (substantia gelatinosa); I–II get C and Aδ (NS, WDR); III–VI get Aβ (LT); some lamina V cells are WDR.',
  ],
};

// ─── Lesson 6 ───────────────────────────────────────────────────────

const lesson6: Draft = {
  id: 'central-nervous-system-6',
  title: 'Motor Cortex and Descending Control',
  description: 'The final common pathway, the motor areas, the corticospinal tracts, brainstem control of posture, cord and cortical lesions, UMN versus LMN, and myotomes.',
  xp: 25,
  sourceRefs: mo([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19]),
  objectives: [
    'Explain the final common pathway and what influences the α-motor neuron',
    'Name the motor areas of the cortex and their roles',
    'Trace the corticospinal tracts and say what the lateral and medial tracts control',
    'Describe the reticular and vestibular control of antigravity muscles',
    'Explain spinal shock and the Brown-Séquard syndrome',
    'Distinguish upper from lower motor neuron lesions',
    'Recall the main myotomes',
  ],
  chunks: [
    {
      title: 'The final common pathway',
      kind: 'overview',
      paragraphs: [
        'Somatic motor activity is determined by the discharge of motor neurons in the spinal nerves and in the nuclei of the cranial nerves. These neurons form the final common pathway: they receive input from all over — suprasegmental, brainstem and cortical input, and sensory impulses (Motor Activity, slide 3).',
        'The influence is exerted on the α-motor neuron directly, via interneurons, or through γ-efferents (slides 2–3).',
      ],
      steps: [
        { label: 'Voluntary activity' },
        { label: 'Adjusting body posture', detail: 'A stable background for movement.' },
        { label: 'Coordinating the muscles', detail: 'For smooth, precise movement.' },
      ],
      sourceRefs: mo([2, 3]),
    },
    {
      title: 'The motor areas',
      kind: 'structure',
      paragraphs: [
        'The primary motor cortex lies in the frontal lobe along the central sulcus and is important in voluntary movement. Next to it are the higher-order supplementary and premotor areas, involved in planning a movement. The primary somatic sensory cortex lies just behind the sulcus in the parietal lobe (Motor Activity, slide 4).',
        'In the motor cortex the feet are at the top of the gyrus. Facial representation is bilateral; the rest of the body is unilateral, representing the opposite side. Cells are arranged in columns, each receiving extensive sensory input from the area it moves (slide 5).',
      ],
      table: {
        columns: ['Area', 'Role (slide 6)'],
        rows: [
          ['Supplementary motor area', 'Projects onto the motor cortex; plans motor sequences'],
          ['Premotor cortex (function not clear)', 'Projects to brainstem postural areas; part of the corticospinal and corticobulbar output; may set body posture; connected with the basal ganglia and thalamus'],
          ['Posterior parietal (somatosensory) cortex', 'Corticobulbar and corticospinal fibres; projects to the premotor area; may help execute learned sequences'],
        ],
      },
      sourceRefs: mo([4, 5, 6]),
    },
    {
      title: 'Specialised motor areas',
      kind: 'structure',
      terms: [
        { term: 'Broca’s area', meaning: 'Speech. Damage makes speech other than simple words impossible; an associated area coordinates breathing with speech.' },
        { term: 'Voluntary eye movement area', meaning: 'Voluntary eye movements.' },
        { term: 'Head rotation area', meaning: 'Closely associated with the eye movement area.' },
        { term: 'Hand skills area', meaning: 'Damage causes non-purposeful hand movement — apraxia.' },
      ],
      sourceRefs: mo([7]),
    },
    {
      title: 'Sending the motor signal',
      kind: 'pathway',
      steps: [
        { label: 'The pattern is planned in the motor cortex' },
        { label: 'Corticobulbar and corticospinal tracts carry it' },
        { label: 'Medial and intermediate cerebellum', detail: 'Smooth and coordinate the movement.' },
        { label: 'Basal (lateral) cerebellum', detail: 'Part of the feedback circuit to the motor and premotor areas, for planning and organising movement.' },
      ],
      sourceRefs: mo([8]),
    },
    {
      title: 'The corticospinal (pyramidal) tracts',
      kind: 'pathway',
      steps: [
        { label: 'Origin', detail: 'Precentral gyrus, premotor and supplementary motor areas, and the postcentral gyrus (slide 9).' },
        { label: 'Midbrain', detail: 'Ventral surface, in the cerebral peduncles.' },
        { label: 'Pons' },
        { label: 'Medulla', detail: 'Visible as the pyramids on its ventral surface.' },
        { label: 'Decussation of the pyramids', detail: 'In the caudal medulla, most fibres cross (slide 10).' },
      ],
      table: {
        columns: ['', 'Lateral corticospinal', 'Medial (ventral) corticospinal'],
        rows: [
          ['Fibres', 'Crossed — from the opposite cortex', 'Uncrossed — from the same-side cortex'],
          ['Controls', 'Limb muscles', 'Axial and trunk muscles'],
          ['Ends', 'Mostly directly on motor neurons; some on interneurons', 'Mainly by way of interneurons'],
        ],
      },
      keyPoints: ['Both tracts control the girdle muscles (Motor Activity, slide 11).'],
      sourceRefs: mo([9, 10, 11]),
    },
    {
      title: 'The brainstem and posture',
      kind: 'regulation',
      paragraphs: [
        'The brainstem is an extension of the cord with motor and sensory functions, and control of respiration, the CVS and GI system, stereotyped movements, eye movements and equilibrium (Motor Activity, slide 16).',
      ],
      table: {
        columns: ['Nucleus', 'Effect on antigravity muscles', 'Tract'],
        rows: [
          ['Medullary reticular', 'Inhibits', 'Reticulospinal'],
          ['Pontine reticular', 'Excites', 'Reticulospinal'],
          ['Vestibular', 'Excites — maintains equilibrium', 'Vestibulospinal'],
        ],
      },
      keyPoints: ['Both reticular areas are controlled by the cerebral cortex. When the neural axis is cut, activities integrated below the cut are “released” from higher control (slides 16–17).'],
      sourceRefs: mo([16, 17]),
    },
    {
      title: 'Cortical and cord lesions',
      kind: 'clinical',
      paragraphs: [
        'Damage to the motor cortex or the corticospinal pathway is a stroke. Motor cortex damage loses voluntary control of discrete muscles of the distal limbs (hands, fingers). Damage to the area adjacent to the motor cortex causes hypotonia followed by spasticity, due to disinhibition (Motor Activity, slide 14).',
      ],
      table: {
        columns: ['Cord lesion', 'Effect'],
        rows: [
          ['Complete transection', 'Spinal shock: paralysis and depression of all spinal reflexes below the cut, followed about 2 weeks later by spasticity as the reflexes return, hyperactive'],
          ['Partial transection (hemisection): Brown-Séquard', 'Same side: loss of joint position sense, vibration, fine touch and motor function. Opposite side: loss of pain, temperature and crude touch'],
        ],
      },
      keyPoints: [
        'Spinal shock is of uncertain cause — the loss of tonic influences on spinal neurons. Recovery with hyperreflexia may be due to denervation hypersensitivity or sprouting of collaterals forming new excitatory input (slide 18).',
        'Complications: protein catabolism, pressure sores that heal poorly, hypercalcaemia and hypercalciuria from bone breakdown, hyperactive stretch and autonomic reflexes, and swings in BP (slide 18).',
      ],
      sourceRefs: mo([14, 17, 18]),
    },
    {
      title: 'Upper versus lower motor neuron lesions',
      kind: 'comparison',
      table: {
        columns: ['', 'Lower motor neuron (LMN)', 'Upper motor neuron (UMN)'],
        rows: [
          ['Which neurons', 'Directly innervate muscle, spinal or cranial (the α-motor neuron)', 'In the brain and spinal cord; activate the α-motor neuron'],
          ['Paralysis', 'Flaccid', 'Spastic'],
          ['Wasting', 'Muscle atrophy', 'No atrophy'],
          ['Reflexes', 'Reduced', 'Exaggerated'],
          ['Other', 'Fibrillation (irregular fibre contractions)', ''],
        ],
      },
      notes: [{ kind: 'clarified', text: 'On slide 19 the reflex arrows did not survive in the copy supplied. Guyton: reflexes are reduced or absent in LMN lesions and exaggerated in UMN lesions — consistent with the hyperactive stretch reflexes after spinal shock (slide 18).' }],
      sourceRefs: [...mo([18, 19]), ...GUYTON],
    },
    {
      title: 'Myotomes',
      kind: 'definitions',
      paragraphs: ['Each muscle is supplied by a particular segment of the cord and its spinal nerve; the muscle and its nerve make a myotome, roughly the same in everyone (Motor Activity, slide 15).'],
      table: {
        columns: ['Segment', 'Movement'],
        rows: [
          ['C3, 4, 5', 'Diaphragm'],
          ['C5', 'Shoulder muscles; bending the elbow'],
          ['C6', 'Bending the wrist back'],
          ['C7', 'Straightening the elbow'],
          ['C8', 'Bending the fingers'],
          ['T1', 'Spreading the fingers'],
          ['T1–T12', 'Chest wall and abdominal muscles'],
          ['L2', 'Bending the hip'],
          ['L3', 'Straightening the knee'],
          ['L4', 'Pulling the foot up'],
          ['L5', 'Wiggling the toes'],
          ['S1', 'Pulling the foot down'],
          ['S3, 4, 5', 'Bladder, bowel, sex organs, anal and pelvic muscles'],
        ],
      },
      sourceRefs: mo([15]),
    },
  ],
  summary: [
    'Final common pathway: spinal and cranial motor neurons, influenced directly, via interneurons and via γ-efferents → voluntary movement, posture, coordination.',
    'Primary motor cortex in front of the central sulcus (feet at the top, face bilateral, rest contralateral); supplementary and premotor areas plan.',
    'Broca’s area (speech), eye movement and head rotation areas, hand skills area (damage → apraxia).',
    'Corticospinal: motor, premotor, supplementary and postcentral cortex → peduncles → pons → pyramids → decussation in the caudal medulla. Lateral (crossed): limbs. Medial (uncrossed): axial and trunk.',
    'Medullary reticular inhibits, pontine reticular and vestibular excite antigravity muscles.',
    'Transection: spinal shock (~2 weeks of areflexia) then spasticity. Hemisection: Brown-Séquard.',
    'LMN: flaccid, atrophy, reduced reflexes, fibrillation. UMN: spastic, no atrophy, brisk reflexes.',
    'Myotomes: C3–5 diaphragm … L3 knee extension, L4 dorsiflexion, S1 plantarflexion, S3–5 pelvic organs.',
  ],
};

// ─── Lesson 7 ───────────────────────────────────────────────────────

const lesson7: Draft = {
  id: 'central-nervous-system-7',
  title: 'The Cerebellum',
  description: 'Anatomy, inputs and outputs, how the cerebellum compares intention with performance, damping and ballistic movements, and the signs of cerebellar disease.',
  xp: 25,
  sourceRefs: cb([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 16, 17, 18]),
  objectives: [
    'Describe the lobes, hemispheres and zones of the cerebellum',
    'Match each zone to the movements it controls',
    'List the inputs to the cerebellum and where its output goes',
    'Explain how the cerebellum compares intention with performance',
    'Explain damping, ballistic movements and the planning role of the lateral cerebellum',
    'List the clinical signs of cerebellar dysfunction',
  ],
  chunks: [
    {
      title: 'Anatomy of the cerebellum',
      kind: 'structure',
      paragraphs: [
        'The cerebellum (“little brain”) lies at the back of the head, below the occipital lobe and behind the brainstem, to which it is connected. It controls balance and coordination and is where learned movements are stored; its Purkinje neurons control the refinement of movement (Cerebellum, slides 2–3).',
        'It has three lobes — anterior, posterior and flocculonodular — and two hemispheres separated by the vermis, each with lateral and intermediate zones (slide 3). It connects with the brainstem, basal ganglia and cerebral hemispheres; together they control the smooth coordination of movement (slide 5).',
      ],
      table: {
        columns: ['Zone', 'Controls (slide 6)'],
        rows: [
          ['Vermis', 'Axial body: neck, hips and shoulders'],
          ['Intermediate zone', 'Distal upper and lower limbs (hands, feet, toes); limbs and face'],
          ['Lateral zone', 'Overall planning of sequential movement (with the motor and premotor association areas); no topographical representation'],
        ],
      },
      keyPoints: ['The dentate nucleus coordinates skilled movement. When it is damaged, smooth movements become jerky and must be constantly relearned (slide 7).'],
      sourceRefs: cb([2, 3, 5, 6, 7]),
    },
    {
      title: 'Inputs',
      kind: 'pathway',
      table: {
        columns: ['From', 'Pathway'],
        rows: [
          ['Cortex', 'Corticopontocerebellar: from the motor, premotor and some sensory cortex, to the opposite side of the cerebellum'],
          ['Brainstem', 'Olivocerebellar (excited by the motor cortex, basal ganglia, reticular formation and spinal cord)'],
          ['Vestibular apparatus and nuclei', 'Vestibulocerebellar, to the flocculonodular lobe'],
          ['Periphery', 'Spinocerebellar: tactile receptors, spindles, Golgi tendon organs and joint receptors'],
        ],
      },
      keyPoints: [
        'Spinocerebellar neurons are also excited by motor signals arriving at the anterior horn from the cortex, telling the cerebellum which motor signals have arrived. This is the most rapid pathway in terms of conduction (Cerebellum, slide 11).',
        'The cerebellum receives information about pressure on the limbs, limb movement and the position of the limbs in space (slide 7).',
      ],
      sourceRefs: cb([7, 10, 11]),
    },
    {
      title: 'Outputs',
      kind: 'pathway',
      paragraphs: [
        'The cerebellum’s output goes to the medulla and pons (equilibrium and postural attitudes of the body), to the cortex through the thalamus, to the basal ganglia through the thalamus, and to the red nucleus and reticular formation. It controls the reciprocal contraction of agonists and antagonists in the limbs (Cerebellum, slide 11).',
      ],
      sourceRefs: cb([11]),
    },
    {
      title: 'Comparing intention with performance',
      kind: 'mechanism',
      steps: [
        { label: 'Intention', detail: 'Direct information from the motor cortex and red nucleus about the planned movement for the next fractions of a second.' },
        { label: 'Performance', detail: 'Feedback from the periphery about the movement actually happening.' },
        { label: 'Comparison', detail: 'The cerebellum compares the two and coordinates agonists and antagonists for a well-patterned movement.' },
      ],
      paragraphs: [
        'It controls the balance between agonists and antagonists in rapid changes of posture, calculates where each part of the body will be during the next sequence of movements, and helps the cortex plan the timing and sequence of successive movements (Cerebellum, slides 12–13).',
      ],
      sourceRefs: cb([12, 13]),
    },
    {
      title: 'Damping and ballistic movements',
      kind: 'mechanism',
      paragraphs: [
        'Damping: movement is usually pendular. The cerebellum normally damps the pendular movement; destroy it and movements overshoot — intention tremor (Cerebellum, slide 16).',
        'Ballistic movements are so rapid (e.g. typing) that there may be no time to receive feedback: they are preplanned to go a certain distance and stop. Without the cerebellum they are slow to develop and weak in force, so the movement goes beyond the intended mark (slide 16).',
      ],
      sourceRefs: cb([16]),
    },
    {
      title: 'Planning and prediction: the lateral cerebellum',
      kind: 'mechanism',
      paragraphs: [
        'The lateral cerebellum plans sequential movement. Smooth movement depends on what will happen during the next movements, with appropriate timing; without it, successive movements may begin too early or too late (Cerebellum, slide 17).',
        'It also has an extra predictive function: judging from a visual scene how fast you are approaching an object — crossing a road, a moving train or car.',
      ],
      sourceRefs: cb([17]),
    },
    {
      title: 'Signs of cerebellar dysfunction',
      kind: 'clinical',
      terms: [
        { term: 'Dysmetria and ataxia', meaning: 'Overshooting a movement and then trying to compensate. Past-pointing on finger–nose and finger–finger tests.' },
        { term: 'Intention tremor', meaning: 'Tremor that appears during a movement, from loss of damping.' },
        { term: 'Nystagmus', meaning: 'Involuntary oscillation of the eyes.' },
        { term: 'Dysdiadochokinesia', meaning: 'Inability to make rapid alternating movements.' },
        { term: 'Dysarthria', meaning: 'Jumbled vocalisation — the mouth, larynx and respiratory muscles cannot be coordinated (scanning speech).' },
        { term: 'Pendular reflexes and hypotonia', meaning: 'Reflexes swing on; the muscles are hypotonic.' },
      ],
      keyPoints: [
        'Memory aid from the slide: PINDAH — past-pointing, intention tremor, nystagmus, dysdiadochokinesia, ataxia, hypotonia (Cerebellum, slide 18).',
        'Also: loss of fine coordination, inability to walk or to reach out and grab objects, tremors, dizziness (vertigo), slurred speech and inability to make rapid movements (slide 8).',
      ],
      sourceRefs: cb([8, 16, 18]),
    },
  ],
  summary: [
    'Three lobes (anterior, posterior, flocculonodular); two hemispheres with the vermis between; intermediate and lateral zones.',
    'Vermis: axial; intermediate: distal limbs and face; lateral: planning. Dentate nucleus: skilled movement.',
    'Inputs: corticopontocerebellar (to the opposite side), olivocerebellar, vestibulocerebellar (flocculonodular), spinocerebellar (spindles, tendon organs, joints, touch).',
    'Compares intention (cortex, red nucleus) with performance (periphery) → coordinates agonists and antagonists.',
    'Damping prevents overshoot (intention tremor); ballistic movements are preplanned; the lateral cerebellum times successive movements and predicts.',
    'PINDAH: past-pointing, intention tremor, nystagmus, dysdiadochokinesia (and dysarthria), ataxia, hypotonia.',
  ],
};

// ─── Lesson 8 ───────────────────────────────────────────────────────

const lesson8: Draft = {
  id: 'central-nervous-system-8',
  title: 'The Basal Ganglia',
  description: 'The nuclei of the basal ganglia, the putamen and caudate circuits, their transmitters, the “brake”, and Parkinson’s, Huntington’s, athetosis and hemiballismus.',
  xp: 25,
  sourceRefs: [...cb([19, 20, 21, 22, 23, 24, 26, 27]), ...bg([2, 3, 5, 6, 7, 8, 9, 10])],
  objectives: [
    'Name the five structures of the basal ganglia, the striatum and the lentiform nucleus',
    'Describe the loop from cortex to basal ganglia to thalamus and back',
    'Contrast the putamen and caudate circuits',
    'Match each transmitter to its pathway and effect',
    'Explain the basal ganglia as a brake, and hyperkinetic versus hypokinetic disorders',
    'Explain the features of Parkinson’s and Huntington’s disease, athetosis and hemiballismus',
  ],
  chunks: [
    {
      title: 'What the basal ganglia are',
      kind: 'structure',
      paragraphs: [
        'The basal ganglia are deep nuclei of the cerebrum: a collection of interconnected cell bodies lying lateral to the thalamus, deep to the white matter of the cerebral cortex. They are generally concerned with the coordination of movement (Basal Ganglia, slide 3).',
        'They form loop-like feedback connections with the motor areas: the cortex projects to the basal ganglia, which project to the thalamus (ventrolateral and ventroanterior nuclei), which projects back to the cortex. With the substantia nigra and subthalamus this network forms the extrapyramidal system (slide 2).',
      ],
      terms: [
        { term: 'The five structures', meaning: 'Caudate nucleus, putamen, globus pallidus, subthalamic nucleus and substantia nigra.' },
        { term: 'Striatum', meaning: 'Caudate nucleus and putamen.' },
        { term: 'Lentiform (lenticular) nucleus', meaning: 'Putamen and globus pallidus.' },
      ],
      sourceRefs: [...cb([19]), ...bg([2, 3])],
    },
    {
      title: 'Two circuits',
      kind: 'comparison',
      table: {
        columns: ['Putamen circuit', 'Caudate circuit'],
        rows: [
          ['Controls complex patterns of skilled motor activity', 'Cognitive control of motor activity'],
          ['e.g. writing the alphabet, passing a football, throwing hoops', 'e.g. turning away, climbing a tree, running away from a snake'],
          ['', 'Involved in learning and memory; the “automatic” performance of previously learned movements'],
        ],
      },
      sourceRefs: [...cb([20, 21]), ...bg([5])],
    },
    {
      title: 'Neurotransmitters',
      kind: 'pathway',
      table: {
        columns: ['Transmitter', 'Pathway', 'Effect'],
        rows: [
          ['Dopamine', 'Substantia nigra → putamen and caudate', 'Inhibitory'],
          ['GABA', 'Caudate → globus pallidus and substantia nigra', 'Inhibitory'],
          ['Acetylcholine', 'Cortex → caudate and putamen', 'Excitatory'],
          ['Noradrenaline, serotonin, enkephalin', 'Multiple pathways', ''],
        ],
      },
      notes: [{ kind: 'lecturer', text: 'The lecture gives dopamine as inhibitory to the striatum, and builds Parkinson’s on that: losing it removes inhibition, so the caudate and putamen become overactive. Learn it in this form for this course.' }],
      sourceRefs: [...cb([22]), ...bg([6])],
    },
    {
      title: 'The brake',
      kind: 'regulation',
      paragraphs: [
        'The overall function of the basal ganglia is inhibitory — as though putting on the brakes. To sit still you must put the brakes on all movements except the reflexes that maintain an upright posture. To move, you must apply a brake to some postural reflexes and release the brake on voluntary movement (Basal Ganglia, slide 7).',
        'In such a complicated system small disturbances throw it out of balance, often unpredictably. The deficits fall into two categories:',
      ],
      table: {
        columns: ['Hyperkinetic', 'Hypokinetic'],
        rows: [['Extraneous, unwanted movements', 'Absence of, or difficulty with, intended movements: akinesia and bradykinesia']],
      },
      keyPoints: ['Some patterns of movement demand coordination between inhibition and excitation; if one component is lost, the movement is a “no show” (slide 9).'],
      sourceRefs: [...cb([23, 26]), ...bg([7, 9])],
    },
    {
      title: 'Parkinson’s disease (hypokinetic)',
      kind: 'clinical',
      paragraphs: [
        'Parkinson’s disease is the slow, steady loss of dopaminergic neurons in the substantia nigra — degeneration of the nigrostriatal dopamine system. (The slide notes these neurons need high copper and oxygen.) (Basal Ganglia, slide 8.)',
        'Losing dopamine cuts off its inhibitory influence on the caudate and putamen. Their excitatory influence then dominates — overactivity and rigidity. Activity once started is difficult to break (slide 9).',
      ],
      steps: [
        { label: 'Tremor (shaking)' },
        { label: 'Lead-pipe or cogwheel rigidity (muscle tightness)' },
        { label: 'Bradykinesia (slowed movements)', detail: 'With difficulty initiating motor activity.' },
      ],
      sourceRefs: [...cb([24, 26]), ...bg([8, 9])],
    },
    {
      title: 'Hyperkinetic disorders',
      kind: 'clinical',
      table: {
        columns: ['Disorder', 'Movement', 'Lesion'],
        rows: [
          ['Chorea', 'Rapid involuntary movements', 'Degeneration of the caudate nucleus'],
          ['Huntington’s disease', 'Continuous dance-like movements of the face and limbs, with dementia', 'Hereditary (dominant), onset at 30–50: degeneration of caudate and putamen, with loss of cholinergic and GABA-secreting neurons in the striatum'],
          ['Athetosis', 'Continuous slow, writhing movement', 'Lesion of the lenticular nucleus'],
          ['Hemiballismus', 'Intense, violent flailing of one arm and leg', 'Damage (e.g. stroke) of the subthalamic nucleus'],
        ],
      },
      notes: [{ kind: 'check', text: 'The slides call it “the subthalamic nucleus of the thalamus”. The subthalamic nucleus is one of the basal ganglia, listed separately from the thalamus on slide 3 — ask your lecturer if the wording matters.' }],
      sourceRefs: [...cb([24, 26, 27]), ...bg([8, 9, 10])],
    },
  ],
  summary: [
    'Basal ganglia: caudate, putamen, globus pallidus, subthalamic nucleus, substantia nigra. Striatum = caudate + putamen; lentiform = putamen + globus pallidus.',
    'Loop: cortex → basal ganglia → thalamus (VL, VA) → cortex: the extrapyramidal system.',
    'Putamen circuit: skilled patterns. Caudate circuit: cognitive control, learning, automatic learned movements.',
    'Dopamine (SN → striatum) inhibitory; GABA (caudate → GP, SN) inhibitory; ACh (cortex → striatum) excitatory.',
    'The brake: hyperkinetic (unwanted movement) vs hypokinetic (akinesia, bradykinesia).',
    'Parkinson’s: nigrostriatal dopamine loss → tremor, rigidity, bradykinesia. Huntington’s: striatal GABA/ACh loss → chorea, dementia. Athetosis: lenticular. Hemiballismus: subthalamic nucleus.',
  ],
};

// ─── Lesson 9 ───────────────────────────────────────────────────────

const lesson9: Draft = {
  id: 'central-nervous-system-9',
  title: 'The Brain',
  description: 'The parts of the brain, the four lobes and the effects of damage to each, the brainstem, cerebral dominance and the corpus callosum, and the deep structures.',
  xp: 25,
  sourceRefs: br([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28]),
  objectives: [
    'Describe the meninges, hemispheres, tentorium, ventricles and CSF',
    'State the functions of each lobe and the effects of damage to it',
    'Describe the parts of the brainstem, what each does and the effects of damage',
    'Explain cerebral dominance and what happens when the corpus callosum is cut',
    'Describe the thalamus, hypothalamus, limbic system and hippocampus',
  ],
  chunks: [
    {
      title: 'How the brain is built',
      kind: 'overview',
      paragraphs: [
        'The brain is the control centre of the body: it controls the body by sending electrical messages along nerve fibres, which join to make the spinal cord. Brain and cord form the CNS, and cerebrospinal fluid (CSF) circulates around them (The Brain, slide 2).',
        'It is made of billions of neurones, supported by glial cells (slide 3). The skull protects it, and inside the skull three thin sheets — the meninges — cover it (slide 4).',
        'The forebrain is divided into the right and left cerebral hemispheres, which control movement, thinking, memory, emotions, the senses and speech. Nerve fibres cross as they leave the brain, so the right side of the brain controls the left side of the body (slide 4).',
      ],
      terms: [
        { term: 'Tentorium', meaning: 'Part of the meninges; separates the hindbrain (cerebellum) and brainstem from the rest of the brain. Supratentorial = above it; infratentorial = in the cerebellum or brainstem (slide 15).' },
        { term: 'Ventricles', meaning: 'Spaces inside the brain filled with CSF, connecting with the centre of the cord and the meninges so the fluid can circulate (slide 20).' },
        { term: 'Hindbrain (cerebellum)', meaning: 'Controls balance and coordination (slide 16).' },
      ],
      sourceRefs: br([2, 3, 4, 15, 16, 20]),
    },
    {
      title: 'The frontal lobe',
      kind: 'structure',
      paragraphs: [
        'The prefrontal cortex is responsible for complex thought and emotional expression; the inferior frontal cortex for smell, instincts and raw emotions; the posterior frontal lobe for motor functions, including speech (The Brain, slide 7). It holds personality, thought, memory and behaviour (slide 6).',
        'Damage — most often from traumatic brain injury, stroke or tumour (slide 8) — can cause:',
      ],
      steps: [
        { label: 'Paralysis', detail: 'Loss of simple movement of body parts.' },
        { label: 'Sequencing problems', detail: 'Cannot plan the steps of a multi-step task, such as making coffee.' },
        { label: 'Perseveration', detail: 'Persistence of a single thought or action; loss of flexibility in thinking and of spontaneity with others; poor attention.' },
        { label: 'Mood and personality change', detail: 'Emotional lability, changed social behaviour, difficulty controlling behaviour and solving problems.' },
        { label: 'Broca’s aphasia', detail: 'Inability to express language.' },
      ],
      sourceRefs: br([6, 7, 8]),
    },
    {
      title: 'The temporal lobe',
      kind: 'structure',
      paragraphs: [
        'The temporal lobes let us tell one sound from another and are believed to be involved in short-term memory. The left is mainly verbal memory and language comprehension; the right visual memory, musical ability and identifying visual objects. They rest on the limbic system, the seat of raw emotions (The Brain, slide 9). Emotional memory is here, so a problem can cause déjà vu (slide 6).',
      ],
      steps: [
        { label: 'Prosopagnosia', detail: 'Difficulty recognising faces.' },
        { label: 'Wernicke’s aphasia', detail: 'Difficulty understanding spoken words.' },
        { label: 'Memory', detail: 'Short-term memory loss; interference with long-term memory.' },
        { label: 'Attention and objects', detail: 'Disturbed selective attention to what we see and hear; difficulty identifying and talking about objects.' },
        { label: 'Behaviour', detail: 'Increased or decreased sexual interest; increased aggression.' },
      ],
      sourceRefs: br([6, 9, 10]),
    },
    {
      title: 'The parietal lobe',
      kind: 'structure',
      paragraphs: [
        'The parietal lobe controls bodily sensation, shape, texture and position, and puts touch sensations together — shape, size, texture and weight — into a three-dimensional knowledge of objects. The right side is involved in directing attention and visuospatial skills; the left in overlearned motor routines and linguistic skills such as reading, writing and naming objects (The Brain, slide 11).',
      ],
      steps: [
        { label: 'Anomia, agraphia, alexia', detail: 'Cannot name objects, find words for writing, or read.' },
        { label: 'Dyscalculia', detail: 'Difficulty with mathematics.' },
        { label: 'Spatial problems', detail: 'Difficulty drawing, telling left from right, and with eye–hand coordination.' },
        { label: 'Attention', detail: 'Cannot attend to more than one object at a time or focus visual attention.' },
        { label: 'Lack of awareness of body parts or surrounding space', detail: 'Leading to difficulty with self-care.' },
      ],
      notes: [
        { kind: 'check', text: 'Slide 6 says the parietal lobe is “mainly to do with language”; slide 11 describes it mainly as sensation and integration, with language on the left side. Only the slide-11 description is quizzed.' },
        { kind: 'check', text: 'Slide 12 calls lack of awareness of body parts “apraxia”. Elsewhere the course uses apraxia for non-purposeful movement (Motor Activity, slide 7) and amorphosynthesis for neglect of the opposite side (Sensory II, p. 3).' },
      ],
      sourceRefs: [...br([6, 11, 12]), ...mo([7]), ...s2([3])],
    },
    {
      title: 'The occipital lobe',
      kind: 'structure',
      paragraphs: [
        'The occipital lobe is the visual centre, controlling sight, reading and visual images. Destroy its visuosensory centre and the person is blind even with perfect eyes and optic nerves. Destroy only the surrounding visual association area and the person can see but cannot recognise what they are seeing (The Brain, slides 13–14).',
      ],
      steps: [
        { label: 'Visual field cuts' },
        { label: 'Agnosias', detail: 'Colour agnosia, movement agnosia, word blindness, difficulty recognising drawn objects.' },
        { label: 'Hallucinations and visual illusions' },
        { label: 'Difficulty locating objects in the environment' },
      ],
      sourceRefs: br([6, 13, 14]),
    },
    {
      title: 'The brainstem',
      kind: 'structure',
      paragraphs: [
        'The brainstem connects the spinal cord to the forebrain and cerebellum and controls functions we do not think about: blood pressure, swallowing, breathing and heartbeat. It has three parts (The Brain, slides 17–18):',
      ],
      table: {
        columns: ['Part', 'Role'],
        rows: [
          ['Midbrain (smallest, above the pons)', 'Visual reflexes, some hearing mechanisms, unconscious regulation and coordination of movement'],
          ['Pons', 'Relays from the cerebrum to the cerebellum; contains fibres of the reticular formation and reticular activating system — sleep–wake cycle, consciousness, alertness'],
          ['Medulla oblongata', 'Reflexes of heart rate, BP, swallowing and breathing; the nerve tracts cross here, so each half of the brain controls the opposite side'],
        ],
      },
      keyPoints: ['Damage: coma or altered consciousness, changes in heart rate and BP, reduced vital capacity (affecting speech), dysphagia, poor balance and movement, vertigo, insomnia or sleep apnoea, attention deficits (slide 19).'],
      sourceRefs: br([17, 18, 19]),
    },
    {
      title: 'Cerebral dominance and the corpus callosum',
      kind: 'mechanism',
      paragraphs: [
        'The cerebral cortex is the highest level of the CNS — complex thought, perception and action. The left hemisphere controls the right half of the body and vice versa. In most people speech areas are on the left and spatial perception on the right (The Brain, slide 22).',
        'About 87% of people are right-handed and left-hemisphere dominant: one hemisphere “leads” in speech and motor functions. So a left-sided stroke usually brings aphasia, apraxia and difficulty using the right side of the body. Broca’s area (speech production) and Wernicke’s area (comprehension) lie in the left hemisphere (slide 23).',
        'The corpus callosum is the thick bundle of fibres linking the hemispheres. When it is cut there is still perception, but no messages pass between the hemispheres: each hand draws only what its half of the brain sees, and the language-handling left hemisphere knows nothing of what the right saw (slide 24).',
      ],
      sourceRefs: br([22, 23, 24]),
    },
    {
      title: 'Thalamus, hypothalamus and limbic system',
      kind: 'structure',
      terms: [
        { term: 'Thalamus', meaning: 'A relay station: every sensory system except smell passes through it to the cortex; it also directs attention and screens out distractions (slide 25).' },
        { term: 'Hypothalamus', meaning: 'Under the thalamus; keeps homeostasis by holding BP, temperature, hunger, thirst, fluid and electrolyte balance, body weight, emotion and circadian rhythms at a set-point (slide 26).' },
        { term: 'Limbic system', meaning: 'Hippocampus, fornix, thalamus, hypothalamus, amygdala, olfactory cortex and cingulate gyrus — emotion, drives, motivation, mood, pleasure and pain, smell and memory. Lesions: voracious appetite, increased sexual activity and docility (slide 27).' },
        { term: 'Hippocampus', meaning: 'C-shaped, linked to the hypothalamus by the fornix; needed to move new memories into long-term storage (slide 28).' },
      ],
      keyPoints: ['A patient whose medial temporal lobes and hippocampi were removed in 1953 formed no new declarative memories, yet kept old memories, working memory and the ability to learn skills (slide 28).'],
      sourceRefs: br([25, 26, 27, 28]),
    },
  ],
  summary: [
    'Brain + cord = CNS; CSF circulates in the ventricles and around both; three meninges; the tentorium separates the cerebellum and brainstem (infratentorial) from the rest.',
    'Frontal: thought, personality, movement, speech (Broca). Damage: paralysis, sequencing, perseveration, personality change, Broca’s aphasia.',
    'Temporal: hearing, memory, comprehension (Wernicke), faces. Damage: prosopagnosia, Wernicke’s aphasia, memory loss.',
    'Parietal: sensation and integration; left — reading, writing, naming; right — attention, spatial skills. Damage: anomia, agraphia, alexia, dyscalculia.',
    'Occipital: primary visual area (damage → blindness) and association area (damage → sees but cannot recognise).',
    'Brainstem: midbrain (visual reflexes), pons (relay to cerebellum, reticular activating system), medulla (vital reflexes; tracts cross).',
    'Left-hemisphere dominance in ~87%; Broca and Wernicke on the left; cut corpus callosum → hemispheres work separately.',
    'Thalamus: relay (not smell). Hypothalamus: set-points. Limbic system: emotion and drives. Hippocampus: new long-term memories.',
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: withSimulation(lesson.id, interactive[lesson.id]),
}));
