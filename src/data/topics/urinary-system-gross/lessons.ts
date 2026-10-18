// Anatomy → Urinary System (gross): the five lessons (reading layer).
import type { LessonDraft } from '@/data/topics/build';
import { interactive } from '@/data/topics/urinary-system-gross/interactive';
import { TOPIC_ID, ur, type ConceptId } from '@/data/topics/urinary-system-gross/sources';

type Draft = LessonDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

// ─── Lesson 1: The Kidneys — Position, Coverings and Relations ───────

const lesson1: Draft = {
  id: L(1),
  title: 'The Kidneys: Position, Coverings and Relations',
  description: 'The organs of the urinary system, what the kidneys do, where they lie and how big they are, their protective coverings and renal fascia, and their anterior and posterior relations.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: ur([2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 15, 18]),
  objectives: [
    'Name the organs of the upper and lower urinary tract and list the functions of the kidneys.',
    'Describe the position, size and surface anatomy of the kidneys.',
    'List the coverings of the kidney from inside out and describe the renal fascia.',
    'Give the anterior and posterior relations of each kidney.',
  ],
  chunks: [
    {
      title: 'The Urinary System and Kidney Functions',
      kind: 'overview',
      paragraphs: [
        'The upper urinary tract is the kidneys and ureters; the lower urinary tract is the urinary bladder and urethra.',
        'The kidneys regulate water balance (osmoregulation), pH and inorganic ions (sodium, potassium, calcium); excrete metabolic and nitrogenous wastes (urea, creatinine); and have hormonal functions — erythropoietin (stimulates red cell production), the renin–angiotensin system (blood pressure) and calcitriol (active vitamin D, calcium and bone). They also carry out gluconeogenesis.',
      ],
      terms: [
        { term: 'Erythropoietin', meaning: 'Kidney hormone that stimulates red blood cell production.' },
        { term: 'Calcitriol', meaning: 'Active vitamin D formed in the kidney.' },
      ],
      keyPoints: [
        'Upper tract: kidneys + ureters. Lower tract: bladder + urethra.',
      ],
      sourceRefs: ur([1, 2, 3]),
    },
    {
      title: 'Position, Size and Surface Anatomy',
      kind: 'structure',
      paragraphs: [
        'The kidneys are paired, reddish-brown, bean-shaped, retroperitoneal organs on the posterior abdominal wall on either side of the vertebral column, extending from T12 to L3. Each is about 12 × 6 × 3 cm and weighs 130–150 g; they are slightly larger in males. The right kidney lies 1–1.5 cm lower than the left because of the liver; the left is slightly longer and narrower. The transpyloric plane passes through the upper part of the right hilum and the lower part of the left hilum.',
        'Each kidney has anterior and posterior surfaces, lateral (convex) and medial (concave, with the hilum) borders, and upper and lower poles. It lies obliquely, with the upper pole nearer the midline, and its long axis parallels the lateral border of psoas major. In adults only the lower pole may be palpable, on deep inspiration. The lower pole of the right kidney is about a finger’s breadth above the iliac crest.',
        'The kidneys move 2–3 cm up and down with respiration within their fascial compartment. Nephroptosis (floating kidney) is descent of more than 5 cm, from poor support, and may kink the ureter causing hydronephrosis. The suprarenal glands are in separate compartments attached to the diaphragm, so they do not move with a mobile kidney.',
        'Surgical access is usually through a posterior (flank) oblique incision midway between the 12th rib and the iliac crest. For percutaneous renal biopsy the needle goes 2.5 cm below the 12th rib to the lower pole while the patient holds their breath. The costovertebral angle (between the 12th rib and erector spinae) is where tenderness suggests renal disease such as pyelonephritis or perinephric abscess. The fetal kidney surface is lobulated.',
      ],
      terms: [
        { term: 'Hilum', meaning: 'Opening on the medial border of the kidney for the ureter, vessels and nerves.' },
        { term: 'Nephroptosis', meaning: 'Downward displacement of the kidney by more than 5 cm (“floating kidney”).' },
        { term: 'Costovertebral angle', meaning: 'Angle between the 12th rib and erector spinae, tender in renal disease.' },
      ],
      keyPoints: [
        'Kidneys: T12–L3; right lower than left.',
        'Kidneys move 2–3 cm with breathing; the suprarenals do not.',
      ],
      sourceRefs: ur([4, 5, 6, 8, 18]),
    },
    {
      title: 'Coverings of the Kidney',
      kind: 'structure',
      paragraphs: [
        'From inside out: (1) the fibrous renal capsule (true capsule) — thin and tough, closely applied to the kidney and lining the renal sinus; normally easily stripped, but adherent in inflammation such as pyelonephritis. (2) Perirenal (perinephric) fat — surrounds the kidney and suprarenal gland and cushions them. (3) Renal fascia (false capsule, Gerota’s fascia) — dense connective tissue enclosing the kidney, perirenal fat, suprarenal gland, vessels and upper ureter; it limits the spread of infection and haemorrhage. (4) Pararenal (paranephric) fat — outside the fascia, mainly posteriorly, filling the retroperitoneal space.',
        'The renal fascia is attached above to the diaphragmatic fascia, medially to the aorta and IVC, laterally to the transversalis fascia, and below it has little or no attachment. So infections (perinephric abscess) or collections of urine or blood can track downward into the pelvis. Stripping the fascia when mobilising the ureter may damage its blood supply and cause necrosis.',
      ],
      steps: [
        { label: 'Fibrous renal capsule', detail: 'True capsule; strips easily unless inflamed.' },
        { label: 'Perirenal fat', detail: 'Surrounds kidney and suprarenal gland.' },
        { label: 'Renal (Gerota’s) fascia', detail: 'False capsule; open below.' },
        { label: 'Pararenal fat', detail: 'Outside the fascia, mainly behind.' },
      ],
      terms: [
        { term: 'Renal fascia', meaning: 'Gerota’s fascia enclosing kidney, suprarenal and perirenal fat; weak inferiorly.' },
        { term: 'Perirenal fat', meaning: 'Fat inside the renal fascia around the kidney and suprarenal.' },
      ],
      keyPoints: [
        'Renal fascia is open below → perinephric pus can track into the pelvis.',
      ],
      sourceRefs: ur([7, 9, 10]),
    },
    {
      title: 'Relations of the Kidneys',
      kind: 'comparison',
      paragraphs: [
        'Anterior relations of the right kidney: the suprarenal gland, right lobe of the liver, 2nd part of the duodenum, hepatic flexure and small intestine. The suprarenal, duodenal and colic areas are bare of peritoneum. The 2nd part of the duodenum may be accidentally opened during a right nephrectomy.',
        'Anterior relations of the left kidney: the suprarenal gland, stomach, spleen, body and tail of the pancreas, jejunum, and the descending colon or splenic flexure. The suprarenal, pancreatic and colic areas are bare of peritoneum.',
        'Posterior relations (both): the costodiaphragmatic recess of the pleura; the medial and lateral arcuate ligaments; the diaphragm, psoas major, quadratus lumborum and transversus abdominis; the subcostal, iliohypogastric and ilioinguinal nerves and subcostal vessels; and the 11th and 12th ribs on the left, the 12th rib on the right.',
      ],
      table: {
        columns: ['Right kidney (anterior)', 'Left kidney (anterior)'],
        rows: [
          ['Suprarenal gland', 'Suprarenal gland'],
          ['Right lobe of liver', 'Stomach and spleen'],
          ['2nd part of duodenum', 'Body and tail of pancreas'],
          ['Hepatic flexure', 'Descending colon / splenic flexure'],
          ['Small intestine', 'Jejunum'],
        ],
      },
      terms: [
        { term: 'Bare areas', meaning: 'Parts of the anterior kidney surface in contact with organs without intervening peritoneum.' },
      ],
      keyPoints: [
        'Left kidney: ribs 11 and 12 behind; right: rib 12 only.',
        'Pleura lies behind the upper kidney (costodiaphragmatic recess).',
      ],
      sourceRefs: ur([13, 14, 15, 16, 17]),
    },
  ],
  summary: [
    'Kidneys regulate water, pH and ions, excrete wastes and make erythropoietin, renin and calcitriol.',
    'They lie retroperitoneally from T12 to L3; the right is lower.',
    'Coverings: capsule, perirenal fat, renal fascia, pararenal fat.',
    'Renal fascia is open below, so infection can spread into the pelvis.',
    'The 2nd part of the duodenum lies in front of the right kidney; the pancreas and spleen in front of the left.',
  ],
  highYield: [
    'Kidney size 12 × 6 × 3 cm, 130–150 g.',
    'Transpyloric plane: upper right hilum, lower left hilum.',
    'Renal biopsy: 2.5 cm below the 12th rib.',
  ],
  confusions: [
    {
      confusion: 'Thinking the suprarenal glands move with a mobile kidney.',
      clarification: 'They lie in separate compartments of the renal fascia and are attached to the diaphragm (slide 8).',
    },
  ],
};

