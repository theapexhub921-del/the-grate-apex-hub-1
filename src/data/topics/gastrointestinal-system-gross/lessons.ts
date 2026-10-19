// Anatomy → Gastrointestinal System (gross): the ten lessons (reading layer).
import type { LessonDraft } from '@/data/topics/build';
import { interactive } from '@/data/topics/gastrointestinal-system-gross/interactive';
import { aw, gi, GRAYS, nv, TOPIC_ID, type ConceptId } from '@/data/topics/gastrointestinal-system-gross/sources';

type Draft = LessonDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

// ─── Lesson 1: The Abdomen and the Anterolateral Wall ────────────────

const lesson1: Draft = {
  id: L(1),
  title: 'The Abdomen and the Anterolateral Wall',
  description: 'The boundaries of the abdomen, its quadrants and nine regions, key surface points, and the layers, fascia and muscles of the anterolateral abdominal wall.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: aw([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 21, 22]),
  objectives: [
    'Define the boundaries of the abdomen.',
    'Describe the four quadrants and nine regions and the planes that form them.',
    'Locate McBurney’s and Murphy’s points and explain their clinical signs.',
    'List the layers of the anterolateral abdominal wall and describe Camper’s and Scarpa’s fascia.',
    'Name the muscles of the wall and the structures derived from them.',
  ],
  chunks: [
    {
      title: 'Boundaries, Quadrants and Regions',
      kind: 'structure',
      paragraphs: [
        'The abdomen is the part of the trunk between the thorax and the pelvis — a flexible, expandable container holding the peritoneal cavity and abdominal viscera. Its boundaries are: superiorly the diaphragm (reaching the 4th intercostal space on the right dome); anterolaterally the lower ribs and anterolateral abdominal wall; posteriorly the lumbar vertebrae and posterior wall muscles; and inferiorly the pelvic brim (inlet), where it is continuous with the pelvic cavity.',
        'Four quadrants are formed by the median plane and the transumbilical plane (L3/L4). Nine regions are formed by two vertical midclavicular planes (through the midpoint of each inguinal ligament) and two horizontal planes: the subcostal plane (10th costal cartilage, L3) and the transtubercular plane (L5) — or alternatively the transpyloric plane (L1) and the interspinous plane.',
        'The transpyloric plane of Addison lies a hand’s breadth below the xiphoid process, or midway between the jugular notch and the pubic symphysis.',
        'The nine regions are: right hypochondrium, epigastrium, left hypochondrium; right lumbar (flank), umbilical, left lumbar; right inguinal (iliac fossa), hypogastrium (suprapubic) and left inguinal.',
      ],
      table: {
        columns: ['Row', 'Right', 'Middle', 'Left'],
        rows: [
          ['Upper', 'Right hypochondrium', 'Epigastrium', 'Left hypochondrium'],
          ['Middle', 'Right lumbar (flank)', 'Umbilical', 'Left lumbar (flank)'],
          ['Lower', 'Right inguinal (iliac fossa)', 'Hypogastrium (suprapubic)', 'Left inguinal (iliac fossa)'],
        ],
      },
      terms: [
        { term: 'Transpyloric plane', meaning: 'Addison’s plane at L1, midway between jugular notch and pubic symphysis.' },
        { term: 'Transumbilical plane', meaning: 'Horizontal plane through the umbilicus at L3/L4, used for the four quadrants.' },
        { term: 'Subcostal plane', meaning: 'Horizontal plane through the 10th costal cartilage at L3.' },
      ],
      keyPoints: [
        'Quadrants: median + transumbilical planes. Regions: midclavicular + subcostal/transtubercular planes.',
      ],
      sourceRefs: aw([3, 4, 5, 6]),
    },
    {
      title: 'Surface Landmarks: McBurney’s and Murphy’s Points',
      kind: 'clinical',
      paragraphs: [
        'McBurney’s point lies one-third of the way from the right anterior superior iliac spine (ASIS) to the umbilicus, on the spinoumbilical line. It approximates the surface projection of the base of the appendix. Tenderness here is a classic sign of acute appendicitis, and rebound tenderness (pain when pressure is released) suggests peritoneal irritation.',
        'Murphy’s point lies below the right costal margin at the midclavicular line, over the gallbladder. A positive Murphy’s sign — pain with sudden arrest of breathing when this point is palpated during deep inspiration — suggests acute cholecystitis.',
        'The anterolateral wall extends from the xiphoid process and costal margins above to the inguinal ligament, iliac crests, pubic crest and pubic symphysis below, and laterally to the midaxillary lines. Surface features include the linea alba, tendinous intersections, the semilunar (Spigelian) line, the umbilicus, the ASIS and the pubic tubercle.',
      ],
      terms: [
        { term: 'McBurney’s point', meaning: 'One-third of the way from the right ASIS to the umbilicus; base of the appendix.' },
        { term: 'Murphy’s sign', meaning: 'Pain and arrested inspiration on palpating below the right costal margin at the MCL; cholecystitis.' },
        { term: 'Rebound tenderness', meaning: 'Pain on release of pressure, suggesting peritoneal irritation.' },
      ],
      keyPoints: [
        'McBurney’s point → appendix; Murphy’s point → gallbladder.',
      ],
      sourceRefs: aw([7, 8]),
    },
    {
      title: 'Layers of the Wall and the Superficial Fascia',
      kind: 'structure',
      paragraphs: [
        'The anterolateral wall supports and protects the viscera, helps maintain posture, raises intra-abdominal pressure (to expel air, urine, vomitus, faeces or a fetus), acts in forced expiration and flexes and rotates the trunk.',
        'Its layers from outside in are: skin; superficial fascia (Camper’s fatty and Scarpa’s membranous layers); muscles and their aponeuroses; transversalis fascia; extraperitoneal (preperitoneal) fat; and parietal peritoneum. A thin deep fascia covers the muscles.',
        'The skin is thin and mobile. Langer’s (tension) lines follow the collagen bundles of the dermis and run transversely here. Incisions parallel to them heal with less tension and narrower scars; incisions across them gape and leave wider scars.',
        'Above the umbilicus the superficial fascia is a single fatty layer. Below it there are two: Camper’s fascia (fatty, continuous with general body fat) and Scarpa’s fascia (membranous). Scarpa’s fascia blends above with the deep fascia of the thorax, attaches below to the fascia lata about 2.5 cm below the inguinal ligament (preventing spread of fluid into the thigh), and continues medially as Colles’ fascia in the perineum and dartos fascia in the scrotum and penis; it also forms the fundiform ligament of the penis or clitoris.',
        'Because of these attachments, extravasated urine or blood deep to Scarpa’s fascia spreads into the scrotum, penis and lower abdominal wall but not into the thigh.',
      ],
      steps: [
        { label: 'Skin', detail: 'Thin, mobile; transverse Langer’s lines.' },
        { label: 'Camper’s fascia', detail: 'Fatty superficial layer.' },
        { label: 'Scarpa’s fascia', detail: 'Membranous layer; fused to fascia lata below the inguinal ligament.' },
        { label: 'Muscles and aponeuroses', detail: 'External oblique, internal oblique, transversus abdominis, rectus.' },
        { label: 'Transversalis fascia', detail: 'Lines the abdominal cavity.' },
        { label: 'Extraperitoneal fat', detail: 'Preperitoneal fat.' },
        { label: 'Parietal peritoneum', detail: 'Innermost layer.' },
      ],
      terms: [
        { term: 'Scarpa’s fascia', meaning: 'Membranous layer of superficial fascia below the umbilicus.' },
        { term: 'Colles’ fascia', meaning: 'Perineal continuation of Scarpa’s fascia.' },
        { term: 'Langer’s lines', meaning: 'Lines of skin tension following dermal collagen.' },
      ],
      keyPoints: [
        'Scarpa’s fascia attaches to the fascia lata → urine from a ruptured urethra does not enter the thigh.',
      ],
      sourceRefs: aw([9, 10, 11, 12, 13, 14]),
    },
    {
      title: 'Muscles of the Anterolateral Wall',
      kind: 'structure',
      paragraphs: [
        'There are three flat (lateral) muscles — external oblique, internal oblique and transversus abdominis — and two vertical (anterior) muscles — rectus abdominis and pyramidalis (which may be absent). The neurovascular plane lies between the internal oblique and transversus abdominis. The segmental nerves to rectus have little cross-communication, so damage to them should be avoided.',
        'Structures derived from external oblique: the rectus sheath, superficial inguinal ring, inguinal ligament (of Poupart), lacunar ligament (of Gimbernat), pectineal ligament (of Cooper), external spermatic fascia and reflected inguinal ligament. From internal oblique: the rectus sheath, conjoint tendon, and the cremasteric muscle and fascia. From transversus abdominis: the rectus sheath and conjoint tendon.',
        'The conjoint tendon (falx inguinalis) is formed by the arching fibres of internal oblique and transversus abdominis, inserting on the pubic crest and pectineal line.',
        'The transversalis fascia lines the abdominal cavity, is continuous with the diaphragmatic, endopelvic and thoracolumbar fascia, forms the iliopubic tract (a landmark in laparoscopic hernia repair), and contributes the deep inguinal ring, the internal spermatic fascia and the front of the femoral sheath.',
        'Divarication (diastasis) of the recti is separation of the two rectus muscles at the linea alba, producing a midline bulge on contraction — seen in pregnancy, obesity, multiparity and heavy lifters. The TRAM flap uses lower abdominal skin, fat and rectus abdominis for breast reconstruction.',
      ],
      table: {
        columns: ['Muscle', 'Derived structures'],
        rows: [
          ['External oblique', 'Inguinal, lacunar, pectineal and reflected ligaments; superficial ring; external spermatic fascia'],
          ['Internal oblique', 'Conjoint tendon; cremaster muscle and fascia'],
          ['Transversus abdominis', 'Conjoint tendon (no spermatic cord covering)'],
          ['Transversalis fascia', 'Deep ring; internal spermatic fascia; iliopubic tract; anterior femoral sheath'],
        ],
      },
      terms: [
        { term: 'Conjoint tendon', meaning: 'Falx inguinalis: combined fibres of internal oblique and transversus abdominis to the pubic crest.' },
        { term: 'Iliopubic tract', meaning: 'Thickened lower margin of the transversalis fascia behind the inguinal ligament.' },
        { term: 'Divarication of recti', meaning: 'Separation of the rectus muscles at the linea alba.' },
      ],
      keyPoints: [
        'Neurovascular plane: between internal oblique and transversus abdominis.',
        'The inguinal ligament is the rolled lower edge of the external oblique aponeurosis.',
      ],
      sourceRefs: aw([15, 16, 17, 18, 19, 20, 21, 22]),
    },
  ],
  summary: [
    'The abdomen lies between the diaphragm and the pelvic brim.',
    'Quadrants use the median and transumbilical planes; nine regions use midclavicular, subcostal and transtubercular planes.',
    'McBurney’s point marks the appendix base; Murphy’s point the gallbladder.',
    'Below the umbilicus the superficial fascia splits into Camper’s (fatty) and Scarpa’s (membranous) layers.',
    'Three flat muscles plus rectus abdominis and pyramidalis form the wall; internal oblique and transversus form the conjoint tendon.',
  ],
  highYield: [
    'Transpyloric plane = L1.',
    'Scarpa’s fascia fuses with fascia lata 2.5 cm below the inguinal ligament.',
    'Neurovascular plane: internal oblique / transversus abdominis.',
  ],
  confusions: [
    {
      confusion: 'Thinking extravasated urine deep to Scarpa’s fascia tracks into the thigh.',
      clarification: 'Scarpa’s fascia is attached to the fascia lata just below the inguinal ligament, so fluid spreads to the scrotum, penis and lower abdominal wall but not the thigh (slides 12, 14).',
    },
  ],
};

// ─── Lesson 2: Rectus Sheath, Neurovasculature and Incisions ─────────

