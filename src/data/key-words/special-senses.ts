import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'special-senses-1': [
    { term: 'Sclera', meaning: 'The tough outer coat: the white of the eye; its clear front is the cornea.' },
    { term: 'Choroid', meaning: 'The vascular middle coat; in front it forms the iris and ciliary body.' },
    { term: 'Retina', meaning: 'The inner neural coat holding the rods and cones.' },
    { term: 'Fovea centralis', meaning: 'The point of sharpest vision, with cones only.' },
    { term: 'Aqueous humour', meaning: 'Watery fluid in the front of the eye, draining through the canal of Schlemm.' },
    { term: 'Glaucoma', meaning: 'Raised eye pressure damaging the retina and optic nerve.' },
  ],
  'special-senses-2': [
    { term: 'Refraction', meaning: 'Bending of light; most happens at the cornea, the adjustable part in the lens.' },
    { term: 'Accommodation', meaning: 'Changing the lens’s power to focus near or far.' },
    { term: 'Presbyopia', meaning: 'Loss of accommodation with age, making reading difficult.' },
    { term: 'Myopia', meaning: 'Near-sightedness: focus falls in front of the retina.' },
    { term: 'Hyperopia', meaning: 'Far-sightedness: focus falls behind the retina.' },
    { term: 'Cataract', meaning: 'Clouding of the lens.' },
  ],
  'special-senses-3': [
    { term: 'Photoreceptors', meaning: 'The rods and cones, which turn light into a signal.' },
    { term: 'Rods', meaning: 'Receptors for dim light: night vision, no colour.' },
    { term: 'Cones', meaning: 'Receptors for bright light and colour, in three types.' },
    { term: 'Rhodopsin', meaning: 'The rod pigment: 11-cis retinal + scotopsin.' },
    { term: 'Transducin', meaning: 'The G protein activated by light-changed rhodopsin.' },
    { term: 'Hyperpolarises', meaning: 'Light makes the photoreceptor more negative, so it releases less glutamate.' },
  ],
  'special-senses-4': [
    { term: 'Convergence', meaning: 'Many rods feeding one bipolar cell: more sensitive, less sharp.' },
    { term: 'Bipolar cells', meaning: 'Carry signals from photoreceptors towards ganglion cells.' },
    { term: 'Ganglion cells', meaning: 'Fire action potentials along the optic nerve.' },
    { term: 'Optic chiasm', meaning: 'Where fibres from the nasal halves of the retinas cross.' },
    { term: 'Hemianopia', meaning: 'Loss of half of the visual field.' },
  ],
  'special-senses-6': [
    { term: 'Ossicles', meaning: 'Malleus, incus and stapes, carrying vibration across the middle ear.' },
    { term: 'Cochlea', meaning: 'The snail-shaped hearing organ of the inner ear.' },
    { term: 'Perilymph', meaning: 'The fluid of the bony labyrinth.' },
    { term: 'Endolymph', meaning: 'The fluid of the membranous labyrinth.' },
    { term: 'Basilar membrane', meaning: 'The floor of the cochlear duct, on which the organ of Corti rests.' },
    { term: 'Organ of Corti', meaning: 'Holds the hair cells that sense sound.' },
  ],
  'special-senses-7': [
    { term: 'Stereocilia', meaning: 'Hair-cell projections whose bending opens channels.' },
    { term: 'Place theory', meaning: 'Different parts of the basilar membrane vibrate at different frequencies.' },
    { term: 'Cochlear nerve', meaning: 'Carries action potentials from the cochlea to the brainstem.' },
    { term: 'Conductive', meaning: 'Hearing loss from sound blocked in the outer or middle ear.' },
    { term: 'Sensorineural', meaning: 'Hearing loss from damage to inner-ear cells or the nerve; permanent.' },
  ],
  'special-senses-8': [
    { term: 'Vestibular system', meaning: 'Detects the position and motion of the head.' },
    { term: 'Semicircular canals', meaning: 'Three canals that sense rotation (angular acceleration).' },
    { term: 'Cupula', meaning: 'The gel over the hair cells in each ampulla, pushed by lagging endolymph.' },
    { term: 'Otolith organs', meaning: 'The utricle and saccule, which sense linear acceleration.' },
    { term: 'Nystagmus', meaning: 'Involuntary eye movements when the vestibular system is disturbed.' },
  ],
  'special-senses-9': [
    { term: 'Umami', meaning: 'The savoury taste of glutamate.' },
    { term: 'Taste buds', meaning: 'Clusters of taste cells, mainly on the tongue’s papillae.' },
    { term: 'Papillae', meaning: 'Bumps on the tongue; all but filiform carry taste buds.' },
    { term: 'Gustducin', meaning: 'The G protein for sweet, bitter and umami.' },
    { term: 'Transduction', meaning: 'Turning a taste chemical into an electrical signal.' },
  ],
  'special-senses-10': [
    { term: 'Odorant', meaning: 'A molecule small and light enough to vaporise and be smelt.' },
    { term: 'Olfactory epithelium', meaning: 'The patch in the roof of the nose holding the smell receptors.' },
    { term: 'Adenylate cyclase', meaning: 'Makes cAMP when an odorant binds, opening cation channels.' },
    { term: 'Cribriform plate', meaning: 'The bone the receptor axons pass through to the olfactory bulb.' },
    { term: 'Mitral cell', meaning: 'The cells the receptor axons synapse on in the glomeruli.' },
  ],
};
