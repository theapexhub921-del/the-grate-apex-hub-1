// Anatomy → Head and Neck (gross): the ten lessons (reading layer).
import type { LessonDraft } from '@/data/topics/build';
import { interactive } from '@/data/topics/head-and-neck/interactive';
import { GRAYS, hn, TOPIC_ID, type ConceptId } from '@/data/topics/head-and-neck/sources';

type Draft = LessonDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

// ─── Lesson 1: The Neck — Fascia and Triangles ───────────────────────

const lesson1: Draft = {
  id: L(1),
  title: 'The Neck: Fascia and Triangles',
  description: 'What the head and neck do, the plan of the neck, its skin and fascial layers, the carotid sheath, and the anterior and posterior triangles with the cervical plexus.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: hn([2, 6, 7, 8, 10, 12, 15, 18, 19, 21, 23, 24, 26, 27, 28, 32, 36, 38, 41, 42, 45, 46, 50, 51, 54]),
  objectives: [
    'List the functions of the head and neck and describe the general plan of the neck.',
    'Describe the layers of cervical fascia, the carotid sheath and the retropharyngeal space.',
    'Give the boundaries and contents of the carotid, submandibular and submental triangles.',
    'Describe the posterior triangle and the cervical plexus and its branches.',
  ],
  chunks: [
    {
      title: 'The Head and Neck in Outline',
      kind: 'overview',
      paragraphs: [
        'The head and neck contain and protect the brain; carry the organs of sight, hearing and smell; chew and swallow food; conduct air toward the lungs; carry the organs of speech; produce facial expression (individual identity); and carry the vessels and nerves of the head.',
        'The neck lies between the lower margin of the mandible above and the suprasternal notch and upper border of the clavicle below, strengthened by the cervical vertebral column. Behind the vertebrae lies a mass of extensor muscles; in front, a smaller group of flexors. The middle carries the airway (larynx, trachea) and gut (pharynx, oesophagus); at the sides lie the carotid arteries, internal jugular veins, vagus nerves and deep cervical lymph nodes.',
        'The natural cleavage lines of the neck skin run almost horizontally. An incision along them heals as a narrow scar; one crossing them heals as a wide scar.',
      ],
      terms: [
        { term: 'Cleavage lines', meaning: 'Natural skin tension lines; horizontal in the neck.' },
      ],
      keyPoints: [
        'Neck incisions are made horizontally for a neat scar.',
      ],
      sourceRefs: hn([2, 6, 7, 8, 10]),
    },
    {
      title: 'Cervical Fascia and the Carotid Sheath',
      kind: 'structure',
      paragraphs: [
        'Cervical fascia is formed by loose connective tissue pressed into layers that surround the structures of the neck — and can act as routes for the spread of infection. The superficial fascia is a single layer with platysma deep to it.',
        'The deep fascia has four parts. The investing layer encloses sternocleidomastoid and trapezius. The pretracheal fascia lies deep to the infrahyoid (strap) muscles — sternohyoid, sternothyroid, thyrohyoid and omohyoid — and extends down into the superior mediastinum to the arch of the aorta, so an oesophageal perforation can cause mediastinitis. The prevertebral fascia encloses the deep muscles (longus capitis, rectus capitis lateralis, longus colli).',
        'The carotid sheath contains the carotid artery, internal jugular vein and vagus nerve. It has a cleavage behind with the prevertebral fascia and medially with the pretracheal layer, and stabilises its contents during neck movement.',
        'The retropharyngeal space is clinically important because infections from the teeth, tongue, tonsils, submandibular gland and parotid gland can spread into it.',
      ],
      table: {
        columns: ['Deep fascia layer', 'Encloses / features'],
        rows: [
          ['Investing', 'Sternocleidomastoid and trapezius'],
          ['Pretracheal', 'Deep to strap muscles; extends into the superior mediastinum'],
          ['Prevertebral', 'Longus capitis, rectus capitis lateralis, longus colli'],
          ['Carotid sheath', 'Carotid artery, internal jugular vein, vagus nerve'],
        ],
      },
      terms: [
        { term: 'Carotid sheath', meaning: 'Fascial tube containing the carotid artery, internal jugular vein and vagus nerve.' },
        { term: 'Pretracheal fascia', meaning: 'Deep fascia behind the strap muscles, continuous into the superior mediastinum.' },
        { term: 'Retropharyngeal space', meaning: 'Space behind the pharynx into which dental and tonsillar infections can spread.' },
      ],
      keyPoints: [
        'Pretracheal fascia → superior mediastinum: oesophageal perforation can cause mediastinitis.',
      ],
      sourceRefs: hn([12, 13, 15, 18, 19]),
    },
    {
      title: 'The Anterior Triangle',
      kind: 'structure',
      paragraphs: [
        'Sternocleidomastoid divides each side of the neck into an anterior and a posterior triangle. The anterior triangle is subdivided into the carotid, submandibular, submental and muscular triangles.',
        'The carotid triangle is bounded by the superior belly of omohyoid, the posterior belly of digastric (with stylohyoid) and sternocleidomastoid. It contains the carotid bifurcation (C4), the internal jugular vein, the vagus nerve and the hypoglossal nerve. The internal carotid artery arises at the bifurcation and continues up in the carotid sheath; its start is slightly dilated as the carotid sinus. Here the wall is thin and contains baroreceptors supplied by the glossopharyngeal and vagus nerves, which signal blood pressure to the medullary centres.',
        'The submandibular triangle is bounded by the anterior and posterior bellies of digastric and the lower border of the mandible. It contains the submandibular gland and lymph nodes, the facial artery (at the back of the gland) and the facial vein (across its surface); its floor is mylohyoid (with hyoglossus deeper). Related structures include the hypoglossal and lingual nerves, the lingual vessels and the submandibular ganglion.',
        'The submental triangle is bounded by the midline of the neck, the anterior belly of digastric and the hyoid bone below.',
      ],
      table: {
        columns: ['Triangle', 'Boundaries', 'Key contents'],
        rows: [
          ['Carotid', 'Superior belly of omohyoid, posterior belly of digastric, sternocleidomastoid', 'Carotid bifurcation (C4), IJV, vagus, hypoglossal nerve'],
          ['Submandibular', 'Both bellies of digastric, lower border of mandible', 'Submandibular gland and nodes, facial artery and vein'],
          ['Submental', 'Midline, anterior belly of digastric, hyoid', 'Submental nodes'],
        ],
      },
      terms: [
        { term: 'Carotid sinus', meaning: 'Dilated start of the internal carotid artery containing baroreceptors.' },
        { term: 'Baroreceptors', meaning: 'Pressure receptors supplied by the glossopharyngeal and vagus nerves.' },
      ],
      keyPoints: [
        'Carotid bifurcation at C4, in the carotid triangle.',
        'Carotid sinus baroreceptors → CN IX and X → medulla.',
      ],
      notes: [{ kind: 'textbook', text: 'Submental triangle contents (submental lymph nodes and small veins) are from Gray’s; the slide gives only its boundaries.' }],
      sourceRefs: [...hn([21, 22, 23, 24, 26, 27, 28, 32, 36, 37, 38]), ...GRAYS],
    },
    {
      title: 'The Posterior Triangle and the Cervical Plexus',
      kind: 'structure',
      paragraphs: [
        'The posterior triangle lies between sternocleidomastoid and trapezius. Its apex is behind the skull at the superior nuchal line, its base the middle third of the clavicle. The roof is the investing layer of deep fascia. The floor is the prevertebral fascia over splenius capitis, levator scapulae and the scalenes, with the trunks of the brachial plexus and branches of the cervical plexus. Between roof and floor lie lymph nodes, the inferior belly of omohyoid (crossing the lower part), the external jugular vein and nerves of the cervical plexus.',
        'The cervical plexus is formed by loops between the anterior rami of C1–C4, in series with the brachial plexus. It lies on scalenus medius behind the prevertebral fascia, covered by the upper sternocleidomastoid — it does not lie in the posterior triangle itself. Its cutaneous branches emerge around the middle of the posterior border of sternocleidomastoid.',
        'Cutaneous branches: lesser occipital (C2), great auricular (C2, 3), transverse cervical (C2, 3) and supraclavicular nerves (C3, 4). Muscular branches: C2–3 to sternocleidomastoid and C3–4 to trapezius; the ansa cervicalis; and the phrenic nerve (C4). The dorsal rami give the greater occipital, suboccipital and third occipital nerves.',
      ],
      table: {
        columns: ['Branch', 'Roots'],
        rows: [
          ['Lesser occipital', 'C2'],
          ['Great auricular', 'C2, C3 (mostly C2)'],
          ['Transverse cervical', 'C2, C3'],
          ['Supraclavicular', 'C3, C4 (mostly C4)'],
          ['Phrenic', 'C4 (with C3, C5)'],
        ],
      },
      terms: [
        { term: 'Cervical plexus', meaning: 'Plexus of the anterior rami of C1–C4 under sternocleidomastoid.' },
        { term: 'Ansa cervicalis', meaning: 'Loop of the cervical plexus supplying the infrahyoid muscles.' },
      ],
      keyPoints: [
        'Posterior triangle: sternocleidomastoid, trapezius, middle third of clavicle.',
        'Cutaneous nerves emerge at the midpoint of the posterior border of sternocleidomastoid.',
      ],
      sourceRefs: hn([41, 42, 45, 46, 50, 51, 52, 53, 54]),
    },
  ],
  summary: [
    'The neck is divided by sternocleidomastoid into anterior and posterior triangles.',
    'Deep cervical fascia: investing, pretracheal, prevertebral and the carotid sheath.',
    'The carotid triangle holds the carotid bifurcation (C4) and carotid sinus baroreceptors.',
    'The posterior triangle lies between sternocleidomastoid and trapezius above the middle third of the clavicle.',
    'The cervical plexus (C1–C4) gives the lesser occipital, great auricular, transverse cervical, supraclavicular and phrenic nerves.',
  ],
  highYield: [
    'Carotid sheath: carotid artery, IJV, vagus.',
    'Pretracheal fascia continues into the superior mediastinum.',
    'Phrenic nerve: C4 from the cervical plexus.',
  ],
  confusions: [
    {
      confusion: 'Thinking the cervical plexus lies in the posterior triangle.',
      clarification: 'It lies under sternocleidomastoid on scalenus medius; only its branches emerge into the posterior triangle (slide 50).',
    },
  ],
};

// ─── Lesson 2: Scalp and Face ────────────────────────────────────────