const lesson2: Draft = {
  id: L(2),
  title: 'Rectus Sheath, Vessels, Nerves and Incisions',
  description: 'How the rectus sheath is built above and below the arcuate line, the arteries, veins, lymphatics and nerves of the anterolateral wall, and the anatomy behind abdominal incisions.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: aw([26, 30, 31, 33, 35, 36, 37, 38, 39]),
  objectives: [
    'Describe the contents and formation of the rectus sheath above and below the arcuate line.',
    'List the arteries of the anterolateral wall and the important venous anastomoses.',
    'Describe the lymph drainage above and below the umbilicus.',
    'Give the nerve supply and dermatomes of the wall and explain nerve blocks.',
    'Describe the main abdominal incisions and their anatomical basis.',
  ],
  chunks: [
    {
      title: 'The Rectus Sheath',
      kind: 'structure',
      paragraphs: [
        'The rectus sheath is a fibrous compartment enclosing rectus abdominis (and pyramidalis if present), the lower thoracoabdominal nerves (T7–T11) and the superior and inferior epigastric vessels. It is formed by the aponeuroses of the three flat muscles.',
        'Above the arcuate line, the anterior sheath is formed by the external oblique aponeurosis plus half of the internal oblique aponeurosis; the posterior sheath by the other half of the internal oblique plus transversus abdominis.',
        'Below the arcuate line, all aponeuroses pass in front of rectus. The posterior sheath is absent, leaving only transversalis fascia — increasing the risk of rectus sheath haematoma and herniation. The arcuate line (of Douglas) is the crescentic lower border of the posterior sheath, about one-third to one-half of the way from the umbilicus to the pubic symphysis; the inferior epigastric vessels enter the sheath here.',
        'The sheaths fuse in the midline to form the linea alba, running from the xiphisternum to the pubic symphysis. It is relatively avascular, making it a preferred site for surgical entry.',
      ],
      table: {
        columns: ['Level', 'Anterior sheath', 'Posterior sheath'],
        rows: [
          ['Above arcuate line', 'External oblique + ½ internal oblique', '½ internal oblique + transversus abdominis'],
          ['Below arcuate line', 'All three aponeuroses', 'Absent — transversalis fascia only'],
        ],
      },
      terms: [
        { term: 'Arcuate line', meaning: 'Lower edge of the posterior rectus sheath (of Douglas).' },
        { term: 'Linea alba', meaning: 'Avascular midline fusion of the rectus sheaths from xiphisternum to symphysis.' },
      ],
      keyPoints: [
        'Below the arcuate line, rectus lies directly on transversalis fascia.',
      ],
      sourceRefs: aw([26, 27, 28, 29, 30]),
    },
    {
      title: 'Vessels and Lymphatics of the Wall',
      kind: 'structure',
      paragraphs: [
        'Arteries: the superior epigastric (continuation of the internal thoracic), the musculophrenic (internal thoracic), the inferior epigastric and deep circumflex iliac (external iliac), the superficial circumflex iliac and superficial epigastric (femoral), and the 7th–11th intercostal and subcostal (T12) arteries.',
        'Deep veins follow the arteries: superior epigastric to the internal thoracic vein; inferior epigastric to the external iliac vein. The superficial epigastric vein in Camper’s fascia drains to the great saphenous vein.',
        'Important anastomoses: the thoracoepigastric vein links the lateral thoracic and superficial epigastric veins, a collateral between the superior and inferior venae cavae. Paraumbilical veins link the superficial veins around the umbilicus to the portal vein — enlarged in portal hypertension as caput medusae.',
        'Superficial lymph above the umbilicus drains to the axillary (pectoral) nodes and some parasternal nodes; below the umbilicus to the superficial inguinal nodes. Deep lymph above the umbilicus goes to the parasternal and external iliac nodes; below it to the external iliac → common iliac → lumbar (para-aortic) nodes.',
      ],
      table: {
        columns: ['Drainage', 'Above umbilicus', 'Below umbilicus'],
        rows: [
          ['Superficial lymph', 'Axillary (pectoral) and parasternal', 'Superficial inguinal'],
          ['Deep lymph', 'Parasternal, external iliac', 'External → common iliac → lumbar'],
        ],
      },
      terms: [
        { term: 'Thoracoepigastric vein', meaning: 'Superficial vein linking SVC and IVC territories.' },
        { term: 'Caput medusae', meaning: 'Dilated paraumbilical veins in portal hypertension.' },
      ],
      keyPoints: [
        'Superior and inferior epigastric arteries anastomose inside the rectus sheath.',
        'Umbilicus is the watershed for both venous and lymph drainage.',
      ],
      sourceRefs: aw([31, 32, 33, 34, 35]),
    },
    {
      title: 'Nerves, Dermatomes and Nerve Blocks',
      kind: 'structure',
      paragraphs: [
        'The wall is supplied by the thoracoabdominal nerves (ventral rami of T7–T11), the subcostal nerve (T12) and the iliohypogastric and ilioinguinal nerves (L1).',
        'Dermatomes: T7–T9 supply the skin above the umbilicus, T10 the skin around the umbilicus, T11–T12 the skin below it, and L1 the pubic region.',
        'For an anterior abdominal nerve block, T7–T11 are blocked as they emerge beneath the costal margin; the iliohypogastric and ilioinguinal nerves about 2.5 cm (1 inch) above the ASIS on the spinoumbilical line; and terminal branches of the genitofemoral nerve lateral to the pubic tubercle.',
      ],
      table: {
        columns: ['Dermatome', 'Skin area'],
        rows: [
          ['T7–T9', 'Above the umbilicus'],
          ['T10', 'Around the umbilicus'],
          ['T11–T12', 'Below the umbilicus'],
          ['L1', 'Pubic region'],
        ],
      },
      terms: [
        { term: 'Thoracoabdominal nerves', meaning: 'Continuations of intercostal nerves T7–T11 into the abdominal wall.' },
        { term: 'Ilioinguinal nerve', meaning: 'L1 nerve to the lower wall that passes through the inguinal canal.' },
      ],
      keyPoints: [
        'T10 = umbilicus.',
      ],
      sourceRefs: aw([36, 37]),
    },
    {
      title: 'Abdominal Incisions',
      kind: 'clinical',
      paragraphs: [
        'The choice of incision depends on the pathology, the site of the organ, patient factors and the surgeon. A good incision gives adequate exposure, can be extended, avoids unnecessary damage to muscles and nerves, minimises complications and heals well. Muscle fibres should be split, not cut; nerves should be avoided; and closure must be secure to prevent wound infection, burst abdomen (dehiscence) and incisional hernia.',
        'Midline: along the linea alba; little bleeding, no muscle cutting; used for exploratory laparotomy; risk of incisional hernia. Paramedian: vertical, 1–1.5 inches lateral to the midline; good exposure but risk of nerve injury. Gridiron (or Lanz): short, at McBurney’s point, muscle-splitting, for appendicectomy. Subcostal (Kocher): below the costal margin for the gallbladder and bile ducts on the right, or the spleen on the left (bilateral = chevron/rooftop). Pfannenstiel: transverse suprapubic incision for caesarean section and pelvic surgery.',
      ],
      table: {
        columns: ['Incision', 'Main use'],
        rows: [
          ['Midline', 'Exploratory laparotomy'],
          ['Paramedian', 'Vertical access lateral to midline'],
          ['Gridiron / Lanz', 'Appendicectomy'],
          ['Subcostal (Kocher)', 'Gallbladder, bile ducts (right); spleen (left)'],
          ['Pfannenstiel', 'Caesarean section, pelvic surgery'],
        ],
      },
      terms: [
        { term: 'Wound dehiscence', meaning: 'Burst abdomen: separation of a closed wound.' },
        { term: 'Pfannenstiel incision', meaning: 'Transverse suprapubic incision just above the pubic hairline.' },
      ],
      keyPoints: [
        'Split muscle fibres rather than cut them; avoid the segmental nerves.',
      ],
      sourceRefs: aw([38, 39]),
    },
  ],
  summary: [
    'Above the arcuate line the internal oblique aponeurosis splits; below it everything passes in front of rectus.',
    'The linea alba is avascular and used for midline incisions.',
    'Paraumbilical veins link portal and systemic veins (caput medusae).',
    'T7–T11, T12 and L1 supply the wall; T10 is the umbilical dermatome.',
    'Incisions: midline, paramedian, gridiron, Kocher and Pfannenstiel.',
  ],
  highYield: [
    'Arcuate line: inferior epigastric vessels enter the sheath; posterior sheath ends.',
    'Superficial lymph below the umbilicus → superficial inguinal nodes.',
    'Kocher incision → gallbladder.',
  ],
  confusions: [
    {
      confusion: 'Thinking the posterior rectus sheath extends all the way to the pubis.',
      clarification: 'It ends at the arcuate line; below it only transversalis fascia lies behind rectus (slides 26, 30).',
    },
  ],
};

// ─── Lesson 3: The Inguinal Region and Hernias ───────────────────────

