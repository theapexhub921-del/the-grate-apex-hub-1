// Biochemistry → Free Radicals and Oxygen Toxicity — layer 1 (learn by
// answering) and reading-layer extras. Checkpoint IDs: cN-xx; recall: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { hb, type ConceptId } from '@/data/topics/free-radicals-and-oxygen-toxicity/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'free-radicals-and-oxygen-toxicity-1': [
    ask(mcq('c1-01', 'free-radical-definition', 'What makes a species a free radical?', 'It has one or more unpaired electrons', ['It carries a negative charge on one atom', 'It contains at least one oxygen atom', 'It is an enzyme that oxidises lipids'], { explanation: 'HB slides 5–6.' })),
    learn('Chains', ['A radical that meets another radical is neutralised. But a radical that takes an electron from a stable molecule turns it into a new radical — a chain reaction that propagates damage.'], { sourceRefs: hb([5, 8]) }),
    ask(mcq('c1-02', 'ros-terms', 'Hydrogen peroxide is called a ROS but not a free radical. Why?', 'It has no unpaired electron', ['It contains no oxygen', 'It is harmless', 'It is made outside the body'], { explanation: 'HB slide 6.', skill: 'cause-effect' })),
    ask(multi('c1-03', 'radical-sources', 'Which are internal sources of free radicals? Select all that apply.', ['Mitochondria', 'Xanthine oxidase', 'Phagocytes', 'Ischaemia–reperfusion'], ['Ozone', 'Cigarette smoke'], { explanation: 'HB slide 9; Fay slide 6.' })),
    recall('r1-01', 'ischaemia-reperfusion', 'Explain why restoring blood flow after ischaemia generates free radicals.', [
      'During ischaemia xanthine and xanthine oxidase rise greatly.',
      'At the same time the antioxidants SOD and glutathione peroxidase are lost.',
      'When oxygen returns, xanthine oxidase generates radicals that the weakened defences cannot remove.',
    ], hb([10])),
  ],
  'free-radicals-and-oxygen-toxicity-2': [
    ask(mcq('c2-01', 'radical-reactions', 'Superoxide meets nitrogen dioxide. What forms?', 'Peroxynitrite', ['Hydrogen peroxide', 'Hydroxyl radical', 'Water'], { explanation: 'HB slide 15: two radicals pair their electrons into a covalent bond.' })),
    learn('Superoxide is the parent', ['Superoxide comes mainly from electron leakage in the mitochondrial chain. It is not very damaging itself, but dismutates to H₂O₂, which with iron gives the extremely reactive hydroxyl radical.'], { sourceRefs: hb([35, 37]) }),
    ask(mcq('c2-02', 'fenton-haber-weiss', 'Which reaction makes hydroxyl radicals from H₂O₂ and Fe²⁺?', 'The Fenton reaction', ['The Haber–Weiss reaction', 'Dismutation', 'The respiratory burst'], { explanation: 'HB slide 37.' })),
    ask(order('c2-03', 'fenton-haber-weiss', 'Order the one-electron reduction of oxygen.', ['O₂', 'Superoxide', 'Hydrogen peroxide', 'Hydroxyl radical', 'Water'], { explanation: 'HB slides 37, 69.' })),
    recall('r2-01', 'major-ros', 'Describe superoxide, hydrogen peroxide and the hydroxyl radical, and how they are linked.', [
      'Superoxide: O₂ plus one electron; mainly from mitochondrial electron leakage; not very damaging but the source of the others.',
      'Hydrogen peroxide: from dismutation of superoxide; not a radical and not very reactive, but the main source of ·OH with transition metals.',
      'Hydroxyl radical: made by the Fenton (H₂O₂ + Fe²⁺) and Haber–Weiss (O₂·⁻ + H₂O₂) reactions; extremely reactive with most biomolecules.',
    ], hb([35, 37])),
  ],
  'free-radicals-and-oxygen-toxicity-3': [
    ask(mcq('c3-01', 'lipid-peroxidation', 'Why are polyunsaturated fatty acids the main targets of lipid peroxidation?', 'The methylene groups between their double bonds have very reactive hydrogens', ['They have no double bonds, so they are fully saturated', 'They are water-soluble and sit outside the membrane', 'They contain iron, which catalyses the attack'], { explanation: 'HB slides 22, 29.', skill: 'cause-effect' })),
    ask(order('c3-02', 'lipid-peroxidation', 'Order the stages of lipid peroxidation.', ['Initiation: hydrogen abstraction', 'Lipid radical + O₂ → peroxyl radical', 'Peroxyl radical attacks another lipid', 'Lipid peroxides accumulate; membrane leaks', 'Termination'], { explanation: 'HB slides 23, 25.' })),
    learn('DNA', ['·OH attacking guanine gives 8-hydroxyguanine (mutagenic) or ring-opened guanine (blocks replication). Malondialdehyde from lipid peroxidation also forms DNA adducts.'], { sourceRefs: hb([24, 26]) }),
    ask(mcq('c3-03', 'oxidised-ldl', 'How does oxidised LDL make foam cells?', 'Macrophages take it up avidly and fill with cholesteryl ester', ['It kills the macrophages, which then swell with fluid', 'It blocks the LDL receptors so cholesterol cannot leave', 'It dissolves existing plaques into foamy debris that cells then engulf'], { explanation: 'HB slide 32.' })),
    recall('r3-01', 'lipid-peroxidation', 'Describe lipid peroxidation and its consequences.', [
      'Initiation: a radical abstracts a hydrogen from a PUFA (LH + X· → L·).',
      'Propagation: L· + O₂ → LOO·; LOO· + LH → LOOH + L· — a chain reaction.',
      'Lipid peroxides accumulate and make membranes leaky to ions (Ca²⁺ influx, altered pH).',
      'Termination: radicals combine into non-radical products. End-products such as malondialdehyde are mutagenic.',
    ], hb([22, 23, 24, 25])),
  ],
  'free-radicals-and-oxygen-toxicity-4': [
    ask(match('c4-01', 'antioxidant-enzymes', 'Match each enzyme to what it removes.', [
      ['Superoxide dismutase', 'Superoxide'],
      ['Catalase', 'Hydrogen peroxide'],
      ['Glutathione peroxidase', 'H₂O₂ and lipid peroxides'],
    ], { explanation: 'HB slide 40.' })),
    learn('Mineral cofactors', ['MnSOD in mitochondria, CuZnSOD in the cytoplasm, CuSOD outside cells; glutathione peroxidase is a selenoprotein. Low dietary Se, Cu, Mn or Zn weakens these defences.'], { sourceRefs: hb([40, 48]) }),
    ask(mcq('c4-02', 'antioxidant-vitamins', 'Which antioxidant vitamin is water-soluble and helps regenerate vitamin E?', 'Ascorbic acid (vitamin C)', ['α-Tocopherol (vitamin E)', 'β-Carotene (provitamin A)', 'Calciferol (vitamin D)'], { explanation: 'HB slide 41.' })),
    ask(mcq('c4-03', 'antioxidant-action', 'Transferrin and caeruloplasmin act as antioxidants by…', 'Binding transition metals that would catalyse radical formation', ['Scavenging superoxide in the plasma', 'Breaking lipid peroxidation chains in membranes', 'Making glutathione in the red cells'], { explanation: 'HB slides 39, 43.' })),
    recall('r4-01', 'antioxidant-action', 'Describe the four ways antioxidants act, with an example of each.', [
      'Chain breaking: α-tocopherol traps radicals in the lipid phase.',
      'Reducing ROS concentration: glutathione.',
      'Scavenging initiating radicals: SOD removes superoxide in the aqueous phase.',
      'Chelating transition metals: transferrin, lactoferrin, ferritin (iron); caeruloplasmin, albumin (copper).',
    ], hb([39])),
  ],
  'free-radicals-and-oxygen-toxicity-5': [
    ask(mcq('c5-01', 'ros-cancer', 'At which stage do free radicals activate proto-oncogenes and inactivate tumour suppressor genes?', 'Initiation', ['Promotion', 'Progression', 'Metastasis'], { explanation: 'HB slide 59.' })),
    learn('HIV', ['H₂O₂ crosses membranes and promotes viral gene expression; oxidative stress activates NF-κB, increasing HIV replication; ROS and cytokines feed each other.'], { sourceRefs: hb([54]) }),
    ask(mcq('c5-02', 'ros-transplant', 'Which drug improves myocardial contractility in cardiopulmonary bypass by blocking a radical source?', 'Allopurinol (xanthine oxidase inhibitor)', ['Deferoxamine (iron-chelating agent)', 'Methotrexate (folate antagonist)', 'Nitrofurantoin (urinary antibacterial)'], { explanation: 'HB slides 65, 67.', clinical: true })),
    ask(mcq('c5-03', 'ros-transplant', 'Which is an oxidative biomarker?', 'Malondialdehyde (MDA)', ['Catalase activity in the red cells', 'GSH/GSSG ratio', 'Superoxide dismutase'], { explanation: 'HB slide 64.' })),
    recall('r5-01', 'ros-hiv-pregnancy', 'Explain how oxidative stress may contribute to diabetic embryopathy.', [
      'Swings between maternal hyper- and hypoglycaemia change glucose supply to the fetus; ketone bodies and branched-chain amino acids alter embryonic nutrition.',
      'Later, a high glucose load speeds electron flow through the mitochondrial chain, increasing radical leakage in embryonic tissue.',
      'The radicals (with lipid peroxidation) cause malformations; keeping blood glucose normal is key to prevention.',
    ], hb([56, 57])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'free-radicals-and-oxygen-toxicity-1': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Free radical = unpaired electron.', 'ROS includes non-radicals (H₂O₂, HOCl).', 'Respiratory burst: 70–90% of O₂ → superoxide.'],
    confusions: [{ confusion: 'All ROS are free radicals.', clarification: 'ROS also include non-radical oxygen derivatives such as H₂O₂ and HOCl (HB slide 6).' }],
  },
  'free-radicals-and-oxygen-toxicity-2': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Fenton: H₂O₂ + Fe²⁺ → ·OH.', 'Haber–Weiss: O₂·⁻ + H₂O₂ → ·OH.', 'Superoxide mainly from mitochondrial leakage.'],
    confusions: [{ confusion: 'Hydrogen peroxide is the most damaging species.', clarification: 'It is not very reactive; its danger is as the source of the hydroxyl radical (HB slide 35).' }],
  },
  'free-radicals-and-oxygen-toxicity-3': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['PUFAs are most vulnerable.', 'Initiation → propagation → termination.', '8-Hydroxyguanine is a mutagenic lesion.'],
    confusions: [{ confusion: 'Proteins are more susceptible to radicals than membrane lipids.', clarification: 'Proteins and nucleic acids are less susceptible than PUFAs (HB slide 13).' }],
  },
  'free-radicals-and-oxygen-toxicity-4': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['SOD → H₂O₂; catalase and GPx remove it.', 'GPx is a selenoprotein.', 'Vitamin C regenerates vitamin E.'],
    confusions: [{ confusion: 'SOD turns superoxide into water.', clarification: 'SOD makes H₂O₂; catalase and glutathione peroxidase then remove it (HB slides 40, 47).' }],
  },
  'free-radicals-and-oxygen-toxicity-5': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Radicals act at initiation, promotion and progression.', 'Oxidative stress activates NF-κB and HIV.', 'Allopurinol blocks xanthine oxidase in reperfusion.'],
    confusions: [{ confusion: 'All pregnant women need antioxidant supplements.', clarification: 'Antioxidant activity rises naturally; there is no evidence supplements are needed in normal pregnancy (HB slide 51).' }],
  },
};
