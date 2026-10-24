// Biochemistry → Immunology — the ten lessons (reading layer).
// References use the deck codes in sources.ts: "IN slide 12" (introduction),
// "CY slide 9" (cytokines), "RS slide 19" (receptors), "CE slide 42" (cells),
// "AB slide 10" (antibody/mAb/complement), "IG22 slide 27", "AG slide 16"
// (antigens), "AG22 slide 16", "IF slide 8" (infection), "IF0 slide 20",
// "CM slide 46" (complement), "RS0", "CE22".
import type { LessonDraft } from '@/data/topics/build';
import { ab, ag, ag22, ce, ce22, cm, cy, ig22, inf, inf0, intro, rs, rs0, type ConceptId } from '@/data/topics/immunology/sources';
import { interactive, readingExtras } from '@/data/topics/immunology/interactive';

type Draft = LessonDraft<ConceptId>;

const lesson1: Draft = {
  id: 'immunology-1',
  title: 'The History of Immunology',
  description: 'Where the idea of immunity came from, the first vaccines, the argument between cellular and humoral immunity, and the theories that explain antibody specificity.',
  xp: 25,
  sourceRefs: intro([3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22]),
  objectives: [
    'Define immunity and the immune system',
    'Describe the contributions of Jenner and Pasteur to vaccination',
    'Explain the cellular versus humoral debate and how it was resolved',
    'Distinguish the selective, instructional and clonal-selection theories',
  ],
  chunks: [
    {
      title: 'Immunity',
      kind: 'definitions',
      paragraphs: [
        'Immunity comes from the Latin immunis, “exempt” — the state of protection from infectious disease. In 430 BC in Athens, people who had recovered from the plague could nurse the sick without catching it again (IN slide 3).',
        'The immune system is the molecules, cells, tissues and organs that give non-specific and specific protection against microorganisms, their toxins and tumour cells. Not all immune responses protect from disease (IN slide 4).',
      ],
      sourceRefs: intro([3, 4]),
    },
    {
      title: 'The first vaccines',
      kind: 'overview',
      paragraphs: [
        'In 1718 Lady Mary Wortley Montagu saw variolation in Constantinople — smallpox material inhaled or put into small skin cuts — and used it on her own children (IN slide 8).',
        'In 1798 Edward Jenner, noticing that milkmaids who had had cowpox were immune to smallpox, inoculated an eight-year-old boy with cowpox fluid and later with smallpox; the boy did not get smallpox. Jenner is called the “Father of Immunology” (IN slides 8, 21).',
        'Louis Pasteur found that an old culture of fowl cholera bacteria made chickens ill but they recovered and were then protected: ageing had attenuated the pathogen. He called the attenuated strain a vaccine (from vacca, cow). In 1881 at Pouilly-le-Fort, sheep given heat-attenuated anthrax all survived challenge while unvaccinated sheep died; in 1885 he gave attenuated rabies vaccine to Joseph Meister, who lived (IN slides 9–11).',
      ],
      sourceRefs: intro([8, 9, 10, 11, 21]),
    },
    {
      title: 'Cells or serum?',
      kind: 'comparison',
      paragraphs: [
        'In 1883 Elie Metchnikoff showed that cells he called phagocytes (likely monocytes and neutrophils) ingest microbes, and proposed cells as the main effectors — cell-mediated immunity (IN slide 12).',
        'In 1890 von Behring and Kitasato showed that serum from animals immunised against diphtheria transferred immunity — von Behring won the 1901 Nobel prize. Serum activities were named antitoxin, precipitin and agglutinin; in the 1930s Elvin Kabat isolated the responsible gamma-globulin (immunoglobulin) fraction. Immunity carried by body fluids (humors) was called humoral immunity (IN slides 13–14).',
        'Both were right. In the 1940s Merrill Chase transferred immunity to tuberculosis with white cells; in the 1950s the lymphocyte was found to underlie both; Bruce Glick’s chicken experiments showed T lymphocytes (thymus) for cellular immunity and B lymphocytes for humoral immunity (IN slides 15–16).',
        'Later, Miller showed the role of T cells and the thymus, Cooper that B cells secrete antibody, and Steinman that dendritic cells activate T cells (IN slide 22). Bordet, with Ehrlich, von Behring and Kitasato, contributed to soluble factors (IN slide 21).',
      ],
      sourceRefs: intro([12, 13, 14, 15, 16, 21, 22]),
    },
    {
      title: 'How specificity arises',
      kind: 'mechanism',
      paragraphs: [
        'Paul Ehrlich’s selective theory: blood cells carry varied “side-chain” receptors whose specificity is set before exposure; the antigen selects the matching receptor, fitting like lock and key (IN slide 17).',
        'Instructional theories (1930s–40s; Linus Pauling) proposed that antigen acts as a template around which antibody folds. They were disproved (IN slide 18).',
        'Clonal selection, the refined selective theory, is now accepted: each lymphocyte carries receptors for one antigen, with specificity fixed before it meets antigen (IN slide 18).',
      ],
      sourceRefs: intro([17, 18]),
    },
  ],
  summary: [
    'Immunity = protection (immunis = exempt).',
    'Jenner: cowpox → smallpox protection (1798). Pasteur: attenuated vaccines (cholera, anthrax, rabies).',
    'Metchnikoff (cells) vs von Behring/Kitasato (serum): both right — T and B lymphocytes.',
    'Clonal selection: specificity set before antigen exposure.',
  ],
};

