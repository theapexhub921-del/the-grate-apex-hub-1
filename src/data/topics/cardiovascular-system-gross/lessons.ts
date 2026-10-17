// Anatomy → Cardiovascular System (gross): the seven lessons (reading layer).
import type { LessonDraft } from '@/data/topics/build';
import { interactive } from '@/data/topics/cardiovascular-system-gross/interactive';
import { c1, c2, GRAYS, TOPIC_ID, type ConceptId } from '@/data/topics/cardiovascular-system-gross/sources';

type Draft = LessonDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

// ─── Lesson 1: The Mediastinum ───────────────────────────────────────

const lesson1: Draft = {
  id: L(1),
  title: 'The Mediastinum',
  description: 'What the cardiovascular system does, and the central compartment of the thorax that holds the heart and great vessels: its boundaries, divisions and contents.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: c1([5, 6, 7, 9, 15, 19, 22, 25, 27, 32, 34, 36, 38, 43]),
  objectives: [
    'State the functions and the major components of the cardiovascular and circulatory systems.',
    'Define the mediastinum and describe its extent.',
    'Divide the mediastinum into superior and inferior parts, and the inferior part into anterior, middle and posterior parts.',
    'List the contents of each division of the mediastinum.',
  ],
  chunks: [
    {
      title: 'The Cardiovascular and Circulatory Systems',
      kind: 'overview',
      paragraphs: [
        'The cardiovascular system (CVS) has three broad functions: transportation (oxygen and carbon dioxide, nutrients and waste products), regulation (carrying hormones) and protection (white blood cells and clotting).',
        'The CVS comprises the heart (cardiac part) and the blood vessels (vascular part): arteries and arterioles, veins and venules, and capillaries. Together they circulate blood around the body.',
        'The cardiovascular system plus the lymphatic system makes up the circulatory system. The lymphatic system — lymphatic vessels and lymph nodes — returns tissue fluid (lymph) to the venous blood at particular sites. Lymph nodes lie along the pathway so that lymph is cleaned before it enters venous blood.',
      ],
      terms: [
        { term: 'Circulatory system', meaning: 'The cardiovascular system plus the lymphatic system.' },
        { term: 'Lymph', meaning: 'Tissue fluid returned to the venous blood by lymphatic vessels.' },
        { term: 'Cardiology', meaning: 'The study of the heart; angiology is the study of blood and lymph vessels.' },
      ],
      keyPoints: [
        'CVS = heart + blood vessels; circulatory system = CVS + lymphatic system.',
        'Lymph nodes filter lymph before it rejoins the venous blood.',
      ],
      sourceRefs: c1([5, 6, 7, 9]),
    },
    {
      title: 'The Mediastinum and its Subdivisions',
      kind: 'structure',
      paragraphs: [
        'The mediastinum (interpleural space) is the space between the right and left pleurae, lying in and near the midline of the chest. It extends from the sternum in front to the vertebral column behind, and from the thoracic inlet above to the thoracic outlet (diaphragm) below. It contains almost all the thoracic viscera except the lungs.',
        'An imaginary, slightly oblique plane passing backward from the sternal angle to the lower part of the body of the T4 vertebra divides the mediastinum into an upper superior mediastinum and a lower inferior mediastinum.',
        'The inferior mediastinum is divided by the pericardium into three parts: the anterior mediastinum (in front of the pericardium), the middle mediastinum (the pericardium and its contents) and the posterior mediastinum (behind the pericardium).',
      ],
      steps: [
        { label: 'Superior mediastinum', detail: 'Above the plane from the sternal angle to the T4/T5 disc.' },
        { label: 'Anterior mediastinum', detail: 'Between the sternum and the pericardium.' },
        { label: 'Middle mediastinum', detail: 'The pericardium and the heart within it — the broadest part.' },
        { label: 'Posterior mediastinum', detail: 'Behind the pericardium, in front of the vertebral column (T4/T5 to T12).' },
      ],
      terms: [
        { term: 'Mediastinum', meaning: 'The central compartment of the thorax between the two pleural sacs.' },
        { term: 'Sternal angle', meaning: 'Junction of manubrium and body of sternum; the plane through it to T4/T5 separates superior from inferior mediastinum.' },
      ],
      keyPoints: [
        'The sternal angle–T4 plane separates the superior from the inferior mediastinum.',
        'The pericardium is the landmark that splits the inferior mediastinum into anterior, middle and posterior parts.',
      ],
      notes: [{ kind: 'lecturer', text: 'The lecture expects you to identify the divisions on a chest X-ray (PA view) and on a CT scan at the level of T6 (slides 13–14).' }],
      sourceRefs: c1([13, 14, 15, 19, 22]),
    },
    {
      title: 'Contents of the Superior Mediastinum',
      kind: 'structure',
      paragraphs: [
        'The superior mediastinum contains the origins of sternohyoid and sternothyroid and the lower ends of longus colli; the aortic arch with its three branches — the brachiocephalic trunk and the thoracic parts of the left common carotid and left subclavian arteries.',
        'The right common carotid artery is not listed because it arises from the brachiocephalic trunk in the root of the neck, not from the arch itself.',
        'It also contains the brachiocephalic veins, the upper half of the superior vena cava, the left highest (superior) intercostal vein, the vagus, cardiac, phrenic and left recurrent laryngeal nerves, the trachea, the oesophagus, the thoracic duct, the remains of the thymus and some lymph nodes.',
      ],
      terms: [
        { term: 'Brachiocephalic trunk', meaning: 'First branch of the aortic arch; divides into the right subclavian and right common carotid arteries.' },
        { term: 'Thoracic duct', meaning: 'The main lymphatic duct, passing through the superior and posterior mediastinum.' },
      ],
      keyPoints: [
        'Arch of the aorta and its three branches, brachiocephalic veins and upper SVC lie in the superior mediastinum.',
        'Trachea, oesophagus, thoracic duct, thymus remnant, vagus, phrenic and left recurrent laryngeal nerves also lie here.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the right common carotid artery arises from the brachiocephalic trunk behind the right sternoclavicular joint, which is why only the left common carotid has a thoracic part.' }],
      sourceRefs: [...c1([25, 27]), ...GRAYS],
    },
    {
      title: 'Anterior, Middle and Posterior Mediastinum',
      kind: 'comparison',
      paragraphs: [
        'The anterior mediastinum exists mainly on the left, where the left pleura diverges from the mid-sternal line. It is bounded in front by the sternum and the 5th–7th left costal cartilages, laterally by the pleurae and behind by the pericardium. It contains loose areolar tissue, lymphatic vessels ascending from the convex surface of the liver, two or three anterior mediastinal lymph nodes and small mediastinal branches of the internal thoracic (internal mammary) artery.',
        'The middle mediastinum is the broadest part of the interpleural space. It contains the heart enclosed in the pericardium, the ascending aorta, the lower half of the superior vena cava with the azygos vein tributary, the pulmonary trunk dividing into its two branches, the right and left pulmonary veins, the phrenic nerves and some bronchial lymph nodes.',
        'The posterior mediastinum is an irregular space along the vertebral column. It is bounded in front by the pericardium, below by the diaphragm, behind by the vertebral column from the lower border of T4 to T12, laterally by the mediastinal pleura, and above it is continuous with the superior mediastinum. It contains the descending thoracic aorta, the azygos and two hemiazygos veins, the vagus and splanchnic nerves, the sympathetic trunk, the oesophagus, the thoracic duct and lymph nodes.',
      ],
      table: {
        columns: ['Division', 'Key contents'],
        rows: [
          ['Anterior', 'Areolar tissue, lymph vessels and nodes, mediastinal branches of internal thoracic artery'],
          ['Middle', 'Heart in pericardium, ascending aorta, lower half of SVC, pulmonary trunk and veins, phrenic nerves'],
          ['Posterior', 'Descending aorta, azygos and hemiazygos veins, oesophagus, thoracic duct, vagus, sympathetic trunk, splanchnic nerves'],
        ],
      },
      keyPoints: [
        'The phrenic nerves run in the middle mediastinum (on the pericardium); the vagus nerves continue into the posterior mediastinum.',
        'The oesophagus and thoracic duct pass through both the superior and the posterior mediastinum.',
      ],
      sourceRefs: c1([32, 34, 36, 38]),
    },
  ],
  summary: [
    'The mediastinum is the central thoracic compartment between the pleural sacs, from sternum to vertebral column and thoracic inlet to diaphragm.',
    'A plane from the sternal angle to T4 separates superior from inferior mediastinum.',
    'The inferior mediastinum is divided into anterior, middle (pericardium and heart) and posterior parts.',
    'The aortic arch and its branches, brachiocephalic veins, upper SVC, trachea and thymus remnant lie in the superior mediastinum.',
    'The descending aorta, azygos system, oesophagus, thoracic duct and sympathetic trunk lie in the posterior mediastinum.',
  ],
  highYield: [
    'Sternal angle → T4/T5: the dividing plane between superior and inferior mediastinum.',
    'Middle mediastinum = pericardium, heart, ascending aorta, lower SVC, pulmonary trunk and veins, phrenic nerves.',
    'Posterior mediastinum = descending aorta, azygos/hemiazygos, oesophagus, thoracic duct, vagus, sympathetic trunk.',
  ],
  confusions: [
    {
      confusion: 'Thinking the right common carotid artery arises from the aortic arch.',
      clarification: 'The arch gives three branches: brachiocephalic trunk, left common carotid and left subclavian. The right common carotid comes from the brachiocephalic trunk (slide 25).',
    },
    {
      confusion: 'Placing the heart in the anterior mediastinum.',
      clarification: 'The heart and pericardium are the middle mediastinum; the anterior mediastinum is the narrow space in front of the pericardium (slides 22, 32, 34).',
    },
  ],
};

