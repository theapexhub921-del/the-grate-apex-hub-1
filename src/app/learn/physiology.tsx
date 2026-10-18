import { SimulationLibrary } from '@/components/learning/simulation-library';
import { SubjectScreen } from '@/components/learning/subject-screen';

// Physiology: courses → topics, with real progress (see data/learning/),
// plus every lesson simulation on its own tab.
export default function PhysiologyScreen() {
  return <SubjectScreen subject="physiology" simulations={<SimulationLibrary subject="physiology" />} />;
}