const lesson2: Draft = {
  id: 'immunology-2',
  title: 'Innate and Adaptive Immunity',
  description: 'Ways of acquiring immunity, the barriers and cells of innate immunity, and the features and arms of adaptive immunity.',
  xp: 25,
  sourceRefs: intro([24, 25, 26, 28, 29, 32, 33, 34, 43, 53, 54, 55, 56, 57, 58, 60, 61, 62]),
  objectives: [
    'Distinguish natural and artificial, active and passive immunity',
    'Describe the barriers and functions of innate immunity',
    'State the three features of adaptive immunity',
    'Compare humoral and cell-mediated adaptive immunity',
  ],
  chunks: [
    {
      title: 'Acquiring immunity',
      kind: 'classification',
      table: {
        columns: ['', 'Active (long-term)', 'Passive (immediate, short-term)'],
        rows: [
          ['Natural', 'Infection triggers innate and adaptive responses', 'Maternal antibody across the placenta or in breast milk'],
          ['Artificial', 'Vaccination', 'Injected antibodies (immune serum globulins, gamma globulins)'],
        ],
      },
      paragraphs: [
        'A pathogen can cause infection or disease. Infection is the pathogen’s ability to enter, multiply and stimulate an immune response; disease is the clinical manifestation (IN slide 26).',
      ],
      sourceRefs: intro([24, 25, 26]),
    },
    {
      title: 'Innate immunity',
      kind: 'overview',
      paragraphs: [
        'Innate immunity is non-specific, present from birth and acts within minutes to hours. Its cells include neutrophils, dendritic cells, macrophages, NK cells and mast cells; its receptors recognise broad classes of pathogen (PAMPs) (IN slide 32).',
        'Its functions: recruiting immune cells with cytokines, activating complement, removing foreign material, presenting antigen to the adaptive system, and acting as physical and chemical barriers (IN slide 43). Complement — over 30 proteins made by hepatocytes, macrophages and gut epithelium — is part of innate immunity but can be activated by antibody (IN slide 53).',
        'Immunity is part of the neuroendocrine-immune (NEI) network (IN slide 28).',
      ],
      table: {
        columns: ['Barrier', 'Examples'],
        rows: [
          ['Anatomical', 'Skin (sweat, desquamation); mucus and cilia; cough, sneeze, vomiting, diarrhoea; flushing by tears, saliva, urine'],
          ['Physiological', 'Body temperature; low pH of stomach, skin and vagina'],
          ['Chemical', 'Lysozyme (tears, mucosa); lactoperoxidase; β-defensins (skin, airways); surfactant proteins A and D (opsonins in the lung)'],
        ],
      },
      sourceRefs: intro([28, 29, 32, 33, 34, 43, 53]),
    },
    {
      title: 'Adaptive immunity',
      kind: 'mechanism',
      paragraphs: [
        'Adaptive immunity is acquired on exposure to antigen, takes days to weeks, and is specific, diverse (at least a billion threats) and has memory. Antigen recognition causes clonal expansion into effector cells and memory cells (IN slides 54–56).',
        'B and T cells arise from bone marrow stem cells; B cells mature in the bone marrow, T cells in the thymus (as helper and cytotoxic cells). They wait, naive, in lymph nodes, spleen and lymphoid tissue (IN slide 57).',
        'Humoral immunity: antibodies from plasma cells kill pathogens, neutralise toxins and opsonise. Cell-mediated immunity: CD8⁺ cytotoxic and CD4⁺ helper T cells recognise peptide on MHC molecules, distinguishing self from non-self (IN slides 58, 61, 62).',
      ],
      notes: [{ kind: 'check', text: 'IN slide 28 calls adaptive immunity the second line of defence and slide 55 the third. The line number is not quizzed.' }],
      sourceRefs: intro([54, 55, 56, 57, 58, 60, 61, 62]),
    },
  ],
  summary: [
    'Active (infection, vaccine) = long-term; passive (maternal, injected antibody) = immediate, short-term.',
    'Innate: non-specific, from birth, minutes–hours; anatomical, physiological, chemical barriers.',
    'Adaptive: specific, diverse, memory; B cells (antibody) and T cells (CD4, CD8).',
  ],
};

const lesson3: Draft = {
  id: 'immunology-3',
  title: 'Recognising Pathogens and Inflammation',
  description: 'How the innate immune system recognises microbes through PAMPs and pattern recognition receptors, what happens next, and the signs and steps of acute inflammation.',
  xp: 25,
  sourceRefs: [...intro([44, 45, 46, 47, 48, 49, 50, 51, 52]), ...ce([28, 30, 34, 35]), ...inf0([28, 31])],
  objectives: [
    'Define PAMPs and give examples',
    'Match the PRR families to their location and ligands',
    'Outline signalling from PRR to cytokines',
    'Describe the signs and vascular and cellular events of acute inflammation',
  ],
  chunks: [
    {
      title: 'PAMPs',
      kind: 'definitions',
      paragraphs: [
        'Pathogen-associated molecular patterns are conserved molecular signatures of microbes, absent from host cells, essential to the microbe (so they rarely mutate) and shared across broad classes — a pathogen’s “fingerprint” (IN slide 44).',
      ],
      table: {
        columns: ['PAMP', 'Source'],
        rows: [
          ['Lipopolysaccharide (LPS)', 'Gram-negative cell wall'],
          ['Peptidoglycan', 'Bacterial cell wall'],
          ['Flagellin', 'Bacterial flagella'],
          ['Double-stranded RNA', 'Viral replication'],
          ['Unmethylated CpG DNA', 'Bacterial and viral genomes'],
        ],
      },
      sourceRefs: intro([44]),
    },
    {
      title: 'PRRs',
      kind: 'classification',
      table: {
        columns: ['Receptor', 'Location', 'Detects'],
        rows: [
          ['Toll-like receptors (TLRs)', 'Plasma membrane and endosomes', 'LPS, flagellin, viral RNA/DNA'],
          ['NOD-like receptors (NLRs)', 'Cytoplasm', 'Peptidoglycan fragments, danger signals'],
          ['RIG-I-like receptors (RLRs)', 'Cytoplasm', 'Viral dsRNA'],
          ['C-type lectin receptors (CLRs)', 'Cell surface', 'Fungal β-glucans'],
        ],
      },
      paragraphs: [
        'PAMP → PRR → adaptors (MyD88/TRIF) → transcription factors (NF-κB/IRF) → cytokines: inflammation, recruitment, fever and signals that hand over to adaptive immunity (IN slide 46).',
        'TLR examples: LPS → TLR4 (with CD14); flagellin → TLR5; CpG DNA → TLR9; peptidoglycan and lipoteichoic acid → TLR2; peptidoglycan fragments → NOD1 and NOD2 in the cytosol (IN slide 50; IF0 slide 31).',
        'Phagocytes also use mannose and scavenger receptors (scavenger receptors bind apoptotic cells via phosphatidylserine) and opsonic receptors — the IgG Fc receptor and complement receptor CR1 (CE slides 30, 35).',
        'Clinical relevance: PRR agonists act as vaccine adjuvants; excessive PRR signalling drives sepsis and cytokine storm; misdirected recognition may trigger lupus; PRR drugs aid cancer immunotherapy (IN slide 47).',
      ],
      notes: [{ kind: 'check', text: 'CE slide 30 labels teichoic acid as Gram-negative and LPS as Gram-positive, the reverse of IN slide 44. Lessons follow IN slide 44.' }],
      sourceRefs: [...intro([45, 46, 47, 48, 49, 50]), ...ce([28, 30, 34, 35]), ...inf0([28, 31])],
    },
    {
      title: 'Acute inflammation',
      kind: 'mechanism',
      paragraphs: [
        'Signs: redness and heat (increased blood flow and metabolism), swelling (leaky capillaries, from histamine and other chemicals), pain (pressure and kinins, prostaglandins), and sometimes loss of function. Acute inflammation is local and non-specific, lasting about 8–10 days, and may become chronic (IN slide 51).',
        'Vascular changes: arteriolar vasodilation, increased capillary permeability and display of cell adhesion molecules, forming exudate. Cell recruitment: margination, diapedesis and chemotaxis of neutrophils along chemical gradients from mast cells and injured tissue (IN slide 52).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on IN slides 51–52 were added to the deck and are not quizzed.' }],
      sourceRefs: intro([51, 52]),
    },
  ],
  summary: [
    'PAMPs: LPS, peptidoglycan, flagellin, dsRNA, CpG DNA.',
    'TLR (membrane/endosome), NLR and RLR (cytoplasm), CLR (surface).',
    'PRR → MyD88/TRIF → NF-κB/IRF → cytokines.',
    'Inflammation: redness, heat, swelling, pain, loss of function; margination → diapedesis → chemotaxis.',
  ],
};

