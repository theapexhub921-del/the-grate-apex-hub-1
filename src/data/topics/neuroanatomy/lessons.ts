// Anatomy → Neuroanatomy (gross): the eight lessons (reading layer).
import type { LessonDraft } from '@/data/topics/build';
import { interactive } from '@/data/topics/neuroanatomy/interactive';
import { cns, GRAYS, men, TOPIC_ID, type ConceptId } from '@/data/topics/neuroanatomy/sources';

type Draft = LessonDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

// ─── Lesson 1: The Nervous System and the Cerebral Hemispheres ───────

const lesson1: Draft = {
  id: L(1),
  title: 'The Nervous System and the Cerebral Hemispheres',
  description: 'How the nervous system is divided, the parts of the brain, and the lobes, sulci and gyri of the cerebral hemispheres on each surface.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: [...men([2, 3, 4, 7]), ...cns([3, 4, 5, 7, 9, 10, 11, 12, 14, 15, 16, 18])],
  objectives: [
    'Describe the structural and functional divisions of the nervous system.',
    'State the parts of the brain.',
    'Name the lobes and main sulci of the cerebral hemisphere.',
    'Describe the gyri and sulci of the superolateral, medial and inferior surfaces.',
  ],
  chunks: [
    {
      title: 'Divisions of the Nervous System',
      kind: 'classification',
      paragraphs: [
        'The nervous system lets the body react to continuous changes in its internal and external environment, and controls and integrates activities such as circulation and respiration.',
        'Structurally it has a central nervous system (brain and spinal cord) and a peripheral nervous system (cranial and spinal nerves and their ganglia). Functionally it has a somatic nervous system — supplying skeletal muscle (efferent) and carrying sensory information (afferent) — and an autonomic nervous system controlling cardiac muscle, smooth muscle and glands (with afferent and efferent pathways). Both central and peripheral parts contain somatic and autonomic components.',
      ],
      table: {
        columns: ['Division', 'Parts / role'],
        rows: [
          ['Central (CNS)', 'Brain and spinal cord'],
          ['Peripheral (PNS)', 'Cranial and spinal nerves and ganglia'],
          ['Somatic', 'Skeletal muscle and sensory information'],
          ['Autonomic', 'Cardiac muscle, smooth muscle and glands'],
        ],
      },
      terms: [
        { term: 'Autonomic nervous system', meaning: 'Controls cardiac muscle, smooth muscle and glands.' },
        { term: 'Somatic nervous system', meaning: 'Supplies skeletal muscle and carries sensory information.' },
      ],
      keyPoints: [
        'Structural: CNS vs PNS. Functional: somatic vs autonomic.',
      ],
      sourceRefs: men([2, 3, 4, 7]),
    },
    {
      title: 'Parts of the Brain',
      kind: 'structure',
      paragraphs: [
        'The CNS is the brain and spinal cord. The brain has a forebrain — two cerebral hemispheres (telencephalon) with the lateral ventricles, and the diencephalon (thalamus, hypothalamus and third ventricle); a midbrain between forebrain and hindbrain, containing the cerebral aqueduct; and a hindbrain — pons, medulla oblongata and cerebellum.',
        'The cerebrum lies above the floor of the anterior and middle cranial fossae and the tentorium cerebelli. Its medial surface, against the falx cerebri, is flat; its superolateral surface is convex like the skull; its inferior surface is irregular. The two hemispheres are joined by the corpus callosum.',
        'All surfaces are covered by a cortex of grey matter thrown into gyri and sulci, which maximises the surface area that fits in the skull. Inside are the basal nuclei and thalamus.',
      ],
      steps: [
        { label: 'Forebrain', detail: 'Cerebral hemispheres + diencephalon (lateral and third ventricles).' },
        { label: 'Midbrain', detail: 'Between forebrain and hindbrain; cerebral aqueduct.' },
        { label: 'Hindbrain', detail: 'Pons, medulla oblongata, cerebellum.' },
      ],
      terms: [
        { term: 'Corpus callosum', meaning: 'Commissure joining the two cerebral hemispheres.' },
        { term: 'Diencephalon', meaning: 'Thalamus, hypothalamus and associated structures around the third ventricle.' },
      ],
      keyPoints: [
        'Gyri and sulci increase cortical surface area.',
      ],
      sourceRefs: cns([3, 4, 5, 6]),
    },
    {
      title: 'Lobes and Main Sulci',
      kind: 'structure',
      paragraphs: [
        'The dominant hemisphere is slightly larger. Larger sulci divide each hemisphere into lobes named after the overlying bones: frontal, parietal, occipital and temporal. The main sulci are the central sulcus (of Rolando), the lateral sulcus (fissure of Sylvius) and the parieto-occipital sulcus.',
        'The frontal lobe lies in front of the central sulcus and above the lateral sulcus. The parietal lobe lies between the central and parieto-occipital sulci, above the lateral sulcus. The temporal lobe lies below the lateral sulcus. The occipital lobe lies behind the parieto-occipital sulcus.',
        'The lateral sulcus has two short rami (anterior and ascending) and a long posterior ramus; these divide the inferior frontal gyrus into orbital, triangular and opercular parts. The parts of the frontal, parietal and temporal lobes bordering the lateral sulcus form the opercula, which cover the insula.',
      ],
      table: {
        columns: ['Lobe', 'Position'],
        rows: [
          ['Frontal', 'In front of the central sulcus, above the lateral sulcus'],
          ['Parietal', 'Between central and parieto-occipital sulci, above the lateral sulcus'],
          ['Temporal', 'Below the lateral sulcus'],
          ['Occipital', 'Behind the parieto-occipital sulcus'],
        ],
      },
      terms: [
        { term: 'Central sulcus', meaning: 'Fissure of Rolando, between frontal and parietal lobes.' },
        { term: 'Lateral sulcus', meaning: 'Fissure of Sylvius, above the temporal lobe.' },
        { term: 'Insula', meaning: 'Cortex hidden deep in the lateral sulcus, covered by the opercula.' },
      ],
      keyPoints: [
        'The insula is hidden under the opercula of frontal, parietal and temporal lobes.',
      ],
      sourceRefs: cns([7, 8, 9, 11]),
    },
    {
      title: 'Gyri and Sulci of Each Surface',
      kind: 'structure',
      paragraphs: [
        'Superolateral surface. Frontal lobe: four gyri — precentral, superior, middle and inferior frontal — separated by the precentral, superior frontal and inferior frontal sulci. Parietal lobe: the intraparietal sulcus divides it into superior and inferior parietal lobules; the ends of the lateral sulcus and superior temporal sulcus that turn up into the inferior lobule are capped by the supramarginal and angular gyri respectively. Occipital lobe: separated by an imaginary line from the parieto-occipital sulcus to the pre-occipital notch. Temporal lobe: superior, middle and inferior temporal gyri, separated by the superior and inferior temporal sulci.',
        'Medial surface: lies against the falx cerebri in the longitudinal fissure; below the falx the hemispheres are joined by the corpus callosum. Above the callosum lie the cingulate gyrus and sulcus, the medial frontal gyrus, the paracentral lobule (around the end of the central sulcus) and the precuneus. Behind lie the parieto-occipital sulcus, the cuneus, the calcarine sulcus and the lingual gyrus.',
        'Inferior surface: the orbital surface has the gyrus rectus with the olfactory bulb and tract lateral to it (in the olfactory sulcus) and orbital gyri. Behind, the temporal lobe merges with the occipital lobe: the occipitotemporal gyrus, the occipitotemporal sulcus laterally, the collateral sulcus medially and the parahippocampal gyrus, which curves forward as the uncus.',
      ],
      terms: [
        { term: 'Angular gyrus', meaning: 'Gyrus capping the end of the superior temporal sulcus in the inferior parietal lobule.' },
        { term: 'Calcarine sulcus', meaning: 'Sulcus on the medial occipital lobe; site of the primary visual cortex.' },
        { term: 'Uncus', meaning: 'Hooked front end of the parahippocampal gyrus.' },
      ],
      keyPoints: [
        'Supramarginal gyrus caps the lateral sulcus; angular gyrus caps the superior temporal sulcus.',
      ],
      sourceRefs: cns([10, 12, 13, 14, 15, 16, 17, 18, 19]),
    },
  ],
  summary: [
    'The CNS is brain and spinal cord; the PNS is cranial and spinal nerves with their ganglia.',
    'The brain has forebrain (hemispheres, diencephalon), midbrain and hindbrain (pons, medulla, cerebellum).',
    'Central, lateral and parieto-occipital sulci divide each hemisphere into four lobes.',
    'The opercula of the frontal, parietal and temporal lobes cover the insula.',
    'The calcarine sulcus, cuneus and lingual gyrus are on the medial occipital surface.',
  ],
  highYield: [
    'Central sulcus = Rolando; lateral sulcus = Sylvius.',
    'Inferior frontal gyrus has orbital, triangular and opercular parts.',
    'Parahippocampal gyrus ends as the uncus.',
  ],
  confusions: [
    {
      confusion: 'Thinking the corpus callosum lies above the falx cerebri.',
      clarification: 'The falx lies in the longitudinal fissure; the corpus callosum joins the hemispheres below its free edge (slide 16).',
    },
  ],
};

