// Quiz bank for Anatomy → Urinary System (gross), built from the lecture
// deck (Urinary System Gross 2026). Includes 5 Assertion–Reason questions
// per lesson.
import { assertionReason as ar, fill, match, mcq, multi, order, tf, spotQuestion, type QuestionDraft } from '@/data/topics/build';
import { kidneyInternal } from '@/data/figures/urinary-system-gross';
import type { ConceptId } from '@/data/topics/urinary-system-gross/sources';

type Q = QuestionDraft<ConceptId>;

// ─── Lesson 1: The Kidneys — Position, Coverings and Relations ───────

const lesson1: Q[] = [
  mcq('q1-01', 'urinary-overview', 'The upper urinary tract consists of the:', 'Kidneys and ureters', ['Bladder and urethra', 'Kidneys only', 'Ureters and bladder'], { explanation: 'Slide 2.' }),
  mcq('q1-02', 'urinary-overview', 'Which hormone made by the kidney stimulates red blood cell production?', 'Erythropoietin', ['Renin', 'Calcitriol', 'Aldosterone'], { explanation: 'Slide 3.' }),
  mcq('q1-03', 'urinary-overview', 'Calcitriol produced by the kidney is involved in:', 'Calcium and bone metabolism', ['Blood pressure control only', 'Red blood cell production', 'Storage of glucose as glycogen'], { explanation: 'Slide 3.' }),
  mcq('q1-04', 'kidney-position', 'The kidneys extend between which vertebral levels?', 'T12 to L3', ['T10 to L1', 'L1 to L5', 'T8 to T12'], { explanation: 'Slide 4.' }),
  mcq('q1-05', 'kidney-position', 'The average weight of a kidney is:', '130–150 g', ['50–70 g', '300–400 g', '1 kg'], { explanation: 'Slide 4.' }),
  mcq('q1-06', 'kidney-position', 'Why does the right kidney lie lower than the left?', 'Because of the liver', ['Because of the spleen', 'Because of the heart', 'Because the right renal artery is longer'], { explanation: 'Slide 4.', skill: 'cause-effect' }),
  mcq('q1-07', 'kidney-position', 'The long axis of the kidney runs parallel to the:', 'Lateral border of psoas major', ['Vertebral column exactly', 'Line of the 12th rib', 'Highest point of the iliac crest'], { explanation: 'Slide 5.' }),
  mcq('q1-08', 'kidney-position', 'In a percutaneous renal biopsy the needle is inserted:', '2.5 cm below the 12th rib, to the lower pole', ['Above the 11th rib', 'Through the anterior abdominal wall at the umbilicus', 'At the iliac crest'], { explanation: 'Slide 6.', skill: 'application' }),
  mcq('q1-09', 'kidney-position', 'By how much do the kidneys move during respiration?', '2–3 cm', ['5–10 cm', 'Not at all', '0.5 mm'], { explanation: 'Slide 8.' }),
  mcq('q1-10', 'kidney-position', 'Nephroptosis is downward displacement of the kidney by more than:', '5 cm', ['1 cm', '10 cm', '2 mm'], { explanation: 'Slide 8.' }),
  mcq('q1-11', 'kidney-position', 'Tenderness at the costovertebral angle suggests:', 'Renal pathology such as pyelonephritis', ['Acute appendicitis', 'Acute cholecystitis', 'Splenic rupture'], { explanation: 'Slide 18.' }),
  mcq('q1-12', 'kidney-coverings', 'Which covering is also called the false capsule (Gerota’s fascia)?', 'Renal fascia', ['Fibrous renal capsule', 'Perirenal fat', 'Pararenal fat'], { explanation: 'Slide 7.' }),
  mcq('q1-13', 'kidney-coverings', 'The fibrous renal capsule becomes adherent in:', 'Inflammation such as pyelonephritis', ['Normal, healthy kidneys', 'Nephroptosis (floating kidney)', 'Normal pregnancy'], { explanation: 'Slide 7.' }),
  mcq('q1-14', 'kidney-coverings', 'Laterally, the renal fascia is attached to the:', 'Transversalis fascia', ['Adventitia of the aorta', 'Undersurface of the diaphragm', 'Iliac fascia'], { explanation: 'Slide 9.' }),
  mcq('q1-15', 'kidney-relations', 'Which organ might be accidentally opened during a right nephrectomy?', 'Second part of the duodenum', ['Spleen', 'Body of the stomach', 'Tail of the pancreas'], { explanation: 'Slide 13.', skill: 'application' }),
  mcq('q1-16', 'kidney-relations', 'Which ribs lie behind the left kidney?', '11th and 12th', ['12th only', '10th and 11th', '9th to 12th'], { explanation: 'Slide 15.' }),
  mcq('q1-17', 'kidney-relations', 'Which muscle is a posterior relation of the kidney?', 'Quadratus lumborum', ['Rectus abdominis', 'External oblique muscle', 'Iliacus'], { explanation: 'Slide 15.' }),
  multi('q1-18', 'urinary-overview', 'Select the functions of the kidney listed in the lecture:', ['Osmoregulation', 'Acid–base balance', 'Excretion of urea and creatinine', 'Gluconeogenesis'], ['Bile production', 'Antibody production'], { explanation: 'Slide 3.' }),
  multi('q1-19', 'kidney-relations', 'Select the nerves that lie behind the kidney:', ['Subcostal', 'Iliohypogastric', 'Ilioinguinal'], ['Femoral', 'Obturator'], { explanation: 'Slide 15.' }),
  order('q1-20', 'kidney-coverings', 'Order the coverings of the kidney from inside out:', ['Fibrous renal capsule', 'Perirenal fat', 'Renal fascia', 'Pararenal fat'], { explanation: 'Slide 7.' }),
  tf({ id: 'q1-21', conceptId: 'kidney-position', statement: 'In normal adults, the upper pole of the kidney is easily palpable.', answer: false, explanation: 'Slide 5: only the lower pole may be palpable, on deep inspiration.' }),
  ar('ar1-01', 'kidney-coverings', 'A perinephric abscess may spread into the pelvis.', 'The renal fascia has little or no attachment inferiorly.', 'explains', 'Both true (slide 10).'),
  ar('ar1-02', 'kidney-position', 'The suprarenal glands usually stay in place when the kidney is unusually mobile.', 'The suprarenal glands lie in their own fascial compartments attached to the diaphragm.', 'explains', 'Both true (slide 8).'),
  ar('ar1-03', 'kidney-position', 'The right kidney lies higher than the left.', 'The liver lies above the right kidney.', 'a-false-r-true', 'The right kidney is LOWER because of the liver (slide 4).'),
  ar('ar1-04', 'kidney-relations', 'The pleura is at risk in posterior approaches to the kidney.', 'The costodiaphragmatic recess lies behind the upper kidney.', 'explains', 'Both true (slide 15).'),
  ar('ar1-05', 'kidney-coverings', 'Perirenal fat lies outside the renal fascia.', 'Pararenal fat lies mainly posterior to the renal fascia.', 'a-false-r-true', 'Perirenal fat is INSIDE the renal fascia; pararenal fat is outside, mainly behind (slide 7).'),
];

