// Physiology → Special Senses — the ten lessons (reading layer). Sources:
// the Visual System, Auditory and Vestibular Systems, and Chemical Senses
// decks (vs, av, cs in sources.ts). References name the deck.
import type { LessonDraft } from '@/data/topics/build';
import { interactive, readingExtras } from '@/data/topics/special-senses/interactive';
import { withSimulation } from '@/data/topics/special-senses/simulations';
import { av, cs, vs, type ConceptId } from '@/data/topics/special-senses/sources';

type Draft = LessonDraft<ConceptId>;

const lesson1: Draft = {
  id: 'special-senses-1',
  title: 'Structure of the Eye',
  description: 'The three coats of the eye, its cavities and humours, the lens, conjunctiva and tears, and how aqueous humour drains.',
  xp: 25,
  sourceRefs: vs([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14]),
  objectives: [
    'State the range of visible light',
    'Describe the sclera, choroid and retina and their parts',
    'Describe the anterior and posterior cavities and their humours',
    'Describe the lens, conjunctiva and lacrimal glands',
    'Trace the flow of aqueous humour and explain glaucoma',
  ],
  chunks: [
    {
      title: 'The eye and light',
      kind: 'overview',
      paragraphs: [
        'The visual system detects and interprets light — electromagnetic waves. The human eye detects wavelengths of 400–700 nm, visible light. The eye is nearly a sphere about 24 mm across, with a wall of three layers: sclera, choroid and retina (Visual System, slides 1–2).',
      ],
      sourceRefs: vs([1, 2]),
    },
    {
      title: 'The three coats',
      kind: 'structure',
      table: {
        columns: ['Coat', 'Features'],
        rows: [
          ['Sclera (outer, fibrous)', 'The white of the eye; protects and gives rigidity. Its transparent front, the cornea, admits light and bends it before the lens. The optic nerve (II) pierces it at the back'],
          ['Choroid (middle, vascular)', 'Supplies blood to the eye; its melanin absorbs light so it does not reflect inside the eye. In front it forms the iris, ciliary body and suspensory ligaments (zonules)'],
          ['Retina (inner, neural)', 'Contains rods and cones; covers the back of the eye except the optic disc (blind spot). The macula lutea has a central fovea centralis of cones only — the point of sharpest vision'],
        ],
      },
      keyPoints: ['The iris is pigmented (eye colour); its circular and radial smooth muscles act antagonistically on the pupil. The lens is held by suspensory ligaments attached to the ciliary body (slide 4).'],
      sourceRefs: vs([2, 3, 4, 5, 6]),
    },
    {
      title: 'Cavities, lens and tears',
      kind: 'structure',
      paragraphs: [
        'The lens divides the eye into a larger posterior cavity, filled with gelatinous vitreous humour, and an anterior cavity filled with watery aqueous humour. The anterior cavity has an anterior chamber (cornea to iris) and a posterior chamber (iris to lens) (Visual System, slides 6–7).',
        'The lens is a transparent protein gel in an elastic sac, behind the pupil; it adds the optical power needed to focus light on the back of the eye (slide 8).',
        'The conjunctiva is a thin transparent membrane over the front of the eyeball and inside the lids; its cells add mucus to the tears. The lacrimal glands in the upper lids, under parasympathetic control, secrete watery tears that keep the cornea smooth and clear; tears drain through the nasolacrimal duct into the nose (slides 8–9).',
      ],
      sourceRefs: vs([6, 7, 8, 9]),
    },
    {
      title: 'Aqueous humour and glaucoma',
      kind: 'pathway',
      steps: [
        { label: 'Secretion', detail: 'Actively secreted by the ciliary epithelium into the posterior chamber.' },
        { label: 'Through the pupil', detail: 'Into the anterior chamber.' },
        { label: 'Drainage', detail: 'Through the trabecular meshwork into the canal of Schlemm, at the filtration angle between cornea and iris.' },
      ],
      keyPoints: [
        'The balance of production and drainage sets intraocular pressure. If production exceeds drainage, pressure rises and damages the retina and optic nerve — glaucoma, which can cause blindness (slides 11–12).',
        'Vitreous humour keeps enough pressure to stop the eyeball collapsing; it turns over slowly and may develop opacities (slide 14).',
      ],
      sourceRefs: vs([11, 12, 14]),
    },
  ],
  summary: [
    'Visible light 400–700 nm; eye ~24 mm.',
    'Sclera (cornea in front), choroid (melanin; iris, ciliary body, zonules), retina (rods, cones; fovea = cones only; optic disc = blind spot).',
    'Posterior cavity: vitreous humour. Anterior cavity: aqueous humour, anterior and posterior chambers.',
    'Aqueous: ciliary epithelium → posterior chamber → pupil → anterior chamber → trabecular meshwork → canal of Schlemm.',
    'Production > drainage → raised pressure → glaucoma.',
  ],
};