// ─── Lesson 2: Cortical Areas and White Matter ───────────────────────

const lesson2: Draft = {
  id: L(2),
  title: 'Cortical Areas and White Matter',
  description: 'The functional areas of the cerebral cortex with their Brodmann numbers, what happens when each is damaged, and the three kinds of fibres in the white matter.',
  xp: 25,
  estimatedMinutes: 13,
  sourceRefs: cns([20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 92]),
  objectives: [
    'Locate the motor, sensory, visual, auditory and speech areas and give their Brodmann numbers.',
    'Describe the effects of lesions of each cortical area.',
    'Classify white matter fibres as commissural, association or projection.',
  ],
  chunks: [
    {
      title: 'Functional Areas of the Cortex',
      kind: 'structure',
      paragraphs: [
        'Different cortical areas are functionally specialised, and Brodmann numbered them. Primary motor area: 4. Motor speech (Broca): 44 and 45. Primary auditory area: 41 and 42. Primary visual area: 17.',
        'Frontal lobe: the precentral area (precentral gyrus and the back of the superior, middle and inferior frontal gyri) has a posterior primary motor area (4) — voluntary movement of the opposite side and bilateral movement of the extraocular muscles — and an anterior premotor (secondary motor) area (6, 8, 44, 45). The frontal eye field controls voluntary eye movement. The prefrontal area is concerned with personality. Broca’s motor speech area (44, 45) in the inferior frontal gyrus forms words.',
        'Parietal lobe: the postcentral gyrus is the primary somesthetic (sensory) area, with secondary and association somesthetic areas that let us distinguish sensory modalities, e.g. stereognosis and vibration sense.',
        'Occipital lobe: the primary visual cortex (17, where the macula is represented), the secondary visual cortex (recognising what is seen) and the occipital eye field (eye movement reflexes).',
        'Temporal lobe: the primary auditory area (41, 42), the secondary auditory area (interpreting sounds) and the sensory speech area of Wernicke (understanding spoken and written language). Other areas: taste, vestibular and insular cortex.',
      ],
      table: {
        columns: ['Area', 'Brodmann', 'Lobe'],
        rows: [
          ['Primary motor', '4', 'Frontal (precentral gyrus)'],
          ['Premotor', '6, 8', 'Frontal'],
          ['Broca’s motor speech', '44, 45', 'Frontal (inferior frontal gyrus)'],
          ['Primary somesthetic', '3, 1, 2 (postcentral gyrus)', 'Parietal'],
          ['Primary auditory', '41, 42', 'Temporal'],
          ['Primary visual', '17', 'Occipital'],
        ],
      },
      terms: [
        { term: 'Broca’s area', meaning: 'Motor speech area (44, 45) in the inferior frontal gyrus.' },
        { term: 'Wernicke’s area', meaning: 'Sensory speech area for understanding language, in the temporal lobe.' },
        { term: 'Stereognosis', meaning: 'Recognising objects by touch.' },
      ],
      keyPoints: [
        'Area 4 motor; 17 visual; 41/42 auditory; 44/45 Broca.',
      ],
      notes: [{ kind: 'textbook', text: 'Brodmann areas 3, 1 and 2 for the postcentral gyrus are from Gray’s; the slides name the area without numbers.' }],
      sourceRefs: [...cns([20, 21, 22, 23, 24, 25, 26]), ...GRAYS],
    },
    {
      title: 'Lesions of the Cerebral Cortex',
      kind: 'clinical',
      paragraphs: [
        'Primary motor cortex: paralysis of the opposite side, Jacksonian epileptic seizures and muscle spasticity. Frontal eye field: both eyes deviate toward the side of the lesion. Broca’s area: expressive aphasia. Wernicke’s area: receptive aphasia. Both speech areas: global aphasia. Dominant angular gyrus: alexia (cannot read) or agraphia (cannot write).',
        'Prefrontal cortex: loss of initiative and judgement, emotional changes (especially euphoria) and personality change — the patient no longer conforms to accepted social behaviour and becomes careless of dress and appearance. Frontal leukotomy and lobectomy have been used to reduce emotional responses in obsessive states and intractable terminal pain.',
        'Somesthetic cortex: inability to judge degrees of sensation (temperature, weight) or localise touch accurately. Visual cortex: loss of the opposite half of the visual field (contralateral hemianopia). Agnosia is failure to recognise objects despite intact senses.',
      ],
      table: {
        columns: ['Lesion', 'Effect'],
        rows: [
          ['Primary motor cortex', 'Contralateral paralysis, spasticity, Jacksonian seizures'],
          ['Frontal eye field', 'Eyes deviate toward the lesion'],
          ['Broca’s area', 'Expressive aphasia'],
          ['Wernicke’s area', 'Receptive aphasia'],
          ['Dominant angular gyrus', 'Alexia, agraphia'],
          ['Visual cortex', 'Contralateral hemianopia'],
        ],
      },
      terms: [
        { term: 'Expressive aphasia', meaning: 'Difficulty producing speech (Broca’s area lesion).' },
        { term: 'Receptive aphasia', meaning: 'Difficulty understanding speech (Wernicke’s area lesion).' },
        { term: 'Hemianopia', meaning: 'Loss of half of the visual field.' },
        { term: 'Agnosia', meaning: 'Inability to recognise objects despite intact sensation.' },
      ],
      keyPoints: [
        'Broca = expressive; Wernicke = receptive; both = global.',
      ],
      notes: [{ kind: 'clarified', text: 'Slide 27 calls Wernicke’s area a “motor” speech area; slide 25 and Gray’s describe it as the sensory speech area, which fits the receptive aphasia it produces.' }],
      sourceRefs: [...cns([25, 27, 28, 29]), ...GRAYS],
    },
    {
      title: 'White Matter',
      kind: 'classification',
      paragraphs: [
        'The white matter of the hemisphere is made of nerve fibres in three groups. Commissural fibres join the two hemispheres, e.g. the corpus callosum. Association fibres stay in one hemisphere, linking different parts of it. Projection fibres connect the cortex with subcortical nuclei, the brainstem and spinal cord, e.g. the internal capsule and corticospinal tract.',
        'The lecture asks what happens if the corpus callosum is absent or cut: the two hemispheres can no longer share information directly (a “split brain”).',
      ],
      table: {
        columns: ['Fibre type', 'Connects', 'Example'],
        rows: [
          ['Commissural', 'The two hemispheres', 'Corpus callosum'],
          ['Association', 'Parts of the same hemisphere', 'Within one hemisphere'],
          ['Projection', 'Cortex with lower centres', 'Internal capsule, corticospinal tract'],
        ],
      },
      terms: [
        { term: 'Commissural fibres', meaning: 'Fibres crossing between hemispheres.' },
        { term: 'Projection fibres', meaning: 'Fibres linking cortex to lower centres.' },
        { term: 'Internal capsule', meaning: 'Major band of projection fibres.' },
      ],
      keyPoints: [
        'Internal capsule = projection fibres.',
      ],
      notes: [{ kind: 'textbook', text: 'The answer to slide 92’s question (loss of direct communication between hemispheres) is from Gray’s.' }],
      sourceRefs: [...cns([30, 92]), ...GRAYS],
    },
  ],
  summary: [
    'Primary motor area 4, Broca 44/45, auditory 41/42, visual 17.',
    'Broca’s lesions cause expressive aphasia; Wernicke’s receptive aphasia.',
    'A frontal eye field lesion turns the eyes toward the lesion.',
    'Prefrontal lesions change personality and judgement.',
    'White matter has commissural, association and projection fibres.',
  ],
  highYield: [
    'Dominant angular gyrus lesion → alexia/agraphia.',
    'Visual cortex lesion → contralateral hemianopia.',
  ],
  confusions: [
    {
      confusion: 'Thinking the corpus callosum is made of projection fibres.',
      clarification: 'It is commissural (joins the hemispheres); the internal capsule is projection (slide 30).',
    },
  ],
};