// ─── Lesson 2: The Pericardium ───────────────────────────────────────

const lesson2: Draft = {
  id: L(2),
  title: 'The Pericardium',
  description: 'The fibro-serous sac around the heart: its two parts, relations, the oblique and transverse sinuses, its blood and nerve supply, and the clinical conditions that affect it.',
  xp: 25,
  estimatedMinutes: 12,
  sourceRefs: c1([46, 47, 49, 51, 52, 53, 58, 60, 62, 63, 64, 67, 69]),
  objectives: [
    'Describe the fibrous and serous pericardium and the pericardial cavity.',
    'State the attachments and relations of the pericardial sac.',
    'Explain how the oblique and transverse sinuses are formed.',
    'Give the blood and nerve supply of the pericardium and explain its clinical relevance.',
  ],
  chunks: [
    {
      title: 'Fibrous and Serous Pericardium',
      kind: 'structure',
      paragraphs: [
        'The pericardial sac occupies the middle mediastinum, and the heart lies within it. The potential space between the heart and the inner wall of the sac is the pericardial cavity.',
        'The pericardium has two components. The fibrous pericardium is tough connective tissue that surrounds the heart completely; superiorly it fuses with the adventitia of the great vessels, and inferiorly it is firmly attached to the central tendon of the diaphragm. It resists acute expansion of the cavity.',
        'The serous pericardium is a closed sac within the fibrous pericardium with a parietal and a visceral layer. The visceral layer forms the epicardium of the heart and is reflected around the great vessels to continue as the parietal layer, which lines the fibrous pericardium.',
      ],
      steps: [
        { label: 'Fibrous pericardium', detail: 'Outer tough layer; fused to the great vessels above and the central tendon of the diaphragm below.' },
        { label: 'Parietal serous layer', detail: 'Lines the inner surface of the fibrous pericardium.' },
        { label: 'Pericardial cavity', detail: 'Potential space between the parietal and visceral serous layers.' },
        { label: 'Visceral serous layer (epicardium)', detail: 'Covers the heart surface; reflects onto the great vessels to become the parietal layer.' },
      ],
      terms: [
        { term: 'Fibrous pericardium', meaning: 'Tough outer connective-tissue sac fused to the great vessels and the central tendon of the diaphragm.' },
        { term: 'Epicardium', meaning: 'The visceral layer of serous pericardium covering the heart.' },
        { term: 'Pericardial cavity', meaning: 'Potential space between visceral and parietal layers of serous pericardium.' },
      ],
      keyPoints: [
        'The fibrous pericardium limits sudden distension of the heart.',
        'Visceral serous pericardium = epicardium.',
      ],
      sourceRefs: c1([46, 47, 49, 58, 59]),
    },
    {
      title: 'Position and Relations of the Pericardial Sac',
      kind: 'structure',
      paragraphs: [
        'The pericardium is a conical fibro-serous sac containing the heart and the roots of the great vessels, placed behind the sternum in the middle mediastinum.',
        'In front, it is separated from the anterior thoracic wall by the anterior mediastinum and its contents. Thin sternopericardial ligaments attach its anterior surface to the back of the sternum and stabilise the heart.',
        'Behind, it rests on the posterior mediastinum and its contents: the oesophagus, the descending thoracic aorta, the vagus and splanchnic nerves, the azygos and hemiazygos veins and the sympathetic trunk.',
        'Laterally it is covered by the mediastinal pleurae and the related surfaces of the lungs. The phrenic nerves, with the pericardiacophrenic arteries and veins, lie on its anterolateral external surface.',
      ],
      terms: [
        { term: 'Sternopericardial ligaments', meaning: 'Fibrous bands attaching the anterior fibrous pericardium to the back of the sternum.' },
        { term: 'Pericardiacophrenic vessels', meaning: 'Arteries and veins running with the phrenic nerve on the pericardium.' },
      ],
      keyPoints: [
        'Anterior: sternum (via anterior mediastinum and sternopericardial ligaments).',
        'Posterior: oesophagus and descending aorta; lateral: mediastinal pleura with phrenic nerves.',
      ],
      notes: [{ kind: 'annotation', text: 'The definition of the sternopericardial ligaments comes from the speaker notes of slide 51 (superior and inferior bands from the manubrium and xiphoid).' }],
      sourceRefs: c1([49, 51, 52, 53]),
    },
    {
      title: 'The Pericardial Sinuses',
      kind: 'mechanism',
      paragraphs: [
        'Where the serous pericardium is reflected around the great vessels, two recesses are formed within the pericardial cavity.',
        'The attachments and reflections around the veins — the superior and inferior venae cavae and the pulmonary veins — create a cul-de-sac behind the left atrium called the oblique sinus.',
        'The reflection around the arterial trunks — the ascending aorta and pulmonary trunk — creates the transverse sinus, a passage lying behind these arteries and in front of the veins.',
      ],
      terms: [
        { term: 'Oblique sinus', meaning: 'Cul-de-sac of the pericardial cavity formed by the reflection around the venae cavae and pulmonary veins.' },
        { term: 'Transverse sinus', meaning: 'Passage of the pericardial cavity behind the ascending aorta and pulmonary trunk.' },
      ],
      keyPoints: [
        'Veins → oblique sinus; arterial trunks → transverse sinus.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: during cardiac surgery a finger or ligature passed through the transverse sinus can separate the aorta and pulmonary trunk from the great veins.' }],
      sourceRefs: [...c1([60, 61, 62]), ...GRAYS],
    },
    {
      title: 'Blood Supply, Nerve Supply and Clinical Notes',
      kind: 'clinical',
      paragraphs: [
        'Blood supply: the pericardiacophrenic branch of the internal thoracic artery, musculophrenic branches, bronchial arteries and branches of the thoracic aorta. Venous drainage is to the azygos system.',
        'Nerve supply: the fibrous pericardium and the parietal layer of serous pericardium are supplied by the phrenic nerve, so they are sensitive to pain. The visceral layer is insensitive.',
        'Clinical conditions include pericardial effusion (fluid in the pericardial cavity), cardiac tamponade (compression of the heart by fluid that the fibrous pericardium will not let expand), pericarditis (acute and chronic), constrictive pericarditis, and pericardiocentesis (drainage of the pericardial cavity).',
      ],
      table: {
        columns: ['Layer', 'Nerve supply', 'Pain sensitive?'],
        rows: [
          ['Fibrous pericardium', 'Phrenic nerve', 'Yes'],
          ['Parietal serous layer', 'Phrenic nerve', 'Yes'],
          ['Visceral serous layer', '—', 'No (insensitive)'],
        ],
      },
      terms: [
        { term: 'Cardiac tamponade', meaning: 'Compression of the heart by fluid or blood in the pericardial cavity.' },
        { term: 'Pericardiocentesis', meaning: 'Drainage of fluid from the pericardial cavity with a needle.' },
      ],
      keyPoints: [
        'Pericardial pain travels in the phrenic nerve (C3–C5).',
        'Because the fibrous pericardium cannot stretch acutely, fluid accumulation compresses the heart (tamponade).',
      ],
      sourceRefs: c1([63, 64, 67, 68, 69]),
    },
  ],
  summary: [
    'The pericardium has an outer fibrous layer and an inner serous sac (parietal and visceral layers).',
    'The fibrous pericardium fuses with the great vessels above and the central tendon of the diaphragm below.',
    'Reflections around the veins form the oblique sinus; around the aorta and pulmonary trunk, the transverse sinus.',
    'The fibrous and parietal layers are supplied by the phrenic nerve; the visceral layer is insensitive.',
    'Effusion, tamponade and pericarditis are the key clinical conditions.',
  ],
  highYield: [
    'Visceral serous pericardium = epicardium.',
    'Oblique sinus: behind the left atrium, bounded by venous reflections. Transverse sinus: behind aorta and pulmonary trunk.',
    'Phrenic nerve supplies fibrous and parietal pericardium.',
  ],
  confusions: [
    {
      confusion: 'Mixing up the oblique and transverse sinuses.',
      clarification: 'The oblique sinus is a blind pouch made by the venous reflections (venae cavae and pulmonary veins); the transverse sinus lies behind the arterial trunks (slides 60–62).',
    },
  ],
};