const lesson2: Draft = {
  id: 'special-senses-2',
  title: 'Focusing: Refraction, Accommodation and Refractive Errors',
  description: 'How the eye forms an image, how it accommodates for near and far, the near response, and myopia, hyperopia, astigmatism, presbyopia and cataract.',
  xp: 25,
  sourceRefs: vs([15, 16, 18, 19, 22, 23, 24, 25, 27, 30, 31]),
  objectives: [
    'Name the refractive media and where most refraction happens',
    'Describe the image formed on the retina',
    'Explain accommodation for near and far objects',
    'Describe the near response and presbyopia',
    'Explain myopia, hyperopia and astigmatism and their correction',
    'Describe cataract',
  ],
  chunks: [
    {
      title: 'Image formation',
      kind: 'mechanism',
      paragraphs: [
        'Refraction — bending of waves as they enter a medium of different speed — forms the image on the retina. The refractive media are the cornea, aqueous humour, lens and vitreous humour. About 80% of refraction happens at the cornea and 20% in the lens, whose refraction is adjustable (Visual System, slides 15–16).',
        'The retinal image is real, left–right reversed, inverted and smaller; the brain interprets it as upright (slide 16).',
      ],
      sourceRefs: vs([15, 16]),
    },
    {
      title: 'Accommodation',
      kind: 'comparison',
      paragraphs: ['Accommodation adjusts the lens’s refractive power to bring objects at different distances into focus (Visual System, slide 18).'],
      table: {
        columns: ['', 'Near object', 'Far object'],
        rows: [
          ['Ciliary body', 'Contracts', 'Relaxes'],
          ['Zonules', 'Relax', 'Contract (tighten)'],
          ['Lens', 'More rounded — more power', 'Thinner — less power'],
        ],
      },
      keyPoints: [
        'The near point — closest clear focus — is often taken as 25 cm. Accommodation declines with age as the ciliary muscle and lens lose elasticity: presbyopia, making reading difficult; corrected with bifocals (slide 22).',
        'Looking at a near object triggers the near response: accommodation, convergence of the visual axes and pupil constriction (slides 22–23).',
      ],
      sourceRefs: vs([18, 19, 22, 23]),
    },
    {
      title: 'Refractive errors',
      kind: 'clinical',
      table: {
        columns: ['Error', 'Cause', 'Focus falls', 'Correction'],
        rows: [
          ['Myopia (near-sightedness)', 'Eyeball too long, cornea too curved or lens too strong', 'In front of the retina', 'Biconcave lenses'],
          ['Hyperopia (far-sightedness)', 'Eyeball too short, cornea too flat or lens too weak', 'Behind the retina', 'Convex lenses'],
          ['Astigmatism', 'Uneven curvature of cornea or lens', 'Both in front of and behind the retina', 'Spherocylindrical lenses'],
        ],
      },
      sourceRefs: vs([23, 24, 25, 27]),
    },
    {
      title: 'Cataract',
      kind: 'clinical',
      paragraphs: [
        'Cataract is clouding of the lens as its proteins, notably alpha-crystallins, clump into opaque areas. Causes: ageing, long-term UV exposure, trauma, diseases such as diabetes, smoking and toxins. It causes blurred sight, dazzle and altered colour vision, and is treated by replacing the lens with an artificial one (Visual System, slides 30–31).',
      ],
      sourceRefs: vs([30, 31]),
    },
  ],
  summary: [
    'Refractive media: cornea (~80%), aqueous, lens (~20%, adjustable), vitreous.',
    'Retinal image: real, inverted, reversed, smaller.',
    'Near: ciliary contracts → zonules slacken → rounder lens. Far: ciliary relaxes → zonules tighten → thinner lens.',
    'Near point ~25 cm; presbyopia with age. Near response: accommodation, convergence, miosis.',
    'Myopia: focus in front → concave. Hyperopia: behind → convex. Astigmatism: uneven → spherocylindrical.',
    'Cataract: clumped α-crystallins; lens replacement.',
  ],
};

const lesson3: Draft = {
  id: 'special-senses-3',
  title: 'The Retina and Phototransduction',
  description: 'The cells and layers of the retina, rods and cones, how light is converted into a signal, and how the pigment and receptor recover.',
  xp: 25,
  sourceRefs: vs([34, 35, 36, 37, 40, 41, 43, 44, 45, 47, 48, 49, 51, 52, 56, 57, 58, 60, 61]),
  objectives: [
    'Name the five cell types and the layers of the retina',
    'Trace the path of light and signal through the retina',
    'Compare rods and cones',
    'Explain the dark current and how light hyperpolarises the photoreceptor',
    'Describe the cone pigments',
    'Describe how rhodopsin is regenerated and how the photoreceptor recovers',
  ],
  chunks: [
    {
      title: 'Layers of the retina',
      kind: 'structure',
      paragraphs: ['The retina is 100–200 µm thick, with five basic cell types: photoreceptors (rods and cones), bipolar, horizontal, amacrine and ganglion cells (Visual System, slide 34). From outside in:'],
      steps: [
        { label: 'Pigment epithelium', detail: 'One cell thick; absorbs stray light.' },
        { label: 'Outer and inner segment layers', detail: 'Of the photoreceptors.' },
        { label: 'Outer nuclear layer', detail: 'Photoreceptor nuclei.' },
        { label: 'Outer plexiform layer', detail: 'Photoreceptors synapse with bipolar and horizontal cells.' },
        { label: 'Inner nuclear layer', detail: 'Horizontal, bipolar and amacrine cell bodies.' },
        { label: 'Inner plexiform layer', detail: 'Bipolar, amacrine and ganglion cells synapse.' },
        { label: 'Ganglion cell layer', detail: 'Ganglion (and amacrine) cell bodies; their axons form the optic nerve fibre layer, leaving at the optic disc.' },
      ],
      keyPoints: [
        'Light enters from the ganglion side and crosses every layer before reaching the rods and cones (slide 40).',
        'At the fovea there are almost only cones, at their highest density; the other cells move aside and there are no blood vessels (slides 36–37).',
      ],
      sourceRefs: vs([34, 35, 36, 37, 40, 41]),
    },
    {
      title: 'Rods and cones',
      kind: 'comparison',
      paragraphs: ['Each photoreceptor has an outer segment, inner segment, cell body and synaptic terminal (Visual System, slide 43).'],
      table: {
        columns: ['', 'Rods', 'Cones'],
        rows: [
          ['Shape of outer segment', 'Rod-like', 'Conical'],
          ['Light needed', 'Dim light (< 0.1 foot-candles)', 'Higher threshold'],
          ['Vision', 'Scotopic (night), no colour', 'Photopic (bright), colour'],
          ['Number', '95% of the 150 million receptors', 'Three types, each with a different iodopsin'],
          ['Pigment', 'Rhodopsin (purple): 11-cis retinal + scotopsin', 'Iodopsin (violet): 11-cis retinal + photopsin'],
        ],
      },
      keyPoints: ['At twilight (mesopic range) rods are coupled to cones by gap junctions, so rod signals travel in the cone pathway (slide 45).'],
      sourceRefs: vs([43, 44, 45, 47, 56]),
    },
    {
      title: 'In the dark',
      kind: 'mechanism',
      steps: [
        { label: 'cGMP high', detail: 'It keeps cyclic nucleotide-gated (CNG) channels in the outer segment open.' },
        { label: 'Dark current', detail: 'Na⁺ (and some Ca²⁺) flows in; K⁺ leaves the inner segment.' },
        { label: 'Depolarised', detail: 'The cell sits slightly depolarised (about −30 mV) and releases glutamate onto bipolar and horizontal cells.' },
      ],
      sourceRefs: vs([47, 48, 49]),
    },
    {
      title: 'In the light',
      kind: 'pathway',
      steps: [
        { label: 'Isomerisation', detail: 'Light changes 11-cis retinal to all-trans retinal.' },
        { label: 'Metarhodopsin II', detail: 'This intermediate activates transducin, a G protein.' },
        { label: 'Phosphodiesterase', detail: 'Activated by transducin; hydrolyses cGMP to 5′-GMP.' },
        { label: 'CNG channels close', detail: 'Na⁺ and Ca²⁺ influx stops while K⁺ still leaves and the Na⁺/K⁺ pump works.' },
        { label: 'Hyperpolarisation', detail: 'From about −30 to −90 mV; glutamate release falls.' },
      ],
      keyPoints: ['Three cone types each contain a different photopsin, sensitive to red (520–700 nm), green (450–600 nm) or blue (360–480 nm) light; transduction is similar to rods (slides 56–57).'],
      sourceRefs: vs([51, 52, 56, 57]),
    },
    {
      title: 'Recovery',
      kind: 'regulation',
      paragraphs: [
        'Pigment: all-trans retinal is released and reduced to all-trans retinol (retinol dehydrogenase), carried to the pigment epithelium, re-made into 11-cis retinal and returned to join opsin as rhodopsin — without light (Visual System, slide 58).',
        'Receptor: with Ca²⁺ influx blocked, Ca²⁺ keeps leaving by the Na⁺/Ca²⁺-K⁺ exchanger. Falling Ca²⁺ triggers recovery (slides 60–61):',
      ],
      steps: [
        { label: 'GCAP', detail: 'Freed of Ca²⁺, activates guanylyl cyclase → more cGMP.' },
        { label: 'Recoverin', detail: 'Freed of Ca²⁺, releases rhodopsin kinase, which phosphorylates activated rhodopsin; arrestin then binds and quenches it.' },
        { label: 'Calmodulin', detail: 'Leaves the CNG channels, raising their affinity for cGMP.' },
        { label: 'Transducin', detail: 'Is inactivated.' },
      ],
      sourceRefs: vs([58, 60, 61]),
    },
  ],
  summary: [
    'Five cell types; layers from pigment epithelium to ganglion cells; light crosses all layers to reach the receptors.',
    'Fovea: cones only, no vessels — highest acuity.',
    'Rods: dim, scotopic, 95% of 150 million, rhodopsin. Cones: bright, colour, iodopsin, three types.',
    'Dark: high cGMP → CNG open → dark current → depolarised (~−30 mV) → glutamate.',
    'Light: 11-cis → all-trans → metarhodopsin II → transducin → PDE → ↓cGMP → channels close → hyperpolarised (−90 mV) → less glutamate.',
    'Recovery: retinol to pigment epithelium and back; ↓Ca²⁺ → GCAP, recoverin/rhodopsin kinase/arrestin, calmodulin.',
  ],
};