const lesson2: Draft = {
  id: L(2),
  title: 'The Scalp and Face',
  description: 'The five layers of the scalp and why each matters clinically, the nerves and arteries of the scalp, and the face with its muscles of facial expression around the eyes, nose and mouth.',
  xp: 25,
  estimatedMinutes: 13,
  sourceRefs: hn([56, 57, 60, 61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 72, 74, 75, 76, 78, 80, 81, 84, 86]),
  objectives: [
    'Name the five layers of the scalp and explain the clinical importance of each.',
    'Distinguish caput succedaneum from cephalhaematoma.',
    'List the nerves and arteries of the scalp.',
    'Describe the features of facial skin and the development and nerve supply of the facial muscles.',
    'Describe orbicularis oculi and the muscles of the nostrils.',
  ],
  chunks: [
    {
      title: 'The Five Layers of the Scalp',
      kind: 'structure',
      paragraphs: [
        'The scalp has five layers — SCALP: Skin, Connective tissue, Aponeurosis (epicranial), Loose areolar tissue and Pericranium. The first three are bound together and move as one unit, and must be sutured together in scalp injuries.',
        'Skin: the thickest in the body, with many hair follicles and sebaceous glands. Connective tissue: binds the skin to the aponeurosis, forming tight compartments containing vessels (from the external and internal carotids) and nerves (V1, V2 and the cervical plexus). Because vessel walls are held open by this tissue, lacerations bleed profusely; folliculitis here is painful. Bleeding confined to this layer at birth is caput succedaneum.',
        'Aponeurosis (galea): a tendinous sheet joining the frontal and occipital bellies of occipitofrontalis, acting as the deep fascia of the scalp. Sagittal incisions gape less but bleed more (the vessels run coronally); coronal incisions gape more (pull of occipitofrontalis) but bleed less.',
        'Loose areolar tissue: the “dangerous layer” (subgaleal space) between the aponeurosis and pericranium. It lets the outer three layers move, is the plane of separation in scalping injuries, and blood here spreads widely and can track to the eyelids (black eye). Its valveless emissary veins connect the scalp veins with the diploic veins and the intracranial venous sinuses, so infection can spread inward.',
        'Pericranium: the periosteum of the outer skull, continuous with the endosteum at the sutures and firmly attached there. Bleeding under it (cephalhaematoma, from birth trauma) is limited by the sutures and takes the shape of one bone, e.g. the parietal.',
      ],
      table: {
        columns: ['Layer', 'Clinical point'],
        rows: [
          ['Skin', 'Thickest skin, many sebaceous glands'],
          ['Connective tissue', 'Vessels held open → profuse bleeding; caput succedaneum'],
          ['Aponeurosis', 'Coronal wounds gape; suture with skin and CT'],
          ['Loose areolar tissue', 'Dangerous layer: emissary veins, scalping plane, black eye'],
          ['Pericranium', 'Cephalhaematoma limited by sutures'],
        ],
      },
      terms: [
        { term: 'Dangerous layer', meaning: 'Loose areolar tissue of the scalp containing valveless emissary veins.' },
        { term: 'Caput succedaneum', meaning: 'Birth swelling from bleeding in the connective tissue layer; crosses sutures.' },
        { term: 'Cephalhaematoma', meaning: 'Bleeding under the pericranium, limited to one bone by the sutures.' },
        { term: 'Emissary veins', meaning: 'Valveless veins linking scalp veins to intracranial venous sinuses.' },
      ],
      keyPoints: [
        'Infection in the loose areolar layer can reach the dural venous sinuses.',
      ],
      sourceRefs: hn([56, 57, 58, 60, 61, 62, 63, 64]),
    },
    {
      title: 'Nerves and Arteries of the Scalp',
      kind: 'structure',
      paragraphs: [
        'Ten nerves supply the scalp — five in front of and five behind the auricle. In front: four sensory branches of the trigeminal (supratrochlear, supraorbital, zygomaticotemporal, auriculotemporal) and one motor (temporal branch of the facial nerve). Behind: four sensory branches from the cervical nerves (great auricular C2, lesser occipital C2, greater occipital C2 dorsal ramus, third occipital C3 dorsal ramus) and one motor (posterior auricular branch of the facial nerve, to the occipital belly).',
        'Arteries: the supratrochlear and supraorbital (from the ophthalmic, internal carotid) and the superficial temporal, posterior auricular and occipital (from the external carotid). Veins follow the arteries.',
      ],
      table: {
        columns: ['Region', 'Sensory nerves', 'Motor nerve'],
        rows: [
          ['In front of auricle', 'Supratrochlear, supraorbital, zygomaticotemporal, auriculotemporal (CN V)', 'Temporal branch of facial'],
          ['Behind auricle', 'Great auricular, lesser occipital, greater occipital, third occipital (C2–C3)', 'Posterior auricular branch of facial'],
        ],
      },
      terms: [
        { term: 'Greater occipital nerve', meaning: 'Dorsal ramus of C2 supplying the back of the scalp.' },
      ],
      keyPoints: [
        'Scalp is supplied by both internal (supratrochlear, supraorbital) and external carotid branches.',
      ],
      sourceRefs: hn([66, 67, 68]),
    },
    {
      title: 'The Face and its Muscles',
      kind: 'structure',
      paragraphs: [
        'The face is the front of the head from the ears and from the chin to the hairline. Its skin has many sweat and sebaceous glands and varies in thickness, being very thin over the eyelids. The facial muscles are attached to the dermis, and there is no deep fascia on the face. Senile wrinkles lie at right angles to the pull of the underlying muscles: horizontal on the brow, crow’s feet at the lateral canthus, and vertical on the lips.',
        'The muscles of facial expression develop from the mesoderm of the 2nd pharyngeal arch and are supplied by the nerve of that arch, the facial nerve (CN VII). They are grouped around the orifices — the orbit (eyelids), nose (nostrils) and mouth (lips) — and their real purpose is to control these openings; facial expression is a side effect.',
        'Orbicularis oculi has a palpebral part confined to the lids (from the medial palpebral ligament, arching across both lids in front of the tarsal plates to the lateral palpebral raphe), a deeper lacrimal part attached to the posterior lacrimal crest and lacrimal sac, and a larger orbital part arising from the frontal bone, anterior lacrimal crest and frontal process of the maxilla, encircling the orbital margin. It is supplied by the temporal and zygomatic branches of the facial nerve. The palpebral part closes the lids gently; orbital and palpebral parts together close them forcibly, burying the lashes. In normal closure the lateral part of the upper lid comes down first, spreading tears toward the nose. Levator palpebrae superioris opposes the upper palpebral fibres; occipitofrontalis opposes the orbital part.',
        'Nostrils: the transverse part of nasalis (compressor naris) is the sphincter, opposed by the alar part (dilator naris); levator labii superioris alaeque nasi and depressor septi (from the maxilla above the central incisor to the septum) help widen the nostril. All are supplied by buccal branches of the facial nerve.',
      ],
      terms: [
        { term: 'Orbicularis oculi', meaning: 'Sphincter of the eyelids with palpebral, lacrimal and orbital parts.' },
        { term: 'Nasalis', meaning: 'Muscle of the nostril: transverse part compresses, alar part dilates.' },
      ],
      keyPoints: [
        'All facial expression muscles: 2nd arch, facial nerve.',
        'No deep fascia on the face.',
      ],
      sourceRefs: hn([69, 70, 71, 72, 74, 75, 76, 77, 78, 79, 80, 81, 84, 86]),
    },
  ],
  summary: [
    'Scalp layers: skin, connective tissue, aponeurosis, loose areolar tissue, pericranium.',
    'The loose areolar (dangerous) layer carries valveless emissary veins to the venous sinuses.',
    'Caput succedaneum is in the connective tissue layer; cephalhaematoma is under the pericranium.',
    'Ten nerves supply the scalp — five in front of the ear, five behind.',
    'Facial muscles develop from the 2nd arch, are supplied by CN VII and control the orifices.',
  ],
  highYield: [
    'Scalp bleeds profusely because the connective tissue holds vessels open.',
    'Cephalhaematoma does not cross sutures.',
    'Orbicularis oculi: temporal and zygomatic branches of CN VII.',
  ],
  confusions: [
    {
      confusion: 'Mixing up caput succedaneum and cephalhaematoma.',
      clarification: 'Caput succedaneum is bleeding/oedema in the connective tissue layer; cephalhaematoma is under the pericranium and limited to one bone (slides 57, 63).',
    },
  ],
};

// ─── Lesson 3: The Orbit ─────────────────────────────────────────────

