"""OCR the printed labels of a picture: python3 ocr.py deck slide
Prints label groups (text, box as fractions) and writes ocr/<deck>_<slide>.png
with boxes drawn and numbered."""
import json, os, subprocess, sys, csv, io
from PIL import Image, ImageDraw, ImageFont

deck, slide = sys.argv[1], sys.argv[2]
src = f'pics/{deck}/s{slide}.png'
im = Image.open(src).convert('RGB')
W, H = im.size
scale = 1
if max(W, H) < 1800:
    scale = 1800 / max(W, H)
big = im.resize((int(W * scale), int(H * scale)), Image.LANCZOS)
os.makedirs('ocr', exist_ok=True)
big.save(f'/tmp/ocr_in_{deck}_{slide}.png')
tsv = subprocess.run(['tesseract', f'/tmp/ocr_in_{deck}_{slide}.png', '-', '--psm', '11', 'tsv'], capture_output=True, text=True).stdout
words = []
for row in csv.DictReader(io.StringIO(tsv), delimiter='\t', quoting=csv.QUOTE_NONE):
    t = (row.get('text') or '').strip()
    if not t or float(row['conf']) < 55:
        continue
    if not any(c.isalpha() for c in t):
        continue
    x, y, w, h = (int(row[k]) / scale for k in ('left', 'top', 'width', 'height'))
    words.append([t, x, y, w, h])
# group words on the same line that are close together
words.sort(key=lambda w: (round(w[2] / 6), w[1]))
groups = []
for t, x, y, w, h in words:
    for g in groups:
        gx, gy, gw, gh = g['b']
        same_line = abs((y + h / 2) - (gy + gh / 2)) < max(h, gh) * 0.6
        near = x - (gx + gw) < max(h, gh) * 1.6 and x > gx - 2
        under = abs(x - gx) < max(h, gh) * 3 and 0 <= y - (gy + gh) < max(h, gh) * 0.8 and abs(h - gh) < 5
        if (same_line and near) or under:
            sep = ' '
            g['t'] += sep + t
            nx, ny = min(gx, x), min(gy, y)
            g['b'] = [nx, ny, max(gx + gw, x + w) - nx, max(gy + gh, y + h) - ny]
            break
    else:
        groups.append({'t': t, 'b': [x, y, w, h]})
out = []
d = ImageDraw.Draw(im)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', max(12, W // 60))
for i, g in enumerate(groups):
    x, y, w, h = g['b']
    out.append({'i': i, 't': g['t'], 'box': [round(x / W, 4), round(y / H, 4), round(w / W, 4), round(h / H, 4)]})
    d.rectangle([x - 1, y - 1, x + w + 1, y + h + 1], outline='red', width=2)
    d.text((x + w + 2, y - 2), str(i), fill='blue', font=font)
im.save(f'ocr/{deck}_{slide}.png')
json.dump(out, open(f'ocr/{deck}_{slide}.json', 'w'))
for o in out:
    print(o['i'], o['t'], o['box'])
