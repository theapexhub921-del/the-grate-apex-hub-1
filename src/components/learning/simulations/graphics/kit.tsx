// Small drawing pieces shared by the newer simulations (respiratory, renal,
// endocrine, GI, reproductive, special senses). Theme colours only.
import { G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

export type BarRow = {
  label: string;
  value: number;
  baseline?: number; // drawn as a thin marker ("before")
  max: number;
  min?: number; // for bars that can go below zero (e.g. pressures)
  color: string;
  text?: string; // value as shown at the end of the bar
};

// Horizontal bars with a "before" marker, drawn inside an SVG <Canvas>.
export function Bars({ x, y, width, rows, rowHeight = 30, labelWidth = 120 }: { x: number; y: number; width: number; rows: BarRow[]; rowHeight?: number; labelWidth?: number }) {
  const colors = useTheme();
  const trackX = x + labelWidth;
  const trackW = width - labelWidth - 78;
  return (
    <G>
      {rows.map((row, i) => {
        const min = row.min ?? 0;
        const span = Math.max(1e-6, row.max - min);
        const pos = (v: number) => trackX + (Math.min(row.max, Math.max(min, v)) - min) / span * trackW;
        const zero = pos(0);
        const end = pos(row.value);
        const top = y + i * rowHeight;
        return (
          <G key={row.label}>
            <SvgText x={x} y={top + 15} fontSize={11} fontWeight="800" fill={colors.textSecondary}>
              {row.label}
            </SvgText>
            <Rect x={trackX} y={top + 4} width={trackW} height={14} rx={7} fill={colors.surfaceMuted} />
            <Rect x={Math.min(zero, end)} y={top + 4} width={Math.max(2, Math.abs(end - zero))} height={14} rx={7} fill={row.color} opacity={0.85} />
            {row.baseline !== undefined ? (
              <Line x1={pos(row.baseline)} x2={pos(row.baseline)} y1={top} y2={top + 22} stroke={colors.text} strokeWidth={2} strokeDasharray="3 2" opacity={0.6} />
            ) : null}
            <SvgText x={trackX + trackW + 6} y={top + 15} fontSize={11} fontWeight="900" fill={colors.text}>
              {row.text ?? String(Math.round(row.value))}
            </SvgText>
          </G>
        );
      })}
    </G>
  );
}

// A caption line inside a drawing.
export function Caption({ x, y, text, anchor = 'start', tone = 'secondary', size = 12 }: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end'; tone?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning'; size?: number }) {
  const colors = useTheme();
  const fill = {
    primary: colors.text,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    error: colors.error,
    success: colors.successText,
    warning: colors.warningText,
  }[tone];
  return (
    <SvgText x={x} y={y} fontSize={size} fontWeight="800" fill={fill} textAnchor={anchor}>
      {text}
    </SvgText>
  );
}

// A name tag on an illustration: text on a soft rounded backing so it stays
// readable over tissue. Width is estimated from the text length.
export function Tag({ x, y, text, anchor = 'middle', tone = 'primary', size = 11 }: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end'; tone?: 'primary' | 'error' | 'success' | 'warning'; size?: number }) {
  const colors = useTheme();
  const w = text.length * size * 0.56 + 12;
  const h = size + 9;
  const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  const fill = { primary: colors.text, error: colors.error, success: colors.successText, warning: colors.warningText }[tone];
  return (
    <G>
      <Rect x={left} y={y - h / 2} width={w} height={h} rx={h / 2} fill={colors.surface} opacity={0.92} stroke={colors.border} strokeWidth={1} />
      <SvgText x={left + w / 2} y={y + size * 0.36} fontSize={size} fontWeight="700" fill={fill} textAnchor="middle">
        {text}
      </SvgText>
    </G>
  );
}
