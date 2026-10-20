// Anatomy → Urinary System (gross): each lesson's interactive layer.
import { ask, learn, match, mcq, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { TOPIC_ID, ur, type ConceptId } from '@/data/topics/urinary-system-gross/sources';

type Steps = InteractiveDraft<ConceptId>[];
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const interactive: Record<string, Steps> = {
  [L(1)]: [
    learn('Where the kidneys sit', [
      'Retroperitoneal, T12 to L3, the right about 1–1.5 cm lower than the left because of the liver. Each is about 12 × 6 × 3 cm and 130–150 g.',
    ], { sourceRefs: ur([4]) }),
    ask(order('i1-01', 'kidney-coverings', 'Order the coverings of the kidney from inside out:', ['Fibrous renal capsule', 'Perirenal fat', 'Renal fascia', 'Pararenal fat'], { explanation: 'Slide 7.' })),
    ask(mcq('i1-02', 'kidney-coverings', 'Why can a perinephric abscess track down into the pelvis?', 'The renal fascia has little or no attachment inferiorly', ['The fibrous renal capsule is absent at the lower pole', 'The pararenal fat is continuous with the wall of the bladder', 'The ureter carries the pus down inside its lumen'], { explanation: 'Slides 9–10.', skill: 'cause-effect' })),
    learn('In front of each kidney', [
      'Right: suprarenal, liver, 2nd part of duodenum, hepatic flexure, small intestine. Left: suprarenal, stomach, spleen, pancreas, jejunum, descending colon.',
    ], { sourceRefs: ur([13]) }),
    ask(match('i1-03', 'kidney-relations', 'Match each structure to the kidney it lies in front of:', [
      ['2nd part of the duodenum', 'Right kidney'],
      ['Tail of the pancreas', 'Left kidney'],
      ['Spleen', 'Left kidney'],
      ['Right lobe of the liver', 'Right kidney'],
    ], { explanation: 'Slide 13.' })),
    recall('r1-01', 'kidney-relations', 'List the posterior relations of the kidneys.', [
      'Costodiaphragmatic recess of the pleura; medial and lateral arcuate ligaments.',
      'Diaphragm, psoas major, quadratus lumborum, transversus abdominis.',
      'Subcostal, iliohypogastric and ilioinguinal nerves; subcostal vessels.',
      'Ribs 11 and 12 (left), rib 12 (right).',
    ], ur([15])),
  ],

  [L(2)]: [
    ask(mcq('i2-01', 'kidney-internal', 'From front to back at the hilum, the order is:', 'Vein, artery, pelvis', ['Artery, vein, pelvis', 'Pelvis, artery, vein', 'Artery, pelvis, vein'], { explanation: 'Slide 20 (VAP).' })),
    ask(order('i2-02', 'kidney-internal', 'Order the path of urine:', ['Renal papilla', 'Minor calyx', 'Major calyx', 'Renal pelvis', 'Ureter'], { explanation: 'Slides 11, 19.' })),
    learn('Two unequal renal veins', [
      'The left renal vein is about three times longer, crosses in front of the aorta and receives the left gonadal and suprarenal veins — so the left kidney is preferred for live donation.',
    ], { sourceRefs: ur([22]) }),
    ask(mcq('i2-03', 'kidney-vessels', 'Where is the avascular line of Brödel?', 'Along the lateral, slightly posterior border of the kidney', ['At the hilum, between the vessels', 'Across the upper pole, below the adrenal', 'Along the medial border, near the ureter'], { explanation: 'Slide 24.' })),
    learn('Suprarenal blood supply', [
      'Three arteries (from inferior phrenic, aorta and renal artery) but one vein: into the IVC on the right and the left renal vein on the left.',
    ], { sourceRefs: ur([36]) }),
    recall('r2-01', 'kidney-nerves', 'Describe the sympathetic supply of the kidney and its effects.', [
      'Preganglionic fibres from T10–L1 travel in the lesser and least splanchnic nerves.',
      'They synapse in the aorticorenal (and partly coeliac) ganglion; postganglionic fibres form the renal plexus.',
      'Effects: renal vasoconstriction, reduced GFR and increased renin release.',
    ], ur([27])),
  ],

  [L(3)]: [
    ask(mcq('i3-01', 'ureter-course', 'At surgery, how is the ureter identified?', 'Whitish, non-pulsatile, and shows peristalsis when pinched', ['Red, pulsatile and thick-walled like an artery', 'It has a visible valve where it joins the pelvis', 'It runs in front of the gonadal vessels throughout'], { explanation: 'Slide 38 (Kelly’s sign).' })),
    learn('Water under the bridge', [
      'In the female pelvis the uterine artery crosses above the ureter near the lateral vaginal fornix — a classic place to injure it in hysterectomy.',
    ], { sourceRefs: ur([42, 43]) }),
    ask(order('i3-02', 'ureter-constrictions', 'Order the ureteric constrictions from the kidney downward:', ['Pelviureteric junction', 'Pelvic brim (common iliac bifurcation)', 'Vesicoureteric junction'], { explanation: 'Slide 44.' })),
    learn('Loin to groin', [
      'Ureteric pain travels with sympathetic fibres (T11–L2), so it spreads from the loin to the groin, scrotum or labia and the anteromedial thigh.',
    ], { sourceRefs: ur([53]) }),
    ask(mcq('i3-03', 'ureter-supply', 'From which side should the abdominal ureter be approached in dissection?', 'Laterally, because its vessels come from the medial side', ['Medially, because its vessels come from the lateral side', 'From behind only', 'It does not matter'], { explanation: 'Slide 48.', skill: 'application' })),
    recall('r3-01', 'ureter-supply', 'Describe the arterial supply of the ureter.', [
      'Upper third: renal artery.',
      'Middle third: aorta, gonadal, common and internal iliac arteries.',
      'Lower third: superior and inferior vesical and uterine arteries.',
      'They form longitudinal anastomoses in the adventitia.',
    ], ur([48])),
  ],

  [L(4)]: [
    ask(mcq('i4-01', 'bladder-structure', 'What is the normal adult bladder capacity given in the lecture?', '400–600 ml', ['About 50–100 ml', '1–2 L', '3 L'], { explanation: 'Slide 58.' })),
    learn('The trigone', [
      'A smooth triangle between the two ureteric orifices and the internal urethral orifice. It senses stretch and is a common site of infection. The interureteric ridge links the ureteric orifices.',
    ], { sourceRefs: ur([59, 60]) }),
    ask(match('i4-02', 'bladder-support-supply', 'Match each nerve supply to its effect on the bladder:', [
      ['Pelvic splanchnic (parasympathetic)', 'Contracts detrusor — emptying'],
      ['Hypogastric (sympathetic)', 'Relaxes detrusor — filling'],
      ['Pudendal (somatic)', 'Controls the external urethral sphincter'],
    ], { explanation: 'Slide 64.' })),
    learn('Two sphincters', [
      'Internal: smooth muscle, involuntary, sympathetic; also stops retrograde ejaculation. External: skeletal muscle, voluntary, pudendal nerve.',
    ], { sourceRefs: ur([65]) }),
    ask(mcq('i4-03', 'bladder-interior', 'The uvula vesicae is produced by:', 'The median lobe of the prostate', ['The interureteric ridge', 'The obliterated urachus', 'The seminal vesicles'], { explanation: 'Slide 61.' })),
    recall('r4-01', 'bladder-structure', 'Give the relations of the base (posterior surface) of the bladder in each sex.', [
      'Male: seminal vesicles and ampullae of the vas deferens; rectum behind, separated by the rectovesical (Denonvilliers’) fascia.',
      'Female: cervix and upper vagina, separated by the vesicovaginal septum.',
    ], ur([55, 57])),
  ],

  [L(5)]: [
    ask(match('i5-01', 'male-urethra', 'Match each part of the male urethra to its length:', [
      ['Prostatic', '~3 cm'],
      ['Membranous', '~2 cm'],
      ['Spongy', '~15 cm'],
    ], { explanation: 'Slide 71.' })),
    learn('Narrowest and widest', [
      'Prostatic: widest and most dilatable. Membranous: narrowest, least dilatable and most easily injured.',
    ], { sourceRefs: ur([71]) }),
    ask(mcq('i5-02', 'male-urethra', 'What opens on the seminal colliculus (verumontanum)?', 'The ejaculatory ducts and prostatic utricle', ['The bulbourethral glands and prostatic ducts', 'The two ureters', 'The prostatic ducts only'], { explanation: 'Slide 72.' })),
    learn('Why women get more UTIs', [
      'The female urethra is only 3–4 cm and distensible, so bacteria reach the bladder easily — but catheterisation is easier.',
    ], { sourceRefs: ur([70]) }),
    ask(mcq('i5-03', 'urethra-supply-incontinence', 'Why are infants physiologically incontinent?', 'Their corticospinal tracts to the external sphincter are not yet myelinated', ['Their bladder has no detrusor muscle yet, so it cannot contract on demand', 'They lack a trigone until about two years, so the ureteric openings cannot close', 'Their pudendal nerve is absent at birth and only grows in later childhood'], { explanation: 'Slide 75.', skill: 'cause-effect' })),
    recall('r5-01', 'urethra-supply-incontinence', 'Describe the lymph drainage of the male urethra.', [
      'Prostatic and membranous parts: internal iliac nodes.',
      'Spongy part: inguinal nodes, with some to the external iliac nodes.',
    ], ur([78])),
  ],
};