const lesson4: Draft = {
  id: 'immunology-4',
  title: 'Cells of the Immune System',
  description: 'Where immune cells come from, how CD markers identify them, and the jobs of macrophages, granulocytes, mast cells, dendritic cells, NK and NKT cells.',
  xp: 25,
  sourceRefs: [...ce([3, 5, 7, 10, 15, 17, 19, 21, 22, 24, 36, 37, 38, 42, 44, 45, 46, 47, 48, 50, 51, 53, 56, 58, 60]), ...ce22([54, 55]), ...intro([41, 42])],
  objectives: [
    'Describe blood composition and haematopoiesis',
    'Use CD markers to identify immune cells',
    'Describe macrophage functions and phagocytic killing',
    'Describe the features of neutrophils, eosinophils, basophils, mast cells, dendritic cells and NK cells',
  ],
  chunks: [
    {
      title: 'Blood and haematopoiesis',
      kind: 'overview',
      paragraphs: [
        'Blood is about 55% plasma and 45% cells: red cells, white cells (lymphocytes, macrophages, granulocytes) and platelets (CE slide 3). Plasma is 90% water and 6–8% protein (CE slide 5).',
        'Haematopoiesis — proliferation, differentiation and maturation of blood cells — happens mostly in bone marrow from stem cells, regulated by cytokines and growth factors (CE slide 7).',
        'Myeloid cells: granulocytes (neutrophils, eosinophils, basophils) and monocytes/macrophages, dendritic cells. Lymphoid cells: T, B and NK cells. Innate cells are monocytes/macrophages, granulocytes, dendritic cells and NK cells; adaptive cells are B and T lymphocytes (CE slides 10, 22).',
      ],
      sourceRefs: [...ce([3, 5, 7, 10, 22]), ...intro([41, 42])],
    },
    {
      title: 'CD markers',
      kind: 'definitions',
      paragraphs: [
        'A cluster of differentiation (CD) is a cell surface molecule recognised by two specific monoclonal antibodies; the nomenclature dates from 1982 and there are over 300 (CE slides 15, 19).',
      ],
      table: {
        columns: ['Cell', 'Markers'],
        rows: [
          ['All leucocytes', 'CD45'],
          ['T cell', 'CD3 (helper CD4, cytotoxic CD8)'],
          ['B cell', 'CD19'],
          ['NK cell', 'CD16, CD56, CD3-negative'],
          ['Monocyte/macrophage', 'CD14'],
          ['Granulocyte', 'CD15'],
          ['Dendritic cell', 'CD1c'],
        ],
      },
      sourceRefs: ce([15, 17, 19, 21]),
    },
    {
      title: 'Macrophages and neutrophils',
      kind: 'mechanism',
      paragraphs: [
        'Monocytes circulate with a half-life of about 8 hours and become tissue macrophages, 5–10 times larger with more organelles and greater phagocytic power. Macrophages ingest and digest pathogens, process and present antigen, and secrete factors (IN slide 42; CE slides 24, 60).',
        'Oxygen-dependent killing: the respiratory burst (NADPH oxidase) makes superoxide, H₂O₂ and hydroxyl radicals; inducible NO synthase makes nitric oxide, which with superoxide forms peroxynitrite. Oxygen-independent killing: lysozyme, defensins and hydrolytic enzymes (CE slides 36–38).',
        'Neutrophils are 50–70% of white cells, first to arrive at inflammation and live 2–3 days. They have a larger respiratory burst than macrophages and are more likely to kill what they ingest; secondary granules contain collagenase, lactoferrin and lysozyme (CE slides 42, 44).',
      ],
      sourceRefs: [...ce([24, 36, 37, 38, 42, 44, 60]), ...intro([42])],
    },
    {
      title: 'Other innate cells',
      kind: 'comparison',
      table: {
        columns: ['Cell', 'Key features'],
        rows: [
          ['Eosinophil', '1–3% of white cells; granules damage parasite membranes'],
          ['Basophil', '<1%; non-phagocytic; histamine and leukotrienes; allergy'],
          ['Mast cell', 'In mucosa and connective tissue, not in blood; like basophils'],
          ['Dendritic cell', 'Long membrane extensions; take up, process and present antigen; high MHC II and co-stimulators'],
        ],
      },
      sourceRefs: ce([45, 46, 47, 48]),
    },
    {
      title: 'NK and NKT cells',
      kind: 'mechanism',
      paragraphs: [
        'NK cells are large granular lymphocytes with no specific antigen receptor and no thymic development (nude mice, lacking a thymus, still have NK cells). Markers: CD16 (IgG Fc receptor) and CD56 (CE slide 50).',
        'They are the first line against virus-infected and tumour cells, killing by perforin/granzyme (the most common), FasL–Fas, and antibody-dependent cell-mediated cytotoxicity (ADCC) (CE slides 51, 53).',
        'They balance activating receptors (ITAM motifs) and inhibitory receptors (ITIM motifs) such as KIRs, whose ligand is MHC class I (CE slide 56; CE22 slides 54–55).',
        'NKT cells have T-cell receptors recognising CD1-presented antigen and NK markers, and kill tumour and virus-infected cells (CE slide 58).',
      ],
      sourceRefs: [...ce([50, 51, 53, 56, 58]), ...ce22([54, 55])],
    },
  ],
  summary: [
    'Myeloid: granulocytes, monocytes/macrophages, DCs. Lymphoid: T, B, NK.',
    'CD3 T, CD4 helper, CD8 cytotoxic, CD19 B, CD56/CD16 NK, CD14 monocyte.',
    'Neutrophils: 50–70%, first responders, biggest respiratory burst.',
    'NK cells: no antigen receptor; perforin/granzyme, Fas, ADCC; KIRs see MHC I.',
  ],
};

