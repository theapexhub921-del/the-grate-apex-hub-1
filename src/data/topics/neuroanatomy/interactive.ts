// Anatomy → Neuroanatomy (gross): each lesson's interactive layer.
import { ask, learn, match, mcq, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { cns, men, TOPIC_ID, type ConceptId } from '@/data/topics/neuroanatomy/sources';

type Steps = InteractiveDraft<ConceptId>[];
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const interactive: Record<string, Steps> = {
  [L(1)]: [
    learn('Two ways to divide it', [
      'Structurally: CNS (brain, spinal cord) and PNS (cranial and spinal nerves, ganglia). Functionally: somatic (skeletal muscle, sensation) and autonomic (heart, smooth muscle, glands).',
    ], { sourceRefs: men([4]) }),
    ask(order('i1-01', 'brain-parts', 'Order the parts of the brain from top to bottom:', ['Forebrain', 'Midbrain', 'Hindbrain'], { explanation: 'Slide 3.' })),
    ask(match('i1-02', 'lobes-sulci', 'Match each lobe to its position:', [
      ['Frontal', 'In front of the central sulcus'],
      ['Temporal', 'Below the lateral sulcus'],
      ['Occipital', 'Behind the parieto-occipital sulcus'],
    ], { explanation: 'Slide 9.' })),
    learn('Capping gyri', [
      'In the inferior parietal lobule, the supramarginal gyrus caps the lateral sulcus and the angular gyrus caps the superior temporal sulcus.',
    ], { sourceRefs: cns([12]) }),
    ask(mcq('i1-03', 'gyri-surfaces', 'Which gyrus curves forward to end as the uncus?', 'Parahippocampal gyrus', ['Cingulate gyrus', 'Lingual gyrus', 'Gyrus rectus'], { explanation: 'Slide 18.' })),
    recall('r1-01', 'lobes-sulci', 'Name the parts of the inferior frontal gyrus and what divides them.', [
      'Orbital, triangular and opercular parts.',
      'Divided by the anterior and ascending rami of the lateral sulcus.',
    ], cns([11])),
  ],

  [L(2)]: [
    ask(match('i2-01', 'cortical-areas', 'Match each area to its Brodmann number:', [
      ['Primary motor', '4'],
      ['Primary visual', '17'],
      ['Primary auditory', '41, 42'],
      ['Broca’s area', '44, 45'],
    ], { explanation: 'Slide 20.' })),
    learn('Speech areas', [
      'Broca’s area (inferior frontal gyrus) forms words; Wernicke’s area (temporal lobe) understands language. Lesions cause expressive and receptive aphasia respectively.',
    ], { sourceRefs: cns([22, 25, 27]) }),
    ask(mcq('i2-02', 'cortical-lesions', 'A lesion of the left frontal eye field makes both eyes deviate:', 'To the left (toward the lesion)', ['To the right', 'Upward', 'They do not move'], { explanation: 'Slide 27.', skill: 'application' })),
    learn('Three kinds of white matter fibres', [
      'Commissural (between hemispheres — corpus callosum), association (within one hemisphere) and projection (cortex to lower centres — internal capsule).',
    ], { sourceRefs: cns([30]) }),
    ask(mcq('i2-03', 'white-matter', 'The internal capsule consists of:', 'Projection fibres', ['Commissural fibres', 'Association fibres', 'Grey matter'], { explanation: 'Slide 30.' })),
    recall('r2-01', 'cortical-lesions', 'Describe the effects of a prefrontal cortex lesion.', [
      'Loss of initiative and judgement.',
      'Emotional changes, particularly euphoria.',
      'Personality change; careless of dress and social behaviour.',
    ], cns([28])),
  ],

  [L(3)]: [
    ask(mcq('i3-01', 'thalamus', 'Which sense does NOT relay through the thalamus?', 'Smell', ['Vision', 'Hearing', 'Touch'], { explanation: 'Slide 37.' })),
    learn('Sensory relays', [
      'VPL receives the dorsal column and spinothalamic pathways from the body; VPM receives the trigeminothalamic tract from the head.',
    ], { sourceRefs: cns([46]) }),
    ask(match('i3-02', 'thalamus', 'Match each thalamic nucleus to its role:', [
      ['VPM', 'Sensation from the head'],
      ['Anterior nucleus', 'Memory'],
      ['Dorsomedial nucleus', 'Emotional responses'],
      ['VL/VA', 'Motor relay from basal ganglia and cerebellum'],
    ], { explanation: 'Slide 46.' })),
    learn('Geniculate bodies', [
      'Medial geniculate relays hearing to the auditory cortex; lateral geniculate relays vision to the striate cortex.',
    ], { sourceRefs: cns([73]) }),
    ask(mcq('i3-03', 'thalamic-lesions', 'Damage to the VPL and VPM nuclei causes:', 'Loss of all forms of sensation on the opposite side', ['Paralysis on the same side', 'Loss of hearing', 'Obesity'], { explanation: 'Slide 48.' })),
    recall('r3-01', 'thalamic-lesions', 'Describe the thalamic hand.', [
      'Forearm pronated, wrist flexed.',
      'Metacarpophalangeal joints flexed, interphalangeal joints extended.',
      'Fingers may be abducted; thumb abducted or pressed against the palm.',
    ], cns([49])),
  ],

  [L(4)]: [
    learn('Thermostat and appetite', [
      'Anterior hypothalamus loses heat; posterior conserves it. Ventromedial = satiety; lateral = feeding.',
    ], { sourceRefs: cns([65, 66]) }),
    ask(match('i4-01', 'hypothalamic-functions', 'Match each hypothalamic lesion to its effect:', [
      ['Anterior nucleus', 'Hyperthermia'],
      ['Posterior nucleus', 'Hypothermia'],
      ['Ventromedial nucleus (bilateral)', 'Hyperphagia and obesity'],
      ['Lateral nucleus', 'Starvation and emaciation'],
    ], { explanation: 'Slides 65–66.' })),
    ask(mcq('i4-02', 'pituitary', 'The adenohypophysis develops from:', 'Rathke’s pouch (oral ectoderm)', ['The infundibulum of the diencephalon', 'Neural crest', 'Endoderm of the pharynx'], { explanation: 'Slide 69.' })),
    learn('Two links to the pituitary', [
      'Nerve fibres (hypothalamo-hypophyseal tract) carry ADH and oxytocin to the posterior lobe; portal blood vessels carry releasing hormones to the anterior lobe.',
    ], { sourceRefs: cns([70]) }),
    ask(mcq('i4-03', 'pituitary', 'Releasing hormones reach the anterior pituitary through the:', 'Hypophyseal portal system', ['Hypothalamo-hypophyseal tract', 'Cerebrospinal fluid', 'Cavernous sinus'], { explanation: 'Slides 69–70.' })),
    recall('r4-01', 'hypothalamus-structure', 'Give the boundaries of the hypothalamus.', [
      'Anterior: lamina terminalis and anterior commissure. Posterior: tegmentum of the midbrain.',
      'Inferior: optic chiasma, infundibulum, tuber cinereum, mammillary bodies.',
      'Superior: thalamus. Lateral: internal capsule. Medial: third ventricle.',
    ], cns([52])),
  ],

  [L(5)]: [
    ask(mcq('i5-01', 'basal-nuclei', 'The lentiform nucleus consists of the:', 'Putamen and globus pallidus', ['Caudate and putamen', 'Amygdala and claustrum', 'Thalamus and hypothalamus'], { explanation: 'Slide 75.' })),
    ask(match('i5-02', 'basal-nuclei', 'Match each nucleus to its role in movement (lecture summary):', [
      ['Caudate', 'Plan'],
      ['Putamen', 'Perform'],
      ['Globus pallidus', 'Polish'],
      ['Substantia nigra', 'Promote (dopamine)'],
    ], { explanation: 'Slide 81.' })),
    learn('The circle of Willis', [
      'In the interpeduncular fossa: anterior communicating, anterior cerebral, internal carotid, posterior communicating, posterior cerebral and basilar arteries.',
    ], { sourceRefs: cns([88]) }),
    ask(mcq('i5-03', 'brain-arteries', 'The posterior inferior cerebellar artery (PICA) is a branch of the:', 'Vertebral artery', ['Basilar artery', 'Internal carotid artery', 'Posterior cerebral artery'], { explanation: 'Slide 86.' })),
    learn('Minutes matter', [
      'Neurons stop after about 1 minute without blood and are irreversibly damaged within about 4 minutes.',
    ], { sourceRefs: cns([90]) }),
    recall('r5-01', 'brain-arteries', 'List the intracranial branches of the internal carotid artery.', [
      'Ophthalmic artery.',
      'Choroidal artery.',
      'Anterior cerebral artery.',
      'Middle cerebral artery.',
      'Posterior communicating artery.',
    ], cns([82])),
  ],

  [L(6)]: [
    ask(mcq('i6-01', 'meninges-overview', 'The leptomeninges are the:', 'Arachnoid and pia mater', ['Dura and arachnoid', 'Dura and pia', 'Endosteal and meningeal dura'], { explanation: 'Slide 12.' })),
    learn('Folds of the dura', [
      'Falx cerebri between the cerebral hemispheres, tentorium cerebelli over the cerebellum, falx cerebelli between the cerebellar hemispheres and diaphragma sellae over the pituitary.',
    ], { sourceRefs: men([17]) }),
    ask(match('i6-02', 'dural-folds', 'Match each dural fold to the sinus it contains:', [
      ['Upper border of falx cerebri', 'Superior sagittal sinus'],
      ['Lower border of falx cerebri', 'Inferior sagittal sinus'],
      ['Attached margin of tentorium', 'Transverse sinus'],
      ['Falx cerebelli', 'Occipital sinus'],
    ], { explanation: 'Slides 20, 26, 28.' })),
    learn('Who senses dural pain', [
      'Anterior fossa: V1. Middle fossa: V2, V3. Posterior fossa: vagus, hypoglossal and C1–C3.',
    ], { sourceRefs: men([32]) }),
    ask(mcq('i6-03', 'dura-supply', 'The most important artery of the dura is the:', 'Middle meningeal artery', ['Anterior cerebral artery', 'Ophthalmic artery', 'Basilar artery'], { explanation: 'Slide 33.' })),
    recall('r6-01', 'meninges-overview', 'Compare the two layers of the dura.', [
      'Endosteal: periosteum of the inner skull, continuous with outer periosteum at foramina; not continuous with spinal dura.',
      'Meningeal: dense fibrous layer, continuous with the spinal dura; sheathes cranial nerves; forms the four septa.',
    ], men([15, 17])),
  ],

  [L(7)]: [
    ask(order('i7-01', 'venous-sinuses', 'Order the path of blood from the superior sagittal sinus:', ['Superior sagittal sinus', 'Confluence of sinuses', 'Transverse sinus', 'Sigmoid sinus', 'Internal jugular vein'], { explanation: 'Slides 36, 42, 44.' })),
    learn('Valveless channels', [
      'Dural sinuses have no valves or muscle, receive CSF via arachnoid villi and connect to scalp veins via emissary veins.',
    ], { sourceRefs: men([35]) }),
    ask(match('i7-02', 'cavernous-sinus', 'Match each structure to its position in the cavernous sinus:', [
      ['Oculomotor nerve', 'Lateral wall'],
      ['Abducent nerve', 'Through the sinus'],
      ['Internal carotid artery', 'Through the sinus'],
      ['Maxillary nerve', 'Lateral wall'],
    ], { explanation: 'Slide 47.' })),
    learn('Exits from the cavernous sinus', [
      'Superior petrosal sinus to the transverse sinus, inferior petrosal sinus to the internal jugular vein, emissary veins to the pterygoid plexus, and intercavernous sinuses to the other side.',
    ], { sourceRefs: men([51]) }),
    ask(mcq('i7-03', 'cavernous-sinus', 'An internal carotid aneurysm in the cavernous sinus causes a medial squint because it compresses the:', 'Abducent nerve', ['Trochlear nerve', 'Optic nerve', 'Facial nerve'], { explanation: 'Slides 10, 47.', skill: 'application' })),
    recall('r7-01', 'cavernous-sinus', 'List the tributaries of the cavernous sinus.', [
      'From the orbit: superior and inferior ophthalmic veins, central vein of the retina.',
      'From the brain: superficial middle cerebral and inferior cerebral veins.',
      'From the meninges: sphenoparietal sinus (sometimes the middle meningeal vein).',
    ], men([48])),
  ],

  [L(8)]: [
    learn('Draining the CSF', [
      'Arachnoid villi and granulations project into the venous sinuses, mainly the superior sagittal, letting CSF flow one way into the blood.',
    ], { sourceRefs: men([54]) }),
    ask(match('i8-01', 'meningeal-spaces-cisterns', 'Match each space to its contents:', [
      ['Epidural space', 'Meningeal arteries and veins'],
      ['Subdural space', 'Bridging veins'],
      ['Subarachnoid space', 'Cerebrospinal fluid'],
    ], { explanation: 'Slides 56–57.' })),
    ask(mcq('i8-02', 'meningeal-spaces-cisterns', 'Which cistern can be tapped for CSF by suboccipital puncture?', 'Cerebellomedullary cistern (cisterna magna)', ['Pontine cistern', 'Interpeduncular cistern', 'Ambient cistern'], { explanation: 'Slide 62.' })),
    learn('Arterial vs venous bleeds', [
      'Epidural haematoma: torn meningeal artery after a skull fracture. Subdural haematoma: torn bridging veins after severe head trauma.',
    ], { sourceRefs: men([67, 70]) }),
    ask(mcq('i8-03', 'intracranial-haemorrhage', 'A child has fever, severe headache, vomiting and a stiff neck. Which structure is most likely inflamed?', 'Leptomeninges', ['Falx cerebri', 'Choroid plexus', 'Pituitary gland'], { explanation: 'Slide 11.', skill: 'application' })),
    recall('r8-01', 'meningeal-spaces-cisterns', 'Name the contents of the pontine cistern.', [
      'The basilar artery with its pontine and labyrinthine branches.',
      'Cranial nerves V to XII.',
    ], men([63])),
  ],
};
