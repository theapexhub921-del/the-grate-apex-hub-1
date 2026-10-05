import type { CSSProperties } from 'react';

import { ATMOSPHERE, type AtmosphereMood, MOODS, rgba } from '@/components/atmosphere/config';
import { useResolvedColorScheme } from '@/hooks/use-theme';

import classes from './atmosphere.module.css';

// Web atmosphere: pure CSS layers (no WebGL, no canvas), so it costs
// almost nothing and never blocks input. Decorative only — hidden from
// assistive technology.
export function Atmosphere({ mood }: { mood: AtmosphereMood }) {
  const scheme = useResolvedColorScheme();
  const palette = ATMOSPHERE[scheme];
  const levels = MOODS[mood];

  const vars = {
    '--atm-base': palette.base,
    '--atm-field-a': rgba(palette.fieldA),
    '--atm-field-b': rgba(palette.fieldB),
    '--atm-field-c': rgba(palette.fieldC),
    '--atm-aurora-a': rgba(palette.auroraA),
    '--atm-aurora-b': rgba(palette.auroraB),
    '--atm-aurora-c': rgba(palette.auroraC),
    '--atm-grid': rgba(palette.grid),
    '--atm-ray': rgba(palette.ray),
    '--atm-gold': rgba(palette.gold),
    '--atm-vignette': rgba(palette.vignette),
    '--atm-grain-blend': palette.grainBlend,
    '--o-fields': levels.fields,
    '--o-aurora': levels.aurora,
    '--o-rays': levels.rays,
    '--o-grid': levels.grid,
    '--o-gold': levels.gold,
    '--o-grain': palette.grain * levels.grain,
    '--o-vignette': levels.vignette,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={`${classes.root} ${levels.animate ? classes.animate : ''}`}
      style={vars}
      data-mood={mood}
    >
      <div className={`${classes.layer} ${classes.fields}`} />
      <div className={`${classes.layer} ${classes.aurora}`}>
        <div className={`${classes.blob} ${classes.blobA}`} />
        <div className={`${classes.blob} ${classes.blobB}`} />
        <div className={`${classes.blob} ${classes.blobC}`} />
      </div>
      <div className={`${classes.layer} ${classes.rays}`} />
      <div className={`${classes.layer} ${classes.grid}`} />
      <div className={`${classes.layer} ${classes.gold}`} />
      <div className={`${classes.layer} ${classes.grain}`} />
      <div className={`${classes.layer} ${classes.vignette}`} />
    </div>
  );
}