const lesson5: Draft = {
  id: 'immunology-5',
  title: 'Cytokines and Chemokines',
  description: 'What cytokines are, how they act, their receptor families and JAK/STAT signalling, how they shape helper T-cell responses, and the diseases and drugs built around them.',
  xp: 25,
  sourceRefs: [...cy([4, 5, 7, 9, 12, 13, 14, 16, 17, 19, 21, 23]), ...rs([3, 4, 5, 6, 8, 14, 16, 19, 20, 21, 22, 23, 24]), ...rs0([21, 22, 24])],
  objectives: [
    'Define cytokine, lymphokine, monokine, interleukin and chemokine',
    'Describe the properties and modes of action of cytokines',
    'Describe the receptor families and the JAK/STAT pathway',
    'Link cytokines to helper T-cell subsets, disease and therapy',
  ],
  chunks: [
    {
      title: 'What cytokines are',
      kind: 'definitions',
      paragraphs: [
        'A cytokine is a secreted, low-molecular-weight protein that regulates the nature, intensity and duration of the immune response (CY slide 4; RS slide 3).',
        'Classes: interleukins, interferons (type I: IFN-α, IFN-β; type II: IFN-γ), tumour necrosis factors, colony-stimulating factors (G-CSF, M-CSF, GM-CSF), transforming growth factors and chemokines (CY slide 5).',
      ],
      terms: [
        { term: 'Lymphokine', meaning: 'Made by activated lymphocytes, especially TH cells (e.g. IL-2, IFN-γ).' },
        { term: 'Monokine', meaning: 'Made by mononuclear phagocytes (e.g. TNF-α, IL-1, CXCL9).' },
        { term: 'Interleukin', meaning: '“Between leukocytes”; numbered sequentially.' },
        { term: 'Chemokine', meaning: 'Chemoattractant cytokine; CXCL8 (IL-8) recruits neutrophils into tissues.' },
      ],
      sourceRefs: [...cy([4, 5]), ...rs([3, 4])],
    },
    {
      title: 'Properties',
      kind: 'mechanism',
      paragraphs: [
        'Cytokines are made on demand, not stored — so the response takes hours. They have short half-lives, bind receptors with very high (pM–nM) affinity, and act at low concentration. Many cells make them; TH cells and macrophages are the principal producers (CY slide 7; RS slide 14).',
        'They act on the producing cell (autocrine), nearby cells (paracrine) or distant cells via blood (endocrine — e.g. fever, acute phase) (CY slide 7).',
      ],
      table: {
        columns: ['Property', 'Example'],
        rows: [
          ['Pleiotropic', 'IL-4 acts on B cells, T cells, mast cells, macrophages'],
          ['Redundant', 'IL-2, IL-4, IL-5 all promote B-cell proliferation'],
          ['Synergistic', 'IL-4 + IL-5 enhance IgE production'],
          ['Antagonistic', 'IFN-γ suppresses Th2; IL-10 suppresses Th1'],
          ['Cascade induction', 'TNF-α → IL-1 → IL-6 → IL-8'],
          ['Receptor sharing', 'Common γ-chain of IL-2, 4, 7, 9, 15, 21 receptors — its loss causes X-linked SCID'],
        ],
      },
      sourceRefs: [...cy([7, 9]), ...rs([6, 8, 14])],
    },
    {
      title: 'Receptors and JAK/STAT',
      kind: 'pathway',
      table: {
        columns: ['Family', 'Examples', 'Signalling'],
        rows: [
          ['Immunoglobulin superfamily', 'IL-1R, IL-18R, M-CSFR', 'Src kinases / PI3K'],
          ['Hematopoietin (class I)', 'IL-2R, IL-4R, IL-6R, EPOR', 'JAK/STAT'],
          ['Interferon (class II)', 'IFN-α/β R, IFN-γ R, IL-10R', 'JAK/STAT'],
          ['TNF receptor', 'TNFR1, TNFR2, Fas, RANK', 'TRAF → NF-κB / caspases'],
          ['Chemokine receptor', 'CXCR1–7, CCR1–10', 'G-protein coupled'],
          ['TGF-β receptor', 'TGFβR1/2, BMPR', 'SMAD'],
        ],
      },
      paragraphs: [
        'Class I and II receptors are the most abundant. JAK/STAT: cytokine binds → receptor subunits dimerise → JAKs (JAK1, JAK2, TYK2) trans-phosphorylate → STATs recruited and phosphorylated → STATs dimerise, enter the nucleus and switch on genes (CY slides 13–14).',
      ],
      sourceRefs: [...cy([12, 13, 14]), ...rs([19])],
    },
    {
      title: 'Helper T-cell subsets and regulation',
      kind: 'regulation',
      table: {
        columns: ['Subset', 'Induced by', 'Master factor', 'Makes', 'Role'],
        rows: [
          ['Th1', 'IL-12, IFN-γ', 'T-bet', 'IFN-γ, TNF, IL-2', 'Macrophage activation; intracellular microbes'],
          ['Th2', 'IL-4', 'GATA-3', 'IL-4, IL-5, IL-13', 'B-cell help, IgE, helminths, allergy'],
          ['Th17', 'TGF-β + IL-6; IL-23', 'RORγt', 'IL-17, IL-22', 'Neutrophil recruitment; antifungal'],
          ['Treg', 'TGF-β, IL-2', 'FoxP3', 'IL-10, TGF-β', 'Suppression; prevent autoimmunity'],
          ['Tfh', 'IL-6, IL-21', 'Bcl-6', 'IL-21, IL-4', 'B-cell help in germinal centres'],
        ],
      },
      paragraphs: [
        'Th1 and Th2 cytokines promote their own subset and inhibit the other; diseases such as leprosy and AIDS depend on the balance (CY slide 23; RS0 slide 24).',
        'Cytokine action is limited by transient production, short half-life, restricted receptor expression, antagonistic cytokines (IL-10, TGF-β) and decoy receptors. Antagonists such as IL-1Ra bind the receptor without activating it; some viruses (poxviruses) make cytokine-binding proteins (CY slide 17; RS0 slide 21).',
      ],
      sourceRefs: [...cy([16, 17, 23]), ...rs([16]), ...rs0([21, 22, 24])],
    },
    {
      title: 'Diseases and therapies',
      kind: 'clinical',
      table: {
        columns: ['Condition', 'Mechanism'],
        rows: [
          ['Bacterial septic shock', 'LPS → TLR4 on DCs and macrophages → excess IL-1 and TNF-α: fever, hypotension, DIC, organ failure'],
          ['Toxic shock syndrome', 'Superantigens (TSST-1) bridge MHC II and TCR Vβ, activating up to 20% of T cells (vs <0.01% normally)'],
          ['X-linked SCID', 'IL-2Rγ (common γ-chain) mutation: no T or NK cells, non-functional B cells'],
          ['COVID-19 cytokine storm', 'Excess IL-6, IL-1β, IFN-γ, TNF-α: ARDS, organ failure, thrombosis'],
          ['Chagas disease', 'T. cruzi factor cuts T-cell IL-2 receptor (CD25) by 90%'],
          ['Cancer', 'IL-6 overproduction in cardiac myxoma and myeloma'],
          ['Defective IFN-γ receptor', 'Susceptibility to mycobacteria'],
        ],
      },
      paragraphs: [
        'Therapy is hard: dosing, very short half-life, pleiotropic side effects. Strategies: cytokine agonists (IFN-β for MS, EPO), neutralising antibodies (adalimumab, anti-TNF, for RA and IBD), receptor blockers (tocilizumab, anti-IL-6R; dupilumab, anti-IL-4Rα), receptor antagonists (anakinra, IL-1Ra) and JAK inhibitors (baricitinib, ruxolitinib) (CY slides 19, 21).',
      ],
      sourceRefs: [...cy([19, 21, 23]), ...rs([20, 21, 22, 23, 24])],
    },
  ],
  summary: [
    'Cytokines: made on demand, short-lived, high-affinity; autocrine, paracrine, endocrine.',
    'Pleiotropic, redundant, synergistic, antagonistic, cascades, shared receptors (common γ-chain → X-SCID).',
    'Class I/II receptors → JAK/STAT; chemokine receptors are GPCRs; TGF-β → SMAD.',
    'IL-12 → Th1 (T-bet); IL-4 → Th2 (GATA-3); TGF-β + IL-6 → Th17; TGF-β → Treg (FoxP3).',
  ],
};

