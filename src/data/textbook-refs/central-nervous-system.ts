// Textbook pages for each reading section of central-nervous-system (printed page numbers),
// matched to the section's own lecture text: Costanzo Physiology; Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "central-nervous-system-1": {
    2: [["costanzo-physiology", [115]]], // The sensory system
    3: [["guyton-hall-14e", [587, 588]], ["costanzo-physiology", [115]]], // Classifying sensory receptors
    5: [["guyton-hall-14e", [589, 590]]], // Adaptation
  },
  "central-nervous-system-2": {
    0: [["guyton-hall-14e", [685, 686, 687]], ["costanzo-physiology", [105, 106, 107]]], // The reflex arc
    1: [["guyton-hall-14e", [687]], ["costanzo-physiology", [103, 104, 105]]], // Muscle fibres and the muscle spindle
    2: [["guyton-hall-14e", [689, 690, 691]], ["costanzo-physiology", [105, 106]]], // The stretch (myotatic) reflex
    3: [["guyton-hall-14e", [686, 687, 688]], ["costanzo-physiology", [104, 105, 106]]], // γ-efferent discharge sets the sensitivity
    5: [["guyton-hall-14e", [689, 690, 691]], ["costanzo-physiology", [105, 106]]], // The inverse stretch reflex
    6: [["costanzo-physiology", [105, 106, 107]]], // Muscle tone
  },
  "central-nervous-system-3": {
    0: [["guyton-hall-14e", [619, 620]]], // Cutaneous, deep and visceral sensation
    1: [["guyton-hall-14e", [601, 602]], ["costanzo-physiology", [83]]], // The dorsal column (lemniscal) pathway
    2: [["guyton-hall-14e", [601, 602]], ["costanzo-physiology", [82, 83]]], // The spinothalamic (anterolateral) pathway
    3: [["guyton-hall-14e", [601, 602]], ["costanzo-physiology", [82, 83]]], // Where the pathways cross decides the side of the loss
    4: [["guyton-hall-14e", [605]]], // The somatic sensory cortex
    5: [["costanzo-physiology", [82, 83]]], // Temperature
  },
  "central-nervous-system-4": {
    1: [["guyton-hall-14e", [612, 613]]], // Pain receptors and pain chemicals
    2: [["guyton-hall-14e", [618, 619]]], // Superficial, deep and visceral pain
    3: [["guyton-hall-14e", [615, 616]], ["costanzo-physiology", [82, 83, 84]]], // The fast pain pathway
    4: [["guyton-hall-14e", [615, 616, 617]], ["costanzo-physiology", [82, 83, 84]]], // The slow pain pathway
    5: [["guyton-hall-14e", [617]]], // Pain control I: local suppression
    6: [["guyton-hall-14e", [617]]], // Pain control II: the brain’s analgesic (opiate) system
    7: [["guyton-hall-14e", [621]], ["costanzo-physiology", [82, 83, 84]]], // Referred pain, headache and dermatomes
  },
  "central-nervous-system-5": {
    0: [["guyton-hall-14e", [685, 686]], ["costanzo-physiology", [72]]], // Grey and white matter
    1: [["guyton-hall-14e", [685, 686]], ["costanzo-physiology", [70]]], // The cord and its connections
    2: [["costanzo-physiology", [70, 71, 72]]], // The spinal nerves
    5: [["guyton-hall-14e", [685, 686, 687]], ["costanzo-physiology", [82, 83, 84]]], // The laminae of the dorsal horn
  },
  "central-nervous-system-6": {
    0: [["guyton-hall-14e", [701, 702, 703]], ["costanzo-physiology", [110, 111]]], // The final common pathway
    1: [["guyton-hall-14e", [697, 698, 699]], ["costanzo-physiology", [110, 111, 112]]], // The motor areas
    2: [["guyton-hall-14e", [698, 699]]], // Specialised motor areas
    3: [["guyton-hall-14e", [716, 717, 718]], ["costanzo-physiology", [110, 111]]], // Sending the motor signal
    4: [["guyton-hall-14e", [699]], ["costanzo-physiology", [108]]], // The corticospinal (pyramidal) tracts
    5: [["costanzo-physiology", [108]]], // The brainstem and posture
    6: [["guyton-hall-14e", [702]], ["costanzo-physiology", [108]]], // Cortical and cord lesions
  },
  "central-nervous-system-7": {
    0: [["guyton-hall-14e", [711, 712, 713]], ["costanzo-physiology", [108]]], // Anatomy of the cerebellum
    1: [["guyton-hall-14e", [711, 712, 713]]], // Inputs
    2: [["guyton-hall-14e", [714]]], // Outputs
    3: [["guyton-hall-14e", [716, 717, 718]], ["costanzo-physiology", [110, 111]]], // Comparing intention with performance
    4: [["guyton-hall-14e", [718]]], // Damping and ballistic movements
    5: [["guyton-hall-14e", [719]]], // Planning and prediction: the lateral cerebellum
    6: [["guyton-hall-14e", [718, 719, 720]], ["costanzo-physiology", [110]]], // Signs of cerebellar dysfunction
  },
  "central-nervous-system-8": {
    0: [["guyton-hall-14e", [721, 722, 723]], ["costanzo-physiology", [110, 111]]], // What the basal ganglia are
    3: [["costanzo-physiology", [110, 111]]], // The brake
    4: [["guyton-hall-14e", [722, 723, 724]], ["costanzo-physiology", [110]]], // Parkinson’s disease (hypokinetic)
  },
  "central-nervous-system-9": {
    0: [["costanzo-physiology", [70, 71, 72]]], // How the brain is built
    1: [["guyton-hall-14e", [732, 733, 734]], ["costanzo-physiology", [72]]], // The frontal lobe
    2: [["guyton-hall-14e", [729, 730, 731]], ["costanzo-physiology", [72]]], // The temporal lobe
    3: [["guyton-hall-14e", [729, 730, 731]]], // The parietal lobe
    4: [["guyton-hall-14e", [729, 730, 731]], ["costanzo-physiology", [91]]], // The occipital lobe
    6: [["guyton-hall-14e", [731, 732]], ["costanzo-physiology", [74]]], // Cerebral dominance and the corpus callosum
    7: [["guyton-hall-14e", [749, 750]], ["costanzo-physiology", [72]]], // Thalamus, hypothalamus and limbic system
  },
};
