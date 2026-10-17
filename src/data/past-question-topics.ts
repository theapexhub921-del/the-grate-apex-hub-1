// HB2 past questions, sorted by topic. scripts/sort-past-questions-by-topic.mjs
// gives every question in public/curriculum/hb2-*.json a topic id (`tp`); this
// lists those topics per course, in course order. An id that matches one of this
// app's topics (data/curriculum.ts) is offered on that topic's card in the custom
// quiz; the others are groups without lessons yet (e.g. Embryology). Pure, for tests.
import type { SubjectId } from '@/data/lesson-types';

export type PastTopic = { id: string; title: string };

export const OTHER_PAST_TOPIC = 'other';

export const PAST_TOPICS: Record<string, readonly PastTopic[]> = {
  'hb2-anatomy': [
    { id: 'upper-limb', title: 'Upper Limb' },
    { id: 'cardiovascular-system-gross', title: 'Cardiovascular System' },
    { id: 'respiratory-system-gross', title: 'Respiratory System' },
    { id: 'gastrointestinal-system-gross', title: 'Gastrointestinal System' },
    { id: 'general-anatomy', title: 'General Anatomy: Bones, Joints and Body Systems' },
    { id: 'embryology', title: 'Embryology' },
    { id: 'histology', title: 'Histology' },
    { id: OTHER_PAST_TOPIC, title: 'Other topics' },
  ],
  'hb2-biochemistry': [
    { id: 'fatty-acid-biosynthesis', title: 'Fatty Acid Biosynthesis' },
    { id: 'cholesterol-and-bile-biosynthesis', title: 'Cholesterol and Bile Biosynthesis' },
    { id: 'heme-metabolism', title: 'Haem and Haem Metabolism' },
    { id: 'oxygen-carriers', title: 'Oxygen Carriers: Myoglobin and Haemoglobin' },
    { id: 'blood-coagulation-and-fibrinolysis', title: 'Blood Coagulation and Fibrinolysis' },
    { id: 'hormones-endocrine-biochemistry', title: 'Endocrine System: Hormones' },
    { id: 'inborn-errors-of-metabolism', title: 'Inborn Errors of Metabolism' },
    { id: 'collagen-synthesis', title: 'Collagen and Elastin' },
    { id: 'amino-acid-metabolism', title: 'Amino Acid Metabolism' },
    { id: 'free-radicals-and-oxygen-toxicity', title: 'Free Radicals and Oxygen Toxicity' },
    { id: 'immunology', title: 'Immunology' },
    { id: 'nucleic-acids', title: 'Nucleic Acids' },
    { id: 'vitamin-a-and-vision', title: 'Vitamin A and Vision' },
    { id: OTHER_PAST_TOPIC, title: 'Other topics' },
  ],
  'hb2-physiology': [
    { id: 'cardiovascular-physiology', title: 'Cardiovascular Physiology' },
    { id: 'respiratory-physiology', title: 'Respiratory Physiology' },
    { id: 'blood', title: 'Blood' },
    { id: 'central-nervous-system', title: 'Central Nervous System' },
    { id: 'special-senses', title: 'Special Senses' },
    { id: 'endocrinology', title: 'Endocrinology' },
    { id: 'reproductive-physiology', title: 'Reproductive Physiology' },
    { id: 'gastrointestinal-physiology', title: 'Gastrointestinal Physiology' },
    { id: 'metabolism-and-temperature', title: 'Metabolism and Body Temperature' },
    { id: 'renal-physiology', title: 'Renal Physiology' },
    { id: OTHER_PAST_TOPIC, title: 'Other topics' },
  ],
};

/** The HB2 course whose past questions cover a subject's topics. */
export const pastCourseForSubject = (subject: SubjectId) => `hb2-${subject}`;

export const pastTopicTitle = (courseId: string, topicId: string) =>
  PAST_TOPICS[courseId]?.find((topic) => topic.id === topicId)?.title ?? 'Other topics';