const lesson4: Draft = {
  id: 'special-senses-4',
  title: 'Visual Processing and the Optic Pathway',
  description: 'Convergence and on/off-centre bipolar cells, the route from retina to visual cortex, and the visual field defects caused by lesions along it.',
  xp: 25,
  sourceRefs: vs([63, 64, 65, 68, 69, 71, 72]),
  objectives: [
    'Explain why convergence makes rods sensitive but less acute',
    'Explain on-centre and off-centre bipolar cells',
    'Compare the cone and rod pathways',
    'Trace the optic pathway and say which fibres cross',
    'Predict the field defect from a lesion of the optic nerve, chiasm, tract or radiation',
  ],
  chunks: [
    {
      title: 'Processing in the retina',
      kind: 'mechanism',
      paragraphs: [
        'Rods and cones signal to bipolar cells directly or through horizontal cells. Many rods converge on one bipolar cell, but only one or a few cones do: convergence increases sensitivity but reduces acuity in the rod pathway (Visual System, slide 63).',
        'Horizontal cell connections give bipolar cells a receptive field of two concentric discs, producing on-centre and off-centre bipolar cells. Most bipolar cells synapse with amacrine cells; most input to ganglion cells comes from amacrine cells (slides 63–64).',
      ],
      steps: [
        { label: 'Dark', detail: 'Depolarised photoreceptors release glutamate (described as inhibitory) onto bipolar cells.' },
        { label: 'Light', detail: 'Photoreceptors hyperpolarise and release less transmitter.' },
        { label: 'Bipolars', detail: 'On-centre bipolars are released from inhibition (depolarise); off-centre bipolars are inhibited.' },
        { label: 'Ganglion cells', detail: 'Depolarised by on-centre bipolars; at threshold they fire action potentials along the optic nerve.' },
      ],
      table: {
        columns: ['Cone pathway', 'Rod pathway'],
        rows: [['Cone → bipolar → ganglion cell', 'Rod → bipolar → amacrine → ganglion cell']],
      },
      notes: [{ kind: 'check', text: 'Slide 64 calls glutamate “inhibitory”. Glutamate inhibits on-centre and excites off-centre bipolar cells; only what light does to each type is quizzed.' }],
      sourceRefs: vs([63, 64, 65]),
    },
    {
      title: 'The optic pathway',
      kind: 'pathway',
      paragraphs: ['Light from the temporal visual field falls on the nasal hemiretina, and light from the nasal field on the temporal hemiretina (Visual System, slide 68).'],
      steps: [
        { label: 'Optic nerves' },
        { label: 'Optic chiasm', detail: 'Nasal hemiretina fibres cross to the opposite optic tract; temporal fibres stay on the same side.' },
        { label: 'Optic tracts', detail: 'Each carries crossed and uncrossed fibres.' },
        { label: 'Lateral geniculate nucleus (thalamus)' },
        { label: 'Optic radiations', detail: 'Fan out through deep white matter.' },
        { label: 'Primary visual cortex', detail: 'At the back of the brain.' },
      ],
      sourceRefs: vs([68, 69]),
    },
    {
      title: 'Visual field defects',
      kind: 'clinical',
      table: {
        columns: ['Lesion', 'Defect'],
        rows: [
          ['Right optic nerve', 'Blindness in the right eye'],
          ['Optic chiasm', 'Bitemporal hemianopia — both temporal fields, from damage to the crossing nasal fibres'],
          ['Right optic tract', 'Left homonymous hemianopia — the same (left) half of the field in both eyes'],
          ['Part of the right optic radiation', 'Loss confined to an upper or lower quadrant of the left field in both eyes'],
        ],
      },
      sourceRefs: vs([71, 72]),
    },
  ],
  summary: [
    'Rod convergence: more sensitivity, less acuity. Cones: few per bipolar.',
    'Light → less glutamate → on-centre bipolars depolarise, off-centre inhibited → ganglion cells fire.',
    'Cone → bipolar → ganglion; rod → bipolar → amacrine → ganglion.',
    'Nasal fibres cross at the chiasm; tract → LGN → radiations → visual cortex.',
    'Optic nerve: one eye blind. Chiasm: bitemporal hemianopia. Tract: contralateral homonymous hemianopia. Radiation: quadrantanopia.',
  ],
};

