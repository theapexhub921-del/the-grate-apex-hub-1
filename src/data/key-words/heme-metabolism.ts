import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'heme-metabolism-2': [
    { term: 'ALA synthase', meaning: 'Joins glycine and succinyl-CoA to make δ-aminolevulinic acid: the committed, regulated step, in the mitochondria (needs PLP).' },
    { term: 'Succinyl-CoA', meaning: 'Supplied by the TCA cycle; with glycine, the starting material of haem.' },
    { term: 'Porphobilinogen', meaning: 'PBG: the first pyrrole of the pathway, made from two ALA by ALA dehydrase.' },
    { term: 'Hydroxymethylbilane', meaning: 'The linear tetrapyrrole released by PBG deaminase.' },
    { term: 'Uroporphyrinogen III', meaning: 'The asymmetric ring made by the cosynthase, which flips one pyrrole; it leads to haem.' },
  ],
  'heme-metabolism-4': [
    { term: 'Rate-limiting', meaning: 'The slowest step that sets the pace of the pathway; ALA synthase usually is.' },
    { term: 'Feedback inhibitor', meaning: 'Haem: it represses the ALA synthase gene and inhibits the enzyme already made.' },
    { term: 'Hemin', meaning: 'Oxidised free haem; it keeps haem and globin synthesis in step, and as a drug treats porphyria attacks.' },
    { term: 'eIF2', meaning: 'A translation initiation factor; inactivating it stops globin synthesis.' },
    { term: 'Cytochrome P450', meaning: 'Detoxification enzymes; the liver uses most of its haem for them.' },
  ],
  'heme-metabolism-6': [
    { term: 'Haem oxygenase', meaning: 'Cuts open the haem ring, releasing biliverdin, carbon monoxide and iron; works only on haem.' },
    { term: 'Biliverdin', meaning: 'The green pigment left by haem oxygenase.' },
    { term: 'Biliverdin reductase', meaning: 'Uses NADPH to reduce biliverdin to bilirubin.' },
    { term: 'Bilirubin', meaning: 'The orange-yellow pigment from haem; it leaves the macrophage bound to albumin.' },
    { term: 'Macrophage', meaning: 'Breaks down worn-out red cells into globin, iron and the porphyrin.' },
  ],
};
