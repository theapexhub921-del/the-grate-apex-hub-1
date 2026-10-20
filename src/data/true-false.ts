// True/false versions of multiple-choice questions, written as a plain statement.
//
// Practice sets turn some multiple-choice questions into true/false. They used
// to read "True or false? For “Which enzyme type removes water…?”, the answer
// is “Hydrolase”." (owner, 2026-10-20: that does not make sense). Now the
// question and the shown option are rewritten as one statement, e.g.
// "Hydrolase is the enzyme type that removes water from its substrate.", and a
// question that cannot be rewritten cleanly is simply not turned into
// true/false (it stays as written).

const ORDER_WORDS = /\b(all|none|both|neither) of the (above|following)|^all the above|^none of the above/i;

// Questions that only make sense with their options (or as asked).
const NOT_A_STATEMENT = /\b(which of the following|of these|the following|true about|false about|statement|correct|incorrect|except|not|least|assertion|reason|best describes?|best described)\b|\(i+v?\)|\n/i;

// The verb that follows "Which <thing>" ("Which enzyme CATALYSES…").
const VERBS = new Set([
  'is', 'are', 'was', 'were', 'has', 'have', 'can', 'cannot', 'will', 'may', 'must', 'should', 'acts', 'activates',
  'activate', 'adds', 'add', 'allows', 'allow', 'arises', 'arise', 'attaches', 'becomes', 'become', 'binds', 'breaks',
  'carries', 'carry', 'catalyses', 'catalyse', 'catalyzes', 'catalyze', 'causes', 'cleaves', 'cleave', 'connects',
  'contains', 'contain', 'controls', 'converts', 'convert', 'crosses', 'delivers', 'determines', 'determine',
  'drains', 'enters', 'forms', 'functions', 'generates', 'generate', 'gives', 'give', 'helps', 'hydrolyses',
  'hydrolyzes', 'inhibits', 'inhibit', 'innervates', 'innervate', 'inserts', 'joins', 'lacks', 'lack', 'leads',
  'leaves', 'lies', 'links', 'makes', 'make', 'mediates', 'mediate', 'moves', 'occurs', 'occur', 'originates',
  'originate', 'passes', 'plays', 'prevents', 'prevent', 'produces', 'produce', 'promotes', 'promote', 'protects',
  'protect', 'provides', 'provide', 'pumps', 'raises', 'receives', 'receive', 'reduces', 'reduce', 'regulates',
  'regulate', 'releases', 'relies', 'rely', 'removes', 'remove', 'requires', 'require', 'results', 'runs', 'secretes',
  'secrete', 'separates', 'serves', 'shows', 'stimulates', 'stimulate', 'stores', 'supplies', 'synthesises',
  'synthesise', 'synthesizes', 'synthesize', 'takes', 'take', 'transfers', 'transports', 'travels', 'uses', 'yields',
]);
const SINGULAR = new Set(['is', 'was', 'has', 'can', 'cannot', 'will', 'may', 'must', 'should']);
const PLURAL = new Set(['are', 'were', 'have']);

// A fragment that stops here is waiting for its answer ("…is converted to").
const OPEN_END = /\b(is|are|was|were|be|by|of|to|in|into|as|at|on|for|from|with|via|the|a|an|called|named|termed|known|include|includes|contains|forms|form|produces|yields|requires|uses|than|between)$/i;

const clean = (text: string) => text.replace(/\s+/g, ' ').trim();
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const sentence = (text: string) => {
  const out = capital(clean(text));
  return /[.!]$/.test(out) ? out : `${out}.`;
};

// Names that stay capitalised inside a sentence ("the Cori cycle").
const EPONYMS = /^(muller|morgan|darwin|lamarck|hooke|leeuwenhoek|virchow|schleiden|schwann|brown|galen|hippocrates|harvey|cannon|bernard|sherrington|sanger|mullis|avery|griffith|hershey|meselson|jacob|monod|garrod|beadle|tatum|lederberg|mcclintock|franklin|chargaff|pauling|kornberg|nirenberg|khorana|neuberg|fischer|pasteur|buchner|sumner|cori|krebs|golgi|schwann|purkinje|pavlov|skinner|maslow|freud|starling|wernicke|broca|down|turner|klinefelter|graves|addison|cushing|conn|parkinson|alzheimer|huntington|henle|bowman|haversian|volkmann|sharpey|langerhans|kupffer|leydig|sertoli|meissner|pacinian|ruffini|merkel|auerbach|brunner|paneth|peyer|michaelis|lineweaver|henderson|gibbs|fick|nernst|goldman|mendel|hardy|watson|okazaki|willis|tollens|benedict|fehling|barfoed|seliwanoff|bial|molisch|millon|biuret|ninhydrin|gram|von|de|van|mcardle|pompe|gaucher|tay|niemann|wilson|menkes|lesch|hartnup|fanconi|bohr|haldane|hering|bainbridge|frank|ohm|poiseuille|laplace|boyle|charles|dalton|henry|graham)\b/i;