// ─── Lesson 3: The Thalamus and Diencephalon ─────────────────────────

const lesson3: Draft = {
  id: L(3),
  title: 'The Thalamus and Diencephalon',
  description: 'The parts and relations of the diencephalon; the thalamus — its surfaces, nuclei, functions and lesions; and the epithalamus (pineal gland) and metathalamus (geniculate bodies).',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: cns([31, 33, 34, 36, 37, 38, 42, 46, 47, 48, 49, 50, 72, 73]),
  objectives: [
    'List the parts and relations of the diencephalon.',
    'Describe the position, surfaces and functions of the thalamus.',
    'Describe the thalamic nuclei and their connections.',
    'Describe the effects of thalamic lesions and the thalamic hand.',
    'Describe the epithalamus and the medial and lateral geniculate bodies.',
  ],
  chunks: [
    {
      title: 'The Diencephalon',
      kind: 'structure',
      paragraphs: [
        'The diencephalon consists of the third ventricle, thalamus, subthalamus, epithalamus, metathalamus and hypothalamus.',
        'Relations: inferiorly — the optic chiasma, optic tract, infundibulum with tuber cinereum, and mammillary bodies; superiorly — the fornix and the tela choroidea and choroid plexus of the third ventricle; laterally — the internal capsule, which separates it from the lentiform nucleus; medially — the lateral wall of the third ventricle, where the two sides often touch at the interthalamic adhesion.',
      ],
      terms: [
        { term: 'Interthalamic adhesion', meaning: 'Massa intermedia joining the two thalami across the third ventricle.' },
      ],
      keyPoints: [
        'Internal capsule separates the thalamus from the lentiform nucleus.',
      ],
      sourceRefs: cns([31, 32, 33]),
    },
    {
      title: 'The Thalamus',
      kind: 'structure',
      paragraphs: [
        'The thalamus (“inner chamber”) is a large egg-shaped mass of grey matter on each side of the upper third ventricle — the largest part of the diencephalon, about 4 cm long and 1.5 cm broad. In some people the two thalami are joined by the interthalamic adhesion (massa intermedia).',
        'It is a relay and integrating centre for sensory and motor information going to the cortex, basal ganglia, hypothalamus and brainstem, with reciprocal thalamocortical and corticothalamic connections. All sensory information except smell reaches the thalamic nuclei. It also has roles in consciousness (with the reticular activating system), the sleep–wake cycle, emotion and memory.',
        'Its narrow anterior end forms the back of the interventricular foramen; its expanded posterior end, the pulvinar, overhangs the superior colliculus, with the medial and lateral geniculate bodies beneath it. Surfaces: superior — caudate nucleus, stria terminalis, thalamostriate vein, lateral ventricle, choroid plexus and fornix; inferior — hypothalamic sulcus, hypothalamus, subthalamus and midbrain tegmentum; medial — third ventricle, stria medullaris and interthalamic adhesion; lateral — posterior limb of the internal capsule.',
        'Nuclei: relay nuclei send specific information (visual, auditory, somatosensory, motor) to discrete cortical areas; association nuclei receive mostly from the cortex and project back to association areas; non-specific nuclei project diffusely and serve consciousness and attention. The ventral posterolateral (VPL) nucleus receives the dorsal column and spinothalamic pathways; the ventral posteromedial (VPM) nucleus receives the trigeminothalamic tract from the head. The ventral lateral and ventral anterior nuclei relay basal ganglia and cerebellar input to the motor cortex. The anterior nucleus (memory) receives the mammillothalamic tract and projects to the cingulate cortex; the dorsomedial nucleus (emotion) links the hypothalamus, olfactory cortex and amygdala with the prefrontal cortex.',
      ],
      table: {
        columns: ['Nucleus', 'Input', 'Role'],
        rows: [
          ['VPL', 'Dorsal columns, spinothalamic tracts', 'Body sensation'],
          ['VPM', 'Trigeminothalamic tract', 'Face and head sensation'],
          ['VL / VA', 'Basal ganglia, cerebellum', 'Motor relay to cortex'],
          ['Anterior', 'Mammillothalamic tract', 'Memory (to cingulate gyrus)'],
          ['Dorsomedial', 'Hypothalamus, amygdala, olfactory cortex', 'Emotion (to prefrontal cortex)'],
        ],
      },
      terms: [
        { term: 'Pulvinar', meaning: 'Expanded posterior end of the thalamus.' },
        { term: 'VPL nucleus', meaning: 'Thalamic relay for sensation from the body.' },
        { term: 'VPM nucleus', meaning: 'Thalamic relay for sensation from the head.' },
      ],
      keyPoints: [
        'All senses except smell relay in the thalamus.',
      ],
      sourceRefs: cns([34, 35, 36, 37, 38, 42, 43, 46]),
    },
    {
      title: 'Thalamic Lesions',
      kind: 'clinical',
      paragraphs: [
        'Thalamic lesions can alter consciousness and alertness, affective behaviour, memory, motor activity, somatic sensation, vision, and perception (hallucinations), depending on the nuclei involved. Most are ischaemic. Damage to the VPL and VPM nuclei removes all forms of sensation — touch, localisation, discrimination and joint sense — from the opposite side of the body.',
        'The intralaminar nuclei relay pain to the cortex; cauterising them has been used to relieve intractable pain in terminal cancer.',
        'The thalamic hand is the abnormal posture of the hand opposite a thalamic lesion: the forearm pronated, wrist flexed, metacarpophalangeal joints flexed and interphalangeal joints extended, fingers possibly abducted and the thumb abducted or pressed into the palm.',
      ],
      terms: [
        { term: 'Thalamic hand', meaning: 'Pronated forearm, flexed wrist and MCP joints, extended IP joints opposite a thalamic lesion.' },
        { term: 'Intralaminar nuclei', meaning: 'Thalamic nuclei relaying pain to the cortex.' },
      ],
      keyPoints: [
        'VPL/VPM damage → loss of all sensation on the opposite side.',
      ],
      sourceRefs: cns([47, 48, 49]),
    },
    {
      title: 'Epithalamus and Metathalamus',
      kind: 'structure',
      paragraphs: [
        'The epithalamus lies at the back of the third ventricle. It contains the habenular nuclei (emotional responses to smells) and the pineal gland. The pineal’s function in humans is not fully known, but it shows a circadian rhythm, contains melatonin and serotonin, and in animals influences the pituitary, islets, parathyroids, adrenals and gonads. Histologically it has pinealocytes, glial cells and calcified “brain sand”.',
        'The metathalamus is the medial and lateral geniculate bodies under the pulvinar. The medial geniculate body, connected to the inferior colliculus, relays hearing: lateral lemniscus → medial geniculate body → auditory radiation → primary auditory cortex (transverse temporal gyrus). The lateral geniculate body receives most optic tract fibres and relays vision: optic tract → lateral geniculate body → optic radiation → visual (striate) cortex.',
      ],
      table: {
        columns: ['Body', 'Pathway', 'Destination'],
        rows: [
          ['Medial geniculate', 'Hearing (lateral lemniscus → auditory radiation)', 'Primary auditory cortex'],
          ['Lateral geniculate', 'Vision (optic tract → optic radiation)', 'Visual (striate) cortex'],
        ],
      },
      terms: [
        { term: 'Pineal gland', meaning: 'Epithalamic gland with circadian rhythm; contains melatonin and brain sand.' },
        { term: 'Lateral geniculate body', meaning: 'Thalamic relay for vision.' },
        { term: 'Medial geniculate body', meaning: 'Thalamic relay for hearing.' },
      ],
      keyPoints: [
        'Medial = Music (hearing); Lateral = Light (vision).',
      ],
      sourceRefs: cns([50, 72, 73]),
    },
  ],
  summary: [
    'The diencephalon includes the thalamus, hypothalamus, epithalamus, subthalamus and metathalamus around the third ventricle.',
    'The thalamus relays all sensation except smell to the cortex.',
    'VPL relays body sensation; VPM head sensation; VL/VA motor information.',
    'Thalamic lesions cause contralateral sensory loss and the thalamic hand.',
    'Medial geniculate relays hearing; lateral geniculate relays vision.',
  ],
  highYield: [
    'Pulvinar overhangs the superior colliculus.',
    'Anterior nucleus: memory; dorsomedial: emotion.',
    'Pineal: melatonin, brain sand.',
  ],
  confusions: [
    {
      confusion: 'Thinking smell is relayed through the thalamus like other senses.',
      clarification: 'All sensory information EXCEPT olfaction reaches the thalamic nuclei (slide 37).',
    },
  ],
};