const lesson3: Draft = {
  id: L(3),
  title: 'The Inguinal Region and Hernias',
  description: 'The inguinal canal and its rings, boundaries and contents; testicular descent and the spermatic cord; direct, indirect, femoral and umbilical hernias; and the folds and fossae on the inner abdominal wall.',
  xp: 25,
  estimatedMinutes: 17,
  sourceRefs: aw([40, 41, 42, 43, 49, 50, 52, 54, 55, 57, 59, 60, 61, 66, 67, 68, 70]),
  objectives: [
    'Describe the inguinal canal, its rings, boundaries and contents.',
    'Explain testicular descent and list the coverings and contents of the spermatic cord.',
    'Compare direct and indirect inguinal hernias and distinguish femoral hernias.',
    'Describe umbilical hernia and congenital anterior wall defects.',
    'Name the peritoneal folds and fossae of the internal surface of the wall.',
  ],
  chunks: [
    {
      title: 'The Inguinal Canal',
      kind: 'structure',
      paragraphs: [
        'The inguinal region (groin) lies between the ASIS and the pubic tubercle, where structures pass between the abdomen and the lower limb and external genitalia. It is clinically important as the site of inguinal hernias, especially in males.',
        'The inguinal canal is an oblique passage, about 4 cm long, running inferomedially through the lower anterolateral wall, parallel to and above the inguinal ligament, from the deep to the superficial inguinal ring. In newborns it runs almost straight forward. It is larger in males because it carries the spermatic cord (the round ligament of the uterus in females).',
        'The superficial inguinal ring is a triangular opening in the external oblique aponeurosis, superior and lateral to the pubic tubercle. The deep inguinal ring is an oval opening in the transversalis fascia about 1.25 cm above the midpoint of the inguinal ligament, lateral to the inferior epigastric vessels. The mid-inguinal point is the site of the femoral pulse.',
        'Boundaries (MALT): the roof is the arching lowest fibres of internal oblique and transversus abdominis (2 Muscles); the anterior wall is the external oblique aponeurosis, reinforced laterally by internal oblique (2 Aponeuroses); the floor is the inguinal and lacunar ligaments and iliopubic tract (2 Ligaments); the posterior wall is the transversalis fascia, reinforced medially by the conjoint tendon (2 Ts).',
        'Contents: the ilioinguinal nerve (both sexes — it pierces internal oblique, lies in front of the cord and exits through the superficial ring), and the spermatic cord in males or the round ligament of the uterus in females.',
      ],
      table: {
        columns: ['Wall', 'Formed by'],
        rows: [
          ['Roof', 'Arching fibres of internal oblique and transversus abdominis'],
          ['Anterior', 'External oblique aponeurosis (+ internal oblique laterally)'],
          ['Floor', 'Inguinal and lacunar ligaments, iliopubic tract'],
          ['Posterior', 'Transversalis fascia (+ conjoint tendon medially)'],
        ],
      },
      terms: [
        { term: 'Deep inguinal ring', meaning: 'Opening in transversalis fascia 1.25 cm above the midpoint of the inguinal ligament.' },
        { term: 'Superficial inguinal ring', meaning: 'Triangular opening in the external oblique aponeurosis above the pubic tubercle.' },
      ],
      keyPoints: [
        'Canal ~4 cm; deep ring lateral to the inferior epigastric vessels.',
        'MALT: 2 Muscles (roof), 2 Aponeuroses (front), 2 Ligaments (floor), 2 Ts (back).',
      ],
      sourceRefs: aw([40, 41, 52, 53, 54, 55]),
    },
    {
      title: 'Testicular Descent and the Spermatic Cord',
      kind: 'pathway',
      paragraphs: [
        'The inguinal canal forms as the processus vaginalis — an outpouching of peritoneum — pushes through the lower abdominal wall toward the scrotum, providing a route for testicular descent guided by the gubernaculum. Normally the proximal processus vaginalis obliterates, and its distal part persists as the tunica vaginalis.',
        'A patent processus vaginalis causes a congenital indirect inguinal hernia; fluid trapped in a persistent part produces a hydrocele, which transilluminates.',
        'As the testis descends, it picks up coverings from the wall layers. From outside in: external spermatic fascia (from external oblique aponeurosis), cremasteric muscle and fascia (from internal oblique), and internal spermatic fascia (from transversalis fascia). Transversus abdominis contributes no layer because it arches above the deep ring.',
        'Contents of the cord — “rule of threes”: three arteries (testicular, cremasteric and artery to the vas), three nerves (genital branch of the genitofemoral to cremaster, sympathetic nerves, and the ilioinguinal nerve, which lies on the cord rather than in it), and three other structures (vas deferens, pampiniform plexus of veins and lymphatics).',
      ],
      steps: [
        { label: 'External spermatic fascia', detail: 'From the external oblique aponeurosis.' },
        { label: 'Cremasteric muscle and fascia', detail: 'From the internal oblique.' },
        { label: 'Internal spermatic fascia', detail: 'From the transversalis fascia.' },
      ],
      terms: [
        { term: 'Processus vaginalis', meaning: 'Peritoneal outpouching through the abdominal wall that forms the inguinal canal.' },
        { term: 'Gubernaculum', meaning: 'Fibrous cord guiding testicular descent.' },
        { term: 'Pampiniform plexus', meaning: 'Venous plexus of the spermatic cord.' },
        { term: 'Hydrocele', meaning: 'Fluid in a persistent processus/tunica vaginalis; transilluminates.' },
      ],
      keyPoints: [
        'Transversus abdominis gives no covering to the cord.',
        'Ilioinguinal nerve lies ON the cord, not within it.',
      ],
      notes: [{ kind: 'lecturer', text: 'The lecture gives the mnemonic “Some Damn Englishmen Called It The Testis” for the layers of the scrotum and testis (skin, dartos, external spermatic fascia, cremaster, internal spermatic fascia, tunica vaginalis, testis).' }],
      sourceRefs: aw([42, 43, 44, 49, 50, 51]),
    },
    {
      title: 'Inguinal and Femoral Hernias',
      kind: 'comparison',
      paragraphs: [
        'A hernia is a protrusion of the contents of a body cavity through a weak point in its wall. Risk factors include straining, chronic cough, old age, male sex, smoking, heavy lifting and obesity. A hernia has a sac (peritoneal pouch), coverings and contents. It may be reducible, irreducible (incarcerated), obstructed (lumen blocked, blood supply intact), strangulated (blood supply cut off — gangrene possible within 6 hours) or inflamed.',
        'Hesselbach’s inguinal triangle is bounded medially by the lateral border of rectus abdominis, laterally by the inferior epigastric vessels and inferiorly by the inguinal ligament. Direct hernias occur within it; indirect hernias pass lateral to it.',
        'An indirect inguinal hernia (70–75%) enters the deep ring lateral to the inferior epigastric vessels, follows the canal and may reach the scrotum or labia majora. It has the same coverings as the cord, is usually congenital (patent processus vaginalis) in infants and young males, has a narrow neck and a higher risk of strangulation.',
        'A direct inguinal hernia pushes through the posterior wall (Hesselbach’s triangle) medial to the inferior epigastric vessels, rarely enters the scrotum, is covered usually by transversalis fascia only, is acquired in older men, has a wide neck, a lower strangulation risk and is generally reducible. Pressure over the deep ring (1 cm above the midpoint of the inguinal ligament) controls an indirect hernia on coughing; a bulge medial to the finger means a direct hernia.',
        'A femoral hernia passes below the inguinal ligament through the femoral ring into the femoral canal. It is retort-shaped, has a narrow neck (prone to strangulation) and is more common in women. The femoral ring is bounded in front by the inguinal ligament, behind by the pectineal ligament, medially by the lacunar ligament and laterally by the femoral vein. An inguinal hernia sac lies above and medial to the pubic tubercle; a femoral hernia below and lateral to it.',
      ],
      table: {
        columns: ['Feature', 'Indirect inguinal', 'Direct inguinal'],
        rows: [
          ['Relation to inferior epigastric vessels', 'Lateral', 'Medial (Hesselbach’s triangle)'],
          ['Route', 'Through deep ring along canal; may reach scrotum', 'Through posterior wall; rarely scrotum'],
          ['Cause / age', 'Patent processus vaginalis; infants, young males', 'Weak transversalis fascia; older men'],
          ['Neck / strangulation', 'Narrow / higher risk', 'Wide / lower risk'],
        ],
      },
      terms: [
        { term: 'Hesselbach’s triangle', meaning: 'Rectus edge, inferior epigastric vessels and inguinal ligament; site of direct hernias.' },
        { term: 'Strangulated hernia', meaning: 'Hernia whose blood supply is cut off.' },
        { term: 'Femoral ring', meaning: 'Entrance of the femoral canal: inguinal, pectineal and lacunar ligaments and femoral vein.' },
      ],
      keyPoints: [
        'Indirect = lateral to inferior epigastric vessels; direct = medial.',
        'Femoral hernia: below and lateral to the pubic tubercle; women; narrow neck.',
      ],
      sourceRefs: aw([57, 58, 59, 60, 61]),
    },
    {
      title: 'Umbilical Hernia, Wall Defects and the Inner Surface of the Wall',
      kind: 'clinical',
      paragraphs: [
        'An umbilical hernia is protrusion of abdominal contents (usually small bowel or omentum in a peritoneal sac) through the umbilical ring, covered by skin and subcutaneous tissue. Congenital (infantile) umbilical hernia results from incomplete closure of the umbilical ring and usually resolves by 2–3 years; it is common in preterm and African infants. Acquired (adult) umbilical hernia follows raised intra-abdominal pressure (obesity, multiparity, ascites, chronic cough).',
        'Congenital ventral wall defects: an omphalocele is herniation of viscera into the base of the umbilical cord, covered by a sac of peritoneum and amnion. Gastroschisis usually occurs to the right of the umbilicus, with bowel not covered by any membrane. Prune belly syndrome is the triad of deficient abdominal muscles, bilateral undescended testes and urinary tract abnormalities.',
        'Five peritoneal folds lie on the inner surface of the anterior wall: the median umbilical fold (median umbilical ligament, the remnant of the urachus), two medial umbilical folds (obliterated umbilical arteries) and two lateral umbilical folds (covering the inferior epigastric vessels).',
        'Between them lie fossae that are potential hernia sites: the supravesical fossa (between median and medial folds; rare supravesical hernias), the medial inguinal fossa (between medial and lateral folds; direct inguinal hernia) and the lateral inguinal fossa (lateral to the lateral fold; indirect inguinal hernia).',
      ],
      table: {
        columns: ['Fold', 'Contains'],
        rows: [
          ['Median umbilical', 'Median umbilical ligament (urachus)'],
          ['Medial umbilical (×2)', 'Obliterated umbilical arteries'],
          ['Lateral umbilical (×2)', 'Inferior epigastric vessels'],
        ],
      },
      terms: [
        { term: 'Omphalocele', meaning: 'Herniation of viscera into the umbilical cord, covered by peritoneum and amnion.' },
        { term: 'Gastroschisis', meaning: 'Uncovered evisceration usually to the right of the umbilicus.' },
        { term: 'Urachus', meaning: 'Fetal allantoic remnant forming the median umbilical ligament.' },
      ],
      keyPoints: [
        'Lateral inguinal fossa → indirect hernia; medial inguinal fossa → direct hernia.',
      ],
      sourceRefs: aw([66, 67, 68, 69, 70]),
    },
  ],
  summary: [
    'The inguinal canal is ~4 cm long, from the deep ring (transversalis fascia) to the superficial ring (external oblique).',
    'Spermatic cord coverings: external spermatic fascia, cremaster, internal spermatic fascia — none from transversus.',
    'Indirect hernias start lateral to the inferior epigastric vessels; direct hernias medial, through Hesselbach’s triangle.',
    'Femoral hernias lie below and lateral to the pubic tubercle and are common in women.',
    'Medial umbilical folds = obliterated umbilical arteries; lateral folds = inferior epigastric vessels.',
  ],
  highYield: [
    'Deep ring: 1.25 cm above the midpoint of the inguinal ligament.',
    'Indirect hernia: patent processus vaginalis, narrow neck, more strangulation.',
    'Omphalocele has a sac; gastroschisis does not.',
  ],
  confusions: [
    {
      confusion: 'Mixing up which side of the inferior epigastric vessels each hernia arises.',
      clarification: 'Indirect = lateral (through the deep ring); direct = medial (through Hesselbach’s triangle) (slides 59–60).',
    },
  ],
};

// ─── Lesson 4: The Posterior Abdominal Wall ──────────────────────────