// ─── Lesson 3: External Features of the Heart ────────────────────────

const lesson3: Draft = {
  id: L(3),
  title: 'External Features of the Heart',
  description: 'The heart’s shape, size and position; its borders and surfaces; its surface marking and apex beat; the layers of its wall; and the grooves that mark the chambers.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: c1([72, 74, 77, 81, 82, 83, 84, 86, 87, 89, 90, 91, 93, 98, 101, 108]),
  objectives: [
    'Describe the shape, size, weight and position of the heart.',
    'Name the borders and surfaces of the heart and the chambers that form each.',
    'Give the surface marking of the heart and the position of the apex beat.',
    'Describe the three layers of the cardiac wall, the septa and the surface grooves.',
  ],
  chunks: [
    {
      title: 'Shape, Size and Position',
      kind: 'overview',
      paragraphs: [
        'The heart is a fibromuscular pump of conical (pyramidal) shape, with a base, an apex, surfaces and borders. It lies obliquely, so that only about one-third of its mass lies to the right of the midline. Its size is roughly that of a clenched fist.',
        'It measures about 12 cm from base to apex and 8–9 cm at its broadest transverse diameter, and weighs about 300 g on average (heavier in males than females). It pumps over 7,600 litres (about 2,000 gallons) of blood per day.',
      ],
      terms: [
        { term: 'Base of the heart', meaning: 'The posterior surface, formed mainly by the left atrium.' },
        { term: 'Apex of the heart', meaning: 'The tip of the heart, formed by the left ventricle.' },
      ],
      keyPoints: [
        'About 12 cm long, 8–9 cm wide, ~300 g; two-thirds lies left of the midline.',
      ],
      sourceRefs: c1([72, 74, 75, 76]),
    },
    {
      title: 'Borders and Surfaces',
      kind: 'structure',
      paragraphs: [
        'Seen from the front, the heart has three borders and three surfaces: right, left and inferior borders; and the anterior (sternocostal), inferior (diaphragmatic) and posterior (base) surfaces.',
        'The right border consists entirely of the right atrium. The inferior border is formed mostly by the right ventricle, with a small part of the left ventricle forming the apex. The left border is formed mostly by the left ventricle, with the left auricle at its uppermost part.',
        'The anterior (sternocostal) surface is mainly right ventricle, with the right atrium at its right end and a strip of left ventricle at its left end; the tip of the left auricle is seen at the top.',
        'The inferior (diaphragmatic) surface is made up of about one-third right ventricle and two-thirds left ventricle, separated by the posterior interventricular vessels (a branch of the right coronary artery). The posterior surface (base) consists almost entirely of the left atrium, which receives the four pulmonary veins.',
      ],
      table: {
        columns: ['Border / surface', 'Formed by'],
        rows: [
          ['Right border', 'Right atrium'],
          ['Inferior border', 'Right ventricle (+ left ventricle at the apex)'],
          ['Left border', 'Left ventricle (+ left auricle above)'],
          ['Anterior (sternocostal) surface', 'Mainly right ventricle'],
          ['Inferior (diaphragmatic) surface', '⅓ right ventricle, ⅔ left ventricle'],
          ['Posterior surface (base)', 'Left atrium with four pulmonary veins'],
        ],
      },
      keyPoints: [
        'Right border = right atrium; anterior surface = mainly right ventricle; base = left atrium.',
        'The apex is formed by the left ventricle.',
      ],
      sourceRefs: c1([77, 78, 79, 80, 81, 82, 83, 84, 86]),
    },
    {
      title: 'Surface Marking and the Apex Beat',
      kind: 'clinical',
      paragraphs: [
        'The right border extends from the lower border of the right 3rd costal cartilage to the right 6th costal cartilage, just beyond the sternal border. The inferior border runs from the right 6th costal cartilage to the apex in the left 5th intercostal space. The left border extends from the apex upward and to the right to the left 2nd costal cartilage, about 2 cm from the sternal margin.',
        'The apex lies behind the 5th left intercostal space, 8–9 cm from the mid-sternal line, below the left nipple (not in the adult female). Clinically, this is the normal position of the apex beat.',
        'The precordium is the area of the chest wall over the heart; percussion over it gives the area of cardiac dullness.',
      ],
      steps: [
        { label: 'Right border', detail: 'Right 3rd costal cartilage → right 6th costal cartilage, just right of the sternum.' },
        { label: 'Inferior border', detail: 'Right 6th costal cartilage → apex (left 5th intercostal space).' },
        { label: 'Left border', detail: 'Apex → left 2nd costal cartilage, about 2 cm from the sternal margin.' },
      ],
      terms: [
        { term: 'Apex beat', meaning: 'The palpable impulse of the apex, normally in the left 5th intercostal space.' },
        { term: 'Precordium', meaning: 'Area of the chest wall overlying the heart (area of cardiac dullness on percussion).' },
        { term: 'Cardiomegaly', meaning: 'Enlargement of the heart, which displaces the apex beat.' },
      ],
      keyPoints: [
        'Apex beat: left 5th intercostal space, about 8–9 cm from the midline.',
      ],
      notes: [{ kind: 'check', text: 'Slide 87 places the apex at the midclavicular line, while slide 108 says “about 4 cm lateral to the mid-clavicular line”. Gray’s puts it at or just medial to the midclavicular line. Confirm the wording with your lecturer.' }],
      sourceRefs: [...c1([87, 88, 89, 108]), ...GRAYS],
    },
    {
      title: 'The Cardiac Wall, Chambers and Grooves',
      kind: 'structure',
      paragraphs: [
        'The cardiac wall has three layers. The epicardium is the visceral serous pericardium. The myocardium is cardiac muscle — thicker in the ventricles than the atria, and thicker in the left ventricle than the right. The endocardium lines the chambers, is continuous with the endothelium of the vessels and forms parts of the cardiac valves. Inflammation of the endocardium is endocarditis.',
        'The heart has four chambers: right and left atria above and right and left ventricles below. Each atrium has an ear-shaped extension, the auricle. The atria are separated by the interatrial septum and the ventricles by the interventricular septum. The atrioventricular valves — tricuspid on the right and mitral (bicuspid) on the left — separate atria from ventricles.',
        'Grooves on the surface mark the partitions between the chambers and carry the vessels that supply the heart wall. The most prominent is the atrioventricular (coronary) sulcus between atria and ventricles. The anterior and posterior interventricular sulci mark the partition between the ventricles.',
      ],
      steps: [
        { label: 'Epicardium', detail: 'Outer layer = visceral serous pericardium.' },
        { label: 'Myocardium', detail: 'Cardiac muscle; thickest in the left ventricle.' },
        { label: 'Endocardium', detail: 'Inner lining, continuous with vessel endothelium; forms parts of the valves.' },
      ],
      terms: [
        { term: 'Auricle', meaning: 'Ear-shaped pouch projecting from each atrium.' },
        { term: 'Coronary sulcus', meaning: 'The atrioventricular groove separating atria from ventricles.' },
        { term: 'Interventricular sulci', meaning: 'Anterior and posterior grooves marking the interventricular septum.' },
      ],
      keyPoints: [
        'Wall layers: epicardium, myocardium, endocardium.',
        'Coronary (AV) sulcus separates atria from ventricles; interventricular sulci separate the ventricles.',
      ],
      sourceRefs: c1([90, 91, 92, 93, 94, 96, 98, 99, 100, 101, 102, 104, 106]),
    },
  ],
  summary: [
    'The heart is conical, about 12 × 8–9 cm and 300 g, with two-thirds lying left of the midline.',
    'Right border = right atrium; left border = left ventricle + left auricle; inferior border = mainly right ventricle.',
    'Sternocostal surface = mainly right ventricle; diaphragmatic surface = ⅔ left ventricle; base = left atrium.',
    'The apex beat is in the left 5th intercostal space, 8–9 cm from the midline.',
    'The wall has epicardium, myocardium and endocardium; grooves mark the chambers.',
  ],
  highYield: [
    'Base (posterior surface) = left atrium receiving four pulmonary veins.',
    'Diaphragmatic surface: ⅓ right ventricle and ⅔ left ventricle, divided by the posterior interventricular vessels.',
    'Myocardium is thickest in the left ventricle.',
  ],
  confusions: [
    {
      confusion: 'Thinking the “base” of the heart is its lowest part.',
      clarification: 'The base is the posterior surface, formed by the left atrium; the apex points downward, forward and to the left (slides 77, 84).',
    },
  ],
};