/** The option inside a sentence: "Stem cells" → "stem cells", but "Cori cycle", "GLUT2" and "Muller" stay as written. */
function inline(option: string) {
  const [first, ...rest] = option.split(' ');
  if (/^(A|An|The)$/.test(first)) return option.charAt(0).toLowerCase() + option.slice(1);
  // A plain word ("Stem cells", "Oxytocin"), not a name, an abbreviation or a named disease.
  if (/^[A-Z][a-z]+ing$/.test(first)) return option.charAt(0).toLowerCase() + option.slice(1); // "Blocking the Na+ transporter"
  const common = /^[A-Z][a-z-]+$/.test(first) && !EPONYMS.test(first) && rest.every((word) => !/^[A-Z]/.test(word)) && !/\b(syndrome|disease|sign|law|test|reaction|effect)\b|'s\b/i.test(option);
  return common ? option.charAt(0).toLowerCase() + option.slice(1) : option;
}

/** "Ketone bodies", "Hydrogen and helium" → are; "Hydrolase", "NADH" → is. */
const pluralOption = (option: string) => /\s(and|&)\s/i.test(option) || /[a-z][^siu\s]s$|ies$/i.test(option.replace(/\s*\(.*\)$/, ''));

// Options that point at other options ("All of these", "Only a and b").
const POINTS_AT_OPTIONS = /^(all|none|both|neither)\b|\bof (these|the above)\b|\b[a-e] (and|&) [a-e]\b|\bare correct\b|^only\b/i;

/**
 * The statement "question + this answer", or null when the question cannot be
 * rewritten as a natural statement (it is then not offered as true/false).
 */
export function trueFalseStatement(prompt: string, answer: string): string | null {
  const question = clean(prompt);
  // A hint in brackets after the option ("Hydrolase (adds water)") is left out of the statement.
  const option = clean(answer).replace(/\.$/, '').replace(/\s*\((?=[a-z])[^()]*\s[^()]*\)$/, '');
  if (!question || !option || option.length > 90 || question.length > 220) return null;
  if (NOT_A_STATEMENT.test(question) || ORDER_WORDS.test(option) || POINTS_AT_OPTIONS.test(option) || /^(true|false|yes|no)$/i.test(option)) return null;
  // Two questions in one ("Who coined X, and from what language…?", "…? I. … II. …"), or an answer that is a clause ("It activates…").
  if (/\?./.test(question) || /\b(and|or) (what|which|how|why|where|when|who)\b|\bname and\b|\bI\.\s/i.test(question)) return null;
  if (/^(it|they|this|these|that|he|she)\b/i.test(option) || /;|, (which|who|where)\b/.test(option)) return null;
  if (/\ba\. .+\bb\. /i.test(question)) return null;

  // Fill in the blank: "The enzyme ____ catalyses…".
  const blanks = question.match(/_{2,}/g);
  if (blanks) {
    if (blanks.length !== 1) return null;
    const startsWithBlank = /^\(?_{2,}/.test(question);
    const filled = question.replace(/\s*\(?_{2,}\)?\s*/, ` ${startsWithBlank ? option : inline(option)} `);
    return sentence(filled.replace(/[?:\s]+$/, ''));
  }

  const body = question.replace(/[?:\s—–-]+$/, '');
  const asked = /\?$/.test(question);

  // "What is the rate-limiting enzyme of…?" → "The rate-limiting enzyme of… is X."
  let match = /^(?:what|which) (is|are|was|were) (the|an?) (.+)$/i.exec(body);
  if (match) {
    const [, verb, article, rest] = match;
    if (OPEN_END.test(rest) || /\b(of|for|to|in|by|with|from|about|do|does)$/i.test(rest)) return null;
    return sentence(`${article} ${rest} ${verb.toLowerCase()} ${inline(option)}`);
  }

  // "Which enzyme type removes water…?" → "Hydrolase is the enzyme type that removes water…".
  match = /^(?:which|what) (.+)$/i.exec(body);
  if (match) {
    const words = match[1].split(' ');
    if (/^(does|do|did|is|are|was|were|can|will|has|have)$/i.test(words[0])) return null; // "What does free haem become…?"
    for (let i = 1; i <= Math.min(4, words.length - 1); i++) {
      const verb = words[i].toLowerCase();
      if (/^(does|do|did)$/.test(verb)) return null; // "Which enzyme does X inhibit?": the subject comes after the verb.
      if (!VERBS.has(verb)) continue;
      const thing = words.slice(0, i).join(' ');
      if (/^(of|one|two|three|four)$/i.test(words[0]) && /^(of)$/i.test(words[1] ?? '') || /^of\b/i.test(thing)) return null;
      if (/\b(the|a|an|of|and|or|kind|type)$/i.test(thing) && !/\s(type|kind)$/i.test(thing)) return null;
      return sentence(`${option} ${pluralOption(option) ? 'are' : 'is'} the ${thing} that ${words.slice(i).join(' ')}`);
    }
    return null;
  }

  // "Who first described…?" → "X first described…".
  match = /^who (?!(?:did|does|do)\b)(.+)$/i.exec(body);
  if (match) return sentence(`${option} ${match[1]}`);

  // A sentence waiting for its answer: "Gluconeogenesis is organised as a" → "… as a linear pathway."
  if (!asked && !/^(where|when|why|how|what|which|who|whom|whose|name|identify|list|state|give|define)\b/i.test(body) && OPEN_END.test(body)) {
    return sentence(`${body} ${inline(option)}`);
  }
  return null;
}