// ─── Lesson 2: Kidney Structure, Vessels and Suprarenal Glands ───────

const lesson2: Q[] = [
  mcq('q2-01', 'kidney-internal', 'The renal columns (of Bertin) are extensions of the:', 'Cortex between the pyramids', ['Medulla extending into the cortex', 'Renal pelvis and its calyces', 'Capsule folding into the sinus'], { explanation: 'Slide 19.' }),
  mcq('q2-02', 'kidney-internal', 'The apex of a renal pyramid is the:', 'Renal papilla', ['Major calyx (cup)', 'Renal column', 'Hilum'], { explanation: 'Slide 19.' }),
  mcq('q2-03', 'kidney-internal', 'The total capacity of the renal pelvis and calyces is about:', '8 ml', ['50 ml', '1 ml', '200 ml'], { explanation: 'Slide 11.' }),
  mcq('q2-04', 'kidney-internal', 'At the hilum, from superior to inferior, the order is:', 'Artery, vein, pelvis', ['Vein, artery, pelvis', 'Pelvis, vein, artery', 'Artery, pelvis, vein'], { explanation: 'Slide 20.' }),
  mcq('q2-05', 'kidney-internal', 'Pyelolithotomy is easiest when the renal pelvis is:', 'Extrarenal', ['Buried in the parenchyma', 'Absent', 'Duplicated'], { explanation: 'Slide 12.' }),
  mcq('q2-06', 'kidney-vessels', 'What fraction of resting cardiac output do the kidneys receive?', '20–25%', ['5%', '50%', '75%'], { explanation: 'Slide 22.' }),
  mcq('q2-07', 'kidney-vessels', 'The renal arteries arise from the aorta just below the:', 'Superior mesenteric artery (L2)', ['Coeliac trunk (T12)', 'Inferior mesenteric artery (L3)', 'Aortic bifurcation'], { explanation: 'Slide 22.' }),
  mcq('q2-08', 'kidney-vessels', 'Which renal vessel passes behind the IVC?', 'Right renal artery', ['Left renal vein (in front of aorta)', 'Right renal vein', 'Left renal artery'], { explanation: 'Slide 22.' }),
  mcq('q2-09', 'kidney-vessels', 'Why is the left kidney preferred for live donor nephrectomy?', 'Its renal vein is about three times longer', ['It is larger and has more nephrons', 'It has no accessory renal arteries', 'It lies lower and is easier to reach'], { explanation: 'Slide 22.', skill: 'cause-effect' }),
  mcq('q2-10', 'kidney-vessels', 'Nutcracker syndrome is compression of the left renal vein between the:', 'Aorta and SMA', ['Aorta and IVC', 'SMA and duodenum', 'Psoas and quadratus lumborum'], { explanation: 'Slide 22.' }),
  mcq('q2-11', 'kidney-vessels', 'Accessory renal arteries occur in about:', '30% of people', ['About 1% of people', 'About 70% of people', 'Everyone (100%)'], { explanation: 'Slide 25.' }),
  mcq('q2-12', 'kidney-vessels', 'Renal transplants are placed in the:', 'Iliac fossa', ['Original renal bed', 'Pelvis behind the bladder', 'Left hypochondrium'], { explanation: 'Slide 26.' }),
  mcq('q2-13', 'kidney-nerves', 'Sympathetic stimulation of the kidney causes:', 'Vasoconstriction, reduced GFR and renin release', ['Vasodilation and a rise in GFR', 'No change in renal blood flow', 'Erythropoietin release only'], { explanation: 'Slide 27.' }),
  mcq('q2-14', 'kidney-nerves', 'Renal pain is felt mainly in the:', 'Flank and lower back (T12–L1)', ['Tip of the shoulder (C4)', 'Umbilicus only (T10)', 'Anterior thigh only (L3)'], { explanation: 'Slide 27.' }),
  mcq('q2-15', 'suprarenal-glands', 'The shape of the right suprarenal gland is:', 'Pyramidal', ['Crescentic', 'Round', 'Tubular'], { explanation: 'Slide 32.' }),
  mcq('q2-16', 'suprarenal-glands', 'The left suprarenal vein drains into the:', 'Left renal vein', ['IVC', 'Splenic vein', 'Left gonadal vein'], { explanation: 'Slide 36.' }),
  mcq('q2-17', 'suprarenal-glands', 'The superior suprarenal artery arises from the:', 'Inferior phrenic artery', ['Renal artery', 'Abdominal aorta directly', 'Coeliac trunk'], { explanation: 'Slide 36.' }),
  mcq('q2-18', 'suprarenal-glands', 'Which statement about the suprarenal medulla is correct?', 'It has no parasympathetic supply', ['It receives postganglionic sympathetic fibres', 'It is supplied by the vagus', 'It has no nerve supply'], { explanation: 'Slide 37.' }),
  match('q2-19', 'suprarenal-glands', 'Match each suprarenal artery to its source:', [['Superior', 'Inferior phrenic artery'], ['Middle', 'Abdominal aorta'], ['Inferior', 'Renal artery']], { explanation: 'Slide 36.' }),
  order('q2-20', 'kidney-internal', 'Order the urine collecting system:', ['Papillary ducts', 'Minor calyx', 'Major calyx', 'Renal pelvis'], { explanation: 'Slide 19.' }),
  fill('q2-21', 'kidney-vessels', 'The avascular plane of the kidney is the line of ____.', ['brodel', 'brödel'], { explanation: 'Slide 24.', skill: 'terminology' }),
  ar('ar2-01', 'kidney-vessels', 'An inferior polar artery can cause hydronephrosis.', 'An inferior polar artery may cross and obstruct the ureter.', 'explains', 'Both true (slide 25).'),
  ar('ar2-02', 'kidney-vessels', 'Nutcracker syndrome may cause a left varicocele.', 'The left gonadal vein drains into the left renal vein.', 'explains', 'Both true; raised left renal vein pressure backs up into the gonadal vein (slide 22).'),
  ar('ar2-03', 'kidney-vessels', 'The line of Brödel is a good site for incisions into the kidney.', 'It separates the territories of the anterior and posterior divisions of the renal artery.', 'explains', 'Both true (slide 24).'),
  ar('ar2-04', 'suprarenal-glands', 'The suprarenal glands are large at birth.', 'The fetal cortex is present at birth.', 'explains', 'Both true (slide 32).'),
  ar('ar2-05', 'kidney-internal', 'The renal pyramids lie in the cortex.', 'The renal papillae open into the minor calyces.', 'a-false-r-true', 'Pyramids form the medulla (slide 19).'),
  spotQuestion('q2-fig-renal-pyramid', 'kidney-internal', kidneyInternal, 'renal-pyramid', ['renal-columns', 'renal-papilla', 'minor-calyx']),
  spotQuestion('q2-fig-renal-columns', 'kidney-internal', kidneyInternal, 'renal-columns', ['renal-pyramid', 'cortex', 'kidney-lobe']),
  spotQuestion('q2-fig-renal-papilla', 'kidney-internal', kidneyInternal, 'renal-papilla', ['minor-calyx', 'renal-pyramid', 'major-calyx']),
  spotQuestion('q2-fig-major-calyx', 'kidney-internal', kidneyInternal, 'major-calyx', ['minor-calyx', 'renal-pelvis', 'renal-sinus']),
  spotQuestion('q2-fig-renal-pelvis', 'kidney-internal', kidneyInternal, 'renal-pelvis', ['major-calyx', 'ureter', 'hilum']),
];

