// Biochemistry → Immunology — the topic question bank.
//
// Rules: only what the lessons teach (the lecture decks). Not asked: which
// line of defence adaptive immunity is, the Gram stain of LPS/teichoic acid
// from CE slide 30, the C2 fragment name, the number of TLRs, heavy chain
// mass (see discrepancies), study guides, or speaker-note annotations.
// IDs: qN-xx.
import { match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/immunology/sources';

type Q = QuestionDraft<ConceptId>;

const lesson1: Q[] = [
  mcq('q1-01', 'immunity-definition', 'The word immunity comes from the Latin immunis, meaning…', 'Exempt', ['Defence', 'Blood', 'Cell'], { explanation: 'IN slide 3.', skill: 'terminology' }),
  mcq('q1-02', 'immunity-definition', 'The earliest recorded observation of immunity (430 BC, Athens) was that…', 'People who recovered from plague could nurse the sick without reinfection', ['Cowpox protected milkmaids', 'Serum neutralised toxins', 'Phagocytes ate bacteria'], { explanation: 'IN slide 3.' }),
  mcq('q1-03', 'vaccination-history', 'Who introduced variolation to Britain after seeing it in Constantinople?', 'Lady Mary Wortley Montagu', ['Edward Jenner', 'Louis Pasteur', 'Robert Koch'], { explanation: 'IN slide 8.' }),
  mcq('q1-04', 'vaccination-history', 'Who is called the Father of Immunology?', 'Edward Jenner', ['Louis Pasteur', 'Paul Ehrlich', 'Elie Metchnikoff'], { explanation: 'IN slide 21.' }),
  mcq('q1-05', 'vaccination-history', 'Pasteur’s 1881 Pouilly-le-Fort experiment used a vaccine against…', 'Anthrax', ['Rabies', 'Smallpox', 'Diphtheria'], { explanation: 'IN slide 11.' }),
  mcq('q1-06', 'vaccination-history', 'Joseph Meister was the first human given Pasteur’s vaccine against…', 'Rabies', ['Anthrax', 'Fowl cholera', 'Smallpox'], { explanation: 'IN slide 11.' }),
  mcq('q1-07', 'vaccination-history', 'Pasteur named the vaccine from the Latin vacca, meaning…', 'Cow', ['Weak', 'Protect', 'Poison'], { explanation: 'IN slide 10.' }),
  mcq('q1-08', 'cellular-humoral-debate', 'Who first described phagocytes (1883)?', 'Elie Metchnikoff', ['Emil von Behring', 'Paul Ehrlich', 'Karl Landsteiner'], { explanation: 'IN slide 12.' }),
  multi('q1-09', 'cellular-humoral-debate', 'Which activities of immune serum were named after what they did? Select all that apply.', ['Antitoxin', 'Precipitin', 'Agglutinin'], ['Lysozyme'], { explanation: 'IN slide 14.' }),
  mcq('q1-10', 'cellular-humoral-debate', 'Merrill Chase (1940s) transferred immunity to tuberculosis using…', 'White blood cells', ['Serum', 'Antitoxin', 'Complement'], { explanation: 'IN slide 16.' }),
  mcq('q1-11', 'cellular-humoral-debate', 'Who identified the role of dendritic cells in activating T cells?', 'Steinman', ['Miller', 'Cooper', 'Kabat'], { explanation: 'IN slide 22.' }),
  mcq('q1-12', 'clonal-selection', 'Ehrlich compared receptor–antigen binding to…', 'A lock and key', ['A template', 'A zipper', 'A sponge'], { explanation: 'IN slide 17.' }),
  tf({ id: 'q1-13', conceptId: 'clonal-selection', statement: 'Instructional theories, in which antigen acts as a template for antibody folding, are now accepted.', answer: false, explanation: 'IN slide 18: they were disproved; clonal selection is accepted.', skill: 'misconception' }),
];

const lesson2: Q[] = [
  match('q2-01', 'acquired-immunity', 'Match each example to the type of immunity.', [
    ['Recovering from measles', 'Natural active'],
    ['Maternal IgG across the placenta', 'Natural passive'],
    ['Tetanus vaccine', 'Artificial active'],
    ['Injected immune globulin', 'Artificial passive'],
  ], { explanation: 'IN slides 24–25.' }),
  mcq('q2-02', 'acquired-immunity', 'Passive immunity provides…', 'Immediate, short-term protection', ['Long-term protection with memory', 'No protection', 'Only innate protection'], { explanation: 'IN slides 24–25.' }),
  mcq('q2-03', 'acquired-immunity', 'Disease, as distinct from infection, is…', 'The clinical manifestation of infection', ['Entry of a pathogen', 'Multiplication of a pathogen', 'An immune response'], { explanation: 'IN slide 26.', skill: 'terminology' }),
  multi('q2-04', 'innate-barriers', 'Which cells belong to innate immunity? Select all that apply.', ['Neutrophils', 'Macrophages', 'NK cells', 'Mast cells'], ['B lymphocytes'], { explanation: 'IN slide 32.' }),
  mcq('q2-05', 'innate-barriers', 'How quickly does innate immunity act?', 'Minutes to hours', ['Days to weeks', 'Months', 'Only after a second exposure'], { explanation: 'IN slide 32.' }),
  multi('q2-06', 'innate-barriers', 'Which are physiological barriers? Select all that apply.', ['Body temperature', 'Low stomach pH'], ['Lysozyme', 'Mucus'], { explanation: 'IN slide 34.' }),
  mcq('q2-07', 'innate-barriers', 'Surfactant proteins A and D in the lung act as…', 'Opsonins', ['Antibodies', 'Cytokines', 'Complement inhibitors'], { explanation: 'IN slide 34.' }),
  multi('q2-08', 'innate-barriers', 'Which are functions of the innate immune system? Select all that apply.', ['Recruiting immune cells with cytokines', 'Activating complement', 'Presenting antigen to adaptive immunity'], ['Making memory cells'], { explanation: 'IN slide 43.' }),
  mcq('q2-09', 'adaptive-immunity', 'How long does adaptive immunity take to develop?', 'Days to weeks', ['Seconds', 'Minutes to hours', 'Years'], { explanation: 'IN slide 54.' }),
  mcq('q2-10', 'adaptive-immunity', 'Where do B cells mature?', 'Bone marrow', ['Thymus', 'Liver', 'Spleen only'], { explanation: 'IN slide 57.' }),
  mcq('q2-11', 'adaptive-immunity', 'Which cells produce antibodies?', 'Plasma cells', ['Cytotoxic T cells', 'Neutrophils', 'NK cells'], { explanation: 'IN slide 61.' }),
  mcq('q2-12', 'adaptive-immunity', 'Cytotoxic T cells carry which marker?', 'CD8', ['CD4', 'CD19', 'CD14'], { explanation: 'IN slide 62.' }),
  multi('q2-13', 'adaptive-immunity', 'What can antibodies do in humoral immunity? Select all that apply.', ['Neutralise toxins', 'Opsonise', 'Kill extracellular pathogens'], ['Kill virus-infected cells directly via MHC I'], { explanation: 'IN slide 61.' }),
];

const lesson3: Q[] = [
  multi('q3-01', 'pamps-prrs', 'Which are PAMPs? Select all that apply.', ['Lipopolysaccharide', 'Flagellin', 'Double-stranded RNA', 'Unmethylated CpG DNA'], ['Host collagen'], { explanation: 'IN slide 44.' }),
  mcq('q3-02', 'pamps-prrs', 'Lipopolysaccharide comes from…', 'The Gram-negative cell wall', ['Fungal walls', 'Viral capsids', 'Host membranes'], { explanation: 'IN slide 44.' }),
  mcq('q3-03', 'pamps-prrs', 'RIG-I-like receptors detect…', 'Viral dsRNA in the cytoplasm', ['Fungal β-glucans', 'LPS on the surface', 'Peptidoglycan in endosomes'], { explanation: 'IN slide 45.' }),
  mcq('q3-04', 'pamps-prrs', 'C-type lectin receptors mainly detect…', 'Fungal cell-wall carbohydrates', ['Viral RNA', 'Flagellin', 'CpG DNA'], { explanation: 'IN slide 45.' }),
  multi('q3-05', 'pamps-prrs', 'Which adaptors link PRRs to transcription factors? Select all that apply.', ['MyD88', 'TRIF'], ['STAT', 'SMAD'], { explanation: 'IN slide 46.' }),
  match('q3-06', 'pamps-prrs', 'Match each microbial product to its receptor.', [
    ['LPS', 'TLR4'],
    ['Flagellin', 'TLR5'],
    ['CpG DNA', 'TLR9'],
    ['Peptidoglycan fragments', 'NOD1/NOD2'],
  ], { explanation: 'IN slide 50; IF0 slide 31.' }),
  mcq('q3-07', 'pamps-prrs', 'Excessive PRR signalling can cause…', 'Sepsis and cytokine storm', ['Immunodeficiency', 'Tolerance', 'Allergy only'], { explanation: 'IN slide 47.', clinical: true }),
  multi('q3-08', 'pamps-prrs', 'Which are opsonic receptors on macrophages? Select all that apply.', ['IgG Fc receptor', 'Complement receptor CR1'], ['TLR9', 'CD3'], { explanation: 'CE slide 35.' }),
  mcq('q3-09', 'pamps-prrs', 'Scavenger receptors help remove apoptotic cells by recognising…', 'Phosphatidylserine', ['Mannose', 'Flagellin', 'IgG'], { explanation: 'CE slides 30, 33.' }),
  mcq('q3-10', 'inflammation', 'Swelling in inflammation is due to…', 'Leaky capillaries letting fluid into tissue', ['Increased cell division', 'Blood clotting', 'Fever'], { explanation: 'IN slide 51.' }),
  mcq('q3-11', 'inflammation', 'Acute inflammation typically lasts about…', '8–10 days', ['1 hour', '6 months', 'A lifetime'], { explanation: 'IN slide 51.' }),
  multi('q3-12', 'inflammation', 'Which are vascular changes in inflammation? Select all that apply.', ['Arteriolar vasodilation', 'Increased capillary permeability', 'Display of cell adhesion molecules'], ['Vasoconstriction of capillaries'], { explanation: 'IN slide 52.' }),
  mcq('q3-13', 'inflammation', 'Movement of leucocytes through the vessel wall is called…', 'Diapedesis', ['Margination', 'Opsonisation', 'Phagocytosis'], { explanation: 'IN slide 52.', skill: 'terminology' }),
];

const lesson4: Q[] = [
  mcq('q4-01', 'blood-haematopoiesis', 'Blood is about what percentage plasma?', '55%', ['45%', '90%', '10%'], { explanation: 'CE slide 3.' }),
  mcq('q4-02', 'blood-haematopoiesis', 'Haematopoiesis occurs mostly in…', 'Bone marrow', ['Liver', 'Spleen', 'Thymus'], { explanation: 'CE slide 7.' }),
  mcq('q4-03', 'blood-haematopoiesis', 'Which are myeloid cells?', 'Neutrophils and macrophages', ['T and B cells', 'NK cells only', 'Plasma cells'], { explanation: 'CE slide 10.' }),
  mcq('q4-04', 'cd-markers', 'A CD number is assigned to a molecule recognised by…', 'Two specific monoclonal antibodies', ['One polyclonal serum', 'A T-cell receptor', 'Complement'], { explanation: 'CE slide 15.' }),
  match('q4-05', 'cd-markers', 'Match each cell to its marker.', [
    ['T helper cell', 'CD4'],
    ['Cytotoxic T cell', 'CD8'],
    ['Monocyte', 'CD14'],
    ['NK cell', 'CD56'],
  ], { explanation: 'CE slides 19, 21.' }),
  mcq('q4-06', 'cd-markers', 'Which marker is on all leucocytes?', 'CD45', ['CD3', 'CD19', 'CD15'], { explanation: 'CE slide 21.' }),
  mcq('q4-07', 'phagocytes', 'The circulating half-life of monocytes is about…', '8 hours', ['8 days', '2–3 days', '1 month'], { explanation: 'IN slide 42.' }),
  mcq('q4-08', 'phagocytes', 'Which enzyme makes nitric oxide in macrophages?', 'Inducible NO synthase', ['NADPH oxidase', 'Lysozyme', 'Myeloperoxidase'], { explanation: 'CE slide 37.' }),
  multi('q4-09', 'phagocytes', 'Which are oxygen-independent killing mechanisms? Select all that apply.', ['Lysozyme', 'Defensins', 'Hydrolytic enzymes'], ['Superoxide'], { explanation: 'CE slide 38.' }),
  mcq('q4-10', 'phagocytes', 'Neutrophils live for about…', '2–3 days', ['8 hours', '3 months', 'Years'], { explanation: 'CE slide 42.' }),
  mcq('q4-11', 'other-innate-cells', 'Which cell is non-phagocytic and releases histamine in allergy?', 'Basophil', ['Neutrophil', 'Macrophage', 'Dendritic cell'], { explanation: 'CE slide 46.' }),
  mcq('q4-12', 'other-innate-cells', 'Eosinophils are especially important against…', 'Parasites', ['Viruses', 'Fungi', 'Tumours only'], { explanation: 'CE slide 45; IN slide 41.' }),
  mcq('q4-13', 'nk-cells', 'NK cell inhibitory receptors such as KIRs recognise…', 'MHC class I', ['MHC class II', 'Antibody', 'CD4'], { explanation: 'CE22 slide 55.' }),
  mcq('q4-14', 'nk-cells', 'NKT cells recognise antigen presented by…', 'CD1', ['MHC class II', 'Complement', 'Fc receptors'], { explanation: 'CE slide 58.' }),
];

const lesson5: Q[] = [
  mcq('q5-01', 'cytokine-basics', 'A cytokine made by mononuclear phagocytes is a…', 'Monokine', ['Lymphokine', 'Chemokine', 'Hormone'], { explanation: 'CY slide 4.', skill: 'terminology' }),
  mcq('q5-02', 'cytokine-basics', 'Why do cytokine responses take hours?', 'Cytokines are synthesised on demand, not stored', ['They travel slowly', 'Receptors are absent', 'They need complement'], { explanation: 'CY slide 7.', skill: 'cause-effect' }),
  mcq('q5-03', 'cytokine-basics', 'A cytokine acting on the cell that made it acts in an…', 'Autocrine manner', ['Endocrine manner', 'Paracrine manner', 'Exocrine manner'], { explanation: 'CY slide 7.' }),
  mcq('q5-04', 'cytokine-basics', 'TNF-α inducing IL-1, which induces IL-6 and IL-8, is…', 'Cascade induction', ['Redundancy', 'Antagonism', 'Pleiotropy'], { explanation: 'CY slide 9.' }),
  mcq('q5-05', 'cytokine-basics', 'Which chemokine recruits neutrophils into tissues?', 'CXCL8 (IL-8)', ['IL-4', 'IFN-γ', 'TGF-β'], { explanation: 'RS slide 4.' }),
  match('q5-06', 'cytokine-receptors', 'Match each receptor family to its signalling.', [
    ['Hematopoietin (class I)', 'JAK/STAT'],
    ['Chemokine receptors', 'G-protein coupled'],
    ['TGF-β receptors', 'SMAD'],
    ['TNF receptors', 'TRAF → NF-κB / caspases'],
  ], { explanation: 'CY slide 13.' }),
  mcq('q5-07', 'cytokine-receptors', 'Which are the most abundant cytokine receptor families?', 'Class I and class II', ['TNF receptors', 'Chemokine receptors', 'TGF-β receptors'], { explanation: 'CY slide 13.' }),
  mcq('q5-08', 'th-subsets', 'Which cytokines drive Th1 differentiation?', 'IL-12 and IFN-γ', ['IL-4', 'TGF-β and IL-6', 'IL-10'], { explanation: 'CY slide 16.' }),
  mcq('q5-09', 'th-subsets', 'FoxP3 is the master transcription factor of…', 'Regulatory T cells', ['Th1 cells', 'Th17 cells', 'Tfh cells'], { explanation: 'CY slide 16.' }),
  mcq('q5-10', 'th-subsets', 'Th17 cells mainly…', 'Recruit neutrophils and fight fungi', ['Make IgE', 'Suppress autoimmunity', 'Help B cells in germinal centres'], { explanation: 'CY slide 16.' }),
  mcq('q5-11', 'cytokine-disease', 'X-linked SCID is caused by a mutation in…', 'The IL-2 receptor γ-chain', ['BTK', 'TNF', 'IL-6'], { explanation: 'CY slides 19, 23.', clinical: true }),
  mcq('q5-12', 'cytokine-disease', 'Superantigens can activate up to what proportion of T cells?', '20%', ['<0.01%', '1–2%', '100%'], { explanation: 'CY slide 23.' }),
  mcq('q5-13', 'cytokine-disease', 'Tocilizumab blocks…', 'The IL-6 receptor', ['TNF-α', 'IL-1', 'JAK1/2'], { explanation: 'CY slide 21.', clinical: true }),
  mcq('q5-14', 'cytokine-disease', 'A defective IFN-γ receptor causes susceptibility to…', 'Mycobacteria', ['Helminths', 'Allergy', 'Toxic shock'], { explanation: 'CY slide 23; RS slide 20.', clinical: true }),
];

const lesson6: Q[] = [
  mcq('q6-01', 'antigen-terms', 'A substance that induces specific immunological non-responsiveness is a…', 'Tolerogen', ['Allergen', 'Hapten', 'Adjuvant'], { explanation: 'AG slide 6.', skill: 'terminology' }),
  tf({ id: 'q6-02', conceptId: 'antigen-terms', statement: 'All antigens are immunogens.', answer: false, explanation: 'AG slide 5: all immunogens are antigens, but not all antigens are immunogens.', skill: 'misconception' }),
  mcq('q6-03', 'immunogenicity-factors', 'Molecules below about what mass are non-immunogenic?', '1000 Da', ['100,000 Da', '6000 Da', '10 Da'], { explanation: 'AG22 slide 16.' }),
  mcq('q6-04', 'immunogenicity-factors', 'Which route is most immunogenic?', 'Subcutaneous', ['Intravenous', 'Intragastric', 'All are equal'], { explanation: 'AG22 slide 19.' }),
  mcq('q6-05', 'immunogenicity-factors', 'Polymers of D-amino acids are not immunogenic because…', 'APCs cannot degrade and process them', ['They are too small', 'They are self', 'They are lipids'], { explanation: 'AG22 slide 17.', skill: 'cause-effect' }),
  mcq('q6-06', 'epitopes', 'The part of an antibody that binds an epitope is the…', 'Paratope', ['Hapten', 'Carrier', 'Fc region'], { explanation: 'AG slide 22.', skill: 'terminology' }),
  mcq('q6-07', 'epitopes', 'Conformational determinants are recognised mainly by…', 'B cells and antibody', ['T cells only', 'NK cells', 'Complement'], { explanation: 'AG slide 24.' }),
  mcq('q6-08', 'epitopes', 'Which is true of T-cell epitopes?', 'They are linear and need MHC', ['They are conformational', 'They can be polysaccharides', 'They do not need MHC'], { explanation: 'AG22 slide 27.' }),
  mcq('q6-09', 'antigen-classes', 'ABO blood group antigens are…', 'Alloantigens', ['Xenoantigens', 'Autoantigens', 'Haptens'], { explanation: 'AG slides 33–34.' }),
  mcq('q6-10', 'antigen-classes', 'Streptococcal M protein sharing a determinant with kidney basement membrane is an example of a…', 'Heterophile antigen', ['Tumour antigen', 'Hapten', 'Toxoid'], { explanation: 'AG slide 33.' }),
  mcq('q6-11', 'antigen-classes', 'A toxoid is…', 'An exotoxin that has lost toxicity but kept antigenicity', ['An antibody to a toxin', 'An endotoxin', 'An adjuvant'], { explanation: 'AG slide 38.', skill: 'terminology' }),
  multi('q6-12', 'antigen-classes', 'Which are features of T-dependent antigens? Select all that apply.', ['Mostly proteins', 'Induce IgG', 'Immune memory'], ['IgM only'], { explanation: 'AG slide 41.' }),
  mcq('q6-13', 'adjuvants-mitogens', 'Complete Freund’s adjuvant differs from incomplete in containing…', 'Killed mycobacteria', ['Aluminium hydroxide', 'LPS', 'Antibody'], { explanation: 'AG slide 46.' }),
  mcq('q6-14', 'adjuvants-mitogens', 'LPS is a potent mitogen for…', 'B cells', ['T cells only', 'Neutrophils', 'Red cells'], { explanation: 'AG slide 37.' }),
];

const lesson7: Q[] = [
  mcq('q7-01', 'ig-structure', 'Each light chain weighs about…', '23 kDa', ['50 kDa', '150 kDa', '5 kDa'], { explanation: 'AB slide 6; IG22 slide 11.' }),
  mcq('q7-02', 'ig-structure', 'The antigen-binding site is formed by the…', 'Hypervariable regions (CDRs)', ['Hinge', 'Fc region', 'J chain'], { explanation: 'IG22 slide 32.' }),
  mcq('q7-03', 'ig-structure', 'Papain cuts an antibody into…', 'Two Fab fragments and one Fc', ['One F(ab′)₂', 'Four chains', 'Two Fc fragments'], { explanation: 'IG22 slide 27.' }),
  mcq('q7-04', 'ig-structure', 'Variation in the antigen-binding region that gives specificity is the…', 'Idiotype', ['Isotype', 'Allotype', 'Subclass'], { explanation: 'AB slide 7.', skill: 'terminology' }),
  mcq('q7-05', 'ig-structure', 'Antibody class (isotype) is set by the…', 'Heavy chain', ['Light chain', 'Hinge', 'Antigen'], { explanation: 'AB slide 7; IG22 slide 14.' }),
  match('q7-06', 'ig-structure', 'Match each class to its heavy chain.', [
    ['IgG', 'γ'],
    ['IgM', 'μ'],
    ['IgA', 'α'],
    ['IgE', 'ε'],
  ], { explanation: 'IG22 slide 34.' }),
  mcq('q7-07', 'ig-classes', 'Which class is most abundant in serum?', 'IgG', ['IgA', 'IgM', 'IgE'], { explanation: 'AB slide 10.' }),
  mcq('q7-08', 'ig-classes', 'Which is the only class that crosses the placenta?', 'IgG', ['IgM', 'IgA', 'IgD'], { explanation: 'IG22 slide 16.' }),
  mcq('q7-09', 'ig-classes', 'Which class predominates in colostrum?', 'IgA', ['IgG', 'IgM', 'IgE'], { explanation: 'IG22 slide 19.' }),
  mcq('q7-10', 'ig-classes', 'Why is IgM an efficient agglutinator?', 'As a pentamer it has up to ten binding sites', ['It crosses the placenta', 'It binds mast cells', 'It has a secretory component'], { explanation: 'AB slide 11.', skill: 'cause-effect' }),
  mcq('q7-11', 'ig-classes', 'Which class has the lowest serum concentration?', 'IgE', ['IgD', 'IgM', 'IgA'], { explanation: 'AB slide 13.' }),
  mcq('q7-12', 'ig-classes', 'IgD is found mainly…', 'On the surface of naive B cells', ['In secretions', 'On mast cells', 'In colostrum'], { explanation: 'AB slide 14.' }),
  mcq('q7-13', 'ag-ab-binding', 'An antibody binding similar epitopes on different antigens shows…', 'Cross-reactivity', ['Avidity', 'Affinity', 'Valency'], { explanation: 'AB slide 15.', skill: 'terminology' }),
];

const lesson8: Q[] = [
  mcq('q8-01', 'mab-basics', 'Monoclonal antibodies differ from polyclonal ones in that they…', 'Come from one clone and bind one epitope', ['Bind many epitopes', 'Are made by T cells', 'Are always human'], { explanation: 'AB slide 20.' }),
  mcq('q8-02', 'mab-basics', 'A hybridoma is a fusion of…', 'A B cell and a myeloma cell', ['A T cell and a B cell', 'Two myeloma cells', 'A macrophage and a B cell'], { explanation: 'AB slide 19.' }),
  mcq('q8-03', 'mab-basics', 'The B cells used for hybridomas come from the immunised mouse’s…', 'Spleen', ['Liver', 'Thymus', 'Blood only'], { explanation: 'AB slide 34.' }),
  mcq('q8-04', 'mab-types', 'Chimeric antibodies combine…', 'Mouse variable regions and human constant regions', ['Human variable and mouse constant regions', 'Two different antigens', 'Antibody and drug'], { explanation: 'AB slide 23.' }),
  mcq('q8-05', 'mab-types', 'In humanised antibodies, which mouse part is kept?', 'The CDRs', ['The Fc region', 'The constant regions', 'Nothing'], { explanation: 'AB slide 24.' }),
  mcq('q8-06', 'mab-types', 'The first monoclonal antibodies (1975) were…', 'Murine', ['Human', 'Humanised', 'Bispecific'], { explanation: 'AB slide 22.' }),
  mcq('q8-07', 'mab-uses', 'Trastuzumab (Herceptin) targets…', 'HER2', ['CD20', 'CD30', 'CD19'], { explanation: 'AB slide 28.', clinical: true }),
  mcq('q8-08', 'mab-uses', 'Alemtuzumab is used to treat…', 'Chronic lymphocytic leukaemia', ['Breast cancer', 'Hodgkin lymphoma', 'Rheumatoid arthritis only'], { explanation: 'AB slide 28.', clinical: true }),
  mcq('q8-09', 'mab-uses', 'Ibritumomab tiuxetan carries which radioactive agent?', 'Yttrium-90', ['Iodine-131', 'Technetium-99m', 'Cobalt-60'], { explanation: 'AB slide 30.' }),
  mcq('q8-10', 'mab-uses', 'Brentuximab vedotin targets…', 'CD30', ['CD20', 'HER2', 'CD3'], { explanation: 'AB slide 31.' }),
  mcq('q8-11', 'mab-uses', 'The most common mAbs used in cancer are…', 'Naked mAbs', ['Radiolabelled mAbs', 'Bispecific mAbs', 'Chemolabelled mAbs'], { explanation: 'AB slide 27.' }),
  mcq('q8-12', 'mab-uses', 'Antibodies a patient makes against mouse antibodies are called…', 'HAMA', ['HLA', 'ADCC', 'CDR'], { explanation: 'AB slide 38.', skill: 'terminology' }),
  multi('q8-13', 'mab-uses', 'Which are side effects of monoclonal antibodies? Select all that apply.', ['Cytokine release syndrome', 'Injection-site reactions', 'Flu-like symptoms'], ['Increased red cell count'], { explanation: 'AB slide 39.' }),
];

const lesson9: Q[] = [
  mcq('q9-01', 'complement-intro', 'Who showed that serum’s killing activity has heat-stable and heat-labile parts?', 'Jules Bordet', ['Hans Buchner', 'Paul Ehrlich', 'Elie Metchnikoff'], { explanation: 'CM slide 4.' }),
  mcq('q9-02', 'complement-intro', 'Complement activity is destroyed by heating serum at…', '56 °C for 30 minutes', ['37 °C for 1 hour', '100 °C for 1 minute', '4 °C overnight'], { explanation: 'CM slide 4.' }),
  mcq('q9-03', 'complement-intro', 'Where are most complement proteins made?', 'Liver hepatocytes', ['Bone marrow', 'Kidney', 'Lymph nodes'], { explanation: 'CM slide 3; AB slide 43.' }),
  mcq('q9-04', 'complement-pathways', 'Which component of C1 recognises antibody?', 'C1q', ['C1r', 'C1s', 'C4'], { explanation: 'AB slide 47.' }),
  mcq('q9-05', 'complement-pathways', 'Why do two IgG molecules have to lie close together to activate C1?', 'C1q needs two Fc regions and each IgG has one', ['IgG cannot bind antigen alone', 'IgG lacks an Fc', 'C1 binds only IgM'], { explanation: 'AB slide 48.', skill: 'cause-effect' }),
  mcq('q9-06', 'complement-pathways', 'In the alternative pathway, factor B is cleaved by…', 'Factor D', ['Factor H', 'Factor I', 'C1s'], { explanation: 'CM slide 27; AB slide 52.' }),
  mcq('q9-07', 'complement-pathways', 'Which protein stabilises the alternative C3 convertase?', 'Properdin', ['Factor H', 'C1 inhibitor', 'MBL'], { explanation: 'CM slide 28.' }),
  mcq('q9-08', 'complement-pathways', 'Why does C3b not build up on host cells?', 'Sialic acid on mammalian cells inactivates it', ['Host cells lack C3', 'C3b cannot bind any cell', 'Antibody removes it'], { explanation: 'CM slide 25.', skill: 'cause-effect' }),
  mcq('q9-09', 'complement-pathways', 'In the lectin pathway, which proteins act like C1r and C1s?', 'MASP-1 and MASP-2', ['Factor B and D', 'C4 and C2', 'CR1 and CR2'], { explanation: 'AB slide 55.' }),
  mcq('q9-10', 'complement-effects', 'The most powerful chemotactic factor for leucocytes is…', 'C5a', ['C3b', 'C4b', 'C9'], { explanation: 'CM slide 18.' }),
  mcq('q9-11', 'complement-effects', 'Which complement fragment is the main opsonin?', 'C3b', ['C5a', 'C3a', 'C2'], { explanation: 'CM slide 14.' }),
  mcq('q9-12', 'complement-regulation', 'Paroxysmal nocturnal haemoglobinuria results from loss of…', 'CD59 and DAF', ['C1 inhibitor', 'Factor H', 'Properdin'], { explanation: 'CM slide 53.', clinical: true }),
  mcq('q9-13', 'complement-regulation', 'In hereditary angio-oedema attacks, which levels fall?', 'C2 and C4 (C3 normal)', ['C3 only', 'C5–C9', 'All components'], { explanation: 'CM slide 51.', clinical: true }),
  mcq('q9-14', 'complement-testing', 'CH50 tests the integrity of…', 'The whole classical pathway', ['The alternative pathway only', 'C3 alone', 'Antibody levels'], { explanation: 'CM slide 55.' }),
];

const lesson10: Q[] = [
  multi('q10-01', 'infection-principles', 'Which are indirect mechanisms of tissue damage in infection? Select all that apply.', ['Anti-host antibody', 'Immune complex deposition', 'Cell-mediated damage to normal tissue'], ['Exotoxin production'], { explanation: 'IF slide 6.' }),
  order('q10-02', 'infection-principles', 'Order the stages of infection.', ['Entry of the microbe', 'Invasion and colonisation', 'Evasion of immunity', 'Tissue injury'], { explanation: 'IF slide 5.' }),
  mcq('q10-03', 'antiviral-immunity', 'Interferons are induced by…', 'Viral double-stranded RNA', ['Bacterial LPS only', 'Antibody', 'Complement'], { explanation: 'IF slide 8.' }),
  mcq('q10-04', 'antiviral-immunity', 'Type II interferon is…', 'IFN-γ', ['IFN-α', 'IFN-β', 'TNF-α'], { explanation: 'IF0 slide 10; CY slide 5.' }),
  mcq('q10-05', 'antiviral-immunity', 'CD8⁺ CTLs recognise virus-infected cells through…', 'MHC class I', ['MHC class II', 'Fc receptors', 'Complement receptors'], { explanation: 'IF slide 10.' }),
  mcq('q10-06', 'antiviral-immunity', 'A major antigenic change in influenza haemagglutinin is…', 'Antigenic shift', ['Antigenic drift', 'Molecular mimicry', 'ADCC'], { explanation: 'IF slide 11; IF0 slide 18.', skill: 'terminology' }),
  mcq('q10-07', 'antiviral-immunity', 'Antibody-dependent enhancement is seen in…', 'Dengue', ['Polio', 'Measles', 'Rubella'], { explanation: 'IF0 slide 20.' }),
  mcq('q10-08', 'antibacterial-immunity', 'The major defence against extracellular bacteria is…', 'Antibody (humoral immunity)', ['CD8 CTLs', 'NK cells only', 'Interferon'], { explanation: 'IF slide 13.' }),
  mcq('q10-09', 'antibacterial-immunity', 'Neisseria meningitidis avoids antibody by…', 'Varying its pilus antigens', ['Blocking phagolysosome fusion', 'Escaping into the cytosol', 'Making a capsule only'], { explanation: 'IF slide 15.' }),
  mcq('q10-10', 'antibacterial-immunity', 'Listeria monocytogenes evades killing by…', 'Escaping into the cytosol', ['Inhibiting phagolysosome fusion', 'Inactivating NO', 'Antigenic drift'], { explanation: 'IF slide 18.' }),
  mcq('q10-11', 'antibacterial-immunity', 'Activated macrophages kill M. tuberculosis mainly with…', 'Nitric oxide', ['Antibody', 'Complement', 'Lysozyme only'], { explanation: 'IF slide 17.' }),
  match('q10-12', 'fungi-parasites', 'Match each pathogen class to its main defence.', [
    ['Helminths', 'Th2, IgE, eosinophils'],
    ['Intracellular protozoa', 'Th1 cells and macrophages'],
    ['Extracellular protozoa', 'Antibody'],
  ], { explanation: 'IF slides 20–21, 23.' }),
  mcq('q10-13', 'fungi-parasites', 'Cryptococcus evades phagocytosis with…', 'An antiphagocytic capsule', ['Coat switching', 'Antigenic shift', 'IgA protease'], { explanation: 'IF slide 19.' }),
  mcq('q10-14', 'infection-principles', 'Exaggerated hypersensitivity to repeated TB exposure is the…', 'Koch phenomenon', ['Shwartzman reaction', 'Endotoxin shock', 'Arthus reaction'], { explanation: 'IF slide 22.' }),
];

export const questions: Q[] = [
  ...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5,
  ...lesson6, ...lesson7, ...lesson8, ...lesson9, ...lesson10,
];