const lesson3: Draft = {
  id: L(3),
  title: 'The Orbit',
  description: 'The bony orbit with its fissures, canals and foramina, the ophthalmic artery and veins, the extraocular muscles and eye movements, the common tendinous ring, the lacrimal apparatus and the coats of the eye.',
  xp: 25,
  estimatedMinutes: 17,
  sourceRefs: hn([89, 90, 93, 94, 95, 96, 100, 101, 102, 107, 110, 118, 122, 124, 128, 129, 130, 132, 133, 135, 137, 139, 140]),
  objectives: [
    'Name the bones of the orbital margin and walls.',
    'List the openings of the orbit and what each transmits.',
    'Describe the branches of the ophthalmic artery and the ophthalmic veins.',
    'Name the extraocular muscles, their nerves and the structures passing through the common tendinous ring.',
    'Trace the flow of tears through the lacrimal apparatus and name the coats of the eye.',
  ],
  chunks: [
    {
      title: 'Bony Orbit and its Openings',
      kind: 'structure',
      paragraphs: [
        'The orbital margin is formed by the frontal, maxillary and zygomatic bones. The roof is the orbital part of the frontal bone and the lesser wing of the sphenoid; the lateral wall the zygomatic bone and greater wing of the sphenoid; the floor the maxilla, zygomatic and palatine bones; and the medial wall the ethmoid (orbital plate), frontal, lacrimal and sphenoid bones.',
        'The superior orbital fissure communicates with the middle cranial fossa, between the greater and lesser wings of the sphenoid, and transmits the oculomotor, trochlear, abducent and ophthalmic nerves and the ophthalmic veins.',
        'The inferior orbital fissure communicates with the infratemporal and pterygopalatine fossae, between the greater wing of the sphenoid above and the maxilla and palatine below; it is bridged by orbitalis (smooth muscle) and transmits the maxillary nerve with its zygomatic branch and the infraorbital vessels.',
        'The optic canal, formed by the two roots of the lesser wing in the back of the roof, connects with the middle cranial fossa and transmits the optic nerve and ophthalmic artery. Other openings: the infraorbital groove and foramen (infraorbital nerve and vessels), the supraorbital notch or foramen (supraorbital nerve and vessels), the anterior and posterior ethmoidal foramina (their nerves and vessels) and the nasolacrimal canal (maxilla, lacrimal bone and inferior concha), carrying the nasolacrimal duct to the inferior meatus.',
      ],
      table: {
        columns: ['Opening', 'Transmits'],
        rows: [
          ['Superior orbital fissure', 'CN III, IV, VI, ophthalmic nerve (V1), ophthalmic veins'],
          ['Inferior orbital fissure', 'Maxillary nerve and zygomatic branch, infraorbital vessels'],
          ['Optic canal', 'Optic nerve, ophthalmic artery'],
          ['Nasolacrimal canal', 'Nasolacrimal duct → inferior meatus'],
        ],
      },
      terms: [
        { term: 'Superior orbital fissure', meaning: 'Gap between the wings of the sphenoid transmitting CN III, IV, V1, VI and ophthalmic veins.' },
        { term: 'Optic canal', meaning: 'Canal in the lesser wing of the sphenoid for the optic nerve and ophthalmic artery.' },
      ],
      keyPoints: [
        'Ophthalmic ARTERY enters via the optic canal; ophthalmic VEINS leave via the superior orbital fissure.',
      ],
      sourceRefs: hn([89, 90, 93, 94, 95, 96, 97, 98, 99, 100]),
    },
    {
      title: 'Vessels of the Orbit',
      kind: 'structure',
      paragraphs: [
        'The ophthalmic artery is a branch of the internal carotid that enters the orbit through the optic canal and gives ocular and orbital branches.',
        'The central artery of the retina is the most important branch. It runs in the optic nerve and divides at the optic disc into superior and inferior branches, each dividing into temporal and nasal branches. It is an end artery, so its occlusion causes blindness.',
        'Other branches: long posterior ciliary arteries (pierce the sclera to the ciliary body and iris); short posterior ciliary arteries (to the choroid); the lacrimal artery (along the lateral rectus to the lacrimal gland, conjunctiva and lids, giving lateral palpebral arteries); medial palpebral arteries; muscular branches (giving anterior ciliary arteries to the iris); the supraorbital artery (forehead and scalp); the posterior and anterior ethmoidal arteries (ethmoidal air cells, frontal sinus, nasal cavity, external nose); the supratrochlear artery (forehead and scalp); and the dorsal nasal artery (side of the nose and lacrimal sac).',
        'The superior ophthalmic vein is formed by the supraorbital, supratrochlear and angular veins and drains into the cavernous sinus. The inferior ophthalmic vein begins in the orbital floor, communicates with the pterygoid venous plexus and often the infraorbital vein, and ends directly or indirectly in the cavernous sinus.',
      ],
      terms: [
        { term: 'Central artery of the retina', meaning: 'End-artery branch of the ophthalmic artery in the optic nerve; occlusion causes blindness.' },
        { term: 'Superior ophthalmic vein', meaning: 'Vein from the angular, supraorbital and supratrochlear veins to the cavernous sinus.' },
      ],
      keyPoints: [
        'Facial (angular) veins connect to the cavernous sinus through the ophthalmic veins — a route for infection.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the angular–ophthalmic connection is why infection from the “danger area” of the face can cause cavernous sinus thrombosis.' }],
      sourceRefs: [...hn([101, 102, 107, 108, 109, 110, 112, 113, 114, 117, 118, 122]), ...GRAYS],
    },
    {
      title: 'Extraocular Muscles and the Common Tendinous Ring',
      kind: 'structure',
      paragraphs: [
        'The muscles of eye movement are the lateral, medial, superior and inferior recti and the superior and inferior obliques. Nerve supply: LR6 SO4 AO3 — lateral rectus by the abducent nerve (VI), superior oblique by the trochlear nerve (IV), all the others by the oculomotor nerve (III).',
        'Intorsion is medial rotation of the upper pole (12 o’clock) of the cornea, produced by the superior oblique and superior rectus. Extorsion is lateral rotation, produced by the inferior oblique and inferior rectus.',
        'The common tendinous ring surrounds the optic canal and the medial part of the superior orbital fissure; the four recti arise from it. Passing through the fissure within the ring: the oculomotor, nasociliary and abducent nerves. Through the optic canal and ring: the optic nerve, ophthalmic artery and central vessels of the retina. Through the fissure outside the ring: the superior ophthalmic vein and the trochlear, frontal and lacrimal nerves.',
      ],
      table: {
        columns: ['Muscle', 'Nerve'],
        rows: [
          ['Lateral rectus', 'Abducent (VI)'],
          ['Superior oblique', 'Trochlear (IV)'],
          ['Medial, superior, inferior recti; inferior oblique', 'Oculomotor (III)'],
        ],
      },
      terms: [
        { term: 'Common tendinous ring', meaning: 'Fibrous ring around the optic canal and part of the superior orbital fissure; origin of the recti.' },
        { term: 'Intorsion', meaning: 'Medial rotation of the top of the cornea (superior oblique and superior rectus).' },
      ],
      keyPoints: [
        'LR6 SO4, the rest 3.',
        'Outside the ring: trochlear, frontal, lacrimal nerves and superior ophthalmic vein.',
      ],
      sourceRefs: hn([124, 125, 128, 129, 130]),
    },
    {
      title: 'Lacrimal Apparatus and the Eye',
      kind: 'pathway',
      paragraphs: [
        'The lacrimal gland lies in the upper lateral orbit on the lateral rectus and levator palpebrae superioris and is drained by about 12 ducts into the superior conjunctival fornix. Tears are spread over the eye by blinking and collect at the lacrimal lake; they enter the lacrimal canaliculi through the lacrimal puncta on the lid margins, then pass to the lacrimal sac (the upper dilated end of the nasolacrimal duct), down the nasolacrimal duct and into the inferior nasal meatus.',
        'Crocodile tears syndrome (Bogorad’s syndrome) is tearing while eating, after a facial nerve lesion proximal to the geniculate ganglion: regenerating parasympathetic fibres meant for the submandibular and sublingual glands grow instead to the lacrimal gland.',
        'The eye contains the light-sensitive retina; the vitreous body fills the space behind the lens and aqueous humour the smaller space in front, divided by the iris (whose opening is the pupil). The wall has three coats: the sclera and cornea; the choroid, ciliary body and iris; and the retina.',
      ],
      steps: [
        { label: 'Lacrimal gland', detail: 'Upper lateral orbit; ducts to the superior fornix.' },
        { label: 'Lacrimal lake', detail: 'Tears collect at the medial angle.' },
        { label: 'Puncta and canaliculi', detail: 'Openings on the lid margins.' },
        { label: 'Lacrimal sac', detail: 'Upper end of the nasolacrimal duct.' },
        { label: 'Nasolacrimal duct', detail: 'Opens into the inferior nasal meatus.' },
      ],
      terms: [
        { term: 'Lacrimal puncta', meaning: 'Openings on the lid margins leading to the canaliculi.' },
        { term: 'Crocodile tears', meaning: 'Lacrimation while eating from misdirected facial nerve regeneration.' },
      ],
      keyPoints: [
        'Nasolacrimal duct opens into the inferior meatus.',
      ],
      sourceRefs: hn([132, 133, 134, 135, 137, 139, 140]),
    },
  ],
  summary: [
    'The orbit is formed by seven bones; the optic canal carries the optic nerve and ophthalmic artery.',
    'The superior orbital fissure carries CN III, IV, V1, VI and the ophthalmic veins.',
    'The central retinal artery is an end artery — its occlusion causes blindness.',
    'LR6 SO4, the rest by CN III; the recti arise from the common tendinous ring.',
    'Tears drain via puncta, canaliculi, lacrimal sac and nasolacrimal duct to the inferior meatus.',
  ],
  highYield: [
    'Superior oblique + superior rectus → intorsion.',
    'Ophthalmic veins drain to the cavernous sinus.',
    'Inferior orbital fissure is bridged by orbitalis.',
  ],
  confusions: [
    {
      confusion: 'Thinking the trochlear nerve passes through the common tendinous ring.',
      clarification: 'The trochlear, frontal and lacrimal nerves and superior ophthalmic vein pass through the fissure OUTSIDE the ring (slide 130).',
    },
  ],
};

// ─── Lesson 4: The Pterygopalatine Fossa ─────────────────────────────

const lesson4: Draft = {
  id: L(4),
  title: 'The Pterygopalatine Fossa',
  description: 'A small but busy space below the orbit: its walls and openings, the maxillary nerve and its branches, the pterygopalatine ganglion, the maxillary artery, and why surgeons care about it.',
  xp: 25,
  estimatedMinutes: 13,
  sourceRefs: hn([143, 147, 148, 151, 153, 155, 157, 159, 162, 164, 167, 172, 175, 178]),
  objectives: [
    'Describe the position of the pterygopalatine fossa.',
    'Give each wall of the fossa with its openings and what they transmit.',
    'List the branches of the maxillary nerve in the fossa.',
    'Describe the pterygopalatine ganglion and its connections.',
    'Describe the pterygopalatine part of the maxillary artery and the clinical importance of the fossa.',
  ],
  chunks: [
    {
      title: 'Position, Walls and Openings',
      kind: 'structure',
      paragraphs: [
        'The pterygopalatine fossa is a small pyramidal space below the apex of the orbit, between the posterior wall of the maxillary antrum in front and the pterygoid process of the sphenoid behind. This retroantral space is a cul-de-sac of the infratemporal fossa, opening laterally through the pterygomaxillary fissure.',
        'Anterior wall: the posterior surface of the maxilla. Posterior wall: the pterygoid process and greater wing of the sphenoid, with three openings — the foramen rotundum to the middle cranial fossa (maxillary nerve), the pterygoid canal to the foramen lacerum (nerve of the pterygoid canal) and the palatovaginal (pharyngeal) canal to the choana (pharyngeal branches of the maxillary artery and pterygopalatine ganglion).',
        'Medial wall: the perpendicular plate of the palatine bone, with the sphenopalatine foramen to the nasal cavity (sphenopalatine artery and nasopalatine nerve). Lateral wall: open as the pterygomaxillary fissure to the infratemporal fossa. Roof: the greater wing and body of the sphenoid, with the inferior orbital fissure to the orbit (maxillary nerve). Floor: the fused maxilla and pterygoid process, with the greater palatine canal/foramen to the palate (greater palatine nerve and vessels).',
      ],
      table: {
        columns: ['Wall', 'Opening', 'Leads to / transmits'],
        rows: [
          ['Posterior', 'Foramen rotundum', 'Middle cranial fossa — maxillary nerve'],
          ['Posterior', 'Pterygoid canal', 'Foramen lacerum — nerve of pterygoid canal'],
          ['Posterior', 'Palatovaginal canal', 'Choana — pharyngeal branches'],
          ['Medial', 'Sphenopalatine foramen', 'Nasal cavity — sphenopalatine artery, nasopalatine nerve'],
          ['Lateral', 'Pterygomaxillary fissure', 'Infratemporal fossa'],
          ['Roof', 'Inferior orbital fissure', 'Orbit'],
          ['Floor', 'Greater palatine canal', 'Palate — greater palatine nerve and vessels'],
        ],
      },
      terms: [
        { term: 'Foramen rotundum', meaning: 'Opening from the middle cranial fossa for the maxillary nerve.' },
        { term: 'Sphenopalatine foramen', meaning: 'Opening to the nasal cavity for the sphenopalatine artery and nasopalatine nerve.' },
        { term: 'Pterygomaxillary fissure', meaning: 'Lateral opening of the fossa into the infratemporal fossa.' },
      ],
      keyPoints: [
        'Maxillary nerve enters through the foramen rotundum.',
      ],
      sourceRefs: hn([143, 147, 148, 151, 153, 155, 157]),
    },
    {
      title: 'Contents and Clinical Importance',
      kind: 'structure',
      paragraphs: [
        'The maxillary nerve passes through the lateral wall of the cavernous sinus and enters the fossa through the foramen rotundum; it is sensory to the skin of the face below the eye and above the upper lip. Branches: a meningeal branch (dura of the middle cranial fossa); pterygopalatine (communicating) nerves to the ganglion; posterior superior alveolar nerves (cheeks, gums, molar teeth, maxillary sinus); the zygomatic nerve (enters the orbit via the inferior orbital fissure, divides into zygomaticotemporal and zygomaticofacial branches, and carries postganglionic secretomotor fibres to the lacrimal gland); and the infraorbital nerve (via the inferior orbital fissure, groove and canal, giving the middle and anterior superior alveolar nerves).',
        'The pterygopalatine ganglion is a parasympathetic ganglion below the maxillary nerve, lateral to the sphenopalatine foramen and in front of the pterygoid canal. It receives preganglionic parasympathetic fibres from the facial nerve via the greater petrosal nerve and nerve of the pterygoid canal (Vidian nerve), and postganglionic sympathetic fibres via the deep petrosal nerve. It sends secretomotor fibres to the nasal and palatine glands and to the lacrimal gland (via the maxillary, zygomatic and lacrimal nerves).',
        'Sensory branches passing through the ganglion: orbital branches; the pharyngeal branch (roof of the pharynx, sphenoid sinus); posterior superior lateral nasal branches; the greater palatine nerve (hard palate, palatal gums); the lesser palatine nerve (soft palate, palatine tonsil); and the nasopalatine nerve (septum, then through the incisive canal to the front of the hard palate).',
        'The pterygopalatine part of the maxillary artery supplies the maxilla, upper teeth, nasal cavity and palate through the posterior superior alveolar, infraorbital, descending palatine (greater and lesser palatine), pterygoid canal, pharyngeal and sphenopalatine arteries.',
        'Clinical importance: local anaesthesia for the Caldwell–Luc operation and upper tooth extraction; maxillary or ethmoidal artery ligation for severe or recurrent epistaxis; and transantral Vidian neurectomy for vasomotor rhinorrhoea, crocodile tears, severe nasal drip and recurrent nasal polyps.',
      ],
      terms: [
        { term: 'Pterygopalatine ganglion', meaning: 'Parasympathetic ganglion for lacrimal, nasal and palatine glands.' },
        { term: 'Greater petrosal nerve', meaning: 'Facial nerve branch carrying preganglionic fibres to the pterygopalatine ganglion.' },
        { term: 'Vidian nerve', meaning: 'Nerve of the pterygoid canal (greater + deep petrosal nerves).' },
      ],
      keyPoints: [
        'Lacrimal secretion: CN VII → greater petrosal → pterygopalatine ganglion → zygomatic → lacrimal nerve.',
      ],
      sourceRefs: hn([159, 162, 164, 167, 172, 175, 178]),
    },
  ],
  summary: [
    'The pterygopalatine fossa lies between the maxilla and pterygoid process, below the orbit apex.',
    'It opens to the cranial cavity, orbit, nose, mouth, pharynx and infratemporal fossa.',
    'It contains the maxillary nerve, pterygopalatine ganglion and third part of the maxillary artery.',
    'The ganglion gets parasympathetic fibres from CN VII via the greater petrosal nerve.',
    'Surgery here treats epistaxis and vasomotor rhinitis.',
  ],
  highYield: [
    'Greater petrosal + deep petrosal = Vidian nerve.',
    'Sphenopalatine artery enters the nose via the sphenopalatine foramen.',
  ],
  confusions: [
    {
      confusion: 'Thinking the lacrimal nerve itself carries parasympathetic fibres from the brainstem.',
      clarification: 'The fibres are facial (via the greater petrosal nerve), relay in the pterygopalatine ganglion, and are carried to the lacrimal nerve by the zygomatic nerve (slides 162, 164).',
    },
  ],
};