// ─── Lesson 4: Chambers, Valves and the Cardiac Skeleton ─────────────

const lesson4: Draft = {
  id: L(4),
  title: 'Chambers, Valves and the Cardiac Skeleton',
  description: 'The interior of each chamber, the trabeculae and papillary muscles, the fibrous skeleton that anchors the valves, and the surface marking of the valves with their auscultation areas.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: c1([111, 112, 117, 118, 123, 125, 128, 130, 132, 134, 136, 137, 140, 142, 147, 148, 149]),
  objectives: [
    'Describe the internal features of the right atrium.',
    'Describe the right ventricle, conus arteriosus and the trabeculae carneae.',
    'Compare the left atrium and left ventricle with their right-sided counterparts.',
    'Describe the fibrous rings (cardiac skeleton) and their functions.',
    'Give the surface marking of the valves and the auscultation areas.',
  ],
  chunks: [
    {
      title: 'The Right Atrium',
      kind: 'structure',
      paragraphs: [
        'The right atrium receives systemic blood from the superior and inferior venae cavae and from the coronary sinus. It has a smooth sinus part (where the venae cavae open) and a rough auricular part.',
        'Internal features: the openings of the SVC, IVC and coronary sinus; the right atrioventricular (tricuspid) opening; the fossa ovalis with its raised margin, the limbus fossae ovalis (annulus ovalis); the crista terminalis; and the musculi pectinati.',
        'The crista terminalis is a muscular ridge separating the smooth sinus part from the rough auricular part, where the musculi pectinati are found. It corresponds on the outside to the sulcus terminalis.',
      ],
      terms: [
        { term: 'Fossa ovalis', meaning: 'Depression on the interatrial septum, the remnant of the fetal foramen ovale.' },
        { term: 'Crista terminalis', meaning: 'Internal muscular ridge separating the smooth and rough parts of the right atrium.' },
        { term: 'Musculi pectinati', meaning: 'Parallel muscular ridges in the auricular part of the atrium.' },
      ],
      keyPoints: [
        'Three inflows: SVC, IVC and coronary sinus; one outflow: the tricuspid opening.',
        'Crista terminalis (inside) ↔ sulcus terminalis (outside).',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the fossa ovalis is the remnant of the foramen ovale; a persistent opening is an atrial septal defect (ASD), popularly called a “hole in the heart” (slide 129 asks for this lay term).' }],
      sourceRefs: [...c1([111, 112, 115, 116, 129]), ...GRAYS],
    },
    {
      title: 'The Right Ventricle',
      kind: 'structure',
      paragraphs: [
        'The right ventricle is triangular and extends from the right atrium to near the apex. It forms much of the sternocostal surface and a small part of the diaphragmatic surface.',
        'Its posterior wall is the interventricular septum, which bulges into the right ventricle, so its cavity is crescentic (semilunar) on cross-section. Its upper left angle forms a conical pouch, the conus arteriosus (infundibulum), from which the pulmonary trunk arises.',
        'Trabeculae carneae are muscular columns projecting from the whole inner surface of the ventricle except the conus arteriosus. There are three varieties: ridges attached along their whole length; bridges fixed at both ends but free in the middle; and papillary muscles, attached by their bases with their apices giving origin to the chordae tendineae. The moderator band (septomarginal trabecula) is a bridge in the right ventricle.',
      ],
      steps: [
        { label: 'Ridges', detail: 'Attached along their entire length on one side.' },
        { label: 'Bridges', detail: 'Fixed at their ends, free in the middle (e.g. the moderator band).' },
        { label: 'Papillary muscles', detail: 'Attached by their bases; their apices give rise to the chordae tendineae.' },
      ],
      terms: [
        { term: 'Conus arteriosus', meaning: 'Smooth outflow pouch of the right ventricle leading to the pulmonary trunk (infundibulum).' },
        { term: 'Trabeculae carneae', meaning: 'Muscular ridges and columns lining the ventricular walls.' },
        { term: 'Chordae tendineae', meaning: 'Tendinous cords linking papillary muscles to the valve cusps.' },
        { term: 'Moderator band', meaning: 'Septomarginal trabecula crossing from the septum to the anterior papillary muscle of the right ventricle.' },
      ],
      keyPoints: [
        'The conus arteriosus is the only part of the ventricle free of trabeculae.',
        'Papillary muscles + chordae tendineae stop the AV valve cusps everting.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the moderator band carries the right bundle branch of the conduction system to the anterior papillary muscle.' }],
      sourceRefs: [...c1([117, 118, 121, 123, 124, 125]), ...GRAYS],
    },
    {
      title: 'The Left Atrium and Left Ventricle',
      kind: 'comparison',
      paragraphs: [
        'The left atrium is smaller than the right but has thicker walls. Like the right, it has a principal cavity and an auricle. The principal cavity is concealed in front by the pulmonary trunk and aorta and is separated from the right atrium by the interatrial septum.',
        'The four pulmonary veins open into the upper part of its posterior surface, two on each side; they have no valves, and the two left veins often end by a common opening. The left auricle is longer, narrower and more curved than the right, with more deeply indented margins, and it overlaps the root of the pulmonary trunk. Musculi pectinati are fewer than on the right and confined to the auricle.',
        'The left ventricle is longer and more conical than the right, and circular on cross-section. It forms a small part of the sternocostal surface, much of the diaphragmatic surface, and the apex. Its walls are about three times as thick as those of the right ventricle.',
        'Its interior shows the left atrioventricular (mitral) orifice, the aortic opening, the mitral (bicuspid) and aortic valves, trabeculae carneae and chordae tendineae. The mitral orifice lies below and to the left of the aortic orifice and is smaller than the tricuspid orifice.',
      ],
      table: {
        columns: ['Feature', 'Right side', 'Left side'],
        rows: [
          ['Atrial wall', 'Thinner', 'Thicker (smaller cavity)'],
          ['Musculi pectinati', 'Auricle and anterior wall', 'Fewer; auricle only'],
          ['Ventricle on cross-section', 'Crescentic', 'Circular'],
          ['Ventricular wall', 'Thin', 'About 3× thicker'],
          ['AV valve', 'Tricuspid', 'Mitral (bicuspid)'],
        ],
      },
      terms: [
        { term: 'Mitral valve', meaning: 'Bicuspid left atrioventricular valve.' },
        { term: 'Aortic valve', meaning: 'Semilunar valve at the outflow of the left ventricle.' },
      ],
      keyPoints: [
        'Pulmonary veins (4, valveless) open into the left atrium.',
        'Left ventricular wall is about 3× the thickness of the right.',
      ],
      sourceRefs: c1([128, 130, 131, 132, 133, 134, 135, 136, 137]),
    },
    {
      title: 'The Cardiac Skeleton',
      kind: 'structure',
      paragraphs: [
        'Fibrous rings surround the atrioventricular and arterial orifices and are stronger on the left than on the right. The atrioventricular rings give attachment to the muscle fibres of the atria and ventricles and to the mitral and tricuspid valves.',
        'The left atrioventricular ring is closely connected with the aortic ring. Between these and the right atrioventricular ring lies a mass of fibrous tissue, the trigonum fibrosum (right fibrous trigone), which represents the os cordis found in some animals.',
        'The rings around the arterial orifices give attachment to the great vessels and the semilunar valves.',
      ],
      terms: [
        { term: 'Cardiac skeleton', meaning: 'Fibrous rings and trigones that anchor the valves and the cardiac muscle.' },
        { term: 'Trigonum fibrosum', meaning: 'Fibrous mass between the aortic and the two atrioventricular rings.' },
      ],
      keyPoints: [
        'The fibrous skeleton anchors all four valves and the atrial and ventricular muscle.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the fibrous skeleton also electrically separates atria from ventricles, so impulses can only cross through the atrioventricular bundle.' }],
      sourceRefs: [...c1([140, 141, 142, 143]), ...GRAYS],
    },
    {
      title: 'Surface Marking of the Valves and Heart Sounds',
      kind: 'clinical',
      paragraphs: [
        'Anatomical positions: the tricuspid valve lies behind the lower half of the sternum in the midline; the mitral valve lies higher, opposite the left 4th costal cartilage; the aortic and pulmonary valves lie at the left border of the sternum at the level of the 3rd intercostal space and 3rd costal cartilage respectively.',
        'Heart sounds are produced by valve closure and are described as “lub-dub” (first and second heart sounds); the opening snap of the mitral valve may also be heard. They are heard best not over the valves themselves but where the chamber or vessel beyond each valve is closest to the chest wall — the auscultation areas.',
        'Aortic area: right 2nd intercostal space near the sternum. Pulmonary area: left 2nd intercostal space near the sternum. Mitral area: left 5th intercostal space near the midclavicular line. The tricuspid area is near the lower sternum (see the note below).',
      ],
      table: {
        columns: ['Valve', 'Auscultation area'],
        rows: [
          ['Aortic', 'Right 2nd intercostal space, near sternum'],
          ['Pulmonary', 'Left 2nd intercostal space, near sternum'],
          ['Mitral', 'Left 5th intercostal space, near midclavicular line'],
          ['Tricuspid', 'Lower sternal border, 5th intercostal space (side: see note)'],
        ],
      },
      terms: [
        { term: 'Auscultation area', meaning: 'Place on the chest where a valve’s sound is heard best.' },
      ],
      keyPoints: [
        'Valves are heard downstream of their anatomical position, where the chamber or vessel nears the chest wall.',
        'Mitral area = apex region (left 5th ICS, midclavicular line).',
      ],
      notes: [{ kind: 'check', text: 'Slide 149 places the tricuspid area in the 5th right intercostal space; Gray’s and most clinical texts put it at the lower left sternal border. Confirm with your lecturer.' }],
      sourceRefs: [...c1([147, 148, 149, 150, 151]), ...GRAYS],
    },
  ],
  summary: [
    'The right atrium receives the SVC, IVC and coronary sinus; key features are the fossa ovalis, crista terminalis and musculi pectinati.',
    'The right ventricle is crescentic and leads into the smooth conus arteriosus; trabeculae include papillary muscles and the moderator band.',
    'The left ventricle forms the apex and has walls about three times thicker than the right.',
    'The fibrous skeleton anchors the valves and the atrial and ventricular muscle.',
    'Aortic and pulmonary areas: right and left 2nd intercostal spaces; mitral area: left 5th intercostal space at the midclavicular line.',
  ],
  highYield: [
    'Fossa ovalis = remnant of the foramen ovale.',
    'Conus arteriosus (infundibulum) is smooth — no trabeculae carneae.',
    'Papillary muscles give rise to chordae tendineae.',
    'Aortic area right 2nd ICS; pulmonary area left 2nd ICS; mitral area left 5th ICS, MCL.',
  ],
  confusions: [
    {
      confusion: 'Listening for a valve directly over its anatomical position.',
      clarification: 'Each valve is heard best where the chamber or vessel beyond it lies closest to the chest wall, e.g. the aortic valve in the right 2nd intercostal space (slides 148–151).',
    },
  ],
};