// ─── Lesson 2: Kidney Structure, Vessels, Nerves and Suprarenals ─────

const lesson2: Draft = {
  id: L(2),
  title: 'Kidney Structure, Vessels and the Suprarenal Glands',
  description: 'The renal sinus, hilum, cortex, medulla, calyces and pelvis; the renal arteries and veins with their variations; the nerves of the kidney and renal pain; and the suprarenal glands.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: ur([11, 12, 19, 20, 22, 24, 25, 26, 27, 32, 34, 36, 37]),
  objectives: [
    'Describe the hilum, renal sinus, cortex, medulla and urine collecting system.',
    'Give the order of structures at the hilum.',
    'Describe the renal arteries and veins, accessory arteries and the avascular line of Brödel.',
    'Describe the innervation of the kidney and the pattern of renal pain.',
    'Describe the suprarenal glands: position, relations, blood supply and nerve supply.',
  ],
  chunks: [
    {
      title: 'Internal Structure',
      kind: 'structure',
      paragraphs: [
        'The hilum is the opening on the concave medial border for the ureter, renal vessels, lymphatics and nerves; it leads into the renal sinus, a fat-filled cavity lined by the capsule containing the renal pelvis, calyces, vessels and nerves. At the hilum, from front to back: vein, artery, pelvis (VAP); from above down: artery, vein, pelvis (AVP).',
        'The cortex is the reddish-brown outer layer; it projects inward between the pyramids as the renal columns (of Bertin). The medulla is the paler inner part containing the renal pyramids (of Malpighi). The apex of each pyramid, the renal papilla, fits into a minor calyx and has 10–25 openings of papillary ducts.',
        'Urine collects through 2–3 minor calyces → major calyces (2–3) → the renal pelvis, a funnel that drains into the ureter. The pelvis and calyces hold about 8 ml, important when injecting contrast. The pelvis may be buried within the kidney (making pyelolithotomy difficult) or extrarenal (making it easy).',
      ],
      steps: [
        { label: 'Renal papilla', detail: 'Apex of a pyramid with papillary duct openings.' },
        { label: 'Minor calyx', detail: 'Receives one papilla.' },
        { label: 'Major calyx', detail: 'Formed by minor calyces.' },
        { label: 'Renal pelvis', detail: 'Funnel formed by major calyces; ~8 ml with calyces.' },
        { label: 'Ureter', detail: 'Leaves at the hilum.' },
      ],
      terms: [
        { term: 'Renal columns', meaning: 'Columns of Bertin: cortex extending between the pyramids.' },
        { term: 'Renal pyramids', meaning: 'Pyramids of Malpighi forming the medulla.' },
        { term: 'Renal sinus', meaning: 'Fat-filled space inside the kidney containing the pelvis, calyces and vessels.' },
      ],
      keyPoints: [
        'Hilum front to back: Vein, Artery, Pelvis (VAP).',
      ],
      sourceRefs: ur([11, 12, 19, 20, 21]),
    },
    {
      title: 'Blood Supply and Variations',
      kind: 'structure',
      paragraphs: [
        'The kidneys filter about 180 L of plasma a day, producing only 1–2 L of urine, and receive 20–25% of resting cardiac output. Each is supplied by a renal artery from the lateral aspect of the abdominal aorta just below the SMA (L2).',
        'The left renal vein passes in front of the aorta and receives the left gonadal, suprarenal and lumbar veins; it is about three times longer than the right, so the left kidney is preferred for live donor nephrectomy. The right renal vein is short; the right renal artery passes behind the IVC. Lymph drains to the para-aortic nodes.',
        'Nutcracker syndrome is compression of the left renal vein between the aorta and SMA, causing renal venous hypertension, haematuria, flank pain and sometimes a left varicocele or pelvic congestion.',
        'The avascular line of Brödel runs along the lateral, slightly posterior border, between the territories of the anterior and posterior divisions of the renal artery — a good site for incisions into the kidney (e.g. nephrolithotomy).',
        'Accessory renal arteries occur in about 30% of people, from the aorta or main renal artery, entering at the hilum or poles (polar arteries). An inferior polar artery may cross and obstruct the ureter, causing hydronephrosis. Kidneys may also be malrotated, duplicated, horseshoe, absent or ectopic (pelvic). Renal transplants are placed in the iliac fossa.',
      ],
      terms: [
        { term: 'Line of Brödel', meaning: 'Avascular plane along the lateral border between anterior and posterior arterial territories.' },
        { term: 'Nutcracker syndrome', meaning: 'Compression of the left renal vein between the aorta and SMA.' },
        { term: 'Polar artery', meaning: 'Accessory renal artery entering a pole of the kidney.' },
      ],
      keyPoints: [
        'Left renal vein: long, in front of the aorta, receives left gonadal and suprarenal veins.',
        'Accessory renal arteries in ~30%.',
      ],
      sourceRefs: ur([22, 23, 24, 25, 26]),
    },
    {
      title: 'Nerves and Renal Pain',
      kind: 'mechanism',
      paragraphs: [
        'Sympathetic fibres from T10–L1 travel in the lesser and least thoracic splanchnic nerves to the aorticorenal ganglion (and partly the coeliac ganglion); postganglionic fibres form the renal plexus around the renal artery. They cause renal vasoconstriction, reduce GFR and stimulate renin release.',
        'Parasympathetic fibres come from the vagus; some afferents mediate reflexes such as nausea and vomiting.',
        'Renal pain arises from stretching of the renal capsule (inflammation such as glomerulonephritis) or obstruction at the pelviureteric junction. It is felt in the flank and lower back (T12–L1) and may radiate to the anterior abdominal wall and external genitalia.',
      ],
      terms: [
        { term: 'Renal plexus', meaning: 'Autonomic nerve plexus around the renal artery.' },
      ],
      keyPoints: [
        'Sympathetic stimulation → vasoconstriction, ↓ GFR, ↑ renin.',
      ],
      sourceRefs: ur([27, 28]),
    },
    {
      title: 'The Suprarenal Glands',
      kind: 'structure',
      paragraphs: [
        'The suprarenal (adrenal) glands are yellowish retroperitoneal organs on the upper poles of the kidneys; the left lies more superomedially, its lower pole above the hilum. Each weighs 4–8 g (about 5 g) and measures roughly 4 × 3 × 1 cm. They lie deep to the 10th and 11th ribs beside the vertebral column, move about 3 cm with breathing, and are enclosed in Gerota’s fascia but separated from the kidney by perirenal fat. The right is pyramidal and the left crescent-shaped; the coeliac plexus lies between them. Each has a yellow cortex and dark brown medulla, and they are large at birth because of the fetal cortex.',
        'The right gland is close to the IVC and liver; the stomach, pancreas and spleen lie in front of the left.',
        'Arteries come from three sources: the superior suprarenal (from the inferior phrenic), the middle suprarenal (from the aorta) and the inferior suprarenal (from the renal artery). The suprarenal vein drains into the IVC on the right and the renal vein on the left. Lymph goes to the lateral aortic nodes.',
        'Preganglionic sympathetic fibres from the thoracic splanchnic nerves (especially the greater) pass via the coeliac plexus to synapse directly on the chromaffin cells of the medulla. The medulla has no parasympathetic supply.',
      ],
      table: {
        columns: ['Artery', 'Source'],
        rows: [
          ['Superior suprarenal', 'Inferior phrenic artery'],
          ['Middle suprarenal', 'Abdominal aorta'],
          ['Inferior suprarenal', 'Renal artery'],
        ],
      },
      terms: [
        { term: 'Chromaffin cells', meaning: 'Medullary cells innervated directly by preganglionic sympathetic fibres.' },
      ],
      keyPoints: [
        'Three arteries, one vein (right → IVC, left → left renal vein).',
        'Medulla is supplied by PREganglionic sympathetic fibres.',
      ],
      sourceRefs: ur([32, 33, 34, 35, 36, 37]),
    },
  ],
  summary: [
    'Urine passes from papillae to minor calyces, major calyces, renal pelvis and ureter.',
    'Hilum order front to back: vein, artery, pelvis.',
    'The renal arteries arise at L2; the long left renal vein crosses in front of the aorta.',
    'Sympathetics from T10–L1 constrict renal vessels and release renin; renal pain is felt in the flank (T12–L1).',
    'Each suprarenal gland has three arteries and one vein; its medulla receives preganglionic sympathetic fibres.',
  ],
  highYield: [
    'Kidneys receive 20–25% of cardiac output; filter ~180 L/day.',
    'Left kidney preferred for live donation (longer vein).',
    'Inferior polar artery can obstruct the ureter.',
  ],
  confusions: [
    {
      confusion: 'Thinking the suprarenal medulla is supplied by postganglionic sympathetic fibres.',
      clarification: 'Preganglionic fibres synapse directly on its chromaffin cells, which act like postganglionic neurons (slide 37).',
    },
  ],
};

