// Physiology → Central Nervous System — the topic question bank.
//
// Rules: only what the lessons teach (the eight CNS lectures, and labelled
// Guyton clarifications). Not asked: whether the parietal lobe is "mainly
// language" (slides 6 and 11 differ), "apraxia" for loss of body awareness
// (used two ways), where the subthalamic nucleus sits (slide wording), or
// anything from the study guides. Options are shuffled at quiz time.
// IDs: qN-xx, N = lesson.
import { fill, match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/central-nervous-system/sources';

type Q = QuestionDraft<ConceptId>;

// ─── Lesson 1 — Organisation and sensory receptors ─────────────────
const lesson1: Q[] = [
  multi('q1-01', 'cns-organisation', 'What are the three components of the nervous system as a communication network? Select all that apply.', ['Sensory', 'Integrative', 'Motor'], ['Endocrine', 'Vascular'], { explanation: 'Sensory I, p. 1.' }),
  mcq('q1-02', 'cns-organisation', 'A nucleus, in the nervous system, is…', 'A collection of neurons in the CNS with a similar function', ['A group of cell bodies outside the CNS, beside the cord', 'A bundle of axons outside the CNS that share a common route', 'A myelinated tract running between two brain areas'], { explanation: 'Sensory I, p. 2.', skill: 'terminology' }),
  tf({ id: 'q1-03', conceptId: 'cns-organisation', statement: 'A nerve contains both fibres and cell bodies.', answer: false, explanation: 'Spinal Cord, slide 2: a nerve has no cell bodies — they are in ganglia (sensory) or grey matter (motor).', skill: 'misconception' }),
  multi('q1-04', 'cns-organisation', 'Which are functions of the CNS listed in the lecture? Select all that apply.', ['Gathering and processing information', 'Organising reflexes and behavioural responses', 'Learning and memory', 'Planning voluntary movement'], ['Producing red blood cells'], { explanation: 'Sensory I, p. 2.' }),
  mcq('q1-05', 'sensory-system', 'A sensory system consists of…', 'Sensory receptors, neural pathways and the parts of the brain involved in perception', ['Sensory receptors only, without any central connections', 'Motor neurons, the muscles they supply and the reflex arcs that connect them', 'The spinal cord and its reflex arcs only'], { explanation: 'Sensory I, p. 3.' }),
  multi('q1-06', 'sensory-system', 'Which are unconscious forms of sensation? Select all that apply.', ['Blood pressure', 'Lung inflation', 'Blood glucose', 'pH'], ['Vision', 'Itch'], { explanation: 'Sensory I, p. 5.' }),
  mcq('q1-07', 'sensory-system', 'Which list contains only types of stimulus named in the lecture?', 'Mechanical, thermal, chemical, electromagnetic', ['Mechanical, gravitational, magnetic, nuclear, osmotic', 'Thermal, emotional, chemical, electrical', 'Sound, light, smell, taste and touch'], { explanation: 'Sensory I, p. 4.' }),
  mcq('q1-08', 'receptor-classes', 'Which receptor detects osmolality and CO₂ concentration?', 'Chemoreceptor', ['Mechanoreceptor', 'Thermoreceptor', 'Electromagnetic receptor'], { explanation: 'Sensory I, p. 6.' }),
  mcq('q1-09', 'receptor-classes', 'A receptor detecting joint position is a…', 'Proprioceptor', ['Teleceptor', 'Exteroceptor (skin receptor)', 'Nociceptor'], { explanation: 'Sensory I, p. 6.', skill: 'terminology' }),
  mcq('q1-10', 'receptor-classes', 'A teleceptor detects…', 'Things at a distance', ['The internal environment', 'Joint position', 'Tissue damage'], { explanation: 'Sensory I, p. 6. The eye and ear are examples.', skill: 'terminology' }),
  match('q1-11', 'receptor-classes', 'Match each receptor term to its environment.', [
    ['Exteroceptor', 'External environment'],
    ['Interoceptor', 'Interior environment'],
    ['Teleceptor', 'Things at a distance'],
    ['Proprioceptor', 'Joint position'],
  ], { explanation: 'Sensory I, p. 6.' }),
  mcq('q1-12', 'generator-potential', 'The generator potential is best described as…', 'A local, graded, EPSP-like potential in the receptor', ['An all-or-none action potential in the sensory nerve', 'A potential generated in the motor neuron', 'The resting membrane potential of the receptor'], { explanation: 'Sensory I, p. 9.' }),
  order('q1-13', 'generator-potential', 'Put the steps of impulse generation in order.', ['Stimulus', 'Generator potential', 'Summation of generator potentials', 'Action potential'], { explanation: 'Sensory I, p. 9.' }),
  tf({ id: 'q1-14', conceptId: 'generator-potential', statement: 'A stronger stimulus is signalled by a higher frequency of action potentials.', answer: true, explanation: 'Sensory I, p. 9: and by stimulating more receptors.' }),
  mcq('q1-15', 'adaptation-muller', 'Adaptation is…', 'A fall in action potential frequency while a constant stimulus is maintained', ['A rise in action potential frequency while a constant stimulus is kept on', 'Learning to ignore a sensation consciously, without any change in firing', 'Growth of new receptors after repeated stimulation of the same area of skin'], { explanation: 'Sensory I, p. 10.', skill: 'terminology' }),
  multi('q1-16', 'adaptation-muller', 'Which are slow (tonic) adaptors? Select all that apply.', ['Lung inflation', 'Blood pressure', 'Temperature'], ['Touch', 'Smell'], { explanation: 'Sensory I, p. 10: touch and smell adapt rapidly.' }),
  tf({ id: 'q1-17', conceptId: 'adaptation-muller', statement: 'Smell receptors are rapid (phasic) adaptors.', answer: true, explanation: 'Sensory I, p. 10.' }),
  mcq('q1-18', 'adaptation-muller', 'According to Müller’s doctrine, the sensation evoked by an impulse depends on…', 'The part of the brain it ultimately activates', ['The strength of the stimulus that started it', 'The type of receptor alone, wherever it ends', 'The speed at which the impulse is conducted to the brain'], { explanation: 'Sensory I, p. 10.' }),
  mcq('q1-19', 'adaptation-muller', 'Electrically stimulating the somatic sensory cortex produces…', 'A sensation felt as coming from the body’s receptors', ['No sensation, because no receptor is stimulated', 'Pain felt in the head, where the electrode is', 'A muscle twitch only, with no sensation of any kind'], { explanation: 'Sensory I, p. 10: stimulating any part of the pathway is projected as coming from the receptors; brain stimulation is the example.', skill: 'prediction' }),
];

// ─── Lesson 2 — Reflexes ───────────────────────────────────────────
const lesson2: Q[] = [
  mcq('q2-01', 'reflex-arc', 'A reflex is…', 'A simple, relatively stereotyped response to a specific type of stimulus', ['Any voluntary movement started by the motor cortex', 'A learned skill that becomes automatic with practice', 'A sensation that reaches the cortex and is perceived'], { explanation: 'Sensory I, p. 11.', skill: 'terminology' }),
  mcq('q2-02', 'reflex-arc', 'The basic unit of integrated neural activity is…', 'The reflex arc', ['The neuron', 'The synapse', 'The motor unit'], { explanation: 'Sensory I, p. 11.' }),
  mcq('q2-03', 'reflex-arc', 'In a spinal reflex, sensory fibres enter the cord through the…', 'Dorsal horn', ['Ventral horn', 'Lateral column', 'Central canal'], { explanation: 'Sensory I, pp. 13 and 30 (Bell–Magendie).' }),
  mcq('q2-04', 'muscle-spindle', 'How many intrafusal fibres make up a muscle spindle?', '2–10', ['1', '20–50', '100'], { explanation: 'Sensory I, p. 14.' }),
  mcq('q2-05', 'muscle-spindle', 'How do muscle spindles lie relative to the extrafusal fibres?', 'In parallel', ['In series', 'At right angles', 'Inside the tendon only'], { explanation: 'Sensory I, p. 14.' }),
  match('q2-06', 'muscle-spindle', 'Match each spindle structure to its description.', [
    ['Primary (Ia) ending', 'Annulospiral, wrapped round bag and chain fibres'],
    ['Secondary (II) ending', 'Flower-spray, on chain fibres only'],
    ['γ-efferent', 'Motor supply to the intrafusal fibres'],
  ], { explanation: 'Sensory I, p. 14.' }),
  multi('q2-07', 'muscle-spindle', 'Which are types of intrafusal fibre? Select all that apply.', ['Nuclear bag fibre', 'Nuclear chain fibre'], ['Purkinje fibre', 'Golgi fibre'], { explanation: 'Sensory I, p. 14.' }),
  tf({ id: 'q2-08', conceptId: 'muscle-spindle', statement: 'Secondary (flower-spray) endings lie on both nuclear bag and nuclear chain fibres.', answer: false, explanation: 'Sensory I, p. 14: secondary endings are only on chain fibres; primary endings wrap both.', skill: 'misconception' }),
  order('q2-09', 'stretch-reflex', 'Order the events of the stretch reflex.', ['Muscle stretched', 'Spindle stretched', 'Nerve endings distorted', 'Afferent transmits to the α-motor neuron', 'Muscle contracts'], { explanation: 'Sensory I, p. 12.' }),
  multi('q2-10', 'stretch-reflex', 'Which are monosynaptic reflexes? Select all that apply.', ['Knee jerk', 'Ankle jerk'], ['Withdrawal reflex', 'Inverse stretch reflex'], { explanation: 'Sensory I, p. 13.' }),
  mcq('q2-11', 'stretch-reflex', 'Another name for the stretch reflex is the…', 'Myotatic reflex', ['Inverse stretch reflex', 'Golgi tendon reflex', 'Withdrawal reflex'], { explanation: 'Sensory I, p. 12.', skill: 'terminology' }),
  mcq('q2-12', 'gamma-efferents', 'What does γ-efferent discharge do to the spindle?', 'Contracts its ends, stretching its middle and raising its sensitivity', ['Relaxes it, so it stops firing during contraction', 'Contracts the extrafusal fibres around it', 'Blocks the Ia afferent from the spindle'], { explanation: 'Sensory I, p. 24.' }),
  multi('q2-13', 'gamma-efferents', 'What increases γ-efferent discharge? Select all that apply.', ['Descending tracts from the brain', 'Anxiety', 'Jendrassik’s manoeuvre'], ['Cutting the dorsal root', 'Sleep'], { explanation: 'Sensory I, p. 25.' }),
  mcq('q2-14', 'gamma-efferents', 'Jendrassik’s manoeuvre is used to…', 'Reinforce a weak tendon reflex', ['Test pain sensation in the legs', 'Abolish an overactive stretch reflex', 'Test the Golgi tendon organ reflex'], { explanation: 'Sensory I, p. 25: reinforcement.', clinical: true }),
  mcq('q2-15', 'gamma-efferents', 'Reciprocal innervation means…', 'The antagonist is inhibited when a muscle is made to contract', ['Both the muscle and its antagonist contract together to stiffen the joint', 'The tendon organ excites the muscle when tension rises', 'Each muscle has two separate nerves, one motor and one sensory'], { explanation: 'Sensory I, p. 25: e.g. biceps–triceps.' }),
  mcq('q2-16', 'inverse-stretch', 'What does the Golgi tendon reflex protect against?', 'Tendon tension high enough to cause damage', ['Muscle being stretched too slowly to be sensed', 'Loss of muscle tone during deep sleep', 'Pain arising from the skin over the tendon'], { explanation: 'Sensory I, p. 26.' }),
  mcq('q2-17', 'inverse-stretch', 'How do Golgi tendon organs lie relative to the extrafusal fibres?', 'In series', ['In parallel', 'Inside the spindle', 'In the dorsal horn'], { explanation: 'Sensory I, p. 27.' }),
  mcq('q2-18', 'inverse-stretch', 'Impulses from the Golgi tendon organ cause what in the motor neurons?', 'IPSPs (inhibition)', ['EPSPs (excitation)', 'Action potentials directly', 'No change'], { explanation: 'Sensory I, p. 27.', skill: 'cause-effect' }),
  multi('q2-19', 'inverse-stretch', 'Which trigger the inverse stretch reflex? Select all that apply.', ['Excessive stretch', 'Strong contraction'], ['Light tap on the tendon', 'Cooling the muscle'], { explanation: 'Sensory I, p. 27.' }),
  mcq('q2-20', 'inverse-stretch', 'Muscle tone is defined as…', 'The resistance of muscle to stretch', ['The strength of a maximal contraction', 'The bulk of a muscle', 'The speed of a reflex'], { explanation: 'Sensory I, p. 27.', skill: 'terminology' }),
  match('q2-21', 'inverse-stretch', 'Match each tone to its description.', [
    ['Hypotonic', 'Flaccid'],
    ['Hypertonic', 'Spastic'],
    ['Normotonic', 'Normal resistance to stretch'],
  ], { explanation: 'Sensory I, p. 27.' }),
];

// ─── Lesson 3 — Somatic sensation and pathways ─────────────────────
const lesson3: Q[] = [
  multi('q3-01', 'sensation-types', 'What are the three types of sensation? Select all that apply.', ['Cutaneous', 'Deep', 'Visceral'], ['Special', 'Motor'], { explanation: 'Sensory I, p. 30.' }),
  mcq('q3-02', 'sensation-types', 'Which afferent fibre is unmyelinated?', 'C', ['Aβ', 'Aδ', 'Ia'], { explanation: 'Sensory I, p. 30.' }),
  mcq('q3-03', 'sensation-types', 'Large myelinated Aβ fibres carry…', 'Mechanical sensation', ['Pain only', 'Temperature and itch only', 'Motor commands'], { explanation: 'Sensory I, p. 30.' }),
  multi('q3-04', 'dorsal-columns', 'What does the dorsal column (lemniscal) system carry? Select all that apply.', ['Fine touch', 'Proprioception', 'Vibration'], ['Pain', 'Temperature'], { explanation: 'Sensory II, p. 7.' }),
  order('q3-05', 'dorsal-columns', 'Order the dorsal column pathway.', ['Ascends on the same side of the cord', 'Crosses in the medulla', 'Thalamus', 'Somatic sensory cortex'], { explanation: 'Sensory II, p. 7.' }),
  mcq('q3-06', 'dorsal-columns', 'Destruction of the dorsal columns causes which problem with movement?', 'Ataxia, from loss of proprioception', ['Spastic paralysis of the limbs', 'Intention tremor from the cortex', 'Chorea from release of the basal ganglia'], { explanation: 'Sensory II, p. 14: proprioception travels in the dorsal columns, most of it to the cerebellum.', clinical: true }),
  mcq('q3-07', 'spinothalamic', 'The lateral spinothalamic tract carries…', 'Pain and temperature', ['Crude touch', 'Fine touch and vibration', 'Proprioception'], { explanation: 'Sensory II, p. 9.' }),
  mcq('q3-08', 'spinothalamic', 'The ventral spinothalamic tract carries…', 'Crude touch', ['Pain and temperature', 'Fine touch', 'Vibration'], { explanation: 'Sensory II, p. 9.' }),
  tf({ id: 'q3-09', conceptId: 'spinothalamic', statement: 'The spinothalamic tract crosses in the brainstem, like the dorsal columns.', answer: false, explanation: 'Sensory II, p. 9: it decussates at the level of the spinal cord.', skill: 'misconception' }),
  multi('q3-10', 'spinothalamic', 'Besides pain and temperature, which does the spinothalamic tract carry? Select all that apply.', ['Itch', 'Crude touch', 'Tickle'], ['Vibration', 'Joint position'], { explanation: 'Sensory II, p. 9.' }),
  tf({ id: 'q3-11', conceptId: 'spinothalamic', statement: 'Only extensive cord lesions abolish touch completely.', answer: true, explanation: 'Sensory II, p. 14: touch travels in both the dorsal columns and the ventral spinothalamics.' }),
  mcq('q3-12', 'spinothalamic', 'Hemisection of the left side of the cord at T8 causes loss of pain and temperature in…', 'The right side below the lesion', ['The left side below the lesion', 'Both sides', 'The left side, only above the lesion'], { explanation: 'The spinothalamic tracts cross in the cord, so they carry the opposite side (Sensory II, p. 9; Motor Activity, slide 14).', skill: 'pathway-reasoning' }),
  mcq('q3-13', 'sensory-cortex', 'Where is the somatic sensory area I?', 'The postcentral gyrus', ['The precentral gyrus (frontal)', 'The occipital lobe', 'The cerebellum'], { explanation: 'Sensory II, p. 3.' }),
  mcq('q3-14', 'sensory-cortex', 'The size of a body part’s area on the sensory cortex depends on…', 'The number of its receptors', ['Its physical size', 'Its distance from the brain', 'Its muscle mass'], { explanation: 'Sensory II, p. 5: the homunculus.' }),
  tf({ id: 'q3-15', conceptId: 'sensory-cortex', statement: 'The body is represented upside down on the sensory cortex.', answer: true, explanation: 'Sensory II, p. 5.' }),
  multi('q3-16', 'sensory-cortex', 'Which are lost when the somatic sensory cortex is removed? Select all that apply.', ['Discrete localisation of sensations', 'Judging the weight of objects', 'Judging texture', 'Recognising shape (stereognosis)'], ['All pain sensation'], { explanation: 'Sensory II, p. 3.' }),
  mcq('q3-17', 'sensory-cortex', 'Removing the somatic association areas leads to amorphosynthesis, which is…', 'Loss of the form of the body — forgetting the opposite side', ['Inability to feel pain anywhere on the body', 'Inability to speak, though words are understood', 'Loss of vision in the opposite half of each eye'], { explanation: 'Sensory II, p. 3.', skill: 'terminology' }),
  mcq('q3-18', 'temperature', 'Temperature is carried in the…', 'Lateral spinothalamic tracts', ['Dorsal columns', 'Ventral spinothalamic tracts', 'Corticospinal tracts'], { explanation: 'Sensory II, p. 15.' }),
  mcq('q3-19', 'temperature', 'Above what temperature does pain replace the sensation of heat?', '45 °C', ['37 °C', '40 °C', '60 °C'], { explanation: 'Sensory II, p. 15.' }),
  mcq('q3-20', 'temperature', 'Temperature receptors show mild adaptation, but not…', 'Above 40 °C or below 20 °C', ['Between 20 and 40 °C', 'Below 37 °C (body temperature)', 'At any temperature at all'], { explanation: 'Sensory II, p. 15.' }),
];

// ─── Lesson 4 — Pain ───────────────────────────────────────────────
const lesson4: Q[] = [
  mcq('q4-01', 'pain-types', 'Fast pain is carried by…', 'Aδ fibres', ['C fibres', 'Aβ fibres', 'γ-efferents'], { explanation: 'Sensory II, p. 16.' }),
  multi('q4-02', 'pain-types', 'Which are examples of fast pain? Select all that apply.', ['Needle stick', 'Knife injury', 'Electric shock'], ['Abdominal pain', 'Muscle strain'], { explanation: 'Sensory II, p. 17.' }),
  mcq('q4-03', 'pain-types', 'Slow pain is described as…', 'Burning, gnawing, building steadily', ['Sharp, pricking and electric', 'Always superficial, felt in the skin', 'Brief and precisely localised'], { explanation: 'Sensory II, p. 17.' }),
  mcq('q4-04', 'pain-types', 'Why does pain have an emotional component?', 'The pain pathway is connected to the thalamus', ['Pain receptors lie inside the limbic system', 'Pain travels to the cortex in the dorsal columns', 'C fibres are myelinated and reach the amygdala'], { explanation: 'Sensory II, p. 16.' }),
  mcq('q4-05', 'pain-features', 'Pain receptors are…', 'Free nerve endings', ['Encapsulated endings', 'Muscle spindles', 'Hair cells'], { explanation: 'Sensory II, p. 17.' }),
  tf({ id: 'q4-06', conceptId: 'pain-features', statement: 'Pain receptors adapt rapidly, like touch receptors.', answer: false, explanation: 'Sensory II, p. 18: they adapt very little; prolonged stimulation may increase excitation.', skill: 'misconception' }),
  multi('q4-07', 'pain-features', 'Which tissues have pain receptors (Sensory II, p. 17)? Select all that apply.', ['Periosteum', 'Joint surfaces', 'Capsules of viscera'], ['Brain tissue'], { explanation: 'Sensory II, p. 17; the brain itself is insensitive (p. 28).' }),
  mcq('q4-08', 'pain-features', 'A BP cuff left inflated on the arm becomes painful. Why?', 'Tissue ischaemia', ['Stretch of the skin', 'Cold', 'Rapid adaptation'], { explanation: 'Sensory II, p. 18.', skill: 'application' }),
  mcq('q4-09', 'pain-features', 'Why are pressure sores a reminder of what pain is for?', 'Pain is a protective mechanism, signalling tissue being damaged', ['Pain itself causes the sores by constricting the skin vessels', 'Pressure sores have no pain receptors left in the damaged area of skin', 'Constant pressure blocks the pain fibres and protects the skin'], { explanation: 'Sensory II, p. 18.' }),
  multi('q4-10', 'pain-features', 'Which describe deep or visceral pain? Select all that apply.', ['Poorly localised', 'Nauseating', 'Associated with sweating and BP changes'], ['Sharp and precisely localised'], { explanation: 'Sensory II, p. 19: autonomic symptoms, as afferents go to the CNS via the ANS.' }),
  multi('q4-11', 'pain-features', 'Visceral pain is caused by… Select all that apply.', ['Distension', 'Spasm', 'Ischaemia', 'Chemical stimuli'], ['Cutting with a scalpel'], { explanation: 'Sensory II, p. 19.' }),
  order('q4-12', 'pain-pathways', 'Order the fast pain pathway.', ['Receptor', 'Dorsal horn', 'Crosses to the opposite side', 'Neospinothalamic tract', 'Thalamus', 'Sensory cortex'], { explanation: 'Sensory II, p. 20.' }),
  mcq('q4-13', 'pain-pathways', 'Slow pain fibres first end in which laminae of the dorsal horn?', 'II and III, relaying to lamina V', ['I only, relaying to lamina II', 'VII–IX, beside the motor neurons', 'IV and VI, relaying to lamina I'], { explanation: 'Sensory II, p. 21.' }),
  mcq('q4-14', 'pain-pathways', 'What proportion of slow pain fibres reach the thalamus?', '10–25%', ['All of them', '50%', 'None'], { explanation: 'Sensory II, p. 21.' }),
  multi('q4-15', 'pain-pathways', 'Where do most slow pain fibres end? Select all that apply.', ['Reticular nuclei of the brainstem', 'Tectal area of the midbrain', 'Periaqueductal area'], ['Cerebellum', 'Occipital cortex'], { explanation: 'Sensory II, p. 21.' }),
  fill('q4-16', 'pain-pathways', 'The transmitter of slow pain is ____.', ['substance P', 'Substance P', 'substance p'], { explanation: 'Sensory II, p. 21: slow to build up and slow to be destroyed.' }),
  mcq('q4-17', 'pain-pathways', 'Fast pain ascends in the…', 'Neospinothalamic tract', ['Paleospinothalamic tract', 'Dorsal columns', 'Spinocerebellar tract'], { explanation: 'Sensory II, p. 20.' }),
  multi('q4-18', 'pain-control', 'Which are examples of local suppression of pain? Select all that apply.', ['Acupuncture', 'Liniment', 'A child rubbing a hurt'], ['Taking morphine'], { explanation: 'Sensory II, p. 22.' }),
  multi('q4-19', 'pain-control', 'Which are the brain’s own opiates? Select all that apply.', ['Endorphins', 'Dynorphins', 'Enkephalin'], ['Substance P', 'Bradykinin'], { explanation: 'Sensory II, p. 23.' }),
  mcq('q4-20', 'pain-control', 'Where is the raphe magnus nucleus?', 'Lower pons and upper medulla', ['Upper midbrain (tectum)', 'Ventral thalamus', 'Lumbar spinal cord (dorsal horn)'], { explanation: 'Sensory II, p. 24.' }),
  mcq('q4-21', 'referred-pain', 'Referred pain is…', 'Pain felt in a part of the body considerably removed from the tissue causing it', ['Pain that moves around from one part of the body to another', 'Pain arising from the skin rather than from the deeper tissues', 'Pain that has no cause in any tissue of the body'], { explanation: 'Sensory II, p. 28.', skill: 'terminology' }),
  multi('q4-22', 'referred-pain', 'Which intracranial structures are pain-sensitive? Select all that apply.', ['Venous sinuses', 'Tentorium', 'Meninges'], ['Brain tissue'], { explanation: 'Sensory II, p. 28.' }),
  multi('q4-23', 'referred-pain', 'Which are causes of headache from outside the cranium? Select all that apply.', ['Muscular spasm', 'Nasal sinuses', 'Eye disorders'], ['Low CSF', 'Migraine'], { explanation: 'Sensory II, p. 28: low CSF and migraine are causes inside.' }),
  mcq('q4-24', 'referred-pain', 'A dermatome is…', 'The skin area supplied by the sensory fibres of a single nerve root', ['A muscle and the motor nerve that supplies it', 'A layer of grey matter in the dorsal horn', 'A tract running up the white matter of the cord'], { explanation: 'Sensory II, p. 29. A muscle and its nerve is a myotome.', skill: 'terminology' }),
];

// ─── Lesson 5 — The spinal cord ────────────────────────────────────
const lesson5: Q[] = [
  mcq('q5-01', 'cord-structure', 'White matter consists of…', 'Myelinated fibre tracts', ['Cell bodies and synapses', 'Unmyelinated cell bodies', 'Ganglia'], { explanation: 'Spinal Cord, slide 3.' }),
  tf({ id: 'q5-02', conceptId: 'cord-structure', statement: 'In the spinal cord the grey matter surrounds the white matter.', answer: false, explanation: 'Spinal Cord, slide 4: the white matter surrounds the grey matter.', skill: 'misconception' }),
  mcq('q5-03', 'cord-structure', 'At about which vertebral level does the spinal cord end?', 'The second lumbar vertebra', ['The twelfth thoracic vertebra', 'The sacrum', 'The fifth lumbar vertebra'], { explanation: 'Spinal Cord, slide 4.' }),
  mcq('q5-04', 'cord-structure', 'Where are the cell bodies of the sensory neurons entering the cord?', 'In the dorsal root ganglion', ['In the ventral horn', 'In the white matter', 'In the thalamus'], { explanation: 'Spinal Cord, slides 2 and 4.' }),
  mcq('q5-05', 'cord-structure', 'Motor axons leave the spinal cord through the…', 'Ventral root', ['Dorsal root', 'Dorsal root ganglion', 'Central canal'], { explanation: 'Spinal Cord, slide 4.' }),
  fill('q5-06', 'cord-structure', 'The total number of pairs of spinal nerves is ____.', ['31', 'thirty-one', 'thirty one'], { explanation: 'Spinal Cord, slide 5: 8 + 12 + 5 + 5 + 1.' }),
  mcq('q5-07', 'cord-structure', 'Where does spinal nerve C1 arise?', 'Between the cranium and the atlas', ['Below the first cervical vertebra', 'Between C7 and T1', 'Below the second cervical vertebra'], { explanation: 'Spinal Cord, slide 5.' }),
  mcq('q5-08', 'cord-structure', 'Where does spinal nerve C8 arise?', 'Between the 7th cervical and 1st thoracic vertebrae', ['Below the 8th cervical vertebra, which is its numbered partner', 'Between the cranium and the atlas', 'Below the 1st thoracic vertebra'], { explanation: 'Spinal Cord, slide 5: there is no 8th cervical vertebra.' }),
  mcq('q5-09', 'cord-structure', 'How many lumbar spinal nerves are there?', '5', ['4', '7', '12'], { explanation: 'Spinal Cord, slide 5.' }),
  mcq('q5-10', 'cord-tracts', 'Ascending tracts are…', 'Sensory', ['Motor', 'Autonomic only', 'Unmyelinated'], { explanation: 'Spinal Cord, slide 8.' }),
  mcq('q5-11', 'cord-tracts', 'Which tract is motor?', 'Corticospinal', ['Spinothalamic', 'Spinocerebellar', 'Dorsal column'], { explanation: 'Spinal Cord, slide 8: tracts whose names begin with a part of the brain are motor.', skill: 'application' }),
  tf({ id: 'q5-12', conceptId: 'cord-tracts', statement: 'Tracts are always part of white matter.', answer: true, explanation: 'Spinal Cord, slide 3.' }),
  mcq('q5-13', 'plexuses', 'A plexus is…', 'An interconnection of fibres forming new combinations as the named peripheral nerves', ['A group of nerve cell bodies outside the central nervous system', 'A layer of grey matter in the dorsal horn of the spinal cord', 'A network of blood vessels supplying the spinal nerve roots'], { explanation: 'Spinal Cord, slide 10.', skill: 'terminology' }),
  multi('q5-14', 'plexuses', 'Which nerves come from the brachial plexus? Select all that apply.', ['Axillary', 'Radial', 'Median', 'Ulnar'], ['Phrenic', 'Femoral'], { explanation: 'Spinal Cord, slide 11.' }),
  mcq('q5-15', 'plexuses', 'Which nerve supplies the diaphragm?', 'Phrenic', ['Vagus', 'Axillary', 'Obturator'], { explanation: 'Spinal Cord, slide 11: from the cervical plexus.' }),
  mcq('q5-16', 'plexuses', 'Which nerve supplies the quadriceps?', 'Femoral', ['Sciatic', 'Obturator', 'Genitofemoral'], { explanation: 'Spinal Cord, slide 11.' }),
  mcq('q5-17', 'plexuses', 'The body’s largest nerve is the…', 'Sciatic nerve', ['Femoral nerve', 'Median nerve', 'Vagus nerve'], { explanation: 'Spinal Cord, slide 11: tibial and common peroneal branches.' }),
  match('q5-18', 'plexuses', 'Match each nerve to what it supplies.', [
    ['Obturator', 'Adductor muscles'],
    ['Inferior gluteal', 'Gluteus maximus'],
    ['Axillary', 'Deltoid'],
    ['Radial', 'Extensors of elbow, wrist and fingers'],
  ], { explanation: 'Spinal Cord, slide 11.' }),
  mcq('q5-19', 'dorsal-horn-laminae', 'Lamina II of the dorsal horn is also called the…', 'Substantia gelatinosa', ['Substantia nigra', 'Nucleus proprius (laminae III–IV)', 'Dorsal root ganglion'], { explanation: 'Spinal Cord, slide 12.', skill: 'terminology' }),
  mcq('q5-20', 'dorsal-horn-laminae', 'The axons of lamina I’s large cells form part of the…', 'Spinothalamic tract', ['Corticospinal tract', 'Dorsal columns', 'Ventral root'], { explanation: 'Spinal Cord, slide 12.' }),
  mcq('q5-21', 'dorsal-horn-laminae', 'Laminae III–VI receive input mainly from…', 'Aβ non-nociceptive afferents', ['C nociceptors only', 'γ-efferent fibres', 'Corticospinal fibres'], { explanation: 'Spinal Cord, slide 13.' }),
  mcq('q5-22', 'dorsal-horn-laminae', 'A nociceptive-specific (NS) cell responds to…', 'Only noxious stimuli', ['Only innocuous stimuli', 'Both noxious and innocuous stimuli', 'Muscle stretch'], { explanation: 'Spinal Cord, slide 13.' }),
  tf({ id: 'q5-23', conceptId: 'dorsal-horn-laminae', statement: 'The dorsal horn is only a relay station for pain.', answer: false, explanation: 'Spinal Cord, slide 13: it modulates pain transmission through spinal and supraspinal mechanisms.', skill: 'misconception' }),
];

// ─── Lesson 6 — Motor cortex and descending control ────────────────
const lesson6: Q[] = [
  multi('q6-01', 'final-common-path', 'Through which routes is influence exerted on the α-motor neuron? Select all that apply.', ['Directly', 'Via interneurons', 'Through γ-efferents'], ['Through the dorsal root ganglion'], { explanation: 'Motor Activity, slide 3.' }),
  multi('q6-02', 'final-common-path', 'Which three functions result from motor control? Select all that apply.', ['Voluntary activity', 'Adjusting posture as a stable background', 'Coordinating muscles for smooth, precise movement'], ['Sensing joint position'], { explanation: 'Motor Activity, slide 3.' }),
  mcq('q6-03', 'motor-areas', 'Where is the primary motor cortex?', 'In the frontal lobe, along the central sulcus', ['In the parietal lobe, behind the central sulcus', 'In the occipital lobe, around the calcarine sulcus', 'In the cerebellum, along the vermis'], { explanation: 'Motor Activity, slide 4.' }),
  mcq('q6-04', 'motor-areas', 'Where are the feet represented in the motor cortex?', 'At the top of the gyrus', ['At the bottom of the gyrus', 'In the occipital lobe', 'Bilaterally at the base'], { explanation: 'Motor Activity, slide 5.' }),
  tf({ id: 'q6-05', conceptId: 'motor-areas', statement: 'Facial representation in the motor cortex is bilateral.', answer: true, explanation: 'Motor Activity, slide 5: the rest of the body is represented on the opposite side.' }),
  mcq('q6-06', 'motor-areas', 'The supplementary motor area is involved in…', 'Planning motor sequences', ['Relaying pain to the cortex', 'Storing long-term memories', 'Controlling the heart rate'], { explanation: 'Motor Activity, slide 6.' }),
  mcq('q6-07', 'motor-areas', 'Damage to the hand skills area causes…', 'Non-purposeful hand movement (apraxia)', ['Loss of all sensation in the hand', 'Tremor of the hand at rest (pill-rolling)', 'Wasting of the small hand muscles'], { explanation: 'Motor Activity, slide 7.', skill: 'application' }),
  mcq('q6-08', 'motor-areas', 'Damage to Broca’s area makes it impossible to…', 'Speak words other than simple ones', ['Understand spoken or written speech', 'Hear sounds on either side', 'Read silently or aloud'], { explanation: 'Motor Activity, slide 7.' }),
  multi('q6-09', 'corticospinal', 'Where do corticospinal fibres originate? Select all that apply.', ['Precentral gyrus', 'Premotor and supplementary areas', 'Postcentral gyrus'], ['Cerebellum', 'Thalamus'], { explanation: 'Motor Activity, slide 9.' }),
  order('q6-10', 'corticospinal', 'Order the course of the corticospinal tract.', ['Cerebral cortex', 'Cerebral peduncles (midbrain)', 'Pons', 'Pyramids (medulla)', 'Decussation in the caudal medulla'], { explanation: 'Motor Activity, slide 10.' }),
  mcq('q6-11', 'corticospinal', 'The lateral corticospinal tract controls…', 'Limb muscles', ['Axial and trunk muscles only', 'Eye movements', 'Breathing'], { explanation: 'Motor Activity, slide 11.' }),
  mcq('q6-12', 'corticospinal', 'The medial corticospinal tract carries fibres from…', 'The same-side (ipsilateral) cortex', ['The opposite (contralateral) cortex', 'The cerebellum', 'The spinal cord'], { explanation: 'Motor Activity, slide 11: it does not decussate.' }),
  tf({ id: 'q6-13', conceptId: 'corticospinal', statement: 'Both the medial and lateral corticospinal tracts control the girdle muscles.', answer: true, explanation: 'Motor Activity, slide 11.' }),
  mcq('q6-14', 'brainstem-motor', 'The pontine reticular nucleus…', 'Excites antigravity muscles', ['Inhibits antigravity muscles', 'Relays pain', 'Controls the iris'], { explanation: 'Motor Activity, slide 16.' }),
  mcq('q6-15', 'brainstem-motor', 'The vestibulospinal tracts…', 'Send excitatory signals to antigravity muscles to maintain equilibrium', ['Inhibit all the muscles of the trunk and limbs during movement', 'Carry touch and pressure from the limbs to the vestibular nuclei', 'Control the muscles of speech and swallowing through the cranial nerves'], { explanation: 'Motor Activity, slide 17.' }),
  mcq('q6-16', 'motor-lesions', 'Spinal shock after complete transection lasts about…', '2 weeks', ['2 hours', '2 days', '2 years'], { explanation: 'Motor Activity, slides 14 and 17.' }),
  multi('q6-17', 'motor-lesions', 'In Brown-Séquard syndrome, which are lost on the same side as the lesion? Select all that apply.', ['Joint position sense', 'Vibration', 'Fine touch', 'Motor function'], ['Pain and temperature'], { explanation: 'Motor Activity, slide 14: pain, temperature and crude touch are lost on the opposite side.' }),
  multi('q6-18', 'motor-lesions', 'Which are complications after spinal cord transection? Select all that apply.', ['Pressure sores', 'Hypercalcaemia', 'Hyperactive stretch reflexes', 'Swings in BP'], ['Muscle hypertrophy'], { explanation: 'Motor Activity, slide 18.' }),
  mcq('q6-19', 'motor-lesions', 'Motor cortex damage most clearly loses voluntary control of…', 'Discrete muscles of the hands and fingers', ['The diaphragm and intercostal muscles', 'The eye muscles only', 'The trunk and proximal limb muscles only'], { explanation: 'Motor Activity, slide 14.' }),
  mcq('q6-20', 'motor-lesions', 'Spastic paralysis without muscle atrophy suggests a lesion of the…', 'Upper motor neuron', ['Lower motor neuron', 'Muscle itself', 'Neuromuscular junction'], { explanation: 'Motor Activity, slide 19.', skill: 'application', clinical: true }),
  mcq('q6-21', 'motor-lesions', 'Fibrillation (irregular fibre contractions) is a sign of…', 'A lower motor neuron lesion', ['An upper motor neuron lesion', 'Cerebellar disease', 'Parkinson’s disease'], { explanation: 'Motor Activity, slide 19.' }),
  mcq('q6-22', 'myotomes', 'Which segment straightens the knee?', 'L3', ['L5', 'S1', 'C7'], { explanation: 'Motor Activity, slide 15.' }),
  mcq('q6-23', 'myotomes', 'Which segment pulls the foot up (dorsiflexion)?', 'L4', ['S1', 'L2', 'L5'], { explanation: 'Motor Activity, slide 15.' }),
  mcq('q6-24', 'myotomes', 'Which segment spreads the fingers?', 'T1', ['C8', 'C6', 'C5'], { explanation: 'Motor Activity, slide 15.' }),
];

// ─── Lesson 7 — The cerebellum ─────────────────────────────────────
const lesson7: Q[] = [
  multi('q7-01', 'cerebellum-anatomy', 'What are the lobes of the cerebellum? Select all that apply.', ['Anterior', 'Posterior', 'Flocculonodular'], ['Occipital', 'Temporal'], { explanation: 'Cerebellum, slide 3.' }),
  mcq('q7-02', 'cerebellum-anatomy', 'What separates the two cerebellar hemispheres?', 'The vermis', ['The tentorium', 'The corpus callosum', 'The dentate nucleus'], { explanation: 'Cerebellum, slide 3.' }),
  mcq('q7-03', 'cerebellum-anatomy', 'Which neurons of the cerebellum control the refinement of movement?', 'Purkinje neurons', ['Pyramidal neurons', 'γ-motor neurons', 'Dopaminergic neurons'], { explanation: 'Cerebellum, slide 2.' }),
  mcq('q7-04', 'cerebellum-anatomy', 'The intermediate zone of the cerebellum controls…', 'The distal parts of the limbs', ['The axial body and posture', 'Overall planning of movement only', 'Eye movements only'], { explanation: 'Cerebellum, slide 6.' }),
  mcq('q7-05', 'cerebellum-anatomy', 'The lateral zone of the cerebellum is concerned with…', 'Overall planning of sequential movement', ['The muscles of the neck, shoulders and trunk', 'The distal parts of the limbs', 'Breathing and swallowing'], { explanation: 'Cerebellum, slide 6.' }),
  mcq('q7-06', 'cerebellum-anatomy', 'Damage to the dentate nucleus causes…', 'Smooth movements to become jerky, needing constant relearning', ['Loss of sensation on the same side of the body', 'Chorea, with quick, dance-like movements', 'Spastic paralysis with brisk reflexes'], { explanation: 'Cerebellum, slide 7.' }),
  mcq('q7-07', 'cerebellum-inputs', 'The corticopontocerebellar pathway projects to which side of the cerebellum?', 'The opposite (contralateral) side', ['The same (ipsilateral) side', 'Both sides equally', 'Only the vermis, in the midline'], { explanation: 'Cerebellum, slide 10.' }),
  mcq('q7-08', 'cerebellum-inputs', 'Vestibulocerebellar fibres go to the…', 'Flocculonodular lobe', ['Anterior lobe', 'Dentate nucleus', 'Lateral cerebellar hemisphere'], { explanation: 'Cerebellum, slide 10.' }),
  tf({ id: 'q7-09', conceptId: 'cerebellum-inputs', statement: 'The spinocerebellar pathway is the most rapidly conducting pathway to the cerebellum.', answer: true, explanation: 'Cerebellum, slide 11.' }),
  multi('q7-10', 'cerebellum-inputs', 'Where does cerebellar output go? Select all that apply.', ['Medulla and pons', 'Cortex, through the thalamus', 'Red nucleus and reticular formation'], ['Dorsal root ganglia'], { explanation: 'Cerebellum, slide 11.' }),
  mcq('q7-11', 'cerebellum-function', 'Where does the cerebellum get the “intention” for a movement?', 'Motor cortex and red nucleus', ['Muscle spindles', 'Golgi tendon organs', 'The retina and visual cortex'], { explanation: 'Cerebellum, slide 13.' }),
  mcq('q7-12', 'cerebellum-function', 'Which describes a ballistic movement?', 'So rapid it is preplanned to go a set distance and stop, without time for feedback', ['A slow, guided movement corrected continuously by sensory feedback', 'A reflex from a muscle spindle, with no cortical involvement', 'A movement controlled by the basal ganglia only'], { explanation: 'Cerebellum, slide 16: e.g. typing.' }),
  mcq('q7-13', 'cerebellum-function', 'Without the cerebellum, a ballistic movement…', 'Is slow to develop and weak, so it goes beyond the intended mark', ['Is faster and more accurate than normal', 'Cannot start at all without the cerebellum', 'Stops short of the intended mark every time'], { explanation: 'Cerebellum, slide 16.' }),
  mcq('q7-14', 'cerebellum-function', 'Judging how fast a car is approaching before crossing a road is an example of the cerebellum’s…', 'Extra predictive function', ['Damping (anti-overshoot) action', 'Stretch reflex', 'Vestibular reflex'], { explanation: 'Cerebellum, slide 17.', skill: 'application' }),
  tf({ id: 'q7-15', conceptId: 'cerebellum-function', statement: 'With lateral cerebellar damage, successive movements may begin too early or too late.', answer: true, explanation: 'Cerebellum, slide 17.' }),
  mcq('q7-16', 'cerebellar-signs', 'Overshooting a movement and then trying to compensate is called…', 'Dysmetria', ['Dysarthria', 'Bradykinesia', 'Chorea'], { explanation: 'Cerebellum, slide 18.', skill: 'terminology' }),
  mcq('q7-17', 'cerebellar-signs', 'Dysdiadochokinesia is…', 'Inability to perform rapid alternating movements', ['Slurred, explosive speech', 'Tremor of the hand at rest', 'Loss of joint position sense in the hands and feet'], { explanation: 'Cerebellum, slides 8 and 18.', skill: 'terminology' }),
  mcq('q7-18', 'cerebellar-signs', 'Cerebellar dysarthria is due to…', 'Inability to coordinate the mouth, larynx and respiratory muscles', ['Damage to Broca’s area in the frontal lobe', 'Deafness from damage to the auditory pathway', 'Paralysis of the tongue from a hypoglossal lesion'], { explanation: 'Cerebellum, slide 18.' }),
  multi('q7-19', 'cerebellar-signs', 'Which clinical tests show past-pointing? Select all that apply.', ['Finger–nose', 'Finger–finger'], ['Knee jerk', 'Romberg with eyes open only'], { explanation: 'Cerebellum, slide 18.' }),
  match('q7-20', 'cerebellar-signs', 'Match each letter of PINDAH to its sign.', [
    ['P', 'Past-pointing'],
    ['I', 'Intention tremor'],
    ['N', 'Nystagmus'],
    ['H', 'Hypotonia'],
  ], { explanation: 'Cerebellum, slide 18. D: dysdiadochokinesia (and dysarthria); A: ataxia.' }),
];

// ─── Lesson 8 — The basal ganglia ──────────────────────────────────
const lesson8: Q[] = [
  multi('q8-01', 'bg-structure', 'Which structures make up the basal ganglia? Select all that apply.', ['Caudate nucleus', 'Putamen', 'Globus pallidus', 'Subthalamic nucleus', 'Substantia nigra'], ['Dentate nucleus'], { explanation: 'Basal Ganglia, slide 3.' }),
  mcq('q8-02', 'bg-structure', 'The lentiform nucleus is the…', 'Putamen and globus pallidus', ['Caudate and putamen', 'Caudate and globus pallidus', 'Substantia nigra and subthalamus'], { explanation: 'Basal Ganglia, slides 2–3.' }),
  order('q8-03', 'bg-structure', 'Order the basal ganglia feedback loop.', ['Motor cortex', 'Basal ganglia', 'Thalamus (VL and VA nuclei)', 'Back to the cortex'], { explanation: 'Basal Ganglia, slide 2.' }),
  mcq('q8-04', 'bg-structure', 'The network of the basal ganglia with the substantia nigra and subthalamus forms the…', 'Extrapyramidal system', ['Pyramidal system', 'Limbic system', 'Reticular activating system'], { explanation: 'Basal Ganglia, slide 2.' }),
  mcq('q8-05', 'bg-structure', 'Where do the basal ganglia lie?', 'Deep in the cerebrum, lateral to the thalamus', ['In the brainstem, beside the reticular formation', 'In the cerebellum, beside the dentate nucleus', 'In the spinal cord, in the ventral horn'], { explanation: 'Basal Ganglia, slide 3.' }),
  mcq('q8-06', 'bg-circuits', 'Writing the alphabet or passing a football depends on the…', 'Putamen circuit', ['Caudate circuit', 'Vestibular nuclei', 'Stretch reflex'], { explanation: 'Basal Ganglia, slide 5: complex patterns of skilled activity.' }),
  mcq('q8-07', 'bg-circuits', 'Running away from a snake is an example of the…', 'Caudate circuit — cognitive control of motor activity', ['Putamen circuit — learned patterns of movement', 'Withdrawal reflex only, through the spinal cord', 'Cerebellar damping of the running movement'], { explanation: 'Basal Ganglia, slide 5.', skill: 'application' }),
  multi('q8-08', 'bg-circuits', 'The caudate circuit is involved in… Select all that apply.', ['Learning and memory', 'Automatic performance of previously learned movements', 'Cognitive control of movement'], ['Relaying pain'], { explanation: 'Cerebellum, slide 21; Basal Ganglia, slide 5.' }),
  mcq('q8-09', 'bg-transmitters', 'According to the lecture, dopamine from the substantia nigra acts on the caudate and putamen as…', 'An inhibitory transmitter', ['An excitatory transmitter', 'A hormone', 'It has no effect'], { explanation: 'Basal Ganglia, slide 6.' }),
  mcq('q8-10', 'bg-transmitters', 'Acetylcholine from the cortex to the caudate and putamen is…', 'Excitatory', ['Inhibitory', 'A pain transmitter', 'Absent'], { explanation: 'Basal Ganglia, slide 6.' }),
  mcq('q8-11', 'bg-transmitters', 'The GABA pathway runs from…', 'The caudate to the globus pallidus and substantia nigra', ['The cortex to the putamen and caudate', 'The substantia nigra to the cortex', 'The thalamus to the cerebellum'], { explanation: 'Basal Ganglia, slide 6.' }),
  multi('q8-12', 'bg-transmitters', 'Which other transmitters act in multiple basal ganglia pathways? Select all that apply.', ['Noradrenaline', 'Serotonin', 'Enkephalin'], ['Substance P'], { explanation: 'Basal Ganglia, slide 6.' }),
  mcq('q8-13', 'bg-disorders', 'The overall function of the basal ganglia is described as…', 'Inhibitory — putting on the brakes', ['Excitatory — the accelerator', 'Mainly sensory relay', 'Purely autonomic control'], { explanation: 'Basal Ganglia, slide 7.' }),
  mcq('q8-14', 'bg-disorders', 'To make a voluntary movement, the basal ganglia must…', 'Brake some postural reflexes and release the brake on the voluntary movement', ['Brake every movement, voluntary and postural alike, until the cortex overrides them', 'Release every brake on all reflexes at once', 'Stop the cerebellum from correcting the movement'], { explanation: 'Basal Ganglia, slide 7.' }),
  mcq('q8-15', 'bg-disorders', 'Akinesia and bradykinesia are…', 'Hypokinetic deficits', ['Hyperkinetic deficits', 'Cerebellar signs', 'Sensory signs'], { explanation: 'Basal Ganglia, slide 7.' }),
  multi('q8-16', 'bg-disorders', 'Which are the three classic signs of Parkinson’s disease? Select all that apply.', ['Tremor', 'Lead-pipe or cogwheel rigidity', 'Bradykinesia'], ['Chorea', 'Intention tremor'], { explanation: 'Basal Ganglia, slide 8.' }),
  tf({ id: 'q8-17', conceptId: 'bg-disorders', statement: 'In Parkinson’s disease an activity, once started, is difficult to break.', answer: true, explanation: 'Basal Ganglia, slide 9.' }),
  mcq('q8-18', 'bg-disorders', 'Huntington’s disease is inherited as…', 'A dominant condition, starting at about 30–50', ['A recessive condition, starting in childhood', 'An X-linked condition, seen only in men over 40', 'A condition that is not inherited at all'], { explanation: 'Basal Ganglia, slide 9.' }),
  multi('q8-19', 'bg-disorders', 'Which neurons are lost in the striatum in Huntington’s disease? Select all that apply.', ['Cholinergic neurons', 'GABA-secreting neurons'], ['Dopaminergic neurons of the substantia nigra'], { explanation: 'Basal Ganglia, slide 9.' }),
  mcq('q8-20', 'bg-disorders', 'Continuous slow, writhing movement is…', 'Athetosis', ['Chorea', 'Hemiballismus', 'Bradykinesia'], { explanation: 'Basal Ganglia, slide 8: lesion of the lenticular nucleus.', skill: 'terminology' }),
  mcq('q8-21', 'bg-disorders', 'Intense, violent flailing of one arm and leg after a small stroke suggests…', 'Hemiballismus, from damage to the subthalamic nucleus', ['Chorea, from damage to the caudate nucleus and putamen', 'Parkinson’s disease from loss of nigral dopamine', 'Cerebellar ataxia from damage to the vermis'], { explanation: 'Basal Ganglia, slide 10.', skill: 'application', clinical: true }),
  mcq('q8-22', 'bg-disorders', 'Chorea is linked to degeneration of the…', 'Caudate nucleus', ['Substantia nigra', 'Dentate nucleus', 'Thalamus'], { explanation: 'Basal Ganglia, slide 8.' }),
];

// ─── Lesson 9 — The brain ──────────────────────────────────────────
const lesson9: Q[] = [
  mcq('q9-01', 'brain-overview', 'How many meninges cover the brain?', 'Three', ['Two (dura and pia)', 'Four', 'One'], { explanation: 'The Brain, slide 4.' }),
  mcq('q9-02', 'brain-overview', 'Why does the right side of the brain control the left side of the body?', 'The nerve fibres cross over as they leave the brain', ['The right hemisphere is larger and dominant', 'The left hemisphere only senses, never moves', 'Each hemisphere controls both sides equally'], { explanation: 'The Brain, slide 4; the tracts cross in the medulla (slide 18).' }),
  mcq('q9-03', 'brain-overview', 'Which cells support the neurones in the brain?', 'Glial cells', ['Purkinje cells', 'Red blood cells', 'Schwann cells only'], { explanation: 'The Brain, slide 3.' }),
  mcq('q9-04', 'brain-overview', 'The ventricles are…', 'Spaces inside the brain filled with CSF', ['Blood vessels deep inside the brain', 'Folds of the cortex between the gyri', 'Parts of the brainstem around the aqueduct'], { explanation: 'The Brain, slide 20.' }),
  mcq('q9-05', 'brain-lobes', 'Which part of the frontal lobe is responsible for complex thought and emotional expression?', 'The prefrontal cortex', ['The posterior frontal lobe', 'The inferior frontal cortex', 'The precentral gyrus'], { explanation: 'The Brain, slide 7.' }),
  mcq('q9-06', 'brain-lobes', 'Persistence of a single thought or action after frontal damage is called…', 'Perseveration', ['Prosopagnosia', 'Anomia', 'Agraphia'], { explanation: 'The Brain, slide 7.', skill: 'terminology' }),
  mcq('q9-07', 'brain-lobes', 'Inability to plan the steps of making coffee after a frontal lobe injury is a problem of…', 'Sequencing', ['Comprehension', 'Vision', 'Sensation'], { explanation: 'The Brain, slide 7.', skill: 'application' }),
  mcq('q9-08', 'brain-lobes', 'Difficulty recognising faces is…', 'Prosopagnosia — a temporal lobe sign', ['Alexia (word blindness) — a parietal sign', 'Perseveration — a frontal sign', 'Colour agnosia — an occipital sign'], { explanation: 'The Brain, slide 10.' }),
  mcq('q9-09', 'brain-lobes', 'The left temporal lobe is mainly involved in…', 'Verbal memory and comprehension of words', ['Visual memory and the appreciation of music', 'Planning and starting voluntary movement', 'Balance and coordination of the limbs'], { explanation: 'The Brain, slide 9.' }),
  mcq('q9-10', 'brain-lobes', 'Déjà vu can result from a problem in which lobe?', 'Temporal', ['Frontal', 'Occipital', 'Parietal'], { explanation: 'The Brain, slide 6: emotional memory is in the temporal lobe.' }),
  match('q9-11', 'brain-lobes', 'Match each parietal sign to its meaning.', [
    ['Anomia', 'Cannot name an object'],
    ['Agraphia', 'Cannot find words for writing'],
    ['Alexia', 'Problems with reading'],
    ['Dyscalculia', 'Difficulty with mathematics'],
  ], { explanation: 'The Brain, slide 12.' }),
  mcq('q9-12', 'brain-lobes', 'The right parietal lobe is involved in…', 'Directing attention and visuospatial skills', ['Reading and writing (literacy)', 'Speech production (Broca’s area)', 'Hearing and auditory perception'], { explanation: 'The Brain, slide 11.' }),
  mcq('q9-13', 'brain-lobes', 'Destruction of the visuosensory centre of the occipital lobe causes…', 'Blindness, even with intact eyes and optic nerves', ['Inability to recognise what is seen, with normal sight', 'Deafness', 'Loss of the blink reflex only'], { explanation: 'The Brain, slide 13.' }),
  multi('q9-14', 'brain-lobes', 'Which are occipital lobe signs? Select all that apply.', ['Visual field cuts', 'Colour agnosia', 'Word blindness', 'Movement agnosia'], ['Wernicke’s aphasia'], { explanation: 'The Brain, slide 14.' }),
  mcq('q9-15', 'brainstem', 'Which is the smallest region of the brainstem?', 'The midbrain', ['The pons', 'The medulla', 'The cerebellum'], { explanation: 'The Brain, slide 18.' }),
  mcq('q9-16', 'brainstem', 'Which part of the brainstem relays information from the cerebrum to the cerebellum?', 'The pons', ['The medulla', 'The midbrain', 'The thalamus'], { explanation: 'The Brain, slide 18.' }),
  multi('q9-17', 'brainstem', 'Which are effects of brainstem damage? Select all that apply.', ['Coma or altered consciousness', 'Dysphagia', 'Changes in heart rate and BP', 'Vertigo'], ['Prosopagnosia'], { explanation: 'The Brain, slide 19.' }),
  mcq('q9-18', 'cortex-dominance', 'About what proportion of people are right-handed and left-hemisphere dominant?', 'About 87%', ['About 50%', 'About 60%', 'About 99%'], { explanation: 'The Brain, slide 23.' }),
  mcq('q9-19', 'cortex-dominance', 'In most people, spatial perception is governed by the…', 'Right hemisphere', ['Left (dominant) hemisphere', 'Cerebellum', 'Brainstem'], { explanation: 'The Brain, slide 22.' }),
  mcq('q9-20', 'cortex-dominance', 'When the corpus callosum is cut…', 'Each hemisphere still perceives, but no messages pass between them', ['Both eyes go blind because the optic fibres cross there', 'Speech is lost entirely in every situation', 'The body is paralysed below the neck on both sides'], { explanation: 'The Brain, slide 24.' }),
  mcq('q9-21', 'deep-structures', 'The main function of the hypothalamus is…', 'Homeostasis — holding variables at a set-point', ['Relaying sensation to the cerebral cortex', 'Coordinating smooth voluntary movement', 'Forming new long-term declarative memories'], { explanation: 'The Brain, slide 26.' }),
  multi('q9-22', 'deep-structures', 'Which are parts of the limbic system? Select all that apply.', ['Hippocampus', 'Amygdala', 'Cingulate gyrus', 'Fornix'], ['Cerebellum', 'Putamen'], { explanation: 'The Brain, slide 27.' }),
  multi('q9-23', 'deep-structures', 'Lesions of the limbic system can cause… Select all that apply.', ['Voracious appetite', 'Increased sexual activity', 'Docility, with loss of fear and anger'], ['Blindness'], { explanation: 'The Brain, slide 27.' }),
  mcq('q9-24', 'deep-structures', 'After both hippocampi were removed, the famous patient could not…', 'Lay down new declarative memories', ['Remember his childhood and early life', 'Hold a normal conversation', 'Learn any new motor skills'], { explanation: 'The Brain, slide 28.' }),
];

export const questions: Q[] = [...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5, ...lesson6, ...lesson7, ...lesson8, ...lesson9];
