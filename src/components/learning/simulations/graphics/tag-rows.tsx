import { Tag } from './kit';
import { Canvas } from './shared';

export type TagItem = { text: string; tone?: 'primary' | 'error' | 'success' | 'warning' };

// Name tags laid out in centred rows under a 3D organ: the values the picture shows, in words.
export function TagRows({ items, width = 400, size = 10, label }: { items: TagItem[]; width?: number; size?: number; label: string }) {
  const gap = 8;
  const rowH = size + 16;
  const w = (t: string) => t.length * size * 0.56 + 12;
  const rows: TagItem[][] = [[]];
  let used = 0;
  for (const item of items) {
    const need = w(item.text) + (rows[rows.length - 1].length ? gap : 0);
    if (used + need > width - 8 && rows[rows.length - 1].length) {
      rows.push([]);
      used = 0;
    }
    rows[rows.length - 1].push(item);
    used += w(item.text) + (rows[rows.length - 1].length > 1 ? gap : 0);
  }
  const height = rows.length * rowH + 6;
  return (
    <Canvas width={width} height={height} label={label}>
      {rows.flatMap((row, r) => {
        const total = row.reduce((s, item, i) => s + w(item.text) + (i ? gap : 0), 0);
        let x = (width - total) / 2;
        return row.map((item) => {
          const cx = x + w(item.text) / 2;
          x += w(item.text) + gap;
          return <Tag key={`${r}-${item.text}`} x={cx} y={4 + r * rowH + rowH / 2} text={item.text} size={size} tone={item.tone ?? 'primary'} />;
        });
      })}
    </Canvas>
  );
}