const lesson6: Draft = {
  id: 'immunology-6',
  title: 'Antigens',
  description: 'Immunogens, antigens and haptens; what makes a substance immunogenic; epitopes; the classes of antigen; T-dependent and T-independent antigens; and adjuvants and mitogens.',
  xp: 25,
  sourceRefs: [...ag([5, 6, 15, 16, 19, 22, 23, 24, 26, 28, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]), ...ag22([6, 16, 17, 19, 20, 21, 27, 28, 33])],
  objectives: [
    'Distinguish immunogen, antigen, hapten, allergen and tolerogen',
    'List the factors that affect immunogenicity',
    'Compare T-cell and B-cell epitopes and conformational and linear determinants',
    'Classify antigens and contrast TD and TI antigens',
    'Describe adjuvants, mitogens and superantigens',
  ],
  chunks: [
    {
      title: 'Definitions',
      kind: 'definitions',
      paragraphs: [
        'An immunogen induces an immune response; an antigen binds specifically to its products (antibody or TCR). All immunogens are antigens, but not all antigens are immunogens (AG slides 5–6).',
        'Haptens are low-molecular-weight substances (e.g. antibiotics, drugs) that cannot induce a response alone but react with antibody; coupled to a carrier protein they induce antibodies against both hapten and carrier (AG slides 15–16).',
      ],
      terms: [
        { term: 'Allergen', meaning: 'Induces an allergic response (allergenicity).' },
        { term: 'Tolerogen', meaning: 'Induces specific immunological non-responsiveness (tolerogenicity).' },
      ],
      notes: [{ kind: 'check', text: 'AG22 slides 3–4 treat antigen and immunogen as near-synonyms; the lesson follows AG slide 5.' }],
      sourceRefs: [...ag([5, 6, 15, 16]), ...ag22([6])],
    },
    {
      title: 'What makes a good immunogen',
      kind: 'regulation',
      paragraphs: [
        'Foreignness (substances not met by lymphocytes in embryonic life); molecular weight (<1000 Da non-immunogenic, 1000–6000 may be, >6000 immunogenic); chemical complexity; and degradability — APCs must be able to process it, so D-amino acid polymers are not immunogenic (AG22 slides 16–17).',
        'Particulate beats soluble, denatured beats native. Route: subcutaneous > intravenous > intragastric. Genetics determine responders and non-responders (AG22 slides 17–19).',
        'Proteins are the best immunogens; carbohydrates usually good; nucleic acids and lipids poor unless coupled to carriers (AG22 slide 21).',
      ],
      sourceRefs: ag22([16, 17, 19, 21]),
    },
    {
      title: 'Epitopes',
      kind: 'structure',
      paragraphs: [
        'An epitope (antigenic determinant) is the smallest part of an antigen that binds antibody or TCR; it fits the antibody’s hypervariable region, the paratope. Antigenic valence is the number of epitopes: most natural antigens are polyvalent; haptens are monovalent (AG slides 19, 22, 23).',
        'Conformational determinants are residues brought together by folding, on the surface, recognised by B cells. Linear (sequential) determinants are adjacent residues, on the surface or inside, recognised mainly by T cells (AG slide 24).',
      ],
      table: {
        columns: ['', 'T-cell epitope', 'B-cell epitope'],
        rows: [
          ['Structure', 'Linear', 'Conformational or linear'],
          ['Receptor', 'TCR', 'BCR'],
          ['Nature', 'Protein', 'Protein, polysaccharide'],
          ['Size', '8–23 amino acids', '5–15 amino acids'],
          ['MHC', 'Required', 'Not required'],
        ],
      },
      sourceRefs: [...ag([19, 22, 23, 24, 26]), ...ag22([27, 28])],
    },
    {
      title: 'Classes of antigen',
      kind: 'classification',
      paragraphs: [
        'Exogenous antigens enter by inhalation, ingestion or injection, are processed by APCs and shown on MHC class II to helper T cells. Endogenous antigens arise inside cells (normal metabolism, viruses, intracellular bacteria) and are shown on MHC class I to cytotoxic CD8⁺ T cells (AG slides 28, 31).',
        'Xenoantigens come from other species; alloantigens from other individuals of the same species (ABO, Rh, HLA); autoantigens from oneself (lens protein; released sequestered antigen). Heterophile (Forssman) antigens are shared across species — e.g. streptococcal M protein and kidney basement membrane — causing cross-reactions that matter in disease and diagnosis (AG slides 33–35, 39).',
        'Tumour-specific antigens are found only on tumour cells; tumour-associated antigens (AFP, CEA) are high on tumours but low on normal cells (AG slide 35).',
        'Exotoxins of Gram-positive bacteria are strongly antigenic; a toxoid has lost toxicity but kept antigenicity; antibody to either is antitoxin (AG slide 38).',
      ],
      table: {
        columns: ['', 'T-dependent antigen', 'T-independent antigen'],
        rows: [
          ['Needs T-cell help', 'Yes', 'No'],
          ['Usually', 'Protein, many kinds of epitope', 'Polysaccharide, repeating epitopes'],
          ['Antibody', 'IgG, IgM, IgA', 'IgM only'],
          ['Cell-mediated immunity', 'Yes', 'No'],
          ['Memory', 'Yes', 'No'],
        ],
      },
      sourceRefs: [...ag([28, 31, 33, 34, 35, 38, 39, 40, 41, 42]), ...ag22([33])],
    },
    {
      title: 'Adjuvants and mitogens',
      kind: 'mechanism',
      paragraphs: [
        'An adjuvant non-specifically enhances or changes the immune response when given before or with antigen: it alters the antigen’s physical form, improves processing by macrophages, stimulates lymphocytes and releases antigen slowly. Examples: BCG, aluminium hydroxide (alum, the most widely used), poly I:C, and Freund’s adjuvant — antigen in mineral oil; the complete form adds killed mycobacteria (AG slides 43–47; AG22 slide 20).',
        'Mitogens make a high percentage of T or B cells divide. Concanavalin A and phytohaemagglutinin are T-cell mitogens; pokeweed mitogen stimulates T and B cells; LPS (Gram-negative endotoxin) is a potent B-cell mitogen. Superantigens are the most potent T-cell mitogens and cause toxic shock (AG slides 36–37).',
      ],
      sourceRefs: [...ag([36, 37, 43, 44, 45, 46, 47]), ...ag22([20])],
    },
  ],
  summary: [
    'All immunogens are antigens, not vice versa. Hapten + carrier = immunogen.',
    'Immunogenic: foreign, >6000 Da, complex, degradable; proteins best.',
    'Exogenous → MHC II → CD4; endogenous → MHC I → CD8.',
    'TD antigens: protein, IgG, memory. TI antigens: polysaccharide, IgM only, no memory.',
  ],
};

