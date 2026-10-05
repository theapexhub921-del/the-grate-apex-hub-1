// Explore content for Explore V1.
//
// Explore is optional discovery — it is NOT graded or tracked, and it is
// deliberately independent of courses, lessons, quizzes, progress and
// friends data. Do not import those modules here.
//
// Screens must read content through the functions below, so this static
// list can later be replaced by an admin/content system without
// rewriting the screens.

export type ExploreCategory = 'concept' | 'research' | 'grateapex';

// Internal destinations an Explore item may link to.
// Only screens that already exist in the app belong here.
export type ExploreActionHref = '/' | '/social/friends' | '/progress' | '/learn' | '/profile';

export type ExploreAction = {
  label: string;
  href: ExploreActionHref;
};

export type ExploreProvenance = {
  // 'draft'    = demonstration content awaiting owner/expert review
  // 'reviewed' = checked and approved
  // 'feature'  = describes a real GRATEAPEX feature
  status: 'draft' | 'reviewed' | 'feature';
  note: string;
};

export type ExploreSource = {
  title: string;
  url?: string;
};

export type ExploreItem = {
  id: string; // stable ID, e.g. 'concept-heart-pacemaker'
  category: ExploreCategory;
  topic: string; // small label, e.g. 'Cardiovascular'
  title: string;
  summary: string; // one line for cards
  basicIdea: string;
  whyItMatters?: string;
  provenance: ExploreProvenance;
  sources: ExploreSource[]; // empty until real sources are added
  publishedAt: string; // YYYY-MM-DD
  featured: boolean;
  tags: string[]; // future topic mapping only — not linked to Learn yet
  action?: ExploreAction;
};

const DRAFT_CONCEPT: ExploreProvenance = {
  status: 'draft',
  note: 'Draft demonstration content for owner review. Not official course material.',
};

const FEATURE: ExploreProvenance = {
  status: 'feature',
  note: 'A feature available in GRATEAPEX today.',
};