// ─── Lesson 5: Conduction System and Coronary Circulation ────────────

const lesson5: Draft = {
  id: L(5),
  title: 'Conduction System and Coronary Circulation',
  description: 'How the heart generates and spreads its own impulse, the coronary arteries and their branches, the cardiac veins and the coronary sinus, and the clinical conditions linked to them.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: c1([152, 153, 154, 155, 158, 161, 168, 174, 178, 183]),
  objectives: [
    'Name the parts of the conduction system and give their positions.',
    'List the branches of the right and left coronary arteries.',
    'Describe the coronary sinus, its tributaries and the veins that open directly into the right atrium.',
    'Relate coronary anatomy to myocardial infarction and angina.',
  ],
  chunks: [
    {
      title: 'The Conduction System',
      kind: 'pathway',
      paragraphs: [
        'Cardiac muscle has an intrinsic rhythmicity: contractile impulses start at one point and spread through the heart without external stimulation. The conduction system is specialised tissue that generates and distributes these impulses; it is difficult to see grossly.',
        'Its components are the sinoatrial (SA) node, the atrioventricular (AV) node, the atrioventricular bundle (of His) and the Purkinje fibres.',
        'The SA node — the pacemaker, firing about 70–80 times per minute — lies in the posterior wall of the right atrium. The AV node lies in the inferior part of the interatrial septum. The AV bundle runs in the membranous part of the interventricular septum and divides into right and left bundle branches in the muscular septum. The Purkinje fibres lie within the ventricular walls.',
      ],
      steps: [
        { label: 'SA node', detail: 'Pacemaker in the posterior wall of the right atrium (70–80/min).' },
        { label: 'AV node', detail: 'Inferior part of the interatrial septum.' },
        { label: 'AV bundle (of His)', detail: 'Membranous part of the interventricular septum.' },
        { label: 'Right and left bundle branches', detail: 'Divide in the muscular part of the septum.' },
        { label: 'Purkinje fibres', detail: 'Distribute the impulse within the ventricular walls.' },
      ],
      terms: [
        { term: 'SA node', meaning: 'Sinoatrial node, the pacemaker of the heart.' },
        { term: 'Bundle of His', meaning: 'Atrioventricular bundle in the membranous interventricular septum.' },
        { term: 'Purkinje fibres', meaning: 'Conducting fibres spreading the impulse through the ventricular walls.' },
      ],
      keyPoints: [
        'Order: SA node → AV node → bundle of His → bundle branches → Purkinje fibres.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the SA node sits near the opening of the SVC at the upper end of the crista terminalis.' }],
      sourceRefs: [...c1([152, 153, 154, 155, 156, 157]), ...GRAYS],
    },
    {
      title: 'The Coronary Arteries',
      kind: 'structure',
      paragraphs: [
        'The main circulatory routes are systemic, caval, portal, pulmonary and coronary. The heart itself is supplied by the right and left coronary arteries, which arise from the aortic sinuses.',
        'Branches of the right coronary artery: the conus artery, the SA nodal artery, the right marginal artery, the AV nodal artery and the posterior interventricular branch.',
        'Branches of the left coronary artery: the circumflex branch with its obtuse marginal artery, the SA nodal artery (in about 40%), the anterior interventricular artery and its diagonal branches.',
        'In about 10% of people the right coronary artery is short, and the posterior interventricular artery is a continuation of the circumflex artery instead.',
      ],
      table: {
        columns: ['Right coronary artery', 'Left coronary artery'],
        rows: [
          ['Conus artery', 'Circumflex branch'],
          ['SA nodal artery (usually)', 'Obtuse marginal artery'],
          ['Right marginal artery', 'SA nodal artery (~40%)'],
          ['AV nodal artery', 'Anterior interventricular artery'],
          ['Posterior interventricular branch', 'Diagonal artery'],
        ],
      },
      terms: [
        { term: 'Aortic sinus', meaning: 'Dilatation above an aortic valve cusp; the coronary arteries arise here.' },
        { term: 'Anterior interventricular artery', meaning: 'Branch of the left coronary artery in the anterior interventricular groove (LAD).' },
        { term: 'Circumflex artery', meaning: 'Branch of the left coronary artery running in the coronary sulcus to the left and back.' },
      ],
      keyPoints: [
        'The posterior interventricular artery usually comes from the right coronary artery; in ~10% it comes from the circumflex.',
        'The SA node is supplied by the right coronary in most people and by the left in ~40%.',
      ],
      sourceRefs: c1([158, 161, 162, 168, 169]),
    },
    {
      title: 'Venous Drainage of the Heart',
      kind: 'structure',
      paragraphs: [
        'The principal vein of the heart is the coronary sinus, lying in the posterior atrioventricular groove and opening into the right atrium. It has five tributaries: the great cardiac vein, the middle cardiac vein, the small cardiac vein, the posterior vein of the left ventricle and the oblique vein of the left atrium.',
        'Other veins drain directly into the right atrium: the anterior cardiac veins, the venae cordis minimae (smallest cardiac veins) and the right marginal vein.',
      ],
      steps: [
        { label: 'Great cardiac vein', detail: 'Tributary of the coronary sinus.' },
        { label: 'Middle cardiac vein', detail: 'Tributary of the coronary sinus.' },
        { label: 'Small cardiac vein', detail: 'Tributary of the coronary sinus.' },
        { label: 'Posterior vein of the left ventricle', detail: 'Tributary of the coronary sinus.' },
        { label: 'Oblique vein of the left atrium', detail: 'Tributary of the coronary sinus.' },
      ],
      terms: [
        { term: 'Coronary sinus', meaning: 'Main venous channel of the heart, in the posterior AV groove, draining into the right atrium.' },
        { term: 'Venae cordis minimae', meaning: 'Smallest cardiac veins opening directly into the chambers.' },
      ],
      keyPoints: [
        'Five tributaries of the coronary sinus; anterior cardiac veins and venae cordis minimae bypass it.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s: the great cardiac vein runs with the anterior interventricular artery, and the middle cardiac vein with the posterior interventricular artery.' }],
      sourceRefs: [...c1([174, 175, 178]), ...GRAYS],
    },
    {
      title: 'Clinical Notes',
      kind: 'clinical',
      paragraphs: [
        'The lecture lists myocardial infarction, angina pectoris, valvular dysfunction, cardiomyopathy, myocardial hypertrophy and cor pulmonale as key clinical conditions.',
        'Myocardial infarction is death of heart muscle when a coronary artery is blocked; angina pectoris is chest pain from temporary myocardial ischaemia. Valvular dysfunction includes narrowing (stenosis) and leaking (regurgitation) of valves. Cor pulmonale is right ventricular enlargement and failure caused by lung disease.',
      ],
      terms: [
        { term: 'Myocardial infarction', meaning: 'Death of heart muscle from blockage of its coronary blood supply.' },
        { term: 'Angina pectoris', meaning: 'Chest pain from temporary myocardial ischaemia.' },
        { term: 'Cor pulmonale', meaning: 'Right ventricular enlargement and failure secondary to lung disease.' },
      ],
      keyPoints: [
        'Knowing which artery supplies which region predicts the territory damaged in an infarct.',
      ],
      notes: [{ kind: 'textbook', text: 'The slides list these conditions with images only; the short definitions here are from Gray’s.' }],
      sourceRefs: [...c1([183, 184, 185, 186, 188, 189]), ...GRAYS],
    },
  ],
  summary: [
    'Impulses arise in the SA node and pass through the AV node, bundle of His, bundle branches and Purkinje fibres.',
    'The coronary arteries arise from the aortic sinuses.',
    'RCA branches: conus, SA nodal, right marginal, AV nodal, posterior interventricular.',
    'LCA branches: circumflex (obtuse marginal), SA nodal in ~40%, anterior interventricular (diagonal).',
    'The coronary sinus drains most of the heart into the right atrium.',
  ],
  highYield: [
    'SA node: posterior wall of right atrium; AV node: inferior interatrial septum; bundle of His: membranous septum.',
    'Posterior interventricular artery: from the RCA usually, from the circumflex in about 10%.',
    'Coronary sinus tributaries: great, middle and small cardiac veins, posterior vein of LV, oblique vein of LA.',
  ],
  confusions: [
    {
      confusion: 'Assuming the SA nodal artery always comes from the left coronary artery.',
      clarification: 'It is listed as a branch of the right coronary artery, and from the left coronary in about 40% of people (slides 161, 168).',
    },
  ],
};

