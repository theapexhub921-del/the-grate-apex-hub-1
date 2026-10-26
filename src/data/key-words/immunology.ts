import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'immunology-1': [
    { term: 'Immunity', meaning: 'The state of protection from infectious disease (Latin immunis, “exempt”).' },
    { term: 'Vaccine', meaning: 'A weakened (attenuated) pathogen that protects without causing the disease.' },
    { term: 'Attenuated', meaning: 'Weakened, as Pasteur’s aged cultures were.' },
    { term: 'Humoral immunity', meaning: 'Immunity carried by body fluids: antibodies.' },
    { term: 'Clonal selection', meaning: 'Each lymphocyte carries receptors for one antigen, fixed before it meets it.' },
  ],
  'immunology-2': [
    { term: 'Innate immunity', meaning: 'Non-specific protection present from birth, acting within minutes to hours.' },
    { term: 'Adaptive immunity', meaning: 'Acquired on exposure to antigen: specific, diverse and with memory.' },
    { term: 'Passive', meaning: 'Immunity given ready-made, such as maternal antibody: immediate but short-term.' },
    { term: 'Complement', meaning: 'Over 30 proteins that are part of innate immunity.' },
    { term: 'Memory cells', meaning: 'Cells left after clonal expansion that respond faster next time.' },
    { term: 'Cell-mediated immunity', meaning: 'T cells recognising peptide on MHC molecules.' },
  ],
  'immunology-3': [
    { term: 'PAMPs', meaning: 'Pathogen-associated molecular patterns: conserved microbial signatures absent from host cells.' },
    { term: 'PRR', meaning: 'Pattern recognition receptors that detect PAMPs.' },
    { term: 'Toll-like receptors', meaning: 'TLRs: PRRs on the membrane and in endosomes, e.g. TLR4 detects LPS.' },
    { term: 'Cytokines', meaning: 'Signals switched on by PRRs: inflammation, recruitment and fever.' },
    { term: 'Acute inflammation', meaning: 'Local, non-specific response: redness, heat, swelling and pain.' },
    { term: 'Chemotaxis', meaning: 'Neutrophils moving along chemical gradients to the site.' },
  ],
  'immunology-4': [
    { term: 'Haematopoiesis', meaning: 'Making blood cells, mostly in bone marrow from stem cells.' },
    { term: 'Cluster of differentiation', meaning: 'CD: a cell surface molecule used to identify a cell type, e.g. CD4 or CD8.' },
    { term: 'Macrophages', meaning: 'Tissue cells from monocytes that ingest pathogens and present antigen.' },
    { term: 'Respiratory burst', meaning: 'NADPH oxidase making superoxide and other oxidants to kill microbes.' },
    { term: 'Neutrophils', meaning: '50–70% of white cells, first to arrive at inflammation.' },
    { term: 'NK cells', meaning: 'Large granular lymphocytes that kill virus-infected and tumour cells.' },
  ],
  'immunology-7': [
    { term: 'Immunoglobulin', meaning: 'An antibody: two light and two heavy chains in a Y.' },
    { term: 'Hypervariable regions', meaning: 'The CDRs that form the antigen-binding site.' },
    { term: 'Fab', meaning: 'The antigen-binding fragment.' },
    { term: 'Fc', meaning: 'The crystallisable fragment, which carries effector functions.' },
    { term: 'Isotype', meaning: 'The antibody class (IgG, IgA, IgM, IgD, IgE), set by the heavy chain.' },
    { term: 'Epitopes', meaning: 'The parts of an antigen whose shape an antibody recognises.' },
  ],
  'immunology-8': [
    { term: 'Monoclonal', meaning: 'From a single clone, binding a single epitope.' },
    { term: 'Hybridomas', meaning: 'B cells fused with immortal myeloma cells to make one antibody.' },
    { term: 'HAT medium', meaning: 'The medium in which only hybridomas grow.' },
    { term: 'Humanised', meaning: 'Human except the mouse CDRs; names end in -zumab.' },
    { term: 'Conjugated', meaning: 'Carrying a drug or radiation to the cancer cell.' },
    { term: 'HAMA', meaning: 'Human anti-mouse antibodies that clear mouse antibodies and can cause serum sickness.' },
  ],
  'immunology-9': [
    { term: 'Classical pathway', meaning: 'Complement activation by antigen–antibody complexes, starting at C1q.' },
    { term: 'Alternative pathway', meaning: 'Complement activation on microbial surfaces without antibody.' },
    { term: 'Lectin', meaning: 'The pathway started by mannose-binding lectin on microbes.' },
    { term: 'Membrane attack complex', meaning: 'C5b–C9 forming a pore that lyses the cell.' },
    { term: 'Opsonisation', meaning: 'Coating microbes (e.g. with C3b) so phagocytes take them up.' },
    { term: 'Anaphylatoxins', meaning: 'C3a, C4a and C5a, which degranulate mast cells.' },
  ],
  'immunology-10': [
    { term: 'Interferons', meaning: 'Block viral replication and activate NK cells.' },
    { term: 'Evasion', meaning: 'How a pathogen escapes immunity, e.g. by antigenic variation.' },
    { term: 'Antigenic variation', meaning: 'Changing surface antigens so old antibodies no longer fit.' },
    { term: 'Intracellular bacteria', meaning: 'Bacteria hiding in phagocytes, removed by cell-mediated immunity.' },
    { term: 'Immunopathology', meaning: 'Harm caused by the immune response itself.' },
    { term: 'Helminths', meaning: 'Parasitic worms, fought by IgE, eosinophils and mast cells.' },
  ],
};
