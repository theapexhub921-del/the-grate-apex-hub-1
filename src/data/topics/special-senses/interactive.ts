// Physiology → Special Senses — layer 1 (learn by answering) and
// reading-layer extras. Checkpoint IDs: cN-xx; recall prompts: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, learn, match, mcq, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { av, cs, vs, type ConceptId } from '@/data/topics/special-senses/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'special-senses-1': [
    ask(mcq('c1-01', 'eye-coats', 'Which coat of the eye contains melanin to stop light reflecting inside the eyeball?', 'The choroid', ['The sclera', 'The retina', 'The cornea'], { explanation: 'Visual System, slide 3.' })),
    learn('Inside the eye', ['The lens divides it into the posterior cavity (vitreous humour) and the anterior cavity (aqueous humour), which has an anterior chamber (cornea–iris) and a posterior chamber (iris–lens).'], { sourceRefs: vs([6, 7]) }),
    ask(order('c1-02', 'aqueous-humour', 'Order the flow of aqueous humour.', ['Ciliary epithelium', 'Posterior chamber', 'Pupil', 'Anterior chamber', 'Trabecular meshwork', 'Canal of Schlemm'], { explanation: 'Visual System, slide 11.' })),
    ask(mcq('c1-03', 'aqueous-humour', 'The trabecular meshwork becomes blocked. What happens?', 'Intraocular pressure rises — glaucoma', ['The lens becomes cloudy — cataract', 'The pupil dilates and stays fixed', 'Tears stop being produced'], { explanation: 'Visual System, slides 11–12.', skill: 'prediction', clinical: true })),
    recall('r1-01', 'eye-coats', 'Describe the three coats of the eye and the parts of each.', [
      'Sclera: outer, fibrous, white; protects and gives rigidity; its front is the transparent cornea; pierced by the optic nerve.',
      'Choroid: middle, vascular, with melanin; in front forms the iris, ciliary body and zonules.',
      'Retina: inner, neural; rods and cones; macula with the fovea (cones only); optic disc is the blind spot.',
    ], vs([2, 3, 4, 5])),
  ],
  'special-senses-2': [
    ask(mcq('c2-01', 'refraction', 'Where does most of the eye’s refraction take place?', 'The cornea (about 80%)', ['The lens (about 80%)', 'The vitreous humour', 'The retina'], { explanation: 'Visual System, slides 15–16.' })),
    learn('Near and far', ['Near: ciliary muscle contracts, zonules slacken, the lens rounds up. Far: ciliary muscle relaxes, zonules tighten, the lens thins.'], { sourceRefs: vs([18, 19]) }),
    ask(mcq('c2-02', 'accommodation', 'You look up from a book at a distant hill. What does the ciliary muscle do?', 'Relaxes, so the zonules tighten and the lens thins', ['Contracts, so the zonules slacken and the lens rounds up', 'Nothing — the cornea changes its curve instead', 'Contracts, so the zonules tighten and the lens thins'], { explanation: 'Visual System, slide 19.', skill: 'application' })),
    ask(match('c2-03', 'refractive-errors', 'Match each error to its correcting lens.', [
      ['Myopia', 'Biconcave'],
      ['Hyperopia', 'Convex'],
      ['Astigmatism', 'Spherocylindrical'],
      ['Presbyopia', 'Bifocal'],
    ], { explanation: 'Visual System, slides 22–27.' })),
    recall('r2-01', 'accommodation', 'What is the near response, and why does near vision fail with age?', [
      'Looking at a near object brings accommodation (rounder lens), convergence of the visual axes and pupil constriction.',
      'With age the ciliary muscle and lens lose elasticity, so accommodation declines and the near point recedes: presbyopia.',
    ], vs([22, 23])),
  ],
  'special-senses-3': [
    ask(mcq('c3-01', 'rods-cones', 'Which photoreceptors give night (scotopic) vision?', 'Rods', ['Cones', 'Ganglion cells', 'Bipolar cells'], { explanation: 'Visual System, slides 43–44.' })),
    learn('The dark current', ['In the dark cGMP holds CNG channels open; Na⁺ flows in, the cell sits at about −30 mV and releases glutamate.'], { sourceRefs: vs([48, 49]) }),
    ask(order('c3-02', 'phototransduction', 'Order the events after light hits a rod.', ['11-cis retinal becomes all-trans', 'Metarhodopsin II activates transducin', 'Phosphodiesterase hydrolyses cGMP', 'CNG channels close', 'The cell hyperpolarises', 'Glutamate release falls'], { explanation: 'Visual System, slides 51–52.' })),
    ask(mcq('c3-03', 'phototransduction', 'What does light do to a photoreceptor’s membrane potential?', 'Hyperpolarises it, from about −30 to −90 mV', ['Depolarises it, from about −90 to −30 mV', 'Fires a burst of action potentials', 'No change in membrane potential'], { explanation: 'Visual System, slide 52.', skill: 'prediction' })),
    recall('r3-01', 'phototransduction', 'Explain phototransduction in a rod, in the dark and in the light.', [
      'Dark: high cGMP keeps CNG channels open; Na⁺ (and Ca²⁺) enter — the dark current; the cell is depolarised and releases glutamate.',
      'Light: 11-cis retinal → all-trans; metarhodopsin II activates transducin, which activates phosphodiesterase.',
      'cGMP is hydrolysed, CNG channels close, the cell hyperpolarises to about −90 mV and releases less glutamate.',
    ], vs([48, 49, 51, 52])),
  ],
  'special-senses-4': [
    ask(mcq('c4-01', 'retinal-processing', 'Why is rod vision sensitive but blurry?', 'Many rods converge on one bipolar cell', ['Rods are at the fovea', 'Rods have no pigment', 'Rods connect directly to ganglion cells'], { explanation: 'Visual System, slide 63.', skill: 'cause-effect' })),
    learn('Which fibres cross', ['Nasal hemiretina fibres (seeing the temporal field) cross at the chiasm; temporal fibres stay on their own side. So each optic tract carries the opposite half of the visual field.'], { sourceRefs: vs([68, 69]) }),
    ask(mcq('c4-02', 'field-defects', 'A pituitary tumour presses on the optic chiasm. What visual field defect results?', 'Bitemporal hemianopia', ['Left homonymous hemianopia', 'Blindness in one eye', 'Loss of central vision only'], { explanation: 'Visual System, slide 71: the crossing nasal fibres see the temporal fields.', skill: 'application', clinical: true })),
    ask(mcq('c4-03', 'field-defects', 'A stroke damages the right optic tract. What is lost?', 'The left half of the visual field in both eyes', ['The right half of the visual field in both eyes', 'All vision in the right eye only', 'Both temporal halves of the visual field'], { explanation: 'Visual System, slide 72: left homonymous hemianopia.', skill: 'pathway-reasoning' })),
    recall('r4-01', 'optic-pathway', 'Trace the optic pathway from retina to cortex.', [
      'Ganglion cell axons form the optic nerve.',
      'At the optic chiasm nasal hemiretina fibres cross; temporal fibres do not.',
      'Optic tracts (crossed + uncrossed) → lateral geniculate nucleus of the thalamus.',
      'Optic radiations → primary visual cortex at the back of the brain.',
    ], vs([68, 69])),
  ],
  'special-senses-5': [
    ask(mcq('c5-01', 'colour-vision', 'A man has no green cone pigment at all. What is this called?', 'Deuteranopia', ['Protanopia', 'Tritanopia', 'Deuteranomaly'], { explanation: 'Visual System, slide 77: -opia = absent; -anomaly = malfunctioning.', skill: 'terminology' })),
    learn('Adaptation', ['Dark adaptation is slow (cones first, rods up to 4 hours) as pigments regenerate; light adaptation takes about 5 minutes as pigments bleach.'], { sourceRefs: vs([82, 85]) }),
    ask(mcq('c5-02', 'pupil', 'Light shone into the left eye only. What happens to the right pupil?', 'It constricts too — the consensual reflex', ['It dilates', 'Nothing', 'It constricts only if the right eye is also lit'], { explanation: 'Visual System, slide 87: both Edinger–Westphal nuclei receive the signal.', skill: 'prediction' })),
    ask(match('c5-03', 'eye-movements', 'Match each extraocular muscle to its main action.', [
      ['Lateral rectus', 'Abduction'],
      ['Medial rectus', 'Adduction'],
      ['Superior oblique', 'Intorsion'],
      ['Inferior oblique', 'Extorsion'],
    ], { explanation: 'Visual System, slides 99–100.' })),
    recall('r5-01', 'pupil', 'Trace the pupillary light reflex.', [
      'Light → retina → optic tract fibres that leave before the LGN for the pretectal nucleus (midbrain).',
      'Bilateral projections to the Edinger–Westphal nuclei.',
      'Preganglionic fibres in the oculomotor nerve to the ciliary ganglion; short ciliary nerves to the constrictor pupillae.',
      'Both pupils constrict (direct and consensual).',
    ], vs([87, 88, 89])),
  ],
  'special-senses-6': [
    ask(mcq('c6-01', 'ear-structure', 'What equalises pressure on both sides of the eardrum?', 'The Eustachian tube', ['The round window membrane', 'The stapedius', 'The cochlear duct'], { explanation: 'Auditory, slide 4.' })),
    learn('Two fluids', ['Perilymph fills the bony labyrinth (scala vestibuli and tympani); endolymph fills the membranous labyrinth (scala media, canals, utricle, saccule).'], { sourceRefs: av([6, 13]) }),
    ask(mcq('c6-02', 'cochlea', 'Which hair cells amplify basilar membrane vibration?', 'Outer hair cells', ['Inner hair cells', 'Vestibular hair cells', 'Supporting cells'], { explanation: 'Auditory, slide 26: they are electromotile.' })),
    ask(order('c6-03', 'sound-transmission', 'Order the transmission of sound.', ['Eardrum', 'Malleus', 'Incus', 'Stapes', 'Oval window', 'Scala vestibuli perilymph'], { explanation: 'Auditory, slides 32–33.' })),
    recall('r6-01', 'sound-transmission', 'Why are the ossicles needed, and how do they help?', [
      'Sound passes from air to the fluid of the inner ear, which has a much higher impedance; most energy would be reflected.',
      'The ossicles act as an impedance-matching device by the area ratio (large eardrum, small oval window), the ossicular lever and buckling of the eardrum.',
      'The stapedius and tensor tympani can also damp loud sounds (tympanic reflex).',
    ], av([32, 33])),
  ],
  'special-senses-7': [
    ask(mcq('c7-01', 'auditory-transduction', 'Bending stereocilia towards the tallest ones…', 'Depolarises the hair cell', ['Hyperpolarises the hair cell', 'Has no effect on the hair cell', 'Closes the MET channels'], { explanation: 'Auditory, slide 36.' })),
    learn('Which ion?', ['When MET channels open, K⁺ (and Ca²⁺) flows in from the K⁺-rich endolymph, depolarising the cell.'], { sourceRefs: av([37]) }),
    ask(mcq('c7-02', 'auditory-pathway', 'A lesion in the right lateral lemniscus causes…', 'No one-sided deafness, because the pathway is bilateral', ['Deafness in the right ear only, from the uncrossed fibres', 'Deafness in the left ear only, from the crossed fibres', 'Total deafness in both ears'], { explanation: 'Auditory, slide 44: only nerve or cochlear nucleus lesions give one-sided deafness.', skill: 'pathway-reasoning' })),
    ask(mcq('c7-03', 'deafness', 'Hearing loss from years of loud music is…', 'Sensorineural', ['Conductive', 'Central', 'Temporary only'], { explanation: 'Auditory, slide 50.', clinical: true })),
    recall('r7-01', 'auditory-pathway', 'Trace the central auditory pathway from the cochlear nerve to the cortex.', [
      'Cochlear nerve (VIII) → cochlear nucleus in the brainstem.',
      'Mostly crossed (some uncrossed) fibres, some relaying in the superior olive or trapezoid body, ascend in the lateral lemniscus.',
      'Inferior colliculus → medial geniculate body → primary auditory cortex in the temporal lobe.',
    ], av([43, 44])),
  ],
  'special-senses-8': [
    ask(mcq('c8-01', 'vestibular-overview', 'Which part of the vestibular system detects angular acceleration (turning the head)?', 'The semicircular canals', ['The utricle and saccule', 'The saccule', 'The cochlea'], { explanation: 'Auditory, slide 52.' })),
    learn('Why rotation is sensed', ['When the head turns, the endolymph lags behind because of inertia and pushes the cupula, bending the hair cells.'], { sourceRefs: av([56]) }),
    ask(mcq('c8-02', 'semicircular-canals', 'A hair cell’s cilia bend away from the kinocilium. What happens to its nerve fibre?', 'Its resting firing rate falls', ['It fires faster than at rest', 'It stays silent, as it was before', 'It fires only a single spike'], { explanation: 'Auditory, slides 56–57: hair cells release transmitter at rest, so firing can go up or down.', skill: 'prediction' })),
    ask(match('c8-03', 'otolith-organs', 'Match each organ to the motion it senses.', [
      ['Utricle', 'Linear motion in the horizontal plane'],
      ['Saccule', 'Linear motion in the vertical plane'],
      ['Semicircular canals', 'Angular acceleration'],
    ], { explanation: 'Auditory, slides 52, 62–63.' })),
    recall('r8-01', 'vestibular-pathway', 'Where do vestibular signals go, and what does each target do?', [
      'VIII → vestibular nuclei (lateral, medial, superior, inferior) in the brainstem.',
      'Vestibulospinal tracts → spinal motor nuclei for postural reflexes.',
      'Medial longitudinal fasciculus → extraocular motor nuclei to compensate eye position for head movement.',
      'Vestibulocerebellar tracts → cerebellum for coordination, balance and tone.',
    ], av([71, 72])),
  ],
  'special-senses-9': [
    ask(mcq('c9-01', 'taste-modalities', 'Which taste is elicited by glutamate?', 'Umami', ['Sweet', 'Salty', 'Bitter'], { explanation: 'Chemical Senses, slide 5.' })),
    learn('Two kinds of mechanism', ['Salty and sour act through ion channels; sweet, bitter and umami act on G-protein-coupled receptors linked to gustducin, PLC and TRPM5.'], { sourceRefs: cs([15, 17, 19, 21]) }),
    ask(mcq('c9-02', 'taste-transduction', 'Which channel lets H⁺ into sour-sensing cells?', 'PKD2L1, a TRP channel', ['TRPM5', 'ENaC-like Na⁺ channel only', 'A cAMP-gated channel'], { explanation: 'Chemical Senses, slides 17–18.' })),
    ask(mcq('c9-03', 'taste-buds', 'Which papillae contain no taste cells?', 'Filiform', ['Fungiform', 'Foliate', 'Circumvallate'], { explanation: 'Chemical Senses, slide 12.' })),
    recall('r9-01', 'taste-transduction', 'Explain how sweet taste is transduced.', [
      'Sweet substances bind a GPCR made of T1R2 and T1R3 subunits.',
      'The G protein gustducin activates phospholipase C-β2, producing IP₃ and DAG.',
      'These open TRPM5 channels → depolarisation → Ca²⁺ entry through voltage-gated channels.',
      'Transmitter is released, increasing firing in the primary afferent.',
    ], cs([19, 20])),
  ],
  'special-senses-10': [
    ask(mcq('c10-01', 'olfactory-epithelium', 'Which cells regenerate olfactory sensory neurons?', 'Basal cells', ['Supporting cells', 'Mitral cells', 'Olfactory gland cells'], { explanation: 'Chemical Senses, slide 28.' })),
    learn('Second messenger', ['Smell uses cAMP: odorant → G protein → adenylate cyclase → cAMP opens a cation channel; Ca²⁺ then opens Cl⁻ channels for more depolarisation.'], { sourceRefs: cs([29, 30]) }),
    ask(mcq('c10-02', 'olfactory-transduction', 'In olfactory cilia, what does the influx of Ca²⁺ open?', 'Ca²⁺-gated Cl⁻ channels, letting Cl⁻ out', ['K⁺ channels, letting K⁺ flow in', 'TRPM5 channels, letting Na⁺ in', 'CNG channels, which then close'], { explanation: 'Chemical Senses, slide 30.' })),
    ask(order('c10-03', 'olfactory-pathway', 'Order the olfactory pathway.', ['Olfactory sensory neurons', 'Olfactory nerve through the cribriform plate', 'Glomeruli with mitral cells in the olfactory bulb', 'Olfactory tract', 'Olfactory cortex and limbic system'], { explanation: 'Chemical Senses, slides 32–33.' })),
    recall('r10-01', 'olfactory-transduction', 'Explain olfactory transduction.', [
      'Odorants dissolve in mucus and bind receptor molecules on the cilia.',
      'An odorant-specific G protein activates adenylate cyclase → cAMP.',
      'cAMP opens a cation channel: Na⁺ and Ca²⁺ enter; Ca²⁺ opens Cl⁻ channels and Cl⁻ leaves, depolarising further.',
      'The receptor potential triggers action potentials; firing rate rises with odorant concentration.',
    ], cs([29, 30, 31])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'special-senses-1': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Fovea: cones only, sharpest vision; optic disc: blind spot.', 'Aqueous → canal of Schlemm; blocked drainage → glaucoma.'],
    confusions: [{ confusion: 'The posterior chamber is behind the lens.', clarification: 'It is between the iris and the lens; behind the lens is the posterior cavity with vitreous humour (Visual System, slides 6–7).' }],
  },
  'special-senses-2': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Cornea ~80% of refraction.', 'Near: ciliary contracts, zonules slack, lens rounder.', 'Myopia → concave; hyperopia → convex.'],
    confusions: [{ confusion: 'For near vision the zonules tighten.', clarification: 'The ciliary muscle contracts and the zonules relax, letting the lens round up (Visual System, slides 18–19).' }],
  },
  'special-senses-3': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Rods 95% of 150 million receptors.', 'Light → ↓cGMP → hyperpolarisation → ↓glutamate.', 'Rhodopsin = 11-cis retinal + scotopsin.'],
    confusions: [{ confusion: 'Light depolarises photoreceptors.', clarification: 'Light hyperpolarises them; they are depolarised in the dark (Visual System, slides 48–52).' }],
  },
  'special-senses-4': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Nasal fibres cross at the chiasm.', 'Chiasm lesion → bitemporal hemianopia.', 'Tract lesion → contralateral homonymous hemianopia.'],
    confusions: [{ confusion: 'A right optic tract lesion blinds the right eye.', clarification: 'It removes the left half of the field in both eyes (Visual System, slide 72).' }],
  },
  'special-senses-5': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Red/green colour blindness ~99%.', 'Light reflex: pretectal → Edinger–Westphal → III.', 'SO intorts, IO extorts.'],
    confusions: [{ confusion: 'Light in one eye constricts only that pupil.', clarification: 'Both pupils constrict — the consensual reflex (Visual System, slide 87).' }],
  },
  'special-senses-6': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Scala media = endolymph, organ of Corti.', 'Outer hair cells amplify; inner hair cells detect.', '> 85 dB can damage hearing.'],
    confusions: [{ confusion: 'The basilar membrane is widest at the base.', clarification: 'It is narrowest and stiffest at the base, widest at the apex (Auditory, slide 14).' }],
  },
  'special-senses-7': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['K⁺ influx depolarises hair cells.', 'Medial geniculate → temporal cortex.', 'Sensorineural loss is permanent.'],
    confusions: [{ confusion: 'A brainstem lesion above the cochlear nuclei causes deafness in one ear.', clarification: 'The pathway is bilateral above the cochlear nuclei (Auditory, slide 44).' }],
  },
  'special-senses-8': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Canals: rotation; otoliths: linear.', 'Towards the kinocilium → excitation.', 'MLF links vestibular nuclei to eye muscles.'],
    confusions: [{ confusion: 'Vestibular fibres are silent at rest.', clarification: 'They fire at a low rate, which rises or falls with the direction of bending (Auditory, slides 56–57).' }],
  },
  'special-senses-9': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Sweet T1R2/T1R3; umami T1R1/T1R3; bitter T2R.', 'Taste via VII, IX, X → solitary nucleus.', 'No tongue map.'],
    confusions: [{ confusion: 'Each part of the tongue tastes only one taste.', clarification: 'All five tastes are sensed in all areas (Chemical Senses, slide 12).' }],
  },
  'special-senses-10': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Olfaction uses cAMP and Ca²⁺-gated Cl⁻ efflux.', 'Mitral cells in glomeruli of the bulb.', 'Links to limbic system: emotion, memory.'],
    confusions: [{ confusion: 'Smell, like the other senses, relays first in the thalamus.', clarification: 'Olfactory signals go from the bulb to the olfactory cortex and limbic system (Chemical Senses, slides 32–33).' }],
  },
};