// ─── Lesson 6: Blood Vessels — Structure and Types ───────────────────

const lesson6: Draft = {
  id: L(6),
  title: 'Blood Vessels: Structure and Types',
  description: 'The organisation of the vascular tree, the three coats of the vessel wall, elastic and muscular arteries, anastomoses and end arteries, the three types of capillary, and veins.',
  xp: 25,
  estimatedMinutes: 12,
  sourceRefs: c2([3, 4, 5, 6, 7, 12, 13, 15, 16, 18, 19]),
  objectives: [
    'Name the three circulatory systems and trace blood from the heart through the vascular tree.',
    'Describe the three tunics of the vessel wall.',
    'Distinguish elastic from muscular arteries, and actual from potential anastomoses.',
    'Classify capillaries and give their locations.',
    'Describe the structure and features of veins.',
  ],
  chunks: [
    {
      title: 'Organisation of the Vascular System',
      kind: 'overview',
      paragraphs: [
        'There are three circulatory systems: the pulmonary system, the systemic (caval) system and the portal system.',
        'The blood vessels form a tubular network. Blood leaving the heart passes through arteries, arterioles and capillaries; blood returning from the capillaries passes through venules and veins.',
      ],
      steps: [
        { label: 'Arteries', detail: 'Carry blood away from the heart.' },
        { label: 'Arterioles', detail: 'Small muscular vessels controlling resistance.' },
        { label: 'Capillaries', detail: 'Site of exchange between blood and tissues.' },
        { label: 'Venules', detail: 'Collect blood from capillary beds.' },
        { label: 'Veins', detail: 'Return blood to the heart.' },
      ],
      keyPoints: [
        'Three circulations: pulmonary, systemic (caval) and portal.',
      ],
      sourceRefs: c2([3, 4]),
    },
    {
      title: 'The Vessel Wall and Arteries',
      kind: 'structure',
      paragraphs: [
        'The walls of arteries and veins have three coats (tunics). The tunica intima has an innermost endothelium (simple squamous epithelium lining all vessels) and a layer of elastic lamina surrounded by collagenous connective tissue. The tunica media is mainly smooth muscle. The tunica adventitia (externa) is the outer coat.',
        'Arteries conduct blood from the heart to the capillary beds and become progressively smaller. The aorta and other major arteries have a very thick elastic layer and are called elastic arteries; this produces elastic recoil of the vessel during diastole. Smaller arteries and arterioles have a thicker smooth muscle layer and are called muscular arteries.',
        'Anastomoses between arteries can be actual (e.g. the labial arteries between the two facial arteries) or potential (e.g. the coronary arteries). In some tissues blood passes from arterioles straight into venules through arteriovenous shunts (metarterioles). An end artery is one whose territory has no effective anastomosis, so its blockage causes death of the tissue it supplies.',
      ],
      table: {
        columns: ['Type', 'Wall feature', 'Example / effect'],
        rows: [
          ['Elastic artery', 'Very thick elastic lamina', 'Aorta — elastic recoil during diastole'],
          ['Muscular artery', 'Thick smooth muscle media', 'Small arteries and arterioles — control resistance'],
        ],
      },
      terms: [
        { term: 'Tunica intima', meaning: 'Inner coat: endothelium plus elastic lamina and connective tissue.' },
        { term: 'Tunica media', meaning: 'Middle coat, mainly smooth muscle.' },
        { term: 'Tunica adventitia', meaning: 'Outer connective-tissue coat (tunica externa).' },
        { term: 'End artery', meaning: 'An artery without effective anastomoses, so its occlusion causes infarction.' },
      ],
      keyPoints: [
        'Elastic arteries recoil in diastole; muscular arteries regulate flow.',
        'Coronary arteries are a potential anastomosis — functionally close to end arteries.',
      ],
      notes: [{ kind: 'textbook', text: 'Slide 7 asks “What is end artery?”; the definition here is from Gray’s.' }],
      sourceRefs: [...c2([5, 6, 7]), ...GRAYS],
    },
    {
      title: 'Capillaries',
      kind: 'classification',
      paragraphs: [
        'Capillaries are the narrowest blood vessels (7–10 µm; a red cell is 6–8 µm) and are the functional unit of the circulation, where nutrients and gases are exchanged between blood and tissues. Their wall is a single layer of endothelium — smooth muscle and connective tissue layers are absent.',
        'Flow through a capillary bed is regulated by pre-capillary sphincters. So the flow through an organ depends on these sphincters together with the resistance (constriction or dilatation) of the small muscular arteries and arterioles.',
        'There are three types, distinguished by their endothelium. Continuous capillaries have closely joined endothelial cells and are found in muscle, lung, adipose tissue and the CNS (in the CNS they lack intercellular channels, which contributes to the blood–brain barrier). Fenestrated capillaries have pores and are found in the kidneys, intestines and endocrine glands. Discontinuous capillaries (sinusoids) have wide gaps between cells and are found in the liver, bone marrow, adrenal medulla and spleen.',
      ],
      table: {
        columns: ['Type', 'Endothelium', 'Found in'],
        rows: [
          ['Continuous', 'Cells closely joined', 'Muscle, lung, adipose tissue, CNS'],
          ['Fenestrated', 'Pores (fenestrae)', 'Kidney, intestine, endocrine glands'],
          ['Discontinuous (sinusoid)', 'Wide gaps between cells', 'Liver, bone marrow, adrenal medulla, spleen'],
        ],
      },
      terms: [
        { term: 'Pre-capillary sphincter', meaning: 'Smooth muscle ring controlling flow into a capillary bed.' },
        { term: 'Sinusoid', meaning: 'Discontinuous capillary with wide gaps between endothelial cells.' },
        { term: 'Blood–brain barrier', meaning: 'Barrier partly due to CNS continuous capillaries lacking intercellular channels.' },
      ],
      keyPoints: [
        'Capillary wall = endothelium only.',
        'Liver, spleen and bone marrow have sinusoids; kidney and gut have fenestrated capillaries.',
      ],
      sourceRefs: c2([12, 13, 14, 15, 16, 17]),
    },
    {
      title: 'Veins',
      kind: 'structure',
      paragraphs: [
        'Veins collect blood from capillaries and return it to the heart. Compared with arteries they generally have thinner walls and wider lumens. They have the same three-layered wall, but no elastic lamina and much less muscle in the tunica media.',
        'In the limbs the veins are double: superficial veins and deep veins that accompany arteries (venae comitantes). Many veins, e.g. in the limbs and neck, have valves that prevent reflux.',
        'Several arteries are palpable and used clinically to feel the pulse.',
      ],
      terms: [
        { term: 'Venae comitantes', meaning: 'Paired deep veins that accompany an artery.' },
        { term: 'Venous valves', meaning: 'Cusps in many veins that prevent backflow.' },
      ],
      keyPoints: [
        'Veins: thinner wall, wider lumen, no elastic lamina, less muscle, often valves.',
      ],
      sourceRefs: c2([18, 19, 23]),
    },
  ],
  summary: [
    'Three circulations: pulmonary, systemic (caval) and portal.',
    'Vessel walls have tunica intima, media and adventitia.',
    'Elastic arteries (aorta) recoil in diastole; muscular arteries and arterioles regulate resistance.',
    'Capillaries are endothelium only and come in continuous, fenestrated and sinusoidal types.',
    'Veins have thinner walls, wider lumens, little muscle and often valves.',
  ],
  highYield: [
    'Capillary diameter 7–10 µm; red cell 6–8 µm.',
    'CNS continuous capillaries lack intercellular channels → blood–brain barrier.',
    'Sinusoids: liver, bone marrow, adrenal medulla, spleen.',
  ],
  confusions: [
    {
      confusion: 'Thinking capillaries have a thin layer of smooth muscle.',
      clarification: 'Capillary walls are a single layer of endothelium; flow is controlled upstream by pre-capillary sphincters and arterioles (slide 13).',
    },
  ],
};

