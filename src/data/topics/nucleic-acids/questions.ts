// Biochemistry → Nucleic Acids — the topic question bank.
//
// Rules: only what the lessons teach (the five lecture decks). Not asked:
// tRNA or rRNA length, enhancer position, lactose versus allolactose as
// the inducer (see discrepancies), the energy source for translation,
// strand naming, the nitrogen donor for GMP, open assignments, or
// speaker-note annotations. IDs: qN-xx.
import { fill, match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/nucleic-acids/sources';

type Q = QuestionDraft<ConceptId>;

const lesson1: Q[] = [
  mcq('q1-01', 'nucleotide-parts', 'Purines differ from pyrimidines in having…', 'Two fused rings', ['One six-membered ring', 'No nitrogen in the ring', 'A sugar built into the ring'], { explanation: 'NM slide 5.' }),
  mcq('q1-02', 'nucleotide-parts', 'Purines join the sugar through which atom?', 'N9', ['N1', 'N3', 'C6'], { explanation: 'NA slide 12.' }),
  mcq('q1-03', 'nucleotide-parts', 'The bond between base and sugar in a nucleoside is…', 'A β-N-glycosidic bond', ['A phosphodiester bond', 'A peptide bond', 'A hydrogen bond'], { explanation: 'NA slide 22.' }),
  mcq('q1-04', 'nucleotide-parts', 'Deoxyribose differs from ribose by lacking…', 'The 2′-OH group', ['The 3′-OH group', 'The 5′ carbon', 'The ring oxygen'], { explanation: 'NA slides 12, 30.' }),
  tf({ id: 'q1-05', conceptId: 'nucleotide-parts', statement: 'Thymine is found in RNA.', answer: false, explanation: 'NA slide 15: ribonucleotides contain uracil; thymine is in DNA.', skill: 'misconception' }),
  mcq('q1-06', 'nucleotide-parts', 'Nucleoside names for pyrimidines end in…', '-idine', ['-osine', '-ylate', '-ine only'], { explanation: 'NA slide 22.', skill: 'terminology' }),
  match('q1-07', 'nucleotide-parts', 'Match each base to its nucleoside.', [
    ['Adenine', 'Adenosine'],
    ['Guanine', 'Guanosine'],
    ['Cytosine', 'Cytidine'],
    ['Uracil', 'Uridine'],
  ], { explanation: 'NA slide 13.' }),
  multi('q1-08', 'nucleotide-roles', 'Which nucleotides are second messengers? Select all that apply.', ['cAMP', 'cGMP'], ['ATP', 'UDP-glucose'], { explanation: 'NA slide 26.' }),
  mcq('q1-09', 'nucleotide-roles', 'Which nucleotide is required for platelet aggregation?', 'ADP', ['GTP', 'cAMP', 'UTP'], { explanation: 'NA slide 25.' }),
  mcq('q1-10', 'nucleotide-roles', 'GTP is a precursor of…', 'Tetrahydrobiopterin', ['NAD⁺', 'Coenzyme A (CoA)', 'Biotin'], { explanation: 'NA slide 25.' }),
  multi('q1-11', 'nucleotide-roles', 'Which are activated intermediates in biosynthesis? Select all that apply.', ['UDP-glucose', 'S-adenosylmethionine', 'PAPS'], ['Uric acid'], { explanation: 'NA slide 26.' }),
  multi('q1-12', 'nucleotide-drugs', 'Which are antiviral nucleoside drugs named in the lecture? Select all that apply.', ['Zidovudine', 'Lamivudine', 'Valacyclovir'], ['Allopurinol'], { explanation: 'NA slide 17.' }),
  mcq('q1-13', 'nucleotide-drugs', 'Why is nucleotide synthesis a target for anticancer drugs?', 'Rapidly dividing cells make large amounts of nucleotides', ['Cancer cells cannot use the salvage pathways at all', 'Normal cells lack the de novo pathway entirely', 'Cancer cells lack ribose, so they need extra nucleotides'], { explanation: 'NA slide 17.', skill: 'cause-effect' }),
];

const lesson2: Q[] = [
  mcq('q2-01', 'purine-de-novo', 'The base of IMP is…', 'Hypoxanthine', ['Xanthine', 'Adenine', 'Guanine'], { explanation: 'NM slide 12.' }),
  mcq('q2-02', 'purine-de-novo', 'Ribose 5-phosphate for purine synthesis comes from…', 'The pentose phosphate pathway', ['Glycolysis (from glucose 6-phosphate)', 'The citric acid cycle', 'The urea cycle'], { explanation: 'NM slides 13, 17.' }),
  mcq('q2-03', 'purine-de-novo', 'Which enzyme makes PRPP?', 'Ribose-5-phosphate pyrophosphokinase (PRPP synthetase)', ['Amidophosphoribosyl transferase (glutamine PRPP amidotransferase)', 'HGPRT (hypoxanthine-guanine phosphoribosyl transferase)', 'Ribonucleotide reductase'], { explanation: 'NM slides 13, 17.' }),
  multi('q2-04', 'purine-de-novo', 'PRPP is a precursor for which? Select all that apply.', ['Purines', 'Pyrimidines', 'Histidine', 'Tryptophan'], ['Cholesterol'], { explanation: 'NM slide 17.' }),
  mcq('q2-05', 'purine-de-novo', 'How many enzymatic steps lead from PRPP to IMP?', '11', ['6', '3', '20'], { explanation: 'NM slide 13.' }),
  multi('q2-06', 'purine-de-novo', 'Which glutamine analogues inhibit the committed step? Select all that apply.', ['Azaserine', 'Acivicin'], ['Allopurinol', 'Methotrexate'], { explanation: 'NM slide 20.' }),
  mcq('q2-07', 'purine-de-novo', 'Which atoms of the purine ring come from N¹⁰-formyl-THF?', 'C2 and C8', ['N1 and N7', 'C4 and C5', 'N3 and N9'], { explanation: 'NB22 slide 25.' }),
  mcq('q2-08', 'amp-gmp', 'Conversion of IMP to AMP requires…', 'Aspartate and GTP', ['Glutamine and ATP', 'Glycine and ATP', 'NAD⁺'], { explanation: 'NM slide 26.' }),
  mcq('q2-09', 'amp-gmp', 'Which drug blocks IMP → guanylate?', 'Mycophenolic acid', ['Allopurinol (xanthine oxidase)', 'Azaserine', '6-Azauridine'], { explanation: 'NM slide 27.', clinical: true }),
  mcq('q2-10', 'amp-gmp', 'Adenylate kinase catalyses…', 'AMP + ATP ⇌ 2 ADP', ['ADP + ATP ⇌ AMP + ATP', 'IMP → AMP', 'AMP → IMP'], { explanation: 'NM slide 28.' }),
  tf({ id: 'q2-11', conceptId: 'amp-gmp', statement: 'Nucleoside diphosphate kinase is specific for purine bases.', answer: false, explanation: 'NM slide 28: it is not base-specific.' }),
  mcq('q2-12', 'purine-regulation', 'GMP inhibits which enzyme of its own branch?', 'IMP dehydrogenase', ['Adenylosuccinate synthetase', 'PRPP synthetase', 'AMP deaminase'], { explanation: 'NM slide 30.' }),
  mcq('q2-13', 'purine-regulation', 'How do AMP and GMP inhibit the committed step?', 'At distinct sites; together they inhibit fully', ['At the same site, competitively with PRPP', 'They activate it, as feed-forward signals', 'Only IMP inhibits it; AMP and GMP have no effect'], { explanation: 'NM slide 30.' }),
];

const lesson3: Q[] = [
  multi('q3-01', 'purine-salvage', 'Which tissues depend on salvage for nucleotides? Select all that apply.', ['Leucocytes', 'Brain', 'Bone marrow'], ['Liver'], { explanation: 'NM slide 22.' }),
  mcq('q3-02', 'purine-salvage', 'APRT converts…', 'Adenine to AMP', ['Hypoxanthine to IMP', 'Guanine to GMP', 'Adenosine to inosine'], { explanation: 'NM slide 22.' }),
  mcq('q3-03', 'purine-salvage', 'What does salvage use as the activated ribose phosphate?', 'PRPP', ['Ribose 1-phosphate', 'UDP-ribose', 'ATP'], { explanation: 'NM slide 24.' }),
  mcq('q3-04', 'purine-degradation', 'All purine degradation leads to…', 'Uric acid', ['Urea', 'β-Alanine', 'Ammonia only'], { explanation: 'NM slide 32.' }),
  mcq('q3-05', 'purine-degradation', 'Adenosine deaminase converts adenosine to…', 'Inosine', ['Hypoxanthine', 'Xanthine', 'Guanosine'], { explanation: 'NM slides 35, 77.' }),
  mcq('q3-06', 'purine-degradation', 'Which enzyme converts guanine to xanthine?', 'Guanine deaminase', ['Xanthine oxidase', 'Purine nucleoside phosphorylase', 'HGPRT'], { explanation: 'NM slide 78.' }),
  mcq('q3-07', 'purine-degradation', 'The point of convergence of purine base breakdown is…', 'Xanthine', ['Inosine', 'Uric acid', 'Hypoxanthine'], { explanation: 'NM slide 36.' }),
  mcq('q3-08', 'purine-degradation', 'Purine nucleoside phosphorylase converts inosine to hypoxanthine and…', 'Ribose 1-phosphate', ['Ribose 5-phosphate', 'Free ribose', 'PRPP'], { explanation: 'NM slides 34, 77.' }),
  mcq('q3-09', 'purine-degradation', 'The purine nucleotide cycle overall deaminates…', 'Aspartate to fumarate at the cost of GTP', ['Glutamate to α-ketoglutarate, releasing NH₃', 'Alanine to pyruvate in the muscle', 'AMP to ATP without any cost'], { explanation: 'NM slide 37.' }),
  mcq('q3-10', 'gout', 'Which metal impairs uric acid excretion?', 'Lead', ['Iron', 'Copper', 'Zinc'], { explanation: 'NM slide 41.' }),
  mcq('q3-11', 'gout', 'Allopurinol is described as…', 'A suicide inhibitor of xanthine oxidase', ['A uricosuric drug that increases uric acid excretion', 'An NSAID that reduces joint inflammation', 'An activator of HGPRT that boosts salvage'], { explanation: 'NM slide 42.', clinical: true }),
  multi('q3-12', 'lesch-nyhan-ada', 'Which are features of Lesch–Nyhan syndrome? Select all that apply.', ['HGPRT deficiency', 'Raised uric acid', 'Self-mutilation', 'Spasticity'], ['Low PRPP'], { explanation: 'NM slides 45–46.', clinical: true }),
  mcq('q3-13', 'lesch-nyhan-ada', 'ADA deficiency causes…', 'Severe combined immunodeficiency', ['Gout from uric acid overproduction', 'Orotic aciduria with megaloblastic anaemia', 'Anaemia only, with normal immunity'], { explanation: 'NM slide 47.', clinical: true }),
];

const lesson4: Q[] = [
  multi('q4-01', 'pyrimidine-de-novo', 'Which atoms of the pyrimidine ring come from aspartate? Select all that apply.', ['N1', 'C4', 'C5', 'C6'], ['C2'], { explanation: 'NM slide 49.' }),
  mcq('q4-02', 'pyrimidine-de-novo', 'C2 of the pyrimidine ring comes from…', 'HCO₃⁻', ['Glycine', 'Aspartate', 'Formyl-THF'], { explanation: 'NM slide 49.' }),
  mcq('q4-03', 'pyrimidine-de-novo', 'Which step of pyrimidine synthesis is mitochondrial?', 'Dihydroorotate dehydrogenase', ['Carbamoyl phosphate synthetase II', 'OMP decarboxylase', 'ATCase'], { explanation: 'NM slide 57.' }),
  mcq('q4-04', 'pyrimidine-de-novo', 'CAD is a multifunctional protein containing…', 'CPS II, aspartate transcarbamoylase and dihydroorotase', ['OPRT and OMP decarboxylase (UMP synthase)', 'Ribonucleotide reductase and thymidylate synthase', 'All six enzymes of pyrimidine synthesis'], { explanation: 'NM slides 58–59.' }),
  mcq('q4-05', 'pyrimidine-de-novo', 'The enzyme described as the most catalytically proficient, needing no cofactor, is…', 'OMP decarboxylase', ['Dihydroorotase', 'CTP synthetase', 'Carbamoyl phosphate synthetase II'], { explanation: 'NM slide 61.' }),
  mcq('q4-06', 'pyrimidine-de-novo', 'CTP is made from…', 'UTP, by CTP synthetase using glutamine and ATP', ['CMP directly, by adding an amino group', 'Orotate, by CTP synthetase using ammonia', 'dCTP, by removing the 2′ deoxy group'], { explanation: 'NM slides 56–57.' }),
  multi('q4-07', 'pyrimidine-regulation', 'Which activate CPS II in animals? Select all that apply.', ['ATP', 'PRPP'], ['UTP', 'UDP'], { explanation: 'NM slide 62.' }),
  mcq('q4-08', 'pyrimidine-regulation', 'CTP inhibits bacterial ATCase by…', 'Lowering its affinity for substrates without changing Vmax', ['Lowering Vmax only, without changing substrate affinity', 'Destroying the enzyme so that it must be resynthesised', 'Competing with aspartate at the active site'], { explanation: 'NM slide 69.' }),
  mcq('q4-09', 'orotic-aciduria', 'Type II orotic aciduria is deficiency of…', 'Orotidylate (OMP) decarboxylase alone', ['Both OPRT and OMP decarboxylase together', 'Carbamoyl phosphate synthetase II', 'Dihydroorotase in the CAD protein'], { explanation: 'NM slide 63.' }),
  mcq('q4-10', 'orotic-aciduria', 'Which drug can cause orotic aciduria?', '6-Azauridine', ['Allopurinol', 'Methotrexate', 'Azaserine'], { explanation: 'NM slide 63.', clinical: true }),
  mcq('q4-11', 'deoxyribonucleotides', 'Ribonucleotide reductase acts on…', 'Ribonucleoside diphosphates', ['Ribonucleoside monophosphates', 'Free bases', 'Triphosphates only'], { explanation: 'NM slide 66.' }),
  mcq('q4-12', 'deoxyribonucleotides', 'Thymidylate synthase uses which cofactor?', 'N⁵,N¹⁰-Methylene-THF', ['Biotin (carboxylation)', 'S-adenosylmethionine (SAM)', 'NADH alone'], { explanation: 'NB22 slide 77.' }),
  mcq('q4-13', 'deoxyribonucleotides', 'Fluorodeoxyuridylate inhibits…', 'Thymidylate synthase', ['Dihydrofolate reductase', 'Ribonucleotide reductase', 'dUTPase'], { explanation: 'NB22 slide 78.' }),
  multi('q4-14', 'pyrimidine-degradation', 'What are the end products of pyrimidine catabolism? Select all that apply.', ['β-Alanine', 'β-Aminoisobutyrate'], ['Uric acid', 'Allantoin'], { explanation: 'NM slide 79.' }),
];

const lesson5: Q[] = [
  mcq('q5-01', 'dna-double-helix', 'Who took the X-ray pictures that first showed DNA was a double helix?', 'Rosalind Franklin', ['Erwin Chargaff', 'Friedrich Miescher', 'Matthew Meselson'], { explanation: 'NA slide 4.' }),
  mcq('q5-02', 'dna-double-helix', 'Chargaff is known for…', 'The base-pairing rules (A–T, C–G)', ['The double helix model of DNA', 'Discovering nuclein in pus cells', 'Showing replication is semiconservative'], { explanation: 'NA slide 4.' }),
  mcq('q5-03', 'dna-double-helix', 'The two strands of DNA are…', 'Antiparallel', ['Parallel', 'Identical in sequence', 'Unpaired'], { explanation: 'NA slides 33–34.' }),
  mcq('q5-04', 'dna-double-helix', 'DNA has an overall negative charge because of its…', 'Phosphate backbone', ['Bases', 'Hydrogen bonds between bases', 'Deoxyribose'], { explanation: 'NA slide 33.' }),
  mcq('q5-05', 'dna-rna-differences', 'In DNA–RNA pairing, adenine in DNA pairs with…', 'Uracil', ['Thymine', 'Guanine', 'Cytosine'], { explanation: 'NA slide 32.' }),
  mcq('q5-06', 'dna-properties', 'Nucleic acids absorb UV maximally at…', '260 nm', ['280 nm', '340 nm', '220 nm'], { explanation: 'NA slide 41.' }),
  mcq('q5-07', 'dna-properties', 'What happens to viscosity when DNA is denatured?', 'It falls', ['It rises', 'It stays the same', 'It doubles'], { explanation: 'NA slide 42.' }),
  mcq('q5-08', 'dna-properties', 'The melting temperature (Tm) is the temperature at which…', 'Half the DNA is single-stranded', ['All of the DNA is single-stranded', 'DNA first starts to absorb UV light', 'DNA precipitates out of solution'], { explanation: 'NA slide 47.', skill: 'terminology' }),
  mcq('q5-09', 'dna-forms-packaging', 'Which DNA form is the default right-handed helix in cells?', 'B-form', ['A-form', 'Z-form', 'Cruciform'], { explanation: 'NA slide 49.' }),
  mcq('q5-10', 'dna-forms-packaging', 'Z-DNA forms in regions rich in…', 'G:C', ['A:T', 'Uracil', 'Methyladenine'], { explanation: 'NA slide 49.' }),
  mcq('q5-11', 'dna-forms-packaging', 'Prokaryotic DNA is…', 'Naked, circular and supercoiled', ['Linear and bound to histones', 'Single-stranded and circular', 'Always found in plasmids only'], { explanation: 'NA slide 50.' }),
  multi('q5-12', 'dna-forms-packaging', 'Which are the major histone proteins? Select all that apply.', ['H1', 'H2A', 'H2B', 'H3', 'H4'], ['Ubiquitin'], { explanation: 'NA slide 53.' }),
  mcq('q5-13', 'dna-forms-packaging', 'Sanger sequencing stops DNA synthesis with…', 'Dideoxynucleotides', ['Chemical cleavage', 'Light signals', 'Restriction enzymes'], { explanation: 'NA slide 55.' }),
];

const lesson6: Q[] = [
  mcq('q6-01', 'replication-rules', 'In the Meselson–Stahl experiment, DNA was first labelled with…', '¹⁵N', ['¹⁴C', '³²P', '³H'], { explanation: 'NA slide 60.' }),
  mcq('q6-02', 'replication-rules', 'Replication origins are rich in…', 'A=T base pairs', ['G≡C pairs', 'Uracil', 'Methylcytosine'], { explanation: 'NA slides 63, 84.' }),
  mcq('q6-03', 'replication-rules', 'Okazaki fragments in eukaryotes are about…', '150–200 nucleotides', ['1000–2000 nucleotides', '10 nucleotides', '10,000 nucleotides'], { explanation: 'NA slide 72.' }),
  mcq('q6-04', 'replication-rules', 'DNA polymerase adds nucleotides to the…', '3′ end, synthesising 5′→3′', ['5′ end, synthesising 3′→5′', 'Either end', 'Middle of the strand'], { explanation: 'NA slides 64, 73.' }),
  multi('q6-05', 'replication-machinery', 'What does DNA polymerase need to synthesise DNA? Select all that apply.', ['Template', 'Primer', 'dNTPs with Mg²⁺'], ['Ribosome'], { explanation: 'NA slides 57, 64.' }),
  mcq('q6-06', 'replication-machinery', 'Primase is a type of…', 'RNA polymerase', ['DNA ligase', 'Topoisomerase (gyrase)', 'Exonuclease'], { explanation: 'NA slide 75.' }),
  mcq('q6-07', 'replication-machinery', 'Which E. coli polymerase removes RNA primers?', 'DNA polymerase I', ['DNA polymerase II', 'DNA polymerase III', 'Primase'], { explanation: 'NA slides 77, 83.' }),
  mcq('q6-08', 'replication-machinery', 'Which E. coli polymerase alone has 5′→3′ exonuclease activity?', 'DNA polymerase I', ['DNA polymerase III', 'DNA polymerase II', 'All three'], { explanation: 'NA slide 83.' }),
  mcq('q6-09', 'replication-machinery', 'What stops replication forks at the ter region of E. coli?', 'Tus protein inhibiting helicase', ['Rho factor releasing the polymerase', 'Sigma factor binding the terminus', 'Telomerase capping the chromosome'], { explanation: 'NA slide 79.' }),
  match('q6-10', 'eukaryotic-replication', 'Match each eukaryotic polymerase to its main role.', [
    ['Pol α', 'Primase activity; starts replication'],
    ['Pol β', 'DNA repair'],
    ['Pol γ', 'Mitochondrial DNA replication'],
    ['Pol δ', 'Main replicative enzyme'],
  ], { explanation: 'NA slides 81–82.' }),
  mcq('q6-11', 'eukaryotic-replication', 'Which eukaryotic protein acts as the single-strand binding protein?', 'Replication protein A', ['PCNA (the sliding clamp)', 'Replication factor C (clamp loader)', 'Flap endonuclease 1'], { explanation: 'NA slide 80.' }),
  fill('q6-12', 'telomeres', 'Human telomeres consist of the repeat ____.', ['TTAGGG', 'ttaggg'], { explanation: 'NA slide 87.' }),
  mcq('q6-13', 'telomeres', 'Telomerase is…', 'An RNA-dependent DNA polymerase with its own RNA template', ['A DNA-dependent RNA polymerase that makes primers at the chromosome ends', 'A restriction enzyme that trims the chromosome ends', 'A ligase that joins Okazaki fragments at the ends'], { explanation: 'NA slide 86.' }),
];

const lesson7: Q[] = [
  multi('q7-01', 'dna-damage', 'Which are endogenous causes of DNA damage? Select all that apply.', ['Reactive oxygen species', 'Deamination', 'Depurination', 'Replication errors'], ['X-rays'], { explanation: 'NA slide 89.' }),
  multi('q7-02', 'dna-damage', 'Which are chemical mutagens named in the lecture? Select all that apply.', ['Benzopyrene', 'Nitrogen mustard', 'Aflatoxin', 'Nitrites'], ['Glucose'], { explanation: 'NA slide 95.' }),
  mcq('q7-03', 'mutations', 'A germ-line mutation…', 'Alters gametes and affects the next generation', ['Affects only the individual, never the offspring', 'Is always silent, changing no amino acid', 'Occurs only in bacteria, not in humans'], { explanation: 'NA slide 90.' }),
  mcq('q7-04', 'mutations', 'Most mutations are…', 'Spontaneous', ['Induced by mutagens', 'Caused by viruses', 'Deliberately introduced'], { explanation: 'NA slide 97.' }),
  mcq('q7-05', 'mutations', 'The spontaneous mutation rate in eukaryotes is about…', '10⁻⁴ to 10⁻⁶ per gene per generation', ['10⁻¹ to 10⁻² per gene per generation', '10⁻¹² to 10⁻¹⁴ per gene per generation', 'About one per gene at every cell division'], { explanation: 'NA slide 97.' }),
  mcq('q7-06', 'mutations', 'A G–T mispair from a tautomeric shift, uncorrected, gives…', 'A GC→AT transition', ['A frameshift mutation', 'A GC→TA transversion', 'No change at all'], { explanation: 'NA slide 96.' }),
  mcq('q7-07', 'mutations', 'A point mutation that introduces a stop codon is…', 'Nonsense', ['Missense', 'Silent', 'Frameshift'], { explanation: 'GE slide 3.', skill: 'terminology' }),
  mcq('q7-08', 'mutations', 'Insertions and deletions can cause…', 'Frameshifts', ['Only silent changes', 'Tautomeric shifts', 'Thymine dimers'], { explanation: 'GE slide 3.' }),
  mcq('q7-09', 'mutations', 'Transposons are…', 'DNA sequences that can move within the genome', ['Repair enzymes that move along the DNA', 'RNA primers left behind on the lagging strand', 'Telomere repeats at the ends of chromosomes'], { explanation: 'NA slide 97; RD slide 84.' }),
  mcq('q7-10', 'dna-repair', 'Which enzyme reverses thymine dimers using light?', 'Photolyase', ['DNA glycosylase', 'Ligase', 'Telomerase'], { explanation: 'NA slide 108.' }),
  mcq('q7-11', 'dna-repair', 'The most common DNA damage repaired by base excision, in the lecture’s example, is…', 'Deamination of cytosine to uracil', ['Thymine dimers formed by UV light', 'Double-strand breaks from ionising radiation', 'Loss of telomere repeats in old cells'], { explanation: 'NA slide 111.' }),
  mcq('q7-12', 'dna-repair', 'DNA glycosylases cut…', 'The N-glycosidic bond, removing the base', ['The phosphodiester backbone, leaving a nick', 'Hydrogen bonds between the paired bases', 'Histones away from the damaged DNA'], { explanation: 'NA slide 111.' }),
  multi('q7-13', 'dna-repair', 'Which are features of xeroderma pigmentosum? Select all that apply.', ['Defective repair of UV damage', 'More skin cancers', 'Cataracts'], ['Immune deficiency'], { explanation: 'NA slide 112.', clinical: true }),
];

const lesson8: Q[] = [
  mcq('q8-01', 'rna-types', 'The most abundant form of RNA is…', 'rRNA', ['mRNA', 'tRNA', 'snRNA'], { explanation: 'NA slide 120.' }),
  mcq('q8-02', 'rna-types', 'The 3′ end of tRNA (the amino acid arm) ends in…', 'CCA', ['AUG', 'Poly(A)', 'TTAGGG'], { explanation: 'NA slide 127.' }),
  multi('q8-03', 'rna-types', 'Which unusual bases are found in tRNA? Select all that apply.', ['Pseudouridine', 'Dihydrouracil'], ['Thymine dimers', 'Hypoxanthine only'], { explanation: 'NA slides 125, 127.' }),
  match('q8-04', 'rna-types', 'Match each ribosome to its subunits.', [
    ['Prokaryotic 70S', '50S + 30S'],
    ['Eukaryotic 80S', '60S + 40S'],
  ], { explanation: 'NA slide 131.' }),
  mcq('q8-05', 'rna-types', 'Which rRNA is in the prokaryotic small subunit?', '16S', ['18S', '23S', '28S'], { explanation: 'NA slide 131.' }),
  mcq('q8-06', 'prokaryotic-transcription', 'Which subunit of E. coli RNA polymerase contains the active site?', 'β', ['α', 'β′', 'ω'], { explanation: 'NA slide 132.' }),
  mcq('q8-07', 'prokaryotic-transcription', 'The most common sigma factor is…', 'σ⁷⁰', ['σ³²', 'σ⁵⁴', 'σ²⁸'], { explanation: 'NA slide 133.' }),
  mcq('q8-08', 'prokaryotic-transcription', 'Most RNAs begin at their 5′ end with…', 'A purine', ['A pyrimidine', 'A cap', 'Uracil'], { explanation: 'NA slide 140.' }),
  mcq('q8-09', 'prokaryotic-transcription', 'The error rate of RNA polymerase is about…', '1 in 10,000 bases', ['1 in 10 bases', '1 in a billion bases', 'None'], { explanation: 'NA slide 142.' }),
  mcq('q8-10', 'eukaryotic-transcription', 'Where is RNA polymerase I found?', 'Nucleolus', ['Nucleoplasm', 'Mitochondria', 'Cytoplasm'], { explanation: 'NA slide 149.' }),
  mcq('q8-11', 'eukaryotic-transcription', 'The Pribnow box (TATAAT) lies at about position…', '−10', ['−35', '−25', '+1'], { explanation: 'GE slide 18.' }),
  mcq('q8-12', 'eukaryotic-transcription', 'Which transcription factor contains the TATA-binding protein?', 'TFIID', ['TFIIB', 'TFIIF', 'TFIIA'], { explanation: 'NA slide 150.' }),
  mcq('q8-13', 'eukaryotic-transcription', 'α-Amanitin inhibits…', 'RNA polymerase II', ['Bacterial RNA polymerase', 'DNA polymerase', 'Ribosomes'], { explanation: 'NA slide 184.' }),
  multi('q8-14', 'eukaryotic-transcription', 'Which modifications are made to eukaryotic pre-mRNA? Select all that apply.', ['7-Methylguanosine cap', 'Poly(A) tail', 'Splicing out of introns'], ['Addition of thymine'], { explanation: 'GE slides 5–7.' }),
];

const lesson9: Q[] = [
  mcq('q9-01', 'trna-charging', 'Which enzyme keeps the aminoacylation reaction going by removing PPi?', 'Pyrophosphatase', ['Ligase', 'Peptidyl transferase', 'Kinase'], { explanation: 'NA slide 154.' }),
  mcq('q9-02', 'trna-charging', 'Where are most identity elements recognised by aaRS?', 'Acceptor stem and anticodon loop', ['The 5′ cap and the D-loop', 'The D-loop only', 'The poly(A) tail and T-loop'], { explanation: 'NA slide 153.' }),
  mcq('q9-03', 'trna-charging', 'Class I and class II synthetases differ in…', 'Which OH of the tRNA (2′ or 3′) they aminoacylate', ['Which amino acids exist in the cell', 'Whether they use ATP to activate the amino acid', 'Whether they need a tRNA at all'], { explanation: 'NA slide 155.' }),
  mcq('q9-04', 'translation-steps', 'Which amino acid does the initiator tRNA carry?', 'Methionine', ['Alanine', 'Glycine', 'Tryptophan'], { explanation: 'NA slide 162.' }),
  mcq('q9-05', 'translation-steps', 'In eukaryotes the small subunit binds the mRNA at…', 'The 5′ cap', ['The poly(A) tail', 'The stop codon', 'An intron'], { explanation: 'NA slide 162.' }),
  mcq('q9-06', 'translation-steps', 'In the completed initiation complex the initiator tRNA is in the…', 'P site', ['A site', 'E site', 'Cytoplasm'], { explanation: 'NA slide 162.' }),
  mcq('q9-07', 'translation-steps', 'In translocation the ribosome moves along the mRNA by…', 'Three nucleotides', ['One nucleotide at a time', 'Ten nucleotides', 'One exon'], { explanation: 'NA slide 164.' }),
  mcq('q9-08', 'translation-steps', 'What catalyses peptide bond formation?', 'rRNA acting as a ribozyme', ['The tRNA in the A site', 'The mRNA codon itself', 'Elongation factors EF-Tu and EF-G'], { explanation: 'GE slide 11.' }),
  mcq('q9-09', 'translation-steps', 'At a stop codon, what releases the polypeptide?', 'A termination factor', ['A stop tRNA with no amino acid', 'Rho factor', 'Sigma factor'], { explanation: 'NA slide 165.' }),
  mcq('q9-10', 'genetic-code', 'How many codons specify amino acids?', '61', ['64', '20', '3'], { explanation: 'NA slide 179.' }),
  mcq('q9-11', 'genetic-code', '“The genetic code is degenerate” means…', 'Some amino acids have more than one codon', ['Codons overlap along the mRNA', 'Some codons code for two amino acids', 'The code differs between species'], { explanation: 'NA slide 180.', skill: 'terminology' }),
  mcq('q9-12', 'genetic-code', 'Codons for the same amino acid usually differ in…', 'The third base', ['The first base', 'The second base', 'All three'], { explanation: 'NA slide 178.' }),
  mcq('q9-13', 'genetic-code', 'Which anticodon pairs with the start codon AUG?', 'UAC', ['AUG', 'TAC', 'CAU'], { explanation: 'NA slide 171.' }),
];

const lesson10: Q[] = [
  mcq('q10-01', 'gene-regulation-basics', 'An inducible gene is…', 'Transcribed only when needed', ['Transcribed all the time, at a steady rate', 'Never transcribed in adult cells', 'Found and transcribed only in mitochondria'], { explanation: 'GE slide 32.' }),
  mcq('q10-02', 'gene-regulation-basics', 'Glucocorticoids raise tyrosine aminotransferase in liver but lower it in fat cells. This shows…', 'Different cells respond differently to the same signal', ['Fat cells lack the DNA for the enzyme', 'The liver lacks glucocorticoid receptors', 'The genes themselves differ between the two cells'], { explanation: 'GE slide 26.' }),
  mcq('q10-03', 'gene-regulation-basics', 'In bacteria, the predominant site of control is…', 'Initiation of transcription', ['Splicing of the mRNA', 'Degradation of the protein', 'Export of mRNA from the nucleus'], { explanation: 'GE slides 29–30.' }),
  tf({ id: 'q10-04', conceptId: 'gene-regulation-basics', statement: 'A signal that makes a repressor leave the DNA is an example of positive regulation.', answer: false, explanation: 'GE slide 33: it is still negative regulation.', skill: 'misconception' }),
  mcq('q10-05', 'operon-parts', 'Operators are found in…', 'Prokaryotes only', ['Eukaryotes only', 'Both', 'Viruses and plasmids only'], { explanation: 'GE slide 17.' }),
  mcq('q10-06', 'operon-parts', 'mRNA from a prokaryotic operon is…', 'Polycistronic', ['Monocistronic', 'Spliced', 'Capped'], { explanation: 'GE slide 30.' }),
  mcq('q10-07', 'operon-parts', 'A corepressor…', 'Keeps the repressor on the operator', ['Pulls the repressor off the operator', 'Binds RNA polymerase at the promoter', 'Is a promoter sequence upstream of the operator'], { explanation: 'GE slide 48.' }),
  mcq('q10-08', 'lac-operon', 'lacZ encodes…', 'β-Galactosidase', ['Permease', 'Transacetylase', 'The repressor'], { explanation: 'GE slide 53.' }),
  mcq('q10-09', 'lac-operon', 'Which gene encodes the Lac repressor?', 'The i gene', ['lacZ (β-galactosidase)', 'lacY', 'lacA'], { explanation: 'GE slide 52.' }),
  mcq('q10-10', 'lac-operon', 'With no lactose, what happens at the lac operon?', 'The repressor binds the operator; no mRNA is made', ['RNA polymerase transcribes the genes freely', 'The repressor is degraded by proteases', 'Lactose is synthesised to switch the operon on'], { explanation: 'GE slide 55.' }),
  mcq('q10-11', 'trp-operon', 'The trp operon is an example of…', 'Repressible negative regulation', ['Inducible positive regulation', 'Constitutive (unregulated) expression', 'Attenuation only, with no repressor'], { explanation: 'GE slide 56.' }),
  mcq('q10-12', 'trp-operon', 'Attenuation works in bacteria because…', 'Transcription and translation occur together', ['The bacterial mRNA is spliced first', 'The ribosomes are inside the nucleus', 'There is no promoter on the operon'], { explanation: 'RD slide 86.', skill: 'cause-effect' }),
  mcq('q10-13', 'trp-operon', 'When tryptophan is abundant, the trp operon is…', 'Switched off', ['Switched on fully', 'Duplicated', 'Unaffected'], { explanation: 'GE slide 56.' }),
];

const lesson11: Q[] = [
  multi('q11-01', 'eukaryotic-control-levels', 'At which levels can eukaryotic gene expression be controlled? Select all that apply.', ['Chromatin', 'Transcription', 'mRNA degradation', 'Post-translational modification'], ['Operon induction'], { explanation: 'GE slide 61.' }),
  mcq('q11-02', 'eukaryotic-control-levels', 'Cells of a multicellular organism rarely use more than…', '5–10% of their genes at a time', ['50% of their genes', 'All of their genes', 'One gene at a time'], { explanation: 'GE slide 79.' }),
  mcq('q11-03', 'eukaryotic-control-levels', 'Hox genes…', 'Are master genes controlling development of body parts', ['Encode the histone proteins of chromatin', 'Are found only in bacteria, not in animals', 'Code for the ribosomal RNAs of the cell'], { explanation: 'GE slide 79.' }),
  mcq('q11-04', 'eukaryotic-control-levels', 'Steroid hormone–receptor complexes bind…', 'Hormone response elements in DNA', ['Ribosomes in the cytoplasm', 'The operator of an operon', 'The 5′ caps of mRNA'], { explanation: 'GE slide 80.' }),
  mcq('q11-05', 'chromatin-epigenetics', 'DNase I digests transcriptionally active DNA readily because…', 'It is not shielded by histones', ['It is heavily methylated', 'It is single-stranded', 'It lies in the cytoplasm'], { explanation: 'GE slide 66.', skill: 'cause-effect' }),
  mcq('q11-06', 'chromatin-epigenetics', 'DNA methylation occurs most often at…', 'CG sequences', ['TATA boxes', 'Poly(A) tails', 'AT-rich origins'], { explanation: 'GE slide 68.' }),
  mcq('q11-07', 'chromatin-epigenetics', 'The inactive X chromosome in females is a form of…', 'Heterochromatin', ['Euchromatin (open chromatin)', 'An operon', 'A plasmid'], { explanation: 'GE slide 77.' }),
  mcq('q11-08', 'post-transcriptional', 'The calcitonin gene illustrates…', 'Alternative splicing and polyadenylation', ['DNA methylation of the gene', 'Attenuation of transcription', 'Amplification of the gene'], { explanation: 'GE slide 69.' }),
  mcq('q11-09', 'post-transcriptional', 'Stored mRNAs in unfertilised eggs have…', 'Short poly(A) tails', ['No 5′ caps at all', 'Extra introns left in', 'Long poly(A) tails'], { explanation: 'GE slide 70.' }),
  multi('q11-10', 'post-transcriptional', 'Which shorten mRNA half-life? Select all that apply.', ['AU-rich elements', 'Deadenylation', 'Decapping'], ['A long poly(A) tail'], { explanation: 'GE slide 71.' }),
  mcq('q11-11', 'post-transcriptional', 'When iron is low, iron regulatory proteins…', 'Block ferritin translation and stabilise transferrin receptor mRNA', ['Increase ferritin translation and destroy transferrin receptor mRNA', 'Destroy transferrin receptor mRNA but leave ferritin unchanged', 'Do nothing until iron rises again'], { explanation: 'GE slide 78.' }),
  mcq('q11-12', 'post-transcriptional', 'A protein with N-terminal arginine is likely to have a half-life of…', '3 minutes or less', ['20 hours or more', 'Several days', 'Several years'], { explanation: 'GE slide 72.' }),
  mcq('q11-13', 'expression-measurement', 'Which method is more sensitive and accurate than microarrays for measuring expression?', 'Real-time PCR', ['Southern blotting', 'Restriction mapping', 'Gel electrophoresis alone'], { explanation: 'GE slide 38.' }),
];

const lesson12: Q[] = [
  mcq('q12-01', 'cancer-basics', 'A tumour that stays confined to its original location is…', 'Benign', ['Malignant', 'Metastatic', 'A lymphoma'], { explanation: 'GE slide 86.' }),
  mcq('q12-02', 'cancer-basics', 'Carcinomas are derived from…', 'Ectoderm or endoderm', ['Mesoderm', 'Bone marrow white cells', 'Lymph glands'], { explanation: 'GE slide 87.' }),
  order('q12-03', 'cancer-basics', 'Order the stages of cancer.', ['Initiation', 'Promotion', 'Progression'], { explanation: 'GE slide 93.' }),
  mcq('q12-04', 'cancer-basics', 'Which virus is associated with cervical cancer?', 'Human papillomavirus', ['Hepatitis B virus', 'Epstein–Barr virus', 'Human T-lymphotropic virus I'], { explanation: 'GE slide 91.' }),
  mcq('q12-05', 'cancer-basics', 'A tumour cannot grow beyond about 2 mm without…', 'Angiogenesis', ['Apoptosis', 'Contact inhibition', 'Differentiation'], { explanation: 'GE slide 98.' }),
  mcq('q12-06', 'cancer-basics', 'A tumour promoter…', 'Promotes growth but does not cause cancer alone', ['Mutates DNA directly, like an initiator', 'Always causes cancer on its own', 'Triggers apoptosis in damaged cells'], { explanation: 'GE slide 109.' }),
  mcq('q12-07', 'oncogenes-suppressors', 'Myc is an example of…', 'An oncogene (gain of function)', ['A tumour suppressor (loss of function)', 'A caspase of apoptosis', 'A DNA repair gene'], { explanation: 'GE slide 94.' }),
  multi('q12-08', 'oncogenes-suppressors', 'Which are tumour suppressor genes? Select all that apply.', ['Rb', 'APC', 'p53'], ['Myc'], { explanation: 'GE slides 94, 104.' }),
  mcq('q12-09', 'oncogenes-suppressors', 'In normal cells p53 levels are low because p53 is…', 'Ubiquitinated and degraded by proteasomes', ['Not transcribed in normal cells', 'Exported from the cell as it is made', 'Bound to DNA permanently and hidden'], { explanation: 'GE slide 104.' }),
  mcq('q12-10', 'oncogenes-suppressors', 'DNA damage causes p53 to become…', 'Phosphorylated and stable', ['Degraded faster by proteasomes', 'Methylated and silenced', 'Excreted from the cell'], { explanation: 'GE slide 104.' }),
  mcq('q12-11', 'cancer-hallmarks-death', 'Apoptosis is carried out by…', 'Caspases', ['Lysosomal lipases', 'Ribozymes', 'Telomerase'], { explanation: 'GE slide 105.' }),
  mcq('q12-12', 'cancer-hallmarks-death', 'In apoptosis, DNA is cut into fragments of about…', '180–200 bp', ['10 bp', '5000 bp', 'Random sizes'], { explanation: 'GE slide 112.' }),
  match('q12-13', 'cancer-hallmarks-death', 'Match each targeted therapy to its target.', [
    ['Tamoxifen', 'ER/PR-positive breast cancer'],
    ['Herceptin', 'HER2'],
    ['Gleevec', 'BCR/ABL'],
  ], { explanation: 'GE slide 108.' }),
];

const lesson13: Q[] = [
  mcq('q13-01', 'rdna-basics', 'Recombinant DNA technology was developed by…', 'Boyer and Cohen (1973)', ['Watson and Crick (1953)', 'Meselson and Stahl', 'Sanger'], { explanation: 'RD slide 2.' }),
  mcq('q13-02', 'rdna-basics', 'Restriction enzymes come from…', 'Bacteria, where they cut viral DNA', ['Human cells, where they cut damaged DNA', 'Yeast mitochondria', 'Viruses, where they cut host DNA'], { explanation: 'RD slide 5.' }),
  mcq('q13-03', 'rdna-basics', 'A palindromic sequence reads…', 'The same on both strands read 5′→3′', ['The same forwards on one strand only', 'Differently on each strand', 'Only in RNA'], { explanation: 'RD slide 5.', skill: 'terminology' }),
  mcq('q13-04', 'rdna-basics', 'Why are vector and gene cut with the same restriction enzyme?', 'So their ends match and can be ligated', ['To destroy the vector after cloning', 'To add antibiotic resistance to the gene', 'To remove the introns from the gene'], { explanation: 'RD slide 7.', skill: 'cause-effect' }),
  multi('q13-05', 'vectors', 'Which are essential elements of a plasmid vector? Select all that apply.', ['Origin of replication', 'Selectable marker', 'Unique restriction sites'], ['Centromere'], { explanation: 'RD slide 8.' }),
  multi('q13-06', 'vectors', 'Which are essential elements of a YAC? Select all that apply.', ['Telomeres', 'Centromere', 'Origin of replication'], ['Ribosome'], { explanation: 'RD slide 9.' }),
  mcq('q13-07', 'vectors', 'A vector that can replicate in both E. coli and yeast is a…', 'Shuttle vector', ['Cosmid vector', 'Phage', 'Primer'], { explanation: 'RD slide 10.' }),
  mcq('q13-08', 'vectors', 'A 4 kb plasmid with a 2 kb insert is cut at the flanking sites and run on a gel. You see…', 'Two bands: 4 kb and 2 kb', ['One band: 6 kb', 'One band: 4 kb only', 'No bands at all'], { explanation: 'RD slide 14.' }),
  mcq('q13-09', 'rdna-products', 'Human insulin genes for bacteria are obtained by…', 'Making cDNA from insulin mRNA', ['Cutting genomic DNA with introns', 'Synthesising the protein first', 'Using a yeast artificial chromosome'], { explanation: 'RD slide 16.' }),
  mcq('q13-10', 'rdna-products', 'Why are recombinant factors VIII and IX safer than pooled blood products?', 'Pooled blood may carry HIV or hepatitis', ['They are much cheaper to produce', 'They need no injection to be given', 'They cure the gene defect permanently'], { explanation: 'RD slide 20.', clinical: true }),
  mcq('q13-11', 'rdna-products', 'Recombinant DNase is used to treat…', 'Cystic fibrosis', ['Haemophilia', 'Diabetes', 'Pituitary dwarfism'], { explanation: 'RD slide 47.' }),
  mcq('q13-12', 'libraries', 'cDNA libraries lack introns because they are made from…', 'Mature mRNA', ['Genomic DNA', 'Pre-mRNA', 'Mitochondrial DNA'], { explanation: 'RD slide 78.' }),
  mcq('q13-13', 'libraries', 'Which primer is used to start cDNA synthesis?', 'Oligo(dT), annealing to the poly(A) tail', ['A random 8-mer, annealing anywhere', 'An RNA primer made by primase', 'A telomere repeat at the 3′ end'], { explanation: 'RD slide 78.' }),
];

const lesson14: Q[] = [
  mcq('q14-01', 'pcr', 'To design PCR primers you need to know…', 'The sequences flanking the target', ['The whole of the target sequence', 'The sequence of the encoded protein', 'Nothing at all about the DNA'], { explanation: 'RD slide 48.' }),
  mcq('q14-02', 'pcr', 'Taq polymerase comes from…', 'Thermus aquaticus', ['Escherichia coli', 'Saccharomyces (yeast)', 'Human cells'], { explanation: 'RD slide 50.' }),
  mcq('q14-03', 'pcr', 'After n cycles, the target is amplified…', '2ⁿ-fold', ['n-fold', 'n²-fold', '10ⁿ-fold'], { explanation: 'RD slide 53.' }),
  mcq('q14-04', 'pcr', 'The extension step of PCR is usually at…', '72 °C', ['95 °C', '54 °C', '4 °C'], { explanation: 'RD slide 53.' }),
  multi('q14-05', 'pcr', 'Which are limitations of PCR? Select all that apply.', ['Not for long sequences', 'No proofreading', 'Contamination is amplified'], ['Requires radioactivity'], { explanation: 'RD slides 49, 55.' }),
  mcq('q14-06', 'pcr', 'In gel electrophoresis, migration is…', 'Inversely related to fragment size', ['Directly proportional to fragment size', 'Unrelated to the size of the fragment', 'Faster for the larger fragments'], { explanation: 'RD slide 58.' }),
  mcq('q14-07', 'genetic-testing', 'Which restriction site does the sickle mutation remove?', 'DdeI', ['EcoRI', 'HpaI', 'BamHI'], { explanation: 'RD slide 29.' }),
  mcq('q14-08', 'genetic-testing', 'The sickle mutation changes codon 6 of β-globin from…', 'Glutamate to valine', ['Valine to glutamate', 'Lysine to glutamate', 'Glycine to alanine'], { explanation: 'RD slide 29.' }),
  multi('q14-09', 'genetic-testing', 'Which are tested in newborn screening, per the lecture? Select all that apply.', ['Phenylketonuria', 'Sickle cell anaemia', 'Tay–Sachs disease'], ['Huntington disease'], { explanation: 'RD slide 27.' }),
  mcq('q14-10', 'genetic-testing', 'Why is there no single DNA test for BRCA1/2 breast cancer risk?', 'Hundreds of different mutations each confer different risk', ['The BRCA genes have not yet been identified', 'Breast cancer is never genetic', 'The genes are too short to test reliably'], { explanation: 'RD slide 25.', skill: 'cause-effect' }),
  match('q14-11', 'dna-typing', 'Match each marker to its repeat length.', [
    ['Microsatellites (STRs)', '2–4 bp'],
    ['Minisatellites (VNTRs)', '5 to a few tens of bp'],
  ], { explanation: 'RD slide 35.' }),
  mcq('q14-12', 'gene-therapy', 'Which kind of gene therapy is used in humans?', 'Somatic cell therapy', ['Germ-line cell therapy', 'Enhancement therapy', 'None'], { explanation: 'RD slide 41.' }),
  mcq('q14-13', 'gene-therapy', 'The SCID gene therapy vector is based on…', 'Moloney murine leukaemia virus (a retrovirus)', ['Adenovirus only (a DNA virus)', 'A yeast artificial chromosome', 'Bacteriophage λ (lambda)'], { explanation: 'RD slide 71.' }),
  multi('q14-14', 'gene-therapy', 'Which are limits of gene therapy? Select all that apply.', ['Retroviral vectors integrate only in dividing cells', 'Vectors can provoke an immune response', 'Insertion can inactivate genes'], ['Vectors carry unlimited DNA'], { explanation: 'RD slide 73.' }),
];

export const questions: Q[] = [
  ...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5, ...lesson6, ...lesson7,
  ...lesson8, ...lesson9, ...lesson10, ...lesson11, ...lesson12, ...lesson13, ...lesson14,
];