// ─── Lesson 5: Nasal Cavity and Paranasal Sinuses ────────────────────

const lesson5: Draft = {
  id: L(5),
  title: 'Nasal Cavity and Paranasal Sinuses',
  description: 'The walls, openings and regions of the nasal cavity, its blood supply and nosebleeds, and the four paranasal sinuses with their drainage and the spread of sinusitis.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: hn([189, 191, 195, 199, 202, 204, 209, 210, 211, 213, 215, 216, 221, 223, 225, 227, 228, 230, 231, 232, 235, 237, 239]),
  objectives: [
    'Describe the roof, floor, medial and lateral walls of the nasal cavity.',
    'List the openings in the lateral wall and what drains into each meatus.',
    'Describe the respiratory and olfactory regions.',
    'Describe the blood supply of the nasal cavity and Kiesselbach’s area.',
    'Describe each paranasal sinus, its drainage and the spread of sinusitis.',
  ],
  chunks: [
    {
      title: 'Walls and Openings of the Nasal Cavity',
      kind: 'structure',
      paragraphs: [
        'The nasal cavity opens on the face at the nostrils and into the nasopharynx at the choanae. Inside each nostril is a dilated vestibule lined by skin with hairs, sebaceous and sweat glands. The cavity warms, cleans, humidifies and filters the air and serves smell and taste.',
        'Roof: nasal, frontal, ethmoid (cribriform plate, transmitting the olfactory nerves) and body of the sphenoid. Floor: the palatine process of the maxilla and horizontal plate of the palatine bone, with the incisive foramen (nasopalatine nerve and terminal sphenopalatine artery). Medial wall (septum): mainly the perpendicular plate of the ethmoid, the vomer and septal cartilage. Lateral wall: the superior and middle conchae (ethmoid) and the inferior concha, plus nasal, maxillary, lacrimal, palatine and sphenoid bones.',
        'Openings: the sphenoethmoidal recess (sphenoid sinus); the superior meatus (posterior ethmoidal cells); the middle meatus (frontal sinus via the infundibulum, middle ethmoidal cells on the ethmoidal bulla, anterior ethmoidal cells and maxillary sinus in the hiatus semilunaris); the inferior meatus (nasolacrimal duct); and the sphenopalatine foramen into the pterygopalatine fossa.',
        'The respiratory region (lower two-thirds) warms, moistens and cleans the air. The olfactory region (superior concha and upper third of the septum) carries the olfactory nerves through the cribriform plate to the olfactory bulb.',
      ],
      table: {
        columns: ['Space', 'Drains'],
        rows: [
          ['Sphenoethmoidal recess', 'Sphenoid sinus'],
          ['Superior meatus', 'Posterior ethmoidal cells'],
          ['Middle meatus', 'Frontal, maxillary, anterior and middle ethmoidal'],
          ['Inferior meatus', 'Nasolacrimal duct'],
        ],
      },
      terms: [
        { term: 'Hiatus semilunaris', meaning: 'Curved groove in the middle meatus receiving the frontal, anterior ethmoidal and maxillary sinuses.' },
        { term: 'Cribriform plate', meaning: 'Perforated part of the ethmoid in the nasal roof for the olfactory nerves.' },
      ],
      keyPoints: [
        'Inferior meatus = nasolacrimal duct only.',
        'Middle meatus receives most sinuses.',
      ],
      sourceRefs: hn([189, 191, 195, 196, 199, 202, 204, 208, 209, 210]),
    },
    {
      title: 'Blood Supply and Epistaxis',
      kind: 'clinical',
      paragraphs: [
        'Arteries: lateral nasal branches of the anterior and posterior ethmoidal arteries (ophthalmic); posterior lateral nasal and posterior septal branches of the sphenopalatine artery (maxillary); the greater palatine branch of the descending palatine artery (maxillary); and the septal branch of the superior labial artery and lateral nasal branch of the facial artery.',
        'Epistaxis (nosebleed) can result from rupture of the sphenopalatine artery, from nose picking tearing vestibular veins, or from the anterior septum — Kiesselbach’s area (plexus), where the sphenopalatine, greater palatine, anterior ethmoidal and superior labial arteries converge. Treatment includes compressing the nostrils and nasal packing.',
      ],
      terms: [
        { term: 'Kiesselbach’s area', meaning: 'Anterior septal plexus where four arteries meet; commonest site of nosebleeds.' },
        { term: 'Epistaxis', meaning: 'Nosebleed.' },
      ],
      keyPoints: [
        'Kiesselbach’s area: sphenopalatine + greater palatine + anterior ethmoidal + superior labial.',
      ],
      sourceRefs: hn([211, 212, 213, 215, 216]),
    },
    {
      title: 'The Paranasal Sinuses',
      kind: 'structure',
      paragraphs: [
        'The paranasal sinuses — ethmoidal, frontal, maxillary and sphenoidal — lighten the skull and add resonance to the voice.',
        'Ethmoidal sinus: many small air cells in the ethmoidal labyrinth between the orbit and nasal cavity. Posterior cells drain into the superior meatus; middle cells onto the ethmoidal bulla in the middle meatus; anterior cells into the front of the hiatus semilunaris. Infection can erode the thin orbital plate (lamina papyracea), causing orbital cellulitis that may spread into the cranial cavity.',
        'Frontal sinus: in the frontal bone; opens into the hiatus semilunaris of the middle meatus via the frontonasal duct (infundibulum); supplied by the supraorbital nerve (V1). Frontal sinusitis may erode the thin floor of the anterior cranial fossa, causing meningitis or brain abscess.',
        'Maxillary sinus: the largest, and the only one that may be present at birth. It lies in the maxilla lateral to the nasal cavity and below the orbit and drains into the back of the hiatus semilunaris. Maxillary sinusitis mimics a tooth abscess and is often related to an infected tooth, because only thin bone separates the sinus from the roots of the upper teeth.',
        'Sphenoidal sinus: in the body of the sphenoid, opening into the sphenoethmoidal recess, supplied by maxillary branches and the posterior ethmoidal nerve. The pituitary gland lies above it. Infection may spread from the nose or nasopharynx and erode its walls to reach the cavernous sinuses, pituitary, optic nerve or brainstem.',
      ],
      table: {
        columns: ['Sinus', 'Drains into', 'Clinical'],
        rows: [
          ['Frontal', 'Middle meatus (hiatus semilunaris via frontonasal duct)', 'Meningitis, brain abscess'],
          ['Maxillary', 'Middle meatus (hiatus semilunaris)', 'Mimics toothache; largest; present at birth'],
          ['Ethmoidal', 'Superior and middle meatus', 'Orbital cellulitis via lamina papyracea'],
          ['Sphenoidal', 'Sphenoethmoidal recess', 'Cavernous sinus, pituitary, optic nerve'],
        ],
      },
      terms: [
        { term: 'Lamina papyracea', meaning: 'Paper-thin orbital plate of the ethmoid.' },
        { term: 'Maxillary sinus', meaning: 'Largest paranasal sinus, present at birth, above the upper teeth roots.' },
      ],
      keyPoints: [
        'Pituitary sits above the sphenoid sinus.',
      ],
      sourceRefs: hn([221, 222, 223, 225, 227, 228, 230, 231, 232, 235, 236, 237, 239]),
    },
  ],
  summary: [
    'The septum is the perpendicular plate of ethmoid, vomer and septal cartilage.',
    'The lateral wall carries three conchae; the inferior meatus receives the nasolacrimal duct.',
    'Kiesselbach’s area on the anterior septum is the usual site of nosebleeds.',
    'Frontal, maxillary and anterior ethmoidal sinuses drain into the hiatus semilunaris.',
    'Sinusitis can spread to the orbit, meninges, cavernous sinus or teeth.',
  ],
  highYield: [
    'Maxillary sinus is the largest and present at birth.',
    'Sphenoid sinus → sphenoethmoidal recess.',
    'Olfactory region: superior concha and upper third of the septum.',
  ],
  confusions: [
    {
      confusion: 'Thinking the maxillary sinus drains into the inferior meatus.',
      clarification: 'It drains into the hiatus semilunaris of the middle meatus; only the nasolacrimal duct opens into the inferior meatus (slides 204, 232).',
    },
  ],
};

// ─── Lesson 6: The Ear ───────────────────────────────────────────────