// ─── Lesson 7: Great Vessels and Arteries of the Trunk ───────────────

const lesson7: Draft = {
  id: L(7),
  title: 'Great Vessels and Arteries of the Trunk',
  description: 'The parts of the aorta and their extents, the arch and its branches, the pulmonary trunk, the branches of the thoracic and abdominal aorta, and the mesenteric arteries.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: c2([27, 28, 32, 36, 40, 45, 46, 47, 51, 52, 53, 54, 58, 62, 65]),
  objectives: [
    'Name the parts of the aorta and give the extent of each.',
    'List the branches of the arch of the aorta.',
    'Describe the pulmonary trunk and the route of pulmonary artery catheterisation.',
    'List the branches of the thoracic and abdominal aorta.',
    'Describe the origin, relations and territory of the superior and inferior mesenteric arteries.',
  ],
  chunks: [
    {
      title: 'The Ascending Aorta and the Arch',
      kind: 'structure',
      paragraphs: [
        'The aorta has four parts: the ascending aorta, the arch of the aorta, the thoracic (descending) aorta and the abdominal aorta.',
        'The ascending aorta runs from the vestibule of the left ventricle at the level of the left 3rd costal cartilage to the manubriosternal joint (2nd costal cartilage), where it continues as the arch. It is partly enclosed by fibrous and serous pericardium. Its initial expanded part, the aortic sinus (of Valsalva), gives the right and left coronary arteries.',
        'The arch of the aorta runs from the sternal angle (2nd costal cartilage) to the left side of the body of T4. Its highest point is at the midpoint of the manubrium. It gives three branches — the brachiocephalic trunk, the left common carotid artery and the left subclavian artery. Baroreceptors and chemoreceptors lie in its adventitia.',
      ],
      steps: [
        { label: 'Ascending aorta', detail: 'Left ventricle (left 3rd costal cartilage) → manubriosternal joint; gives the coronary arteries.' },
        { label: 'Arch of the aorta', detail: 'Sternal angle → left side of T4; three branches.' },
        { label: 'Thoracic aorta', detail: 'T4 → T12, behind the median arcuate ligament.' },
        { label: 'Abdominal aorta', detail: 'T12 → bifurcation at L4.' },
      ],
      terms: [
        { term: 'Aortic sinus (of Valsalva)', meaning: 'Initial dilatation of the ascending aorta, origin of the coronary arteries.' },
        { term: 'Baroreceptors', meaning: 'Pressure sensors in the adventitia of the aortic arch.' },
      ],
      keyPoints: [
        'Arch branches: brachiocephalic trunk, left common carotid, left subclavian.',
        'The arch begins and ends at the level of the sternal angle (T4).',
      ],
      sourceRefs: c2([27, 28, 29, 30, 32, 33]),
    },
    {
      title: 'The Pulmonary Trunk',
      kind: 'structure',
      paragraphs: [
        'The pulmonary trunk runs from the infundibulum of the right ventricle to its division into right and left pulmonary arteries under the concavity of the aortic arch. It is surrounded by fibrous and serous pericardium.',
        'The right pulmonary artery is longer and wider than the left. The left pulmonary artery lies in front of the left bronchus and descending aorta, and is connected to the arch by the ligamentum arteriosum.',
        'Pulmonary artery catheterisation is used to monitor cardiorespiratory function. The catheter is introduced through the internal jugular or subclavian vein into the right atrium, through the tricuspid valve and right ventricle into the pulmonary trunk, and then into the right or left pulmonary artery.',
      ],
      steps: [
        { label: 'Internal jugular or subclavian vein', detail: 'Entry point.' },
        { label: 'Right atrium', detail: 'Via the SVC.' },
        { label: 'Tricuspid valve → right ventricle', detail: 'Into the ventricle.' },
        { label: 'Pulmonary trunk', detail: 'Through the pulmonary valve.' },
        { label: 'Right or left pulmonary artery', detail: 'Final position.' },
      ],
      terms: [
        { term: 'Ligamentum arteriosum', meaning: 'Fibrous remnant of the ductus arteriosus joining the left pulmonary artery to the arch.' },
        { term: 'Infundibulum', meaning: 'Outflow part (conus arteriosus) of the right ventricle.' },
      ],
      keyPoints: [
        'The right pulmonary artery is longer and wider than the left.',
      ],
      sourceRefs: c2([36, 37, 40]),
    },
    {
      title: 'The Thoracic Aorta',
      kind: 'structure',
      paragraphs: [
        'The arteries of the trunk come from the aorta. Its thoracic part gives paired branches and unpaired (visceral) branches; its abdominal part gives paired and ventral branches.',
        'The thoracic (descending) aorta continues from the arch at the body of T4 down to T12, where it passes beneath the median arcuate ligament and continues as the abdominal aorta.',
        'Its branches are the left and right bronchial arteries, oesophageal and mediastinal branches, the left and right posterior intercostal arteries (3rd–11th spaces) and the left and right subcostal arteries (T12).',
      ],
      terms: [
        { term: 'Posterior intercostal arteries', meaning: 'Paired branches of the thoracic aorta to the 3rd–11th intercostal spaces.' },
        { term: 'Median arcuate ligament', meaning: 'Fibrous arch of the diaphragmatic crura in front of the aorta at T12.' },
      ],
      keyPoints: [
        'Thoracic aorta: T4 → T12; becomes abdominal aorta behind the median arcuate ligament.',
      ],
      sourceRefs: c2([44, 45, 46, 47, 49]),
    },
    {
      title: 'The Abdominal Aorta',
      kind: 'structure',
      paragraphs: [
        'The abdominal aorta runs on the posterior abdominal wall from the median arcuate ligament at T12 to its bifurcation slightly to the left of L4.',
        'Ventral (unpaired) branches: the coeliac trunk, the superior mesenteric artery (SMA), the inferior mesenteric artery (IMA) and the median sacral artery.',
        'Lateral (paired) branches: the inferior phrenic, middle suprarenal, renal, gonadal (ovarian/testicular) and lumbar arteries, with the common iliac arteries as terminal branches. The common iliac artery has no branches until it divides; the internal iliac artery is the artery of the pelvis.',
        'Note the relations: the left renal vein crosses in front of the aorta, while the right renal artery passes behind the IVC.',
      ],
      table: {
        columns: ['Ventral (unpaired)', 'Lateral (paired)'],
        rows: [
          ['Coeliac trunk', 'Inferior phrenic'],
          ['Superior mesenteric', 'Middle suprarenal'],
          ['Inferior mesenteric', 'Renal'],
          ['Median sacral', 'Gonadal'],
          ['—', 'Lumbar; common iliac (terminal)'],
        ],
      },
      terms: [
        { term: 'Coeliac trunk', meaning: 'First ventral branch of the abdominal aorta, artery of the foregut.' },
        { term: 'Common iliac artery', meaning: 'Terminal branch of the aorta; gives no branches before dividing.' },
      ],
      keyPoints: [
        'Abdominal aorta: T12 → L4 (slightly left of midline).',
        'Left renal vein lies anterior to the aorta; right renal artery behind the IVC.',
      ],
      sourceRefs: c2([51, 52, 53, 54]),
    },
    {
      title: 'The Mesenteric Arteries',
      kind: 'structure',
      paragraphs: [
        'The superior mesenteric artery is the artery of the midgut. It supplies the gut from the entrance of the bile duct to the proximal two-thirds of the transverse colon. It arises from the aorta at the lower border of L1 and lies anterior to the left renal vein, the uncinate process of the pancreas and the 3rd part of the duodenum. Its branches include the ileocolic, right colic and middle colic arteries, linked by the marginal artery.',
        'The inferior mesenteric artery is the artery of the hindgut. It supplies the gut from the distal third of the transverse colon to the upper part of the anal canal (pectinate/dentate line). It arises at the level of the umbilicus, opposite L3, and gives the left colic artery, the sigmoid arteries and the superior rectal artery.',
        'The portal vein and its tributaries return blood from the gut to the liver; sites where portal and systemic veins meet are the portocaval anastomoses (covered fully in the GIT lessons).',
      ],
      table: {
        columns: ['Artery', 'Origin', 'Territory'],
        rows: [
          ['Superior mesenteric', 'Lower border of L1', 'Bile duct entrance → proximal ⅔ of transverse colon (midgut)'],
          ['Inferior mesenteric', 'L3 (umbilicus level)', 'Distal ⅓ of transverse colon → pectinate line (hindgut)'],
        ],
      },
      terms: [
        { term: 'Marginal artery', meaning: 'Arterial channel along the colon linking colic branches of the SMA and IMA.' },
        { term: 'Superior rectal artery', meaning: 'Terminal branch of the IMA to the rectum.' },
      ],
      keyPoints: [
        'SMA → midgut; IMA → hindgut.',
        'The SMA crosses in front of the left renal vein and the 3rd part of the duodenum.',
      ],
      sourceRefs: c2([58, 59, 60, 61, 62, 63, 65]),
    },
  ],
  summary: [
    'The aorta has ascending, arch, thoracic and abdominal parts.',
    'The arch runs from the sternal angle to T4 and gives the brachiocephalic trunk, left common carotid and left subclavian arteries.',
    'The pulmonary trunk divides under the arch; the left pulmonary artery is tied to the arch by the ligamentum arteriosum.',
    'The thoracic aorta gives bronchial, oesophageal, mediastinal, posterior intercostal and subcostal branches.',
    'The abdominal aorta (T12–L4) gives ventral coeliac, SMA, IMA and median sacral branches, plus paired lateral branches.',
  ],
  highYield: [
    'Coronary arteries arise from the aortic sinuses of the ascending aorta.',
    'SMA: L1, midgut; IMA: L3, hindgut.',
    'Aortic bifurcation: L4, slightly left of midline.',
  ],
  confusions: [
    {
      confusion: 'Thinking the common iliac artery gives branches to the pelvis.',
      clarification: 'The common iliac artery has no branches until it divides; the internal iliac is the artery of the pelvis (slide 53).',
    },
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7].map((lesson) => ({
  ...lesson,
  interactive: interactive[lesson.id],
}));