// ─── Lesson 4: Hypothalamus and Pituitary ────────────────────────────

const lesson4: Draft = {
  id: L(4),
  title: 'The Hypothalamus and Pituitary Gland',
  description: 'The boundaries, nuclei and functions of the hypothalamus, what its lesions cause, and the pituitary gland with its two connections to the hypothalamus.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: cns([51, 52, 54, 58, 59, 65, 66, 67, 68, 69, 70]),
  objectives: [
    'Give the boundaries and functions of the hypothalamus.',
    'Name the nuclei of the medial and lateral zones.',
    'Explain how the hypothalamus controls the autonomic system, temperature, water balance and appetite.',
    'List the effects of hypothalamic lesions.',
    'Describe the parts, development and hypothalamic connections of the pituitary gland.',
  ],
  chunks: [
    {
      title: 'Boundaries, Functions and Nuclei',
      kind: 'structure',
      paragraphs: [
        'The hypothalamus lies below the hypothalamic sulcus, from the optic chiasma to the mammillary bodies. Boundaries: anterior — lamina terminalis and anterior commissure; posterior — tegmentum of the midbrain; inferior — the floor of the third ventricle (optic chiasma, infundibulum, tuber cinereum, mammillary bodies); superior — thalamus; lateral — internal capsule; medial — third ventricle.',
        'It controls and integrates the autonomic and endocrine systems and maintains homeostasis — body temperature, eating and drinking, body fluid, sexual behaviour and emotion. It receives information from the body through nerves, the bloodstream and the CSF.',
        'A parasagittal plane through the columns of the fornix and the mammillothalamic tract divides it into medial and lateral zones. Medial zone nuclei (front to back): preoptic, anterior, part of suprachiasmatic, paraventricular, dorsomedial, ventromedial, infundibular (arcuate) and posterior. Lateral zone: part of the preoptic and suprachiasmatic, supraoptic, lateral, tuberomammillary and lateral tuberal nuclei. The preoptic, suprachiasmatic and mammillary nuclei overlap both zones.',
      ],
      terms: [
        { term: 'Hypothalamic sulcus', meaning: 'Groove separating the thalamus above from the hypothalamus below.' },
        { term: 'Tuber cinereum', meaning: 'Grey floor of the third ventricle from which the infundibulum descends.' },
      ],
      keyPoints: [
        'Fornix columns and mammillothalamic tract divide medial from lateral zones.',
      ],
      sourceRefs: cns([51, 52, 53, 54, 58, 59]),
    },
    {
      title: 'Functional Regions and Lesions',
      kind: 'mechanism',
      paragraphs: [
        'Autonomic: the anterior hypothalamus excites the parasympathetic system (a lesion leaves unopposed sympathetic activity); the posterior hypothalamus excites the sympathetic system (a lesion leaves unopposed parasympathetic activity).',
        'Temperature: the anterior nucleus loses heat and maintains temperature — destruction causes hyperthermia. The posterior nucleus produces and conserves heat — destruction causes hypothermia.',
        'Water balance: ADH (made by the supraoptic and paraventricular nuclei) controls water excretion by the kidneys.',
        'Food intake: the ventromedial nucleus is the satiety centre — bilateral destruction causes hyperphagia, obesity and savage behaviour. The lateral nucleus is the feeding centre — destruction causes starvation and emaciation.',
        'Hypothalamic lesions may cause genital hypoplasia or atrophy, diabetes insipidus, obesity or wasting, sleep disturbance, irregular fever and adiposogenital dystrophy.',
      ],
      table: {
        columns: ['Region', 'Function', 'Lesion'],
        rows: [
          ['Anterior', 'Parasympathetic; heat loss', 'Sympathetic dominance; hyperthermia'],
          ['Posterior', 'Sympathetic; heat conservation', 'Parasympathetic dominance; hypothermia'],
          ['Ventromedial', 'Satiety', 'Hyperphagia, obesity, rage'],
          ['Lateral', 'Feeding', 'Starvation, emaciation'],
        ],
      },
      terms: [
        { term: 'Satiety centre', meaning: 'Ventromedial nucleus that inhibits eating.' },
        { term: 'Feeding centre', meaning: 'Lateral hypothalamic nucleus that drives eating.' },
        { term: 'Diabetes insipidus', meaning: 'Loss of ADH causing large volumes of dilute urine.' },
      ],
      keyPoints: [
        'Anterior lesion → hyperthermia; posterior lesion → hypothermia.',
      ],
      notes: [{ kind: 'clarified', text: 'Slide 66 says the paraventricular nucleus makes ADH; slide 70 and Gray’s say both the supraoptic and paraventricular nuclei do (the supraoptic mainly). Questions use “supraoptic and paraventricular”.' }],
      sourceRefs: [...cns([65, 66, 67, 70]), ...GRAYS],
    },
    {
      title: 'The Pituitary Gland',
      kind: 'structure',
      paragraphs: [
        'The pituitary (hypophysis cerebri) sits in the sella turcica of the sphenoid, bounded laterally by the cavernous sinuses, and is connected to the hypothalamus by the infundibulum.',
        'The adenohypophysis (pars distalis or anterior lobe, pars tuberalis and pars intermedia) develops from Rathke’s pouch, an ectodermal outpouching of the primitive mouth. The neurohypophysis (pars nervosa or posterior lobe and infundibulum, continuous with the median eminence) develops from the diencephalon.',
        'The pars distalis makes, stores and releases growth hormone, ACTH, LH, FSH, prolactin and TSH.',
        'Two connections link it to the hypothalamus. (1) Neurons of the supraoptic and paraventricular nuclei send axons through the hypothalamo-hypophyseal tract to the pars nervosa, releasing ADH and oxytocin into the blood. (2) Hypothalamic neurons release peptide hormones into the median eminence, which travel through the hypophyseal portal system (long and short portal vessels) to the anterior lobe.',
      ],
      table: {
        columns: ['Part', 'Origin', 'Hormones'],
        rows: [
          ['Adenohypophysis (anterior)', 'Rathke’s pouch (oral ectoderm)', 'GH, ACTH, LH, FSH, prolactin, TSH'],
          ['Neurohypophysis (posterior)', 'Diencephalon (infundibulum)', 'Releases ADH and oxytocin'],
        ],
      },
      terms: [
        { term: 'Rathke’s pouch', meaning: 'Oral ectodermal outpouching forming the adenohypophysis.' },
        { term: 'Hypophyseal portal system', meaning: 'Vessels carrying hypothalamic releasing hormones to the anterior pituitary.' },
        { term: 'Hypothalamo-hypophyseal tract', meaning: 'Axons from supraoptic and paraventricular nuclei to the posterior pituitary.' },
      ],
      keyPoints: [
        'Posterior pituitary is neural (releases ADH, oxytocin); anterior is glandular (portal control).',
      ],
      sourceRefs: cns([68, 69, 70, 71]),
    },
  ],
  summary: [
    'The hypothalamus lies below the hypothalamic sulcus from the optic chiasma to the mammillary bodies.',
    'It controls the autonomic and endocrine systems and homeostasis.',
    'Ventromedial = satiety; lateral = feeding; anterior = heat loss; posterior = heat conservation.',
    'The anterior pituitary comes from Rathke’s pouch; the posterior from the diencephalon.',
    'Neural tract to the posterior lobe; portal blood vessels to the anterior lobe.',
  ],
  highYield: [
    'Ventromedial lesion → obesity and rage.',
    'ADH loss → diabetes insipidus.',
    'Pituitary lies in the sella turcica between the cavernous sinuses.',
  ],
  confusions: [
    {
      confusion: 'Thinking the posterior pituitary makes ADH and oxytocin.',
      clarification: 'They are made in the supraoptic and paraventricular nuclei and released from the posterior pituitary (slide 70).',
    },
  ],
};

