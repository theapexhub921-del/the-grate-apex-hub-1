// Anatomy → Respiratory System (gross): the seven lessons (reading layer).
import type { LessonDraft } from '@/data/topics/build';
import { interactive } from '@/data/topics/respiratory-system-gross/interactive';
import { GRAYS, rs, TOPIC_ID, type ConceptId } from '@/data/topics/respiratory-system-gross/sources';

type Draft = LessonDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

// ─── Lesson 1: Upper Airway — Nasal Cavity and Pharynx ───────────────

const lesson1: Draft = {
  id: L(1),
  title: 'Upper Airway: Nasal Cavity and Pharynx',
  description: 'How the respiratory system is divided, the nose and nasal cavity, the three parts of the pharynx and the ring of lymphoid tissue that guards it.',
  xp: 25,
  estimatedMinutes: 13,
  sourceRefs: rs([16, 17, 19, 24, 26, 30, 32, 37, 40, 42, 44]),
  objectives: [
    'Divide the respiratory system into conducting and respiratory parts, and into upper and lower tracts.',
    'Describe the openings, vestibule and septum of the nasal cavity.',
    'Give the extent, muscular wall and three parts of the pharynx with their features.',
    'Name the components of Waldeyer’s tonsillar ring.',
  ],
  chunks: [
    {
      title: 'Components of the Respiratory System',
      kind: 'overview',
      paragraphs: [
        'The respiratory system has a conducting division — nasal cavity, pharynx, larynx, trachea, bronchi and bronchioles — and a respiratory division, the lungs and alveoli where gas exchange happens.',
        'Clinically it is also divided into an upper respiratory tract (nasal cavity, pharynx, larynx and trachea with associated structures) and a lower respiratory tract (bronchi, bronchioles and lungs).',
        'Respiratory movements are produced by the diaphragm and the muscles of the thoracic wall. The lungs lie within the thoracic cavity.',
      ],
      table: {
        columns: ['Division', 'Parts'],
        rows: [
          ['Conducting', 'Nasal cavity, pharynx, larynx, trachea, bronchi, bronchioles'],
          ['Respiratory', 'Lungs / alveoli'],
          ['Upper tract (lecture)', 'Nasal cavity, pharynx, larynx, trachea'],
          ['Lower tract (lecture)', 'Bronchi, bronchioles, lungs'],
        ],
      },
      keyPoints: [
        'Conducting division moves air; respiratory division exchanges gas.',
        'In this lecture the upper respiratory tract includes the trachea.',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on the IRAT slides give two answers: the short thick hairs at the nostril are vibrissae, and the trachea, larynx and bronchi are examples of hyaline cartilage in the airway.' }],
      sourceRefs: rs([9, 10, 16, 17]),
    },
    {
      title: 'The Nose and Nasal Cavity',
      kind: 'structure',
      paragraphs: [
        'The nasal cavity lies inside the nose and joins the pharynx posteriorly. It has two sets of openings: the external nares (nostrils, anterior nasal apertures) in front, and the internal nares (choanae, posterior nasal apertures) opening into the pharynx behind.',
        'The anterior part just inside the nostril is the vestibule. The nasal septum divides the cavity into right and left halves; the posterior half of the septum is bony (vomer and the perpendicular plate of the ethmoid) and the anterior half is nasal (septal) cartilage.',
        'Epistaxis is bleeding from the nose. Because the olfactory region lies in the roof of the nasal cavity, nasal conditions that block or inflame it can produce anosmia (loss of smell).',
      ],
      terms: [
        { term: 'Choanae', meaning: 'Posterior nasal apertures, opening from the nasal cavity into the nasopharynx.' },
        { term: 'Vestibule', meaning: 'Skin-lined front part of the nasal cavity just inside the nostril.' },
        { term: 'Nasal septum', meaning: 'Partition between the two halves of the nasal cavity: vomer, ethmoid and septal cartilage.' },
        { term: 'Anosmia', meaning: 'Loss of the sense of smell.' },
        { term: 'Epistaxis', meaning: 'Nosebleed.' },
      ],
      keyPoints: [
        'Bony septum = vomer + perpendicular plate of ethmoid; anterior septum = cartilage.',
      ],
      notes: [{ kind: 'textbook', text: 'Slide 24 asks for the bones of the lateral wall and floor. Gray’s: the floor is the palatine process of the maxilla and horizontal plate of the palatine bone; the lateral wall carries the three conchae (see the Head and Neck lesson on the nasal cavity).' }],
      sourceRefs: [...rs([19, 24, 26]), ...GRAYS],
    },
    {
      title: 'The Pharynx',
      kind: 'structure',
      paragraphs: [
        'The pharynx is a fibromuscular tube about 12 cm long. It extends from the base of the skull above to become continuous with the oesophagus below, and in front it communicates with the nose, mouth and larynx. It has three parts: nasopharynx, oropharynx and laryngopharynx.',
        'Its muscular wall consists of three curved sheets — the superior, middle and inferior constrictors — supplemented by stylopharyngeus, palatopharyngeus and salpingopharyngeus.',
        'The nasopharynx extends from the base of the skull to the upper surface of the soft palate (C1 level) and communicates with the nasal cavity through the choanae. Its features are the opening of the auditory tube on the lateral wall, the pharyngeal recess and the pharyngeal tonsil.',
        'The oropharynx extends from the lower surface of the soft palate to the upper border of the epiglottis (about mid-C3). Its posterior wall is formed by all three constrictors. Anteriorly it communicates with the mouth and is related to the posterior tongue (lingual tonsil and vallecula). Its lateral wall has the palatoglossal and palatopharyngeal arches (pillars of the fauces) with the palatine tonsil between them.',
        'The laryngopharynx extends from the upper border of the epiglottis to the lower border of the cricoid cartilage (C6). Anteriorly it opens into the larynx (laryngeal inlet, or aditus) with a piriform recess on each side; lower down its anterior wall is the arytenoids and lamina of the cricoid.',
      ],
      table: {
        columns: ['Part', 'Extent', 'Key features'],
        rows: [
          ['Nasopharynx', 'Skull base → upper surface of soft palate (C1)', 'Auditory tube opening, pharyngeal recess, pharyngeal tonsil'],
          ['Oropharynx', 'Soft palate → upper border of epiglottis (C3)', 'Palatine tonsil between palatoglossal and palatopharyngeal arches; vallecula'],
          ['Laryngopharynx', 'Epiglottis → lower border of cricoid (C6)', 'Laryngeal inlet, piriform recesses'],
        ],
      },
      terms: [
        { term: 'Pharyngeal constrictors', meaning: 'Superior, middle and inferior curved muscle sheets of the pharyngeal wall.' },
        { term: 'Piriform recess', meaning: 'Recess on each side of the laryngeal inlet in the laryngopharynx.' },
        { term: 'Vallecula', meaning: 'Depression between the back of the tongue and the epiglottis.' },
      ],
      keyPoints: [
        'Pharynx: ~12 cm, skull base to C6, continuous with the oesophagus.',
        'The auditory tube opens into the nasopharynx.',
      ],
      sourceRefs: rs([30, 32, 36, 37, 40, 42]),
    },
    {
      title: 'Waldeyer’s Tonsillar Ring',
      kind: 'structure',
      paragraphs: [
        'Waldeyer’s ring is a ring of lymphoid tissue in the pharynx that acts as a barrier to infection, especially in the first few years of life.',
        'From superior to inferior it consists of the adenoids (pharyngeal tonsils), the tubal tonsils, the palatine tonsils and the lingual tonsil.',
      ],
      steps: [
        { label: 'Adenoids (pharyngeal tonsil)', detail: 'Roof and back of the nasopharynx.' },
        { label: 'Tubal tonsils', detail: 'Around the openings of the auditory tubes.' },
        { label: 'Palatine tonsils', detail: 'Between the palatine arches in the oropharynx.' },
        { label: 'Lingual tonsil', detail: 'On the posterior part of the tongue.' },
      ],
      terms: [
        { term: 'Waldeyer’s ring', meaning: 'Ring of pharyngeal lymphoid tissue (adenoids, tubal, palatine and lingual tonsils).' },
        { term: 'Adenoids', meaning: 'The pharyngeal tonsil in the nasopharynx.' },
      ],
      keyPoints: [
        'Order from above: adenoids → tubal → palatine → lingual tonsil.',
      ],
      sourceRefs: rs([44]),
    },
  ],
  summary: [
    'The conducting division runs from the nasal cavity to the bronchioles; the respiratory division is the lungs/alveoli.',
    'The nasal cavity opens anteriorly at the nostrils and posteriorly at the choanae; the septum is bony behind and cartilaginous in front.',
    'The pharynx is a 12 cm fibromuscular tube from the skull base to C6 with naso-, oro- and laryngopharynx.',
    'Its wall is formed by three constrictors plus stylopharyngeus, palatopharyngeus and salpingopharyngeus.',
    'Waldeyer’s ring: adenoids, tubal, palatine and lingual tonsils.',
  ],
  highYield: [
    'Nasopharynx ends at the soft palate (C1); oropharynx at the epiglottis (C3); laryngopharynx at the cricoid (C6).',
    'Auditory tube opens on the lateral wall of the nasopharynx.',
    'Palatine tonsil lies between the palatoglossal and palatopharyngeal arches.',
  ],
  confusions: [
    {
      confusion: 'Thinking the choanae are the nostrils.',
      clarification: 'The nostrils are the external (anterior) nares; the choanae are the internal (posterior) nares opening into the nasopharynx (slide 19).',
    },
  ],
};

// ─── Lesson 2: The Larynx ────────────────────────────────────────────

const lesson2: Draft = {
  id: L(2),
  title: 'The Larynx',
  description: 'The organ of voice: its position and vertebral level, how it changes with age and sex, its nine cartilages, its ligaments and membranes, and the boundaries of the laryngeal inlet.',
  xp: 25,
  estimatedMinutes: 11,
  sourceRefs: rs([46, 57, 59, 62, 65, 86]),
  objectives: [
    'State the position and vertebral levels of the larynx.',
    'Describe the age and sex changes of the larynx.',
    'Name the nine cartilages of the larynx (single and paired).',
    'Classify the laryngeal ligaments and membranes as intrinsic or extrinsic.',
    'Give the boundaries of the laryngeal aditus.',
  ],
  chunks: [
    {
      title: 'Position of the Larynx',
      kind: 'structure',
      paragraphs: [
        'The larynx — the organ of voice — lies at the upper part of the air passage, between the trachea and the root of the tongue. It forms a projection in the midline of the neck, the laryngeal prominence (Adam’s apple), and forms the lower part of the anterior wall of the pharynx.',
        'Its cavity is lined by mucous membrane, and the great vessels of the neck lie on each side. Its vertical extent corresponds to the C4, C5 and C6 vertebrae, but it lies somewhat higher in females and in children.',
      ],
      terms: [
        { term: 'Laryngeal prominence', meaning: 'Midline projection of the thyroid cartilage (Adam’s apple).' },
      ],
      keyPoints: [
        'The larynx spans C4–C6 in the adult male; higher in females and children.',
      ],
      sourceRefs: rs([46, 57]),
    },
    {
      title: 'Age and Sex Changes',
      kind: 'comparison',
      paragraphs: [
        'Until puberty the male larynx differs little in size from the female. After puberty the female larynx enlarges only slightly, whereas the male larynx enlarges considerably.',
        'In the male all the cartilages enlarge, the thyroid cartilage becomes prominent in the midline of the neck, and the length of the rima glottidis (the opening between the vocal folds) nearly doubles — which is why the voice deepens.',
      ],
      terms: [
        { term: 'Rima glottidis', meaning: 'The opening between the vocal folds; nearly doubles in length in the male at puberty.' },
      ],
      keyPoints: [
        'At male puberty: cartilages enlarge, thyroid prominence appears, rima glottidis nearly doubles.',
      ],
      sourceRefs: rs([59]),
    },
    {
      title: 'Cartilages, Ligaments and Membranes',
      kind: 'classification',
      paragraphs: [
        'There are nine laryngeal cartilages — three single and three paired. The single cartilages are the thyroid, cricoid and epiglottis. The paired cartilages are the arytenoid, corniculate and cuneiform.',
        'The ligaments and membranes are grouped as intrinsic (within the larynx) and extrinsic (joining the larynx to neighbouring structures). Intrinsic: the quadrangular membrane, the cricothyroid ligament and the thyroepiglottic ligament. Extrinsic: the thyrohyoid membrane and the cricotracheal and hyoepiglottic ligaments.',
      ],
      table: {
        columns: ['Group', 'Members'],
        rows: [
          ['Single cartilages', 'Thyroid, cricoid, epiglottis'],
          ['Paired cartilages', 'Arytenoid, corniculate, cuneiform'],
          ['Intrinsic ligaments/membranes', 'Quadrangular membrane, cricothyroid ligament, thyroepiglottic ligament'],
          ['Extrinsic ligaments/membranes', 'Thyrohyoid membrane, cricotracheal ligament, hyoepiglottic ligament'],
        ],
      },
      terms: [
        { term: 'Thyrohyoid membrane', meaning: 'Extrinsic membrane joining the thyroid cartilage to the hyoid bone.' },
        { term: 'Quadrangular membrane', meaning: 'Intrinsic membrane between the epiglottis and arytenoids; its lower edge is the vestibular ligament.' },
        { term: 'Cricotracheal ligament', meaning: 'Extrinsic ligament joining the cricoid cartilage to the first tracheal ring.' },
      ],
      keyPoints: [
        '9 cartilages: 3 single (thyroid, cricoid, epiglottis) + 3 pairs (arytenoid, corniculate, cuneiform).',
        'Extrinsic membranes link the larynx to the hyoid above and the trachea below.',
      ],
      sourceRefs: rs([62, 64, 65, 66]),
    },
    {
      title: 'The Laryngeal Aditus (Inlet)',
      kind: 'structure',
      paragraphs: [
        'The opening of the larynx lies in the anterior wall of the laryngopharynx. It is bounded in front by the epiglottis; behind by the apices of the arytenoid cartilages, the corniculate cartilages and the interarytenoid notch; and at the sides by the aryepiglottic folds, which contain the cuneiform tubercles.',
      ],
      table: {
        columns: ['Boundary', 'Formed by'],
        rows: [
          ['Anterior', 'Epiglottis'],
          ['Posterior', 'Apices of arytenoids, corniculate cartilages, interarytenoid notch'],
          ['Lateral', 'Aryepiglottic folds with the cuneiform tubercles'],
        ],
      },
      terms: [
        { term: 'Aryepiglottic fold', meaning: 'Mucosal fold from the epiglottis to the arytenoid, forming the side of the laryngeal inlet.' },
        { term: 'Laryngeal aditus', meaning: 'The inlet of the larynx, opening from the laryngopharynx.' },
      ],
      keyPoints: [
        'The cuneiform cartilages sit in the aryepiglottic folds; the corniculates on the arytenoid apices.',
      ],
      sourceRefs: rs([86, 87, 88]),
    },
  ],
  summary: [
    'The larynx lies between the root of the tongue and the trachea, at C4–C6.',
    'At male puberty the cartilages enlarge and the rima glottidis nearly doubles.',
    'There are nine cartilages: thyroid, cricoid, epiglottis, and paired arytenoid, corniculate and cuneiform.',
    'Intrinsic: quadrangular membrane, cricothyroid and thyroepiglottic ligaments; extrinsic: thyrohyoid membrane, cricotracheal and hyoepiglottic ligaments.',
    'The inlet is bounded by the epiglottis, aryepiglottic folds and arytenoid/corniculate cartilages.',
  ],
  highYield: [
    'Larynx = C4, C5, C6.',
    'Single cartilages: thyroid, cricoid, epiglottis.',
    'Aryepiglottic folds form the lateral boundaries of the laryngeal inlet.',
  ],
  confusions: [
    {
      confusion: 'Calling the thyrohyoid membrane an intrinsic membrane.',
      clarification: 'It joins the larynx to the hyoid bone, so it is extrinsic (slide 65).',
    },
  ],
};

// ─── Lesson 3: The Trachea ───────────────────────────────────────────

const lesson3: Draft = {
  id: L(3),
  title: 'The Trachea',
  description: 'The windpipe from the larynx to the carina: its size, its relations in the neck and in the superior mediastinum, and its blood, lymph and nerve supply.',
  xp: 25,
  estimatedMinutes: 11,
  sourceRefs: rs([98, 101, 102, 104, 105, 106, 109, 111]),
  objectives: [
    'Give the extent, length and diameter of the trachea.',
    'List the relations of the trachea in the neck.',
    'List the relations of the trachea in the thorax.',
    'Describe its blood supply, venous drainage, lymph drainage and nerve supply.',
  ],
  chunks: [
    {
      title: 'Extent and Size',
      kind: 'structure',
      paragraphs: [
        'The trachea (windpipe) is a cartilaginous and membranous tube. It extends from the lower part of the larynx at C6 to the upper border of T5, where it divides into the two main bronchi at the carina.',
        'It is about 10 cm long and 2–2.5 cm wide from side to side, larger in males than females. In the child the trachea is smaller, more deeply placed and more mobile than in the adult.',
      ],
      terms: [
        { term: 'Carina', meaning: 'The ridge at the tracheal bifurcation where the two main bronchi begin.' },
      ],
      keyPoints: [
        'Trachea: C6 → upper border of T5; ~10 cm long, 2–2.5 cm wide.',
      ],
      sourceRefs: rs([98, 99]),
    },
    {
      title: 'Relations in the Neck',
      kind: 'structure',
      paragraphs: [
        'Anteriorly, from above down: the isthmus of the thyroid gland, the inferior thyroid veins, the arteria thyroidea ima (when present), the sternothyroid and sternohyoid muscles, the deep cervical fascia, and the anastomosing branches between the anterior jugular veins.',
        'Laterally: the common carotid arteries, the right and left lobes of the thyroid gland, the inferior thyroid arteries and the recurrent laryngeal nerves. Posteriorly: the oesophagus.',
      ],
      table: {
        columns: ['Side', 'Relations in the neck'],
        rows: [
          ['Anterior', 'Thyroid isthmus, inferior thyroid veins, thyroidea ima artery, sternothyroid and sternohyoid, deep fascia, anterior jugular communications'],
          ['Lateral', 'Common carotid arteries, thyroid lobes, inferior thyroid arteries, recurrent laryngeal nerves'],
          ['Posterior', 'Oesophagus'],
        ],
      },
      terms: [
        { term: 'Arteria thyroidea ima', meaning: 'Inconstant artery to the thyroid isthmus that runs on the front of the trachea.' },
        { term: 'Recurrent laryngeal nerve', meaning: 'Branch of the vagus running up beside the trachea to the larynx.' },
      ],
      keyPoints: [
        'The thyroid isthmus crosses the front of the upper trachea; the recurrent laryngeal nerves lie beside it.',
      ],
      sourceRefs: rs([101, 102, 103]),
    },
    {
      title: 'Relations in the Thorax',
      kind: 'structure',
      paragraphs: [
        'In the thorax the trachea lies in the superior mediastinum. Anteriorly, from before backward: the manubrium sterni, the remains of the thymus, the left brachiocephalic vein, the aortic arch with the brachiocephalic trunk and left common carotid artery, and the deep cardiac plexus.',
        'On its right side lie the pleura, the right vagus and the brachiocephalic artery. On its left side lie the left recurrent laryngeal nerve, the aortic arch, and the left common carotid and subclavian arteries.',
      ],
      table: {
        columns: ['Side', 'Relations in the thorax'],
        rows: [
          ['Anterior', 'Manubrium, thymus remnant, left brachiocephalic vein, arch of aorta, brachiocephalic trunk, left common carotid, deep cardiac plexus'],
          ['Right', 'Pleura, right vagus, brachiocephalic artery'],
          ['Left', 'Left recurrent laryngeal nerve, arch of aorta, left common carotid and left subclavian arteries'],
        ],
      },
      keyPoints: [
        'The right vagus lies on the right of the trachea; the left recurrent laryngeal nerve on its left.',
      ],
      sourceRefs: rs([104, 105]),
    },
    {
      title: 'Blood, Lymph and Nerve Supply',
      kind: 'structure',
      paragraphs: [
        'Arteries: branches of the inferior thyroid and bronchial arteries, which form anastomotic networks on the tracheal wall. Veins: the inferior thyroid veins.',
        'Lymph drains to the pretracheal and paratracheal nodes and to the inferior deep cervical nodes.',
        'Nerves: the mucous membrane is supplied by the vagus via the recurrent laryngeal nerves; the smooth muscle and blood vessels receive sympathetic fibres from the upper ganglia of the sympathetic trunk.',
      ],
      table: {
        columns: ['Supply', 'Source'],
        rows: [
          ['Arterial', 'Inferior thyroid and bronchial arteries'],
          ['Venous', 'Inferior thyroid veins'],
          ['Lymph', 'Pre- and paratracheal nodes; inferior deep cervical nodes'],
          ['Mucosa', 'Vagus / recurrent laryngeal nerves'],
          ['Smooth muscle and vessels', 'Upper sympathetic ganglia'],
        ],
      },
      keyPoints: [
        'Inferior thyroid artery + bronchial arteries supply the trachea.',
      ],
      sourceRefs: rs([106, 107, 109, 111]),
    },
  ],
  summary: [
    'The trachea runs from C6 to the upper border of T5 and divides at the carina.',
    'It is about 10 cm long and 2–2.5 cm wide.',
    'In the neck the thyroid isthmus lies in front and the oesophagus behind.',
    'In the thorax the left brachiocephalic vein and aortic arch lie in front; the right vagus on the right and left recurrent laryngeal nerve on the left.',
    'It is supplied by the inferior thyroid and bronchial arteries and drains to pre- and paratracheal nodes.',
  ],
  highYield: [
    'Tracheal bifurcation (carina): upper border of T5.',
    'Posterior relation in the neck: oesophagus.',
    'Mucosa supplied by the vagus/recurrent laryngeal nerves.',
  ],
  confusions: [
    {
      confusion: 'Placing the left recurrent laryngeal nerve on the right of the trachea in the thorax.',
      clarification: 'In the thorax the right vagus is on the right; the left recurrent laryngeal nerve hooks under the arch and lies on the left (slide 105).',
    },
  ],
};

// ─── Lesson 4: The Thoracic Wall ─────────────────────────────────────

const lesson4: Draft = {
  id: L(4),
  title: 'The Thoracic Wall',
  description: 'What makes up the thorax, the structure of its wall and its muscles, the thoracic inlet and outlet, the intercostal spaces and the joints that let the chest move in breathing.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: rs([117, 118, 131, 132, 135, 136, 144, 148, 150, 151, 153, 155, 159, 167, 172, 173, 199, 200, 203]),
  objectives: [
    'List the components of the thoracic wall and cavity.',
    'Describe what forms the thoracic wall on each side.',
    'Name the extrinsic muscles and the three layers of intercostal muscles, and describe the serratus posterior muscles.',
    'Give the boundaries of the thoracic inlet and outlet.',
    'Explain the neurovascular plane of an intercostal space and name the joints of the thoracic wall.',
  ],
  chunks: [
    {
      title: 'Components and Structure of the Thoracic Wall',
      kind: 'structure',
      paragraphs: [
        'The thorax consists of a wall and a cavity. The thoracic wall includes the thoracic cage (bony thorax), the intercostal spaces, the diaphragm, the skin and subcutaneous tissue, and the breast. The thoracic cavity is divided into the pleural cavities with the lungs and the mediastinum (superior, anterior, middle and posterior).',
        'The wall is formed posteriorly by the 12 thoracic vertebrae and intervertebral discs, anteriorly by the sternum and costal cartilages, laterally by the ribs and intercostal spaces, superiorly by the suprapleural membrane and inferiorly by the diaphragm. The bony framework is the osteocartilaginous thoracic cage.',
        'The wall is covered by skin and superficial and deep fascia; the breast lies in the subcutaneous tissue. Its muscles are extrinsic (e.g. those attaching the pectoral girdle and upper limb to the trunk) and intrinsic (e.g. the intercostal muscles).',
      ],
      table: {
        columns: ['Aspect', 'Formed by'],
        rows: [
          ['Posterior', '12 thoracic vertebrae and intervertebral discs'],
          ['Anterior', 'Sternum and costal cartilages'],
          ['Lateral', 'Ribs and intercostal spaces'],
          ['Superior', 'Suprapleural membrane'],
          ['Inferior', 'Diaphragm'],
        ],
      },
      terms: [
        { term: 'Suprapleural membrane', meaning: 'Fascial sheet closing the thoracic inlet over the cervical pleura.' },
        { term: 'Thoracic cage', meaning: 'The osteocartilaginous framework: vertebrae, ribs, costal cartilages and sternum.' },
      ],
      keyPoints: [
        'Thoracic cavity = two pleural cavities + mediastinum.',
      ],
      sourceRefs: rs([117, 118, 119, 132, 135]),
    },
    {
      title: 'Muscles of the Thoracic Wall',
      kind: 'classification',
      paragraphs: [
        'Extrinsic muscles: pectoralis major, pectoralis minor, serratus anterior, subclavius and sternocleidomastoid.',
        'The intercostal muscles lie in three layers: the external intercostal (outer layer), the internal intercostal (middle layer) and an inner layer of three muscles — subcostal, innermost intercostal and transversus thoracis.',
        'Two small muscles of the external layer have migrated posteriorly onto the surface of erector spinae: the serratus posterior muscles. Each arises from four spinous processes (two in the thorax and two beyond it), inserts into four ribs and is supplied by anterior rami. Serratus posterior superior arises from the lowest two cervical and upper two thoracic spines (C6–T2) and inserts just lateral to the angles of ribs 2–5; the dorsal scapular nerve and vessels run on it, deep to the rhomboids. Serratus posterior inferior arises from the lower two thoracic and upper two lumbar spines (T11–L2) and inserts into the lowest four ribs.',
        'The serratus posterior muscles are weak muscles of respiration: the superior elevates the upper ribs (inspiration) and the inferior depresses the lower ribs (expiration).',
      ],
      table: {
        columns: ['Muscle', 'Origin', 'Insertion', 'Action'],
        rows: [
          ['Serratus posterior superior', 'Spines C6–T2', 'Ribs 2–5 (lateral to angles)', 'Elevates upper ribs (inspiration)'],
          ['Serratus posterior inferior', 'Spines T11–L2', 'Lowest 4 ribs', 'Depresses lower ribs (expiration)'],
        ],
      },
      terms: [
        { term: 'Innermost intercostal', meaning: 'Part of the inner layer of intercostal muscles, with subcostalis and transversus thoracis.' },
        { term: 'Serratus posterior', meaning: 'Two small posteriorly migrated muscles of the external layer, weak muscles of respiration.' },
      ],
      keyPoints: [
        'Three intercostal layers: external, internal, inner (subcostal, innermost intercostal, transversus thoracis).',
        'Serratus posterior superior = inspiration; inferior = expiration.',
      ],
      sourceRefs: rs([136, 144, 148, 150, 151, 153, 155, 157, 159]),
    },
    {
      title: 'The Thoracic Apertures',
      kind: 'structure',
      paragraphs: [
        'The superior thoracic aperture (inlet) lies at the root of the neck. It slopes anteroinferiorly because of the obliquity of the first rib, and is bounded by the T1 vertebra, the first pair of ribs and their costal cartilages, and the superior border of the manubrium. Compression of structures passing through it causes thoracic inlet (outlet) syndrome.',
        'The inferior thoracic aperture (outlet) is the lower opening of the thoracic cavity. It slopes obliquely downward and backward, so the thoracic cavity is much deeper behind than in front. The diaphragm closes it and forms the floor of the thorax; the floor is flatter centrally than at the sides and higher on the right than on the left.',
        'On the right the dome reaches the upper border of the 5th costal cartilage; on the left only the 6th costal cartilage. From the highest point each side slopes suddenly down to the costal and vertebral attachments (an inverted J-shape), leaving only a narrow space between the diaphragm and the posterior chest wall — the costodiaphragmatic recess. The diaphragm attaches anteriorly at T7 level and posteriorly at T12.',
      ],
      table: {
        columns: ['Aperture', 'Boundaries'],
        rows: [
          ['Inlet (superior)', 'T1 vertebra, first ribs and costal cartilages, superior border of manubrium'],
          ['Outlet (inferior)', 'Closed by the diaphragm; deeper behind than in front'],
        ],
      },
      terms: [
        { term: 'Thoracic inlet', meaning: 'Superior thoracic aperture at the root of the neck.' },
        { term: 'Thoracic outlet', meaning: 'Inferior thoracic aperture, sealed by the diaphragm.' },
        { term: 'Costodiaphragmatic recess', meaning: 'Narrow gap between the sloping diaphragm and the posterior chest wall.' },
      ],
      keyPoints: [
        'Right dome higher (5th costal cartilage) than left (6th).',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the outlet is bounded by T12, the 12th and 11th ribs, the costal margin and the xiphisternal joint (slide 172 asks this).' }],
      sourceRefs: [...rs([131, 167, 171, 172, 173]), ...GRAYS],
    },
    {
      title: 'Intercostal Spaces and Joints',
      kind: 'clinical',
      paragraphs: [
        'Between the internal and innermost intercostal muscles lies the neurovascular plane, carrying the intercostal vein, artery and nerve (VAN, from above down) in the costal groove under each rib.',
        'For pleural drainage the needle is inserted just above a rib, to avoid the neurovascular bundle running along the lower border of the rib above. An intercostal nerve block is given near the lower border of the rib, where the nerve runs.',
        'Joints of the thoracic wall: intervertebral joints (symphyses); costovertebral and costotransverse joints (synovial plane); costochondral joints (synchondroses); interchondral joints (synovial); sternocostal joints (synovial plane); the sternoclavicular joint (saddle); and the manubriosternal and xiphisternal joints (synchondroses). Mobility of these joints is essential for the changes in thoracic volume in respiration.',
      ],
      table: {
        columns: ['Joint', 'Type'],
        rows: [
          ['Intervertebral', 'Symphysis'],
          ['Costovertebral, costotransverse', 'Synovial plane'],
          ['Costochondral', 'Synchondrosis'],
          ['Interchondral', 'Synovial'],
          ['Sternocostal', 'Synovial plane'],
          ['Sternoclavicular', 'Saddle (synovial)'],
          ['Manubriosternal, xiphisternal', 'Synchondrosis'],
        ],
      },
      terms: [
        { term: 'Neurovascular plane', meaning: 'Plane between internal and innermost intercostals carrying vein, artery and nerve (VAN).' },
      ],
      keyPoints: [
        'Chest drain: insert just above the rib below the space.',
        'VAN order from above: vein, artery, nerve.',
      ],
      sourceRefs: rs([164, 199, 200, 201, 202, 203]),
    },
  ],
  summary: [
    'The thoracic wall is formed by vertebrae, sternum, ribs and costal cartilages, intercostal spaces, the suprapleural membrane and the diaphragm.',
    'Intercostal muscles lie in three layers; the serratus posterior muscles are weak respiratory muscles.',
    'The inlet is bounded by T1, the first ribs and the manubrium; the outlet is closed by the diaphragm.',
    'The neurovascular bundle (VAN) runs between the internal and innermost intercostals under each rib.',
    'Chest drains go in just above a rib to avoid the bundle.',
  ],
  highYield: [
    'Inner intercostal layer: subcostal, innermost intercostal, transversus thoracis.',
    'Thoracic inlet: T1, first ribs, superior border of manubrium.',
    'Needle for pleural drainage: just above the rib.',
  ],
  confusions: [
    {
      confusion: 'Inserting a chest drain just below a rib.',
      clarification: 'The vein, artery and nerve run along the lower border of each rib, so the needle goes just above the rib (slide 199).',
    },
  ],
};

// ─── Lesson 5: The Diaphragm ─────────────────────────────────────────

const lesson5: Draft = {
  id: L(5),
  title: 'The Diaphragm',
  description: 'The dome-shaped muscle that seals the thoracic outlet: its parts and arcuate ligaments, central tendon, openings, nerve and blood supply, development and the hernias that result when it goes wrong.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: rs([175, 177, 180, 182, 183, 186, 188, 190, 195, 198]),
  objectives: [
    'Describe the sternal, costal and lumbar parts of the diaphragm and the arcuate ligaments.',
    'Describe the central tendon.',
    'Give the vertebral level and contents of each opening in the diaphragm.',
    'State the nerve and blood supply of the diaphragm.',
    'Explain the development of the diaphragm and its congenital and acquired hernias.',
  ],
  chunks: [
    {
      title: 'Muscular Parts and Arcuate Ligaments',
      kind: 'structure',
      paragraphs: [
        'The diaphragm is a dome-shaped musculofibrous septum separating the thoracic from the abdominal cavity, sealing the thoracic outlet. Its convex upper surface is the floor of the thorax; its concave lower surface is the roof of the abdomen. Its peripheral muscle fibres arise from the circumference of the thoracic outlet and insert into a central aponeurosis, the central tendon.',
        'The muscle fibres have three origins. The sternal part arises by two slips from the back of the xiphoid process. The costal part arises from the inner surfaces of the lower six costal cartilages and ribs, interdigitating with transversus abdominis. The lumbar part arises from the arcuate ligaments and from two muscular crura attached to the lumbar vertebrae.',
        'There are three arcuate ligaments. The medial arcuate ligament is a tendinous arch in the fascia over the upper psoas major. The lateral arcuate ligament is a fascial arch over the upper quadratus lumborum. The median arcuate ligament is formed by the medial tendinous margins of the two crura meeting in front of the aorta. The right crus is larger and longer than the left; its medial fibres pass up on the left side of the oesophageal hiatus.',
      ],
      table: {
        columns: ['Arcuate ligament', 'Arches over'],
        rows: [
          ['Median', 'Aorta (formed by the two crura)'],
          ['Medial', 'Psoas major'],
          ['Lateral', 'Quadratus lumborum'],
        ],
      },
      terms: [
        { term: 'Crura', meaning: 'Two muscular pillars of the diaphragm attached to the lumbar vertebrae; the right is larger.' },
        { term: 'Median arcuate ligament', meaning: 'Arch formed by the crura in front of the aorta.' },
        { term: 'Sternocostal triangle', meaning: 'Gap between the sternal and costal parts of the diaphragm.' },
      ],
      keyPoints: [
        'Three muscular origins: sternal, costal, lumbar.',
        'Right crus is larger and longer and surrounds the oesophageal hiatus.',
      ],
      sourceRefs: rs([175, 177, 178, 180]),
    },
    {
      title: 'The Central Tendon',
      kind: 'structure',
      paragraphs: [
        'The central tendon is a thin but strong aponeurosis near the centre of the vault, lying closer to the front than the back, so the posterior muscle fibres are longer. It lies immediately below the pericardium, with which it is partly blended.',
        'It is shaped like a trefoil leaf with three leaflets: the right leaflet is the largest, the middle (pointing toward the xiphoid) is next in size, and the left is the smallest.',
      ],
      terms: [
        { term: 'Central tendon', meaning: 'Trefoil-shaped aponeurosis forming the centre of the diaphragm, blended with the pericardium.' },
      ],
      keyPoints: [
        'Trefoil leaflets: right (largest) > middle > left (smallest).',
      ],
      sourceRefs: rs([182]),
    },
    {
      title: 'Openings of the Diaphragm',
      kind: 'structure',
      paragraphs: [
        'There are three large openings and several small ones. The vena caval foramen is the highest, at about T8, at the junction of the right and middle leaflets of the central tendon; it transmits the IVC and branches of the right phrenic nerve.',
        'The oesophageal hiatus lies in the muscular part at T10 and transmits the oesophagus, the vagus nerves and small oesophageal arteries.',
        'The aortic hiatus is the lowest and most posterior large opening, at T12. It transmits the aorta, the azygos vein and the thoracic duct.',
        'Smaller openings: two in the right crus for the greater and lesser right splanchnic nerves; three in the left crus for the greater and lesser left splanchnic nerves and the hemiazygos vein; the sympathetic trunks usually pass behind the medial arcuate ligaments; and an opening between the sternal and costal parts transmits the superior epigastric artery and some lymphatics.',
      ],
      table: {
        columns: ['Opening', 'Level', 'Transmits'],
        rows: [
          ['Vena caval foramen', 'T8', 'IVC, branches of right phrenic nerve'],
          ['Oesophageal hiatus', 'T10', 'Oesophagus, vagus nerves, oesophageal arteries'],
          ['Aortic hiatus', 'T12', 'Aorta, azygos vein, thoracic duct'],
        ],
      },
      terms: [
        { term: 'Aortic hiatus', meaning: 'Opening behind the median arcuate ligament at T12 for aorta, azygos vein and thoracic duct.' },
        { term: 'Vena caval foramen', meaning: 'Opening in the central tendon at T8 for the IVC.' },
      ],
      keyPoints: [
        '“I 8 (T8) 10 Eggs At 12”: IVC T8, oEsophagus T10, Aorta T12.',
        'Superior epigastric artery passes between the sternal and costal parts.',
      ],
      sourceRefs: rs([183, 184, 186]),
    },
    {
      title: 'Nerve and Blood Supply',
      kind: 'structure',
      paragraphs: [
        'Motor supply is from the phrenic nerves (C3, C4, C5); each half is supplied by its own phrenic nerve. The lower intercostal nerves give proprioceptive (sensory) supply to the peripheral muscle; proprioception from the central tendon is carried by the phrenic nerve.',
        'Arteries to the superior surface: the superior phrenic arteries (thoracic aorta), and the musculophrenic and pericardiacophrenic arteries (from the internal thoracic, a branch of the subclavian). Arteries to the inferior surface: the inferior phrenic arteries (abdominal aorta).',
        'Veins: the musculophrenic and pericardiacophrenic veins drain into the internal thoracic vein; the inferior phrenic veins drain to the IVC on the right and to the suprarenal vein on the left.',
      ],
      table: {
        columns: ['Surface', 'Arteries'],
        rows: [
          ['Superior', 'Superior phrenic (thoracic aorta); musculophrenic and pericardiacophrenic (internal thoracic)'],
          ['Inferior', 'Inferior phrenic (abdominal aorta)'],
        ],
      },
      terms: [
        { term: 'Phrenic nerve', meaning: 'C3–C5 nerve; sole motor supply to its half of the diaphragm.' },
      ],
      keyPoints: [
        '“C3, 4, 5 keeps the diaphragm alive.”',
        'Left inferior phrenic vein → left suprarenal vein; right → IVC.',
      ],
      notes: [{ kind: 'check', text: 'Slide 188 also states that the right crus fibres looping around the oesophagus are supplied by the left phrenic nerve. Confirm how this is examined with your lecturer.' }],
      sourceRefs: rs([188, 190]),
    },
    {
      title: 'Development and Clinical Notes',
      kind: 'clinical',
      paragraphs: [
        'The diaphragm develops from four sources: the septum transversum (central tendon), the cervical myotomes C3–C5, the pleuroperitoneal membranes, and the dorsal (oesophageal) mesentery.',
        'Failure of the pleuroperitoneal membrane is the common cause of congenital diaphragmatic hernia (CDH) through the posterolateral Bochdalek foramen. A Morgagni hernia is a retrosternal hernia through a defect between the sternal and costal parts. A hiatus hernia may be sliding or rolling.',
        'Pain from the diaphragm is referred to the shoulder because the phrenic nerve shares C4 with the skin over the shoulder. Other clinical notes: hiccups and diaphragmatic rupture.',
        'Patients with severe dyspnoea are most comfortable sitting up, because the extrinsic muscles attached to the pectoral girdle can act as accessory muscles of respiration and the abdominal viscera no longer push up against the diaphragm as they do when lying flat.',
      ],
      steps: [
        { label: 'Septum transversum', detail: 'Central tendon.' },
        { label: 'Pleuroperitoneal membranes', detail: 'Failure → Bochdalek (posterolateral) CDH.' },
        { label: 'Dorsal oesophageal mesentery', detail: 'Crura region.' },
        { label: 'Cervical myotomes C3–C5', detail: 'Muscle — hence phrenic innervation.' },
      ],
      terms: [
        { term: 'Bochdalek hernia', meaning: 'Posterolateral congenital diaphragmatic hernia from failure of the pleuroperitoneal membrane.' },
        { term: 'Morgagni hernia', meaning: 'Retrosternal hernia between the sternal and costal parts.' },
        { term: 'Hiatus hernia', meaning: 'Herniation of stomach through the oesophageal hiatus (sliding or rolling).' },
      ],
      keyPoints: [
        'Shoulder-tip pain = diaphragmatic irritation (C4).',
        'Central tendon comes from the septum transversum.',
      ],
      sourceRefs: rs([195, 196, 197, 198]),
    },
  ],
  summary: [
    'The diaphragm has sternal, costal and lumbar origins; the crura and arcuate ligaments form the lumbar part.',
    'The central tendon is trefoil-shaped and blended with the pericardium.',
    'IVC at T8, oesophagus at T10, aorta at T12.',
    'Motor supply: phrenic nerves (C3–C5); periphery also receives sensory lower intercostal fibres.',
    'It develops from the septum transversum, pleuroperitoneal membranes, dorsal mesentery and cervical myotomes.',
  ],
  highYield: [
    'Aortic hiatus (T12): aorta, azygos vein, thoracic duct.',
    'Oesophageal hiatus (T10): oesophagus and vagal trunks.',
    'Caval foramen (T8): IVC and right phrenic branches.',
    'Bochdalek hernia = failed pleuroperitoneal membrane.',
  ],
  confusions: [
    {
      confusion: 'Thinking the lower intercostal nerves are motor to the diaphragm.',
      clarification: 'The phrenic nerve is the only motor nerve; the lower intercostals carry sensory (proprioceptive) fibres from the periphery (slide 188).',
    },
  ],
};

// ─── Lesson 6: The Pleura ────────────────────────────────────────────

const lesson6: Draft = {
  id: L(6),
  title: 'The Pleura',
  description: 'The serous membrane around each lung: its visceral and parietal layers, the surface markings of its reflections, the costodiaphragmatic recess, the lines of reflection and its clinical importance.',
  xp: 25,
  estimatedMinutes: 12,
  sourceRefs: rs([230, 231, 232, 233, 236, 240, 242, 245, 247, 248, 250, 252]),
  objectives: [
    'Describe the compartments of the thoracic cavity.',
    'Distinguish the visceral and parietal pleura and name the four parts of the parietal pleura.',
    'Give the surface markings of the pleural reflections.',
    'Explain the costodiaphragmatic recess and the lines of pleural reflection.',
    'Relate pleural anatomy to effusion, pneumothorax and thoracocentesis.',
  ],
  chunks: [
    {
      title: 'The Thoracic Cavity and the Pleura',
      kind: 'structure',
      paragraphs: [
        'The thoracic cavity has three compartments: two lateral pulmonary (pleural) cavities containing the lungs, and a central mediastinum containing the pericardial sac and heart, the great vessels, trachea, oesophagus, thymus and lymph nodes. The two pleural cavities are completely separated from each other.',
        'The pleura is a serous membrane, like the peritoneum, that covers the lungs and lines the inner aspect of the thoracic wall, enclosing the pleural sac. The visceral pleura closely covers and adheres to the lung surface; it is continuous with the parietal pleura at the hilum (root) of the lung.',
        'The parietal pleura has four parts: costal, mediastinal, diaphragmatic and cervical (the cupola or dome). The costal pleura is separated from the inner thoracic wall by the endothoracic fascia. The pleural cavity is the potential space between the two layers (compare the peritoneal cavity).',
      ],
      steps: [
        { label: 'Costal pleura', detail: 'Lines the ribs and intercostal spaces, on the endothoracic fascia.' },
        { label: 'Mediastinal pleura', detail: 'Covers the side of the mediastinum.' },
        { label: 'Diaphragmatic pleura', detail: 'Covers the upper surface of the diaphragm.' },
        { label: 'Cervical pleura (cupola)', detail: 'Dome over the lung apex in the root of the neck.' },
      ],
      terms: [
        { term: 'Visceral pleura', meaning: 'Pleura adherent to the lung surface.' },
        { term: 'Parietal pleura', meaning: 'Pleura lining the thoracic wall, mediastinum, diaphragm and cupola.' },
        { term: 'Endothoracic fascia', meaning: 'Fascia separating the costal pleura from the thoracic wall.' },
        { term: 'Pleural cavity', meaning: 'Potential space between visceral and parietal pleura.' },
      ],
      keyPoints: [
        'Visceral and parietal pleura are continuous at the lung root.',
        'The right and left pleural cavities do not communicate.',
      ],
      sourceRefs: rs([230, 231, 232, 233, 234, 236]),
    },
    {
      title: 'Surface Markings of the Pleural Reflections',
      kind: 'clinical',
      paragraphs: [
        'The cervical pleura rises about 2.5 cm above the clavicle but not beyond the neck of the first rib. From the sternoclavicular joints the two pleurae meet behind the sternum at the level of the 2nd costal cartilage and run down together to the 4th costal cartilage.',
        'From there the right pleura continues vertically, but the left arches out and descends along the lateral border of the sternum (the cardiac notch). Each then turns laterally around the chest wall at the 6th costal cartilage, crosses the midclavicular line at the 8th rib and the midaxillary line at the 10th rib, and crosses the 12th rib horizontally to the lower border of T12.',
        'Note that each event happens at an even-numbered rib: 2, 4, 6, 8, 10 and 12. Below the medial part of the 12th rib a small triangle of pleura lies in the costovertebral triangle — important because the pleura can be opened there in a posterior approach to the kidney.',
      ],
      steps: [
        { label: '2.5 cm above the clavicle', detail: 'Cervical pleura (cupola).' },
        { label: '2nd costal cartilage', detail: 'The two pleurae meet behind the sternum.' },
        { label: '4th costal cartilage', detail: 'Left pleura diverges (cardiac notch).' },
        { label: '6th costal cartilage', detail: 'Turns laterally.' },
        { label: '8th rib', detail: 'Crosses the midclavicular line.' },
        { label: '10th rib', detail: 'Crosses the midaxillary line.' },
        { label: '12th rib', detail: 'Crosses horizontally to the lower border of T12.' },
      ],
      terms: [
        { term: 'Cupola', meaning: 'Cervical pleura rising about 2.5 cm above the clavicle.' },
        { term: 'Costovertebral triangle', meaning: 'Area below the medial 12th rib where pleura extends; at risk in kidney surgery.' },
      ],
      keyPoints: [
        'Pleural reflections: 2, 4, 6, 8, 10, 12 — the even ribs.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the pleura below the 12th rib is at risk during a posterior (loin) approach to the kidney — the clinical point slide 245 asks about.' }],
      sourceRefs: [...rs([240, 241, 242, 245, 246]), ...GRAYS],
    },
    {
      title: 'The Costodiaphragmatic Recess and Lines of Reflection',
      kind: 'structure',
      paragraphs: [
        'In quiet breathing the lungs do not reach as far down as the pleural reflections. Below the lungs, the costal pleura is separated from the diaphragmatic pleura only by a slit, the costodiaphragmatic recess. Excess pleural fluid (pleural effusion) collects here, so it is the site for thoracocentesis.',
        'Lines of pleural reflection are where the parietal pleura changes direction from one wall to another: the sternal line (costal → mediastinal pleura in front), the vertebral line (costal → mediastinal pleura behind), the costal line (costal → diaphragmatic pleura) and the diaphragmatic line (diaphragmatic → vertebral/mediastinal pleura).',
      ],
      table: {
        columns: ['Line of reflection', 'Costal pleura becomes…'],
        rows: [
          ['Sternal', 'Mediastinal pleura (anteriorly)'],
          ['Vertebral', 'Mediastinal pleura (posteriorly)'],
          ['Costal', 'Diaphragmatic pleura'],
          ['Diaphragmatic', '(Diaphragmatic pleura becomes vertebral/mediastinal pleura)'],
        ],
      },
      terms: [
        { term: 'Costodiaphragmatic recess', meaning: 'Slit-like space between costal and diaphragmatic pleura below the lung edge.' },
        { term: 'Thoracocentesis', meaning: 'Needle aspiration of fluid from the pleural cavity.' },
      ],
      keyPoints: [
        'Fluid collects in the costodiaphragmatic recess → aspirate there.',
      ],
      sourceRefs: rs([247, 248, 249, 250, 251]),
    },
    {
      title: 'Clinical Notes',
      kind: 'clinical',
      paragraphs: [
        'The apex of the lung and the cupola can be injured in the neck, and the pleural cavity can be opened during an abdominal incision near its lower limits.',
        'Common terms: pneumothorax (air in the pleural cavity), tension pneumothorax, pleural effusion (fluid), haemothorax (blood), pleuritis or pleurisy (inflammation), pleurectomy, lung collapse, thoracotomy and emphysema.',
      ],
      terms: [
        { term: 'Pneumothorax', meaning: 'Air in the pleural cavity.' },
        { term: 'Haemothorax', meaning: 'Blood in the pleural cavity.' },
        { term: 'Pleurisy', meaning: 'Inflammation of the pleura (pleuritis).' },
      ],
      keyPoints: [
        'The cupola rises into the neck, so neck injuries can cause pneumothorax.',
      ],
      sourceRefs: rs([252]),
    },
  ],
  summary: [
    'The thoracic cavity has two separate pleural cavities and a central mediastinum.',
    'Parietal pleura has costal, mediastinal, diaphragmatic and cervical parts; visceral and parietal meet at the hilum.',
    'Pleural reflections occur at the even ribs: 2, 4, 6, 8, 10, 12.',
    'The costodiaphragmatic recess collects effusions and is the site for thoracocentesis.',
    'Pneumothorax, effusion and haemothorax are key clinical terms.',
  ],
  highYield: [
    'Cupola: 2.5 cm above the clavicle.',
    'Pleura crosses the MCL at rib 8, MAL at rib 10, and reaches T12 posteriorly.',
    'Left pleura deviates at the 4th costal cartilage (cardiac notch).',
  ],
  confusions: [
    {
      confusion: 'Thinking the lungs fill the pleural sac down to its lowest reflection.',
      clarification: 'In quiet breathing the lungs stop about two ribs higher, leaving the costodiaphragmatic recess (slide 247).',
    },
  ],
};

// ─── Lesson 7: The Lungs and Bronchial Tree ──────────────────────────

const lesson7: Draft = {
  id: L(7),
  title: 'The Lungs and Bronchial Tree',
  description: 'The lungs’ texture, surfaces, borders, roots, fissures and lobes; the main bronchi and their differences; bronchopulmonary segments; and the blood, lymph and nerve supply of the lungs.',
  xp: 25,
  estimatedMinutes: 16,
  sourceRefs: rs([207, 211, 212, 214, 216, 220, 221, 224, 227, 229, 257, 258, 260, 263, 268, 271, 273, 278]),
  objectives: [
    'Describe the general features, surfaces and borders of the lungs.',
    'Describe the arrangement of structures at the right and left lung roots.',
    'Name the fissures and lobes of each lung.',
    'Compare the right and left main bronchi.',
    'Define a bronchopulmonary segment and give the number of segmental bronchi.',
    'Describe the blood, lymph and nerve supply of the lungs.',
  ],
  chunks: [
    {
      title: 'General Features, Surfaces and Borders',
      kind: 'structure',
      paragraphs: [
        'The lungs are the vital organs of respiration, one on each side within the pleural cavity, separated by the pericardial sac and the rest of the mediastinum. Lung tissue is light, porous and spongy; it floats in water, crepitates when handled and is highly elastic. The surface is smooth, shining and pinkish in life. The lungs consist of many lobules.',
        'Each lung is conical, with an apex, a base, three borders (anterior, posterior and inferior) and three surfaces (costal, diaphragmatic and mediastinal). The costal surface contacts the costal pleura; the diaphragmatic surface the diaphragmatic pleura; and the mediastinal surface the mediastinal pleura. The mediastinal surface carries the cardiac impression (notch), the hilum and impressions of mediastinal structures.',
      ],
      terms: [
        { term: 'Hilum', meaning: 'Area on the mediastinal surface where structures enter and leave the lung.' },
        { term: 'Cardiac notch', meaning: 'Notch in the anterior border of the left lung for the heart.' },
      ],
      keyPoints: [
        'Three borders (anterior, posterior, inferior); three surfaces (costal, diaphragmatic, mediastinal).',
      ],
      notes: [{ kind: 'lecturer', text: 'The lecture shows a lung with carbon deposits (slide 285), the darkened appearance seen in smokers and city dwellers.' }],
      sourceRefs: rs([257, 258, 260, 261, 262, 263, 285]),
    },
    {
      title: 'Lung Roots, Fissures and Lobes',
      kind: 'comparison',
      paragraphs: [
        'Left lung root: the left pulmonary artery lies superiorly, in the concavity of the aortic arch; the left bronchus lies below it; there are two pulmonary veins, one anterior and one inferior to the bronchus. All are enclosed in the pleural sleeve that extends down as the pulmonary ligament.',
        'Right lung root: the bronchus and pulmonary artery to the upper lobe lie above the main bronchus and pulmonary artery; the pulmonary arteries lie anterior to their bronchi; and there are two pulmonary veins, one anterior and one inferior to the bronchus.',
        'The left lung has one fissure (oblique) and two lobes; the right has two fissures (oblique and horizontal) and three lobes. The lingula is the tongue-like projection of the left upper lobe.',
      ],
      table: {
        columns: ['Feature', 'Right lung', 'Left lung'],
        rows: [
          ['Fissures', 'Oblique + horizontal', 'Oblique only'],
          ['Lobes', 'Upper, middle, lower', 'Upper (with lingula), lower'],
          ['Root (top)', 'Upper lobe bronchus and artery above main bronchus', 'Pulmonary artery above the bronchus'],
        ],
      },
      terms: [
        { term: 'Pulmonary ligament', meaning: 'Fold of pleura hanging below the lung root.' },
        { term: 'Lingula', meaning: 'Tongue-like part of the left upper lobe.' },
        { term: 'Horizontal fissure', meaning: 'Fissure separating the right upper and middle lobes.' },
      ],
      keyPoints: [
        'Right: 2 fissures, 3 lobes. Left: 1 fissure, 2 lobes.',
        'In each root the two pulmonary veins are anterior and inferior.',
      ],
      sourceRefs: rs([268, 269, 271, 272, 273, 274, 275]),
    },
    {
      title: 'The Main Bronchi',
      kind: 'comparison',
      paragraphs: [
        'The right main bronchus is wider, shorter and more vertical than the left. It enters the right lung opposite T5. The azygos vein arches over it from behind, and the right pulmonary artery lies first below and then in front of it. It gives off a branch to the upper lobe that arises above the pulmonary artery — the eparterial bronchus. The continuation, the hyparterial bronchus, divides into branches for the middle and lower lobes.',
        'The left main bronchus is narrower but longer. It enters the left lung root opposite T6 and passes beneath the aortic arch. It crosses in front of the oesophagus, thoracic duct and descending aorta; the left pulmonary artery lies first above and then in front of it. The left bronchus has no eparterial branch.',
      ],
      table: {
        columns: ['Feature', 'Right main bronchus', 'Left main bronchus'],
        rows: [
          ['Width / length', 'Wider, shorter', 'Narrower, longer'],
          ['Direction', 'More vertical', 'More oblique'],
          ['Enters lung', 'Opposite T5', 'Opposite T6'],
          ['Arching vessel', 'Azygos vein', 'Aortic arch'],
          ['Eparterial branch', 'Yes (upper lobe)', 'No'],
        ],
      },
      terms: [
        { term: 'Eparterial bronchus', meaning: 'Right upper lobe bronchus, arising above the right pulmonary artery.' },
        { term: 'Hyparterial bronchus', meaning: 'Continuation of the right main bronchus below the artery, to the middle and lower lobes.' },
      ],
      keyPoints: [
        'Inhaled foreign bodies more often enter the right bronchus (wider, shorter, more vertical).',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the wider, more vertical right main bronchus is why aspirated foreign bodies usually lodge on the right.' }],
      sourceRefs: [...rs([207, 209, 211, 212]), ...GRAYS],
    },
    {
      title: 'Bronchopulmonary Segments',
      kind: 'structure',
      paragraphs: [
        'Segmental bronchi arise from the lobar bronchi; there are 10 on each side. Right lung: upper lobe 3, middle lobe 2, lower lobe 5. Left lung: upper lobe 5 (including the lingula), lower lobe 5.',
        'A bronchopulmonary segment is the surgical unit of the lung: it is served by a segmental artery and a segmental bronchus and drained by segmental veins, so it can be removed on its own.',
        'The bronchial walls contain smooth muscle; its contraction narrows the airways, as in asthma.',
      ],
      table: {
        columns: ['Lobe', 'Right', 'Left'],
        rows: [
          ['Upper', '3', '5'],
          ['Middle', '2', '—'],
          ['Lower', '5', '5'],
          ['Total', '10', '10'],
        ],
      },
      terms: [
        { term: 'Bronchopulmonary segment', meaning: 'Surgical unit of the lung served by its own segmental bronchus and artery.' },
      ],
      keyPoints: [
        '10 segmental bronchi each side.',
        'Each segment has its own bronchus and artery → can be resected individually.',
      ],
      sourceRefs: rs([224, 225, 278, 279, 280]),
    },
    {
      title: 'Blood, Lymph and Nerve Supply',
      kind: 'structure',
      paragraphs: [
        'The lung tissue itself is supplied by the bronchial arteries — usually three, one for the right and two for the left — supplying from the carina to the bronchioles and the visceral pleura. Bronchial veins from the hilum drain into the azygos vein on the right and the accessory hemiazygos vein on the left.',
        'The pulmonary artery divides with the bronchi, so every bronchus is accompanied by a branch of the artery — but these branches supply the alveoli for gas exchange, not the bronchi themselves.',
        'Lymph drains along the lung surface and pulmonary vessels to the bronchopulmonary (hilar) nodes and then to the tracheobronchial nodes: the upper and middle lobes to the superior tracheobronchial nodes and the lower lobe to the inferior tracheobronchial nodes.',
        'Nerve supply comes from the pulmonary plexuses (branches of the thoracic vagus and sympathetic chain, linked to the cardiac plexuses). Vagal afferents from unmyelinated endings in the epithelium carry the cough reflex. Vagal efferents are bronchoconstrictor, vasodilator and secretomotor to mucous glands. Sympathetic preganglionic fibres from T2–T4 relay in the upper thoracic ganglia; sympathetic efferents are bronchodilator and vasoconstrictor.',
      ],
      table: {
        columns: ['Fibres', 'Effect on bronchi', 'Effect on vessels / glands'],
        rows: [
          ['Parasympathetic (vagus)', 'Bronchoconstriction', 'Vasodilator; secretomotor to mucous glands'],
          ['Sympathetic (T2–T4)', 'Bronchodilation', 'Vasoconstrictor'],
        ],
      },
      terms: [
        { term: 'Bronchial arteries', meaning: 'Nutrient arteries of the lung (1 right, 2 left).' },
        { term: 'Bronchopulmonary nodes', meaning: 'Hilar lymph nodes draining to the tracheobronchial nodes.' },
        { term: 'Pulmonary plexus', meaning: 'Autonomic plexus at the lung root formed by vagal and sympathetic branches.' },
      ],
      keyPoints: [
        'Bronchial arteries nourish the lung; pulmonary arteries carry blood for gas exchange.',
        'Vagus = bronchoconstriction + cough reflex; sympathetic = bronchodilation.',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on slide 229 add a reminder: afferent = arrive (to the CNS); efferent = exit (from the CNS).' }],
      sourceRefs: rs([214, 215, 216, 220, 221, 227, 229]),
    },
  ],
  summary: [
    'Each lung has an apex, base, three borders and three surfaces.',
    'Right lung: two fissures, three lobes; left lung: one fissure, two lobes with a lingula.',
    'The right main bronchus is wider, shorter, more vertical and has an eparterial branch; the left has none.',
    'Ten segmental bronchi per lung; the bronchopulmonary segment is the surgical unit.',
    'Bronchial arteries nourish the lung; the vagus constricts and the sympathetic dilates the bronchi.',
  ],
  highYield: [
    'Right main bronchus enters the lung at T5; left at T6.',
    'Bronchial arteries: 1 right, 2 left.',
    'Right segments: 3 upper, 2 middle, 5 lower.',
    'Cough reflex afferents travel in the vagus.',
  ],
  confusions: [
    {
      confusion: 'Thinking the pulmonary arteries nourish the bronchi.',
      clarification: 'The pulmonary artery branches accompany each bronchus but supply the alveoli; the bronchi are nourished by the bronchial arteries (slides 214, 220).',
    },
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7].map((lesson) => ({
  ...lesson,
  interactive: interactive[lesson.id],
}));