const lesson7: Draft = {
  id: 'immunology-7',
  title: 'Antibodies',
  description: 'Immunoglobulin structure, fragments and variation; the five classes and what each does; and how antibodies bind antigen.',
  xp: 25,
  sourceRefs: [...ab([4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16]), ...ig22([4, 8, 10, 11, 12, 14, 15, 16, 19, 20, 21, 23, 25, 26, 27, 29, 32, 34])],
  objectives: [
    'Describe the four-chain structure of immunoglobulins',
    'Describe Fab, Fc and F(ab′)₂ fragments and hypervariable regions',
    'Distinguish isotypes, allotypes and idiotypes',
    'Describe the structure and functions of IgG, IgM, IgA, IgE and IgD',
  ],
  chunks: [
    {
      title: 'Structure',
      kind: 'structure',
      paragraphs: [
        'Antibodies are glycoproteins made by plasma cells, mostly in the γ-globulin fraction of serum (serum = plasma minus fibrinogen). γ-Globulin is a physical term; immunoglobulin a functional one (IG22 slides 4, 8).',
        'The basic unit is two identical light chains (23 kDa) and two identical heavy chains, held by inter- and intra-chain disulfide bonds and non-covalent forces into a Y. Light chains have VL and CL domains; heavy chains VH and CH1–CH3 (or CH4). The hinge gives flexibility (AB slide 6; IG22 slides 11–12).',
        'Hypervariable regions — complementarity-determining regions (CDRs) — form the antigen-binding site (IG22 slide 32). Papain (from papaya) cuts antibody into two Fab fragments (antigen binding, valence 1) and Fc (crystallisable, effector functions); F(ab′)₂ is two Fab-like arms together, divalent (IG22 slides 27, 29).',
        'Membrane Ig is the B-cell receptor; secreted Ig acts in humoral immunity (IG22 slide 10).',
      ],
      table: {
        columns: ['Variation', 'Meaning'],
        rows: [
          ['Isotype', 'Class: IgG, IgA, IgM, IgD, IgE — set by the heavy chain (γ, α, μ, δ, ε)'],
          ['Allotype', 'Allelic amino acid differences between individuals'],
          ['Idiotype', 'Sequence of the antigen-binding region — gives specificity'],
        ],
      },
      sourceRefs: [...ab([4, 5, 6, 7]), ...ig22([4, 8, 10, 11, 12, 14, 27, 29, 32, 34])],
    },
    {
      title: 'The five classes',
      kind: 'comparison',
      table: {
        columns: ['Class', 'Form', 'Key points'],
        rows: [
          ['IgG', 'Monomer; 4 subclasses', 'Highest in serum (75–80%); only class to cross the placenta; secondary response and memory; opsonises, fixes complement, neutralises'],
          ['IgA', 'Monomer in serum; dimer with J chain in secretions', '2nd highest; secretory component protects it; in tears, saliva, milk (colostrum), gut; blocks attachment at mucosae'],
          ['IgM', 'Pentamer with J chain', '3rd highest; first in a primary response (marker of recent infection); up to 10 binding sites; best agglutinator and classical complement activator; stays in blood'],
          ['IgD', 'Monomer', '<1% of serum; on naive B cells with IgM as antigen receptor'],
          ['IgE', 'Monomer with extra CH4', 'Lowest; binds mast cells and basophils by Fc; immediate hypersensitivity; parasites'],
        ],
      },
      sourceRefs: [...ab([10, 11, 12, 13, 14]), ...ig22([15, 16, 19, 20, 21, 23, 25, 26])],
    },
    {
      title: 'Binding antigen',
      kind: 'mechanism',
      paragraphs: [
        'Antibodies recognise the shape of epitopes; the better the fit, the stronger the binding (AB slide 15).',
        'Affinity is the strength of one epitope binding one antigen-binding site; avidity is the overall strength of the antigen–antibody complex; cross-reactivity is binding to similar epitopes on different antigens (AB slide 15).',
        'Outcomes: agglutination, complement activation, phagocytic clearance, and initiation of cellular and humoral responses (AB slide 16). Antibodies also bind Fc receptors on phagocytes, NK cells and mast cells for phagocytosis or ADCC (IG22 slides 9, 17).',
      ],
      sourceRefs: [...ab([15, 16]), ...ig22([9, 17])],
    },
  ],
  summary: [
    'H₂L₂ Y: light chain 23 kDa; V and C regions; hinge; CDRs bind antigen.',
    'Papain → 2 Fab + Fc; F(ab′)₂ is divalent.',
    'IgG: most abundant, crosses placenta. IgM: pentamer, first. IgA: secretions. IgE: allergy, parasites. IgD: B-cell receptor.',
    'Affinity (one site) vs avidity (whole complex).',
  ],
};

const lesson8: Draft = {
  id: 'immunology-8',
  title: 'Monoclonal Antibodies',
  description: 'What monoclonal antibodies are, how hybridomas make them, how they are named, the conjugated and bispecific forms used in cancer, and their uses and limits.',
  xp: 25,
  sourceRefs: ab([18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39]),
  objectives: [
    'Distinguish monoclonal from polyclonal antibodies',
    'Describe hybridoma production and HAT selection',
    'Match murine, chimeric, humanised and human mAbs to their name endings',
    'Describe naked, conjugated and bispecific mAbs, uses and side effects',
  ],
  chunks: [
    {
      title: 'Making monoclonals',
      kind: 'pathway',
      paragraphs: [
        'Monoclonal antibodies come from a single clone and bind a single epitope; polyclonal antibodies bind many (AB slides 19–20).',
        'An animal (usually a mouse) is immunised repeatedly; B cells from its spleen are fused with immortal myeloma cells to make hybridomas. In HAT medium (hypoxanthine, aminopterin, thymidine) only hybridomas grow — unfused myeloma cells cannot and unfused B cells die. Hybridomas are screened, grown and the antibody purified (AB slides 19, 34–35).',
      ],
      sourceRefs: ab([18, 19, 20, 34, 35]),
    },
    {
      title: 'Kinds by origin',
      kind: 'classification',
      table: {
        columns: ['Type', 'Made of', 'Name ends'],
        rows: [
          ['Murine', 'Mouse (first made in 1975)', '-omab'],
          ['Chimeric', 'Mouse variable + human constant regions', '-ximab'],
          ['Humanised', 'Human except the mouse CDRs', '-zumab'],
          ['Human', 'Fully human', '-umab'],
        ],
      },
      paragraphs: [
        'Chimeric and humanised forms reduce immunogenicity and lengthen half-life while keeping specificity (AB slides 23–24).',
      ],
      sourceRefs: ab([21, 22, 23, 24, 25]),
    },
    {
      title: 'Kinds by function',
      kind: 'clinical',
      paragraphs: [
        'Naked mAbs, the most common in cancer, carry no drug: alemtuzumab marks CLL cells for destruction; trastuzumab (Herceptin) blocks HER2 in breast and stomach cancer (AB slides 27–28).',
        'Conjugated mAbs home drugs or radiation to cancer cells, sparing normal cells. Radiolabelled: ibritumomab tiuxetan (rituximab + yttrium-90, anti-CD20) — radioimmunotherapy. Chemolabelled: brentuximab vedotin (anti-CD30 + MMAE) and ado-trastuzumab emtansine (anti-HER2 + DM1) (AB slides 29–31).',
        'Bispecific mAbs join two antibodies: blinatumomab binds CD19 on leukaemia cells and CD3 on T cells, bringing them together (AB slide 32).',
      ],
      sourceRefs: ab([26, 27, 28, 29, 30, 31, 32]),
    },
    {
      title: 'Uses and limits',
      kind: 'clinical',
      paragraphs: [
        'Uses: treating cancers, rheumatoid arthritis, MS, SLE, Crohn’s, ulcerative colitis, psoriasis and transplant rejection; identifying cell markers; immunoassays for diagnosis; identifying tumour origin in tissue sections (AB slides 36–37).',
        'Patients given mouse antibodies may make human anti-mouse antibodies (HAMA), which block or clear the drug and can cause serum sickness; humanised antibodies are much less likely to (AB slide 38).',
        'Side effects: injection-site reactions, flu-like symptoms, sores, hypertension, heart failure, lung inflammation, allergy and cytokine release syndrome (AB slide 39).',
      ],
      sourceRefs: ab([36, 37, 38, 39]),
    },
  ],
  summary: [
    'Monoclonal = one clone, one epitope. Hybridoma = B cell + myeloma; HAT selects.',
    '-omab murine, -ximab chimeric, -zumab humanised, -umab human.',
    'Naked, radiolabelled (ibritumomab), chemolabelled (brentuximab), bispecific (blinatumomab).',
    'HAMA response → serum sickness; humanised reduces it.',
  ],
};