// ─── Lesson 3: The Ureters ───────────────────────────────────────────

const lesson3: Draft = {
  id: L(3),
  title: 'The Ureters',
  description: 'The ureters from renal pelvis to bladder: their parts and relations in the abdomen and pelvis, the three narrowings where stones lodge, their blood, lymph and nerve supply, and ureteric colic.',
  xp: 25,
  estimatedMinutes: 13,
  sourceRefs: ur([38, 39, 41, 42, 43, 44, 46, 48, 49, 50, 52, 53]),
  objectives: [
    'Describe the length, parts and identification of the ureters.',
    'Give the relations of the right and left ureters and of the pelvic ureter in each sex.',
    'Name the sites of ureteric constriction and relate them to renal stones.',
    'Describe the blood supply, lymph drainage and innervation of the ureter and explain ureteric colic.',
  ],
  chunks: [
    {
      title: 'Course and Relations',
      kind: 'structure',
      paragraphs: [
        'The ureters are retroperitoneal fibromuscular tubes 25–30 cm long from the renal pelvis to the bladder. At surgery a ureter is whitish, non-pulsatile and shows peristalsis when gently pinched (Kelly’s sign). Parts: abdominal, pelvic and intravesical (intramural). The pelvic ureter has a fibromuscular (Waldeyer) sheath; the intravesical part passes obliquely through the bladder wall, preventing vesicoureteric reflux.',
        'Right ureter — in front: 2nd part of the duodenum, terminal ileum, right colic and ileocolic vessels, gonadal vessels and root of the mesentery; behind: right psoas and the bifurcation of the right common iliac artery. Left ureter — in front: sigmoid colon and mesocolon with sigmoid arteries, left colic and gonadal vessels; behind: left psoas and the left common iliac bifurcation; medially: the IMV.',
        'In the male pelvis the ureter lies above the seminal vesicle and is crossed by the vas deferens. In the female it passes behind the ovary, reaches the base of the broad ligament beside the lateral fornix of the vagina, and is crossed above by the uterine artery (“water under the bridge”) before entering the bladder. It is at risk in hysterectomy, and a stone in the lower ureter can be felt through the lateral fornix.',
        'On a plain X-ray the ureter runs along the tips of the lumbar transverse processes, crosses the sacroiliac joint, swings out near the ischial spine and turns medially to the bladder. IVU (intravenous urography) or CT urography shows the whole tract.',
      ],
      terms: [
        { term: 'Kelly’s sign', meaning: 'Peristalsis of the ureter when pinched — identifies it at surgery.' },
        { term: 'Water under the bridge', meaning: 'Ureter passing beneath the uterine artery in the female pelvis.' },
      ],
      keyPoints: [
        'Ureter crosses the common iliac bifurcation at the pelvic brim.',
        'Uterine artery crosses above the ureter — danger in hysterectomy.',
      ],
      sourceRefs: ur([38, 39, 40, 41, 42, 43, 50, 51]),
    },
    {
      title: 'Constrictions and Renal Stones',
      kind: 'clinical',
      paragraphs: [
        'There are three anatomical constrictions: the pelviureteric junction (PUJ); the pelvic brim, where the ureter crosses the common iliac bifurcation; and the vesicoureteric junction (VUJ), the narrowest, where it enters the bladder wall. Stones lodge at these points, causing hydroureter and hydronephrosis.',
        'Renal stones are about 75% calcium salts (oxalate or phosphate), 15% magnesium ammonium phosphate and 10% uric acid or cystine. Risk factors include high urinary calcium, obesity, diet, calcium supplements, hyperparathyroidism, gout, low fluid intake, heredity and metabolic disorders such as cystinuria. Stones are named by site (nephrolithiasis, ureterolithiasis, cystolithiasis) or composition. They are removed by percutaneous nephrolithotomy or broken up by shock-wave lithotripsy.',
      ],
      steps: [
        { label: 'Pelviureteric junction', detail: 'Where the pelvis becomes the ureter.' },
        { label: 'Pelvic brim', detail: 'Crossing the common iliac bifurcation.' },
        { label: 'Vesicoureteric junction', detail: 'Narrowest — entry into the bladder wall.' },
      ],
      terms: [
        { term: 'Hydronephrosis', meaning: 'Dilatation of the renal pelvis and calyces from obstruction.' },
        { term: 'Lithotripsy', meaning: 'Breaking up stones with focused shock waves.' },
      ],
      keyPoints: [
        'VUJ is the narrowest point.',
        '75% of stones are calcium salts.',
      ],
      sourceRefs: ur([44, 45, 46, 47]),
    },
    {
      title: 'Blood Supply, Lymph and Nerves; Ureteric Colic',
      kind: 'mechanism',
      paragraphs: [
        'The ureter takes branches from every artery along its course: upper third — renal artery; middle third — aorta, gonadal, common and internal iliac arteries; lower third — superior and inferior vesical and uterine arteries. These form longitudinal anastomoses in the adventitia, so the ureter can be divided and rejoined (uretero-ureterostomy). The abdominal ureter is supplied from its medial side (so approach it laterally); the pelvic ureter from its lateral side (so approach it medially).',
        'Lymph: upper abdominal ureter → lateral aortic nodes; lower abdominal ureter → common iliac nodes; pelvic ureter → common, external or internal iliac nodes.',
        'Sympathetic supply from T10–L2 via the renal, aortic and hypogastric plexuses; parasympathetic from the vagus (upper ureter) and pelvic splanchnic nerves S2–S4 (lower ureter). Peristalsis is generated by pacemaker cells in the renal pelvis and minor calyces; nerves only modulate it. Pain fibres follow the sympathetics (T10–L2).',
        'Ureteric colic is sudden, spasmodic pain as the ureteric muscle tries to expel an obstruction such as a stone; the patient is restless. Pain spreads from the loin to the groin and may radiate to the scrotum or labia majora, testis or tip of the penis, and to the anteromedial thigh via the femoral branch of the genitofemoral nerve (L1–L2).',
      ],
      table: {
        columns: ['Ureter segment', 'Arteries'],
        rows: [
          ['Upper third', 'Renal artery'],
          ['Middle third', 'Aorta, gonadal, common and internal iliac'],
          ['Lower third', 'Superior and inferior vesical, uterine'],
        ],
      },
      terms: [
        { term: 'Ureteric colic', meaning: 'Spasmodic loin-to-groin pain from ureteric obstruction.' },
      ],
      keyPoints: [
        'Abdominal ureter: vessels from medial side; pelvic ureter: from lateral side.',
        'Loin-to-groin pain = T11–L2 referred pain.',
      ],
      sourceRefs: ur([48, 49, 52, 53]),
    },
  ],
  summary: [
    'Ureters are 25–30 cm, retroperitoneal, with abdominal, pelvic and intravesical parts.',
    'They cross the common iliac bifurcation at the pelvic brim; in females the uterine artery crosses above them.',
    'Constrictions: PUJ, pelvic brim, VUJ (narrowest).',
    'Arterial supply comes from every vessel along the course, anastomosing longitudinally.',
    'Ureteric colic radiates from loin to groin and genitalia.',
  ],
  highYield: [
    'Kelly’s sign identifies the ureter.',
    'Oblique intravesical course prevents reflux.',
    'Lower ureteric stone may be felt through the lateral vaginal fornix.',
  ],
  confusions: [
    {
      confusion: 'Thinking the nerves generate ureteric peristalsis.',
      clarification: 'Pacemaker cells in the renal pelvis and minor calyces generate it; autonomic nerves only modulate (slide 52).',
    },
  ],
};

