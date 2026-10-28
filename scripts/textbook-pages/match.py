"""Find the textbook pages that best match each lesson section.
python3 match.py <book> <subject|topic,...>  -> matches/<book>.json  {lesson: {chunk: [pages], ...}}"""
import json, math, re, sys
from collections import Counter

book = sys.argv[1]
want = sys.argv[2].split(',')
pages = json.load(open(f'{book}.pages.json'))
STOP = set('''a an the of and or in on to for with by from as at is are was were be been this that these those it its into
than then which who whom whose what when where why how not no but if so such can may also each other more most less
both all any some one two three four five six first second third via per within without between during after before
above below up down out over under about lesson lecture slide slides note notes check here there they their them
we our you your he she his her has have had do does did will would should could very much many most same part parts
called known shows show seen see figure fig table section page pages left right upper lower'''.split())
SHORT_OK = {'av', 'sa', 'cn', 'gi', 'ph', 'co2', 'o2', 'atp', 'dna', 'rna', 'gfr', 'adh', 'acth', 'tsh', 'gh'}


def toks(text):
    out = []
    for w in re.findall(r"[a-zA-Z][a-zA-Z0-9\-]*", text.lower()):
        w = w.strip('-')
        if (len(w) < 4 and w not in SHORT_OK) or w in STOP:
            continue
        if w.endswith('ies'):
            w = w[:-3] + 'y'
        elif w.endswith('s') and not w.endswith('ss') and len(w) > 4:
            w = w[:-1]
        out.append(w)
    return out


# body pages only: drop front matter, index (last 4%), and pages with little text
n = len(pages)
docs = []
for i, (pn, text) in enumerate(pages):
    if pn is None or i < n * 0.02 or i > n * 0.96 or len(text) < 800:
        docs.append(None)
        continue
    # drop index-like / review-question pages (many short numeric lines)
    if len(re.findall(r'\b\d{2,4}[a-z]?\b', text)) > 120:
        docs.append(None)
        continue
    tk = toks(text)
    docs.append((pn, Counter(tk), ' '.join(tk)))
N = sum(1 for d in docs if d)
avgdl = sum(sum(d[1].values()) for d in docs if d) / N
df = Counter()
for d in docs:
    if d:
        df.update(d[1].keys())


def score(qterms, bigrams, d):
    pn, tf, joined = d
    dl = sum(tf.values())
    s = 0.0
    for t, qn in qterms.items():
        if t not in tf:
            continue
        idf = math.log(1 + (N - df[t] + 0.5) / (df[t] + 0.5))
        f = tf[t]
        s += qn ** 0.5 * idf * f * 2.2 / (f + 1.2 * (0.25 + 0.75 * dl / avgdl))
    for b in bigrams:
        if b in joined:
            s += 2.5
    return s


lessons = json.load(open('all_lessons.json'))
result = {}
for l in lessons:
    if l['subject'] not in want and l['topic'] not in want:
        continue
    res = {}
    # Lesson anchor: where the whole lesson's text matches best. Sections are
    # looked for near it (same chapter), so a stray page elsewhere can't win.
    lq = Counter()
    for ch in l['chunks']:
        for t in toks(ch['title'] + ' ' + ' '.join(ch['terms'])):
            lq[t] += 3
        lq.update(toks(ch['text']))
    for t in toks(l['title']):
        lq[t] += 4
    anchor = max((score(lq, set(), d), i) for i, d in enumerate(docs) if d)[1]
    window = set(range(anchor - 30, anchor + 31))
    res['_anchor'] = docs[anchor][0]
    for ch in l['chunks']:
        title_t = toks(ch['title'])
        term_t = toks(' '.join(ch['terms']))
        text_t = toks(ch['text'])
        q = Counter(text_t)
        for t in title_t + term_t:
            q[t] += 3
        # lesson title adds context
        for t in toks(l['title']):
            q[t] += 1
        words = toks(ch['title'] + ' ' + ' '.join(ch['terms']) + ' ' + ch['text'])
        bigrams = {f'{a} {b}' for a, b in zip(words, words[1:]) if a != b}
        # keep only distinctive bigrams (both words not too common)
        bigrams = {b for b in bigrams if all(df.get(w, 0) < N * 0.15 for w in b.split())}
        scored = [(score(q, bigrams, d), i) for i, d in enumerate(docs) if d and i in window]
        scored.sort(reverse=True)
        top, ti = scored[0]
        by_i = dict((i, s) for s, i in scored)
        pick = [ti]
        for j in (ti - 1, ti + 1, ti + 2, ti - 2):
            if j in by_i and by_i[j] >= 0.62 * top and abs(j - ti) <= 2 and len(pick) < 3:
                if j in (min(pick) - 1, max(pick) + 1):
                    pick.append(j)
        pick.sort()
        res[ch['i']] = {'pages': [docs[i][0] for i in pick], 'score': round(top, 1),
                        'second': round(scored[1][0], 1), 'alt': docs[scored[1][1]][0]}
    result[l['lesson']] = res
json.dump(result, open(f'matches_{book}.json', 'w'), indent=0)
print(book, len(result), 'lessons')