const lesson5: Draft = {
  id: 'special-senses-5',
  title: 'Colour, Adaptation, the Pupil and Eye Movements',
  description: 'Trichromatic colour vision and colour blindness, dark and light adaptation, the pupillary light reflex, and the four types of eye movement.',
  xp: 25,
  sourceRefs: vs([74, 76, 77, 78, 82, 83, 85, 86, 87, 88, 89, 92, 93, 94, 95, 97, 99, 100]),
  objectives: [
    'Explain trichromatic colour vision and classify colour blindness',
    'Compare dark and light adaptation and explain night blindness',
    'Explain how the iris controls light entry, and the direct and consensual reflexes',
    'Trace the pupillary light reflex',
    'Describe saccades, smooth pursuit, vergence and vestibulo-ocular movements',
    'State the action of each extraocular muscle',
  ],
  chunks: [
    {
      title: 'Colour vision',
      kind: 'classification',
      paragraphs: [
        'Three cone types, each responding to red, green or blue, give trichromatic colour vision; combinations make other colours (Visual System, slide 74). Colour blindness affects about 1 in 12 males and 1 in 20 females (slide 76).',
      ],
      table: {
        columns: ['Term', 'Meaning'],
        rows: [
          ['Trichromat', 'Normal colour vision'],
          ['Anomalous trichromat', 'Deficiency in one pigment (protanomaly, deuteranomaly, tritanomaly)'],
          ['Dichromat', 'Complete absence of one pigment (protanopia — red, deuteranopia — green, tritanopia — blue)'],
          ['Monochromat', 'No cones, or only one type'],
        ],
      },
      keyPoints: ['Usually inherited. Red/green deficiency is about 99% of cases; blue/yellow is rare. Tested with the Ishihara test (slides 77–78).'],
      sourceRefs: vs([74, 76, 77, 78]),
    },
    {
      title: 'Dark and light adaptation',
      kind: 'comparison',
      table: {
        columns: ['', 'Dark adaptation', 'Light adaptation'],
        rows: [
          ['What', 'Slow recovery of sensitivity after bright light — threshold greatly reduced', 'Fall in sensitivity after the supersensitivity of leaving the dark'],
          ['Why', 'Bleaching slows in the dark and photopigments are regenerated', 'Pigments are bleached faster than they are reformed'],
          ['Time', 'Nearly maximal in 20 min; cones adapt first, rods for up to 4 hours', 'About 5 minutes'],
        ],
      },
      keyPoints: ['Vitamin A deficiency impairs dark adaptation: night blindness (nyctalopia) (slide 83).'],
      sourceRefs: vs([82, 83, 85]),
    },
    {
      title: 'The pupil',
      kind: 'pathway',
      paragraphs: [
        'Too much light can damage the retina; too little gives a dim image. Radial iris muscles dilate the pupil (sympathetic); circular muscles constrict it (parasympathetic — blocked by atropine). In very bright light the lids close (Visual System, slides 86–87).',
        'Light in one eye constricts that pupil (pupillary light reflex) and the other pupil too (consensual light reflex) (slide 87).',
      ],
      steps: [
        { label: 'Afferent', detail: 'Some optic tract fibres leave before the LGN for the pretectal nucleus of the midbrain.' },
        { label: 'Bilateral relay', detail: 'To the Edinger–Westphal nuclei on both sides.' },
        { label: 'Efferent', detail: 'Preganglionic fibres in the oculomotor nerve (III) to the ciliary ganglion.' },
        { label: 'Short ciliary nerves', detail: 'Supply the pupillary constrictor; the pupils constrict.' },
      ],
      sourceRefs: vs([86, 87, 88, 89]),
    },
    {
      title: 'Eye movements',
      kind: 'classification',
      paragraphs: ['Eye movements keep images on the fovea: to fixate objects, follow moving ones, and compensate for our own movement (Visual System, slide 92).'],
      terms: [
        { term: 'Saccades', meaning: 'Rapid, ballistic movements that abruptly change fixation (from A to B).' },
        { term: 'Smooth pursuit', meaning: 'Slower tracking that keeps a moving target on the fovea.' },
        { term: 'Vergence', meaning: 'Disconjugate convergence or divergence to align both foveae on near or far targets.' },
        { term: 'Vestibulo-ocular', meaning: 'Reflexes that move the eyes equally and oppositely to head movement, so the image does not slip on the retina.' },
      ],
      table: {
        columns: ['Muscle', 'Main action'],
        rows: [
          ['Medial rectus', 'Adduction (inward)'],
          ['Lateral rectus', 'Abduction (outward)'],
          ['Superior rectus', 'Elevation'],
          ['Inferior rectus', 'Depression'],
          ['Superior oblique', 'Intorsion (top of eye towards the nose)'],
          ['Inferior oblique', 'Extorsion (top of eye away from the nose)'],
        ],
      },
      keyPoints: ['Each muscle’s action depends on the position of the eye when it contracts (slide 97).'],
      sourceRefs: vs([92, 93, 94, 95, 97, 99, 100]),
    },
  ],
  summary: [
    'Trichromatic vision; colour blindness ~1/12 males, ~1/20 females; red/green ~99%; Ishihara test.',
    'Dark adaptation ~20 min (rods up to 4 h); light adaptation ~5 min. Vitamin A deficiency → night blindness.',
    'Radial (sympathetic) dilates; circular (parasympathetic) constricts. Direct and consensual reflexes.',
    'Light reflex: optic tract → pretectal nucleus → both Edinger–Westphal nuclei → III → ciliary ganglion → short ciliary nerves.',
    'Saccades, smooth pursuit, vergence, vestibulo-ocular. MR adducts, LR abducts, SR elevates, IR depresses, SO intorts, IO extorts.',
  ],
};

