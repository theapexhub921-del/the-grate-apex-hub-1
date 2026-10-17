// Physiology → Special Senses — the topic question bank.
//
// Rules: only what the lessons teach (the three special senses decks). Not
// asked: whether glutamate is "inhibitory" (see discrepancies), or anything
// from the answer sheets and study guide. IDs: qN-xx.
import { fill, match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/special-senses/sources';

type Q = QuestionDraft<ConceptId>;

const lesson1: Q[] = [
  mcq('q1-01', 'eye-coats', 'What range of wavelengths can the human eye detect?', '400–700 nm', ['100–400 nm', '700–1000 nm', '20–20,000 nm'], { explanation: 'Visual System, slide 1.' }),
  mcq('q1-02', 'eye-coats', 'The transparent front of the sclera is the…', 'Cornea', ['Conjunctiva', 'Iris', 'Lens'], { explanation: 'Visual System, slide 2.' }),
  multi('q1-03', 'eye-coats', 'Which structures form from the front of the choroid? Select all that apply.', ['Iris', 'Ciliary body', 'Suspensory ligaments'], ['Cornea', 'Lens'], { explanation: 'Visual System, slides 3–4.' }),
  mcq('q1-04', 'eye-coats', 'Why is the optic disc a blind spot?', 'It has no photoreceptors — the retina does not cover it', ['It is covered by the lens', 'It has only rods', 'It is behind the choroid'], { explanation: 'Visual System, slide 5.' }),
  mcq('q1-05', 'eye-coats', 'The fovea centralis contains…', 'Only cones', ['Only rods', 'Rods and cones equally', 'No photoreceptors'], { explanation: 'Visual System, slide 5.' }),
  mcq('q1-06', 'eye-cavities', 'Which humour fills the posterior cavity?', 'Vitreous humour', ['Aqueous humour', 'Perilymph', 'Tears'], { explanation: 'Visual System, slide 6.' }),
  mcq('q1-07', 'eye-cavities', 'The posterior chamber lies…', 'Between the iris and the lens', ['Between the cornea and the iris', 'Behind the lens', 'Behind the retina'], { explanation: 'Visual System, slide 7.' }),
  mcq('q1-08', 'eye-cavities', 'Lacrimal glands are controlled by…', 'Parasympathetic nerves', ['Sympathetic nerves', 'Hormones', 'The optic nerve'], { explanation: 'Visual System, slide 9.' }),
  mcq('q1-09', 'eye-cavities', 'Tears drain into the nose through the…', 'Nasolacrimal duct', ['Canal of Schlemm', 'Eustachian tube', 'Lacrimal gland duct'], { explanation: 'Visual System, slide 9.' }),
  mcq('q1-10', 'aqueous-humour', 'Aqueous humour is secreted by…', 'The ciliary epithelium', ['The lens', 'The cornea', 'The retina'], { explanation: 'Visual System, slide 11.' }),
  mcq('q1-11', 'aqueous-humour', 'What determines intraocular pressure?', 'The balance between production and drainage of aqueous humour', ['The size of the pupil', 'Vitreous humour production', 'Blood pressure alone'], { explanation: 'Visual System, slide 11.' }),
  tf({ id: 'q1-12', conceptId: 'aqueous-humour', statement: 'Vitreous humour maintains enough pressure to stop the eyeball collapsing.', answer: true, explanation: 'Visual System, slide 14.' }),
];

const lesson2: Q[] = [
  multi('q2-01', 'refraction', 'Which are refractive media of the eye? Select all that apply.', ['Cornea', 'Aqueous humour', 'Lens', 'Vitreous humour'], ['Retina'], { explanation: 'Visual System, slide 15.' }),
  mcq('q2-02', 'refraction', 'About how much refraction occurs in the lens?', '20%', ['80%', '50%', '5%'], { explanation: 'Visual System, slide 16.' }),
  multi('q2-03', 'refraction', 'The image on the retina is… Select all that apply.', ['Real', 'Inverted', 'Left–right reversed', 'Smaller'], ['Upright'], { explanation: 'Visual System, slide 16.' }),
  mcq('q2-04', 'accommodation', 'For a near object the lens becomes…', 'More rounded', ['Thinner', 'Cloudy', 'Unchanged'], { explanation: 'Visual System, slide 19.' }),
  mcq('q2-05', 'accommodation', 'The near point of vision is often taken as…', '25 cm', ['6 m', '2.5 cm', '1 m'], { explanation: 'Visual System, slide 22.' }),
  mcq('q2-06', 'accommodation', 'Presbyopia is due to…', 'Loss of elasticity of the ciliary muscle and lens with age', ['An eyeball that is too long', 'Uneven corneal curvature', 'Clouding of the lens'], { explanation: 'Visual System, slide 22.' }),
  multi('q2-07', 'accommodation', 'What makes up the near response? Select all that apply.', ['Accommodation', 'Convergence of the visual axes', 'Pupil constriction'], ['Pupil dilation'], { explanation: 'Visual System, slides 22–23.' }),
  mcq('q2-08', 'refractive-errors', 'In myopia, light is focused…', 'In front of the retina', ['Behind the retina', 'On the retina', 'On the cornea'], { explanation: 'Visual System, slides 23–24.' }),
  mcq('q2-09', 'refractive-errors', 'Hyperopia can be caused by…', 'An eyeball shorter than normal', ['An eyeball longer than normal', 'Too much corneal curvature', 'Clumped crystallins'], { explanation: 'Visual System, slides 24–25.' }),
  mcq('q2-10', 'refractive-errors', 'Astigmatism results from…', 'Uneven curvature of the cornea or lens', ['A short eyeball', 'Loss of lens elasticity', 'A cloudy lens'], { explanation: 'Visual System, slide 27.' }),
  mcq('q2-11', 'refractive-errors', 'Cataract is caused by…', 'Clumping of lens proteins (alpha-crystallins)', ['Raised intraocular pressure', 'A long eyeball', 'Loss of rods'], { explanation: 'Visual System, slide 30.' }),
  multi('q2-12', 'refractive-errors', 'Which are causes of cataract? Select all that apply.', ['Ageing', 'Long-term UV exposure', 'Diabetes', 'Smoking'], ['Myopia'], { explanation: 'Visual System, slide 30.' }),
];

const lesson3: Q[] = [
  multi('q3-01', 'retina-layers', 'Which are cell types of the retina? Select all that apply.', ['Bipolar cells', 'Horizontal cells', 'Amacrine cells', 'Ganglion cells'], ['Hair cells'], { explanation: 'Visual System, slide 34.' }),
  mcq('q3-02', 'retina-layers', 'Which layer absorbs stray light?', 'The pigment epithelium', ['The ganglion cell layer', 'The outer plexiform layer', 'The inner nuclear layer'], { explanation: 'Visual System, slide 35.' }),
  mcq('q3-03', 'retina-layers', 'In which layer do photoreceptors synapse with bipolar and horizontal cells?', 'The outer plexiform layer', ['The inner plexiform layer', 'The ganglion cell layer', 'The outer nuclear layer'], { explanation: 'Visual System, slide 35.' }),
  tf({ id: 'q3-04', conceptId: 'retina-layers', statement: 'Light must pass through the other retinal layers before reaching the rods and cones.', answer: true, explanation: 'Visual System, slide 40.' }),
  mcq('q3-05', 'rods-cones', 'What proportion of the retina’s 150 million receptors are rods?', '95%', ['50%', '5%', '75%'], { explanation: 'Visual System, slide 44.' }),
  mcq('q3-06', 'rods-cones', 'Rhodopsin is made of 11-cis retinal and…', 'Scotopsin', ['Photopsin', 'Transducin', 'Arrestin'], { explanation: 'Visual System, slide 47.' }),
  mcq('q3-07', 'rods-cones', 'At twilight, how do rod signals reach the cone pathway?', 'Through gap junctions between rods and cones', ['Through amacrine cells only', 'Through horizontal cells only', 'They do not'], { explanation: 'Visual System, slide 45.' }),
  mcq('q3-08', 'phototransduction', 'In the dark, what keeps CNG channels open?', 'High cGMP', ['High cAMP', 'Light', 'Low Ca²⁺'], { explanation: 'Visual System, slide 48.' }),
  mcq('q3-09', 'phototransduction', 'Which G protein is activated by metarhodopsin II?', 'Transducin', ['Gustducin', 'Gs', 'Recoverin'], { explanation: 'Visual System, slide 51.' }),
  mcq('q3-10', 'phototransduction', 'Phosphodiesterase in the rod converts…', 'cGMP to 5′-GMP', ['ATP to cAMP', 'GTP to cGMP', 'Retinal to retinol'], { explanation: 'Visual System, slide 51.' }),
  mcq('q3-11', 'phototransduction', 'Which cone photopsin responds to 360–480 nm light?', 'Blue', ['Red', 'Green', 'Rhodopsin'], { explanation: 'Visual System, slide 57.' }),
  mcq('q3-12', 'photopigment-recovery', 'Where is all-trans retinol re-made into 11-cis retinal?', 'In the pigment epithelial cells', ['In the ganglion cells', 'In the lens', 'In the cone outer segment only'], { explanation: 'Visual System, slide 58.' }),
  mcq('q3-13', 'photopigment-recovery', 'What triggers photoreceptor recovery after light?', 'A fall in cytoplasmic Ca²⁺', ['A rise in Ca²⁺', 'More cGMP hydrolysis', 'More transducin'], { explanation: 'Visual System, slide 60.' }),
  match('q3-14', 'photopigment-recovery', 'Match each recovery protein to its action.', [
    ['GCAP', 'Activates guanylyl cyclase'],
    ['Rhodopsin kinase', 'Phosphorylates activated rhodopsin'],
    ['Arrestin', 'Binds and quenches activated rhodopsin'],
  ], { explanation: 'Visual System, slides 60–61.' }),
];

const lesson4: Q[] = [
  mcq('q4-01', 'retinal-processing', 'How many cones synapse with a single bipolar cell?', 'One or a few', ['Many hundreds', 'None', 'All cones in the fovea'], { explanation: 'Visual System, slide 63.' }),
  mcq('q4-02', 'retinal-processing', 'What gives bipolar cells a receptive field of two concentric discs?', 'Lateral connections from horizontal cells', ['Amacrine cells', 'Ganglion cells', 'The pigment epithelium'], { explanation: 'Visual System, slide 63.' }),
  mcq('q4-03', 'retinal-processing', 'In light, on-centre bipolar cells…', 'Depolarise, as inhibition is removed', ['Are inhibited', 'Stop working', 'Hyperpolarise'], { explanation: 'Visual System, slide 65.' }),
  mcq('q4-04', 'retinal-processing', 'Where do most ganglion cells get their input?', 'From amacrine cells', ['Directly from rods', 'From horizontal cells', 'From the pigment epithelium'], { explanation: 'Visual System, slide 64.' }),
  order('q4-05', 'retinal-processing', 'Order the rod pathway.', ['Rod', 'Bipolar cell', 'Amacrine cell', 'Ganglion cell'], { explanation: 'Visual System, slide 65.' }),
  mcq('q4-06', 'optic-pathway', 'Light from the temporal visual field falls on the…', 'Nasal hemiretina', ['Temporal hemiretina', 'Fovea only', 'Optic disc'], { explanation: 'Visual System, slide 68.' }),
  mcq('q4-07', 'optic-pathway', 'Which fibres cross at the optic chiasm?', 'Those from the nasal hemiretinas', ['Those from the temporal hemiretinas', 'All fibres', 'None'], { explanation: 'Visual System, slide 68.' }),
  mcq('q4-08', 'optic-pathway', 'Most optic tract fibres synapse in the…', 'Lateral geniculate nucleus of the thalamus', ['Medial geniculate body', 'Superior colliculus', 'Pretectal nucleus'], { explanation: 'Visual System, slide 69.' }),
  order('q4-09', 'optic-pathway', 'Order the optic pathway.', ['Optic nerve', 'Optic chiasm', 'Optic tract', 'Lateral geniculate nucleus', 'Optic radiations', 'Primary visual cortex'], { explanation: 'Visual System, slides 68–69.' }),
  match('q4-10', 'field-defects', 'Match each lesion to its field defect.', [
    ['Right optic nerve', 'Blind right eye'],
    ['Optic chiasm', 'Bitemporal hemianopia'],
    ['Right optic tract', 'Left homonymous hemianopia'],
    ['Part of the right optic radiation', 'Left quadrant loss in both eyes'],
  ], { explanation: 'Visual System, slides 71–72.' }),
  mcq('q4-11', 'field-defects', 'Why do lesions of the optic radiations usually cause smaller defects than tract lesions?', 'The radiations are spread out', ['They carry fewer fibres', 'They cross again', 'They are in the eye'], { explanation: 'Visual System, slide 72.', skill: 'cause-effect' }),
  tf({ id: 'q4-12', conceptId: 'optic-pathway', statement: 'Each optic tract contains both crossed and uncrossed fibres.', answer: true, explanation: 'Visual System, slide 69.' }),
];

const lesson5: Q[] = [
  mcq('q5-01', 'colour-vision', 'About how many males have colour blindness?', '1 in 12', ['1 in 100', '1 in 2', '1 in 1000'], { explanation: 'Visual System, slide 76.' }),
  mcq('q5-02', 'colour-vision', 'A dichromat has…', 'Complete absence of one cone pigment', ['No cones', 'A malfunctioning pigment', 'Normal colour vision'], { explanation: 'Visual System, slides 76–77.', skill: 'terminology' }),
  mcq('q5-03', 'colour-vision', 'Which form of colour blindness is most common?', 'Red/green', ['Blue/yellow', 'Monochromacy', 'Tritanopia'], { explanation: 'Visual System, slide 78: about 99%.' }),
  mcq('q5-04', 'colour-vision', 'Colour blindness is tested with the…', 'Ishihara test', ['Snellen chart', 'Rinne test', 'Romberg test'], { explanation: 'Visual System, slide 78.' }),
  mcq('q5-05', 'adaptation', 'How long can rods continue to dark-adapt?', 'Up to four hours', ['About 5 minutes', 'About 20 seconds', 'Two days'], { explanation: 'Visual System, slide 82.' }),
  mcq('q5-06', 'adaptation', 'Night blindness (nyctalopia) results from deficiency of…', 'Vitamin A', ['Vitamin D', 'Vitamin B12', 'Vitamin C'], { explanation: 'Visual System, slide 83.' }),
  mcq('q5-07', 'adaptation', 'Light adaptation takes about…', '5 minutes', ['20 minutes', '4 hours', '1 second'], { explanation: 'Visual System, slide 85.' }),
  mcq('q5-08', 'pupil', 'Contraction of the radial iris muscles…', 'Dilates the pupil (sympathetic)', ['Constricts the pupil (parasympathetic)', 'Focuses the lens', 'Closes the eyelid'], { explanation: 'Visual System, slide 86.' }),
  mcq('q5-09', 'pupil', 'Which drug can prevent pupillary constriction?', 'Atropine', ['Adrenaline', 'Pilocarpine', 'Morphine'], { explanation: 'Visual System, slide 87.' }),
  mcq('q5-10', 'pupil', 'The efferent limb of the pupillary light reflex runs in the…', 'Oculomotor nerve (III)', ['Optic nerve (II)', 'Trochlear nerve (IV)', 'Abducens nerve (VI)'], { explanation: 'Visual System, slide 88.' }),
  mcq('q5-11', 'eye-movements', 'Rapid ballistic movements that change fixation are…', 'Saccades', ['Smooth pursuit', 'Vergence', 'Vestibulo-ocular movements'], { explanation: 'Visual System, slide 93.' }),
  mcq('q5-12', 'eye-movements', 'Which eye movements are disconjugate?', 'Vergence movements', ['Saccades', 'Smooth pursuit', 'Vestibulo-ocular'], { explanation: 'Visual System, slide 94.' }),
  mcq('q5-13', 'eye-movements', 'Which muscle depresses the eye?', 'Inferior rectus', ['Superior rectus', 'Lateral rectus', 'Superior oblique only'], { explanation: 'Visual System, slide 99.' }),
  mcq('q5-14', 'eye-movements', 'How many extraocular muscles move each eye?', 'Six', ['Four', 'Eight', 'Three'], { explanation: 'Visual System, slide 97.' }),
];

const lesson6: Q[] = [
  mcq('q6-01', 'ear-structure', 'What is the range of human hearing?', '20–20,000 Hz', ['400–700 Hz', '2–2,000 Hz', '200–200,000 Hz'], { explanation: 'Auditory, slide 2.' }),
  mcq('q6-02', 'ear-structure', 'How long is the ear canal?', 'About 3 cm', ['About 3 mm', 'About 10 cm', 'About 1 cm'], { explanation: 'Auditory, slide 3.' }),
  order('q6-03', 'ear-structure', 'Order the ossicles from the eardrum.', ['Malleus', 'Incus', 'Stapes'], { explanation: 'Auditory, slides 4, 32.' }),
  mcq('q6-04', 'ear-structure', 'The stapedius muscle is attached to the…', 'Stapes', ['Malleus', 'Incus', 'Eardrum'], { explanation: 'Auditory, slide 5.' }),
  mcq('q6-05', 'ear-structure', 'The membranous labyrinth contains…', 'Endolymph', ['Perilymph', 'Air', 'CSF'], { explanation: 'Auditory, slide 6.' }),
  mcq('q6-06', 'cochlea', 'The scala vestibuli and scala tympani connect at the…', 'Helicotrema', ['Round window', 'Oval window', 'Modiolus'], { explanation: 'Auditory, slide 13.' }),
  mcq('q6-07', 'cochlea', 'Reissner’s membrane separates the scala media from the…', 'Scala vestibuli', ['Scala tympani', 'Middle ear', 'Vestibule'], { explanation: 'Auditory, slide 14.' }),
  mcq('q6-08', 'cochlea', 'How many rows of outer hair cells are there?', 'Three', ['One', 'Two', 'Five'], { explanation: 'Auditory, slide 20.' }),
  mcq('q6-09', 'cochlea', 'What connects the tips of shorter stereocilia to taller neighbours?', 'Tip links', ['Gap junctions', 'Kinocilia', 'The tectorial membrane'], { explanation: 'Auditory, slide 22.' }),
  mcq('q6-10', 'sound', 'Above what intensity can any sound cause hearing loss?', '85 dB', ['60 dB', '140 dB', '15 dB'], { explanation: 'Auditory, slide 30.' }),
  mcq('q6-11', 'sound', 'Normal conversation is about…', '60 dB', ['15 dB', '90 dB', '120 dB'], { explanation: 'Auditory, slide 29.' }),
  mcq('q6-12', 'sound', 'The ear is most sensitive at…', '500–4000 Hz', ['20–200 Hz', '10–20 kHz', '5–10 Hz'], { explanation: 'Auditory, slide 31: the speech band.' }),
  multi('q6-13', 'sound-transmission', 'How do the ossicles match impedance? Select all that apply.', ['Area ratio', 'Ossicular lever', 'Buckling of the eardrum'], ['Amplifying through the round window'], { explanation: 'Auditory, slide 33.' }),
  mcq('q6-14', 'sound-transmission', 'What dissipates the pressure of fluid vibration in the cochlea?', 'The round window', ['The oval window', 'The Eustachian tube', 'The helicotrema'], { explanation: 'Auditory, slide 34.' }),
];

const lesson7: Q[] = [
  mcq('q7-01', 'auditory-transduction', 'What bends the stereocilia?', 'Shearing between the basilar and tectorial membranes', ['Air pressure in the middle ear', 'Perilymph in the scala tympani alone', 'The stapedius'], { explanation: 'Auditory, slide 36.' }),
  mcq('q7-02', 'auditory-transduction', 'Which ion entering through MET channels mainly depolarises the hair cell?', 'K⁺', ['Na⁺', 'Cl⁻', 'H⁺'], { explanation: 'Auditory, slide 37: from the endolymph.' }),
  mcq('q7-03', 'auditory-transduction', 'What triggers transmitter release from the hair cell?', 'Ca²⁺ entering through voltage-gated channels', ['K⁺ leaving', 'cAMP', 'Light'], { explanation: 'Auditory, slides 37–38.' }),
  match('q7-04', 'pitch', 'Match each theory to its idea.', [
    ['Frequency theory', 'Pitch is coded by the firing frequency of the nerve fibre'],
    ['Place theory', 'Different parts of the basilar membrane respond to different frequencies'],
  ], { explanation: 'Auditory, slide 41.' }),
  mcq('q7-05', 'pitch', 'Who proposed the place theory?', 'Von Helmholtz', ['Ishihara', 'Wernicke', 'Corti'], { explanation: 'Auditory, slide 41.' }),
  order('q7-06', 'auditory-pathway', 'Order the auditory pathway.', ['Cochlear nucleus', 'Lateral lemniscus', 'Inferior colliculus', 'Medial geniculate body', 'Primary auditory cortex'], { explanation: 'Auditory, slides 43–44.' }),
  mcq('q7-07', 'auditory-pathway', 'Which nucleus is concerned with sound localisation?', 'The superior olivary nucleus', ['The inferior colliculus', 'The lateral geniculate nucleus', 'The solitary nucleus'], { explanation: 'Auditory, slide 47.' }),
  mcq('q7-08', 'auditory-pathway', 'Damage to the right cochlear nuclei causes…', 'Deafness in the right ear', ['Deafness in the left ear', 'No deafness', 'Total deafness'], { explanation: 'Auditory, slide 44.' }),
  mcq('q7-09', 'auditory-pathway', 'Music is processed mainly in the…', 'Right hemisphere', ['Left hemisphere (Wernicke’s area)', 'Cerebellum', 'Brainstem'], { explanation: 'Auditory, slide 47.' }),
  mcq('q7-10', 'deafness', 'Hearing loss from earwax blocking the canal is…', 'Conductive', ['Sensorineural', 'Central', 'Presbycusis'], { explanation: 'Auditory, slide 49.' }),
  tf({ id: 'q7-11', conceptId: 'deafness', statement: 'Sensorineural hearing loss can be cured with medication.', answer: false, explanation: 'Auditory, slide 50: it is permanent.', skill: 'misconception' }),
  mcq('q7-12', 'deafness', 'Age-related hearing loss is called…', 'Presbycusis', ['Presbyopia', 'Otosclerosis', 'Tinnitus'], { explanation: 'Auditory, slide 48.', skill: 'terminology' }),
  mcq('q7-13', 'deafness', 'Which test shows hearing loss at each frequency?', 'An audiogram', ['An ECG', 'The Ishihara test', 'A tympanic reflex'], { explanation: 'Auditory, slide 51.' }),
];

const lesson8: Q[] = [
  mcq('q8-01', 'vestibular-overview', 'The utricle and saccule sense…', 'Linear acceleration', ['Angular acceleration', 'Sound', 'Light'], { explanation: 'Auditory, slides 52–53.' }),
  mcq('q8-02', 'semicircular-canals', 'The semicircular canals are arranged…', 'Roughly at right angles to each other', ['In parallel', 'In a straight line', 'Inside the cochlea'], { explanation: 'Auditory, slide 54.' }),
  mcq('q8-03', 'semicircular-canals', 'Where is the crista ampullaris?', 'In the ampulla of each semicircular canal', ['In the utricle', 'In the cochlear duct', 'In the middle ear'], { explanation: 'Auditory, slide 55.' }),
  mcq('q8-04', 'semicircular-canals', 'The gelatinous mass in which crista hair cells are embedded is the…', 'Cupula', ['Otolith membrane', 'Tectorial membrane', 'Basilar membrane'], { explanation: 'Auditory, slide 55.' }),
  mcq('q8-05', 'semicircular-canals', 'The tallest cilium of a vestibular hair cell is the…', 'Kinocilium', ['Stereocilium', 'Microvillus', 'Tip link'], { explanation: 'Auditory, slide 55.' }),
  mcq('q8-06', 'semicircular-canals', 'Why does rotation deflect the cupula?', 'The endolymph lags behind because of inertia', ['The perilymph flows out', 'Otoconia fall on it', 'Air pressure changes'], { explanation: 'Auditory, slide 56.', skill: 'cause-effect' }),
  tf({ id: 'q8-07', conceptId: 'semicircular-canals', statement: 'Vestibular hair cells release transmitter even when not stimulated.', answer: true, explanation: 'Auditory, slide 56.' }),
  mcq('q8-08', 'otolith-organs', 'Otoconia are crystals of…', 'Calcium carbonate', ['Calcium phosphate', 'Sodium chloride', 'Uric acid'], { explanation: 'Auditory, slide 63.' }),
  mcq('q8-09', 'otolith-organs', 'Which otolith organ lies next to the cochlea?', 'The saccule', ['The utricle', 'The ampulla', 'The cupula'], { explanation: 'Auditory, slide 63.' }),
  mcq('q8-10', 'otolith-organs', 'The macula utriculi lies roughly in the…', 'Horizontal plane', ['Vertical plane', 'Same plane as the cochlea', 'Plane of the eardrum'], { explanation: 'Auditory, slide 63.' }),
  mcq('q8-11', 'vestibular-pathway', 'Which tract links the vestibular nuclei to the extraocular motor nuclei?', 'Medial longitudinal fasciculus', ['Vestibulospinal tract', 'Lateral lemniscus', 'Optic tract'], { explanation: 'Auditory, slide 71.' }),
  multi('q8-12', 'vestibular-pathway', 'Which result from vestibular disturbance? Select all that apply.', ['Dizziness', 'Imbalance', 'Nystagmus', 'Disturbed muscle tone'], ['Deafness only'], { explanation: 'Auditory, slide 72.' }),
];

const lesson9: Q[] = [
  mcq('q9-01', 'chemical-senses', 'Taste detects chemicals…', 'Dissolved in liquids', ['In the air', 'As light', 'As pressure'], { explanation: 'Chemical Senses, slide 1.' }),
  mcq('q9-02', 'taste-modalities', 'Which taste is evoked by all acids in dilute solution?', 'Sour', ['Bitter', 'Salty', 'Umami'], { explanation: 'Chemical Senses, slide 6.' }),
  mcq('q9-03', 'taste-modalities', 'Quinine tastes…', 'Bitter', ['Sweet', 'Salty', 'Sour'], { explanation: 'Chemical Senses, slide 4.' }),
  match('q9-04', 'taste-buds', 'Match each taste cell type to its role.', [
    ['Type I', 'Glial-like; salty'],
    ['Type II', 'Sweet, bitter and umami via GPCRs'],
    ['Type III', 'Sour; synapses with afferents'],
    ['Type IV', 'Precursor cells'],
  ], { explanation: 'Chemical Senses, slides 8–9.' }),
  mcq('q9-05', 'taste-buds', 'What do type II taste cells release onto nerves and type III cells?', 'ATP', ['Glutamate', 'ACh', 'Serotonin'], { explanation: 'Chemical Senses, slide 9.' }),
  mcq('q9-06', 'taste-buds', 'Circumvallate papillae are found…', 'In the back third of the tongue', ['In the front two-thirds', 'On the palate', 'Only on the epiglottis'], { explanation: 'Chemical Senses, slide 11.' }),
  tf({ id: 'q9-07', conceptId: 'taste-buds', statement: 'Each area of the tongue senses only one taste.', answer: false, explanation: 'Chemical Senses, slide 12: there is no tongue map.', skill: 'misconception' }),
  mcq('q9-08', 'taste-transduction', 'Sweet receptors are made of which subunits?', 'T1R2 and T1R3', ['T1R1 and T1R3', 'T2R', 'PKD2L1'], { explanation: 'Chemical Senses, slide 19.' }),
  mcq('q9-09', 'taste-transduction', 'Umami receptors are made of…', 'T1R1 and T1R3', ['T1R2 and T1R3', 'T2R', 'ENaC'], { explanation: 'Chemical Senses, slide 21.' }),
  mcq('q9-10', 'taste-transduction', 'The G protein of taste cells is called…', 'Gustducin', ['Transducin', 'Golf', 'Gq only'], { explanation: 'Chemical Senses, slide 19.' }),
  mcq('q9-11', 'taste-transduction', 'Which channel opens downstream of PLC in sweet, bitter and umami transduction?', 'TRPM5', ['PKD2L1', 'CNG channel', 'MET channel'], { explanation: 'Chemical Senses, slides 19–20.' }),
  mcq('q9-12', 'taste-pathway', 'In which nucleus do all taste fibres synapse?', 'The nucleus of the solitary tract', ['The cochlear nucleus', 'The Edinger–Westphal nucleus', 'The lateral geniculate nucleus'], { explanation: 'Chemical Senses, slide 24.' }),
  multi('q9-13', 'taste-pathway', 'Which cranial nerves carry taste? Select all that apply.', ['VII', 'IX', 'X'], ['I', 'V'], { explanation: 'Chemical Senses, slide 24.' }),
  fill('q9-14', 'taste-buds', 'Taste cells live about ____ hours.', ['250', '250 ± 50', '250±50'], { explanation: 'Chemical Senses, slide 10.' }),
];

const lesson10: Q[] = [
  mcq('q10-01', 'olfactory-epithelium', 'How many primary odours do humans have?', 'Ten', ['Five', 'Three', 'Hundreds'], { explanation: 'Chemical Senses, slide 26.' }),
  mcq('q10-02', 'olfactory-epithelium', 'About how large is the olfactory epithelium?', 'About 4.8 cm²', ['About 48 cm²', 'About 4.8 mm²', 'About 1 m²'], { explanation: 'Chemical Senses, slide 27.' }),
  multi('q10-03', 'olfactory-epithelium', 'Which cells make up the olfactory epithelium? Select all that apply.', ['Olfactory sensory neurons', 'Supporting (sustentacular) cells', 'Basal cells'], ['Mitral cells'], { explanation: 'Chemical Senses, slide 28.' }),
  mcq('q10-04', 'olfactory-epithelium', 'How do airborne chemicals reach the receptors?', 'They dissolve in the mucus covering the cilia', ['They pass through the cribriform plate', 'They enter the blood', 'They bind the olfactory bulb directly'], { explanation: 'Chemical Senses, slides 28–29.' }),
  mcq('q10-05', 'olfactory-transduction', 'Odorants typically contain how many carbon atoms?', 'From 3–4 to 18–20', ['Over 100', 'Exactly 6', '1 or 2'], { explanation: 'Chemical Senses, slide 29.' }),
  mcq('q10-06', 'olfactory-transduction', 'Which second messenger mediates olfaction?', 'cAMP', ['cGMP', 'IP₃ only', 'Nitric oxide'], { explanation: 'Chemical Senses, slides 29–30.' }),
  mcq('q10-07', 'olfactory-transduction', 'Which ions enter through the cAMP-opened channel?', 'Ca²⁺ and Na⁺', ['K⁺ and Cl⁻', 'H⁺', 'Mg²⁺'], { explanation: 'Chemical Senses, slide 30.' }),
  mcq('q10-08', 'olfactory-transduction', 'The firing rate of an olfactory neuron depends on…', 'The concentration of the odorant', ['The time of day', 'The colour of the odorant', 'The breathing rate only'], { explanation: 'Chemical Senses, slides 30–31.' }),
  mcq('q10-09', 'olfactory-pathway', 'Olfactory axons cross which bone?', 'The cribriform plate', ['The sella turcica', 'The petrous temporal bone', 'The nasal septum'], { explanation: 'Chemical Senses, slide 32.' }),
  mcq('q10-10', 'olfactory-pathway', 'In the olfactory bulb, receptor axons synapse on…', 'Mitral cells, forming glomeruli', ['Ganglion cells', 'Purkinje cells', 'Hair cells'], { explanation: 'Chemical Senses, slide 32.' }),
  multi('q10-11', 'olfactory-pathway', 'Which limbic structures receive olfactory input? Select all that apply.', ['Hypothalamus', 'Hippocampus', 'Amygdala'], ['Cerebellum'], { explanation: 'Chemical Senses, slide 33.' }),
  tf({ id: 'q10-12', conceptId: 'olfactory-pathway', statement: 'Each olfactory nerve projects to the olfactory bulb on the same side.', answer: true, explanation: 'Chemical Senses, slide 32.' }),
];

export const questions: Q[] = [...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5, ...lesson6, ...lesson7, ...lesson8, ...lesson9, ...lesson10];
