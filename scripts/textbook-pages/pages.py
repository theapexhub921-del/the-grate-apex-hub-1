"""Printed page numbers for a pdftotext -layout dump: pages.json = [[printed, text], ...]."""
import json, re, sys
from collections import Counter

name = sys.argv[1]
pages = open(f'{name}.txt').read().split('\f')
cands = []
for i, t in enumerate(pages):
    lines = [l.strip() for l in t.splitlines() if l.strip()]
    nums = set()
    for l in lines[:3] + lines[-3:]:
        for m in re.findall(r'(?:^|\s)(\d{1,4})(?:\s|$)', ' ' + l + ' '):
            nums.add(int(m))
        m = re.match(r'^(\d{1,4})\b', l)
        if m:
            nums.add(int(m.group(1)))
        m = re.search(r'\b(\d{1,4})$', l)
        if m:
            nums.add(int(m.group(1)))
    cands.append({n - i for n in nums if 0 < n < 2000})
printed = []
for i in range(len(pages)):
    window = Counter(o for j in range(max(0, i - 12), min(len(pages), i + 13)) for o in cands[j])
    off = None
    for o, c in window.most_common():
        if c >= 5:
            off = o
            break
    printed.append(i + off if off is not None and i + off > 0 else None)
json.dump([[p, t] for p, t in zip(printed, pages)], open(f'{name}.pages.json', 'w'))
ok = sum(1 for p in printed if p)
print(name, len(pages), 'numbered', ok, 'sample', printed[100], printed[300], printed[len(pages) // 2])