const exploreItems: ExploreItem[] = [
  // ---------- Concepts & Connections (draft demo content) ----------
  {
    id: 'concept-heart-pacemaker',
    category: 'concept',
    topic: 'Cardiovascular',
    title: "The heart's built-in pacemaker",
    summary: 'Your heart starts each beat by itself — no signal from the brain needed.',
    basicIdea:
      'A small group of specialised cells in the right atrium, the sinoatrial (SA) node, produces electrical impulses on its own. Each impulse spreads through the heart and makes it contract. Nerves from the brain can speed the rhythm up or slow it down, but they do not start each beat.',
    whyItMatters:
      'This is why a transplanted heart, whose nerves have been cut, can still beat. It is also the basis of the ECG, which records this electrical activity, and of artificial pacemakers, which take over when the natural rhythm fails.',
    provenance: DRAFT_CONCEPT,
    sources: [],
    publishedAt: '2026-09-26',
    featured: true,
    tags: ['cardiovascular', 'physiology', 'electrophysiology'],
  },
  {
    id: 'concept-shivering-fever',
    category: 'concept',
    topic: 'Physiology',
    title: 'Why you shiver when you have a fever',
    summary: 'Chills during a fever come from the body raising its own thermostat.',
    basicIdea:
      'The hypothalamus in the brain works like a thermostat with a "set point" for body temperature. Shivering — rapid, involuntary muscle contractions — produces heat to bring the body up to that set point.',
    whyItMatters:
      'During an infection, signalling molecules raise the set point. The body then feels cold at its normal temperature and shivers to warm up, which explains the chills that often come at the start of a fever.',
    provenance: DRAFT_CONCEPT,
    sources: [],
    publishedAt: '2026-09-26',
    featured: false,
    tags: ['physiology', 'thermoregulation', 'hypothalamus'],
  },
  {
    id: 'concept-blood-groups',
    category: 'concept',
    topic: 'Haematology',
    title: 'Why blood has to be matched',
    summary: 'Tiny markers on red blood cells decide whose blood you can safely receive.',
    basicIdea:
      'Red blood cells carry markers called antigens, such as A and B in the ABO system. The plasma naturally contains antibodies against the ABO antigens a person does not have.',
    whyItMatters:
      'If blood with the wrong antigens is transfused, the recipient’s antibodies attack those red cells. This is why blood is tested and matched before a transfusion.',
    provenance: DRAFT_CONCEPT,
    sources: [],
    publishedAt: '2026-09-26',
    featured: false,
    tags: ['haematology', 'immunology', 'transfusion'],
  },

  // ---------- GRATEAPEX features (all exist in the app today) ----------
  {
    id: 'grateapex-friends',
    category: 'grateapex',
    topic: 'Social',
    title: 'Friends',
    summary: 'See your friends and friend requests in one place.',
    basicIdea:
      'Open Social, or Profile, and choose Friends to see your friends list and any friend requests. Connecting with classmates is still being built, so the list currently shows sample data.',
    provenance: FEATURE,
    sources: [],
    publishedAt: '2026-09-25',
    featured: false,
    tags: ['social', 'friends'],
    action: { label: 'Open Friends', href: '/social/friends' },
  },
  {
    id: 'grateapex-progress',
    category: 'grateapex',
    topic: 'Progress',
    title: 'Track your level and XP',
    summary: 'See how close you are to your next level.',
    basicIdea:
      'Completing lessons and lesson quizzes earns XP. My Progress shows your current level, how much XP you need for the next one, your streak and your progress in each subject.',
    provenance: FEATURE,
    sources: [],
    publishedAt: '2026-09-25',
    featured: false,
    tags: ['progress', 'xp', 'levels'],
    action: { label: 'Open My Progress', href: '/progress' },
  },
  {
    id: 'grateapex-practice-wrong',
    category: 'grateapex',
    topic: 'Quizzes',
    title: 'Practise your wrong answers',
    summary: 'After a quiz, focus only on the questions you missed.',
    basicIdea:
      'When you finish a lesson quiz, the Results page shows which concepts need improvement. Choose Practise Wrong Answers to retry only the questions you got wrong, or tap a weak concept to go back to its lesson.',
    provenance: FEATURE,
    sources: [],
    publishedAt: '2026-09-01',
    featured: false,
    tags: ['quizzes', 'practice'],
  },
  {
    id: 'grateapex-lesson-quizzes',
    category: 'grateapex',
    topic: 'Learn',
    title: 'Lesson quizzes',
    summary: 'Check your understanding with a short quiz after each lesson.',
    basicIdea:
      'Each lesson has a short quiz. Choose instant feedback to see answers as you go, or submit at the end. Your Results page gives your score, a learning remark and the concepts to review.',
    provenance: FEATURE,
    sources: [],
    publishedAt: '2026-09-01',
    featured: false,
    tags: ['learn', 'quizzes'],
    action: { label: 'Go to Learn', href: '/learn' },
  },
  {
    id: 'grateapex-reinforcement-calendar',
    category: 'grateapex',
    topic: 'Review',
    title: 'The reinforcement calendar',
    summary: 'See exactly when each concept comes back for review.',
    basicIdea:
      'Every concept you learn is scheduled to return just before you are likely to forget it. The calendar on Home shows what is due each day, what is overdue, which concepts need work, and the reviews you have already done. Open a day to see its concepts and how close each one is to mastery.',
    provenance: FEATURE,
    sources: [],
    publishedAt: '2026-10-03',
    featured: false,
    tags: ['review', 'spaced-repetition', 'calendar'],
    action: { label: 'Open Home', href: '/' },
  },
  {
    id: 'grateapex-avatars',
    category: 'grateapex',
    topic: 'Profile',
    title: 'Choose your avatar',
    summary: 'Pick an illustrated avatar or upload your own photo.',
    basicIdea:
      'Open your Profile and tap your avatar. Choose one of the illustrated male or female avatars, upload a photo of your own, or keep your initials. Your choice is saved to your account.',
    provenance: FEATURE,
    sources: [],
    publishedAt: '2026-10-03',
    featured: false,
    tags: ['profile', 'avatar'],
    action: { label: 'Open Profile', href: '/profile' },
  },
];

// Every Explore item (read-only), for screens that list or derive from them.
export function getExploreItems(): readonly ExploreItem[] {
  return exploreItems;
}

// Items published within this many days show a "New" marker.
const NEW_FOR_DAYS = 14;

export function getFeaturedItem(): ExploreItem | undefined {
  return exploreItems.find((item) => item.featured);
}

// Items in a category, excluding the featured item (shown separately).
export function getItemsByCategory(category: ExploreCategory): ExploreItem[] {
  return exploreItems.filter(
    (item) => item.category === category && !item.featured
  );
}

export function getExploreItem(id: string | undefined): ExploreItem | undefined {
  return exploreItems.find((item) => item.id === id);
}

// "New" highlights recently added GRATEAPEX features only.
export function isNewItem(item: ExploreItem, now: Date = new Date()) {
  if (item.category !== 'grateapex') {
    return false;
  }

  const published = new Date(`${item.publishedAt}T00:00:00`);

  if (Number.isNaN(published.getTime())) {
    return false;
  }

  const ageInDays = (now.getTime() - published.getTime()) / (24 * 60 * 60 * 1000);

  return ageInDays >= 0 && ageInDays <= NEW_FOR_DAYS;
}

export function getCategoryLabel(category: ExploreCategory) {
  switch (category) {
    case 'concept':
      return 'Concepts & Connections';
    case 'research':
      return 'Research & Emerging Science';
    default:
      return 'GRATEAPEX';
  }
}