// ─── Lesson 5: Basal Nuclei and Blood Supply of the Brain ────────────

const lesson5: Draft = {
  id: L(5),
  title: 'Basal Nuclei and Blood Supply of the Brain',
  description: 'The basal nuclei and the caudate nucleus with their roles in movement, the internal carotid and vertebrobasilar arteries, the circle of Willis, and the effects of interrupted cerebral blood flow.',
  xp: 25,
  estimatedMinutes: 13,
  sourceRefs: cns([74, 75, 79, 80, 81, 82, 86, 87, 88, 90, 91]),
  objectives: [
    'Name the basal nuclei and describe the caudate nucleus.',
    'State the functions of the basal ganglia.',
    'List the intracranial branches of the internal carotid, vertebral and basilar arteries.',
    'Describe the circle of Willis.',
    'Describe the effects of reduced cerebral blood flow and the types of intracranial haemorrhage.',
  ],
  chunks: [
    {
      title: 'The Basal Nuclei',
      kind: 'structure',
      paragraphs: [
        'The basal nuclei (basal ganglia) are masses of grey matter inside each cerebral hemisphere: the caudate nucleus, lentiform nucleus (putamen and globus pallidus), amygdala and claustrum. They control posture and voluntary movement of the opposite side of the body. The caudate and lentiform nuclei together form the corpus striatum.',
        'The caudate nucleus is a C-shaped mass lateral to the thalamus, forming the lateral wall and floor of the lateral ventricle and separated from the lentiform nucleus by the anterior limb of the internal capsule. Its large head (connected to the putamen) lies in front of the interventricular foramen in the lateral wall of the lateral ventricle; its body forms part of the floor of the body of the ventricle; its long tail lies in the roof of the temporal horn and ends at the amygdaloid nucleus.',
        'Functions in summary: caudate — plans movement; putamen — performs movement; globus pallidus — polishes movement; subthalamic nucleus — prevents excess movement; substantia nigra — promotes movement (dopamine).',
      ],
      table: {
        columns: ['Nucleus', 'Role (lecture summary)'],
        rows: [
          ['Caudate', 'Plan movement'],
          ['Putamen', 'Perform movement'],
          ['Globus pallidus', 'Polish movement'],
          ['Subthalamic nucleus', 'Prevent excess movement'],
          ['Substantia nigra', 'Promote movement (dopamine)'],
        ],
      },
      terms: [
        { term: 'Lentiform nucleus', meaning: 'Putamen + globus pallidus.' },
        { term: 'Corpus striatum', meaning: 'Caudate + lentiform nuclei.' },
      ],
      keyPoints: [
        'Basal nuclei affect movement on the opposite side.',
      ],
      notes: [{ kind: 'textbook', text: 'Slide 75 asks “What is the corpus striatum?”; the answer (caudate + lentiform nuclei) is from Gray’s.' }],
      sourceRefs: [...cns([74, 75, 76, 79, 80, 81]), ...GRAYS],
    },
    {
      title: 'Arteries of the Brain and the Circle of Willis',
      kind: 'structure',
      figure: 'neuroanatomy:brain-arteries',
      paragraphs: [
        'The brain is supplied by the two internal carotid and two vertebral arteries, which run in the subarachnoid space and anastomose at the base of the brain as the circle of Willis.',
        'Intracranial branches of the internal carotid artery: ophthalmic, (anterior) choroidal, anterior cerebral, middle cerebral and posterior communicating arteries.',
        'Branches of the vertebral artery: meningeal, posterior spinal, anterior spinal, posterior inferior cerebellar and medullary arteries. The two vertebrals unite as the basilar artery, which gives pontine, labyrinthine, anterior inferior cerebellar and superior cerebellar arteries and ends as the posterior cerebral arteries.',
        'The circle of Willis lies in the interpeduncular fossa and is formed by the anterior communicating, anterior cerebral, internal carotid, posterior communicating, posterior cerebral and basilar arteries.',
      ],
      table: {
        columns: ['Artery', 'Branches'],
        rows: [
          ['Internal carotid', 'Ophthalmic, choroidal, anterior cerebral, middle cerebral, posterior communicating'],
          ['Vertebral', 'Meningeal, posterior and anterior spinal, PICA, medullary'],
          ['Basilar', 'Pontine, labyrinthine, AICA, superior cerebellar, posterior cerebral'],
        ],
      },
      terms: [
        { term: 'Circle of Willis', meaning: 'Arterial ring at the base of the brain in the interpeduncular fossa.' },
        { term: 'Basilar artery', meaning: 'Formed by the union of the two vertebral arteries.' },
      ],
      keyPoints: [
        'PICA from the vertebral; AICA and superior cerebellar from the basilar.',
      ],
      notes: [{ kind: 'clarified', text: 'Slide 87 lists a “posterior cerebella artery” among basilar branches; the terminal branches of the basilar are the posterior cerebral arteries (as in slide 88 and Gray’s).' }],
      sourceRefs: [...cns([82, 83, 86, 87, 88, 89]), ...GRAYS],
    },
    {
      title: 'Cerebral Lesions of Vascular Origin',
      kind: 'clinical',
      paragraphs: [
        'Neurons stop working after about 1 minute of total arrest of cerebral blood flow, and irreversible damage occurs within about 4 minutes. Normal flow is 50–60 ml per 100 g of brain per minute. Cerebral blood flow is not controlled by nerves but by CO₂, O₂ and H⁺.',
        'Causes of altered flow: postural hypotension, shock, changes in blood viscosity (polycythaemia vera), carotid sinus syndrome, coronary heart disease and atheroma. Vascular blockage: embolism (thrombus or fat) and aneurysms. Intracranial haemorrhage may be extradural, subdural, subarachnoid or intracerebral.',
      ],
      terms: [
        { term: 'Embolism', meaning: 'Blockage of a vessel by a travelling clot or fat globule.' },
        { term: 'Aneurysm', meaning: 'Abnormal dilatation of an artery wall.' },
      ],
      keyPoints: [
        'Irreversible neuronal damage within ~4 minutes of no flow.',
        'Cerebral flow is regulated chemically (CO₂, O₂, H⁺).',
      ],
      sourceRefs: cns([90, 91]),
    },
  ],
  summary: [
    'Basal nuclei: caudate, lentiform (putamen + globus pallidus), amygdala, claustrum.',
    'They control posture and voluntary movement on the opposite side.',
    'The brain is supplied by two internal carotid and two vertebral arteries.',
    'The circle of Willis lies in the interpeduncular fossa.',
    'Neurons are irreversibly damaged after about 4 minutes without blood flow.',
  ],
  highYield: [
    'Caudate tail ends at the amygdala.',
    'Basilar ends as the posterior cerebral arteries.',
    'Normal cerebral flow: 50–60 ml/100 g/min.',
  ],
  confusions: [
    {
      confusion: 'Thinking the posterior communicating artery comes from the basilar.',
      clarification: 'It is a branch of the internal carotid that joins the posterior cerebral artery (slide 82).',
    },
  ],
};