const lesson9: Draft = {
  id: 'immunology-9',
  title: 'The Complement System',
  description: 'The discovery of complement, its three activation pathways, the membrane attack complex and other effects, how it is regulated, the diseases of its regulators, and how it is measured.',
  xp: 25,
  sourceRefs: [...cm([3, 4, 5, 11, 14, 15, 18, 19, 20, 22, 25, 26, 27, 28, 29, 32, 33, 39, 40, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53, 54, 55, 57, 58, 59]), ...ab([43, 44, 46, 47, 48, 49, 51, 52, 54, 55, 56, 59, 60, 61])],
  objectives: [
    'Describe what complement is and how its fragments are named',
    'Compare the classical, alternative and lectin pathways',
    'Describe the membrane attack complex and the biological effects of complement',
    'Describe complement regulators, their deficiency diseases and complement tests',
  ],
  chunks: [
    {
      title: 'What complement is',
      kind: 'overview',
      paragraphs: [
        'Complement is over 30 circulating and membrane proteins (about 3 g/L, ~5% of serum protein), made mainly by hepatocytes, macrophages and gut epithelium, and present in inactive form (CM slide 3; AB slide 43).',
        'Buchner found a bacteria-killing factor in serum; Bordet (1894) showed it had a heat-stable part (specific — antibody) and a heat-labile part, complement (formerly “alexine”), destroyed at 56 °C for 30 minutes (CM slide 4).',
        'Activation is a proteolytic cascade: components split into a small “a” fragment (released) and a large “b” fragment (stays bound, carries enzyme activity) — C2 is the exception (CM slide 5).',
      ],
      sourceRefs: [...cm([3, 4, 5]), ...ab([43, 44])],
    },
    {
      title: 'Three pathways',
      kind: 'pathway',
      table: {
        columns: ['', 'Classical', 'Lectin', 'Alternative'],
        rows: [
          ['Trigger', 'Antigen–antibody complex (IgG or IgM)', 'Mannose-binding lectin on microbial mannose', 'Microbial surfaces, endotoxin, capsules (no antibody)'],
          ['First step', 'C1q binds Fc; C1r activates C1s', 'MASP-1 and MASP-2 (like C1r, C1s)', 'Spontaneous C3 hydrolysis; C3b binds factor B; factor D cuts it'],
          ['C3 convertase', 'C4b2', 'C4b2', 'C3bBb (stabilised by properdin)'],
          ['C5 convertase', 'C4b2 + C3b', 'C4b2 + C3b', 'C3bBb + C3b'],
        ],
      },
      paragraphs: [
        'C1q must bind two Fc regions to be activated; an IgG has only one, so at least two IgG molecules must lie close together. IgM is the most efficient activator of the classical pathway (AB slides 11, 48).',
        'Alternative pathway: C3’s unstable thioester bond lets it hydrolyse slowly to C3b, which binds foreign surfaces; host cells’ sialic acid inactivates C3b. C3bBb lasts ~5 minutes unless properdin extends it to ~30. Amplification makes 2 × 10⁶ C3b in 5 minutes. It bypasses C1, C4 and C2 and is slower than the classical pathway (CM slides 22–29; AB slide 52).',
        'MBL is an acute-phase protein from the liver that binds mannose on Salmonella, Listeria, Neisseria, Cryptococcus and Candida (AB slides 54–55; CM slide 33).',
      ],
      notes: [{ kind: 'check', text: 'The decks disagree on which C2 fragment stays with C4b (C4b2b in CM slides 12–13 and AB slides 49–50; C4b2a in AB slides 53–56 and CM slide 34). The lesson writes “C4b2”; the fragment name is not quizzed.' }],
      sourceRefs: [...cm([11, 22, 24, 25, 26, 27, 28, 29, 32, 33]), ...ab([47, 48, 49, 51, 52, 54, 55])],
    },
    {
      title: 'The membrane attack complex and other effects',
      kind: 'mechanism',
      paragraphs: [
        'C5 convertase cleaves C5. C5b binds C6 and C7 and inserts into the membrane; C8 and several C9s join to form a pore — the membrane attack complex — so the cell lyses (AB slide 56; CM slides 19–20).',
        'Opsonisation: C3b (and iC3b, C4b) coat microbes for phagocytes, increasing phagocytosis about 1000-fold (CM slide 14; AB slide 46).',
        'Inflammation: C3a, C4a and C5a are anaphylatoxins that degranulate mast cells; C5a is the most powerful leucocyte chemotactic factor (CM slides 15, 18, 41).',
        'Immune complex clearance: C3b binds complexes to erythrocytes for removal by liver and spleen; C3 deficiency causes immune-complex disease and recurrent infection. C3b on B cells (via CR2) enhances antibody production (CM slides 42–43).',
        'Harm: complement can lyse host cells if activated massively (Gram-negative sepsis) or by autoimmunity (CM slide 44).',
      ],
      sourceRefs: [...cm([14, 15, 18, 19, 20, 39, 40, 41, 42, 43, 44]), ...ab([46, 56, 59])],
    },
    {
      title: 'Regulation and its diseases',
      kind: 'clinical',
      paragraphs: [
        'Fluid-phase regulators: C1 inhibitor (binds C1qrs), C4b-binding protein, factor H (stops factor B binding C3b), factor I (breaks down C3b), and S protein/vitronectin (blocks C5b67 insertion). Membrane regulators: DAF (CD55) and MCP speed convertase decay; homologous restriction factor stops C8/C9 insertion; CD59 (protectin) blocks C9 polymerisation (CM slides 46–47).',
        'Receptors: CR1 (erythrocytes, phagocytes, B cells; immune-complex clearance), CR2 (B cells, follicular DCs), CR3 and CR4 (phagocytes; opsonisation) (CM slide 49).',
      ],
      table: {
        columns: ['Disease', 'Defect', 'Features'],
        rows: [
          ['Hereditary angio-oedema', 'C1 inhibitor (autosomal dominant; type I low level ~85%, type II dysfunctional)', 'Recurrent painless oedema of skin and mucosa; C2 and C4 consumed, C3 normal; treat with C1-INH, FFP, danazol'],
          ['MPGN type II', 'Factor H', 'Dense deposits in glomerular basement membrane; haematuria, proteinuria'],
          ['Paroxysmal nocturnal haemoglobinuria', 'CD59 and DAF (GPI anchor; X-linked stem-cell mutation)', 'Intravascular haemolysis, haemoglobinuria, thrombosis; diagnosed by CD59 flow cytometry'],
        ],
      },
      sourceRefs: cm([45, 46, 47, 49, 50, 51, 52, 53, 54]),
    },
    {
      title: 'Testing',
      kind: 'clinical',
      paragraphs: [
        'CH50 measures the whole classical pathway: the serum dilution that lyses 50% of antibody-coated sheep red cells. Low CH50 means consumption or deficiency (CM slides 55–57).',
        'C3 and C4 are measured by nephelometry: C3 is common to both pathways, C4 only to the classical. Low complement suggests consumption (infection, active autoimmunity); high suggests an acute-phase response (AB slides 60–61; CM slide 57).',
        'Immune complexes can be detected by C1q-binding ELISA or with Raji cells (Burkitt’s lymphoma cells with complement receptors but no surface Ig) (CM slides 58–59).',
      ],
      sourceRefs: [...cm([55, 57, 58, 59]), ...ab([60, 61])],
    },
  ],
  summary: [
    'Heat-labile serum factor (56 °C, 30 min). “a” released, “b” bound.',
    'Classical: C1q + IgG/IgM. Lectin: MBL + MASPs. Alternative: C3b + factor B + D, properdin.',
    'C5b–C9 = MAC. C3b opsonin; C5a chemotaxis; C3a/C5a anaphylatoxins.',
    'HAE (C1-INH), PNH (CD59/DAF), MPGN II (factor H). CH50 tests the classical pathway.',
  ],
};

