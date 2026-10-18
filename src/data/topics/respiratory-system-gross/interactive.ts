// Anatomy → Respiratory System (gross): each lesson's interactive layer.
import { ask, learn, match, mcq, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { rs, TOPIC_ID, type ConceptId } from '@/data/topics/respiratory-system-gross/sources';

type Steps = InteractiveDraft<ConceptId>[];
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const interactive: Record<string, Steps> = {
  [L(1)]: [
    learn('Two ways to divide the airway', [
      'Function: a conducting division (nasal cavity to bronchioles) and a respiratory division (lungs/alveoli).',
      'Clinically: an upper tract (nasal cavity, pharynx, larynx, trachea) and a lower tract (bronchi, bronchioles, lungs).',
    ], { sourceRefs: rs([16, 17]) }),
    ask(mcq('i1-01', 'nasal-cavity-resp', 'Which bones form the bony (posterior) half of the nasal septum?', 'Vomer and perpendicular plate of the ethmoid', ['Nasal bones and maxilla', 'Palatine bones and sphenoid', 'Inferior conchae'], { explanation: 'Slide 24.' })),
    ask(order('i1-02', 'pharynx-parts', 'Order the parts of the pharynx from above downward:', ['Nasopharynx', 'Oropharynx', 'Laryngopharynx'], { explanation: 'Slide 30.' })),
    learn('Landmarks of each part', [
      'Nasopharynx ends at the soft palate (C1) and has the auditory tube opening. Oropharynx ends at the epiglottis (C3) and holds the palatine tonsil. Laryngopharynx ends at the lower border of the cricoid (C6) and has the laryngeal inlet with piriform recesses.',
    ], { sourceRefs: rs([37, 40, 42]) }),
    ask(match('i1-03', 'waldeyer-ring', 'Match each tonsil of Waldeyer’s ring to its site:', [
      ['Adenoid (pharyngeal tonsil)', 'Nasopharynx'],
      ['Tubal tonsil', 'Around the auditory tube opening'],
      ['Palatine tonsil', 'Between the palatine arches'],
      ['Lingual tonsil', 'Posterior part of the tongue'],
    ], { explanation: 'Slides 37, 40, 44.' })),
    recall('r1-01', 'pharynx-parts', 'Name the muscles of the pharyngeal wall.', [
      'Three constrictors: superior, middle and inferior.',
      'Supplemented by stylopharyngeus, palatopharyngeus and salpingopharyngeus.',
    ], rs([32])),
  ],

  [L(2)]: [
    ask(mcq('i2-01', 'larynx-position', 'The adult larynx corresponds to which vertebral levels?', 'C4–C6', ['C1–C3', 'C7–T2', 'T2–T4'], { explanation: 'Slide 57.' })),
    learn('Puberty changes', [
      'Before puberty the larynx is similar in both sexes. In males it then enlarges greatly: the thyroid cartilage becomes prominent and the rima glottidis nearly doubles in length.',
    ], { sourceRefs: rs([59]) }),
    ask(match('i2-02', 'larynx-cartilages-resp', 'Classify each laryngeal cartilage:', [
      ['Thyroid', 'Single'],
      ['Epiglottis', 'Single'],
      ['Arytenoid', 'Paired'],
      ['Cuneiform', 'Paired'],
    ], { explanation: 'Slide 62.' })),
    learn('Inside vs outside', [
      'Intrinsic membranes and ligaments: quadrangular membrane, cricothyroid and thyroepiglottic ligaments. Extrinsic: thyrohyoid membrane, cricotracheal and hyoepiglottic ligaments.',
    ], { sourceRefs: rs([65]) }),
    ask(mcq('i2-03', 'laryngeal-aditus', 'What forms the lateral boundary of the laryngeal inlet?', 'The aryepiglottic fold', ['The vocal fold', 'The thyrohyoid membrane', 'The piriform recess'], { explanation: 'Slide 86.' })),
    recall('r2-01', 'laryngeal-aditus', 'Give the boundaries of the laryngeal aditus.', [
      'Anterior: the epiglottis.',
      'Posterior: apices of the arytenoids, corniculate cartilages and interarytenoid notch.',
      'Lateral: the aryepiglottic folds containing the cuneiform tubercles.',
    ], rs([86])),
  ],

  [L(3)]: [
    ask(mcq('i3-01', 'trachea-extent', 'At what level does the trachea divide at the carina?', 'Upper border of T5', ['C6', 'T2', 'T8'], { explanation: 'Slide 98.' })),
    learn('Neck relations', [
      'In front: thyroid isthmus, inferior thyroid veins, thyroidea ima artery, strap muscles. At the sides: common carotids, thyroid lobes, inferior thyroid arteries, recurrent laryngeal nerves. Behind: oesophagus.',
    ], { sourceRefs: rs([101, 102]) }),
    ask(match('i3-02', 'trachea-thorax-relations', 'Match each structure to its side of the thoracic trachea:', [
      ['Right vagus', 'Right'],
      ['Left recurrent laryngeal nerve', 'Left'],
      ['Left brachiocephalic vein', 'Anterior'],
    ], { explanation: 'Slides 104–105.' })),
    learn('Supply', [
      'Arteries: inferior thyroid and bronchial. Veins: inferior thyroid. Lymph: pre- and paratracheal and inferior deep cervical nodes. Mucosa: vagus/recurrent laryngeal; muscle and vessels: upper sympathetic ganglia.',
    ], { sourceRefs: rs([106, 109, 111]) }),
    ask(mcq('i3-03', 'trachea-neck-relations', 'Which structure lies directly behind the trachea in the neck?', 'Oesophagus', ['Thyroid isthmus', 'Common carotid artery', 'Sternohyoid'], { explanation: 'Slide 102.' })),
    recall('r3-01', 'trachea-extent', 'State the extent and dimensions of the trachea.', [
      'From the lower larynx at C6 to the upper border of T5, where it divides at the carina.',
      'About 10 cm long and 2–2.5 cm wide; larger in males.',
    ], rs([98])),
  ],

  [L(4)]: [
    learn('What makes the wall', [
      'Vertebrae and discs behind, sternum and costal cartilages in front, ribs and intercostal spaces at the sides, suprapleural membrane above and diaphragm below.',
    ], { sourceRefs: rs([132]) }),
    ask(order('i4-01', 'thoracic-muscles', 'Order the intercostal muscle layers from superficial to deep:', ['External intercostal', 'Internal intercostal', 'Innermost intercostal (inner layer)'], { explanation: 'Slides 144, 159.' })),
    ask(mcq('i4-02', 'thoracic-apertures', 'Which is NOT a boundary of the thoracic inlet?', 'Xiphoid process', ['T1 vertebra', 'First ribs and costal cartilages', 'Superior border of the manubrium'], { explanation: 'Slide 167.' })),
    learn('The neurovascular plane', [
      'Vein, artery and nerve run between the internal and innermost intercostals under the lower border of each rib — so a pleural drain goes in just above a rib.',
    ], { sourceRefs: rs([199]) }),
    ask(mcq('i4-03', 'intercostal-space-joints', 'Why is a pleural drainage needle inserted just above a rib?', 'To avoid the intercostal vessels and nerve running along the lower border of the rib above', ['Because the pleura is thinnest there', 'To enter the costodiaphragmatic recess', 'Because the rib protects the lung'], { explanation: 'Slide 199.', skill: 'application' })),
    recall('r4-01', 'thoracic-muscles', 'Compare serratus posterior superior and inferior.', [
      'Superior: from spines C6–T2 to ribs 2–5; elevates the upper ribs (inspiration).',
      'Inferior: from spines T11–L2 to the lowest four ribs; depresses the lower ribs (expiration).',
      'Both are weak muscles of respiration supplied by anterior rami.',
    ], rs([148, 151, 153, 155])),
  ],

  [L(5)]: [
    ask(match('i5-01', 'diaphragm-openings', 'Match each diaphragmatic opening to its vertebral level:', [
      ['Vena caval foramen', 'T8'],
      ['Oesophageal hiatus', 'T10'],
      ['Aortic hiatus', 'T12'],
    ], { explanation: 'Slide 183.' })),
    learn('What goes through', [
      'T8: IVC and right phrenic branches. T10: oesophagus, vagus nerves, oesophageal arteries. T12: aorta, azygos vein, thoracic duct.',
    ], { sourceRefs: rs([183]) }),
    ask(mcq('i5-02', 'diaphragm-parts', 'The lateral arcuate ligament arches over which muscle?', 'Quadratus lumborum', ['Psoas major', 'Transversus abdominis', 'Iliacus'], { explanation: 'Slide 180.' })),
    learn('C3, 4, 5', [
      'The phrenic nerves (C3–C5) are the motor supply. Diaphragmatic irritation is referred to the shoulder through C4.',
    ], { sourceRefs: rs([188, 198]) }),
    ask(mcq('i5-03', 'diaphragm-development-clinical', 'A newborn has bowel in the left chest through a posterolateral defect. Which embryonic structure failed?', 'Pleuroperitoneal membrane', ['Septum transversum', 'Cervical myotomes', 'Dorsal mesentery'], { explanation: 'Slide 195: Bochdalek hernia.', skill: 'application' })),
    recall('r5-01', 'diaphragm-development-clinical', 'Name the four embryological sources of the diaphragm.', [
      'Septum transversum (central tendon).',
      'Pleuroperitoneal membranes.',
      'Dorsal (oesophageal) mesentery.',
      'Cervical myotomes C3–C5.',
    ], rs([195])),
  ],

  [L(6)]: [
    learn('Two layers, one potential space', [
      'Visceral pleura covers the lung; parietal pleura lines the wall, mediastinum, diaphragm and cupola. They meet at the lung root.',
    ], { sourceRefs: rs([232, 233]) }),
    ask(mcq('i6-01', 'pleura-layers', 'Which is NOT a part of the parietal pleura?', 'Pulmonary pleura', ['Costal pleura', 'Diaphragmatic pleura', 'Cervical pleura'], { explanation: 'Slide 233: costal, mediastinal, diaphragmatic and cervical.' })),
    ask(match('i6-02', 'pleural-reflections', 'Match each landmark to the rib or cartilage where the pleural reflection crosses it:', [
      ['Pleurae meet behind the sternum', '2nd costal cartilage'],
      ['Midclavicular line', '8th rib'],
      ['Midaxillary line', '10th rib'],
    ], { explanation: 'Slides 240–242.' })),
    learn('Where fluid collects', [
      'Below the lung edge, costal and diaphragmatic pleura are separated only by the costodiaphragmatic recess — the site for thoracocentesis.',
    ], { sourceRefs: rs([247]) }),
    ask(mcq('i6-03', 'pleural-recesses-lines', 'Where does a pleural effusion collect in the upright patient?', 'Costodiaphragmatic recess', ['Cupola', 'Cardiac notch', 'Oblique fissure'], { explanation: 'Slide 247.', skill: 'application' })),
    recall('r6-01', 'pleural-reflections', 'Trace the surface marking of the pleura from the cupola to T12.', [
      'Cupola 2.5 cm above the clavicle.',
      'Meets the other pleura at the 2nd costal cartilage; left diverges at the 4th.',
      'Turns laterally at the 6th, crosses the MCL at the 8th rib, MAL at the 10th rib, and the 12th rib to T12.',
    ], rs([240, 242])),
  ],

  [L(7)]: [
    ask(mcq('i7-01', 'main-bronchi', 'An inhaled peanut usually lodges in the right main bronchus because it is:', 'Wider, shorter and more vertical', ['Narrower and longer', 'More horizontal', 'Lined by cilia'], { explanation: 'Slide 207 (and Gray’s).', skill: 'application' })),
    learn('Fissures and lobes', [
      'Right lung: oblique and horizontal fissures, three lobes. Left lung: oblique fissure only, two lobes and a lingula.',
    ], { sourceRefs: rs([273]) }),
    ask(match('i7-02', 'bronchopulmonary-segments', 'Match each lobe to its number of segmental bronchi:', [
      ['Right upper lobe', '3'],
      ['Right middle lobe', '2'],
      ['Left upper lobe', '5'],
    ], { explanation: 'Slide 224.' })),
    learn('Two blood supplies', [
      'Bronchial arteries (1 right, 2 left) nourish the lung. The pulmonary artery branches follow the bronchi but supply the alveoli for gas exchange.',
    ], { sourceRefs: rs([214, 220]) }),
    ask(mcq('i7-03', 'lung-supply', 'Stimulation of the vagal efferents to the lung causes:', 'Bronchoconstriction', ['Bronchodilation', 'Vasoconstriction', 'Inhibition of mucous glands'], { explanation: 'Slide 229.' })),
    recall('r7-01', 'main-bronchi', 'List the differences between the right and left main bronchi.', [
      'Right: wider, shorter, more vertical; enters at T5; azygos arches over it; has an eparterial branch.',
      'Left: narrower, longer; enters at T6; passes under the aortic arch; no eparterial branch.',
    ], rs([207, 211, 212])),
  ],
};