// ─── Lesson 6: The Dura Mater ────────────────────────────────────────

const lesson6: Draft = {
  id: L(6),
  title: 'The Meninges and Dura Mater',
  description: 'The three meninges, the two layers of the dura, the four dural folds that partition the cranial cavity, and the nerve and arterial supply of the dura.',
  xp: 25,
  estimatedMinutes: 13,
  sourceRefs: men([12, 14, 15, 17, 19, 20, 25, 26, 28, 29, 32, 33]),
  objectives: [
    'Name the three meninges and the leptomeninges.',
    'Describe the endosteal and meningeal layers of the dura.',
    'Describe the falx cerebri, tentorium cerebelli, falx cerebelli and diaphragma sellae.',
    'Give the nerve and arterial supply of the dura.',
  ],
  chunks: [
    {
      title: 'The Meninges and the Layers of the Dura',
      kind: 'structure',
      paragraphs: [
        'The brain is covered by three connective tissue membranes that protect and support it: the dura mater (pachymeninx) and the leptomeninges — the arachnoid mater and pia mater.',
        'The dura mater (“tough mother”) is thick, dense, inelastic and outermost. It has two closely united layers that split in places to enclose the venous sinuses.',
        'The endosteal layer is the periosteum of the inner skull. It continues with the outer periosteum at the margins of all foramina and with the sutural ligaments, and is not continuous with the spinal dura.',
        'The meningeal layer (dura proper) is a dense, strong fibrous membrane that continues through the foramen magnum as the spinal dura. It gives tubular sheaths to the cranial nerves, which fuse with their epineurium outside the skull, and forms four septa that divide the cranial cavity into freely communicating spaces and restrict movement of the brain during acceleration and deceleration.',
      ],
      terms: [
        { term: 'Leptomeninges', meaning: 'The arachnoid and pia mater together.' },
        { term: 'Endosteal layer', meaning: 'Outer dural layer: periosteum of the inner skull.' },
        { term: 'Meningeal layer', meaning: 'Inner dural layer, continuous with the spinal dura, forming the dural folds.' },
      ],
      keyPoints: [
        'Only the meningeal layer continues into the spinal canal.',
      ],
      sourceRefs: men([12, 14, 15, 17, 19]),
    },
    {
      title: 'The Dural Folds',
      kind: 'structure',
      paragraphs: [
        'The falx cerebri is sickle-shaped and lies in the longitudinal fissure between the cerebral hemispheres. It is narrow in front, attached to the internal frontal crest and crista galli, and broad behind, attached to the tentorium. Its upper convex border holds the superior sagittal sinus, its lower concave border the inferior sagittal sinus, and its junction with the tentorium the straight sinus.',
        'The tentorium cerebelli is a tent-shaped fold forming the roof of the posterior cranial fossa. It supports the occipital lobes and separates them from the cerebellum below. In front it has a gap, the tentorial notch, for the midbrain. Its free anterior border attaches to the anterior clinoid processes; its attached border to the posterior clinoid processes and encloses the superior petrosal and transverse sinuses. Its upper surface carries the straight sinus. (“Supratentorial” and “infratentorial” describe structures above and below it.)',
        'The falx cerebelli is a small sickle-shaped fold below the tentorium between the cerebellar hemispheres, attached to the internal occipital crest; its fixed posterior margin contains the occipital sinus.',
        'The diaphragma sellae is a small circular horizontal fold forming the roof of the hypophyseal fossa (sella turcica), with a central opening for the pituitary stalk.',
      ],
      table: {
        columns: ['Fold', 'Position', 'Sinuses'],
        rows: [
          ['Falx cerebri', 'Between cerebral hemispheres', 'Superior and inferior sagittal; straight (at junction)'],
          ['Tentorium cerebelli', 'Roof of posterior cranial fossa', 'Transverse, superior petrosal, straight'],
          ['Falx cerebelli', 'Between cerebellar hemispheres', 'Occipital'],
          ['Diaphragma sellae', 'Roof of the sella turcica', '—'],
        ],
      },
      terms: [
        { term: 'Falx cerebri', meaning: 'Sickle-shaped dural fold between the cerebral hemispheres.' },
        { term: 'Tentorium cerebelli', meaning: 'Dural tent between the occipital lobes and cerebellum.' },
        { term: 'Tentorial notch', meaning: 'Gap in the tentorium for the midbrain.' },
        { term: 'Diaphragma sellae', meaning: 'Dural roof of the pituitary fossa.' },
      ],
      keyPoints: [
        'Straight sinus lies where the falx cerebri meets the tentorium.',
      ],
      notes: [{ kind: 'clarified', text: 'Slide 28 places the falx cerebelli “between the two hemispheres of the cerebrum”; it lies between the cerebellar hemispheres (Gray’s), as the rest of that slide shows.' }],
      sourceRefs: [...men([17, 20, 25, 26, 28, 29]), ...GRAYS],
    },
    {
      title: 'Nerve and Arterial Supply of the Dura',
      kind: 'structure',
      paragraphs: [
        'Nerves: the anterior cranial fossa dura by the ophthalmic nerve; the middle fossa by the maxillary and mandibular nerves; the posterior fossa by the vagus, hypoglossal and C1–C3 spinal nerves. So the dura is supplied by branches of the trigeminal, vagus and cervical nerves — sensory to the dura and autonomic to its vessels.',
        'Arteries: the outer layer is richly vascular, while the inner fibrous layer needs little blood. Meningeal branches come from the internal carotid, maxillary, ascending pharyngeal, occipital and vertebral arteries; the most important is the middle meningeal artery.',
      ],
      table: {
        columns: ['Cranial fossa', 'Dural nerve supply'],
        rows: [
          ['Anterior', 'Ophthalmic (V1)'],
          ['Middle', 'Maxillary (V2) and mandibular (V3)'],
          ['Posterior', 'Vagus, hypoglossal, C1–C3'],
        ],
      },
      terms: [
        { term: 'Middle meningeal artery', meaning: 'Most important artery of the dura; torn in extradural haemorrhage.' },
      ],
      keyPoints: [
        'Dural pain (headache) travels mainly in the trigeminal nerve.',
      ],
      sourceRefs: men([32, 33, 34]),
    },
  ],
  summary: [
    'Meninges: dura (pachymeninx), arachnoid and pia (leptomeninges).',
    'The dura has endosteal and meningeal layers; venous sinuses lie between them.',
    'Four folds: falx cerebri, tentorium cerebelli, falx cerebelli, diaphragma sellae.',
    'The dura is supplied by the trigeminal, vagus and upper cervical nerves.',
    'The middle meningeal artery is the most important dural artery.',
  ],
  highYield: [
    'Tentorial notch transmits the midbrain.',
    'Diaphragma sellae roofs the pituitary fossa.',
  ],
  confusions: [
    {
      confusion: 'Thinking the endosteal dura continues down the spinal canal.',
      clarification: 'Only the meningeal layer passes through the foramen magnum as the spinal dura (slides 15, 17).',
    },
  ],
};