// ─── Lesson 3: The Ureters ───────────────────────────────────────────

const lesson3: Q[] = [
  mcq('q3-01', 'ureter-course', 'The length of each ureter is about:', '25–30 cm', ['10 cm', '50 cm', '5 cm'], { explanation: 'Slide 38.' }),
  mcq('q3-02', 'ureter-course', 'What prevents vesicoureteric reflux?', 'The oblique course of the intravesical ureter through the bladder wall', ['A valve at the pelviureteric junction', 'The external urethral sphincter', 'The Waldeyer sheath alone, without any oblique course'], { explanation: 'Slide 38.', skill: 'cause-effect' }),
  mcq('q3-03', 'ureter-course', 'Which vein lies medial to the left ureter?', 'Inferior mesenteric vein', ['Left renal vein', 'Inferior vena cava', 'Splenic vein'], { explanation: 'Slide 39.' }),
  mcq('q3-04', 'ureter-course', 'Posteriorly, both ureters lie on the:', 'Psoas muscle', ['Quadratus lumborum', 'Iliacus', 'Transversus abdominis'], { explanation: 'Slide 39.' }),
  mcq('q3-05', 'ureter-course', 'In the male pelvis, the ureter is crossed superficially by the:', 'Vas deferens', ['Testicular artery', 'Seminal vesicle', 'Obturator nerve'], { explanation: 'Slide 41.' }),
  mcq('q3-06', 'ureter-course', 'In the female, the ureter passes beneath the:', 'Uterine artery', ['Ovarian artery only', 'Round ligament', 'Internal pudendal artery'], { explanation: 'Slide 42.' }),
  mcq('q3-07', 'ureter-course', 'A stone in the lower ureter in a woman may be felt through the:', 'Lateral fornix of the vagina', ['Rectum only', 'Anterior abdominal wall', 'Perineum'], { explanation: 'Slide 43.', skill: 'application' }),
  mcq('q3-08', 'ureter-course', 'On a plain X-ray the ureter runs along the:', 'Tips of the lumbar transverse processes', ['Bodies of the lumbar vertebrae', 'Lateral border of the psoas shadow', 'Line of the iliac crests'], { explanation: 'Slide 50.' }),
  mcq('q3-09', 'ureter-constrictions', 'The narrowest point of the ureter is the:', 'Vesicoureteric junction', ['Pelviureteric junction', 'Pelvic brim (iliac crossing)', 'Mid-abdominal ureter'], { explanation: 'Slide 44.' }),
  mcq('q3-10', 'ureter-constrictions', 'At the pelvic brim the ureter crosses the:', 'Bifurcation of the common iliac artery', ['Aortic bifurcation', 'Internal pudendal artery', 'Inferior epigastric artery'], { explanation: 'Slide 44.' }),
  mcq('q3-11', 'ureter-constrictions', 'About what percentage of urinary stones are calcium salts?', '75%', ['15%', '10%', '50%'], { explanation: 'Slide 46.' }),
  mcq('q3-12', 'ureter-constrictions', 'Breaking up stones with focused shock waves is called:', 'Lithotripsy', ['Nephrolithotomy', 'Pyeloplasty', 'Cystoscopy'], { explanation: 'Slide 46.', skill: 'terminology' }),
  mcq('q3-13', 'ureter-supply', 'The upper third of the ureter is supplied by the:', 'Renal artery', ['Gonadal artery', 'Inferior vesical artery', 'Uterine artery'], { explanation: 'Slide 48.' }),
  mcq('q3-14', 'ureter-supply', 'The pelvic ureter receives its arteries from its ____ side, so it is approached ____.', 'Lateral; medially', ['Medial; laterally', 'Posterior; anteriorly', 'Anterior; posteriorly'], { explanation: 'Slide 48.', skill: 'application' }),
  mcq('q3-15', 'ureter-supply', 'Lymph from the upper abdominal ureter drains to the:', 'Lateral aortic (para-aortic) nodes', ['Superficial inguinal nodes', 'Internal iliac nodes', 'Coeliac nodes'], { explanation: 'Slide 49.' }),
  mcq('q3-16', 'ureter-supply', 'Ureteric peristalsis is generated by:', 'Pacemaker cells in the renal pelvis and minor calyces', ['The vagus nerve', 'The pelvic splanchnic nerves', 'The pudendal nerve'], { explanation: 'Slide 52.' }),
  mcq('q3-17', 'ureter-supply', 'Ureteric colic may radiate to the anteromedial thigh through the:', 'Femoral branch of the genitofemoral nerve', ['Anterior division of the obturator nerve', 'Femoral nerve (anterior cutaneous)', 'Lateral femoral cutaneous nerve'], { explanation: 'Slide 53.' }),
  multi('q3-18', 'ureter-constrictions', 'Select the three anatomical constrictions of the ureter:', ['Pelviureteric junction', 'Pelvic brim', 'Vesicoureteric junction'], ['Hilum of the kidney', 'Internal urethral orifice'], { explanation: 'Slide 44.' }),
  match('q3-19', 'ureter-supply', 'Match each ureter segment to an artery supplying it:', [['Upper third', 'Renal artery'], ['Middle third', 'Gonadal artery'], ['Lower third', 'Superior vesical artery']], { explanation: 'Slide 48.' }),
  fill('q3-20', 'ureter-course', 'Peristalsis of the ureter when pinched at surgery is ____’s sign.', ['kelly', 'kellys', 'kelly\'s'], { explanation: 'Slide 38.', skill: 'terminology' }),
  tf({ id: 'q3-21', conceptId: 'ureter-supply', statement: 'The ureter can be divided and rejoined because its arteries form longitudinal anastomoses.', answer: true, explanation: 'Slide 48.' }),
  ar('ar3-01', 'ureter-course', 'The ureter is at risk during hysterectomy.', 'The uterine artery crosses above the ureter near the lateral vaginal fornix.', 'explains', 'Both true (slides 42–43).'),
  ar('ar3-02', 'ureter-constrictions', 'Ureteric stones often lodge at the vesicoureteric junction.', 'The vesicoureteric junction is the narrowest part of the ureter.', 'explains', 'Both true (slide 44).'),
  ar('ar3-03', 'ureter-supply', 'Ureteric pain is referred to the loin and groin.', 'Pain fibres from the ureter travel with sympathetic fibres from T11–L2.', 'explains', 'Both true (slide 53).'),
  ar('ar3-04', 'ureter-supply', 'The vagus nerve generates ureteric peristalsis.', 'The upper ureter receives parasympathetic fibres from the vagus.', 'a-false-r-true', 'Peristalsis is generated by intrinsic pacemaker cells (slide 52).'),
  ar('ar3-05', 'ureter-course', 'The ureters are intraperitoneal organs.', 'The ureters are about 25–30 cm long.', 'a-false-r-true', 'They are retroperitoneal (slide 38).'),
];