const lesson6: Draft = {
  id: 'special-senses-6',
  title: 'The Ear and Transmission of Sound',
  description: 'The external, middle and inner ear, the cochlea and organ of Corti, the properties of sound, and how sound reaches the inner ear.',
  xp: 25,
  sourceRefs: av([1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 20, 22, 23, 26, 28, 29, 30, 31, 32, 33, 34]),
  objectives: [
    'Describe the external, middle and inner ear',
    'Describe the bony and membranous labyrinths and their fluids',
    'Describe the three canals of the cochlea and the basilar membrane',
    'Compare inner and outer hair cells',
    'Describe the properties of sound and safe intensities',
    'Trace sound from the pinna to the organ of Corti and explain impedance matching',
  ],
  chunks: [
    {
      title: 'Three parts of the ear',
      kind: 'structure',
      paragraphs: ['All three parts serve hearing; only the inner ear serves balance. The ear hears 20–20,000 Hz (Auditory, slides 1–2).'],
      table: {
        columns: ['Part', 'Features'],
        rows: [
          ['External ear', 'Pinna (collects sound, protects the eardrum) and ear canal (~3 cm, cerumen glands — too much wax blocks sound)'],
          ['Middle ear', 'Air-filled tympanic cavity in the temporal bone, eardrum to oval window. Eustachian tube equalises pressure. Ossicles: malleus, incus, stapes. Muscles: tensor tympani (malleus), stapedius (stapes)'],
          ['Inner ear', 'Bony labyrinth (perilymph) containing the membranous labyrinth (endolymph): cochlea (hearing), three semicircular canals (balance), vestibule with saccule and utricle; oval and round windows'],
        ],
      },
      sourceRefs: av([1, 2, 3, 4, 5, 6, 7]),
    },
    {
      title: 'The cochlea',
      kind: 'structure',
      paragraphs: ['A snail shell of about 2¾ turns around a bony core (modiolus) with a spiral lamina (Auditory, slide 12). It has three canals:'],
      table: {
        columns: ['Canal', 'Fluid', 'Notes'],
        rows: [
          ['Scala vestibuli', 'Perilymph', 'Oval window to apex'],
          ['Scala tympani', 'Perilymph', 'Apex to round window; joined to the vestibuli at the helicotrema'],
          ['Scala media (cochlear duct)', 'Endolymph', 'Membranous; holds the organ of Corti. Reissner’s membrane separates it from the vestibuli; the basilar membrane is its floor'],
        ],
      },
      keyPoints: ['The basilar membrane is narrowest and stiffest at the base, widest and most flexible at the helicotrema (slide 14).'],
      sourceRefs: av([12, 13, 14]),
    },
    {
      title: 'The organ of Corti',
      kind: 'comparison',
      paragraphs: ['It rests on the basilar membrane; hair cells sit on the membrane with their stereocilia touching the tectorial membrane, and auditory nerve fibres lie beneath (Auditory, slide 20).'],
      table: {
        columns: ['', 'Inner hair cells', 'Outer hair cells'],
        rows: [
          ['Rows', 'One', 'Three'],
          ['Shape', 'Flask-shaped', 'Cylindrical'],
          ['Role', 'The auditory receptors. Stereocilia in rows of increasing height, joined by tip links that gate MET channels', 'Electromotile: push against the tectorial membrane, amplifying basilar membrane vibration so very quiet sounds are heard'],
        ],
      },
      sourceRefs: av([20, 22, 23, 26]),
    },
    {
      title: 'Sound',
      kind: 'definitions',
      paragraphs: [
        'Sound is a series of longitudinal compression waves — alternating condensation and rarefaction — travelling at about 340 m/s in air. Its components are amplitude, wavelength and frequency. Intensity is measured in decibels (Auditory, slides 28–29).',
      ],
      table: {
        columns: ['Sound', 'dB'],
        rows: [
          ['Near silence', '0'],
          ['Whisper', '15'],
          ['Conversation', '60'],
          ['Lawnmower', '90'],
          ['Car horn', '110'],
          ['Rock concert, jet engine', '120'],
          ['Gunshot', '140'],
        ],
      },
      keyPoints: [
        'Any sound above 85 dB can damage hearing; 8 hours at 90 dB does; any exposure to 140 dB causes immediate damage and pain (slide 30).',
        'The ear is most sensitive at 500–4000 Hz — the speech band (slide 31).',
      ],
      sourceRefs: av([28, 29, 30, 31]),
    },
    {
      title: 'Transmission of sound',
      kind: 'pathway',
      steps: [
        { label: 'Pinna and canal', detail: 'Funnel sound to the eardrum, which vibrates.' },
        { label: 'Ossicles', detail: 'Malleus → incus → stapes. They match the impedance of air to inner-ear fluid by the area ratio, the ossicular lever and buckling of the eardrum.' },
        { label: 'Oval window', detail: 'The stapes rocks against it, moving perilymph in the scala vestibuli, round the helicotrema into the scala tympani.' },
        { label: 'Scala media', detail: 'Through Reissner’s membrane the endolymph and hair cells are set in motion.' },
        { label: 'Round window', detail: 'Dissipates the pressure.' },
      ],
      keyPoints: ['The stapedius and tensor tympani produce the tympanic reflex, protecting the receptors from loud sounds (slide 33).'],
      sourceRefs: av([32, 33, 34]),
    },
  ],
  summary: [
    'Hearing range 20–20,000 Hz; most sensitive 500–4000 Hz.',
    'Middle ear: ossicles, Eustachian tube, tensor tympani and stapedius. Inner ear: perilymph (bony) and endolymph (membranous).',
    'Cochlea: scala vestibuli and tympani (perilymph, joined at the helicotrema); scala media (endolymph, organ of Corti).',
    'Basilar membrane: narrow and stiff at the base, wide and flexible at the apex.',
    'Inner hair cells (1 row) detect; outer (3 rows) amplify.',
    '> 85 dB damages hearing. Ossicles match impedance; the round window releases pressure.',
  ],
};

