import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'collagen-synthesis-2': [
    { term: 'Collagen', meaning: 'A family of fibrous proteins, the most abundant protein in mammals, forming fibres of high tensile strength.' },
    { term: 'Tropocollagen', meaning: 'The structural unit of collagen: three chains wound into a long triple helix.' },
    { term: 'Triple helix', meaning: 'Three polypeptide chains twisted together into one rod.' },
    { term: 'Glycine', meaning: 'Nearly every third residue of collagen.' },
    { term: 'Hydroxyproline', meaning: 'A modified amino acid found in collagen and in few other proteins.' },
    { term: 'Basal lamina', meaning: 'Where type IV collagen forms a sheetlike network.' },
  ],
  'collagen-synthesis-4': [
    { term: 'Procollagen', meaning: 'The secreted form of collagen, with extension peptides at both ends.' },
    { term: 'Procollagen peptidases', meaning: 'Cut off the extension peptides outside the cell, so fibres can form.' },
    { term: 'Quarter-staggered array', meaning: 'How tropocollagen molecules pack in a fibre, with gaps of about 400 Å.' },
    { term: 'Lysyl oxidase', meaning: 'Turns certain lysine side chains into aldehydes (allysine) for cross-links.' },
    { term: 'Cross-links', meaning: 'Covalent bonds within and between collagen molecules that make fibres strong.' },
  ],
  'collagen-synthesis-5': [
    { term: 'Scurvy', meaning: 'Lack of ascorbic acid: collagen is poorly hydroxylated; bleeding gums and poor wound healing.' },
    { term: 'Prolyl hydroxylase', meaning: 'The enzyme whose iron ascorbate keeps reduced.' },
    { term: 'Ehlers-Danlos syndrome', meaning: 'Rare hereditary defects of collagen synthesis: hyperextensible joints and stretchy, fragile skin.' },
    { term: 'Lathyrism', meaning: 'Fragile collagen from sweet pea seeds: β-aminopropionitrile blocks cross-link formation.' },
    { term: 'Osteogenesis imperfecta', meaning: 'Defective type I collagen: brittle bones and multiple fractures.' },
  ],
  'collagen-synthesis-6': [
    { term: 'Elastin', meaning: 'The major component of elastic fibres, found with collagen in most connective tissues.' },
    { term: 'Elastic fibres', meaning: 'Fibres that stretch to several times their length and then snap back.' },
    { term: 'Desmosine', meaning: 'A cross-link made from four lysine side chains, found only in elastin.' },
    { term: 'Lysinonorleucine', meaning: 'A cross-link found in both collagen and elastin.' },
    { term: 'Aorta', meaning: 'Its arch, near the heart, is rich in elastin.' },
  ],
};