// ─── Lesson 4: The Urinary Bladder ───────────────────────────────────

const lesson4: Q[] = [
  mcq('q4-01', 'bladder-structure', 'The muscle of the bladder wall is the:', 'Detrusor', ['Levator ani', 'Cremaster', 'Puborectalis'], { explanation: 'Slide 55.' }),
  mcq('q4-02', 'bladder-structure', 'In children, the bladder is:', 'Abdominal', ['Pelvic', 'Retroperitoneal in the flank', 'Inside the perineum'], { explanation: 'Slide 55.' }),
  mcq('q4-03', 'bladder-structure', 'The apex of the bladder is attached to the:', 'Median umbilical ligament', ['Medial umbilical ligament', 'Pubovesical ligament', 'Round ligament'], { explanation: 'Slide 69.' }),
  mcq('q4-04', 'bladder-structure', 'The retropubic space lying between the pubic symphysis and the bladder is the space of:', 'Retzius', ['Morison', 'Douglas', 'Bogros'], { explanation: 'Slide 55.' }),
  mcq('q4-05', 'bladder-structure', 'In females, the superior surface of the bladder is related to the:', 'Body of the uterus', ['Sigmoid colon', 'Seminal vesicles', 'Rectum'], { explanation: 'Slide 55.' }),
  mcq('q4-06', 'bladder-structure', 'The bladder base in the male is separated from the rectum by:', 'Rectovesical (Denonvilliers’) fascia', ['Vesicovaginal septum', 'Perineal membrane', 'Transversalis fascia'], { explanation: 'Slide 57.' }),
  mcq('q4-07', 'bladder-structure', 'Why can a full bladder be catheterised suprapubically without entering the peritoneal cavity?', 'The full bladder pushes the peritoneum up off the anterior abdominal wall', ['The bladder has no peritoneum on any surface', 'The peritoneum is absent below the umbilicus', 'The needle passes through the trigone, which is extraperitoneal'], { explanation: 'Slide 58.', skill: 'cause-effect' }),
  mcq('q4-08', 'bladder-interior', 'The trigone is bounded by the two ureteric orifices and the:', 'Internal urethral orifice', ['Apex of the bladder', 'Uvula vesicae only', 'Urachus'], { explanation: 'Slide 59.' }),
  mcq('q4-09', 'bladder-interior', 'In the empty bladder the ureteric orifices are about how far apart?', '2.5 cm', ['5 cm', '10 cm', '0.5 cm'], { explanation: 'Slide 60.' }),
  mcq('q4-10', 'bladder-interior', 'The interureteric ridge is also called the:', 'Bar of Mercier', ['Uvula vesicae', 'Line of Brödel', 'Verumontanum'], { explanation: 'Slide 60.', skill: 'terminology' }),
  mcq('q4-11', 'bladder-interior', 'Bladder rugae are absent over the:', 'Trigone', ['Apex', 'Superior surface', 'Lateral walls'], { explanation: 'Slide 60.' }),
  mcq('q4-12', 'bladder-support-supply', 'Which of these is a FALSE ligament of the bladder?', 'Medial umbilical fold', ['Lateral true ligament', 'Pubovesical ligament', 'Posterior true ligament'], { explanation: 'Slide 62.' }),
  mcq('q4-13', 'bladder-support-supply', 'In females, the inferior vesical artery is replaced by the:', 'Vaginal artery', ['Uterine artery', 'Ovarian artery', 'Internal pudendal artery'], { explanation: 'Slide 64.' }),
  mcq('q4-14', 'bladder-support-supply', 'Parasympathetic stimulation of the bladder:', 'Contracts the detrusor and relaxes the internal sphincter', ['Relaxes the detrusor and contracts the internal sphincter', 'Contracts the external sphincter', 'Has no effect on the bladder'], { explanation: 'Slide 64.' }),
  mcq('q4-15', 'bladder-support-supply', 'The external urethral sphincter is supplied by the:', 'Pudendal nerve (S2–S4)', ['Pelvic splanchnic nerves', 'Hypogastric plexus', 'Obturator nerve'], { explanation: 'Slide 65.' }),
  mcq('q4-16', 'bladder-support-supply', 'In males, the internal urethral sphincter also prevents:', 'Semen entering the bladder during ejaculation', ['Urine refluxing into the ureters', 'Faecal incontinence', 'Enlargement of the prostate'], { explanation: 'Slide 65.' }),
  mcq('q4-17', 'bladder-support-supply', 'Stress incontinence after childbirth results from weakness of the:', 'External urethral sphincter', ['Detrusor muscle', 'Trigone', 'Internal sphincter only'], { explanation: 'Slide 65.' }),
  multi('q4-18', 'bladder-support-supply', 'Select the TRUE ligaments of the bladder:', ['Lateral true ligaments', 'Pubovesical ligaments', 'Posterior true ligaments'], ['Median umbilical fold', 'Medial umbilical folds'], { explanation: 'Slide 62.' }),
  match('q4-19', 'bladder-structure', 'Match each bladder surface to its relation (male):', [['Superior surface', 'Sigmoid colon (peritoneum)'], ['Base', 'Seminal vesicles'], ['Neck', 'Prostate'], ['Anterior surface', 'Pubic symphysis']], { explanation: 'Slides 55, 57.' }),
  fill('q4-20', 'bladder-structure', 'The normal adult bladder holds about 400–____ ml.', ['600'], { explanation: 'Slide 58.' }),
  tf({ id: 'q4-21', conceptId: 'bladder-interior', statement: 'The trigone is a common site of infection.', answer: true, explanation: 'Slide 59.' }),
  ar('ar4-01', 'bladder-interior', 'The trigone signals the need to micturate.', 'The trigone contains stretch receptors.', 'explains', 'Both true (slide 60).'),
  ar('ar4-02', 'bladder-interior', 'The bladder can expand greatly as it fills.', 'Its mucosa is thrown into rugae except over the trigone.', 'explains', 'Both true; rugae unfold as it fills (slide 60).'),
  ar('ar4-03', 'bladder-support-supply', 'False ligaments of the bladder give strong support.', 'False ligaments are peritoneal folds.', 'a-false-r-true', 'They are peritoneal folds without a supporting function (slide 62).'),
  ar('ar4-04', 'bladder-support-supply', 'Sympathetic stimulation helps the bladder fill.', 'Sympathetic fibres relax the detrusor and contract the internal sphincter.', 'explains', 'Both true (slide 64).'),
  ar('ar4-05', 'bladder-interior', 'The uvula vesicae may enlarge in benign prostatic hyperplasia.', 'The uvula vesicae is produced by the median lobe of the prostate.', 'explains', 'Both true (slide 61).'),
];