const lesson7: Draft = {
  id: 'special-senses-7',
  title: 'Hearing: Transduction, Pathways and Deafness',
  description: 'How hair cells turn vibration into nerve impulses, theories of pitch, the central auditory pathway, and conductive and sensorineural hearing loss.',
  xp: 25,
  sourceRefs: av([36, 37, 38, 41, 43, 44, 47, 48, 49, 50, 51]),
  objectives: [
    'Explain how bending stereocilia depolarises a hair cell',
    'Compare the frequency and place theories of pitch',
    'Trace the central auditory pathway',
    'Explain which lesions cause one-sided deafness',
    'Compare conductive and sensorineural hearing loss',
  ],
  chunks: [
    {
      title: 'Transduction',
      kind: 'pathway',
      steps: [
        { label: 'Basilar membrane vibrates', detail: 'Moved by the endolymph; a shearing force arises against the tectorial membrane.' },
        { label: 'Stereocilia bend', detail: 'Towards the tallest → depolarisation; away → hyperpolarisation.' },
        { label: 'Tip links tighten', detail: 'MET channels open.' },
        { label: 'K⁺ and Ca²⁺ enter', detail: 'From the endolymph; K⁺ influx depolarises the cell.' },
        { label: 'Voltage-gated Ca²⁺ channels open', detail: 'Ca²⁺ triggers transmitter release onto the primary afferent.' },
        { label: 'Afferent fires', detail: 'A generator potential reaching threshold fires action potentials in the cochlear nerve to the brainstem auditory nuclei.' },
      ],
      sourceRefs: av([36, 37, 38]),
    },
    {
      title: 'Pitch',
      kind: 'comparison',
      table: {
        columns: ['Theory', 'Idea'],
        rows: [
          ['Frequency theory', 'Pitch is encoded by the frequency of discharge in the auditory nerve fibre'],
          ['Place theory (von Helmholtz)', 'Different parts of the basilar membrane vibrate in response to different frequencies'],
        ],
      },
      sourceRefs: av([41]),
    },
    {
      title: 'Central pathway',
      kind: 'pathway',
      steps: [
        { label: 'Cochlear nucleus', detail: 'Primary fibres (auditory part of VIII) synapse in the brainstem.' },
        { label: 'Crossed (mostly) and uncrossed projections', detail: 'Directly, or via the nucleus of the trapezoid body or superior olive, into the lateral lemniscus.' },
        { label: 'Inferior colliculus (midbrain)' },
        { label: 'Medial geniculate body (thalamus)' },
        { label: 'Primary auditory cortex (temporal lobe)' },
      ],
      keyPoints: [
        'A lesion of the auditory nerve or the cochlear nuclei causes deafness in the same ear; lesions above the cochlear nuclei do not cause one-sided deafness, because the pathway is bilateral (slide 44).',
        'The superior olive localises sound. The left hemisphere (Wernicke’s area) recognises speech; the right processes non-verbal sound, including music (slide 47).',
      ],
      sourceRefs: av([43, 44, 47]),
    },
    {
      title: 'Deafness',
      kind: 'clinical',
      paragraphs: ['Hearing loss may follow heredity, trauma, disease, noise or ageing (presbycusis) (Auditory, slide 48).'],
      table: {
        columns: ['', 'Conductive', 'Sensorineural'],
        rows: [
          ['Problem', 'Sound blocked in the outer or middle ear', 'Damage to inner-ear sensory cells or the nerve'],
          ['Treatment', 'Medication (e.g. middle ear infection) or removing the blockage', 'No medical cure; permanent'],
          ['Causes', 'Wax, infection', 'Loud noise, head injury, infection, ageing; congenital causes (infection, drugs, lack of oxygen, genetics)'],
        ],
      },
      keyPoints: ['An audiogram shows the loss at each frequency (slide 51).'],
      sourceRefs: av([48, 49, 50, 51]),
    },
  ],
  summary: [
    'Shear → stereocilia bend towards the tallest → tip links open MET channels → K⁺ in → depolarisation → Ca²⁺ → transmitter → cochlear nerve.',
    'Frequency theory vs place theory (von Helmholtz).',
    'Cochlear nucleus → (superior olive, trapezoid body) → lateral lemniscus → inferior colliculus → medial geniculate → temporal cortex.',
    'Only nerve or cochlear nucleus lesions give one-sided deafness.',
    'Conductive (outer/middle ear, treatable) vs sensorineural (inner ear or nerve, permanent).',
  ],
};

