// Anatomy → Cardiovascular System (gross): each lesson's interactive layer.
import { ask, learn, match, mcq, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { c1, c2, TOPIC_ID, type ConceptId } from '@/data/topics/cardiovascular-system-gross/sources';

type Steps = InteractiveDraft<ConceptId>[];
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const interactive: Record<string, Steps> = {
  [L(1)]: [
    learn('Heart, vessels and lymphatics', [
      'The cardiovascular system is the heart plus the blood vessels. Add the lymphatic system (lymph vessels and nodes) and you have the circulatory system.',
      'Lymph is tissue fluid returned to the venous blood; lymph nodes along the way clean it first.',
    ], { sourceRefs: c1([6, 7, 9]) }),
    ask(mcq('i1-01', 'mediastinum-divisions', 'Which plane separates the superior from the inferior mediastinum?', 'From the sternal angle back to the lower border of the body of T4', ['From the xiphisternal joint back to the body of T10', 'From the jugular notch back to the lower border of T2', 'Along the upper surface of the diaphragm to T12'], { explanation: 'Slide 19: a slightly oblique plane from the sternal angle to the lower part of the body of T4 divides the mediastinum.' })),
    learn('Three parts below the plane', [
      'The pericardium is the landmark: in front of it is the anterior mediastinum, the pericardium and heart are the middle mediastinum, and behind it is the posterior mediastinum.',
    ], { sourceRefs: c1([22]) }),
    ask(match('i1-02', 'inferior-mediastinum-contents', 'Match each structure to the division of the mediastinum it lies in:', [
      ['Ascending aorta', 'Middle mediastinum'],
      ['Descending thoracic aorta', 'Posterior mediastinum'],
      ['Arch of the aorta', 'Superior mediastinum'],
      ['Branches of the internal thoracic artery and areolar tissue', 'Anterior mediastinum'],
    ], { explanation: 'Slides 25, 32, 34, 38.' })),
    ask(mcq('i1-03', 'superior-mediastinum', 'Why does the superior mediastinum contain the left common carotid artery but not the right?', 'The right common carotid arises from the brachiocephalic trunk in the root of the neck', ['The right common carotid arises from the ascending aorta inside the pericardium', 'The right common carotid is absent in most people and replaced by the vertebral', 'The right common carotid runs down into the posterior mediastinum instead'], { explanation: 'Slide 25 asks this: the arch gives only the brachiocephalic trunk, left common carotid and left subclavian; the right common carotid comes off the brachiocephalic trunk.', skill: 'cause-effect' })),
    recall('r1-01', 'inferior-mediastinum-contents', 'List the contents of the posterior mediastinum.', [
      'Descending thoracic aorta.',
      'Azygos and the two hemiazygos veins.',
      'Vagus and splanchnic nerves, and the sympathetic trunk.',
      'Oesophagus, thoracic duct and lymph nodes.',
    ], c1([38])),
  ],

  [L(2)]: [
    ask(mcq('i2-01', 'pericardium-layers', 'Which layer of the pericardium forms the epicardium of the heart?', 'Visceral layer of serous pericardium', ['Parietal layer of serous pericardium', 'Fibrous pericardium', 'Mediastinal pleura'], { explanation: 'Slide 58: the visceral layer forms the epicardium and reflects around the vessels to become the parietal layer.' })),
    learn('A tough sac with a slippery lining', [
      'The fibrous pericardium fuses with the great vessels above and the central tendon of the diaphragm below, and resists sudden stretching.',
      'Inside it, the serous pericardium is a closed sac: parietal layer outside, visceral layer (epicardium) on the heart, with the potential pericardial cavity between.',
    ], { sourceRefs: c1([47, 49, 58]) }),
    ask(match('i2-02', 'pericardial-sinuses', 'Match each sinus to the reflection that forms it:', [
      ['Oblique sinus', 'Reflection around the venae cavae and pulmonary veins'],
      ['Transverse sinus', 'Reflection around the ascending aorta and pulmonary trunk'],
    ], { explanation: 'Slide 60.' })),
    learn('Why pericarditis hurts', [
      'The fibrous pericardium and parietal serous layer are supplied by the phrenic nerve, so they feel pain. The visceral layer is insensitive.',
      'Fluid in the cavity cannot stretch the fibrous sac quickly, so it compresses the heart: cardiac tamponade.',
    ], { sourceRefs: c1([64, 67]) }),
    ask(mcq('i2-03', 'pericardium-supply-clinical', 'A patient with pericarditis has sharp chest pain. Which nerve carries this pain?', 'Phrenic nerve', ['Vagus nerve', 'Intercostal nerves only', 'Greater splanchnic nerve'], { explanation: 'Slide 64: the fibrous and parietal pericardium are supplied by the phrenic nerve.', skill: 'application' })),
    recall('r2-01', 'pericardial-relations', 'Describe the relations of the pericardial sac in front, behind and at the sides.', [
      'In front: the sternum, separated by the anterior mediastinum (sternopericardial ligaments).',
      'Behind: the posterior mediastinum — oesophagus, descending aorta, azygos/hemiazygos veins, vagus, splanchnic nerves, sympathetic trunk.',
      'Laterally: mediastinal pleura and lungs, with the phrenic nerves and pericardiacophrenic vessels.',
    ], c1([52, 53])),
  ],

  [L(3)]: [
    learn('Size and lie of the heart', [
      'About 12 cm from base to apex, 8–9 cm across and 300 g. It lies obliquely with only a third to the right of the midline.',
    ], { sourceRefs: c1([72, 74]) }),
    ask(match('i3-01', 'heart-borders-surfaces', 'Match each border or surface with the chamber that mainly forms it:', [
      ['Right border', 'Right atrium'],
      ['Left border', 'Left ventricle'],
      ['Sternocostal surface', 'Right ventricle'],
      ['Base (posterior surface)', 'Left atrium'],
    ], { explanation: 'Slides 81–84.' })),
    ask(mcq('i3-02', 'heart-surface-marking', 'Where is the normal apex beat felt?', 'Left 5th intercostal space, about 8–9 cm from the midline', ['Right 2nd intercostal space at the edge of the sternum', 'Left 2nd costal cartilage, 2 cm from the sternum', 'Left 7th intercostal space in the anterior axillary line'], { explanation: 'Slide 108: the apex lies behind the 5th left intercostal space, 8–9 cm from the mid-sternal line.', skill: 'application' })),
    learn('Three layers, four chambers', [
      'Epicardium (visceral pericardium), myocardium (thickest in the left ventricle) and endocardium (continuous with vessel endothelium, forms parts of the valves).',
      'The coronary (AV) sulcus marks atria from ventricles; the anterior and posterior interventricular sulci mark the two ventricles.',
    ], { sourceRefs: c1([90, 91, 101]) }),
    ask(order('i3-03', 'cardiac-wall-grooves', 'Order the layers of the cardiac wall from outside to inside:', ['Epicardium', 'Myocardium', 'Endocardium'], { explanation: 'Slides 90–92.' })),
    recall('r3-01', 'heart-surface-marking', 'Give the surface marking of the right, inferior and left borders of the heart.', [
      'Right border: right 3rd to right 6th costal cartilage, just beyond the sternal edge.',
      'Inferior border: right 6th costal cartilage to the apex in the left 5th intercostal space.',
      'Left border: apex upward to the left 2nd costal cartilage, about 2 cm from the sternal margin.',
    ], c1([87])),
  ],

  [L(4)]: [
    ask(mcq('i4-01', 'right-atrium', 'Which ridge separates the smooth and rough parts of the right atrium?', 'Crista terminalis', ['Limbus fossae ovalis', 'Moderator band', 'Interventricular septum'], { explanation: 'Slide 112: crista terminalis inside, sulcus terminalis outside.' })),
    learn('Inside the right heart', [
      'The right atrium receives the SVC, IVC and coronary sinus. The fossa ovalis is the remnant of the foramen ovale.',
      'The right ventricle is crescentic on section and leads into the smooth conus arteriosus, the start of the pulmonary trunk.',
    ], { sourceRefs: c1([111, 112, 118]) }),
    ask(mcq('i4-02', 'right-ventricle', 'Which part of the right ventricle has no trabeculae carneae?', 'Conus arteriosus', ['Apex', 'Diaphragmatic wall', 'Septal wall'], { explanation: 'Slide 123: trabeculae project from the whole inner surface except the conus arteriosus.' })),
    learn('The thicker left side', [
      'The left atrium receives four valveless pulmonary veins. The left ventricle forms the apex and its wall is about three times thicker than the right.',
      'Fibrous rings — stronger on the left — anchor the valves and the cardiac muscle.',
    ], { sourceRefs: c1([132, 134, 140]) }),
    ask(match('i4-03', 'valves-auscultation', 'Match each valve to its auscultation area:', [
      ['Aortic', 'Right 2nd intercostal space near the sternum'],
      ['Pulmonary', 'Left 2nd intercostal space near the sternum'],
      ['Mitral', 'Left 5th intercostal space near the midclavicular line'],
    ], { explanation: 'Slide 149.' })),
    recall('r4-01', 'right-ventricle', 'Name the three varieties of trabeculae carneae.', [
      'Ridges attached along their whole length on one side.',
      'Bridges fixed at both ends but free in the middle (e.g. the moderator band).',
      'Papillary muscles, attached by their bases, whose apices give rise to the chordae tendineae.',
    ], c1([125])),
  ],

  [L(5)]: [
    ask(order('i5-01', 'conduction-system', 'Put the parts of the conduction system in the order the impulse travels:', ['SA node', 'AV node', 'AV bundle (of His)', 'Right and left bundle branches', 'Purkinje fibres'], { explanation: 'Slides 153–155.' })),
    learn('Where each part sits', [
      'SA node: posterior wall of the right atrium (70–80/min). AV node: inferior interatrial septum. Bundle of His: membranous interventricular septum, dividing in the muscular septum.',
    ], { sourceRefs: c1([154, 155]) }),
    ask(match('i5-02', 'left-coronary', 'Match each artery to the coronary artery it branches from (usual pattern):', [
      ['Conus artery', 'Right coronary artery'],
      ['Right marginal artery', 'Right coronary artery'],
      ['Obtuse marginal artery', 'Left coronary artery'],
      ['Diagonal artery', 'Left coronary artery'],
    ], { explanation: 'Slides 161, 168.' })),
    learn('Draining the heart', [
      'Most veins join the coronary sinus: great, middle and small cardiac veins, the posterior vein of the left ventricle and the oblique vein of the left atrium.',
      'The anterior cardiac veins, venae cordis minimae and right marginal vein open directly into the right atrium.',
    ], { sourceRefs: c1([174, 178]) }),
    ask(mcq('i5-03', 'right-coronary', 'In about 10% of hearts, the posterior interventricular artery comes from which vessel?', 'Circumflex branch of the left coronary artery', ['Right marginal branch of the right coronary artery', 'Anterior interventricular branch of the left coronary', 'Conus branch of the right coronary artery'], { explanation: 'Slide 168: when the right coronary is short, the circumflex continues as the posterior interventricular artery.', skill: 'recall' })),
    recall('r5-01', 'cardiac-veins', 'Name the five tributaries of the coronary sinus.', [
      'Great cardiac vein.',
      'Middle cardiac vein.',
      'Small cardiac vein.',
      'Posterior vein of the left ventricle.',
      'Oblique vein of the left atrium.',
    ], c1([174])),
  ],

  [L(6)]: [
    learn('Out and back', [
      'Heart → arteries → arterioles → capillaries → venules → veins → heart. There are three circulations: pulmonary, systemic (caval) and portal.',
    ], { sourceRefs: c2([3, 4]) }),
    ask(mcq('i6-01', 'vessel-wall-arteries', 'Why is the aorta called an elastic artery?', 'Its wall has a very thick elastic layer that recoils during diastole', ['Its wall is mainly smooth muscle that contracts with each beat', 'It has no tunica adventitia, so it stretches freely', 'It contains valves along its length that close in diastole'], { explanation: 'Slide 6: the thick elastic lamina produces elastic recoil during diastole.', skill: 'cause-effect' })),
    ask(match('i6-02', 'capillaries', 'Match each capillary type to a place it is found:', [
      ['Continuous', 'Central nervous system'],
      ['Fenestrated', 'Kidney'],
      ['Sinusoid (discontinuous)', 'Liver'],
    ], { explanation: 'Slides 15–16.' })),
    learn('Controlling flow', [
      'Capillaries are a single layer of endothelium. Flow into a bed is set by pre-capillary sphincters plus the resistance of small arteries and arterioles.',
    ], { sourceRefs: c2([13]) }),
    ask(mcq('i6-03', 'veins', 'Which feature is typical of veins but not of arteries?', 'Valves that prevent reflux', ['A thick elastic lamina', 'A thick muscular tunica media', 'A narrower lumen'], { explanation: 'Slides 18–19: veins have thin walls, wide lumens, no elastic lamina and often valves.' })),
    recall('r6-01', 'capillaries', 'Describe the three types of capillary and where each is found.', [
      'Continuous: cells closely joined — muscle, lung, adipose tissue, CNS (no intercellular channels in the CNS: blood–brain barrier).',
      'Fenestrated: pores — kidneys, intestines, endocrine glands.',
      'Discontinuous (sinusoids): wide gaps — liver, bone marrow, adrenal medulla, spleen.',
    ], c2([15, 16])),
  ],

  [L(7)]: [
    ask(order('i7-01', 'ascending-aorta-arch', 'Order the parts of the aorta from the heart downward:', ['Ascending aorta', 'Arch of the aorta', 'Thoracic (descending) aorta', 'Abdominal aorta'], { explanation: 'Slide 27.' })),
    learn('The arch and its branches', [
      'The arch runs from the sternal angle to the left side of T4 and gives the brachiocephalic trunk, left common carotid and left subclavian arteries.',
      'The coronary arteries come from the aortic sinus of the ascending aorta.',
    ], { sourceRefs: c2([28, 32]) }),
    ask(mcq('i7-02', 'pulmonary-trunk', 'What connects the left pulmonary artery to the arch of the aorta?', 'Ligamentum arteriosum', ['Ligamentum venosum', 'Ligamentum teres', 'Median arcuate ligament'], { explanation: 'Slide 36.' })),
    learn('Down the trunk', [
      'Thoracic aorta (T4–T12): bronchial, oesophageal, mediastinal, posterior intercostal (3–11) and subcostal branches.',
      'Abdominal aorta (T12–L4): ventral coeliac, SMA, IMA, median sacral; paired inferior phrenic, middle suprarenal, renal, gonadal, lumbar; terminal common iliacs.',
    ], { sourceRefs: c2([46, 47, 51, 52]) }),
    ask(match('i7-03', 'mesenteric-arteries', 'Match each artery to its level of origin:', [
      ['Superior mesenteric artery', 'Lower border of L1'],
      ['Inferior mesenteric artery', 'L3, at the level of the umbilicus'],
      ['Aortic bifurcation', 'Slightly left of L4'],
    ], { explanation: 'Slides 51, 58, 62.' })),
    recall('r7-01', 'abdominal-aorta', 'List the ventral and lateral branches of the abdominal aorta.', [
      'Ventral: coeliac trunk, superior mesenteric, inferior mesenteric, median sacral.',
      'Lateral (paired): inferior phrenic, middle suprarenal, renal, gonadal, lumbar.',
      'Terminal: the common iliac arteries.',
    ], c2([51, 52])),
  ],
};