const lesson10: Draft = {
  id: 'immunology-10',
  title: 'Immunity to Infectious Agents',
  description: 'How innate and adaptive immunity respond to viruses, extracellular and intracellular bacteria, fungi, protozoa and helminths, how each evades immunity, and how immunity itself can harm.',
  xp: 25,
  sourceRefs: [...inf([4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]), ...inf0([10, 18, 20, 21, 23, 35, 54, 55])],
  objectives: [
    'State the general principles of antimicrobial immunity',
    'Describe innate and adaptive immunity to viruses and viral evasion',
    'Contrast immunity to extracellular and intracellular bacteria',
    'Describe immunity to fungi, protozoa and helminths, and immunopathology',
  ],
  chunks: [
    {
      title: 'General principles',
      kind: 'overview',
      paragraphs: [
        'Pathogens include viruses, bacteria, fungi, protozoa and helminths, plus prions and viroids. They enter through skin (wounds, bites) or mucosa (airway, gut, reproductive tract); infection proceeds by entry, invasion and colonisation, evasion, and tissue injury (IF slides 4–5).',
        'Damage may be direct (cytopathic effect, exotoxins, endotoxin) or indirect (anti-host antibody, immune complexes, cell-mediated injury) (IF slide 6).',
        'Innate and adaptive immunity act together; responses differ by microbe; survival depends on evasion; some infections persist latently; host responses can cause injury; immune defects predispose to infection (IF slide 7).',
      ],
      sourceRefs: inf([4, 5, 6, 7]),
    },
    {
      title: 'Viruses',
      kind: 'mechanism',
      paragraphs: [
        'Innate: interferons, induced by viral dsRNA, block viral replication, protect uninfected cells and activate NK cells — type I (IFN-α, IFN-β) from infected cells, type II (IFN-γ) from T and NK cells. NK cells kill infected cells early, before antibody, without MHC restriction (IF slide 8; IF0 slide 10).',
        'Adaptive: antibody blocks attachment (polio, mumps, measles, rubella), secretory IgA neutralises at mucosae, and antibody aggregates, opsonises, fixes complement and directs ADCC. CD8⁺ CTLs kill via MHC I; CD4⁺ T cells activate macrophages (IF slide 10).',
        'Evasion: antigenic variation (HIV), influenza haemagglutinin drift (minor) and shift (major), viral cytokine homologues that disrupt interferon, complement and chemokine disruption, and down-regulating MHC (IF slide 11; IF0 slide 18).',
        'Immunopathology: immune complexes in chronic infection; antibody-dependent enhancement (dengue); CTL damage (chronic hepatitis); molecular mimicry (Coxsackie B cardiomyopathy) (IF0 slides 20–21).',
      ],
      sourceRefs: [...inf([8, 10, 11]), ...inf0([10, 18, 20, 21])],
    },
    {
      title: 'Bacteria',
      kind: 'comparison',
      paragraphs: [
        'Extracellular bacteria: innate defences are complement (activated by peptidoglycan, LPS or mannose), opsonisation and MAC lysis, and TLR-triggered cytokines. Antibody is the main adaptive defence — neutralising toxins, opsonising and fixing complement; polysaccharides act as T-independent antigens (IF slides 12–13).',
        'Their evasion: capsules, exotoxins against phagocytes, factor H and C4BP binding, C5a-ase, thick peptidoglycan; antigenic variation (Borrelia, Neisseria pili); IgA proteases (Haemophilus influenzae) (IF slides 14–15; IF0 slide 23).',
        'Intracellular bacteria hide in phagocytes, safe from antibody. NK cells (via IL-12/IL-15) make IFN-γ early; CD4⁺ T cells activate macrophages with CD40L and IFN-γ; CD8⁺ CTLs kill cells that escape. Elimination needs cell-mediated immunity (IF slide 16).',
        'TB: Th1 cells release IFN-γ; activated macrophages kill mainly with nitric oxide; exhausted macrophages are killed by CTLs and NK cells and the bacilli re-taken by new macrophages (IF slide 17).',
        'Their evasion: blocking phagolysosome fusion (M. tuberculosis, Legionella), escaping into the cytosol (Listeria), and inactivating ROS and NO (M. leprae) (IF slide 18).',
      ],
      sourceRefs: [...inf([12, 13, 14, 15, 16, 17, 18]), ...inf0([23, 35])],
    },
    {
      title: 'Fungi, protozoa and helminths',
      kind: 'comparison',
      table: {
        columns: ['Pathogen', 'Main defence', 'Evasion'],
        rows: [
          ['Fungi', 'Neutrophils and macrophages (candidiasis, aspergillosis); CMI (cryptococcosis, histoplasmosis)', 'Capsule (Cryptococcus); resisting digestion (Histoplasma)'],
          ['Intracellular protozoa (Plasmodium, Trypanosoma)', 'Th1 cells and macrophages', 'Coat switching (Trypanosoma), shedding (Plasmodium)'],
          ['Extracellular protozoa (Entamoeba, Giardia)', 'Antibody', '—'],
          ['Helminths', 'Th2 → IgE, eosinophils, mast cells; CD4⁺ T cells critical against Schistosoma', 'Antigenic disguise; concomitant immunity'],
        ],
      },
      paragraphs: [
        'Immunopathology: endotoxin shock (LPS → vasodilation, hypotension, DIC), the Shwartzman reaction (local necrosis after repeated endotoxin), the Koch phenomenon (exaggerated hypersensitivity to TB) and superantigens (IF slide 22).',
      ],
      sourceRefs: [...inf([19, 20, 21, 22, 23, 24]), ...inf0([54, 55])],
    },
  ],
  summary: [
    'Viruses: IFN, NK early; CTLs and antibody later; evasion by drift/shift.',
    'Extracellular bacteria: complement and antibody. Intracellular: CMI (IFN-γ, macrophages, CTLs).',
    'Fungi: neutrophils, CMI. Protozoa: Th1 or antibody by location. Helminths: Th2, IgE, eosinophils.',
    'Host responses can harm: endotoxin shock, Koch phenomenon, superantigens.',
  ],
};

// In the order of the numbered lectures (owner, 2026-10-24): 01 introduction (1-3),
// 02-03 cytokines and receptors (5), 04 cells (4), 05 antibodies and monoclonals (7-8),
// 06 antigens (6), then complement (9, an unnumbered deck) and 07 immunity to infection
// (10). Lesson ids keep their numbers, so learners' progress is unchanged.
export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson5, lesson4, lesson7, lesson8, lesson6, lesson9, lesson10].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: interactive[lesson.id],
}));