// ─── Lesson 7: Dural Venous Sinuses ──────────────────────────────────

const lesson7: Draft = {
  id: L(7),
  title: 'Dural Venous Sinuses',
  description: 'How the dural venous sinuses drain the brain, the course of the sagittal, straight, transverse, sigmoid, occipital and petrosal sinuses, and the cavernous sinus with its relations, contents and connections.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: men([35, 36, 38, 40, 42, 44, 45, 46, 47, 48, 51, 52]),
  objectives: [
    'Describe the general features of the dural venous sinuses.',
    'Trace the course of the superior and inferior sagittal, straight, transverse, sigmoid and occipital sinuses.',
    'Give the relations, contents, tributaries and drainage of the cavernous sinus.',
    'Explain why cavernous sinus lesions cause multiple neurological deficits.',
  ],
  chunks: [
    {
      title: 'The Major Sinuses',
      kind: 'pathway',
      paragraphs: [
        'The dural venous sinuses receive blood from the cerebral veins and CSF from the subarachnoid space through the arachnoid villi, and drain into the internal jugular vein. They have no valves and no muscle, have thick walls lined by endothelium, and connect with the diploic and scalp veins through emissary veins.',
        'The superior sagittal sinus runs in the upper fixed border of the falx cerebri from the foramen caecum to the internal occipital protuberance, where it usually turns (to the right) into the transverse sinus; the dilatation here is the confluence of sinuses. It receives the superior cerebral veins.',
        'The inferior sagittal sinus runs in the lower free border of the falx, receiving veins from the medial hemisphere, and joins the great cerebral vein at the tentorium to form the straight sinus. The straight sinus lies at the junction of the falx and tentorium and usually continues as the left transverse sinus.',
        'The paired transverse sinuses begin at the internal occipital protuberance and run in the attached margin of the tentorium, receiving the superior petrosal sinuses, inferior cerebral and cerebellar veins and diploic veins, and drain into the sigmoid sinuses. Each sigmoid sinus grooves the mastoid part of the temporal bone behind the mastoid antrum and passes through the jugular foramen to become the internal jugular vein. The occipital sinus runs in the attached margin of the falx cerebelli from near the foramen magnum (communicating with the vertebral veins) to the confluence.',
      ],
      steps: [
        { label: 'Superior sagittal sinus', detail: 'Upper border of the falx cerebri → confluence → (usually right) transverse sinus.' },
        { label: 'Inferior sagittal + great cerebral vein', detail: 'Form the straight sinus → (usually left) transverse sinus.' },
        { label: 'Transverse sinus', detail: 'Attached margin of the tentorium.' },
        { label: 'Sigmoid sinus', detail: 'Grooves the mastoid behind the antrum.' },
        { label: 'Internal jugular vein', detail: 'Through the jugular foramen.' },
      ],
      terms: [
        { term: 'Confluence of sinuses', meaning: 'Meeting point of sinuses at the internal occipital protuberance.' },
        { term: 'Arachnoid villi', meaning: 'Projections into the sinuses through which CSF enters the blood.' },
        { term: 'Emissary veins', meaning: 'Valveless veins linking sinuses to scalp veins.' },
      ],
      keyPoints: [
        'Sinuses are valveless and muscleless; they drain to the internal jugular vein.',
        'Mastoid infection can reach the sigmoid sinus.',
      ],
      sourceRefs: men([35, 36, 38, 40, 42, 44, 45]),
    },
    {
      title: 'The Cavernous Sinus',
      kind: 'structure',
      paragraphs: [
        'The cavernous sinuses lie on each side of the body of the sphenoid, about 2 cm long and 1 cm wide. Relations: above — optic tract and internal carotid artery; below — foramen lacerum and the junction of the body and greater wing of the sphenoid; in front — superior orbital fissure and orbital apex; behind — apex of the petrous temporal; medially — pituitary and sphenoidal air sinus; laterally — temporal lobe.',
        'In the lateral wall, from above down: the oculomotor nerve, trochlear nerve, ophthalmic nerve, maxillary nerve and the trigeminal ganglion. Passing through the sinus: the internal carotid artery with its venous and sympathetic plexuses, and the abducent nerve.',
        'Tributaries: from the orbit — the superior and inferior ophthalmic veins and central vein of the retina; from the brain — the superficial middle cerebral and inferior cerebral veins; from the meninges — the sphenoparietal sinus and sometimes the middle meningeal vein.',
        'Drainage: to the transverse sinus via the superior petrosal sinus; to the internal jugular vein via the inferior petrosal sinus; and to the pterygoid venous plexus via emissary veins. The two cavernous sinuses communicate through the anterior and posterior intercavernous sinuses. Pulsations of the internal carotid and gravity help expel blood. The superior petrosal sinus drains to the transverse sinus and the inferior petrosal sinus to the internal jugular vein.',
        'Because so many nerves run in or through it, a cavernous sinus lesion (e.g. thrombosis or an internal carotid aneurysm) causes multiple deficits: the abducent nerve, lying free in the sinus, is often affected first (medial squint), together with III, IV, V1 and V2 in the wall.',
      ],
      table: {
        columns: ['Position', 'Structures'],
        rows: [
          ['Lateral wall (top → bottom)', 'CN III, CN IV, V1, V2, trigeminal ganglion'],
          ['Through the sinus', 'Internal carotid artery (with plexuses), CN VI'],
        ],
      },
      terms: [
        { term: 'Cavernous sinus', meaning: 'Venous sinus beside the sphenoid body containing the ICA and CN VI.' },
        { term: 'Intercavernous sinuses', meaning: 'Channels joining the two cavernous sinuses.' },
      ],
      keyPoints: [
        'CN VI runs through the sinus beside the ICA → first nerve hit by an ICA aneurysm.',
      ],
      notes: [{ kind: 'lecturer', text: 'The GRAT case on slide 10 (cavernous ICA aneurysm with medial squint, constricted pupil and cheek numbness) tests exactly these relations.' }],
      sourceRefs: men([10, 46, 47, 48, 51, 52]),
    },
  ],
  summary: [
    'Dural sinuses are valveless channels between dural layers that drain to the internal jugular vein.',
    'Superior sagittal sinus → confluence → usually right transverse sinus; straight sinus → usually left.',
    'Transverse sinus → sigmoid sinus → internal jugular vein at the jugular foramen.',
    'The cavernous sinus carries the ICA and CN VI through it, with III, IV, V1 and V2 in its wall.',
    'Facial and orbital veins drain to the cavernous sinus, a route for infection.',
  ],
  highYield: [
    'Straight sinus = inferior sagittal sinus + great cerebral vein.',
    'Inferior petrosal sinus → internal jugular vein.',
    'Pituitary lies medial to the cavernous sinus.',
  ],
  confusions: [
    {
      confusion: 'Thinking the abducent nerve lies in the lateral wall of the cavernous sinus.',
      clarification: 'CN VI passes through the sinus itself with the ICA; III, IV, V1 and V2 are in the lateral wall (slide 47).',
    },
  ],
};

// ─── Lesson 8: Arachnoid, Pia, Spaces and Haemorrhage ────────────────

