import { View } from 'react-native';
import { Circle, Defs, G, Path, RadialGradient, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { SYMPATHETIC, type FiltrationState } from '@/data/simulations/glomerular-filtration';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { mix } from './anatomy/cells';
import { GlomerularTuft, Tube } from './anatomy/kidney';
import { seeded, useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const CX = 200;
const CY = 156;

// One glomerulus in Bowman's capsule, magnified. The afferent arteriole
// widens or narrows (autoregulation, sympathetic nerves), and drops of
// filtrate leave the capillaries and flow off to the proximal tubule.
export function GlomerularFiltrationGraphic({ state, time, reduceMotion }: GraphicProps<FiltrationState>) {
  const id = useSvgIds('gf');
  const t = reduceMotion ? 0 : time;
  const rate = state.gfr / 125;
  const rand = seeded(9);
  const drops = Array.from({ length: Math.round(18 * Math.min(2.2, rate)) }, () => ({ a: rand() * Math.PI * 2, phase: rand(), speed: 0.6 + rand() * 0.6 }));
  const filtrate = mix(A.urine, '#FFFFFF', 0.6);
  const nerve = state.sympathetic / 2;

  const organ = {
    glow: { kidneys: rounded(Math.min(1, state.gfr / 160) * 0.6, 0.05), arteries: rounded(Math.min(1, state.gbhp / 80) * 0.5, 0.05) },
    glowColor: { kidneys: '#ffd25a', arteries: '#ff6a4a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="urinary" frame={organ} label={`The kidneys, filtering ${Math.round(state.gfr)} ml a minute`} />
      <Canvas width={W} height={H} label={`Glomerulus: GFR ${Math.round(state.gfr)} ml/min, net filtration pressure ${state.nfp.toFixed(0)} mmHg. Afferent arteriole ${state.afferent < 0.95 ? 'narrowed' : state.afferent > 1.05 ? 'widened' : 'normal'}. Sympathetic: ${SYMPATHETIC[state.sympathetic]}.`}>
        <Defs>
          <RadialGradient id={id('space')} cx="50%" cy="50%" r="50%">
            <Stop offset="0.6" stopColor={mix(filtrate, '#FFFFFF', 0.3)} />
            <Stop offset="1" stopColor={filtrate} />
          </RadialGradient>
        </Defs>
        {/* proximal tubule leaving the urinary pole */}
        <Tube d={`M${CX + 70} ${CY + 76} C${CX + 110} ${CY + 110} ${CX + 150} ${CY + 96} ${CX + 196} ${CY + 120}`} width={34} wall={A.mucosa} fluid={filtrate} time={t} flow={rate} />
        {/* Bowman's capsule */}
        <Circle cx={CX} cy={CY} r={104} fill={`url(#${id('space')})`} stroke={mix(A.mucosa, '#000000', 0.2)} strokeWidth={9} />
        <Circle cx={CX} cy={CY} r={104} fill="none" stroke={A.mucosa} strokeWidth={6} />
        {/* filtrate drops moving out from the capillaries */}
        {drops.map((d, i) => {
          const f = (d.phase + t * 0.35 * d.speed) % 1;
          const r = 70 + f * 28;
          return <Circle key={i} cx={CX + Math.cos(d.a) * r} cy={CY + Math.sin(d.a) * r} r={2.8} fill={A.urine} opacity={0.85 * (1 - f * 0.6)} stroke={A.urineDark} strokeWidth={0.5} />;
        })}
        <GlomerularTuft cx={CX} cy={CY + 4} r={70} />
        {/* afferent (in) and efferent (out) arterioles at the vascular pole */}
        <Tube d={`M-6 34 C60 34 120 44 ${CX - 22} ${CY - 70}`} width={30 * state.afferent} wall={A.artery} fluid={mix(A.artery, '#FFFFFF', 0.15)} time={t} flow={1} />
        <Tube d={`M${CX + 22} ${CY - 70} C${CX + 70} 50 ${CX + 130} 34 406 30`} width={22} wall={A.artery} fluid={mix(A.artery, '#FFFFFF', 0.1)} time={t} flow={1} />
        {/* sympathetic nerve fibre wound on the afferent arteriole */}
        <Path d={`M-6 12 C30 30 50 18 80 36 C104 50 124 40 ${CX - 34} ${CY - 92}`} stroke={mix(A.nerveDark, '#FFF3A8', nerve)} strokeWidth={2.4 + 2 * nerve} fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * nerve} />
        {[20, 46, 72, 98, 124].map((x, i) => (
          <Circle key={x} cx={x} cy={22 + (i % 2) * 8 + i * 3} r={2.4 + 2 * nerve} fill={mix(A.nerveDark, '#FFF3A8', nerve)} opacity={0.6 + 0.4 * nerve} />
        ))}
        <Tag x={64} y={70} text="Afferent arteriole" size={10} />
        <Tag x={340} y={62} text="Efferent arteriole" size={10} />
        <Tag x={CX} y={CY + 122} text="Bowman's capsule" size={10} />
        <Tag x={352} y={262} text="To the PCT" size={10} />
        {state.sympathetic > 0 ? <Tag x={64} y={8} text="Sympathetic nerve" size={10} tone="warning" /> : null}
        {state.gfr <= 0 ? <Tag x={CX} y={CY} text="Filtration stopped" tone="error" /> : null}
      </Canvas>
    </View>
  );
}