const lesson6: Draft = {
  id: L(6),
  title: 'The Ear',
  description: 'The external ear and tympanic membrane, the middle ear with its walls, muscles, ossicles and auditory tube, the inner ear’s bony and membranous labyrinths, and how the ear develops.',
  xp: 25,
  estimatedMinutes: 18,
  sourceRefs: hn([241, 245, 247, 248, 256, 264, 266, 267, 269, 274, 280, 282, 284, 287, 289, 290, 292, 295, 297, 299, 302, 310, 312, 313, 315, 316, 318, 322, 329, 332, 335, 336, 340, 341, 343, 346, 349]),
  objectives: [
    'Describe the auricle, external acoustic meatus and tympanic membrane with their nerve supply.',
    'Give the boundaries and communications of the middle ear cavity.',
    'Describe the middle ear muscles, ossicles and auditory tube.',
    'Describe the bony and membranous labyrinths and their sense organs.',
    'Explain the development of the external, middle and internal ear.',
  ],
  chunks: [
    {
      title: 'The External Ear',
      kind: 'structure',
      paragraphs: [
        'The ear senses sound and the effects of gravity and motion. It lies in the temporal bone (squamous, petrous, mastoid and tympanic parts) and has external, middle and internal parts.',
        'The external ear is the auricle and the external acoustic meatus; it receives sound waves. The auricle is skin-covered cartilage attached by ligaments and muscles; it channels sound into the meatus. Its features include the helix (curved rim), the antihelix (dividing the scaphoid fossa from the concha), the concha (deep cavity in front of the antihelix), the tragus (projection in front of the concha) and the lobule (areolar tissue and fat, no cartilage). It is supplied by the vagus, facial, great auricular, auriculotemporal (V3) and lesser occipital nerves, and by the superficial temporal and posterior auricular arteries.',
        'The external acoustic meatus is about 2.5 cm long from the concha to the tympanic membrane: the outer third is cartilage (wider, with ceruminous glands producing earwax) and the inner two-thirds bone. Nerves: auriculotemporal (V3), auricular branch of the vagus, facial and glossopharyngeal; arteries: superficial temporal, posterior auricular and deep auricular (maxillary).',
        'The tympanic membrane lies obliquely across the end of the meatus, about 1 cm across, thin, oval and semi-transparent. It has three layers — outer cutaneous, middle fibrous and inner mucous — with a thickened fibrocartilaginous ring fixed in the tympanic sulcus. The small upper triangle between the malleolar folds lacks the ring and fibrous layer: the pars flaccida. The rest is the pars tensa, showing the cone of light in the anterior–inferior quadrant and the umbo at its most depressed centre. Its outer surface is supplied by the auriculotemporal nerve and the auricular branch of the vagus; its inner surface by the tympanic branch of the glossopharyngeal.',
      ],
      terms: [
        { term: 'Pars flaccida', meaning: 'Small upper part of the eardrum lacking the fibrous layer.' },
        { term: 'Cone of light', meaning: 'Light reflex in the anterior–inferior quadrant of the eardrum.' },
        { term: 'Umbo', meaning: 'Most depressed central point of the eardrum.' },
      ],
      keyPoints: [
        'Meatus: outer ⅓ cartilage, inner ⅔ bone; 2.5 cm.',
        'Eardrum inner surface: CN IX (tympanic branch).',
      ],
      sourceRefs: hn([240, 241, 243, 245, 247, 248, 249, 250, 252, 254, 256, 258, 261, 263, 264, 266, 267, 269, 271, 274, 275, 276]),
    },
    {
      title: 'The Middle Ear',
      kind: 'structure',
      paragraphs: [
        'The middle ear is the tympanic cavity with its ossicles, in the petrous temporal bone. It transmits sound from the air to the ossicles and on to the inner ear. It includes the tympanic cavity proper and the epitympanic recess above it (holding the head of the malleus and body of the incus). It communicates in front with the nasopharynx by the auditory (Eustachian) tube and behind with the mastoid antrum and air cells through the aditus ad antrum.',
        'Boundaries: roof — tegmen tympani; floor — jugular fossa; anterior — carotid canal; posterior — mastoid antrum and air cells; lateral — tympanic membrane; medial — the lateral wall of the inner ear, with the promontory (basal turn of the cochlea), the oval window, the round window and the prominence of the facial canal. The oval window is moved by the footplate of the stapes, sending vibrations into the perilymph of the scala vestibuli; the round window, closed by the secondary tympanic membrane, accommodates the pressure waves in the scala tympani.',
        'Muscles: stapedius, the smallest skeletal muscle, arises from the pyramidal eminence, inserts on the neck of the stapes and is supplied by the facial nerve; it damps excessive stapes movement, protecting the inner ear from loud noise, and its paralysis causes hyperacusis. Tensor tympani arises from the cartilaginous auditory tube, inserts on the handle of the malleus and is supplied by the mandibular nerve (V3); it tightens the eardrum in response to loud noise.',
        'Ossicles: the malleus (head, neck, handle, anterior and lateral processes; its handle is fused to the eardrum and receives tensor tympani), the incus (body, long process articulating with the stapes, short process) and the stapes (head, neck receiving stapedius, two crura and a footplate attached to the oval window by the annular ligament; in the embryo the stapedial artery passes through it). Otosclerosis — abnormal bone fixing the footplate — causes deafness.',
        'The auditory tube connects the middle ear to the nasopharynx, equalising pressure with the atmosphere so the eardrum can move freely. Its cartilaginous part stays closed except in swallowing or yawning, when tensor veli palatini and salpingopharyngeus open it. The middle ear is supplied by the tympanic branch of the glossopharyngeal (forming the tympanic plexus, which continues as the lesser petrosal nerve to the otic ganglion) and by the stylomastoid and anterior tympanic arteries. Otitis media (often spread from the nasopharynx via the tube) can cause deafness; otitis externa (swimmer’s ear) is infection of the canal, usually by Pseudomonas.',
      ],
      table: {
        columns: ['Wall', 'Feature'],
        rows: [
          ['Roof', 'Tegmen tympani'],
          ['Floor', 'Jugular fossa'],
          ['Anterior', 'Carotid canal; auditory tube'],
          ['Posterior', 'Aditus to mastoid antrum'],
          ['Lateral', 'Tympanic membrane'],
          ['Medial', 'Promontory, oval and round windows, facial canal'],
        ],
      },
      terms: [
        { term: 'Hyperacusis', meaning: 'Abnormally loud hearing from paralysis of stapedius.' },
        { term: 'Otosclerosis', meaning: 'Fixation of the stapes footplate causing conductive deafness.' },
        { term: 'Auditory tube', meaning: 'Eustachian tube joining the middle ear to the nasopharynx.' },
      ],
      keyPoints: [
        'Stapedius: CN VII; tensor tympani: V3.',
        'Tegmen tympani separates the middle ear from the middle cranial fossa.',
      ],
      sourceRefs: hn([280, 282, 284, 287, 289, 290, 292, 293, 294, 295, 297, 298, 299, 301, 302, 304, 307, 308, 310, 312, 313, 315, 316, 317]),
    },
    {
      title: 'The Inner Ear and Development of the Ear',
      kind: 'structure',
      paragraphs: [
        'The inner ear has an acoustic apparatus (the cochlea with the cochlear duct, for hearing) and a vestibular apparatus (the vestibule with the utricle and saccule, and the semicircular canals with their ducts, for balance). Here vibrations are transduced into nerve impulses carried by the vestibulocochlear nerve.',
        'The bony labyrinth — vestibule, three semicircular canals and cochlea — contains perilymph in which the membranous labyrinth is suspended. The vestibule communicates with the cochlea in front and the semicircular canals behind. The bony cochlea has the upper scala vestibuli and lower scala tympani.',
        'The membranous labyrinth is filled with endolymph and holds the sense organs. The utricle and saccule contain maculae that detect linear acceleration (horizontal in the utricle, vertical in the saccule). The anterior, lateral and posterior semicircular ducts have ampullae detecting rotational (angular) acceleration. The cochlear duct (scala media), between the scala vestibuli and scala tympani, contains the spiral organ of Corti with hair cells for hearing. Ménière’s disease (endolymphatic hydrops) causes vertigo, tinnitus, progressive hearing loss, nausea and vomiting.',
        'Development: the 1st pharyngeal groove forms the external acoustic meatus; the auricular hillocks form the auricle. The 1st pharyngeal arch forms the malleus, incus, tensor tympani and trigeminal nerve; the 2nd arch the stapes, stapedius and facial nerve; the 1st pharyngeal pouch the auditory tube and middle ear cavity; the 1st pharyngeal membrane the tympanic membrane. The internal ear develops from the otic placode, a thickening of surface ectoderm that invaginates to form the otic vesicle (otocyst). Its utricular portion forms the utricle, semicircular ducts and vestibular ganglion; its saccular portion the saccule, cochlear duct and spiral ganglion. Mesenchyme around the otocyst forms the otic capsule, which develops the perilymphatic spaces (scala tympani and vestibuli) and ossifies into the bony labyrinth.',
      ],
      table: {
        columns: ['Embryonic structure', 'Ear derivative'],
        rows: [
          ['1st pharyngeal groove', 'External acoustic meatus'],
          ['1st pharyngeal arch', 'Malleus, incus, tensor tympani'],
          ['2nd pharyngeal arch', 'Stapes, stapedius'],
          ['1st pharyngeal pouch', 'Auditory tube, middle ear cavity'],
          ['1st pharyngeal membrane', 'Tympanic membrane'],
          ['Otic placode', 'Membranous labyrinth (internal ear)'],
        ],
      },
      terms: [
        { term: 'Organ of Corti', meaning: 'Spiral organ in the cochlear duct with hair cells for hearing.' },
        { term: 'Macula', meaning: 'Sense organ of the utricle and saccule detecting linear acceleration.' },
        { term: 'Ménière’s disease', meaning: 'Endolymphatic hydrops: vertigo, tinnitus and hearing loss.' },
      ],
      keyPoints: [
        'Maculae = linear acceleration; ampullae = rotational acceleration.',
        'Perilymph in the bony labyrinth; endolymph in the membranous labyrinth.',
      ],
      sourceRefs: hn([318, 320, 322, 324, 325, 329, 332, 335, 336, 340, 341, 343, 346, 347, 349]),
    },
  ],
  summary: [
    'The external acoustic meatus is 2.5 cm: outer third cartilage, inner two-thirds bone.',
    'The tympanic membrane has pars flaccida and pars tensa with the cone of light antero-inferiorly.',
    'Middle ear muscles: stapedius (CN VII) and tensor tympani (V3); ossicles: malleus, incus, stapes.',
    'The auditory tube links the middle ear to the nasopharynx and equalises pressure.',
    'The inner ear’s maculae sense linear and ampullae angular acceleration; the organ of Corti senses sound.',
  ],
  highYield: [
    'Stapedius palsy → hyperacusis.',
    'Otosclerosis fixes the stapes footplate.',
    '1st arch: malleus and incus; 2nd arch: stapes.',
  ],
  confusions: [
    {
      confusion: 'Thinking stapedius is supplied by the trigeminal nerve.',
      clarification: 'Stapedius is a 2nd arch muscle supplied by the facial nerve; tensor tympani (1st arch) is supplied by V3 (slides 297, 299).',
    },
  ],
};

// ─── Lesson 7: Tongue and Salivary Glands ────────────────────────────

