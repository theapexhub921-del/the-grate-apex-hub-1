"""Build lesson pictures from specs/<topic>.json.

Spec entry:
  {"name": "pleurae-section", "deck": "cvs", "slide": 18, "title": "...",
   "lesson": "cardiovascular-system-gross-1", "chunk": 0, "step": 3, "concept": "...",
   "crop": [x0, y0, x1, y1]  (fractions, optional),
   "spots": [{"label": "Right lung", "ocr": [5], "pin": "auto|l|r|t|b|c" or [x, y],
              "grow": [l, t, r, b] (fractions of the picture, optional), "note": "..."}],
   "quiz": ["right-lung", ...]}
Writes public/figures/<topic>/<name>.jpg, check/<topic>-<name>.png (pins drawn)
and figures.json (consumed by gen_ts.py)."""
import json, os, re, sys
from PIL import Image, ImageDraw, ImageFont

REPO = os.environ.get('GRATEAPEX_REPO', '../..')
topic = sys.argv[1]
only = sys.argv[2:]  # optional names
specs = json.load(open(f'specs/{topic}.json'))
os.makedirs(f'{REPO}/public/figures/{topic}', exist_ok=True)
os.makedirs('check', exist_ok=True)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
out = json.load(open(f'built/{topic}.json')) if os.path.exists(f'built/{topic}.json') else {}
os.makedirs('built', exist_ok=True)


def slug(text):
    import unicodedata
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')[:40].strip('-')


for spec in specs:
    if only and spec['name'] not in only:
        continue
    im = Image.open(f'pics/{spec["deck"]}/s{spec["slide"]}.png').convert('RGB')
    W, H = im.size
    ocr = {o['i']: o['box'] for o in json.load(open(f'ocr/{spec["deck"]}_{spec["slide"]}.json'))} if os.path.exists(f'ocr/{spec["deck"]}_{spec["slide"]}.json') else {}
    x0, y0, x1, y1 = spec.get('crop', [0, 0, 1, 1])
    cw, ch = x1 - x0, y1 - y0

    def to_crop(x, y):
        return ((x - x0) / cw, (y - y0) / ch)

    spots = []
    ids = set()
    for sp in spec['spots']:
        box = None
        if sp.get('ocr'):
            bs = [ocr[i] for i in sp['ocr']]
            bx0 = min(b[0] for b in bs); by0 = min(b[1] for b in bs)
            bx1 = max(b[0] + b[2] for b in bs); by1 = max(b[1] + b[3] for b in bs)
            g = sp.get('grow', [0, 0, 0, 0])
            pad = 0.004
            bx0 -= pad + g[0]; by0 -= pad + g[1]; bx1 += pad + g[2]; by1 += pad + g[3]
            box = (bx0, by0, bx1, by1)
        elif sp.get('box'):
            bx0, by0, w, h = sp['box']
            box = (bx0, by0, bx0 + w, by0 + h)
        pin = sp.get('pin', 'auto')
        if isinstance(pin, list):
            px, py = pin
        else:
            assert box, sp
            cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
            if pin == 'auto':
                pin = 'r' if cx < 0.5 else 'l'
            off = 0.018
            px, py = {'r': (box[2] + off, cy), 'l': (box[0] - off, cy), 'b': (cx, box[3] + off * 1.4),
                      't': (cx, box[1] - off * 1.4), 'c': (cx, cy)}[pin]
        px, py = to_crop(px, py)
        sid = sp.get('id') or slug(sp['label'])
        while sid in ids:
            sid += '-2'
        ids.add(sid)
        entry = {'id': sid, 'label': sp['label'], 'x': round(min(max(px, 0.01), 0.99), 3), 'y': round(min(max(py, 0.01), 0.99), 3)}
        if sp.get('note'):
            entry['note'] = sp['note']
        if box:
            a, b = to_crop(box[0], box[1]); c, d = to_crop(box[2], box[3])
            a, b = max(a, 0), max(b, 0); c, d = min(c, 1), min(d, 1)
            entry['boxes'] = [[round(a, 3), round(b, 3), round(c - a, 3), round(d - b, 3)]]
        spots.append(entry)

    crop = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
    if max(crop.size) > 1100:
        crop.thumbnail((1100, 1100), Image.LANCZOS)
    path = f'{REPO}/public/figures/{topic}/{spec["name"]}.jpg'
    crop.save(path, quality=78, optimize=True, progressive=True)
    cw_, ch_ = crop.size

    # check image: covers grey, pins numbered, legend below
    chk = crop.copy()
    leg_h = 22 * ((len(spots) + 1) // 2) + 10
    canvas = Image.new('RGB', (cw_, ch_ + leg_h), 'white')
    canvas.paste(chk, (0, 0))
    d = ImageDraw.Draw(canvas)
    for i, s in enumerate(spots, 1):
        for bx, by, bw, bh in s.get('boxes', []):
            d.rectangle([bx * cw_, by * ch_, (bx + bw) * cw_, (by + bh) * ch_], outline='#00a', width=2)
        x, y = s['x'] * cw_, s['y'] * ch_
        d.ellipse([x - 11, y - 11, x + 11, y + 11], fill='#d00', outline='white', width=2)
        d.text((x, y), str(i), fill='white', font=small, anchor='mm')
    for i, s in enumerate(spots):
        col, row = i % 2, i // 2
        d.text((8 + col * cw_ // 2, ch_ + 6 + row * 22), f'{i + 1}. {s["label"]}', fill='black', font=small)
    canvas.save(f'check/{topic}-{spec["name"]}.png')
    out[spec['name']] = {**{k: spec[k] for k in ('name', 'deck', 'slide', 'title', 'lesson') if k in spec},
                         'chunk': spec.get('chunk'), 'step': spec.get('step'), 'concept': spec.get('concept'),
                         'caption': spec.get('caption'), 'quiz': spec.get('quiz'),
                         'width': cw_, 'height': ch_, 'spots': spots, 'bytes': os.path.getsize(path)}
    print(spec['name'], cw_, ch_, os.path.getsize(path) // 1024, 'KB', len(spots), 'spots')
json.dump(out, open(f'built/{topic}.json', 'w'), indent=1)