const lesson4: Draft = {
  id: L(4),
  title: 'The Posterior Abdominal Wall',
  description: 'The boundaries, fascia and muscles of the posterior abdominal wall, the aorta and IVC with the lumbar nodes, the lymphatic trunks and ducts, the abdominal autonomic ganglia and splanchnic nerves, and the lumbar plexus.',
  xp: 25,
  estimatedMinutes: 16,
  sourceRefs: aw([78, 82, 83, 84, 85, 87, 90, 93, 94, 96, 97, 98, 99, 102, 105, 107, 108, 110, 112, 115]),
  objectives: [
    'Describe the boundaries, contents, fascia and muscles of the posterior abdominal wall.',
    'List the branches of the abdominal aorta and tributaries of the IVC.',
    'Describe the lumbar lymph nodes, lymphatic trunks, cisterna chyli and lymphatic ducts.',
    'Name the abdominal prevertebral ganglia, splanchnic nerves and autonomic plexuses.',
    'Describe the lumbar plexus and its clinical relevance.',
  ],
  chunks: [
    {
      title: 'Boundaries, Fascia and Muscles',
      kind: 'structure',
      paragraphs: [
        'The posterior abdominal wall houses the abdominal aorta, IVC, subcostal nerves, lumbar plexus, autonomic plexuses and ganglia, sympathetic trunk, lymph vessels and nodes, and retroperitoneal organs (kidneys, suprarenals, pancreas, duodenum). It is a common site of retroperitoneal haemorrhage in trauma. Boundaries: above, the 12th rib and diaphragm; behind, the lumbar vertebrae, discs and muscles; below, the pelvic brim; in front, the parietal peritoneum and retroperitoneal organs.',
        'Psoas fascia covers psoas major and minor; it thickens above as the medial arcuate ligament. The thoracolumbar fascia has three layers: the anterior and middle layers enclose quadratus lumborum (the anterior layer thickens as the lateral arcuate ligament), and the middle and posterior layers enclose erector spinae. It gives attachment to latissimus dorsi, internal oblique and transversus abdominis.',
        'The muscles (psoas major, psoas minor — absent in about 40% — iliacus and quadratus lumborum) are functionally part of the lower limb girdle or vertebral column. Iliacus fuses with psoas major to form iliopsoas, the chief flexor of the hip.',
        'Clinical: psoas fascia can contain the pus of a psoas abscess; spinal tuberculosis may present as a cold abscess in the groin, mistaken for a femoral hernia. A positive psoas sign (lower abdominal pain when the thigh is flexed at the hip) shows iliopsoas irritation; on the right it suggests appendicitis. Rare lumbar hernias occur through the superior (Grynfeltt–Lesshaft) and inferior (Petit) lumbar triangles.',
      ],
      terms: [
        { term: 'Iliopsoas', meaning: 'Psoas major + iliacus; chief hip flexor.' },
        { term: 'Psoas sign', meaning: 'Abdominal pain on hip flexion from an irritated iliopsoas (e.g. appendicitis).' },
        { term: 'Thoracolumbar fascia', meaning: 'Three-layered fascia around quadratus lumborum and erector spinae.' },
      ],
      keyPoints: [
        'Psoas abscess can track down to the groin under psoas fascia.',
      ],
      sourceRefs: aw([78, 79, 82, 83, 84, 85]),
    },
    {
      title: 'Aorta, IVC and Lumbar Lymph Nodes',
      kind: 'structure',
      paragraphs: [
        'The thoracic aorta passes behind the median arcuate ligament at T12 to become the abdominal aorta, which bifurcates at L4 into the common iliac arteries. Unpaired branches: coeliac trunk (T12), superior mesenteric artery (L1), inferior mesenteric artery (L3) and median sacral artery. Paired branches: inferior phrenic, superior, middle and inferior suprarenal, renal, gonadal and four pairs of lumbar arteries.',
        'The IVC is formed by the union of the common iliac veins behind the right common iliac artery at L5, ascends to the right of the aorta and passes through the caval hiatus at T8. Tributaries: hepatic veins, inferior phrenic veins, right suprarenal vein, right gonadal vein, renal veins and lumbar veins (usually 3rd and 4th).',
        'The lumbar nodes lie along the aorta and IVC: left lumbar (para-aortic: lateral aortic, preaortic, retroaortic, intermediate) and right lumbar (paracaval: lateral caval, precaval, retrocaval). They drain the kidneys, suprarenals, gonads, uterine fundus and tubes, upper ureters and deep posterior wall, and receive lymph from the lower limbs and pelvis via the common iliac nodes. Gonadal cancers spread first to para-aortic rather than inguinal nodes, reflecting their embryological origin.',
        'Preaortic nodes (coeliac, superior and inferior mesenteric) drain the gut and its organs into the intestinal trunk.',
      ],
      table: {
        columns: ['Aortic branch', 'Level'],
        rows: [
          ['Coeliac trunk', 'T12'],
          ['Superior mesenteric artery', 'L1'],
          ['Renal arteries', 'L1–L2'],
          ['Inferior mesenteric artery', 'L3'],
          ['Bifurcation', 'L4'],
        ],
      },
      terms: [
        { term: 'Para-aortic nodes', meaning: 'Lumbar nodes along the aorta; first station for gonadal cancer.' },
        { term: 'Intestinal trunk', meaning: 'Lymph trunk from the preaortic (gut) nodes; the only unpaired trunk.' },
      ],
      keyPoints: [
        'IVC forms at L5 and pierces the diaphragm at T8.',
        'Testis/ovary drain to para-aortic nodes, not inguinal nodes.',
      ],
      notes: [{ kind: 'textbook', text: 'Gray’s gives the renal arteries at about L1–L2, just below the SMA (the Urinary lecture says L2).' }],
      sourceRefs: [...aw([86, 87, 88, 90, 93, 94]), ...GRAYS],
    },
    {
      title: 'Lymphatic Trunks, Cisterna Chyli and Ducts',
      kind: 'pathway',
      paragraphs: [
        'The lymphatic system maintains fluid balance, supports immunity and absorbs fat. It consists of lymph, lymphatic vessels, lymph nodes, primary lymphoid organs (bone marrow, thymus) and secondary lymphoid organs (spleen, tonsils, Peyer’s patches, appendix). Lymph forms from interstitial fluid that escapes capillaries.',
        'Lymph flows: interstitial spaces → lymphatic capillaries → afferent vessels → lymph nodes (filter) → efferent vessels → lymphatic trunks → lymphatic ducts → subclavian veins.',
        'Trunks: jugular (head and neck), subclavian (upper limbs), bronchomediastinal (thoracic wall, lungs, heart), lumbar (lower limbs, pelvis, kidneys, suprarenals, lower abdominal wall) and intestinal (stomach, intestines, pancreas, spleen, part of liver — the only unpaired trunk).',
        'The intestinal and lumbar trunks unite as the cisterna chyli, anterior to L1–L2 and behind the right crus. It continues as the thoracic duct, the largest lymph vessel, which ascends through the aortic hiatus in the posterior mediastinum to the right of the oesophagus, crosses to the left at T4–T5 and ends at the left jugulosubclavian junction. It drains everything below the diaphragm plus the left thorax, left upper limb and left head and neck. The right lymphatic duct drains the right upper quadrant of the body into the right brachiocephalic vein or right jugulosubclavian junction.',
        'Clinical: retroperitoneal lymphadenopathy may compress vessels or ureters; injury to the cisterna chyli can cause chylous ascites.',
      ],
      steps: [
        { label: 'Lymphatic capillaries', detail: 'Collect interstitial fluid.' },
        { label: 'Lymph nodes', detail: 'Filter lymph.' },
        { label: 'Lymphatic trunks', detail: 'Jugular, subclavian, bronchomediastinal, lumbar, intestinal.' },
        { label: 'Cisterna chyli', detail: 'Intestinal + lumbar trunks at L1–L2.' },
        { label: 'Thoracic duct', detail: 'Through aortic hiatus to the left venous angle.' },
      ],
      terms: [
        { term: 'Cisterna chyli', meaning: 'Sac formed by intestinal and lumbar trunks at L1–L2; origin of the thoracic duct.' },
        { term: 'Thoracic duct', meaning: 'Largest lymphatic vessel, draining to the left jugulosubclavian junction.' },
        { term: 'Chylous ascites', meaning: 'Lymph in the peritoneal cavity after injury to the cisterna chyli.' },
      ],
      keyPoints: [
        'Thoracic duct crosses from right to left at T4–T5.',
        'Right lymphatic duct: right head and neck, right upper limb, right thorax.',
      ],
      sourceRefs: aw([105, 106, 107, 108, 109, 110]),
    },
    {
      title: 'Autonomic Nerves and the Lumbar Plexus',
      kind: 'pathway',
      paragraphs: [
        'The lumbar sympathetic trunk lies lateral to the vertebral bodies, behind psoas. The prevertebral (preaortic) ganglia are the coeliac (foregut), aorticorenal (kidney, adrenal, upper ureter), superior mesenteric (midgut) and inferior mesenteric (hindgut) ganglia.',
        'Preganglionic sympathetic fibres from T5–L2 reach these ganglia through splanchnic nerves: greater (T5–T9) → coeliac ganglion; lesser (T10–T11) → superior mesenteric ganglion; least (T12) → renal/aorticorenal ganglia; lumbar splanchnics (L1–L2) → inferior mesenteric ganglion. Postganglionic fibres reach the organs through plexuses that follow the arteries.',
        'Autonomic plexuses: coeliac (solar) — sympathetic T5–T9 + vagus; aorticorenal — T12; superior mesenteric — thoracic splanchnics + vagus; inferior mesenteric — lumbar + pelvic splanchnics; superior hypogastric — continuation of the aortic plexus into the pelvis, giving the hypogastric nerves to the inferior hypogastric plexuses.',
        'Sympathetic (thoracolumbar, T1–L2): short preganglionic and long postganglionic fibres; noradrenaline (except sweat glands, acetylcholine); fight-or-flight. Parasympathetic (craniosacral: CN III, VII, IX, X and S2–S4): long preganglionic and short postganglionic fibres with ganglia near the organ; acetylcholine; rest-and-digest. The vagus supplies the foregut and midgut; the pelvic splanchnic nerves (S2–S4, nervi erigentes) the hindgut and pelvic viscera.',
        'The lumbar plexus is formed by the ventral rami of L1–L4 (with a T12 contribution), within psoas in front of the transverse processes. L4–L5 form the lumbosacral trunk to the sacral plexus. Femoral nerve injury weakens hip flexion and knee extension; obturator injury weakens thigh adduction; entrapment of the lateral femoral cutaneous nerve causes meralgia paraesthetica. An accessory obturator nerve (L3–L4) is present in 10–30%.',
      ],
      table: {
        columns: ['Splanchnic nerve', 'Levels', 'Ganglion → territory'],
        rows: [
          ['Greater', 'T5–T9', 'Coeliac → foregut'],
          ['Lesser', 'T10–T11', 'Superior mesenteric → midgut'],
          ['Least', 'T12', 'Aorticorenal/renal → kidney, adrenal, ureter'],
          ['Lumbar', 'L1–L2', 'Inferior mesenteric → hindgut'],
          ['Pelvic (parasympathetic)', 'S2–S4', 'Inferior hypogastric → hindgut, pelvis'],
        ],
      },
      terms: [
        { term: 'Prevertebral ganglia', meaning: 'Coeliac, aorticorenal, superior and inferior mesenteric ganglia on the aorta.' },
        { term: 'Lumbosacral trunk', meaning: 'L4–L5 contribution from the lumbar to the sacral plexus.' },
        { term: 'Meralgia paraesthetica', meaning: 'Entrapment of the lateral femoral cutaneous nerve.' },
      ],
      keyPoints: [
        'Pelvic splanchnic nerves are the only parasympathetic splanchnic nerves.',
        'Lumbar plexus: L1–L4 within psoas.',
      ],
      sourceRefs: aw([96, 97, 98, 99, 100, 102, 112, 114, 115]),
    },
  ],
  summary: [
    'The posterior wall carries the aorta, IVC, lumbar plexus, sympathetic trunk and retroperitoneal organs.',
    'Psoas major + iliacus = iliopsoas; a psoas abscess can point in the groin.',
    'Aorta: coeliac T12, SMA L1, IMA L3, bifurcation L4; IVC forms at L5.',
    'Intestinal + lumbar trunks → cisterna chyli (L1–L2) → thoracic duct → left venous angle.',
    'Splanchnic nerves: greater T5–T9, lesser T10–T11, least T12, lumbar L1–L2, pelvic S2–S4.',
  ],
  highYield: [
    'Gonadal lymph → para-aortic nodes.',
    'Thoracic duct passes through the aortic hiatus.',
    'Lumbar plexus: ventral rami L1–L4 within psoas.',
  ],
  confusions: [
    {
      confusion: 'Thinking the vagus supplies the hindgut.',
      clarification: 'The vagus reaches the foregut and midgut; the hindgut gets parasympathetic fibres from the pelvic splanchnic nerves (S2–S4) (slide 115).',
    },
  ],
};

// ─── Lesson 5: Oesophagus and Stomach ────────────────────────────────

const lesson5: Draft = {
  id: L(5),
  title: 'The Oesophagus and Stomach',
  description: 'The oesophagus — its course, constrictions, sphincters and anti-reflux mechanisms — and the stomach’s parts, relations and clinical importance, including hiatal hernia.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: gi([3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16]),
  objectives: [
    'Describe the course, parts and constrictions of the oesophagus.',
    'Compare the upper and lower oesophageal sphincters and list the anti-reflux mechanisms.',
    'Describe the parts, curvatures and relations of the stomach.',
    'Explain sliding and rolling hiatal hernias.',
  ],
  chunks: [
    {
      title: 'The Oesophagus',
      kind: 'structure',
      paragraphs: [
        'The oesophagus is a muscular tube about 25 cm long and 2 cm wide. It runs from the lower border of the cricoid cartilage (C6), passes through the diaphragm at T10 and ends at the cardiac orifice of the stomach at T11. Fibres of the right crus sweep around the oesophageal opening as a sling. It has cervical, thoracic and abdominal parts; the abdominal part is short (about 2–3 cm) and intraperitoneal.',
        'Relations of the abdominal oesophagus: the left vagal trunk lies in front and the right vagal trunk behind. In mitral stenosis, an enlarged left atrium can displace the oesophagus backwards, seen on a barium swallow.',
        'There are four constrictions, measured from the upper incisor teeth: the pharyngo-oesophageal junction (15 cm), where it is crossed by the arch of the aorta (22 cm), where it is crossed by the left main bronchus (27 cm) and at the oesophageal hiatus (38 cm). Swallowed objects may lodge here, and instruments may meet resistance.',
      ],
      table: {
        columns: ['Constriction', 'Distance from incisors'],
        rows: [
          ['Pharyngo-oesophageal junction', '15 cm'],
          ['Arch of aorta', '22 cm'],
          ['Left main bronchus', '27 cm'],
          ['Oesophageal hiatus', '38 cm'],
        ],
      },
      terms: [
        { term: 'Cardiac orifice', meaning: 'Opening of the oesophagus into the stomach at T11.' },
      ],
      keyPoints: [
        'Oesophagus: C6 → T10 (hiatus) → T11 (cardia); ~25 cm.',
      ],
      sourceRefs: gi([3, 4]),
    },
    {
      title: 'Sphincters, Anti-reflux Mechanisms and Clinical Notes',
      kind: 'mechanism',
      paragraphs: [
        'The upper oesophageal sphincter (UES) is striated muscle at the pharyngo-oesophageal junction, mainly cricopharyngeus. It keeps air out of the oesophagus during breathing and relaxes during swallowing.',
        'The lower oesophageal sphincter (LES) is smooth muscle at the oesophagogastric junction. It is a physiological sphincter: it relies on muscle tone, the pressure difference between abdomen and thorax and vagal control rather than a distinct muscular ring, staying tonically closed at rest and relaxing on swallowing.',
        'Other anti-reflux mechanisms: prominent mucosal folds at the junction act as a valve; the oesophagus enters the stomach at an acute angle (a flap valve); the right crus compresses the oesophagus during inspiration; and the abdominal oesophagus is compressed when intra-abdominal pressure rises.',
        'Clinical: achalasia (the LES fails to relax because of damaged nerves); tracheo-oesophageal fistula; oesophageal varices (dilated lower oesophageal veins from portal hypertension); gastro-oesophageal reflux disease (GERD/GORD) with pyrosis (heartburn); and Barrett’s oesophagus (intestinal-type lining from chronic acid damage).',
      ],
      terms: [
        { term: 'Lower oesophageal sphincter', meaning: 'Physiological smooth-muscle sphincter at the oesophagogastric junction.' },
        { term: 'Achalasia', meaning: 'Failure of the LES to relax due to nerve damage.' },
        { term: 'Barrett’s oesophagus', meaning: 'Intestinal metaplasia of the oesophageal lining from chronic reflux.' },
      ],
      keyPoints: [
        'UES = striated (cricopharyngeus); LES = smooth, physiological.',
      ],
      sourceRefs: gi([5, 6, 7]),
    },
    {
      title: 'The Stomach',
      kind: 'structure',
      paragraphs: [
        'The stomach is the widest part of the alimentary tract — a roughly J-shaped muscular bag holding about 50 ml empty and up to 4 L when full. It lies in the left hypochondrium, epigastric and umbilical regions. It has two surfaces, two curvatures, two notches and two orifices, and is fixed at both ends. Its regions are the cardia, fundus, body and pylorus. It stores, mixes and digests food, turning it into chyme.',
        'The pyloric sphincter, a thickening of circular smooth muscle, regulates the passage of chyme into the duodenum and prevents backflow. The pyloroduodenal junction is marked by the constant prepyloric vein of Mayo. The inner wall has folds called rugae.',
        'Anterior relations: left lobe of the liver, gallbladder, diaphragm and anterior abdominal wall. Posterior relations — the stomach bed, separated by the lesser sac: body of the pancreas, splenic vessels, left kidney and suprarenal, spleen, left dome of the diaphragm, transverse colon and mesocolon and the splenic flexure.',
        'A posterior gastric ulcer or carcinoma may erode the pancreas, causing pain referred to the back. An ulcer on the lesser curvature may erode the right or left gastric arteries, causing haematemesis and melaena. The upper GI tract is examined by barium studies or by gastroduodenoscopy (endoscopy with biopsy).',
      ],
      terms: [
        { term: 'Stomach bed', meaning: 'Posterior relations of the stomach behind the lesser sac.' },
        { term: 'Prepyloric vein of Mayo', meaning: 'Vein crossing the pyloroduodenal junction; surgical landmark.' },
        { term: 'Haematemesis', meaning: 'Vomiting of blood.' },
        { term: 'Melaena', meaning: 'Black tarry stool from upper GI bleeding.' },
      ],
      keyPoints: [
        'Pancreas lies in the stomach bed → posterior ulcers cause back pain.',
      ],
      sourceRefs: gi([10, 11, 12, 13, 14]),
    },
    {
      title: 'Hiatal Hernia',
      kind: 'clinical',
      paragraphs: [
        'The phrenico-oesophageal ligament anchors the abdominal oesophagus to the diaphragm at the hiatus while still letting it move independently during breathing and swallowing.',
        'A hiatal hernia is protrusion of part of the stomach into the chest through the oesophageal hiatus. Risk factors: age-related loss of diaphragmatic tone, raised intra-abdominal pressure (e.g. repeated coughing) and a widened hiatus.',
        'A sliding hernia (about 90%): the LES slides up through a lax hiatus (stretched phrenico-oesophageal ligament) when the patient lies down or bends; reflux is common, leading to oesophagitis, heartburn, bleeding and stricture.',
        'A rolling (para-oesophageal) hernia: the LES stays in place but the fundus rolls up through the hiatus in front of the oesophagus. There may be epigastric discomfort, flatulence and dysphagia, but no regurgitation because the cardiac mechanism is intact.',
      ],
      table: {
        columns: ['Type', 'What moves', 'Reflux?'],
        rows: [
          ['Sliding (90%)', 'Oesophagogastric junction slides up', 'Common'],
          ['Rolling (para-oesophageal)', 'Fundus rolls up beside the oesophagus; LES stays', 'No'],
        ],
      },
      terms: [
        { term: 'Phrenico-oesophageal ligament', meaning: 'Ligament anchoring the abdominal oesophagus to the diaphragm.' },
        { term: 'Sliding hiatal hernia', meaning: 'Upward displacement of the oesophagogastric junction into the thorax.' },
      ],
      keyPoints: [
        'Sliding = reflux; rolling = no regurgitation.',
      ],
      sourceRefs: gi([15, 16]),
    },
  ],
  summary: [
    'The oesophagus runs from C6 to the cardia at T11, passing the diaphragm at T10.',
    'It has four constrictions at 15, 22, 27 and 38 cm from the incisors.',
    'The UES is striated; the LES is a physiological smooth-muscle sphincter.',
    'The stomach has cardia, fundus, body and pylorus; the stomach bed includes the pancreas, left kidney and spleen.',
    'Sliding hiatal hernias cause reflux; rolling hernias do not.',
  ],
  highYield: [
    'Left atrial enlargement displaces the oesophagus backward.',
    'Lesser curvature ulcer → left/right gastric artery bleeding.',
    '90% of hiatal hernias are sliding.',
  ],
  confusions: [
    {
      confusion: 'Thinking the lower oesophageal sphincter is a distinct thick muscle ring like the pylorus.',
      clarification: 'It is a physiological sphincter, relying on tone, pressure gradients and vagal control (slide 5).',
    },
  ],
};