// ─── Lesson 5: The Urethra ───────────────────────────────────────────

const lesson5: Q[] = [
  mcq('q5-01', 'female-urethra', 'The female urethra is about how long?', '3–4 cm', ['10 cm', '15 cm', '1 cm'], { explanation: 'Slide 70.' }),
  mcq('q5-02', 'female-urethra', 'The female urethra opens into the vestibule:', 'In front of the vagina and behind the clitoris', ['Behind the vaginal orifice', 'In front of the clitoris', 'Into the vagina itself'], { explanation: 'Slide 70.' }),
  mcq('q5-03', 'female-urethra', 'The para-urethral glands are also called:', 'Skene’s glands', ['Cowper’s glands', 'Bartholin’s glands', 'Littre’s glands'], { explanation: 'Slide 70.', skill: 'terminology' }),
  mcq('q5-04', 'female-urethra', 'Urinary tract infections are commoner in women mainly because the urethra is:', 'Short and distensible', ['Long and narrow', 'Lined by squamous epithelium only', 'Without a sphincter'], { explanation: 'Slide 70.', skill: 'cause-effect' }),
  mcq('q5-05', 'male-urethra', 'The widest and most dilatable part of the male urethra is the:', 'Prostatic urethra', ['Membranous urethra', 'Spongy urethra', 'External meatus'], { explanation: 'Slide 71.' }),
  mcq('q5-06', 'male-urethra', 'The membranous urethra passes through the:', 'Urogenital diaphragm', ['Prostate', 'Corpus spongiosum', 'Bladder neck'], { explanation: 'Slide 71.' }),
  mcq('q5-07', 'male-urethra', 'Which part of the male urethra is most liable to injury during catheterisation?', 'Membranous', ['Prostatic', 'Spongy', 'Bladder neck'], { explanation: 'Slide 71.', skill: 'application' }),
  mcq('q5-08', 'male-urethra', 'The ducts of Cowper’s (bulbourethral) glands open into the:', 'Spongy urethra', ['Prostatic urethra', 'Membranous urethra', 'Bladder'], { explanation: 'Slide 71.' }),
  mcq('q5-09', 'male-urethra', 'The spongy urethra is about how long?', '15 cm', ['3 cm', '2 cm', '30 cm'], { explanation: 'Slide 71.' }),
  mcq('q5-10', 'male-urethra', 'The prostatic utricle is a remnant of the:', 'Paramesonephric ducts', ['Mesonephric ducts', 'Urachus', 'Allantois'], { explanation: 'Slide 72.' }),
  mcq('q5-11', 'male-urethra', 'The prostatic ducts open into the:', 'Prostatic sinuses beside the urethral crest', ['Seminal colliculus', 'Membranous urethra', 'Bladder trigone'], { explanation: 'Slide 72.' }),
  mcq('q5-12', 'male-urethra', 'In TURP, resection distal to which landmark may cause incontinence?', 'Verumontanum (seminal colliculus)', ['Trigone', 'Uvula vesicae', 'Interureteric ridge'], { explanation: 'Slide 72.', skill: 'application' }),
  mcq('q5-13', 'urethra-supply-incontinence', 'The female urethra is supplied mainly by the:', 'Vaginal arteries', ['Inferior vesical arteries', 'Ovarian arteries', 'Superior rectal arteries'], { explanation: 'Slide 77.' }),
  mcq('q5-14', 'urethra-supply-incontinence', 'The membranous urethra is supplied by the:', 'Bulbourethral artery', ['Inferior vesical artery', 'Dorsal artery of the penis', 'Testicular artery'], { explanation: 'Slide 77.' }),
  mcq('q5-15', 'urethra-supply-incontinence', 'The distal female urethra drains lymph to the:', 'Superficial inguinal nodes', ['Internal iliac nodes', 'Para-aortic nodes', 'Coeliac nodes'], { explanation: 'Slide 78.' }),
  mcq('q5-16', 'urethra-supply-incontinence', 'Voluntary bladder control normally develops at about:', '3–6 years', ['6 months', '1 year', '10 years'], { explanation: 'Slide 75.' }),
  mcq('q5-17', 'urethra-supply-incontinence', 'Somatic innervation of the urethra in both sexes is from the:', 'Pudendal nerve (S2–S4)', ['Genitofemoral nerve (L1, L2)', 'Ilioinguinal nerve (L1)', 'Obturator nerve (L2–L4)'], { explanation: 'Slide 79.' }),
  multi('q5-18', 'male-urethra', 'Select the structures that open into the prostatic urethra:', ['Ejaculatory ducts', 'Prostatic ducts', 'Prostatic utricle'], ['Bulbourethral gland ducts', 'Ureters'], { explanation: 'Slides 71–72.' }),
  match('q5-19', 'male-urethra', 'Match each part of the male urethra to a feature:', [['Prostatic', 'Widest and most dilatable'], ['Membranous', 'Surrounded by the external sphincter'], ['Spongy', 'Runs in the corpus spongiosum']], { explanation: 'Slide 71.' }),
  order('q5-20', 'male-urethra', 'Order the parts of the male urethra from bladder to meatus:', ['Prostatic urethra', 'Membranous urethra', 'Spongy (penile) urethra'], { explanation: 'Slide 71.' }),
  tf({ id: 'q5-21', conceptId: 'female-urethra', statement: 'Catheterisation is easier in women because the urethra is short.', answer: true, explanation: 'Slide 70.' }),
  ar('ar5-01', 'urethra-supply-incontinence', 'Infants cannot voluntarily control micturition.', 'Their corticospinal tracts to the external sphincter are not fully myelinated.', 'explains', 'Both true (slide 75).'),
  ar('ar5-02', 'male-urethra', 'The membranous urethra is easily injured in catheterisation.', 'The membranous urethra is the narrowest and least dilatable part.', 'explains', 'Both true (slide 71).'),
  ar('ar5-03', 'male-urethra', 'The prostatic urethra is the narrowest part of the male urethra.', 'The prostatic urethra receives the ejaculatory ducts.', 'a-false-r-true', 'It is the widest; it does receive the ejaculatory ducts (slide 71).'),
  ar('ar5-04', 'urethra-supply-incontinence', 'The spongy urethra drains to the internal iliac nodes only.', 'The prostatic urethra drains to the internal iliac nodes.', 'a-false-r-true', 'The spongy urethra drains to inguinal nodes (slide 78).'),
  ar('ar5-05', 'female-urethra', 'UTIs are more common in women.', 'The female urethra is short.', 'explains', 'Both true (slide 70).'),
];

export const questions: Q[] = [...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5];