const lesson8: Draft = {
  id: L(8),
  title: 'Arachnoid, Pia, Meningeal Spaces and Haemorrhage',
  description: 'The arachnoid and pia mater, the epidural, subdural and subarachnoid spaces, the subarachnoid cisterns, and epidural and subdural haematomas and meningitis.',
  xp: 25,
  estimatedMinutes: 13,
  sourceRefs: men([11, 54, 55, 56, 57, 59, 62, 63, 64, 65, 67, 70]),
  objectives: [
    'Describe the arachnoid mater, arachnoid villi and granulations.',
    'Describe the pia mater and its relations to vessels and ventricles.',
    'Describe the epidural, subdural and subarachnoid spaces and their contents.',
    'Name the main subarachnoid cisterns and their contents.',
    'Explain epidural and subdural haematomas and identify the leptomeninges in meningitis.',
  ],
  chunks: [
    {
      title: 'Arachnoid and Pia Mater',
      kind: 'structure',
      paragraphs: [
        'The arachnoid mater (“spider-like”) is a delicate, non-vascular membrane between the dura and pia, covered on both surfaces by flattened mesothelial cells. Arachnoid villi project into the venous sinuses, especially the superior sagittal sinus; aggregations of them are arachnoid granulations. They are where CSF passes one way from the subarachnoid space into the venous blood.',
        'The pia mater (“tender mother”) is a delicate, vascular layer closely covering the brain down into the deepest sulci. It adheres to the end-feet of astrocytes (the pial–glial membrane), extends over the cranial nerves to fuse with their epineurium, and accompanies arteries entering the brain (the perivascular, or Virchow–Robin, space). It forms the tela choroidea in the roofs of the third and fourth ventricles, which with ependyma forms the choroid plexus in all the ventricles.',
      ],
      terms: [
        { term: 'Arachnoid granulations', meaning: 'Clusters of arachnoid villi where CSF drains into the venous sinuses.' },
        { term: 'Virchow–Robin space', meaning: 'Perivascular space around arteries entering the brain.' },
        { term: 'Tela choroidea', meaning: 'Pia + ependyma forming the choroid plexus.' },
      ],
      keyPoints: [
        'CSF returns to the blood through arachnoid granulations, mainly into the superior sagittal sinus.',
      ],
      sourceRefs: men([54, 55]),
    },
    {
      title: 'Meningeal Spaces and Cisterns',
      kind: 'structure',
      paragraphs: [
        'The cranial epidural space is a potential space between the dura and the skull, containing the meningeal arteries and veins. The subdural space is a potential space between the dura and arachnoid, crossed by the cerebral (bridging) veins to the superior sagittal sinus — tearing them causes a subdural haematoma.',
        'The subarachnoid space, between the arachnoid and pia, contains CSF and surrounds the brain and spinal cord; in adults it extends below the conus medullaris to S2 as the lumbar cistern. The cerebral arteries and veins cross it, so their rupture causes subarachnoid haemorrhage.',
        'Subarachnoid cisterns are local dilatations of the space named after the structures they overlie. The cerebellopontine angle cistern receives CSF from the fourth ventricle through the lateral foramina (of Luschka) and contains CN VII and VIII. The cerebellomedullary cistern (cisterna magna), between the cerebellum and the back of the medulla, receives CSF through the median foramen (of Magendie) and can be tapped (suboccipital puncture). The pontine cistern, between the clivus and the front of the pons and medulla, contains the basilar artery with its pontine and labyrinthine branches and CN V–XII. The interpeduncular cistern, between the dorsum sellae and the cerebral peduncles, contains the end of the basilar artery (posterior circle of Willis), the pituitary stalk and CN III and IV. The ambient cistern links the superior and interpeduncular cisterns and contains CN IV; the superior (quadrigeminal) cistern overlies the midbrain tectum between the splenium of the corpus callosum and the cerebellum.',
      ],
      table: {
        columns: ['Cistern', 'Key contents / feature'],
        rows: [
          ['Cerebellomedullary (cisterna magna)', 'Receives CSF via Magendie; suboccipital tap'],
          ['Cerebellopontine angle', 'CN VII and VIII; CSF via Luschka'],
          ['Pontine', 'Basilar artery; CN V–XII'],
          ['Interpeduncular', 'Circle of Willis (posterior), pituitary stalk, CN III and IV'],
          ['Ambient', 'CN IV'],
          ['Lumbar', 'Below the conus to S2'],
        ],
      },
      terms: [
        { term: 'Subarachnoid space', meaning: 'Space between arachnoid and pia containing CSF.' },
        { term: 'Cisterna magna', meaning: 'Cerebellomedullary cistern; site of suboccipital puncture.' },
        { term: 'Bridging veins', meaning: 'Cerebral veins crossing the subdural space to the dural sinuses.' },
      ],
      keyPoints: [
        'Lumbar cistern extends to S2 — site of lumbar puncture.',
      ],
      sourceRefs: men([56, 57, 59, 62, 63, 64, 65]),
    },
    {
      title: 'Intracranial Haemorrhage and Meningitis',
      kind: 'clinical',
      paragraphs: [
        'An epidural (extradural) haematoma follows trauma or skull fracture that tears a meningeal artery (classically the middle meningeal). Blood fills the potential epidural space, compresses the brain locally and can push brain across the free edge of the tentorium (transtentorial herniation) or under the falx (subfalcine herniation), changing consciousness, breathing, blood pressure, movement and the pupils.',
        'A subdural haematoma follows severe head trauma that tears bridging veins crossing to the dural sinuses, especially the superior sagittal sinus. Proteins in the clot draw in fluid, so it can enlarge, and there may be bleeding into the brain itself (intracerebral haematoma).',
        'Meningitis is inflammation of the leptomeninges (arachnoid and pia): a child with sudden severe headache, fever, vomiting and a stiff, painful neck most likely has inflamed leptomeninges.',
      ],
      table: {
        columns: ['Haemorrhage', 'Space', 'Vessel'],
        rows: [
          ['Epidural', 'Between dura and skull', 'Meningeal artery (middle meningeal)'],
          ['Subdural', 'Between dura and arachnoid', 'Bridging veins'],
          ['Subarachnoid', 'Between arachnoid and pia', 'Cerebral arteries (e.g. aneurysm)'],
        ],
      },
      terms: [
        { term: 'Epidural haematoma', meaning: 'Arterial bleed between skull and dura after fracture.' },
        { term: 'Subdural haematoma', meaning: 'Venous bleed from torn bridging veins between dura and arachnoid.' },
        { term: 'Transtentorial herniation', meaning: 'Brain pushed across the free edge of the tentorium.' },
      ],
      keyPoints: [
        'Epidural = arterial; subdural = venous (bridging veins).',
        'Meningitis involves the leptomeninges.',
      ],
      sourceRefs: men([11, 56, 57, 67, 70]),
    },
  ],
  summary: [
    'Arachnoid villi and granulations return CSF to the venous sinuses.',
    'Pia follows the brain into every sulcus and forms the tela choroidea.',
    'Epidural space: meningeal vessels; subdural space: bridging veins; subarachnoid space: CSF and cerebral vessels.',
    'The cisterna magna receives CSF via Magendie; the pontine cistern holds the basilar artery.',
    'Epidural haematoma is arterial; subdural is venous; meningitis inflames the leptomeninges.',
  ],
  highYield: [
    'Subarachnoid space extends to S2.',
    'Cerebellopontine angle cistern: CN VII and VIII.',
    'Torn bridging veins → subdural haematoma.',
  ],
  confusions: [
    {
      confusion: 'Thinking a subdural haematoma is arterial.',
      clarification: 'It comes from torn bridging veins; the epidural haematoma is arterial (slides 56, 67, 70).',
    },
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8].map((lesson) => ({
  ...lesson,
  interactive: interactive[lesson.id],
}));
