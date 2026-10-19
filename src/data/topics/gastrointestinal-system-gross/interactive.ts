// Anatomy → Gastrointestinal System (gross): each lesson's interactive layer.
import { ask, learn, match, mcq, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { aw, gi, nv, TOPIC_ID, type ConceptId } from '@/data/topics/gastrointestinal-system-gross/sources';

type Steps = InteractiveDraft<ConceptId>[];
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const interactive: Record<string, Steps> = {
  [L(1)]: [
    learn('Mapping the abdomen', [
      'Four quadrants come from the median and transumbilical (L3/L4) planes. Nine regions come from the two midclavicular planes and the subcostal (L3) and transtubercular (L5) planes.',
    ], { sourceRefs: aw([4, 5]) }),
    ask(mcq('i1-01', 'surface-points', 'McBurney’s point lies:', 'One-third of the way from the right ASIS to the umbilicus', ['Below the right costal margin at the midclavicular line', 'At the midpoint of the right inguinal ligament', 'Two-thirds of the way from the umbilicus to the pubis'], { explanation: 'Slide 7: it marks the base of the appendix.' })),
    ask(order('i1-02', 'wall-layers-fascia', 'Order the layers of the anterolateral wall below the umbilicus from outside in:', ['Skin', 'Camper’s fascia', 'Scarpa’s fascia', 'Muscles and aponeuroses', 'Transversalis fascia', 'Extraperitoneal fat', 'Parietal peritoneum'], { explanation: 'Slides 10, 12.' })),
    learn('Where does leaked urine go?', [
      'Scarpa’s fascia is fused to the fascia lata 2.5 cm below the inguinal ligament and continues as Colles’ and dartos fascia, so fluid deep to it spreads into the scrotum, penis and lower wall — not the thigh.',
    ], { sourceRefs: aw([12, 14]) }),
    ask(match('i1-03', 'wall-muscles', 'Match each structure to the muscle or fascia it comes from:', [
      ['Inguinal ligament', 'External oblique'],
      ['Cremaster muscle', 'Internal oblique'],
      ['Deep inguinal ring', 'Transversalis fascia'],
    ], { explanation: 'Slides 21–22.' })),
    recall('r1-01', 'wall-layers-fascia', 'Describe the attachments of Scarpa’s fascia and their clinical importance.', [
      'Above: blends with the deep fascia of the thorax; laterally with the deep fascia of the wall.',
      'Below: fuses with the fascia lata about 2.5 cm below the inguinal ligament.',
      'Medially/inferiorly: continues as Colles’ fascia and dartos; forms the fundiform ligament.',
      'So extravasated urine or blood spreads to the scrotum, penis and lower wall but not the thigh.',
    ], aw([12, 14])),
  ],

  [L(2)]: [
    ask(mcq('i2-01', 'rectus-sheath', 'Below the arcuate line, what lies directly behind rectus abdominis?', 'Transversalis fascia', ['Transversus abdominis aponeurosis', 'Internal oblique aponeurosis', 'External oblique aponeurosis'], { explanation: 'Slide 26.' })),
    learn('Building the sheath', [
      'Above the arcuate line, the internal oblique aponeurosis splits: front half with external oblique, back half with transversus. Below, all three pass in front.',
    ], { sourceRefs: aw([26]) }),
    ask(match('i2-02', 'wall-nerves', 'Match each dermatome to its skin area:', [
      ['T7–T9', 'Above the umbilicus'],
      ['T10', 'Around the umbilicus'],
      ['L1', 'Pubic region'],
    ], { explanation: 'Slide 36.' })),
    learn('Portal–systemic link at the umbilicus', [
      'Paraumbilical veins connect the superficial veins around the umbilicus with the portal vein; in portal hypertension they dilate as caput medusae.',
    ], { sourceRefs: aw([33, 34]) }),
    ask(mcq('i2-03', 'abdominal-incisions', 'Which incision is classically used for caesarean section?', 'Pfannenstiel', ['Kocher (subcostal)', 'Gridiron', 'Paramedian'], { explanation: 'Slide 39.' })),
    recall('r2-01', 'wall-vessels-lymph', 'Describe the lymphatic drainage of the anterolateral wall.', [
      'Superficial above the umbilicus: axillary (pectoral) and some parasternal nodes; below: superficial inguinal nodes.',
      'Deep above: parasternal and external iliac; below: external iliac → common iliac → lumbar nodes.',
    ], aw([35])),
  ],

  [L(3)]: [
    learn('The canal in four walls', [
      'MALT: roof — 2 Muscles (internal oblique, transversus); front — 2 Aponeuroses; floor — 2 Ligaments (inguinal, lacunar); back — 2 Ts (transversalis fascia, conjoint tendon).',
    ], { sourceRefs: aw([54]) }),
    ask(mcq('i3-01', 'inguinal-canal', 'The deep inguinal ring lies:', 'Lateral to the inferior epigastric vessels, 1.25 cm above the midpoint of the inguinal ligament', ['Medial to the inferior epigastric vessels, just above the pubic tubercle', 'Above and lateral to the pubic tubercle, in the external oblique aponeurosis', 'Below the inguinal ligament, medial to the femoral vein'], { explanation: 'Slide 52.' })),
    ask(match('i3-02', 'spermatic-cord', 'Match each covering of the spermatic cord to its origin:', [
      ['External spermatic fascia', 'External oblique aponeurosis'],
      ['Cremasteric muscle and fascia', 'Internal oblique'],
      ['Internal spermatic fascia', 'Transversalis fascia'],
    ], { explanation: 'Slide 49.' })),
    learn('Direct or indirect?', [
      'Indirect hernias enter the deep ring lateral to the inferior epigastric vessels; direct hernias push through Hesselbach’s triangle medial to them.',
    ], { sourceRefs: aw([59, 60]) }),
    ask(mcq('i3-03', 'inguinal-femoral-hernia', 'A 45-year-old woman has a painful groin bulge below the inguinal ligament, below and lateral to the pubic tubercle. The most likely diagnosis is:', 'Femoral hernia', ['Direct inguinal hernia', 'Indirect inguinal hernia', 'Umbilical hernia'], { explanation: 'Slides 61, 72.', skill: 'application' })),
    recall('r3-01', 'inguinal-canal', 'Give the boundaries of the inguinal canal.', [
      'Roof: arching fibres of internal oblique and transversus abdominis.',
      'Anterior: external oblique aponeurosis, reinforced laterally by internal oblique.',
      'Floor: inguinal and lacunar ligaments, iliopubic tract.',
      'Posterior: transversalis fascia, reinforced medially by the conjoint tendon.',
    ], aw([54])),
  ],

  [L(4)]: [
    ask(mcq('i4-01', 'posterior-wall-structure', 'Which muscle fuses with psoas major to form the chief flexor of the hip?', 'Iliacus', ['Quadratus lumborum', 'Psoas minor', 'Transversus abdominis'], { explanation: 'Slide 83.' })),
    learn('Psoas in the clinic', [
      'Pus can track down inside the psoas fascia to the groin (cold abscess of spinal TB). A right-sided psoas sign suggests appendicitis.',
    ], { sourceRefs: aw([84]) }),
    ask(order('i4-02', 'lymphatic-ducts', 'Order the path of lymph:', ['Lymphatic capillaries', 'Afferent lymphatic vessels', 'Lymph nodes', 'Lymphatic trunks', 'Lymphatic ducts', 'Subclavian veins'], { explanation: 'Slide 107.' })),
    learn('The cisterna chyli', [
      'Intestinal + lumbar trunks form the cisterna chyli at L1–L2; it becomes the thoracic duct, which passes through the aortic hiatus and ends at the left venous angle.',
    ], { sourceRefs: aw([94, 110]) }),
    ask(match('i4-03', 'abdominal-autonomics-lumbar-plexus', 'Match each splanchnic nerve to its ganglion:', [
      ['Greater splanchnic (T5–T9)', 'Coeliac ganglion'],
      ['Lesser splanchnic (T10–T11)', 'Superior mesenteric ganglion'],
      ['Lumbar splanchnics (L1–L2)', 'Inferior mesenteric ganglion'],
    ], { explanation: 'Slide 97.' })),
    recall('r4-01', 'posterior-wall-vessels', 'List the tributaries of the IVC.', [
      'Hepatic veins, inferior phrenic veins.',
      'Right suprarenal vein, right gonadal vein.',
      'Renal veins and lumbar veins (usually 3rd and 4th).',
    ], aw([90])),
  ],

  [L(5)]: [
    ask(match('i5-01', 'oesophagus', 'Match each oesophageal constriction to its distance from the incisor teeth:', [
      ['Pharyngo-oesophageal junction', '15 cm'],
      ['Arch of the aorta', '22 cm'],
      ['Left main bronchus', '27 cm'],
      ['Oesophageal hiatus', '38 cm'],
    ], { explanation: 'Slide 4.' })),
    learn('Keeping acid down', [
      'The LES is a physiological sphincter, helped by mucosal folds, the acute angle of entry, the right crus sling and compression of the abdominal oesophagus.',
    ], { sourceRefs: gi([5, 6]) }),
    ask(mcq('i5-02', 'stomach', 'A posterior gastric ulcer causing back pain has most likely eroded the:', 'Pancreas', ['Left lobe of the liver', 'Transverse colon', 'Anterior abdominal wall'], { explanation: 'Slide 12.', skill: 'application' })),
    learn('Two kinds of hiatal hernia', [
      'Sliding (90%): the oesophagogastric junction slides up; reflux is common. Rolling: the fundus rolls up beside an intact LES; no regurgitation.',
    ], { sourceRefs: gi([16]) }),
    ask(mcq('i5-03', 'hiatal-hernia', 'Which hiatal hernia leaves the cardiac mechanism intact, so there is no regurgitation?', 'Rolling (para-oesophageal) hernia', ['Sliding (axial) hernia', 'Bochdalek (posterolateral) hernia', 'Morgagni (retrosternal) hernia'], { explanation: 'Slide 16.' })),
    recall('r5-01', 'stomach', 'List the posterior relations (stomach bed) of the stomach.', [
      'Body of the pancreas and splenic vessels.',
      'Left kidney and suprarenal gland; spleen.',
      'Left dome of the diaphragm.',
      'Transverse colon, transverse mesocolon and splenic flexure.',
    ], gi([12])),
  ],

  [L(6)]: [
    ask(mcq('i6-01', 'duodenum', 'The major duodenal papilla is found in which part of the duodenum?', 'Second (descending)', ['First (superior)', 'Third (horizontal)', 'Fourth (ascending)'], { explanation: 'Slide 20.' })),
    learn('Ulcers front and back', [
      'Posterior duodenal ulcers erode the gastroduodenal artery (haematemesis, melaena); anterior ones perforate into the peritoneal cavity (peritonitis).',
    ], { sourceRefs: gi([25]) }),
    ask(match('i6-02', 'duodenum', 'Match each part of the duodenum to its vertebral level:', [
      ['First part', 'L1'],
      ['Second part', 'L1–L3'],
      ['Third part', 'L3'],
    ], { explanation: 'Slide 20.' })),
    learn('Rule of 2s', [
      'Meckel’s diverticulum: 2% of people, 2 feet from the ileocaecal valve, 2 inches long, 2 types of ectopic tissue, symptoms before age 2.',
    ], { sourceRefs: gi([36]) }),
    ask(mcq('i6-03', 'jejunum-ileum', 'Peyer’s patches are concentrated in the:', 'Distal ileum', ['Duodenal cap', 'Proximal jejunum', 'Caecum'], { explanation: 'Slide 32.' })),
    recall('r6-01', 'duodenum', 'Give the relations of the third part of the duodenum.', [
      'Above: head and uncinate process of the pancreas; below: jejunum.',
      'Anterior: root of the mesentery and superior mesenteric vessels.',
      'Posterior: right ureter, gonadal vessels, psoas, IVC and aorta.',
    ], gi([26])),
  ],

  [L(7)]: [
    learn('Spot the colon', [
      'Teniae coli, haustra and epiploic appendices mark the colon. All three are absent from the rectum.',
    ], { sourceRefs: gi([39, 48]) }),
    ask(mcq('i7-01', 'colon-features', 'How can the base of the appendix be found at operation?', 'Follow any of the teniae coli on the caecum', ['Follow the ileocaecal valve upward', 'Follow the right colic artery down', 'Feel for the root of the sigmoid mesocolon'], { explanation: 'Slides 39, 41.', skill: 'application' })),
    ask(match('i7-02', 'colon-features', 'Match each part of the colon to its approximate length:', [
      ['Ascending colon', '15 cm'],
      ['Transverse colon', '45 cm'],
      ['Descending colon', '30 cm'],
    ], { explanation: 'Slide 43.' })),
    learn('The pectinate line', [
      'Above it: endoderm, columnar epithelium, adenocarcinoma, painless. Below it: ectoderm, squamous epithelium, squamous carcinoma, painful.',
    ], { sourceRefs: gi([53, 55]) }),
    ask(mcq('i7-03', 'anal-canal', 'Which sphincter is skeletal muscle under voluntary control?', 'External anal sphincter', ['Internal anal sphincter', 'Pyloric sphincter', 'Lower oesophageal sphincter'], { explanation: 'Slide 51.' })),
    recall('r7-01', 'rectum', 'Describe the peritoneal covering of the rectum.', [
      'Upper third: covered in front and at the sides.',
      'Middle third: covered in front only.',
      'Lower third: below the peritoneum, in the pelvic fascia.',
    ], gi([48])),
  ],

  [L(8)]: [
    ask(mcq('i8-01', 'liver', 'Cantlie’s line divides the liver into functional lobes. Which lobes belong to the functional LEFT lobe?', 'Quadrate and caudate lobes', ['The anatomical right lobe only', 'None — both belong to the functional right lobe', 'The bare area and the right lobe'], { explanation: 'Slide 61.' })),
    learn('Fetal remnants on the liver', [
      'Ligamentum teres = left umbilical vein (in the falciform edge). Ligamentum venosum = ductus venosus (between caudate lobe and left lobe).',
    ], { sourceRefs: gi([61, 66]) }),
    ask(match('i8-02', 'gallbladder', 'Match each boundary of Calot’s triangle:', [
      ['Superior', 'Inferior border of the liver'],
      ['Inferior', 'Cystic duct'],
      ['Medial', 'Common hepatic duct'],
    ], { explanation: 'Slide 70.' })),
    learn('Ducts into the duodenum', [
      'The main pancreatic duct joins the bile duct at the ampulla of Vater, opening at the major papilla (sphincter of Oddi). The accessory duct opens at the minor papilla.',
    ], { sourceRefs: gi([72]) }),
    ask(mcq('i8-03', 'spleen', 'After a fall onto the left lower ribs, which organ is most at risk?', 'Spleen', ['Pancreas', 'Left kidney only', 'Sigmoid colon'], { explanation: 'Slide 76: the most frequently injured abdominal organ.', skill: 'application' })),
    recall('r8-01', 'spleen', 'Name the two ligaments of the spleen and their contents.', [
      'Gastrosplenic: to the greater curvature; short gastric and left gastroepiploic vessels.',
      'Splenorenal: to the posterior wall; splenic vessels and tail of the pancreas.',
    ], gi([80])),
  ],

  [L(9)]: [
    ask(match('i9-01', 'gut-arteries-overview', 'Match each artery to its embryological gut region:', [
      ['Coeliac trunk', 'Foregut'],
      ['Superior mesenteric artery', 'Midgut'],
      ['Inferior mesenteric artery', 'Hindgut'],
    ], { explanation: 'Slide 2.' })),
    learn('Weak spots', [
      'Griffith’s point (splenic flexure) and Sudeck’s point (rectosigmoid) are watershed zones where the marginal artery is poorly developed.',
    ], { sourceRefs: nv([2, 3]) }),
    ask(mcq('i9-02', 'coeliac-trunk', 'A penetrating ulcer of the posterior first part of the duodenum bleeds heavily. Which artery is eroded?', 'Gastroduodenal artery', ['Left gastric artery (lesser curve)', 'Splenic artery', 'Middle colic artery'], { explanation: 'Slide 10.', skill: 'application' })),
    learn('Three coeliac branches', [
      'Left gastric, splenic and common hepatic arteries; the common hepatic gives the proper hepatic, right gastric and gastroduodenal arteries.',
    ], { sourceRefs: nv([6]) }),
    ask(mcq('i9-03', 'sma-ima-branches', 'The appendicular artery is ultimately a branch of the:', 'Ileocolic artery (SMA)', ['Left colic artery (IMA)', 'Right gastric artery', 'Superior rectal artery'], { explanation: 'Slide 11.' })),
    recall('r9-01', 'sma-ima-branches', 'Describe the arterial supply of the rectum.', [
      'Upper: superior rectal artery (terminal branch of the IMA).',
      'Middle: middle rectal artery (internal iliac; sometimes inferior vesical or vaginal; may be absent).',
      'Lower: inferior rectal artery (internal pudendal).',
    ], nv([15])),
  ],

  [L(10)]: [
    ask(mcq('i10-01', 'portal-system', 'The hepatic portal vein is formed by the union of:', 'The superior mesenteric and splenic veins', ['The splenic and renal veins', 'The inferior mesenteric and gonadal veins', 'The right and left gastric veins'], { explanation: 'Slide 19.' })),
    learn('Why varices form', [
      'The portal system has no functioning valves, so portal hypertension (> 20 mmHg) pushes blood through portocaval anastomoses, which dilate into varices.',
    ], { sourceRefs: nv([18, 22]) }),
    ask(match('i10-02', 'portocaval-anastomoses', 'Match each site to its clinical sign in portal hypertension:', [
      ['Lower oesophagus', 'Oesophageal varices'],
      ['Paraumbilical region', 'Caput medusae'],
      ['Rectum and anal canal', 'Anorectal varices'],
    ], { explanation: 'Slides 23–24.' })),
    learn('Nerves of the gut', [
      'Vagus → foregut and midgut; pelvic splanchnics → hindgut. Sympathetics inhibit the gut and carry pain. The enteric plexuses (Meissner’s, Auerbach’s) can work on their own.',
    ], { sourceRefs: nv([36, 37, 39, 41]) }),
    ask(mcq('i10-03', 'gi-innervation', 'Which plexus mainly controls peristalsis?', 'Myenteric (Auerbach’s) plexus', ['Submucosal (Meissner’s) plexus', 'Coeliac plexus', 'Superior hypogastric plexus'], { explanation: 'Slide 37.' })),
    recall('r10-01', 'portocaval-anastomoses', 'List the five sites of portocaval anastomosis.', [
      'Distal oesophagus: left gastric ↔ azygos tributaries.',
      'Rectum/anal canal: superior rectal ↔ middle and inferior rectal veins.',
      'Bare area of the liver: hepatic ↔ inferior phrenic veins.',
      'Paraumbilical: paraumbilical ↔ superficial epigastric veins.',
      'Retroperitoneum: mesenteric tributaries ↔ lumbar and phrenic veins.',
    ], nv([23])),
  ],
};
