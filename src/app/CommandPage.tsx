import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../state/store';
import { PRESET_SCENARIOS } from '../data/scenarios';
import LeftPanel from '../ui/LeftPanel';
import RightPanel from '../ui/RightPanel';
import BottomStrip from '../ui/BottomStrip';
import ThreeCanvas from '../three/ThreeCanvas';

export default function CommandPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const { currentScenario, setCurrentScenario } = useStore();

  useEffect(() => {
    if (scenarioId && (!currentScenario || currentScenario.id !== scenarioId)) {
      const scenario = PRESET_SCENARIOS.find((s) => s.id === scenarioId);
      if (scenario) {
        setCurrentScenario(scenario);
      } else {
        navigate('/');
      }
    }
  }, [scenarioId, currentScenario, setCurrentScenario, navigate]);

  if (!currentScenario) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
      }}>
        Loading scenario...
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        <LeftPanel />
        <ThreeCanvas />
        <RightPanel />
      </div>
      <BottomStrip />
    </div>
  );
}
