// Anatomy → Head and Neck (gross): each lesson's interactive layer.
import { ask, learn, match, mcq, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { hn, TOPIC_ID, type ConceptId } from '@/data/topics/head-and-neck/sources';

type Steps = InteractiveDraft<ConceptId>[];
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const interactive: Record<string, Steps> = {
  [L(1)]: [
    learn('Layers that guide infection', [
      'Deep cervical fascia has investing, pretracheal and prevertebral layers plus the carotid sheath. The pretracheal layer runs down into the superior mediastinum.',
    ], { sourceRefs: hn([12, 15]) }),
    ask(mcq('i1-01', 'cervical-fascia', 'Which three structures lie in the carotid sheath?', 'Carotid artery, internal jugular vein and vagus nerve', ['Carotid artery, external jugular vein and phrenic nerve', 'Vertebral artery, vagus and sympathetic trunk', 'Internal jugular vein, accessory nerve and thoracic duct'], { explanation: 'Slide 19.' })),
    ask(match('i1-02', 'anterior-triangle', 'Match each triangle to its contents:', [
      ['Carotid triangle', 'Carotid bifurcation'],
      ['Submandibular triangle', 'Submandibular gland'],
      ['Posterior triangle', 'External jugular vein and cervical plexus branches'],
    ], { explanation: 'Slides 26, 36, 45.' })),
    learn('Baroreceptors in the neck', [
      'The carotid sinus at the start of the internal carotid artery has a thin wall with baroreceptors supplied by IX and X, reporting blood pressure to the medulla.',
    ], { sourceRefs: hn([27, 28]) }),
    ask(mcq('i1-03', 'posterior-triangle-cervical-plexus', 'The cervical plexus is formed by the anterior rami of:', 'C1–C4', ['C5–T1', 'C3–C5 only', 'T1–T2'], { explanation: 'Slide 46.' })),
    recall('r1-01', 'posterior-triangle-cervical-plexus', 'Name the cutaneous branches of the cervical plexus with their roots.', [
      'Lesser occipital (C2).',
      'Great auricular (C2, C3).',
      'Transverse cervical (C2, C3).',
      'Supraclavicular nerves (C3, C4).',
    ], hn([52, 54])),
  ],

  [L(2)]: [
    ask(order('i2-01', 'scalp-layers', 'Order the layers of the scalp from outside in (SCALP):', ['Skin', 'Connective tissue', 'Aponeurosis', 'Loose areolar tissue', 'Pericranium'], { explanation: 'Slide 56.' })),
    learn('The dangerous layer', [
      'Loose areolar tissue lets the outer three layers slide. Its valveless emissary veins link the scalp veins to the dural venous sinuses, so infection can spread inward.',
    ], { sourceRefs: hn([61, 62]) }),
    ask(mcq('i2-02', 'scalp-layers', 'Why do scalp lacerations bleed so much?', 'The connective tissue layer holds the vessel walls open so they cannot retract', ['The scalp has no veins, so all bleeding is arterial and fast', 'The pericranium is very vascular and bleeds into the wound', 'Scalp arteries lack muscle in their walls, so they cannot constrict'], { explanation: 'Slide 57.', skill: 'cause-effect' })),
    learn('Facial muscles', [
      'All muscles of facial expression develop from the 2nd pharyngeal arch and are supplied by the facial nerve. They are grouped around the eyes, nose and mouth.',
    ], { sourceRefs: hn([72, 74]) }),
    ask(match('i2-03', 'scalp-layers', 'Match each birth swelling to its layer:', [
      ['Caput succedaneum', 'Connective tissue layer'],
      ['Cephalhaematoma', 'Beneath the pericranium'],
    ], { explanation: 'Slides 57, 63.' })),
    recall('r2-01', 'scalp-supply', 'Name the four sensory nerves of the scalp in front of the auricle.', [
      'Supratrochlear and supraorbital (ophthalmic).',
      'Zygomaticotemporal (maxillary).',
      'Auriculotemporal (mandibular).',
    ], hn([66, 67])),
  ],

  [L(3)]: [
    ask(mcq('i3-01', 'orbit-walls-openings', 'Which structures pass through the optic canal?', 'Optic nerve and ophthalmic artery', ['Oculomotor nerve and ophthalmic vein', 'Maxillary nerve and infraorbital vessels', 'Nasolacrimal duct'], { explanation: 'Slide 96.' })),
    learn('An end artery in the eye', [
      'The central artery of the retina runs in the optic nerve and has no anastomoses — its occlusion causes blindness.',
    ], { sourceRefs: hn([102, 107]) }),
    ask(match('i3-02', 'extraocular-muscles', 'Match each extraocular muscle to its nerve:', [
      ['Lateral rectus', 'Abducent (VI)'],
      ['Superior oblique', 'Trochlear (IV)'],
      ['Medial rectus', 'Oculomotor (III)'],
    ], { explanation: 'Slide 124 (LR6 SO4 AO3).' })),
    learn('Following a tear', [
      'Lacrimal gland → superior fornix → lacrimal lake → puncta → canaliculi → lacrimal sac → nasolacrimal duct → inferior meatus.',
    ], { sourceRefs: hn([135]) }),
    ask(mcq('i3-03', 'lacrimal-apparatus-eye', 'Crocodile tears follow a facial nerve lesion because:', 'Regenerating salivary parasympathetic fibres grow to the lacrimal gland', ['The lacrimal duct is blocked, so tears overflow at meals', 'The trigeminal nerve is damaged and irritates the gland', 'The eyelid cannot close, so the eye waters constantly'], { explanation: 'Slide 137.', skill: 'cause-effect' })),
    recall('r3-01', 'extraocular-muscles', 'Which structures pass through the superior orbital fissure outside the common tendinous ring?', [
      'Trochlear nerve.',
      'Frontal and lacrimal nerves.',
      'Superior ophthalmic vein.',
    ], hn([130])),
  ],

  [L(4)]: [
    learn('A crossroads below the orbit', [
      'The pterygopalatine fossa connects to the middle cranial fossa, orbit, nose, palate, pharynx and infratemporal fossa.',
    ], { sourceRefs: hn([143, 147, 148]) }),
    ask(match('i4-01', 'ppf-boundaries', 'Match each opening of the pterygopalatine fossa to where it leads:', [
      ['Foramen rotundum', 'Middle cranial fossa'],
      ['Sphenopalatine foramen', 'Nasal cavity'],
      ['Pterygomaxillary fissure', 'Infratemporal fossa'],
      ['Greater palatine canal', 'Palate'],
    ], { explanation: 'Slides 148–157.' })),
    ask(mcq('i4-02', 'ppf-contents', 'Preganglionic parasympathetic fibres reach the pterygopalatine ganglion through the:', 'Greater petrosal nerve and nerve of the pterygoid canal', ['Lesser petrosal nerve and otic ganglion', 'Chorda tympani and lingual nerve', 'Deep petrosal nerve alone'], { explanation: 'Slide 164.' })),
    learn('Why surgeons go here', [
      'Maxillary artery ligation for severe epistaxis, and Vidian neurectomy for vasomotor rhinorrhoea and crocodile tears.',
    ], { sourceRefs: hn([178]) }),
    ask(mcq('i4-03', 'ppf-contents', 'Which nerve supplies the soft palate and palatine tonsil?', 'Lesser palatine nerve', ['Greater palatine nerve', 'Nasopalatine nerve', 'Infraorbital nerve'], { explanation: 'Slide 172.' })),
    recall('r4-01', 'ppf-contents', 'List the branches of the maxillary nerve in the pterygopalatine fossa.', [
      'Meningeal branch.',
      'Pterygopalatine (communicating) nerves to the ganglion.',
      'Posterior superior alveolar nerves.',
      'Zygomatic nerve.',
      'Infraorbital nerve.',
    ], hn([159, 162])),
  ],

  [L(5)]: [
    ask(match('i5-01', 'nasal-walls', 'Match each space to what drains into it:', [
      ['Sphenoethmoidal recess', 'Sphenoid sinus'],
      ['Superior meatus', 'Posterior ethmoidal cells'],
      ['Inferior meatus', 'Nasolacrimal duct'],
    ], { explanation: 'Slide 204.' })),
    learn('Where nosebleeds start', [
      'Kiesselbach’s area on the anterior septum is where the sphenopalatine, greater palatine, anterior ethmoidal and superior labial arteries meet.',
    ], { sourceRefs: hn([215, 216]) }),
    ask(mcq('i5-02', 'paranasal-sinuses', 'Which sinus infection is most likely to cause orbital cellulitis?', 'Ethmoidal sinusitis', ['Maxillary sinusitis', 'Frontal sinusitis', 'Sphenoidal sinusitis'], { explanation: 'Slides 223, 227: through the lamina papyracea.', skill: 'application' })),
    learn('Tooth or sinus?', [
      'Only thin bone separates the maxillary sinus from the roots of the upper teeth, so maxillary sinusitis can feel like toothache and dental infection can spread to the sinus.',
    ], { sourceRefs: hn([235, 236]) }),
    ask(mcq('i5-03', 'paranasal-sinuses', 'Which gland lies directly above the sphenoidal sinus?', 'Pituitary gland', ['Pineal gland (epiphysis)', 'Lacrimal gland', 'Parotid gland'], { explanation: 'Slide 237.' })),
    recall('r5-01', 'nasal-walls', 'Name the bones forming the nasal septum.', [
      'Perpendicular plate of the ethmoid.',
      'Vomer.',
      'Septal cartilage (with small contributions from palatine, maxillary, frontal, sphenoid and nasal bones).',
    ], hn([199])),
  ],

  [L(6)]: [
    ask(mcq('i6-01', 'external-ear', 'Where is the cone of light seen on a normal eardrum?', 'Anterior–inferior quadrant', ['Posterior–superior quadrant', 'Pars flaccida', 'At the umbo only'], { explanation: 'Slide 269.' })),
    learn('Two tiny muscles', [
      'Stapedius (facial nerve) damps the stapes; tensor tympani (V3) tightens the eardrum. Both protect the inner ear from loud noise.',
    ], { sourceRefs: hn([297, 299, 301]) }),
    ask(order('i6-02', 'middle-ear', 'Order the ossicles from the eardrum to the oval window:', ['Malleus', 'Incus', 'Stapes'], { explanation: 'Slides 302–312.' })),
    learn('Linear vs rotational', [
      'Maculae of the utricle and saccule sense linear acceleration; the ampullae of the semicircular ducts sense rotation. The organ of Corti in the cochlear duct senses sound.',
    ], { sourceRefs: hn([332, 335, 336]) }),
    ask(match('i6-03', 'inner-ear-development', 'Match each embryonic structure to its ear derivative:', [
      ['1st pharyngeal groove', 'External acoustic meatus'],
      ['1st pharyngeal pouch', 'Auditory tube and middle ear'],
      ['2nd pharyngeal arch', 'Stapes'],
      ['Otic placode', 'Membranous labyrinth'],
    ], { explanation: 'Slides 341–346.' })),
    recall('r6-01', 'middle-ear', 'Give the six walls of the middle ear.', [
      'Roof: tegmen tympani. Floor: jugular fossa.',
      'Anterior: carotid canal (and auditory tube). Posterior: aditus to the mastoid antrum.',
      'Lateral: tympanic membrane. Medial: promontory, oval and round windows, facial canal.',
    ], hn([287, 289])),
  ],

  [L(7)]: [
    ask(mcq('i7-01', 'tongue', 'Which tongue muscle is NOT supplied by the hypoglossal nerve?', 'Palatoglossus', ['Genioglossus', 'Hyoglossus (from the hyoid)', 'Styloglossus'], { explanation: 'Slide 370: palatoglossus is supplied by the vagus.' })),
    learn('Why the submandibular gland gets stones', [
      'Its duct is longer and wider, saliva flows upward against gravity, and the secretion is more mucous and alkaline — so 80% of salivary stones form here.',
    ], { sourceRefs: hn([380, 381]) }),
    ask(match('i7-02', 'tongue', 'Match each extrinsic muscle to its main action:', [
      ['Genioglossus', 'Protrudes the tongue'],
      ['Hyoglossus', 'Depresses and retracts'],
      ['Styloglossus', 'Elevates and retracts'],
    ], { explanation: 'Slides 373–374.' })),
    learn('Two secretomotor routes', [
      'Submandibular and sublingual: VII → chorda tympani → lingual nerve → submandibular ganglion. Parotid: IX → tympanic plexus → lesser petrosal → otic ganglion → auriculotemporal nerve.',
    ], { sourceRefs: hn([382, 383, 387, 388, 389]) }),
    ask(mcq('i7-03', 'salivary-innervation', 'The parasympathetic supply of the parotid relays in the:', 'Otic ganglion', ['Submandibular ganglion', 'Pterygopalatine ganglion', 'Ciliary ganglion'], { explanation: 'Slide 388.' })),
    recall('r7-01', 'salivary-innervation', 'Trace the secretomotor pathway to the submandibular gland.', [
      'Superior salivatory nucleus → facial nerve.',
      'Chorda tympani through the tympanic cavity and petrotympanic fissure.',
      'Joins the lingual nerve → submandibular ganglion.',
      'Postganglionic fibres to the submandibular and sublingual glands.',
    ], hn([382, 383])),
  ],

  [L(8)]: [
    learn('Special components', [
      'Branchiomotor fibres (V, VII, IX, X, XI) supply pharyngeal arch muscles; taste travels in VII, IX and X; hearing and balance in VIII.',
    ], { sourceRefs: hn([394, 395]) }),
    ask(mcq('i8-01', 'olfactory-optic', 'At the optic chiasma, which fibres cross?', 'Fibres from the nasal halves of each retina', ['Fibres from the temporal halves of each retina', 'All fibres from both retinae', 'No fibres at all'], { explanation: 'Slide 399.' })),
    ask(mcq('i8-02', 'eye-movement-nerves', 'Which cranial nerve emerges from the dorsal surface of the brainstem?', 'Trochlear (IV)', ['Oculomotor (III)', 'Abducent (VI)', 'Trigeminal (V)'], { explanation: 'Slide 404.' })),
    learn('Three divisions, three exits', [
      'V1 through the superior orbital fissure, V2 through the foramen rotundum, V3 through the foramen ovale. Only V3 carries motor fibres.',
    ], { sourceRefs: hn([409, 410, 411]) }),
    ask(match('i8-03', 'trigeminal-nerve', 'Match each trigeminal division to its exit from the skull:', [
      ['Ophthalmic (V1)', 'Superior orbital fissure'],
      ['Maxillary (V2)', 'Foramen rotundum'],
      ['Mandibular (V3)', 'Foramen ovale'],
    ], { explanation: 'Slides 409–411.' })),
    recall('r8-01', 'eye-movement-nerves', 'Give three clinical causes of abducent nerve damage from the lecture.', [
      'Raised intracranial pressure stretching the nerve.',
      'Infected air cells at the apex of the petrous bone.',
      'Cavernous sinus thrombosis (with III and IV).',
    ], hn([405])),
  ],

  [L(9)]: [
    ask(mcq('i9-01', 'facial-nerve', 'Through which foramen does the facial nerve leave the skull?', 'Stylomastoid foramen', ['Jugular foramen', 'Foramen ovale', 'Foramen rotundum (sphenoid)'], { explanation: 'Slide 413.' })),
    learn('Bell’s palsy signs', [
      'Cannot close the eye, whistle, wrinkle the forehead or show the teeth; reduced tears and saliva; loss of taste on the anterior tongue; hyperacusis.',
    ], { sourceRefs: hn([415]) }),
    ask(match('i9-02', 'vagus-accessory-hypoglossal', 'Match each nerve to a muscle it supplies:', [
      ['External laryngeal', 'Cricothyroid'],
      ['Recurrent laryngeal', 'Posterior cricoarytenoid'],
      ['Accessory (spinal root)', 'Trapezius'],
      ['Glossopharyngeal', 'Stylopharyngeus'],
    ], { explanation: 'Slides 416–420.' })),
    learn('Where the recurrent laryngeals turn', [
      'Right: under the subclavian artery. Left: under the arch of the aorta. Both climb between trachea and oesophagus next to the inferior thyroid artery.',
    ], { sourceRefs: hn([419]) }),
    ask(mcq('i9-03', 'vagus-accessory-hypoglossal', 'During thyroidectomy, which nerve is at risk near the inferior thyroid artery?', 'Recurrent laryngeal nerve', ['Hypoglossal nerve', 'Accessory nerve', 'Phrenic nerve'], { explanation: 'Slide 419.', skill: 'application' })),
    recall('r9-01', 'cn-viii-ix', 'List the branches of the glossopharyngeal nerve.', [
      'Tympanic nerve (middle ear; lesser petrosal to the otic ganglion).',
      'Carotid nerve (carotid sinus and body).',
      'Pharyngeal branches.',
      'Muscular branch to stylopharyngeus.',
      'Tonsillar branches.',
    ], hn([416])),
  ],

  [L(10)]: [
    ask(mcq('i10-01', 'larynx-functions-cartilages', 'Which laryngeal cartilage forms a complete ring?', 'Cricoid', ['Thyroid', 'Epiglottis', 'Arytenoid'], { explanation: 'Slide 431.' })),
    learn('Folds and spaces', [
      'Vestibular (false) folds above, vocal (true) folds below; between them the ventricle. The rima glottidis between the vocal folds is the narrowest part.',
    ], { sourceRefs: hn([454, 455, 456]) }),
    ask(mcq('i10-02', 'larynx-ligaments-cavity', 'Where is an emergency airway (cricothyrotomy) made?', 'Through the cricothyroid membrane', ['Through the thyrohyoid membrane', 'Through the first tracheal ring', 'Through the base of the epiglottis'], { explanation: 'Slide 445.', skill: 'application' })),
    learn('Sensory watershed', [
      'Above the vocal folds: internal laryngeal nerve. Below: recurrent laryngeal nerve.',
    ], { sourceRefs: hn([470, 471]) }),
    ask(match('i10-03', 'larynx-muscles-supply', 'Match each artery to the part of the larynx it supplies:', [
      ['Superior laryngeal (superior thyroid)', 'Upper half'],
      ['Inferior laryngeal (inferior thyroid)', 'Lower half'],
    ], { explanation: 'Slide 465.' })),
    recall('r10-01', 'larynx-functions-cartilages', 'List the functions of the larynx.', [
      'Sphincter protecting the airway during swallowing.',
      'Closing the rima glottidis for the Valsalva manoeuvre.',
      'Regulating airflow for phonation.',
      'A cartilage framework for ligaments and muscles.',
    ], hn([421, 422])),
  ],
};