// ─── Lesson 4: The Urinary Bladder ───────────────────────────────────

const lesson4: Draft = {
  id: L(4),
  title: 'The Urinary Bladder',
  description: 'The bladder’s position, parts, relations and capacity, its interior and trigone, its true and false ligaments, its blood and nerve supply, and the urethral sphincters that control micturition.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: ur([55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 69]),
  objectives: [
    'Describe the position, parts, relations and capacity of the bladder.',
    'Describe the trigone, interureteric ridge, neck and uvula vesicae.',
    'Distinguish true and false ligaments of the bladder.',
    'Give the blood supply and innervation of the bladder and the roles of the urethral sphincters.',
  ],
  chunks: [
    {
      title: 'Position, Parts and Relations',
      kind: 'structure',
      paragraphs: [
        'The bladder is a muscular sac (detrusor muscle) that relaxes to fill and contracts to empty. It is the most anterior pelvic viscus in both sexes. In children it is abdominal; in adults it is pelvic except when very full.',
        'It has an apex (pointing to the anterior abdominal wall and attached to the median umbilical ligament, the urachal remnant), a superior surface, a posterior surface (base or fundus), two inferolateral surfaces and a neck.',
        'Relations: the superior surface is covered by peritoneum and related to intestines (sigmoid colon in males, body of the uterus in females); the inferolateral surfaces to levator ani and obturator internus; the anterior surface to the pubic symphysis across the retropubic space (of Retzius); the base — in males to the seminal vesicles and ampullae of the vas deferens (separated from the rectum by the rectovesical/Denonvilliers’ fascia), in females to the cervix and upper vagina (vesicovaginal septum); the neck — the prostate in males, the pelvic floor in females. A pregnant uterus pushes the bladder up and forward.',
        'The adult bladder holds 400–600 ml. Empty, it is collapsed and tetrahedral within the true pelvis; full, it is ovoid, rises into the abdomen and pushes the peritoneum up toward the umbilicus — which allows suprapubic catheterisation without entering the peritoneal cavity.',
      ],
      terms: [
        { term: 'Detrusor', meaning: 'Smooth muscle of the bladder wall.' },
        { term: 'Space of Retzius', meaning: 'Retropubic space between the pubic symphysis and the bladder.' },
        { term: 'Median umbilical ligament', meaning: 'Urachal remnant attached to the apex of the bladder.' },
      ],
      keyPoints: [
        'Capacity 400–600 ml; full bladder rises above the pubis.',
      ],
      sourceRefs: ur([55, 56, 57, 58, 69]),
    },
    {
      title: 'Interior of the Bladder',
      kind: 'structure',
      paragraphs: [
        'The mucosa is thrown into folds (rugae), which let the bladder stretch, except over the trigone — a smooth triangular area on the posterior wall between the two ureteric orifices (posterolateral corners) and the internal urethral orifice (inferior apex). The trigone is sensitive to stretch (signalling the need to micturate) and a common site of infection.',
        'The ureteric orifices lie about 2.5 cm apart in the empty bladder and about 5 cm apart during cystoscopy. The interureteric ridge (bar of Mercier), raised by underlying muscle, joins them and guides the cystoscopist to the orifices.',
        'The neck is the narrow inferior part continuous with the urethra, surrounded in males by the internal urethral sphincter (less well defined in females). The uvula vesicae is a small elevation just above and behind the internal urethral orifice, produced by the median lobe of the prostate, which is prone to benign prostatic hyperplasia.',
      ],
      terms: [
        { term: 'Trigone', meaning: 'Smooth triangle between the ureteric orifices and internal urethral orifice.' },
        { term: 'Interureteric ridge', meaning: 'Bar of Mercier joining the ureteric orifices.' },
        { term: 'Uvula vesicae', meaning: 'Elevation behind the internal urethral orifice from the median lobe of the prostate.' },
      ],
      keyPoints: [
        'Trigone: smooth, stretch-sensitive, common infection site.',
      ],
      sourceRefs: ur([59, 60, 61]),
    },
    {
      title: 'Supports, Blood Supply and Nerves',
      kind: 'structure',
      paragraphs: [
        'True ligaments are condensations of pelvic fascia (with smooth muscle) that support the bladder: lateral true ligaments, medial and lateral pubovesical ligaments (puboprostatic in males, surgically important near the dorsal venous plexus), the median umbilical ligament and posterior true ligaments (enclosing the vesical venous plexus). False ligaments are peritoneal folds without supporting function: the median and medial umbilical folds and the false lateral and posterior ligaments.',
        'Arteries: superior and inferior vesical (internal iliac); in females the vaginal (which replaces the inferior vesical) and uterine arteries contribute. Veins form the vesical venous plexus draining to the internal iliac veins.',
        'Parasympathetic (pelvic splanchnic nerves, S2–S4) contracts the detrusor and relaxes the internal sphincter — emptying. Sympathetic (hypogastric plexus) relaxes the detrusor and contracts the internal sphincter — filling. Somatic (pudendal nerve) controls the external urethral sphincter.',
        'The internal urethral sphincter is involuntary smooth muscle at the bladder neck (sympathetic T11–L2); it prevents leakage during filling and, in males, stops semen entering the bladder during ejaculation. The external urethral sphincter is voluntary skeletal muscle in the urogenital diaphragm (pudendal, S2–S4); it may weaken after childbirth, causing stress incontinence.',
      ],
      table: {
        columns: ['Nerve', 'Detrusor', 'Internal sphincter', 'Effect'],
        rows: [
          ['Parasympathetic (S2–S4)', 'Contracts', 'Relaxes', 'Emptying'],
          ['Sympathetic (T11–L2)', 'Relaxes', 'Contracts', 'Filling'],
          ['Pudendal (somatic)', '—', '—', 'Controls external sphincter'],
        ],
      },
      terms: [
        { term: 'Internal urethral sphincter', meaning: 'Involuntary smooth-muscle sphincter at the bladder neck.' },
        { term: 'External urethral sphincter', meaning: 'Voluntary skeletal-muscle sphincter supplied by the pudendal nerve.' },
        { term: 'Stress incontinence', meaning: 'Leakage on raised abdominal pressure from a weak external sphincter.' },
      ],
      keyPoints: [
        'Parasympathetic = pee; sympathetic = storage.',
      ],
      sourceRefs: ur([62, 63, 64, 65, 66, 67]),
    },
  ],
  summary: [
    'The bladder is the most anterior pelvic organ; it holds 400–600 ml.',
    'Its base relates to the seminal vesicles in males and the cervix and vagina in females.',
    'The trigone is smooth and stretch-sensitive; the interureteric ridge guides cystoscopy.',
    'True ligaments support; false ligaments are just peritoneal folds.',
    'Pelvic splanchnics empty the bladder; sympathetics allow filling; the pudendal nerve controls the external sphincter.',
  ],
  highYield: [
    'Uvula vesicae = median lobe of the prostate.',
    'Inferior vesical artery replaced by the vaginal artery in females.',
    'Retropubic space of Retzius lies in front of the bladder.',
  ],
  confusions: [
    {
      confusion: 'Mixing up which autonomic division empties the bladder.',
      clarification: 'Parasympathetic (S2–S4) contracts the detrusor and opens the internal sphincter; sympathetic does the opposite (slide 64).',
    },
  ],
};