const lesson7: Draft = {
  id: L(7),
  title: 'The Tongue and Salivary Glands',
  description: 'The intrinsic and extrinsic muscles of the tongue and their nerves, the three major salivary glands and saliva, salivary stones, and the parasympathetic pathways that make the glands secrete.',
  xp: 25,
  estimatedMinutes: 12,
  sourceRefs: hn([367, 369, 370, 373, 374, 377, 379, 380, 381, 382, 383, 387, 388, 389]),
  objectives: [
    'Name the intrinsic and extrinsic muscles of the tongue, their actions and nerve supply.',
    'Name the major salivary glands and describe saliva.',
    'Explain why calculi are commonest in the submandibular gland.',
    'Trace the parasympathetic supply of the submandibular, sublingual and parotid glands.',
  ],
  chunks: [
    {
      title: 'Muscles of the Tongue',
      kind: 'structure',
      paragraphs: [
        'The intrinsic muscles — superior and inferior longitudinal, transverse and vertical — lie wholly within the tongue and change its shape.',
        'The four paired extrinsic muscles arise outside the tongue and move it (protrusion, retraction, depression, elevation). Genioglossus, the largest, arises from the genial tubercles of the mandible and protrudes the tongue and depresses its centre. Hyoglossus, from the hyoid, depresses and retracts it. Styloglossus, from the styloid process, elevates and retracts it, making a trough for swallowing. Palatoglossus, from the soft palate, elevates the back of the tongue and seals the mouth from the pharynx.',
        'All tongue muscles are supplied by the hypoglossal nerve (CN XII) except palatoglossus, which is supplied by the vagus (CN X).',
      ],
      table: {
        columns: ['Extrinsic muscle', 'Origin', 'Action', 'Nerve'],
        rows: [
          ['Genioglossus', 'Genial tubercles of mandible', 'Protrudes; depresses centre', 'XII'],
          ['Hyoglossus', 'Hyoid bone', 'Depresses and retracts', 'XII'],
          ['Styloglossus', 'Styloid process', 'Elevates and retracts', 'XII'],
          ['Palatoglossus', 'Soft palate', 'Elevates back of tongue', 'X'],
        ],
      },
      terms: [
        { term: 'Genioglossus', meaning: 'Largest extrinsic tongue muscle; protrudes the tongue.' },
        { term: 'Palatoglossus', meaning: 'Only tongue muscle supplied by the vagus.' },
      ],
      keyPoints: [
        'All tongue muscles: CN XII — except palatoglossus (CN X).',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: with a hypoglossal nerve lesion, the protruded tongue deviates toward the paralysed side because the healthy genioglossus pushes it over.' }],
      sourceRefs: [...hn([367, 369, 370, 373, 374]), ...GRAYS],
    },
    {
      title: 'The Salivary Glands and Saliva',
      kind: 'structure',
      paragraphs: [
        'There are three major paired salivary glands — parotid, submandibular and sublingual — and about 1,000 minor glands in the oral cavity. Saliva is about 99.4% water with mucin; its main salts are calcium phosphate and carbonate. Amylase begins carbohydrate digestion, hydrolysing starch to maltose.',
        'The parotid secretes watery (serous) saliva; the submandibular and sublingual glands secrete mucous saliva, and the submandibular secretion is more alkaline.',
        'Salivary stones (calculi) occur about 80% in the submandibular gland, 19% in the parotid and 1% in the sublingual. The submandibular duct is wider and longer than the parotid duct and saliva flows against gravity, so there is more stasis.',
      ],
      terms: [
        { term: 'Amylase', meaning: 'Salivary enzyme hydrolysing starch to maltose.' },
        { term: 'Sialolithiasis', meaning: 'Salivary stone formation, commonest in the submandibular gland.' },
      ],
      keyPoints: [
        '80% of salivary stones are submandibular — long duct, flow against gravity, alkaline mucous saliva.',
      ],
      sourceRefs: hn([377, 378, 379, 380, 381]),
    },
    {
      title: 'Secretomotor Supply',
      kind: 'pathway',
      paragraphs: [
        'Submandibular and sublingual glands: preganglionic parasympathetic fibres start in the superior salivatory nucleus (medulla) and travel in the facial nerve, leaving it as the chorda tympani from the descending part in the tympanic cavity. The chorda tympani leaves through the petrotympanic fissure medial to the temporomandibular joint and joins the lingual nerve in the infratemporal fossa (which also carries its taste fibres from the anterior two-thirds of the tongue). The preganglionic fibres relay in the submandibular ganglion, whose postganglionic fibres are secretomotor to both glands.',
        'Parotid gland: preganglionic fibres start in the inferior salivatory nucleus and travel in the glossopharyngeal nerve, through the tympanic plexus in the middle ear, then as the lesser petrosal nerve to the otic ganglion (near the foramen ovale). Postganglionic fibres reach the parotid via the auriculotemporal nerve (V3), which is also sensory to the gland.',
      ],
      steps: [
        { label: 'Submandibular/sublingual', detail: 'Superior salivatory nucleus → CN VII → chorda tympani → lingual nerve → submandibular ganglion → glands.' },
        { label: 'Parotid', detail: 'Inferior salivatory nucleus → CN IX → tympanic plexus → lesser petrosal → otic ganglion → auriculotemporal nerve → parotid.' },
      ],
      terms: [
        { term: 'Chorda tympani', meaning: 'Facial nerve branch carrying taste and secretomotor fibres to the lingual nerve.' },
        { term: 'Otic ganglion', meaning: 'Parasympathetic ganglion relaying fibres to the parotid.' },
        { term: 'Lesser petrosal nerve', meaning: 'Carries CN IX preganglionic fibres to the otic ganglion.' },
      ],
      keyPoints: [
        'Parotid = CN IX via otic ganglion; submandibular/sublingual = CN VII via submandibular ganglion.',
      ],
      sourceRefs: hn([382, 383, 387, 388, 389]),
    },
  ],
  summary: [
    'Intrinsic tongue muscles change shape; extrinsic muscles move the tongue.',
    'All tongue muscles are supplied by CN XII except palatoglossus (CN X).',
    'The parotid makes serous saliva; submandibular and sublingual make mucous saliva.',
    '80% of salivary stones form in the submandibular gland.',
    'Parotid secretion: CN IX → otic ganglion; submandibular and sublingual: CN VII → submandibular ganglion.',
  ],
  highYield: [
    'Genioglossus protrudes the tongue.',
    'Chorda tympani leaves via the petrotympanic fissure.',
    'Auriculotemporal nerve carries secretomotor fibres to the parotid.',
  ],
  confusions: [
    {
      confusion: 'Thinking the facial nerve supplies the parotid secretomotor fibres because it passes through the gland.',
      clarification: 'The facial nerve only passes through the parotid; its secretomotor fibres come from CN IX via the otic ganglion and auriculotemporal nerve (slides 387–389).',
    },
  ],
};

// ─── Lesson 8: Cranial Nerves I–VI ───────────────────────────────────

const lesson8: Draft = {
  id: L(8),
  title: 'Cranial Nerves I–VI',
  description: 'The functional components of peripheral nerves, then the olfactory, optic, oculomotor, trochlear, trigeminal and abducent nerves — their origins, courses, branches and clinical importance.',
  xp: 25,
  estimatedMinutes: 17,
  sourceRefs: hn([392, 393, 394, 395, 396, 397, 399, 401, 402, 403, 404, 405, 406, 408, 409, 410, 411]),
  objectives: [
    'Describe the parts of the peripheral nervous system and the functional components of spinal and cranial nerves.',
    'Describe the olfactory and optic nerves and the optic chiasma.',
    'Describe the oculomotor, trochlear and abducent nerves and their clinical importance.',
    'Describe the trigeminal nerve and the branches of its three divisions.',
  ],
  chunks: [
    {
      title: 'Functional Components of Nerves',
      kind: 'classification',
      paragraphs: [
        'The peripheral nervous system is everything outside the brain and spinal cord: cranial nerves, spinal nerves, associated ganglia and the peripheral autonomic system. Afferent neurons carry impulses from receptors to the CNS; efferent neurons carry impulses from the CNS to effectors (striated, cardiac and smooth muscle and glands).',
        'Spinal nerves have four components: somatic efferent (anterior grey column → striated muscle from somites), somatic afferent (dorsal root ganglion), general visceral efferent (lateral grey column → autonomic ganglion → glands and smooth muscle) and general visceral afferent (from viscera via the dorsal root).',
        'Cranial nerves may also have special components: special visceral efferent (branchiomotor) fibres to striated muscle from the pharyngeal arches (in V, VII, IX, X and XI); special visceral afferent fibres for taste (VII, IX, X); and special somatic afferent fibres for hearing and balance (VIII).',
      ],
      table: {
        columns: ['Special component', 'Supplies', 'Nerves'],
        rows: [
          ['Special visceral efferent (branchiomotor)', 'Pharyngeal arch muscles', 'V, VII, IX, X, XI'],
          ['Special visceral afferent', 'Taste', 'VII, IX, X'],
          ['Special somatic afferent', 'Hearing and balance', 'VIII'],
        ],
      },
      terms: [
        { term: 'Branchiomotor fibres', meaning: 'Special visceral efferent fibres to pharyngeal arch muscles.' },
        { term: 'Afferent', meaning: 'Carrying impulses toward the CNS.' },
        { term: 'Efferent', meaning: 'Carrying impulses away from the CNS.' },
      ],
      keyPoints: [
        'Taste is carried by VII, IX and X.',
      ],
      sourceRefs: hn([392, 393, 394, 395]),
    },
    {
      title: 'Olfactory and Optic Nerves',
      kind: 'pathway',
      paragraphs: [
        'Olfactory nerve (I): its axons arise from neurosensory cells in the olfactory epithelium (from the olfactory placode) in the upper posterior nasal cavity — above the superior concha, upper third of the septum and roof. About 20 bundles (fila olfactoria) pass through the cribriform plate, pierce the dura and arachnoid and enter the olfactory bulb. They are unmyelinated and vulnerable in fractures of the cribriform plate.',
        'Optic nerve (II): the axons of about 1 million retinal ganglion cells converge on the optic disc (about 3.5 mm medial to the fovea), unmyelinated in the retina (keeping it transparent) and myelinated once they pierce the sclera. It runs posteromedially (about 25 mm in the orbit, 5 mm intracranially) through the optic canal; the two nerves join at the optic chiasma, where fibres from the nasal halves of each retina cross to the opposite optic tract and temporal fibres stay on the same side. Most fibres go to the lateral geniculate body (relaying to the visual cortex); some go to the superior colliculus for reflexes.',
        'Clinically, the chiasma may be compressed by an internal carotid aneurysm, by pressure from the third ventricle, or by a pituitary tumour — causing visual loss.',
      ],
      terms: [
        { term: 'Optic chiasma', meaning: 'Partial crossing of the optic nerves: nasal retinal fibres cross.' },
        { term: 'Cribriform plate', meaning: 'Ethmoid plate pierced by the olfactory nerve bundles.' },
      ],
      keyPoints: [
        'Nasal retinal fibres cross at the chiasma; temporal fibres do not.',
        'Pituitary tumours compress the chiasma.',
      ],
      notes: [{ kind: 'textbook', text: 'The deck’s optic pathway slide is garbled; the relay through the lateral geniculate body to the visual cortex is stated as in Gray’s.' }],
      sourceRefs: [...hn([396, 397, 399, 400, 401]), ...GRAYS],
    },
    {
      title: 'Oculomotor, Trochlear and Abducent Nerves',
      kind: 'structure',
      paragraphs: [
        'Oculomotor nerve (III): leaves the ventral midbrain at the medial side of the cerebral peduncle, runs through the middle cranial fossa (lateral wall of the cavernous sinus) and divides into superior and inferior divisions that enter the orbit within the common tendinous ring. The superior division supplies superior rectus and levator palpebrae superioris; the inferior division supplies medial and inferior recti and inferior oblique, and carries preganglionic parasympathetic fibres to the ciliary ganglion, whose postganglionic fibres supply sphincter pupillae and the ciliary muscle. Sympathetic fibres from the internal carotid plexus that join it supply dilator pupillae.',
        'Trochlear nerve (IV): somatic efferent to superior oblique. It is the only cranial nerve to arise from the dorsal surface of the brainstem; it winds around the midbrain between the superior cerebellar and posterior cerebral arteries, pierces the tentorium and enters the orbit through the superior orbital fissure outside the common tendinous ring.',
        'Abducent nerve (VI): somatic efferent to lateral rectus (abduction). It emerges at the lower border of the pons between the pyramid and olive, crosses the apex of the petrous bone, runs through the cavernous sinus and enters the orbit within the common tendinous ring. Clinically, raised intracranial pressure can stretch it; infected petrous air cells can paralyse it; and III, IV and VI can be damaged together in cavernous sinus thrombosis.',
      ],
      table: {
        columns: ['Nerve', 'Muscles', 'Notable point'],
        rows: [
          ['III Oculomotor', 'SR, MR, IR, IO, levator; sphincter pupillae (parasympathetic)', 'Ciliary ganglion'],
          ['IV Trochlear', 'Superior oblique', 'Only nerve from the dorsal brainstem'],
          ['VI Abducent', 'Lateral rectus', 'Long intracranial course — stretched by raised ICP'],
        ],
      },
      terms: [
        { term: 'Ciliary ganglion', meaning: 'Parasympathetic ganglion of CN III for sphincter pupillae and ciliary muscle.' },
      ],
      keyPoints: [
        'Oculomotor palsy affects most eye muscles and the pupil.',
      ],
      sourceRefs: hn([402, 403, 404, 405]),
    },
    {
      title: 'The Trigeminal Nerve',
      kind: 'structure',
      paragraphs: [
        'The trigeminal nerve (V) attaches to the ventral pons by a small motor root and a large sensory root. They enter the trigeminal cave, a dural recess containing the trigeminal ganglion, from which the ophthalmic, maxillary and mandibular divisions emerge. The motor root passes under the ganglion and joins the mandibular division through the foramen ovale.',
        'Ophthalmic nerve (V1): enters the orbit through the superior orbital fissure as three branches — the nasociliary (anterior and posterior ethmoidal nerves, branches to the ciliary ganglion, long ciliary nerves to the eyeball, infratrochlear nerve), the frontal (supraorbital and supratrochlear nerves to the upper lid, forehead and scalp) and the lacrimal (carrying secretomotor fibres from the pterygopalatine ganglion to the lacrimal gland).',
        'Maxillary nerve (V2): leaves through the foramen rotundum to the pterygopalatine fossa; branches include the infraorbital, zygomatic, pterygopalatine, and anterior and posterior superior alveolar nerves (teeth, upper jaw, skin and mucosa of the maxillary process).',
        'Mandibular nerve (V3): leaves through the foramen ovale. The smaller anterior division is mainly motor (to the muscles of mastication) with the sensory buccal nerve. The posterior division gives the inferior alveolar nerve (through the mandibular canal; its mylohyoid branch supplies mylohyoid and the anterior belly of digastric), the lingual nerve (general sensation to the tongue; joined by the chorda tympani for taste and secretomotor fibres) and the auriculotemporal nerve (skin of the temple, external acoustic meatus, TMJ and parotid, carrying secretomotor fibres from the otic ganglion to the parotid).',
        'The trigeminal also carries autonomic fibres belonging to other nerves to their targets (from the ciliary, pterygopalatine, submandibular and otic ganglia, and sympathetic fibres from the superior cervical ganglion).',
      ],
      table: {
        columns: ['Division', 'Exit from skull', 'Main territory'],
        rows: [
          ['V1 Ophthalmic', 'Superior orbital fissure', 'Eye, forehead, upper lid, nose'],
          ['V2 Maxillary', 'Foramen rotundum', 'Cheek, upper lip, upper teeth'],
          ['V3 Mandibular', 'Foramen ovale', 'Lower jaw, lower teeth, tongue (general sensation); muscles of mastication'],
        ],
      },
      terms: [
        { term: 'Trigeminal ganglion', meaning: 'Sensory ganglion of CN V in the trigeminal cave.' },
        { term: 'Lingual nerve', meaning: 'V3 branch for general sensation of the anterior tongue, joined by the chorda tympani.' },
        { term: 'Inferior alveolar nerve', meaning: 'V3 branch in the mandibular canal to the lower teeth.' },
      ],
      keyPoints: [
        'Only V3 carries motor fibres (muscles of mastication).',
      ],
      sourceRefs: hn([406, 407, 408, 409, 410, 411]),
    },
  ],
  summary: [
    'Cranial nerves may carry special components: branchiomotor (V, VII, IX, X, XI), taste (VII, IX, X) and hearing/balance (VIII).',
    'Olfactory fibres pass through the cribriform plate; nasal retinal fibres cross at the optic chiasma.',
    'III supplies most eye muscles and the pupil sphincter; IV the superior oblique; VI the lateral rectus.',
    'The trochlear is the only nerve from the dorsal brainstem.',
    'The trigeminal’s three divisions exit via the superior orbital fissure, foramen rotundum and foramen ovale.',
  ],
  highYield: [
    'Abducent nerve: stretched by raised intracranial pressure.',
    'V3 motor → muscles of mastication.',
    'Pituitary tumour → chiasmal compression.',
  ],
  confusions: [
    {
      confusion: 'Thinking all three trigeminal divisions carry motor fibres.',
      clarification: 'V1 and V2 are purely sensory; the motor root joins only the mandibular division (slides 406, 408).',
    },
  ],
};

// ─── Lesson 9: Cranial Nerves VII–XII ────────────────────────────────

const lesson9: Draft = {
  id: L(9),
  title: 'Cranial Nerves VII–XII',
  description: 'The facial nerve’s course, branches and Bell’s palsy; the vestibulocochlear and glossopharyngeal nerves; and the vagus, accessory and hypoglossal nerves.',
  xp: 25,
  estimatedMinutes: 17,
  sourceRefs: hn([412, 413, 414, 415, 416, 417, 418, 419, 420]),
  objectives: [
    'Describe the roots, course and branches of the facial nerve and the signs of Bell’s palsy.',
    'Describe the vestibulocochlear nerve.',
    'Describe the glossopharyngeal nerve and its branches.',
    'Describe the functional components, course and branches of the vagus nerve.',
    'Describe the accessory and hypoglossal nerves.',
  ],
  chunks: [
    {
      title: 'The Facial Nerve',
      kind: 'structure',
      paragraphs: [
        'The facial nerve (VII) leaves the brainstem at the lower border of the pons in the cerebellopontine angle, medial to the vestibulocochlear nerve, by two roots: a larger motor root (branchiomotor to 2nd arch muscles) and the nervus intermedius (taste fibres with cell bodies in the geniculate ganglion, and parasympathetic fibres from the superior salivatory nucleus).',
        'It enters the internal acoustic meatus with VIII, then the facial canal in the petrous temporal bone: laterally above the vestibule and cochlea, then bending backwards at the genu (geniculate ganglion), along the medial wall of the middle ear above the oval window, and down between the middle ear and mastoid antrum to the stylomastoid foramen. This course explains why middle ear and mastoid disease can damage it.',
        'Branches: the greater petrosal nerve (from the geniculate ganglion; taste from the palate and preganglionic fibres to the pterygopalatine ganglion; joined by the deep petrosal to form the Vidian nerve); the nerve to stapedius (lesion proximal to it → hyperacusis); the chorda tympani (crosses the eardrum and handle of the malleus, leaves through the petrotympanic fissure, joins the lingual nerve; taste from the anterior two-thirds of the tongue except the vallate papillae, and secretomotor fibres to the submandibular ganglion); and motor branches to stapedius, occipitalis, posterior auricular muscles, the posterior belly of digastric, stylohyoid and the muscles of facial expression via the temporal, zygomatic, buccal, mandibular and cervical branches.',
        'Bell’s palsy (often viral) is a lower motor neuron facial palsy: the eye cannot be closed voluntarily or reflexly; the lips cannot be pursed to whistle; the patient cannot wrinkle the forehead or show the teeth; lacrimal and salivary secretion are reduced (greater petrosal and chorda tympani); taste is lost on the anterior tongue; and hyperacusis occurs (stapedius).',
      ],
      table: {
        columns: ['Branch', 'Function'],
        rows: [
          ['Greater petrosal', 'Lacrimal, nasal, palatal glands (via pterygopalatine ganglion); palatal taste'],
          ['Nerve to stapedius', 'Damps loud sounds'],
          ['Chorda tympani', 'Taste anterior ⅔ tongue; submandibular and sublingual secretion'],
          ['Terminal (Temporal, Zygomatic, Buccal, Mandibular, Cervical)', 'Muscles of facial expression'],
        ],
      },
      terms: [
        { term: 'Nervus intermedius', meaning: 'Sensory/parasympathetic root of the facial nerve.' },
        { term: 'Geniculate ganglion', meaning: 'Sensory ganglion at the genu of the facial nerve (taste).' },
        { term: 'Bell’s palsy', meaning: 'Idiopathic (often viral) lower motor neuron facial nerve palsy.' },
      ],
      keyPoints: [
        'Five terminal branches: Temporal, Zygomatic, Buccal, Mandibular, Cervical.',
      ],
      sourceRefs: hn([412, 413, 414, 415]),
    },
    {
      title: 'Vestibulocochlear and Glossopharyngeal Nerves',
      kind: 'structure',
      paragraphs: [
        'The vestibulocochlear nerve (VIII) leaves the cerebellopontine angle with VII and passes through the internal acoustic meatus to the inner ear, dividing into the vestibular nerve (utricle, saccule, semicircular ducts) and the cochlear nerve (organ of Corti in the cochlear duct).',
        'The glossopharyngeal nerve (IX) arises from the retro-olivary sulcus of the medulla in line with VII above and X and XI below (each has branchiomotor fibres: VII to the 2nd arch, IX the 3rd, X the 4th and 6th). It leaves through the jugular foramen in front of X and XI, with a small superior and a larger inferior sensory ganglion.',
        'Branches of IX: the tympanic nerve (to the tympanic plexus — sensory to the middle ear, and parasympathetic fibres onward as the lesser petrosal nerve to the otic ganglion for the parotid); the carotid nerve (afferents from the carotid sinus baroreceptors and carotid body chemoreceptors); pharyngeal branches (sensory to the pharyngeal mucosa, joining X and the sympathetic trunk in the pharyngeal plexus); a muscular branch to stylopharyngeus; and tonsillar branches (mucosa of the palatine tonsil and soft palate).',
      ],
      terms: [
        { term: 'Jugular foramen', meaning: 'Skull opening transmitting CN IX, X and XI.' },
        { term: 'Carotid nerve', meaning: 'CN IX branch from the carotid sinus and body.' },
      ],
      keyPoints: [
        'IX: only muscle supplied is stylopharyngeus.',
        'IX → tympanic → lesser petrosal → otic ganglion → parotid.',
      ],
      sourceRefs: hn([415, 416]),
    },
    {
      title: 'Vagus, Accessory and Hypoglossal Nerves',
      kind: 'structure',
      paragraphs: [
        'The vagus (X) has the longest course and widest distribution of all cranial nerves. Components: general visceral efferent (parasympathetic to the heart, lungs and much of the gut); special visceral efferent (to muscles of the 4th and 6th arches); special visceral afferent (taste from the epiglottis and back of the tongue); and general somatic afferent (dura of the posterior cranial fossa and skin of the external acoustic meatus). It arises from the retro-olivary sulcus, leaves through the jugular foramen with superior and inferior ganglia, and runs in the carotid sheath between and behind the internal jugular vein and the internal/common carotid artery. The right vagus crosses in front of the right subclavian artery; the left enters the thorax between the left common carotid and subclavian arteries behind the brachiocephalic vein.',
        'Branches: meningeal; auricular (skin of the back of the auricle, external meatus and lower eardrum); pharyngeal (main motor supply of the pharyngeal muscles); superior laryngeal, dividing into the internal laryngeal nerve (pierces the thyrohyoid membrane; sensory to the mucosa above the vocal folds) and external laryngeal nerve (motor to cricothyroid); cardiac branches; and the recurrent laryngeal nerves — the right hooks under the subclavian artery and the left under the aortic arch, ascending between the trachea and oesophagus. They are closely related to the inferior thyroid artery and can be damaged in thyroid surgery; they supply all intrinsic laryngeal muscles except cricothyroid and the mucosa below the vocal folds. Thoracic and abdominal branches supply the heart, bronchial tree, oesophagus and gut to the transverse colon, with liver, biliary tract, pancreas, spleen and kidneys.',
        'The accessory nerve (XI) has a cranial root (nucleus ambiguus) that joins the vagus to supply muscles of the pharynx and larynx, and a spinal root from the upper five or six cervical segments that ascends through the foramen magnum and leaves through the jugular foramen, running down and back superficial to the internal jugular vein to supply sternocleidomastoid and trapezius.',
        'The hypoglossal nerve (XII) is a somatic motor nerve to the intrinsic and extrinsic muscles of its half of the tongue. It emerges from the pre-olivary sulcus (the only one of IX–XII that does not use the retro-olivary sulcus), leaves the skull through the hypoglossal canal, runs down between the internal jugular vein and internal carotid artery, crosses the external carotid and lingual arteries, hooks round the occipital artery and passes forward above the hyoid to supply hyoglossus, styloglossus, genioglossus and the intrinsic muscles. C1 fibres travelling with it go to geniohyoid and thyrohyoid and form the upper root of the ansa cervicalis for the infrahyoid muscles.',
      ],
      table: {
        columns: ['Nerve', 'Key motor targets'],
        rows: [
          ['Superior laryngeal → external', 'Cricothyroid'],
          ['Recurrent laryngeal', 'All other intrinsic laryngeal muscles'],
          ['Accessory (spinal root)', 'Sternocleidomastoid, trapezius'],
          ['Hypoglossal', 'Tongue muscles (except palatoglossus)'],
        ],
      },
      terms: [
        { term: 'Recurrent laryngeal nerve', meaning: 'Vagus branch hooking under the subclavian (right) or aortic arch (left) to the larynx.' },
        { term: 'Internal laryngeal nerve', meaning: 'Sensory branch piercing the thyrohyoid membrane; mucosa above the vocal folds.' },
      ],
      keyPoints: [
        'Recurrent laryngeal nerves are at risk in thyroid surgery (inferior thyroid artery).',
        'XII emerges from the pre-olivary sulcus.',
      ],
      notes: [{ kind: 'clarified', text: 'Slide 418 says the pharyngeal motor fibres come from the cranial root of the accessory nerve; Gray’s calls them vagal fibres from the nucleus ambiguus. Both describe the same fibres.' }],
      sourceRefs: [...hn([417, 418, 419, 420]), ...GRAYS],
    },
  ],
  summary: [
    'The facial nerve runs through the facial canal to the stylomastoid foramen; it gives the greater petrosal, stapedius and chorda tympani branches.',
    'Bell’s palsy: facial weakness, loss of taste anteriorly, reduced tears and saliva, hyperacusis.',
    'CN IX leaves via the jugular foramen and carries carotid sinus afferents and parotid secretomotor fibres.',
    'The vagus supplies the pharynx, larynx, heart, lungs and gut to the transverse colon.',
    'XI supplies sternocleidomastoid and trapezius; XII supplies the tongue muscles.',
  ],
  highYield: [
    'External laryngeal nerve → cricothyroid; recurrent laryngeal → all other intrinsic muscles.',
    'Chorda tympani: taste anterior ⅔ of tongue.',
    'IX, X, XI pass through the jugular foramen.',
  ],
  confusions: [
    {
      confusion: 'Thinking the recurrent laryngeal nerve supplies cricothyroid.',
      clarification: 'Cricothyroid is supplied by the external laryngeal branch of the superior laryngeal nerve (slides 418, 419).',
    },
  ],
};

// ─── Lesson 10: The Larynx ───────────────────────────────────────────

const lesson10: Draft = {
  id: L(10),
  title: 'The Larynx',
  description: 'The functions and cartilages of the larynx, its ligaments and membranes, the cavity with its folds and the rima glottidis, its extrinsic muscles, blood supply, lymph drainage and nerve supply.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: hn([421, 422, 423, 424, 427, 429, 431, 433, 436, 438, 443, 445, 446, 448, 450, 452, 454, 456, 460, 461, 462, 463, 465, 468, 470, 471, 472]),
  objectives: [
    'List the functions of the larynx.',
    'Describe the thyroid, cricoid, epiglottis, arytenoid, corniculate and cuneiform cartilages.',
    'Describe the laryngeal ligaments and membranes and laryngotomy.',
    'Describe the divisions of the laryngeal cavity, the vestibular and vocal folds and the rima glottidis.',
    'Describe the extrinsic muscles, blood supply, lymph drainage and innervation of the larynx.',
  ],
  chunks: [
    {
      title: 'Functions and Cartilages',
      kind: 'structure',
      paragraphs: [
        'The larynx is the organ of voice and part of the airway between the lower pharynx and the trachea. It acts as a compound sphincter that stops food and drink entering the airway in swallowing; closes the rima glottidis for the Valsalva manoeuvre (coughing, sneezing, micturition, defecation, childbirth); regulates airflow for phonation; and forms a cartilage framework for ligaments and muscles.',
        'The thyroid cartilage is the largest — a single hyaline cartilage of two laminae fused in front at about 90° in males (forming the laryngeal prominence, Adam’s apple) and up to 120° in females (no prominence). Its superior horns attach by the thyrohyoid ligament to the hyoid; its inferior horns articulate with the cricoid. Thyrohyoid, sternothyroid and the inferior constrictor attach to it.',
        'The cricoid cartilage is a single hyaline signet-ring cartilage at C6; it articulates with the thyroid, and its lower border marks the end of the larynx and laryngopharynx. The epiglottis is a single leaf-shaped elastic cartilage behind the root of the tongue, forming the upper anterior wall of the larynx, its stalk attached to the back of the thyroid cartilage. Epiglottitis can cause life-threatening airway obstruction, especially in children.',
        'The paired arytenoid cartilages are pyramidal, part elastic and part hyaline, sitting on and rotating on the cricoid to open and close the rima glottidis. Their vocal processes attach the vocal ligament and vocalis; their muscular processes attach thyroarytenoid and the lateral and posterior cricoarytenoids. The corniculate cartilages (paired, elastic) sit on the arytenoid apices in the aryepiglottic folds; the cuneiform cartilages (paired, elastic) lie in the aryepiglottic folds in front of them. Laryngitis — inflammation of the laryngeal mucosa — causes a sore throat, hoarseness, cough and dysphagia.',
      ],
      table: {
        columns: ['Cartilage', 'Single/paired', 'Type'],
        rows: [
          ['Thyroid', 'Single', 'Hyaline'],
          ['Cricoid', 'Single', 'Hyaline'],
          ['Epiglottis', 'Single', 'Elastic'],
          ['Arytenoid', 'Paired', 'Hyaline and elastic'],
          ['Corniculate', 'Paired', 'Elastic'],
          ['Cuneiform', 'Paired', 'Elastic'],
        ],
      },
      terms: [
        { term: 'Laryngeal prominence', meaning: 'Adam’s apple: anterior angle of the thyroid laminae in males.' },
        { term: 'Cricoid cartilage', meaning: 'Complete signet-ring cartilage at C6.' },
        { term: 'Vocal process', meaning: 'Arytenoid process attaching the vocal ligament.' },
      ],
      keyPoints: [
        'Cricoid = only complete cartilage ring; C6.',
        'Thyroid angle: 90° male, 120° female.',
      ],
      sourceRefs: hn([421, 422, 423, 424, 426, 427, 429, 431, 433, 435, 436, 438, 439, 441]),
    },
    {
      title: 'Ligaments, Cavity and Folds',
      kind: 'structure',
      paragraphs: [
        'The thyrohyoid membrane runs from the thyroid cartilage to the hyoid; its thick middle part is the median thyrohyoid ligament, and its lateral part is pierced by the internal laryngeal nerve and superior laryngeal vessels. The cricothyroid ligament runs from the cricoid arch to the thyroid cartilage and vocal processes. The vocal ligament runs from the back of the thyroid cartilage to the vocal process and is the upper border of the conus elasticus (cricovocal membrane), which extends from the upper border of the cricoid to the vocal ligaments. The vestibular ligament runs from the thyroid cartilage to the anterolateral arytenoid.',
        'Laryngotomy is an emergency opening into the larynx — through the cricothyroid membrane (cricothyrotomy), the thyroid cartilage (thyrotomy) or the thyrohyoid membrane (superior laryngotomy) — for severe oedema or an impacted foreign body.',
        'The vestibular and vocal folds divide the cavity into the vestibule (laryngeal inlet to vestibular folds), the ventricles (between vestibular and vocal folds) and the infraglottic cavity (rima glottidis to the lower border of the cricoid).',
        'The vestibular folds (false vocal cords) run from the thyroid cartilage above the vocal ligament to the arytenoid. The vocal folds (true vocal cords) run from the angle of the thyroid cartilage to the vocal processes; they contain the vocal ligament near the free edge and the vocalis muscle forming their bulk, and control the air stream for voice. The rima glottidis — the space between the vocal folds and arytenoids — is the narrowest part of the laryngeal cavity; it is wide in inspiration and narrow and wedge-shaped in expiration and phonation.',
      ],
      steps: [
        { label: 'Vestibule', detail: 'From the laryngeal inlet to the vestibular folds.' },
        { label: 'Ventricle', detail: 'Between the vestibular and vocal folds.' },
        { label: 'Infraglottic cavity', detail: 'From the rima glottidis to the lower border of the cricoid.' },
      ],
      terms: [
        { term: 'Conus elasticus', meaning: 'Cricovocal membrane from the cricoid to the vocal ligaments.' },
        { term: 'Rima glottidis', meaning: 'Gap between the vocal folds — the narrowest part of the larynx.' },
        { term: 'Cricothyrotomy', meaning: 'Emergency airway through the cricothyroid membrane.' },
      ],
      keyPoints: [
        'Emergency airway: cricothyroid membrane.',
        'Vocal folds = true cords; vestibular folds = false cords.',
      ],
      sourceRefs: hn([443, 445, 446, 448, 450, 452, 454, 455, 456, 457, 460]),
    },
    {
      title: 'Muscles, Blood Supply, Lymph and Nerves',
      kind: 'structure',
      paragraphs: [
        'The extrinsic muscles move the larynx up and down in swallowing; many attach to the hyoid. Elevators: digastric, stylohyoid, mylohyoid, geniohyoid, stylopharyngeus, salpingopharyngeus and palatopharyngeus. Depressors: sternothyroid, sternohyoid and omohyoid.',
        'The upper half of the larynx is supplied by the superior laryngeal branch of the superior thyroid artery; the lower half by the inferior laryngeal branch of the inferior thyroid artery. Lymph drains to the deep cervical nodes.',
        'The recurrent laryngeal nerve supplies all intrinsic muscles except cricothyroid and gives sensation below the vocal folds; its terminal part above the lower border of the cricoid is called the inferior laryngeal nerve. The superior laryngeal nerve (vagus) divides into the internal laryngeal nerve — sensory to the mucosa above the vocal folds and the taste buds on the epiglottis, piercing the thyrohyoid membrane with the superior laryngeal artery — and the external laryngeal nerve, which supplies cricothyroid and the cricopharyngeus part of the inferior constrictor and runs with the superior thyroid artery.',
      ],
      table: {
        columns: ['Nerve', 'Motor', 'Sensory'],
        rows: [
          ['Internal laryngeal', '—', 'Mucosa above vocal folds; epiglottic taste'],
          ['External laryngeal', 'Cricothyroid, cricopharyngeus', '—'],
          ['Recurrent laryngeal', 'All other intrinsic muscles', 'Mucosa below vocal folds'],
        ],
      },
      terms: [
        { term: 'External laryngeal nerve', meaning: 'Motor to cricothyroid; runs with the superior thyroid artery.' },
      ],
      keyPoints: [
        'Vocal folds are the sensory watershed: internal laryngeal above, recurrent laryngeal below.',
        'External laryngeal nerve at risk when ligating the superior thyroid artery.',
      ],
      sourceRefs: hn([461, 462, 463, 465, 468, 470, 471, 472]),
    },
  ],
  summary: [
    'The larynx protects the airway, closes for Valsalva and produces voice.',
    'Single cartilages: thyroid, cricoid, epiglottis; paired: arytenoid, corniculate, cuneiform.',
    'The cavity has a vestibule, ventricle and infraglottic cavity; the rima glottidis is its narrowest part.',
    'Cricothyrotomy opens the airway through the cricothyroid membrane.',
    'Recurrent laryngeal supplies all intrinsic muscles except cricothyroid (external laryngeal).',
  ],
  highYield: [
    'Internal laryngeal nerve pierces the thyrohyoid membrane.',
    'Cricoid at C6.',
    'Epiglottis is elastic cartilage.',
  ],
  confusions: [
    {
      confusion: 'Thinking the vestibular folds produce the voice.',
      clarification: 'The vocal (true) folds with the vocal ligament and vocalis control phonation; the vestibular folds are the false cords (slides 457, 460).',
    },
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9, lesson10].map((lesson) => ({
  ...lesson,
  interactive: interactive[lesson.id],
}));