// ─── Lesson 6: The Small Intestine ───────────────────────────────────

const lesson6: Draft = {
  id: L(6),
  title: 'The Small Intestine',
  description: 'The duodenum and its four parts and relations, duodenal ulcers, the ligament of Treitz and paraduodenal recesses, and the jejunum, ileum, root of the mesentery and Meckel’s diverticulum.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: gi([20, 22, 23, 24, 25, 26, 27, 29, 30, 31, 32, 36]),
  objectives: [
    'Describe the parts, levels and relations of the duodenum.',
    'Explain the clinical consequences of anterior and posterior duodenal ulcers.',
    'Describe the ligament of Treitz and the paraduodenal recesses.',
    'Compare the jejunum and ileum and describe the root of the mesentery.',
    'State the features of Meckel’s diverticulum (rule of 2s).',
  ],
  chunks: [
    {
      title: 'The Duodenum',
      kind: 'structure',
      paragraphs: [
        'The small intestine runs from the pylorus to the ileocaecal junction, 6–7 m long, and completes digestion and absorption of nutrients, water, electrolytes and minerals such as calcium and iron. It comprises the duodenum, jejunum and ileum.',
        'The duodenum is the shortest but widest part, about 25 cm (10 inches) long, curving in a C around the head of the pancreas. It is retroperitoneal except its first 2.5 cm, the ampulla or duodenal cap. Its four parts measure 2, 3, 4 and 1 inches.',
        'First (superior) part, L1: the commonest site of duodenal ulcer; its cap has smooth mucosa without circular folds. Relations: anterior — quadrate lobe of the liver and gallbladder; posterior — common bile duct, gastroduodenal artery, portal vein and IVC; superior — omental foramen and hepatoduodenal ligament; inferior — head of the pancreas and greater omentum.',
        'Second (descending) part, L1–L3: contains the major duodenal papilla, where the common bile duct and main pancreatic duct open through the hepatopancreatic ampulla (of Vater); this marks the junction of foregut and midgut. The accessory pancreatic duct (of Santorini) opens at the minor papilla slightly above. Relations: anterior — liver, transverse colon and mesocolon, small intestine; posterior — right kidney, ureter and renal vessels; medial — head of pancreas and the ducts; lateral — right colic flexure and right lobe of the liver. A right nephrectomy may injure it.',
        'Third (horizontal) part, L3: crossed anteriorly by the root of the mesentery and the superior mesenteric vessels; posteriorly lie the right ureter, gonadal vessels, psoas, IVC and aorta; above, the head and uncinate process of the pancreas. Compression between the SMA and aorta causes SMA (Wilkie) syndrome. Fourth part: ends at the duodenojejunal flexure; related to the left psoas, sympathetic chain, left kidney and ureter, and the IMV.',
      ],
      table: {
        columns: ['Part', 'Level', 'Key feature'],
        rows: [
          ['1st (superior)', 'L1', 'Duodenal cap; commonest ulcer site'],
          ['2nd (descending)', 'L1–L3', 'Major papilla (ampulla of Vater): foregut/midgut junction'],
          ['3rd (horizontal)', 'L3', 'Crossed by SMA/SMV and root of mesentery'],
          ['4th (ascending)', 'L2', 'Ends at duodenojejunal flexure'],
        ],
      },
      terms: [
        { term: 'Ampulla of Vater', meaning: 'Hepatopancreatic ampulla opening at the major duodenal papilla.' },
        { term: 'Duodenal cap', meaning: 'Mobile intraperitoneal first 2.5 cm of the duodenum.' },
        { term: 'Wilkie syndrome', meaning: 'Compression of the 3rd part of the duodenum between the SMA and aorta.' },
      ],
      keyPoints: [
        'The major papilla marks the foregut–midgut junction.',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on slide 26: Wilkie syndrome compresses the 3rd part of the duodenum, whereas Nutcracker syndrome compresses the left renal vein.' }],
      sourceRefs: gi([20, 21, 22, 23, 24, 26, 27]),
    },
    {
      title: 'Duodenal Ulcers, the Ligament of Treitz and Recesses',
      kind: 'clinical',
      paragraphs: [
        'Posterior duodenal ulcers cause haematemesis and melaena by eroding the gastroduodenal or posterior superior pancreaticoduodenal artery. Anterior duodenal ulcers perforate into the peritoneal cavity, causing peritonitis. Duodenal ulcers may also penetrate the liver, gallbladder or pancreas.',
        'The ligament of Treitz (suspensory ligament of the duodenum) is a musculoperitoneal fold suspending the duodenojejunal flexure from the right crus. Its contraction widens the flexure, aiding movement into the jejunum. It divides the GI tract into upper and lower parts and is a radiological landmark for malrotation of the small intestine.',
        'Peritoneal recesses lie beside the duodenum. The fossa of Landzert (left paraduodenal fossa) is formed by folds enclosing the left colic artery and the IMV; herniation into it is more common than into the right fossa (of Kolb).',
      ],
      terms: [
        { term: 'Ligament of Treitz', meaning: 'Suspensory ligament of the duodenojejunal flexure from the right crus.' },
        { term: 'Fossa of Landzert', meaning: 'Left paraduodenal fossa — commoner site of paraduodenal hernia.' },
      ],
      keyPoints: [
        'Posterior ulcer bleeds (gastroduodenal artery); anterior ulcer perforates.',
      ],
      sourceRefs: gi([25, 28, 29, 30]),
    },
    {
      title: 'Jejunum, Ileum and Meckel’s Diverticulum',
      kind: 'comparison',
      paragraphs: [
        'The jejunum and ileum run from the duodenojejunal flexure to the ileocaecal junction, about 6 m: the jejunum is the proximal two-fifths and the ileum the distal three-fifths. Both hang from the posterior wall by the mesentery. Most of the jejunum lies in the left upper quadrant and umbilical region; most of the ileum in the right lower quadrant and pelvis. The ileocaecal valve controls flow into the caecum and prevents reflux.',
        'The root of the mesentery runs obliquely from the duodenojejunal junction on the left of L2 to the ileocaecal junction in the right iliac fossa, crossing the 3rd part of the duodenum, aorta, IVC, right ureter, right psoas and right gonadal vessels.',
        'There is no sharp boundary between jejunum and ileum. They differ in lumen size, wall thickness, circular folds (plicae circulares), Peyer’s patches, mesenteric fat, number of arterial arcades and length of the vasa recta. Peyer’s patches — aggregated lymphoid nodules — are concentrated in the distal ileum and help keep bacteria from the bloodstream.',
        'Meckel’s (ileal) diverticulum is a congenital outpouching of the ileum, a remnant of the vitelline (omphalomesenteric) duct. It may be free or attached to the umbilicus by a cord or fistula. Often asymptomatic, it can bleed, obstruct or become inflamed and mimic appendicitis. Rule of 2s: ~2% of people, ~2 feet from the ileocaecal valve, ~2 inches long, may contain 2 types of ectopic tissue (gastric, pancreatic…), most often symptomatic before age 2.',
      ],
      table: {
        columns: ['Feature', 'Jejunum', 'Ileum'],
        rows: [
          ['Proportion', 'Proximal 2/5', 'Distal 3/5'],
          ['Position', 'Left upper / umbilical', 'Right lower / pelvis'],
          ['Circular folds', 'Many, tall', 'Fewer'],
          ['Peyer’s patches', 'Few', 'Concentrated distally'],
          ['Arcades / vasa recta', 'Few arcades, long vasa recta', 'Many arcades, short vasa recta'],
        ],
      },
      terms: [
        { term: 'Root of the mesentery', meaning: 'Oblique attachment of the small-bowel mesentery from L2 left to the right iliac fossa.' },
        { term: 'Peyer’s patches', meaning: 'Aggregated lymphoid nodules in the distal ileum.' },
        { term: 'Meckel’s diverticulum', meaning: 'Vitelline duct remnant on the ileum; rule of 2s.' },
      ],
      keyPoints: [
        'Meckel’s: 2%, 2 feet, 2 inches, 2 tissues, under 2 years.',
      ],
      notes: [{ kind: 'textbook', text: 'Slide 32 lists the differences; the direction of each (e.g. long vasa recta and few arcades in the jejunum) is from Gray’s.' }],
      sourceRefs: [...gi([31, 32, 33, 36]), ...GRAYS],
    },
  ],
  summary: [
    'The duodenum (25 cm) curves around the pancreatic head; only its cap is intraperitoneal.',
    'The 2nd part holds the major papilla — the foregut/midgut junction.',
    'Posterior duodenal ulcers bleed from the gastroduodenal artery; anterior ulcers perforate.',
    'The ligament of Treitz suspends the duodenojejunal flexure from the right crus.',
    'Jejunum is the proximal 2/5, ileum the distal 3/5; Meckel’s follows the rule of 2s.',
  ],
  highYield: [
    '3rd part of duodenum is crossed by the SMA and SMV.',
    'Root of mesentery: L2 (left) to right iliac fossa.',
    'Peyer’s patches: distal ileum.',
  ],
  confusions: [
    {
      confusion: 'Confusing Wilkie syndrome with Nutcracker syndrome.',
      clarification: 'Both involve the SMA–aorta angle: Wilkie compresses the duodenum; Nutcracker compresses the left renal vein (slide 26 notes).',
    },
  ],
};

// ─── Lesson 7: Large Intestine, Rectum and Anal Canal ────────────────

const lesson7: Draft = {
  id: L(7),
  title: 'Large Intestine, Rectum and Anal Canal',
  description: 'The functions and special features of the large intestine, the caecum, appendix and four parts of the colon, the rectum and its relations, and the anal canal with its sphincters and the pectinate line.',
  xp: 25,
  estimatedMinutes: 16,
  sourceRefs: gi([37, 39, 40, 41, 43, 44, 46, 48, 50, 51, 52, 53, 55, 56]),
  objectives: [
    'State the parts and functions of the large intestine.',
    'Describe the teniae coli, haustra and epiploic appendices.',
    'Describe the caecum and appendix and the positions of the appendix.',
    'Describe the four parts of the colon and related clinical conditions.',
    'Describe the rectum, its relations and the anal canal with its sphincters and pectinate line.',
  ],
  chunks: [
    {
      title: 'The Large Intestine and its Special Features',
      kind: 'structure',
      paragraphs: [
        'The large intestine runs from the ileocaecal junction to the anus, about 1.5–2 m. It comprises the caecum with the vermiform appendix, the colon (ascending, transverse, descending and sigmoid), the rectum and the anal canal.',
        'Functions: absorbing water, salts and electrolytes; concentrating waste into faeces; eliminating faeces; and synthesising vitamins (vitamin K and B vitamins such as biotin, B12, folate) via the microbiota. Mass peristaltic movements, 1–3 times a day, push contents toward the rectum.',
        'Special features: teniae coli — three narrow longitudinal bands of smooth muscle (omental, free and mesocolic) from the caecum to the rectosigmoid, converging at the base of the appendix; haustra — sacculations produced because the teniae are shorter than the colon, separated internally by semilunar folds; and omental (epiploic) appendices — fat-filled peritoneal tags, most numerous on the sigmoid colon and absent on the appendix, caecum and rectum.',
      ],
      terms: [
        { term: 'Teniae coli', meaning: 'Three longitudinal muscle bands of the colon that meet at the appendix base.' },
        { term: 'Haustra', meaning: 'Sacculations of the colon caused by the shorter teniae.' },
        { term: 'Epiploic appendices', meaning: 'Fat-filled peritoneal tags on the colon.' },
      ],
      keyPoints: [
        'Follow any tenia to find the base of the appendix.',
      ],
      sourceRefs: gi([37, 38, 39]),
    },
    {
      title: 'Caecum, Appendix and Colon',
      kind: 'structure',
      paragraphs: [
        'The caecum (7.5–9 cm, intraperitoneal) is a blind pouch below the ileocaecal opening in the right iliac fossa. The ileocaecal valve projects into it as the ileal papilla. Surgically, a distended caecum suggests large-bowel obstruction; a collapsed one suggests small-bowel obstruction.',
        'The vermiform appendix is a narrow, blind tube arising from the posteromedial caecum about 2.5 cm below the ileocaecal valve. It is 2–20 cm long; the retrocaecal position is commonest, others being pelvic, subcaecal, pre-ileal and post-ileal. It is suspended by the mesoappendix, which carries the appendicular artery (from the ileocolic). A long pelvic appendix may irritate the bladder and mimic cystitis. Appendicitis (often from a faecolith) presents with anorexia, periumbilical pain, nausea and vomiting.',
        'Ascending colon (15 cm): from the ileocaecal junction to the hepatic flexure; the right paracolic gutter beside it leads to Morison’s pouch. Transverse colon (~45 cm): right to left colic flexure. Descending colon (~30 cm): from the splenic flexure, which is held by the phrenicocolic ligament at ribs 9–10, to the sigmoid. Sigmoid colon: S-shaped, from the pelvic brim to the rectosigmoid junction at S3, with the smallest diameter, on an inverted-V sigmoid mesocolon whose apex overlies the left ureter, the left common iliac bifurcation and the left sacroiliac joint.',
        'The ascending and descending colon are mobilised by cutting along the lateral paracolic gutters, because major vessels and lymphatics are medial. Clinical: colonoscopy, colostomy, sigmoid volvulus (twisting on its mesentery, occluding the blood supply), diverticulosis and diverticulitis, colorectal cancer and intussusception.',
      ],
      terms: [
        { term: 'Mesoappendix', meaning: 'Peritoneal fold of the appendix containing the appendicular artery.' },
        { term: 'Sigmoid volvulus', meaning: 'Twisting of the sigmoid colon on its mesocolon causing obstruction.' },
        { term: 'Phrenicocolic ligament', meaning: 'Fold attaching the splenic flexure to the diaphragm.' },
      ],
      keyPoints: [
        'Retrocaecal is the commonest appendix position.',
        'Apex of the sigmoid mesocolon overlies the left ureter.',
      ],
      sourceRefs: gi([40, 41, 42, 43, 44, 45, 46, 47]),
    },
    {
      title: 'The Rectum',
      kind: 'structure',
      paragraphs: [
        'The rectum begins at the rectosigmoid junction at S3 (where the teniae coli disappear) and ends at the anorectal junction, about 12 cm long. It follows the curve of the sacrum and coccyx and has three lateral flexures (left, right, left from above down). It lacks teniae, haustra and epiploic appendices.',
        'Peritoneum covers the upper third in front and at the sides, the middle third in front only, and the lower third is below the peritoneum in the pelvic fascia. Transverse rectal folds (Houston’s valves) support faeces and help separate gas from solid faeces. The lower dilated rectal ampulla stores faeces before defecation.',
        'Anterior relations: in the male, the base of the bladder, seminal vesicles, ampullae of the vas deferens and prostate; in the female, the cervix and vagina. A rectovesical or rectovaginal septum separates them.',
      ],
      terms: [
        { term: 'Houston’s valves', meaning: 'Transverse rectal folds that support faeces.' },
        { term: 'Rectal ampulla', meaning: 'Dilated lower rectum storing faeces.' },
      ],
      keyPoints: [
        'Rectum lacks teniae, haustra and appendices epiploicae.',
      ],
      sourceRefs: gi([48, 49, 50]),
    },
    {
      title: 'The Anal Canal and the Pectinate Line',
      kind: 'structure',
      paragraphs: [
        'The anal canal (about 4 cm) runs from the anorectal junction at the pelvic diaphragm to the anus, in the anal triangle between the ischioanal fossae. The internal anal sphincter is smooth muscle (thickened circular muscle) around the upper two-thirds; the external anal sphincter is skeletal muscle around the lower two-thirds. The deep external sphincter is continuous with puborectalis — damage causes faecal incontinence. Relations: anteriorly the perineal body (and membranous urethra and bulb in the male, or lower vagina); posteriorly the anococcygeal ligament and coccyx; laterally the ischioanal fossae.',
        'Inside: anal columns (of Morgagni) — 6–10 vertical mucosal folds over anal cushions; anal valves (of Ball) joining their lower ends; and anal sinuses between the columns receiving the anal glands, whose infection causes perianal abscesses. The pectinate (dentate) line runs at the base of the columns.',
        'Above the pectinate line the canal is endodermal (hindgut), lined by columnar epithelium, and cancer is adenocarcinoma; below it is ectodermal, lined by stratified squamous epithelium, and cancer is squamous cell carcinoma. Blood, nerve and lymph supply also differ above and below the line.',
        'The conjoined longitudinal muscle runs between the sphincters and shortens and widens the canal in defecation. The anorectal ring — internal sphincter, deep external sphincter, conjoined longitudinal muscle and puborectalis — maintains continence by supporting the anorectal angle.',
      ],
      table: {
        columns: ['Feature', 'Above pectinate line', 'Below pectinate line'],
        rows: [
          ['Origin', 'Endoderm (hindgut)', 'Ectoderm'],
          ['Epithelium', 'Columnar', 'Stratified squamous'],
          ['Cancer', 'Adenocarcinoma', 'Squamous cell carcinoma'],
          ['Sensation', 'Visceral (painless)', 'Somatic (painful)'],
        ],
      },
      terms: [
        { term: 'Pectinate line', meaning: 'Dentate line at the base of the anal columns separating endodermal and ectodermal parts.' },
        { term: 'Anorectal ring', meaning: 'Muscular ring at the anorectal junction that maintains continence.' },
        { term: 'Anal columns', meaning: 'Columns of Morgagni in the upper anal canal.' },
      ],
      keyPoints: [
        'Internal sphincter = smooth, involuntary; external = skeletal, voluntary.',
      ],
      sourceRefs: gi([51, 52, 53, 54, 55, 56]),
    },
  ],
  summary: [
    'The large intestine (1.5–2 m) absorbs water and electrolytes and forms faeces.',
    'Teniae coli, haustra and epiploic appendices identify the colon; the rectum lacks them.',
    'The appendix arises 2.5 cm below the ileocaecal valve; retrocaecal is commonest.',
    'The rectum begins at S3 and is ~12 cm long; the anal canal ~4 cm.',
    'The pectinate line separates endodermal and ectodermal parts of the anal canal.',
  ],
  highYield: [
    'Splenic flexure is held by the phrenicocolic ligament.',
    'Sigmoid: smallest diameter; prone to volvulus.',
    'Above pectinate line → adenocarcinoma; below → squamous carcinoma.',
  ],
  confusions: [
    {
      confusion: 'Thinking epiploic appendices are found on the caecum and rectum.',
      clarification: 'They are most numerous on the sigmoid colon and absent from the appendix, caecum and rectum (slide 39).',
    },
  ],
};

// ─── Lesson 8: Liver, Gallbladder, Pancreas and Spleen ───────────────

const lesson8: Draft = {
  id: L(8),
  title: 'Liver, Gallbladder, Pancreas and Spleen',
  description: 'The accessory organs of digestion and the spleen: their position, relations, parts, ligaments, ducts, blood supply landmarks and the key clinical conditions that affect them.',
  xp: 25,
  estimatedMinutes: 18,
  sourceRefs: gi([57, 58, 59, 61, 64, 66, 68, 69, 70, 71, 72, 74, 75, 76, 77, 78, 80]),
  objectives: [
    'List the functions and relations of the liver and describe its anatomical and functional lobes and segments.',
    'Describe the porta hepatis and the ligaments of the liver.',
    'Describe the gallbladder, gallstones and Calot’s triangle.',
    'Describe the parts and ducts of the pancreas and its clinical importance.',
    'Describe the functions, position, relations and ligaments of the spleen.',
  ],
  chunks: [
    {
      title: 'The Liver',
      kind: 'structure',
      paragraphs: [
        'The liver is the largest visceral organ and gland (about 1.5 kg), lying across the right hypochondrium, epigastrium and left hypochondrium. Functions include bile production, detoxification, glycogen storage, lipid production, plasma protein and clotting factor synthesis, bilirubin formation, storage of vitamins, iron and copper, and red cell production in the fetus.',
        'Relations: superior and anterior — diaphragm; inferior (visceral) — abdominal oesophagus, stomach, bile ducts, first part of the duodenum, hepatic flexure, right kidney and suprarenal; posterior — IVC at the bare area, oesophagus, gallbladder; laterally — ribs 5–11 and diaphragm.',
        'Ligaments: falciform, coronary, triangular and the hepatogastric part of the lesser omentum. The bare area, between the upper and lower layers of the coronary ligament, has no peritoneum. The left triangular ligament has no major vessels and can be divided to retract the left lobe and expose the oesophagus. The liver is mainly held in place by the attachment of the hepatic veins to the IVC.',
        'The porta hepatis is a transverse fissure on the visceral surface between the quadrate and caudate lobes, transmitting the common hepatic duct, hepatic artery, portal vein, nerves and lymphatics.',
        'Anatomical lobes are divided by the falciform ligament in front and the fissures for the ligamentum teres and ligamentum venosum behind: a left lobe and a right lobe that includes the quadrate lobe (between the gallbladder and ligamentum teres) and the caudate lobe (between the IVC and ligamentum venosum). Functional (surgical) lobes are divided by Cantlie’s line, from the gallbladder fossa to the IVC (along the middle hepatic vein), so the quadrate and caudate lobes belong to the functional left lobe. Couinaud’s classification divides the liver into 8 independent segments, each with its own vascular inflow and biliary drainage, allowing segmental resection.',
        'The falciform ligament’s free edge contains the ligamentum teres (remnant of the left umbilical vein) and paraumbilical veins. The ligamentum venosum is the remnant of the ductus venosus, which shunted placental blood from the umbilical vein to the IVC, bypassing the liver.',
      ],
      terms: [
        { term: 'Porta hepatis', meaning: 'Hilum of the liver: hepatic duct, hepatic artery and portal vein.' },
        { term: 'Cantlie’s line', meaning: 'Line from the gallbladder fossa to the IVC dividing functional right and left lobes.' },
        { term: 'Bare area', meaning: 'Area of liver without peritoneum between the coronary ligament layers.' },
        { term: 'Ligamentum venosum', meaning: 'Remnant of the fetal ductus venosus.' },
      ],
      keyPoints: [
        'Quadrate and caudate lobes are anatomically right but functionally left.',
        'Couinaud: 8 segments.',
      ],
      sourceRefs: gi([57, 58, 59, 60, 61, 62, 64, 65, 66, 67]),
    },
    {
      title: 'The Gallbladder',
      kind: 'structure',
      paragraphs: [
        'The gallbladder is a thin-walled, pear-shaped sac on the visceral surface of the liver between the right and quadrate lobes (segments 4b and 5), 7–10 cm long with a capacity of 30–50 ml. It stores and concentrates bile and releases it under cholecystokinin (CCK). It has a fundus, body and neck; the neck leads into the cystic duct with spiral valves (of Heister). A Hartmann’s pouch near the neck may trap a stone.',
        'Gallstones affect 10–20% of adults (risk: age, obesity, female sex); about 80% are cholesterol stones. Stones in the fundus may ulcerate into the duodenum or colon (fistula, gallstone ileus); in the bile duct they cause jaundice; at the ampulla they may cause pancreatitis. Stones in the gallbladder and cystic duct are painful (smooth muscle); bile duct stones less so. Cholecystitis irritates the diaphragm.',
        'Calot’s (cystohepatic) triangle is bounded by the inferior border of the liver, the cystic duct and the common hepatic duct. It is used to find the cystic artery (usually from the right hepatic artery) during cholecystectomy, and contains Calot’s node. Gangrene of the gallbladder is rare because it also receives blood directly from the liver bed.',
      ],
      terms: [
        { term: 'Calot’s triangle', meaning: 'Liver edge, cystic duct and common hepatic duct; contains the cystic artery.' },
        { term: 'Hartmann’s pouch', meaning: 'Pouch near the gallbladder neck where stones lodge.' },
        { term: 'Cholecystokinin', meaning: 'Intestinal hormone that contracts the gallbladder.' },
      ],
      keyPoints: [
        'Cystic artery usually arises from the right hepatic artery.',
      ],
      sourceRefs: gi([68, 69, 70]),
    },
    {
      title: 'The Pancreas',
      kind: 'structure',
      paragraphs: [
        'The pancreas is retroperitoneal except a small part of its tail, which lies in the splenorenal (lienorenal) ligament. It has a head (with the uncinate process) in the C-curve of the duodenum, a neck, a body and a tail reaching the splenic hilum. It is both exocrine (digestive enzymes) and endocrine (islets of Langerhans: insulin, glucagon, somatostatin).',
        'The main pancreatic duct (of Wirsung) runs to the right along the gland and joins the bile duct to form the hepatopancreatic ampulla (of Vater), opening at the major duodenal papilla in the 2nd part of the duodenum, surrounded by the sphincter of Oddi. The accessory duct (of Santorini) opens at the minor papilla.',
        'Carcinoma of the head may compress the main duct and common bile duct, causing obstructive jaundice. Cancer of the neck and body may obstruct the portal vein or IVC, which lie behind. Pancreatitis is commonly caused by gallstones or alcohol.',
      ],
      terms: [
        { term: 'Duct of Wirsung', meaning: 'Main pancreatic duct.' },
        { term: 'Sphincter of Oddi', meaning: 'Sphincter around the hepatopancreatic ampulla.' },
        { term: 'Uncinate process', meaning: 'Hook-like part of the pancreatic head behind the SMV.' },
      ],
      keyPoints: [
        'Head cancer → obstructive jaundice.',
      ],
      sourceRefs: gi([71, 72, 73, 74]),
    },
    {
      title: 'The Spleen',
      kind: 'structure',
      paragraphs: [
        'The spleen filters blood (macrophages remove old red cells and platelets), stores blood and platelets in the red pulp, takes part in immune responses, and produces lymphocytes, macrophages and antibodies mainly in the white pulp. It is the largest secondary lymphoid organ, about 1 × 3 × 5 inches and 7 oz (200 g), lying between the 9th and 11th ribs in the left hypochondrium between the stomach and diaphragm. It moves with respiration and is the most frequently injured abdominal organ — look for fractures of the lower left ribs.',
        'Its long axis is parallel to the 10th rib, posterior to the left midaxillary line; it is normally not palpable. It enlarges inferiorly and medially, because the gastrosplenic and splenorenal ligaments, the left colic flexure and the phrenicocolic ligament limit other directions; the splenic notches on its anterior border help identify an enlarged spleen. Accessory spleens (splenunculi) may hypertrophy after splenectomy and cause persistent symptoms.',
        'Relations: anterior — fundus and greater curvature of the stomach; posterior — left hemidiaphragm, separating it from the pleura, ribs 9–11 and lung; posteroinferior — left suprarenal and kidney; inferior — splenic flexure; medial — tail of the pancreas and left kidney. Its visceral surface has gastric, colic, renal and pancreatic impressions.',
        'The gastrosplenic ligament joins it to the greater curvature and carries the short gastric and left gastroepiploic vessels. The splenorenal ligament joins it to the posterior wall and carries the tail of the pancreas and the splenic vessels.',
      ],
      table: {
        columns: ['Ligament', 'Connects', 'Contains'],
        rows: [
          ['Gastrosplenic', 'Spleen ↔ greater curvature', 'Short gastric and left gastroepiploic vessels'],
          ['Splenorenal', 'Spleen ↔ posterior wall (left kidney)', 'Splenic vessels and tail of pancreas'],
        ],
      },
      terms: [
        { term: 'Splenunculi', meaning: 'Accessory spleens.' },
        { term: 'Splenic notches', meaning: 'Notches on the anterior border used to identify an enlarged spleen.' },
      ],
      keyPoints: [
        'Spleen: ribs 9–11, axis along rib 10; enlarges down and medially.',
      ],
      sourceRefs: gi([75, 76, 77, 78, 79, 80]),
    },
  ],
  summary: [
    'The liver (1.5 kg) has anatomical lobes (falciform ligament) and functional lobes (Cantlie’s line), with 8 Couinaud segments.',
    'The porta hepatis transmits the hepatic duct, hepatic artery and portal vein.',
    'The cystic artery is found in Calot’s triangle.',
    'The pancreatic and bile ducts open together at the major papilla; head cancer causes obstructive jaundice.',
    'The spleen lies under ribs 9–11 and is the most commonly injured abdominal organ.',
  ],
  highYield: [
    'Ligamentum teres = left umbilical vein; ligamentum venosum = ductus venosus.',
    '80% of gallstones are cholesterol stones.',
    'Splenorenal ligament carries the pancreatic tail and splenic vessels.',
  ],
  confusions: [
    {
      confusion: 'Assigning the quadrate and caudate lobes to the functional right lobe.',
      clarification: 'Anatomically they are part of the right lobe, but functionally (by Cantlie’s line) they belong to the left lobe (slide 61).',
    },
  ],
};

// ─── Lesson 9: Arterial Supply of the GI Tract ───────────────────────

const lesson9: Draft = {
  id: L(9),
  title: 'Arterial Supply of the GI Tract',
  description: 'The three gut arteries and their territories, watershed zones and colonic anastomoses, the branches of the coeliac trunk and the superior and inferior mesenteric arteries, and the blood supply of the rectum and anal canal.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: nv([2, 3, 6, 10, 11, 13, 15]),
  objectives: [
    'Give the levels and territories of the coeliac trunk, SMA and IMA.',
    'Explain watershed zones and the marginal artery and arc of Riolan.',
    'List the branches of the coeliac trunk and their territories.',
    'List the branches of the SMA and IMA.',
    'Describe the blood supply of the rectum and anal canal.',
  ],
  chunks: [
    {
      title: 'The Three Gut Arteries and Watershed Zones',
      kind: 'overview',
      paragraphs: [
        'The abdominal gut is supplied mostly by the unpaired anterior branches of the abdominal aorta. The coeliac trunk (T12) is the artery of the foregut: lower oesophagus, stomach, duodenum above the major papilla, liver, gallbladder and pancreas. The superior mesenteric artery (L1) is the artery of the midgut: from the major papilla to the proximal two-thirds of the transverse colon. The inferior mesenteric artery (L3) is the artery of the hindgut: distal third of the transverse colon, descending and sigmoid colon, rectum and anal canal above the pectinate line.',
        'Watershed zones receive dual supply from the most distal branches of two arteries and are vulnerable to ischaemia in low-flow states. Griffith’s point, near the splenic flexure, lies between the middle colic (SMA) and left colic (IMA). Sudeck’s point, at the rectosigmoid junction, lies between the superior rectal and sigmoid arteries.',
        'The marginal artery (of Drummond) is an anastomosis along the colon between the ileocolic, right colic and middle colic (SMA) and left colic and sigmoid (IMA) arteries; it is poorly developed at the splenic flexure and rectosigmoid. The arc of Riolan links the middle colic and left colic arteries; it is less common and may be absent.',
      ],
      table: {
        columns: ['Artery', 'Level', 'Gut territory'],
        rows: [
          ['Coeliac trunk', 'T12', 'Foregut (to the major papilla) + spleen'],
          ['SMA', 'L1', 'Midgut (papilla → proximal ⅔ transverse colon)'],
          ['IMA', 'L3', 'Hindgut (distal ⅓ transverse colon → pectinate line)'],
        ],
      },
      terms: [
        { term: 'Watershed zone', meaning: 'Area at the end-territory of two arteries, prone to ischaemia.' },
        { term: 'Marginal artery of Drummond', meaning: 'Arterial arcade along the colon linking SMA and IMA branches.' },
        { term: 'Griffith’s point', meaning: 'Splenic flexure watershed between middle and left colic arteries.' },
      ],
      keyPoints: [
        'Watersheds: splenic flexure (Griffith) and rectosigmoid (Sudeck).',
      ],
      sourceRefs: nv([2, 3, 4]),
    },
    {
      title: 'The Coeliac Trunk',
      kind: 'structure',
      paragraphs: [
        'The coeliac trunk gives three branches. The left gastric artery supplies the abdominal oesophagus and lesser curvature, anastomosing with the right gastric.',
        'The splenic artery supplies the spleen, stomach and pancreas (neck, body, tail). Its branches are the short gastric arteries (about 6, to the fundus), the left gastroepiploic artery (left greater curvature) and pancreatic branches (dorsal, inferior and greater pancreatic arteries; occasionally a posterior gastric artery).',
        'The common hepatic artery supplies the liver, gallbladder, stomach, duodenum and pancreatic head and neck. It gives the proper hepatic artery in the hepatoduodenal ligament (dividing into right and left hepatic arteries; the right often gives the cystic artery), the right gastric artery (pylorus and lesser curvature) and the gastroduodenal artery, which gives the right gastroepiploic artery (right greater curvature) and the superior pancreaticoduodenal arteries (anterior and posterior). Supraduodenal arteries supply the first part of the duodenum.',
        'Clinical: a posterior gastric ulcer into the lesser sac may erode the splenic artery; a lesser curvature ulcer the left gastric artery; a posterior duodenal ulcer the gastroduodenal artery. Median arcuate ligament syndrome is compression of the coeliac trunk by the median arcuate ligament. The Pringle manoeuvre controls liver bleeding by clamping the hepatoduodenal ligament (hepatic artery, portal vein and bile duct).',
      ],
      steps: [
        { label: 'Left gastric artery', detail: 'Abdominal oesophagus and lesser curvature.' },
        { label: 'Splenic artery', detail: 'Spleen, short gastrics, left gastroepiploic, pancreatic branches.' },
        { label: 'Common hepatic artery', detail: 'Proper hepatic, right gastric, gastroduodenal.' },
      ],
      terms: [
        { term: 'Gastroduodenal artery', meaning: 'Branch of the common hepatic artery behind the first part of the duodenum.' },
        { term: 'Pringle manoeuvre', meaning: 'Clamping the hepatoduodenal ligament to control hepatic bleeding.' },
        { term: 'Short gastric arteries', meaning: 'Branches of the splenic artery to the fundus.' },
      ],
      keyPoints: [
        'Posterior duodenal ulcer → gastroduodenal artery bleed.',
      ],
      notes: [{ kind: 'annotation', text: 'The definition of the Pringle manoeuvre is from the speaker notes of slide 10.' }],
      sourceRefs: nv([6, 7, 8, 9, 10]),
    },
    {
      title: 'The Superior and Inferior Mesenteric Arteries',
      kind: 'structure',
      paragraphs: [
        'SMA branches: the inferior pancreaticoduodenal artery (anterior and posterior branches, to the pancreatic head, uncinate process and distal duodenum, anastomosing with the superior pancreaticoduodenal arteries of the coeliac trunk); jejunal and ileal (intestinal) arteries; the middle colic artery (proximal two-thirds of the transverse colon); the right colic artery (ascending colon); and the ileocolic artery (distal ileum, caecum, appendix), whose inferior division gives anterior and posterior caecal arteries — the posterior giving the appendicular artery.',
        'IMA branches: the left colic artery (distal third of the transverse colon and descending colon), the sigmoid arteries, and the superior rectal artery (terminal branch, to the rectum and anal canal above the pectinate line). A left hemicolectomy removes the left side of the colon for cancer, diverticulitis, trauma or IBD.',
        'Rectum: upper part — superior rectal artery (IMA); middle — middle rectal artery (internal iliac, sometimes inferior vesical or vaginal, sometimes absent); lower — inferior rectal artery (internal pudendal). Anal canal: above the pectinate line, the superior rectal artery; below it, the inferior rectal artery.',
      ],
      table: {
        columns: ['Artery', 'Branches'],
        rows: [
          ['SMA', 'Inferior pancreaticoduodenal, jejunal/ileal, middle colic, right colic, ileocolic (→ appendicular)'],
          ['IMA', 'Left colic, sigmoid, superior rectal'],
        ],
      },
      terms: [
        { term: 'Ileocolic artery', meaning: 'SMA branch to distal ileum, caecum and appendix.' },
        { term: 'Superior rectal artery', meaning: 'Terminal IMA branch to the upper rectum and anal canal.' },
        { term: 'Appendicular artery', meaning: 'Branch of the posterior caecal artery (ileocolic) in the mesoappendix.' },
      ],
      keyPoints: [
        'Pancreatic head: superior (coeliac) + inferior (SMA) pancreaticoduodenal arteries.',
      ],
      notes: [{ kind: 'lecturer', text: 'Slide 11 prompts you to look up intestinal angina (chronic mesenteric ischaemia).' }],
      sourceRefs: nv([11, 12, 13, 14, 15]),
    },
  ],
  summary: [
    'Coeliac (T12) → foregut; SMA (L1) → midgut; IMA (L3) → hindgut.',
    'Watershed zones: splenic flexure and rectosigmoid junction.',
    'Coeliac branches: left gastric, splenic, common hepatic.',
    'SMA: inferior pancreaticoduodenal, intestinal, middle colic, right colic, ileocolic.',
    'IMA: left colic, sigmoid, superior rectal.',
  ],
  highYield: [
    'Appendicular artery: from the ileocolic (posterior caecal).',
    'Cystic artery: usually from the right hepatic.',
    'Middle rectal: internal iliac; inferior rectal: internal pudendal.',
  ],
  confusions: [
    {
      confusion: 'Thinking the IMA supplies the whole transverse colon.',
      clarification: 'The middle colic (SMA) supplies the proximal two-thirds; the left colic (IMA) only the distal third (slides 11, 13).',
    },
  ],
};

// ─── Lesson 10: Portal System, Lymphatics and Innervation ────────────

const lesson10: Draft = {
  id: L(10),
  title: 'Portal System, Lymphatics and Innervation of the Gut',
  description: 'The IVC and the hepatic portal vein, portocaval anastomoses and portal hypertension, haemorrhoids, lymph drainage of the abdominal viscera, and the sympathetic, parasympathetic and enteric innervation of the gut with referred pain.',
  xp: 25,
  estimatedMinutes: 17,
  sourceRefs: nv([16, 18, 19, 20, 22, 23, 24, 28, 30, 32, 33, 34, 36, 37, 39, 41, 42, 45, 47]),
  objectives: [
    'Describe the formation, course and tributaries of the hepatic portal vein.',
    'List the sites of portocaval anastomosis and the effects of portal hypertension.',
    'Distinguish internal and external haemorrhoids.',
    'Describe the lymphatic drainage of the abdominal viscera.',
    'Describe the extrinsic and intrinsic innervation of the gut and explain referred pain.',
  ],
  chunks: [
    {
      title: 'The Hepatic Portal Vein',
      kind: 'structure',
      figure: 'gastrointestinal-system-gross:portal-venous-system',
      paragraphs: [
        'There are two venous systems in the abdomen: the systemic veins draining to the IVC, and the portal system. A portal system has capillaries at both ends.',
        'The hepatic portal vein carries nutrient-rich, deoxygenated blood from the GI tract (except the lower anal canal), pancreas, spleen and gallbladder to the liver for metabolism and detoxification. It is usually formed behind the neck of the pancreas at L1–L2 by the union of the superior mesenteric vein and the splenic vein (the IMV usually joins the splenic vein). It runs in the hepatoduodenal ligament to the porta hepatis, where it divides into right and left branches. It has no functioning valves, so obstruction raises pressure throughout the system.',
        'Veins draining directly into the portal vein: the superior pancreaticoduodenal vein, the left (coronary) and right (pyloric) gastric veins, the cystic veins (to the right branch) and the paraumbilical veins (along the ligamentum teres).',
      ],
      terms: [
        { term: 'Hepatic portal vein', meaning: 'Vein formed by SMV + splenic vein behind the pancreatic neck, carrying gut blood to the liver.' },
        { term: 'Portal system', meaning: 'Vascular system with capillary beds at both ends.' },
      ],
      keyPoints: [
        'Portal vein: SMV + splenic vein behind the neck of the pancreas (L1–L2).',
        'Valveless — pressure transmits back throughout the system.',
      ],
      sourceRefs: nv([16, 18, 19, 20]),
    },
    {
      title: 'Portocaval Anastomoses and Portal Hypertension',
      kind: 'clinical',
      paragraphs: [
        'Portocaval anastomoses are valveless connections between portal and systemic veins that provide an alternative route in portal hypertension. Normal portal pressure is 5–8 mmHg; above 20 mmHg is portal hypertension. Causes: prehepatic (portal vein thrombosis), intrahepatic (cirrhosis) and posthepatic (hepatic vein thrombosis — Budd–Chiari — constrictive pericarditis, IVC obstruction).',
        'Sites: distal oesophagus (oesophageal branch of the left gastric vein ↔ azygos tributaries) → oesophageal varices; rectum and lower anal canal (superior rectal ↔ middle and inferior rectal veins) → anorectal varices; bare area of the liver (hepatic veins ↔ inferior phrenic veins); paraumbilical region (paraumbilical ↔ superficial epigastric veins) → caput medusae; and retroperitoneal areas (mesenteric tributaries ↔ lumbar and phrenic veins).',
        'Consequences of portal hypertension: ascites (> 500 ml), enlarged anastomoses (varices, caput medusae), congestive splenomegaly, hepatic encephalopathy and hepatorenal syndrome. A transjugular intrahepatic portosystemic shunt (TIPSS) can decompress the system.',
        'Haemorrhoids are swollen anal vascular cushions (at 3, 7 and 11 o’clock), distinct from anorectal varices. Internal haemorrhoids lie above the pectinate line (internal rectal plexus), are painless (visceral innervation) but bleed. External haemorrhoids lie below the line (external rectal plexus) and are painful, especially when thrombosed (somatic inferior rectal nerve). Risk factors: straining, age, pregnancy, chronic cough, ascites and portal hypertension.',
      ],
      table: {
        columns: ['Site', 'Portal vein', 'Systemic vein', 'Result'],
        rows: [
          ['Lower oesophagus', 'Left gastric', 'Azygos tributaries', 'Oesophageal varices'],
          ['Anorectal', 'Superior rectal', 'Middle/inferior rectal', 'Anorectal varices'],
          ['Umbilicus', 'Paraumbilical', 'Superficial epigastric', 'Caput medusae'],
          ['Bare area of liver', 'Hepatic', 'Inferior phrenic', '—'],
          ['Retroperitoneum', 'Mesenteric tributaries', 'Lumbar, phrenic', '—'],
        ],
      },
      terms: [
        { term: 'Portal hypertension', meaning: 'Portal pressure above 20 mmHg.' },
        { term: 'Internal haemorrhoids', meaning: 'Painless, bleeding swellings above the pectinate line.' },
        { term: 'TIPSS', meaning: 'Transjugular intrahepatic portosystemic shunt.' },
      ],
      keyPoints: [
        'Oesophageal varices = left gastric ↔ azygos.',
        'Anorectal varices are not haemorrhoids.',
      ],
      sourceRefs: nv([22, 23, 24, 25, 26, 27, 28, 30, 31]),
    },
    {
      title: 'Lymphatic Drainage of the Abdominal Viscera',
      kind: 'pathway',
      paragraphs: [
        'The lumbar nodes are grouped as left lumbar (para-aortic: lateral aortic, preaortic, retroaortic), right lumbar (paracaval: lateral caval, precaval, retrocaval) and intermediate lumbar nodes between the aorta and IVC.',
        'Preaortic nodes drain the GI tract: coeliac nodes (stomach, liver, spleen, pancreas, duodenum, and the superior and inferior mesenteric nodes); superior mesenteric nodes (small intestine, caecum, ascending and transverse colon); inferior mesenteric nodes (descending and sigmoid colon, rectum). Efferents from the coeliac nodes form the intestinal trunk.',
        'Lateral aortic (para-aortic) nodes receive lymph from the posterior wall, kidneys, suprarenals, upper ureters, testes, ovaries, uterine fundus and tubes, and the iliac nodes; their efferents form the lumbar trunks.',
        'The intestinal and lumbar trunks join to form the cisterna chyli at L1–L2, the origin of the thoracic duct, which ends at the junction of the left subclavian and internal jugular veins.',
      ],
      terms: [
        { term: 'Preaortic nodes', meaning: 'Coeliac, superior and inferior mesenteric nodes draining the gut.' },
        { term: 'Lateral aortic nodes', meaning: 'Para-aortic nodes draining paired organs and the posterior wall.' },
      ],
      keyPoints: [
        'Gut → preaortic nodes → intestinal trunk; paired organs → lateral aortic nodes → lumbar trunks.',
      ],
      sourceRefs: nv([32, 33, 34, 35]),
    },
    {
      title: 'Innervation of the Gut and Referred Pain',
      kind: 'mechanism',
      paragraphs: [
        'Extrinsic: the autonomic nervous system. Sympathetic activity is inhibitory (decreases peristalsis and secretion, contracts sphincters, relaxes the gallbladder); parasympathetic activity promotes secretion and motility (relaxes sphincters, contracts the gallbladder).',
        'Intrinsic: the enteric nervous system (the “second brain”, from neural crest) can work independently of the CNS. The submucosal (Meissner’s) plexus regulates secretion, blood flow and absorption; the myenteric (Auerbach’s) plexus, between the circular and longitudinal muscle layers, controls motility. Absence of these ganglia causes Hirschsprung disease (aganglionic megacolon).',
        'Parasympathetic: the vagus supplies the foregut and midgut through the coeliac and superior mesenteric plexuses (with sensory reflex fibres but no pain fibres); the pelvic splanchnic nerves (S2–S4) — the only parasympathetic splanchnic nerves — supply the hindgut through the inferior hypogastric plexus.',
        'Sympathetic: thoracic splanchnic nerves (T5–T12) pass through the sympathetic chain without synapsing to the prevertebral ganglia: greater (T5–T9/10) → coeliac ganglion → foregut; lesser (T10–T11) → superior mesenteric ganglion → midgut; least (T12) → renal ganglion → kidney, adrenal, upper ureter. Lumbar splanchnics (L1–L2) → inferior mesenteric ganglion → hindgut. Postganglionic fibres follow the arteries.',
        'Visceral pain (mainly from distension or inflammation) returns with the sympathetic fibres to dorsal root ganglia of T5–L2. Sensory fibres with the parasympathetics mediate reflexes and sensations such as hunger and rectal fullness. Referred pain is felt in the dermatomes of the spinal segments receiving the visceral input; the convergence–projection theory explains it: visceral and somatic afferents converge on the same spinal neurons, and the brain attributes the pain to the skin.',
      ],
      table: {
        columns: ['Gut region', 'Sympathetic', 'Parasympathetic'],
        rows: [
          ['Foregut', 'Greater splanchnic (T5–T9) → coeliac ganglion', 'Vagus'],
          ['Midgut', 'Lesser splanchnic (T10–T11) → superior mesenteric ganglion', 'Vagus'],
          ['Hindgut', 'Lumbar splanchnic (L1–L2) → inferior mesenteric ganglion', 'Pelvic splanchnic (S2–S4)'],
        ],
      },
      terms: [
        { term: 'Myenteric plexus', meaning: 'Auerbach’s plexus between the muscle layers; controls motility.' },
        { term: 'Submucosal plexus', meaning: 'Meissner’s plexus; controls secretion and local blood flow.' },
        { term: 'Hirschsprung disease', meaning: 'Aganglionic megacolon from absent enteric ganglia.' },
        { term: 'Referred pain', meaning: 'Visceral pain felt in the dermatome of the same spinal segment.' },
      ],
      keyPoints: [
        'Pain from the gut travels with sympathetic fibres; the vagus carries no pain.',
      ],
      sourceRefs: nv([36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 50]),
    },
  ],
  summary: [
    'The portal vein forms from the SMV and splenic vein behind the pancreatic neck and is valveless.',
    'Portocaval anastomoses: oesophagus, anorectum, umbilicus, bare area, retroperitoneum.',
    'Internal haemorrhoids are painless; external ones are painful.',
    'Gut lymph goes to preaortic nodes and the intestinal trunk, joining the cisterna chyli.',
    'Foregut and midgut get vagal parasympathetics; hindgut gets pelvic splanchnics; pain returns with sympathetics.',
  ],
  highYield: [
    'Portal hypertension > 20 mmHg (normal 5–8).',
    'Caput medusae = paraumbilical ↔ superficial epigastric veins.',
    'Myenteric plexus controls motility; submucosal plexus controls secretion.',
  ],
  confusions: [
    {
      confusion: 'Thinking the vagus carries pain from the stomach.',
      clarification: 'The vagus carries reflex sensory fibres but no pain fibres; foregut and midgut pain travels with the sympathetic fibres (slide 39).',
    },
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9, lesson10].map((lesson) => ({
  ...lesson,
  interactive: interactive[lesson.id],
}));