// ─── Lesson 5: The Urethra ───────────────────────────────────────────

const lesson5: Draft = {
  id: L(5),
  title: 'The Urethra',
  description: 'The short female urethra and the three parts of the male urethra with the features of the prostatic urethra, their blood supply, lymph drainage and innervation, and urinary incontinence.',
  xp: 25,
  estimatedMinutes: 11,
  sourceRefs: ur([70, 71, 72, 75, 77, 78, 79]),
  objectives: [
    'Describe the female urethra and explain its clinical significance.',
    'Describe the three parts of the male urethra and their features.',
    'Describe the features of the prostatic urethra.',
    'Give the blood supply, lymph drainage and innervation of the urethra.',
    'Define urinary incontinence and explain physiological incontinence in infants.',
  ],
  chunks: [
    {
      title: 'The Female Urethra',
      kind: 'structure',
      paragraphs: [
        'The female urethra is 3–4 cm long, short and distensible — so urinary tract infections are more common, and catheterisation is easier. It opens into the vestibule in front of the vagina and behind the clitoris. The ducts of the para-urethral (Skene’s) glands open beside it; they secrete fluid during sexual arousal, which may be mistaken for urine. Vaginal stretching lengthens it only temporarily.',
      ],
      terms: [
        { term: 'Skene’s glands', meaning: 'Para-urethral glands opening beside the female urethra.' },
      ],
      keyPoints: [
        'Short (3–4 cm) female urethra → higher UTI risk.',
      ],
      sourceRefs: ur([70]),
    },
    {
      title: 'The Male Urethra',
      kind: 'structure',
      paragraphs: [
        'The male urethra carries both urine and semen and has three parts. The prostatic urethra (about 3 cm) passes through the prostate; it is the widest and most dilatable part and receives the prostatic and ejaculatory ducts.',
        'The membranous urethra (about 2 cm) passes through the urogenital diaphragm, surrounded by the external urethral sphincter; it is the narrowest and least dilatable part and the most easily injured, e.g. during catheterisation.',
        'The spongy (penile) urethra (about 15 cm) runs through the corpus spongiosum to the external urethral meatus at the tip of the glans, receiving the ducts of the bulbourethral (Cowper’s) glands and many mucous urethral glands.',
        'In the prostatic urethra, the urethral crest is a longitudinal ridge on the posterior wall. On it, the seminal colliculus (verumontanum) carries the openings of the ejaculatory ducts and the prostatic utricle (a remnant of the paramesonephric ducts, the male analogue of the uterus and vagina). The verumontanum is a landmark in transurethral resection of the prostate (TURP) — resection distal to it may cause incontinence. The prostatic sinuses on either side of the crest receive the prostatic ducts.',
      ],
      table: {
        columns: ['Part', 'Length', 'Key features'],
        rows: [
          ['Prostatic', '~3 cm', 'Widest; ejaculatory and prostatic ducts; verumontanum'],
          ['Membranous', '~2 cm', 'Narrowest; external sphincter; easily injured'],
          ['Spongy (penile)', '~15 cm', 'Corpus spongiosum; bulbourethral gland ducts'],
        ],
      },
      terms: [
        { term: 'Seminal colliculus', meaning: 'Verumontanum: elevation on the urethral crest with the ejaculatory ducts and utricle.' },
        { term: 'Prostatic utricle', meaning: 'Remnant of the paramesonephric ducts in the prostatic urethra.' },
        { term: 'TURP', meaning: 'Transurethral resection of the prostate.' },
      ],
      keyPoints: [
        'Membranous urethra: narrowest and most easily torn.',
      ],
      sourceRefs: ur([71, 72, 73, 74]),
    },
    {
      title: 'Supply of the Urethra and Incontinence',
      kind: 'structure',
      paragraphs: [
        'Female urethra: mainly the vaginal arteries; veins to the vesical venous plexus. Male urethra: prostatic part — inferior vesical artery; membranous part — bulbourethral artery; penile part — dorsal artery of the penis (both from the internal pudendal artery). Veins follow the arteries to the prostatic or vesical venous plexus.',
        'Lymph: female proximal urethra → internal and external iliac nodes; distal → superficial inguinal nodes. Male prostatic and membranous parts → internal iliac nodes; spongy part → inguinal nodes (some to external iliac).',
        'Nerves: in males the prostatic plexus (autonomic) and the pudendal nerve (S2–S4) with the dorsal nerve of the penis; in females the vesical plexus (autonomic) and the pudendal nerve for the distal urethra and external sphincter, with proximal reflexes via the pelvic splanchnic nerves.',
        'Urinary incontinence is involuntary leakage of urine when storage and sphincter control fail. Infants are physiologically incontinent because the corticospinal tracts controlling the external sphincter are not yet myelinated; voluntary control develops at about 3–6 years.',
      ],
      terms: [
        { term: 'Urinary incontinence', meaning: 'Involuntary leakage of urine.' },
        { term: 'Bulbourethral artery', meaning: 'Internal pudendal branch supplying the membranous urethra.' },
      ],
      keyPoints: [
        'Spongy urethra drains to inguinal nodes; deep parts to internal iliac nodes.',
      ],
      sourceRefs: ur([75, 77, 78, 79]),
    },
  ],
  summary: [
    'The female urethra is 3–4 cm, making UTIs common and catheterisation easy.',
    'The male urethra has prostatic (3 cm), membranous (2 cm) and spongy (15 cm) parts.',
    'The membranous urethra is the narrowest and most easily injured.',
    'The verumontanum is a TURP landmark; the utricle is a paramesonephric remnant.',
    'Infants are incontinent until the corticospinal tracts myelinate (3–6 years).',
  ],
  highYield: [
    'Prostatic urethra: widest and most dilatable.',
    'Cowper’s glands open into the spongy urethra.',
  ],
  confusions: [
    {
      confusion: 'Thinking the prostatic urethra is the narrowest part.',
      clarification: 'It is the widest; the membranous urethra is the narrowest (slide 71).',
    },
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5].map((lesson) => ({
  ...lesson,
  interactive: interactive[lesson.id],
}));
