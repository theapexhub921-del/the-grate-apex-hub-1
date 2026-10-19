// Biochemistry → Immunology — layer 1 (learn by answering) and reading-layer
// extras. Checkpoint IDs: cN-xx; recall: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { ab, ag, ag22, ce, cm, cy, ig22, inf, intro, type ConceptId } from '@/data/topics/immunology/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'immunology-1': [
    ask(mcq('c1-01', 'vaccination-history', 'What did Jenner inoculate to protect against smallpox?', 'Fluid from a cowpox pustule', ['Attenuated rabies virus from rabbits', 'Heat-killed anthrax bacilli', 'Serum from horses immune to smallpox'], { explanation: 'IN slide 8.' })),
    learn('Attenuation', ['Pasteur found that an aged culture made chickens ill but they recovered — and were then protected. Weakening a pathogen gives a vaccine.'], { sourceRefs: intro([9, 10]) }),
    ask(match('c1-02', 'cellular-humoral-debate', 'Match each scientist to the discovery.', [
      ['Metchnikoff', 'Phagocytes (cellular immunity)'],
      ['von Behring and Kitasato', 'Serum transfers diphtheria immunity'],
      ['Kabat', 'Gamma-globulin fraction carries antibody'],
      ['Glick', 'T and B lymphocytes'],
    ], { explanation: 'IN slides 12–16.' })),
    ask(mcq('c1-03', 'clonal-selection', 'In clonal selection, when is a lymphocyte’s receptor specificity fixed?', 'Before it meets antigen', ['When antigen folds the receptor', 'After the first infection', 'In the serum'], { explanation: 'IN slide 18.' })),
    recall('r1-01', 'cellular-humoral-debate', 'Explain how the cellular versus humoral debate was resolved.', [
      'Metchnikoff argued phagocytic cells were the main effectors; von Behring and Kitasato showed serum could transfer immunity.',
      'Chase transferred TB immunity with white cells; the lymphocyte was found to underlie both.',
      'Glick showed T lymphocytes (thymus) mediate cellular and B lymphocytes humoral immunity — both are needed.',
    ], intro([12, 13, 15, 16])),
  ],
  'immunology-2': [
    ask(mcq('c2-01', 'acquired-immunity', 'A baby gets antibodies in breast milk. What kind of immunity is this?', 'Natural passive', ['Natural active', 'Artificial passive', 'Artificial active'], { explanation: 'IN slide 24.' })),
    ask(multi('c2-02', 'innate-barriers', 'Which are chemical barriers of innate immunity? Select all that apply.', ['Lysozyme', 'β-Defensins', 'Surfactant proteins A and D'], ['Cilia', 'Cough reflex'], { explanation: 'IN slide 34.' })),
    learn('Three features', ['Adaptive immunity is specific (one antigen per cell), diverse (a billion threats) and has memory (memory cells).'], { sourceRefs: intro([55, 56]) }),
    ask(mcq('c2-03', 'adaptive-immunity', 'Where do T cells finish developing?', 'Thymus', ['Bone marrow', 'Spleen', 'Lymph nodes'], { explanation: 'IN slide 57.' })),
    recall('r2-01', 'innate-barriers', 'Compare innate and adaptive immunity.', [
      'Innate: non-specific, present from birth, acts in minutes to hours; barriers, phagocytes, NK cells, complement.',
      'Adaptive: specific, acquired on exposure, takes days to weeks; B and T lymphocytes.',
      'Only adaptive immunity has memory; the two cooperate (e.g. antigen presentation).',
    ], intro([32, 54, 55])),
  ],
  'immunology-3': [
    ask(mcq('c3-01', 'pamps-prrs', 'Why do PAMPs rarely mutate away?', 'They are essential to microbial survival', ['They are made by the host, not the microbe', 'They are proteins that cannot change shape', 'They are hidden inside the microbe from the host'], { explanation: 'IN slide 44.', skill: 'cause-effect' })),
    ask(match('c3-02', 'pamps-prrs', 'Match each PRR family to where it is found.', [
      ['TLRs', 'Plasma membrane and endosomes'],
      ['NLRs', 'Cytoplasm (peptidoglycan fragments)'],
      ['CLRs', 'Cell surface (fungal β-glucans)'],
    ], { explanation: 'IN slide 45.' })),
    learn('From recognition to response', ['PRR binding signals through MyD88 or TRIF to NF-κB and IRF, switching on cytokines that cause inflammation and alert adaptive immunity.'], { sourceRefs: intro([46]) }),
    ask(order('c3-03', 'inflammation', 'Order leucocyte recruitment in inflammation.', ['Margination', 'Diapedesis', 'Chemotaxis'], { explanation: 'IN slide 52.' })),
    recall('r3-01', 'inflammation', 'Explain the causes of the signs of acute inflammation.', [
      'Redness and heat: increased blood flow (and metabolism).',
      'Swelling: capillaries become leaky (histamine), fluid enters tissue.',
      'Pain: pressure from fluid and chemicals such as kinins and prostaglandins.',
      'Loss of function may occur in severe cases.',
    ], intro([51])),
  ],
  'immunology-4': [
    ask(mcq('c4-01', 'cd-markers', 'Which marker identifies B cells?', 'CD19', ['CD3', 'CD14', 'CD56'], { explanation: 'CE slides 19, 21.' })),
    ask(mcq('c4-02', 'phagocytes', 'Which cell is first to arrive at a site of inflammation?', 'Neutrophil', ['Macrophage', 'Eosinophil', 'Basophil'], { explanation: 'CE slide 42.' })),
    learn('Two ways to kill', ['Phagocytes kill with oxygen (superoxide, H₂O₂, hydroxyl radicals, NO and peroxynitrite) and without it (lysozyme, defensins, hydrolytic enzymes).'], { sourceRefs: ce([36, 37, 38]) }),
    ask(multi('c4-03', 'nk-cells', 'How do NK cells kill? Select all that apply.', ['Perforin/granzyme', 'FasL–Fas', 'ADCC'], ['Antibody secretion', 'Phagocytosis by MHC II'], { explanation: 'CE slide 51.' })),
    recall('r4-01', 'phagocytes', 'List the functions of macrophages.', [
      'Ingest and digest pathogens (phagocytosis with oxygen-dependent and -independent killing).',
      'Process and present antigen to T cells.',
      'Secrete factors such as cytokines.',
    ], ce([26, 39, 40, 60])),
  ],
  'immunology-5': [
    ask(mcq('c5-01', 'cytokine-basics', 'IL-2, IL-4 and IL-5 all promote B-cell proliferation. This is…', 'Redundancy', ['Pleiotropy', 'Synergy', 'Antagonism'], { explanation: 'CY slide 9.', skill: 'terminology' })),
    ask(order('c5-02', 'cytokine-receptors', 'Order JAK/STAT signalling.', ['Cytokine binds receptor', 'Receptor subunits dimerise', 'JAKs activated', 'STATs phosphorylated and dimerise', 'STATs enter nucleus and switch on genes'], { explanation: 'CY slide 14.' })),
    learn('A shared chain', ['IL-2, 4, 7, 9, 15 and 21 receptors share the common γ-chain. Lose it and T, NK and functional B cells fail — X-linked SCID.'], { sourceRefs: cy([9, 23]) }),
    ask(mcq('c5-03', 'th-subsets', 'Which master transcription factor defines Th2 cells?', 'GATA-3', ['T-bet', 'RORγt', 'FoxP3'], { explanation: 'CY slide 16.' })),
    recall('r5-01', 'cytokine-disease', 'Explain bacterial septic shock in terms of cytokines.', [
      'LPS (endotoxin) binds TLR4 on dendritic cells and macrophages.',
      'They overproduce IL-1 and TNF-α — a cytokine storm.',
      'Result: fever, hypotension, capillary leak, DIC and multi-organ failure; anti-TNF or anakinra may help.',
    ], cy([19, 23])),
  ],
  'immunology-6': [
    ask(mcq('c6-01', 'antigen-terms', 'A hapten becomes immunogenic when…', 'Coupled to a carrier protein', ['It is heated to change its shape', 'It is given orally with food', 'It binds complement in the blood'], { explanation: 'AG slides 15–16.' })),
    ask(mcq('c6-02', 'immunogenicity-factors', 'Which molecule is most likely to be immunogenic?', 'A foreign protein of 50,000 Da', ['A 500 Da drug given on its own', 'A polymer of D-amino acids', 'A lipid made by the body itself'], { explanation: 'AG22 slides 16–17, 21.' })),
    learn('Two routes to T cells', ['Exogenous antigens go to MHC II and CD4 helper cells; endogenous antigens (e.g. viral proteins) to MHC I and CD8 cytotoxic cells.'], { sourceRefs: ag([28, 31]) }),
    ask(mcq('c6-03', 'antigen-classes', 'A pneumococcal capsule polysaccharide stimulates B cells without T-cell help. Which antibody results?', 'IgM only, with no memory', ['IgG, with memory B cells', 'IgE, with mast-cell sensitisation', 'IgA, with memory B cells'], { explanation: 'AG slide 42.', skill: 'cause-effect' })),
    recall('r6-01', 'adjuvants-mitogens', 'Describe adjuvants and how they work.', [
      'Substances that non-specifically enhance or change the immune response, given before or with antigen.',
      'They alter the antigen’s physical form, improve macrophage processing, stimulate lymphocytes and release antigen slowly.',
      'Examples: alum (most widely used), BCG, Freund’s (complete adds killed mycobacteria).',
    ], [...ag([43, 44, 46, 47]), ...ag22([20])]),
  ],
  'immunology-7': [
    ask(mcq('c7-01', 'ig-structure', 'Which part of an antibody carries effector functions?', 'Fc', ['Fab', 'CDRs', 'Light chain'], { explanation: 'IG22 slide 27.' })),
    ask(match('c7-02', 'ig-classes', 'Match each class to a key feature.', [
      ['IgG', 'Crosses the placenta'],
      ['IgM', 'Pentamer; first in primary response'],
      ['IgA', 'Secretory dimer at mucosae'],
      ['IgE', 'Binds mast cells; allergy'],
    ], { explanation: 'AB slides 10–13.' })),
    learn('Recent or past?', ['IgM rises first in a primary response, so IgM against a pathogen suggests recent infection; IgG dominates later and in memory.'], { sourceRefs: ab([10, 11]) }),
    ask(mcq('c7-03', 'ag-ab-binding', 'The overall strength of a multivalent antigen–antibody complex is…', 'Avidity', ['Affinity', 'Valency', 'Cross-reactivity'], { explanation: 'AB slide 15.', skill: 'terminology' })),
    recall('r7-01', 'ig-structure', 'Describe the basic structure of an immunoglobulin.', [
      'Two identical light chains (23 kDa) and two identical heavy chains, joined by disulfide bonds into a Y.',
      'Variable regions (VL, VH) with hypervariable CDRs bind antigen; constant regions (CL, CH1–3/4) carry effector functions.',
      'A flexible hinge; papain gives two Fab and one Fc fragment.',
    ], [...ab([6]), ...ig22([11, 12, 27, 32])]),
  ],
  'immunology-8': [
    ask(mcq('c8-01', 'mab-basics', 'Why are hybridomas grown in HAT medium?', 'Only fused hybridoma cells survive in it', ['It turns mouse antibodies into human ones', 'It kills the hybridoma cells selectively', 'It speeds the division of the B cells'], { explanation: 'AB slide 35.', skill: 'cause-effect' })),
    ask(match('c8-02', 'mab-types', 'Match each name ending to its type.', [
      ['-omab', 'Murine'],
      ['-ximab', 'Chimeric'],
      ['-zumab', 'Humanised'],
      ['-umab', 'Human'],
    ], { explanation: 'AB slides 22–25.' })),
    learn('Why humanise?', ['Mouse antibodies provoke human anti-mouse antibodies (HAMA) that clear the drug and can cause serum sickness. Replacing mouse parts with human ones reduces this.'], { sourceRefs: ab([23, 24, 38]) }),
    ask(mcq('c8-03', 'mab-uses', 'Blinatumomab binds CD19 and CD3. It is a…', 'Bispecific monoclonal antibody', ['Radiolabelled monoclonal antibody', 'Naked (unconjugated) monoclonal antibody', 'Chemolabelled monoclonal antibody'], { explanation: 'AB slide 32.' })),
    recall('r8-01', 'mab-basics', 'Outline how monoclonal antibodies are produced.', [
      'Immunise a mouse repeatedly with the antigen; take B cells from its spleen.',
      'Fuse them with myeloma cells to make hybridomas.',
      'Select in HAT medium, screen for the wanted antibody, grow the clone and purify the antibody.',
    ], ab([34, 35])),
  ],
  'immunology-9': [
    ask(mcq('c9-01', 'complement-pathways', 'Which pathway is started by antigen–antibody complexes?', 'Classical', ['Alternative', 'Lectin', 'Membrane attack'], { explanation: 'CM slide 11.' })),
    ask(order('c9-02', 'complement-effects', 'Order assembly of the membrane attack complex.', ['C5b', 'C6', 'C7', 'C8', 'C9 polymer'], { explanation: 'CM slide 19; AB slide 56.' })),
    learn('Properdin', ['In the alternative pathway C3bBb falls apart in about 5 minutes; properdin stabilises it for about 30, amplifying C3b production.'], { sourceRefs: [...ab([52]), ...cm([28, 29])] }),
    ask(mcq('c9-03', 'complement-regulation', 'Deficiency of C1 inhibitor causes…', 'Hereditary angio-oedema', ['Paroxysmal nocturnal haemoglobinuria', 'MPGN type II', 'SCID'], { explanation: 'CM slide 50.', clinical: true })),
    recall('r9-01', 'complement-effects', 'List the biological effects of complement.', [
      'Cytolysis by the membrane attack complex.',
      'Opsonisation by C3b (and C4b).',
      'Inflammation: anaphylatoxins C3a, C4a, C5a; C5a is chemotactic.',
      'Immune complex clearance and enhanced antibody production via C3b receptors.',
    ], cm([39, 40, 41, 42, 43])),
  ],
  'immunology-10': [
    ask(mcq('c10-01', 'antiviral-immunity', 'Which defence acts earliest against a virus, before antibody appears?', 'Interferons and NK cells', ['IgG from plasma cells', 'Memory B cells', 'Th2 cells and IgE'], { explanation: 'IF slide 8.' })),
    ask(mcq('c10-02', 'antibacterial-immunity', 'Why does eliminating intracellular bacteria require cell-mediated immunity?', 'They hide inside phagocytes, beyond antibody', ['They lack any antigens that antibody could bind', 'They activate complement, which protects them', 'They are too small for antibodies to reach'], { explanation: 'IF slide 16.', skill: 'cause-effect' })),
    learn('Drift and shift', ['Influenza changes its haemagglutinin slightly (drift) or radically (shift), so antibodies made earlier no longer fit.'], { sourceRefs: inf([11]) }),
    ask(mcq('c10-03', 'fungi-parasites', 'Which response defends against helminths?', 'Th2 → IgE, eosinophils and mast cells', ['Th1 → IFN-γ and macrophages alone', 'Complement only, without any T cells', 'CD8 cytotoxic T cells alone'], { explanation: 'IF slides 21, 23.' })),
    recall('r10-01', 'antibacterial-immunity', 'Describe the immune response to Mycobacterium tuberculosis and how it evades it.', [
      'Th1 cells recognise mycobacterial peptides and release IFN-γ.',
      'Activated macrophages kill TB mainly with nitric oxide; exhausted macrophages are killed by CTLs and NK cells.',
      'M. tuberculosis evades killing by blocking phagolysosome fusion.',
    ], inf([17, 18])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'immunology-1': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Jenner = Father of Immunology.', 'Pasteur: attenuated vaccines.', 'Clonal selection is accepted.'],
    confusions: [{ confusion: 'Pasteur invented vaccination against smallpox.', clarification: 'Jenner used cowpox against smallpox (1798); Pasteur developed attenuated vaccines (IN slides 8, 10).' }],
  },
  'immunology-2': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Passive = immediate, short-term.', 'Innate: from birth, non-specific.', 'Adaptive: specific, diverse, memory.'],
    confusions: [{ confusion: 'Vaccination gives passive immunity.', clarification: 'Vaccination is artificial active immunity; injected antibody is passive (IN slide 25).' }],
  },
  'immunology-3': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['LPS → TLR4.', 'NLRs and RLRs are cytoplasmic.', 'Margination → diapedesis → chemotaxis.'],
    confusions: [{ confusion: 'PAMPs are found on host cells too.', clarification: 'PAMPs are absent from healthy host tissue — a reliable “non-self” flag (IN slide 44).' }],
  },
  'immunology-4': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Neutrophils 50–70%, first responders.', 'NK: CD16, CD56; no antigen receptor.', 'Mast cells are not in blood.'],
    confusions: [{ confusion: 'NK cells need the thymus.', clarification: 'Nude mice lack a thymus and T cells but have functional NK cells (CE slide 50).' }],
  },
  'immunology-5': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Common γ-chain → X-SCID.', 'Class I/II receptors use JAK/STAT.', 'Tocilizumab blocks IL-6R.'],
    confusions: [{ confusion: 'Cytokines are stored and released like hormones from granules.', clarification: 'They are made on demand and not stored (CY slide 7).' }],
  },
  'immunology-6': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Haptens need carriers.', 'TI antigens → IgM only, no memory.', 'Alum is the most used adjuvant.'],
    confusions: [{ confusion: 'Every antigen is an immunogen.', clarification: 'All immunogens are antigens, but haptens are antigens that are not immunogens (AG slide 5).' }],
  },
  'immunology-7': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['IgG crosses the placenta.', 'IgM = recent infection.', 'Papain → 2 Fab + Fc.'],
    confusions: [{ confusion: 'Affinity and avidity are the same.', clarification: 'Affinity is one binding site; avidity is the whole complex (AB slide 15).' }],
  },
  'immunology-8': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Hybridoma = B cell + myeloma.', '-ximab chimeric; -zumab humanised.', 'HAMA → serum sickness.'],
    confusions: [{ confusion: 'Humanised antibodies are fully human.', clarification: 'Humanised antibodies keep the mouse CDRs; human antibodies (-umab) are fully human (AB slides 24–25).' }],
  },
  'immunology-9': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['C5a most powerful chemotactic factor.', 'C5b–9 = MAC.', 'HAE: low C4, normal C3.'],
    confusions: [{ confusion: 'The alternative pathway needs antibody.', clarification: 'It is activated on microbial surfaces without antibody (CM slide 22).' }],
  },
  'immunology-10': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Extracellular bacteria → antibody.', 'Intracellular bacteria → CMI.', 'Helminths → Th2, IgE, eosinophils.'],
    confusions: [{ confusion: 'Antibody alone clears TB.', clarification: 'Intracellular bacteria need cell-mediated immunity (IF slide 16).' }],
  },
};