const lesson8: Draft = {
  id: 'special-senses-8',
  title: 'The Vestibular System',
  description: 'How the semicircular canals sense rotation and the utricle and saccule sense linear acceleration, and where vestibular signals go.',
  xp: 25,
  sourceRefs: av([52, 53, 54, 55, 56, 57, 62, 63, 64, 68, 71, 72]),
  objectives: [
    'Describe the parts and functions of the vestibular system',
    'Describe the ampulla, crista and cupula',
    'Explain how rotation bends the hair cells and changes firing',
    'Compare the utricle and saccule',
    'Describe the central vestibular connections and the effects of disturbance',
  ],
  chunks: [
    {
      title: 'Overview',
      kind: 'overview',
      paragraphs: [
        'The vestibular system detects the position and motion of the head, maintaining visual and postural stability. Three semicircular canals sense angular acceleration; the saccule and utricle (otolith organs) sense linear acceleration (Auditory, slides 52–53).',
      ],
      sourceRefs: av([52, 53]),
    },
    {
      title: 'Semicircular canals',
      kind: 'pathway',
      paragraphs: [
        'The anterior, posterior and horizontal canals lie roughly at right angles to each other, behind the vestibule, filled with endolymph. Each has a dilatation, the ampulla, holding the crista ampullaris: hair cells whose stereocilia are embedded in a gelatinous cupula that blocks the ampulla. The tallest cilium is the kinocilium (Auditory, slides 54–55).',
      ],
      steps: [
        { label: 'Rotation', detail: 'The endolymph lags behind because of its inertia and deflects the cupula.' },
        { label: 'Bending', detail: 'Towards the kinocilium → depolarisation; away → hyperpolarisation.' },
        { label: 'Firing', detail: 'Hair cells release transmitter even at rest, so the nerve fires at a low rate. Depolarisation raises the rate; hyperpolarisation lowers it.' },
      ],
      sourceRefs: av([54, 55, 56, 57]),
    },
    {
      title: 'Otolith organs',
      kind: 'comparison',
      table: {
        columns: ['', 'Utricle', 'Saccule'],
        rows: [
          ['Senses motion in', 'The horizontal plane', 'The vertical plane'],
          ['Macula', 'Macula utriculi, roughly horizontal', 'Macula sacculi, roughly vertical'],
          ['Position', 'Joined by the semicircular canals', 'Next to the cochlea'],
        ],
      },
      paragraphs: [
        'Both are in the bony vestibule with endolymph continuous with the cochlear duct. Their hair cells have stereocilia and one kinocilium embedded in an otolith membrane containing CaCO₃ crystals (otoconia). In linear acceleration the denser crystals lag behind; bending towards the kinocilium excites and away inhibits, changing the firing of VIII (Auditory, slides 62–68).',
      ],
      sourceRefs: av([62, 63, 64, 68]),
    },
    {
      title: 'Central connections',
      kind: 'pathway',
      steps: [
        { label: 'Vestibular nuclei', detail: 'Lateral, medial, superior and inferior, in the brainstem, via VIII.' },
        { label: 'Vestibulospinal tracts', detail: 'To spinal motor nuclei for postural reflexes.' },
        { label: 'Medial longitudinal fasciculus', detail: 'To midbrain nuclei of the extraocular muscles — eye movements that compensate for head movement.' },
        { label: 'Vestibulocerebellar tracts', detail: 'To the cerebellum for coordination, balance and tone.' },
      ],
      keyPoints: ['Disturbance of the apparatus or its medullary centres causes dizziness, imbalance, disturbed tone and nystagmus (slide 72).'],
      sourceRefs: av([71, 72]),
    },
  ],
  summary: [
    'Canals: angular acceleration. Utricle (horizontal) and saccule (vertical): linear acceleration.',
    'Ampulla → crista → hair cells in the cupula; endolymph lags → cupula bends.',
    'Towards the kinocilium: depolarise, ↑firing; away: hyperpolarise, ↓firing. Resting firing at a low rate.',
    'Otoconia (CaCO₃) lag in linear acceleration.',
    'Vestibular nuclei → vestibulospinal (posture), MLF (eye movements), cerebellum.',
  ],
};

const lesson9: Draft = {
  id: 'special-senses-9',
  title: 'Taste',
  description: 'The five taste submodalities, taste buds and papillae, how each taste is transduced, and the central taste pathway.',
  xp: 25,
  sourceRefs: cs([1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 24, 25]),
  objectives: [
    'Describe the chemical senses and why they matter',
    'Name the five taste submodalities and what evokes each',
    'Describe the four cell types of a taste bud and the papillae',
    'Explain transduction of salty, sour, sweet, bitter and umami',
    'Trace the central taste pathway',
  ],
  chunks: [
    {
      title: 'The chemical senses',
      kind: 'overview',
      paragraphs: [
        'Smell and taste are our oldest senses, detecting chemicals in air (smell) or dissolved in liquid (taste). They complement each other, are essential for feeding, mating and avoiding danger, and connect to brain centres for emotion, thirst, sex, hunger and memory (Chemical Senses, slides 1–2).',
      ],
      sourceRefs: cs([1, 2]),
    },
    {
      title: 'Five tastes',
      kind: 'classification',
      paragraphs: ['Taste organs are mainly on the tongue, and also on the palate, pharynx and epiglottis (Chemical Senses, slide 4).'],
      table: {
        columns: ['Taste', 'Evoked by'],
        rows: [
          ['Bitter', 'Plant alkaloids such as quinine, some metallic salts'],
          ['Salty', 'Mainly Na⁺; other alkali metals less so the further from sodium'],
          ['Sweet', 'Sucrose, glucose, lactose, maltose, glycerol, alcohols, aldehydes, ketones, some synthetics'],
          ['Umami', 'Glutamate and ribonucleotides (meat) — makes food taste delicious'],
          ['Sour', 'All acids in dilute solution'],
        ],
      },
      sourceRefs: cs([4, 5, 6]),
    },
    {
      title: 'Taste buds and papillae',
      kind: 'structure',
      table: {
        columns: ['Cell', 'Role'],
        rows: [
          ['Type I', 'Glial-like; detect salty taste; clear transmitters'],
          ['Type II', 'Receptor cells for sweet, bitter and umami (GPCRs); release ATP onto type III cells and sensory neurons'],
          ['Type III', 'Presynaptic cells; sense sour; synapse with afferent terminals'],
          ['Type IV (basal)', 'Precursors of new taste cells'],
        ],
      },
      keyPoints: [
        'Taste cells live only about 250 ± 50 hours; their apical microvilli project into the taste pore (slides 9–10).',
        'Papillae: fungiform (front two-thirds), foliate (edges), circumvallate (back third) carry taste buds; filiform — the most numerous — are mechanical only. There is no tongue “map”: all five tastes are sensed everywhere (slides 11–12).',
      ],
      sourceRefs: cs([8, 9, 10, 11, 12]),
    },
    {
      title: 'Transduction',
      kind: 'mechanism',
      paragraphs: ['Stimuli pass through ion channels (salt, sour), block them (sour, bitter), open them (some sweet amino acids) or act on receptors linked to second messengers (sweet, bitter). The resulting receptor potential releases transmitter, giving a generator potential in the afferent (Chemical Senses, slides 15–16).'],
      table: {
        columns: ['Taste', 'Mechanism'],
        rows: [
          ['Salty', 'Na⁺ enters through an ion channel → depolarisation → Ca²⁺ entry → ATP release'],
          ['Sour', 'H⁺ enters through PKD2L1 (a pH-gated TRP channel) and blocks a K⁺ channel → depolarisation → Ca²⁺ → transmitter'],
          ['Sweet', 'T1R2 + T1R3 GPCR → gustducin → PLC-β2 → IP₃ and DAG → TRPM5 opens → depolarisation → Ca²⁺ → transmitter'],
          ['Bitter', 'T2R GPCRs → gustducin → PLC → TRPM5 and Ca²⁺ release from the ER; some block a K⁺ channel directly'],
          ['Umami', 'T1R1 + T1R3 GPCR; transduction like sweet'],
        ],
      },
      sourceRefs: cs([15, 16, 17, 18, 19, 20, 21]),
    },
    {
      title: 'Central pathway',
      kind: 'pathway',
      steps: [
        { label: 'Cranial nerves', detail: 'VII (facial), IX (glossopharyngeal), X (vagus).' },
        { label: 'Nucleus of the solitary tract', detail: 'All taste fibres synapse here.' },
        { label: 'Thalamus' },
        { label: 'Cortex and limbic system', detail: 'Lower postcentral gyrus, and limbic centres including hippocampus, amygdala and hypothalamus.' },
      ],
      sourceRefs: cs([24, 25]),
    },
  ],
  summary: [
    'Five tastes: bitter, salty (Na⁺), sweet, umami (glutamate), sour (acids).',
    'Type I (salty, glial), II (sweet/bitter/umami, ATP), III (sour, synapses), IV (stem). Taste cells live ~250 hours.',
    'Fungiform, foliate, circumvallate carry buds; filiform do not. No tongue map.',
    'Salty: Na⁺ channel. Sour: PKD2L1 + K⁺ block. Sweet (T1R2/T1R3), umami (T1R1/T1R3), bitter (T2R) → gustducin → PLC → TRPM5.',
    'VII, IX, X → solitary nucleus → thalamus → postcentral gyrus and limbic system.',
  ],
};

