import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'cardiovascular-physiology-2': [
    { term: 'Pulse', meaning: 'The expansion of the arterial wall by the pressure wave from each ejection, felt by touch.' },
    { term: 'Jugular venous pulse', meaning: 'Pressure changes in the right atrium seen in the neck veins.' },
    { term: 'S1', meaning: 'The first heart sound: mitral and tricuspid valves closing, at the start of systole.' },
    { term: 'S2', meaning: 'The second heart sound: aortic and pulmonary valves closing, at the start of diastole.' },
    { term: 'Murmurs', meaning: 'Sounds of turbulent flow through an abnormal valve.' },
    { term: 'Auscultation', meaning: 'Listening with a stethoscope.' },
  ],
  'cardiovascular-physiology-5': [
    { term: 'Starling’s forces', meaning: 'The pressures that push fluid out of capillaries and draw it back in.' },
    { term: 'Hydrostatic pressure', meaning: 'Fluid pressure; in the capillary it pushes fluid out.' },
    { term: 'Oncotic pressure', meaning: 'The pull of plasma proteins that draws fluid into the capillary.' },
    { term: 'Oedema', meaning: 'An abnormal, excessive collection of fluid in the interstitial space.' },
    { term: 'Lymph', meaning: 'The extra filtered fluid, returned to the circulation by the lymphatics.' },
    { term: 'Central venous pressure', meaning: 'CVP: the pressure at the entrance to the right atrium, 4–6 mmHg.' },
  ],
  'cardiovascular-physiology-6': [
    { term: 'Autoregulation', meaning: 'A tissue keeping its own blood flow steady by changing its vascular resistance.' },
    { term: 'Myogenic', meaning: 'The theory that smooth muscle contracts when stretched by a rise in pressure.' },
    { term: 'Total peripheral resistance', meaning: 'Resistance of the vessels: BP = cardiac output × TPR.' },
    { term: 'Vasomotor centre', meaning: 'Neurons in the medulla that control the heart and vessels.' },
    { term: 'Baroreceptors', meaning: 'Stretch receptors in the carotid sinus and aortic arch that sense blood pressure.' },
    { term: 'Cushing’s reflex', meaning: 'Raised intracranial pressure gives hypertension with bradycardia.' },
  ],
  'cardiovascular-physiology-7': [
    { term: 'Orthostatic', meaning: 'Postural: a fall in BP on standing up suddenly.' },
    { term: 'Shock', meaning: 'Tissue perfusion too low to maintain normal metabolism.' },
    { term: 'Hypovolaemic', meaning: 'Shock from low blood volume, e.g. haemorrhage or burns.' },
    { term: 'Cardiogenic', meaning: 'Shock from inadequate pumping, e.g. MI.' },
    { term: 'Syncope', meaning: 'Fainting from inadequate cerebral blood flow.' },
    { term: 'Heart failure', meaning: 'The heart cannot pump enough to meet the tissues’ needs.' },
  ],
  'cardiovascular-physiology-9': [
    { term: 'ECG', meaning: 'The electrocardiogram: the heart’s electrical activity recorded on the body surface.' },
    { term: 'P wave', meaning: 'Atrial depolarisation.' },
    { term: 'QRS complex', meaning: 'Ventricular depolarisation.' },
    { term: 'T wave', meaning: 'Ventricular repolarisation.' },
    { term: 'Sinus rhythm', meaning: 'The regular beat set by the SA node, about 70 a minute at rest.' },
    { term: 'Heart block', meaning: 'Slowed or blocked conduction from atria to ventricles.' },
  ],
};