const lesson10: Draft = {
  id: 'special-senses-10',
  title: 'Smell',
  description: 'The ten primary odours, the olfactory epithelium, olfactory transduction through cAMP, and the olfactory pathway to the cortex and limbic system.',
  xp: 25,
  sourceRefs: cs([26, 27, 28, 29, 30, 31, 32, 33]),
  objectives: [
    'List the ten primary odours',
    'Describe the olfactory epithelium and its cells',
    'Explain olfactory transduction',
    'Trace the olfactory pathway and explain its link to emotion and memory',
  ],
  chunks: [
    {
      title: 'Odours and the olfactory epithelium',
      kind: 'structure',
      paragraphs: [
        'Smells are molecules small and light enough to vaporise. Smell uses more of the brain than any other sense. Humans recognise ten primary odours: fragrant, fruity, citrus, woody and resinous, chemical, sweet, minty, toasted and nutty, pungent, and decayed (Chemical Senses, slides 26–27).',
        'The olfactory epithelium, about 4.8 cm² in the roof of the nasal cavity, holds millions of receptor cells — the endings of primary afferent neurons. Its three cell types are olfactory sensory neurons, supporting (sustentacular) cells and basal cells that generate new neurons. Cilia project from the receptors into mucus made by underlying olfactory glands; odorants dissolve in the mucus to stimulate them (slides 27–29).',
      ],
      sourceRefs: cs([26, 27, 28]),
    },
    {
      title: 'Olfactory transduction',
      kind: 'pathway',
      paragraphs: ['Odorants have 3–4 to 18–20 carbon atoms and are both water- and lipid-soluble (Chemical Senses, slide 29).'],
      steps: [
        { label: 'Binding', detail: 'An odorant binds a receptor molecule in the cilia.' },
        { label: 'Odorant-specific G protein', detail: 'Activates adenylate cyclase: ATP → cAMP.' },
        { label: 'Cation channel opens', detail: 'cAMP opens it; Ca²⁺ and Na⁺ flow in.' },
        { label: 'Cl⁻ efflux', detail: 'Ca²⁺ opens Ca²⁺-gated Cl⁻ channels; Cl⁻ leaves, depolarising further.' },
        { label: 'Action potential', detail: 'The receptor potential brings the axon to threshold.' },
      ],
      keyPoints: ['The firing rate depends on the odorant’s concentration (slides 30–31).'],
      sourceRefs: cs([29, 30, 31]),
    },
    {
      title: 'The olfactory pathway',
      kind: 'pathway',
      steps: [
        { label: 'Olfactory nerve (I)', detail: 'Receptor axons bundle and pass through the cribriform plate, on the same side.' },
        { label: 'Olfactory bulb', detail: 'They synapse on mitral cell dendrites in glomeruli.' },
        { label: 'Olfactory tract', detail: 'Mitral cell axons.' },
        { label: 'Olfactory cortex and limbic system', detail: 'Hypothalamus, hippocampus and amygdala — emotion and memory.' },
      ],
      sourceRefs: cs([32, 33]),
    },
  ],
  summary: [
    'Ten primary odours; smell uses more brain than any other sense.',
    'Olfactory epithelium ~4.8 cm²: sensory neurons, supporting cells, basal (stem) cells; cilia in mucus.',
    'Odorant → receptor → G protein → adenylate cyclase → cAMP → cation channel (Na⁺, Ca²⁺ in) → Ca²⁺-gated Cl⁻ out → depolarisation.',
    'Nerve I → cribriform plate → olfactory bulb (mitral cells, glomeruli) → tract → olfactory cortex and limbic system.',
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9, lesson10].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: withSimulation(lesson.id, interactive[lesson.id]),
}));
