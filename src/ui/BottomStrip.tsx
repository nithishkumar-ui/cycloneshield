import { useStore } from '../state/store';

export default function BottomStrip() {
  const { metrics, currentScenario, timelinePosition } = useStore();

  if (!currentScenario) return null;

  return (
    <div className="glass-panel" style={{
      borderRadius: 0,
      borderTop: '1px solid var(--color-border-default)',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated border line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-cyan-accent), transparent)',
        opacity: 0.3,
      }} />

      <MetricItem
        icon="🌊"
        label="Peak Surge"
        value={`${metrics.peakSurge.mid.toFixed(1)}m`}
        sub={`${metrics.peakSurge.low.toFixed(1)}–${metrics.peakSurge.high.toFixed(1)}m`}
        color={metrics.peakSurge.mid > 3 ? '#EF4444' : metrics.peakSurge.mid > 2 ? '#FB923C' : '#FACC15'}
        badge="≈ approx"
      />

      <Divider />

      <MetricItem
        icon="👥"
        label="People Exposed"
        value={formatNumber(metrics.peopleExposed)}
        color="#FB923C"
      />

      <Divider />

      <MetricItem
        icon="🏗"
        label="Assets Exposed"
        value={`${metrics.assetsExposed}`}
        sub={`of ~120 total`}
        color="#FACC15"
      />

      <Divider />

      <MetricItem
        icon="🛤"
        label="Roads Cut"
        value={`${metrics.roadsCut}`}
        sub="segments"
        color="#FB923C"
      />

      <Divider />

      <MetricItem
        icon="🏠"
        label="Shelters Cut Off"
        value={`${metrics.sheltersCutOff}`}
        color={metrics.sheltersCutOff > 3 ? '#EF4444' : '#FACC15'}
      />

      <Divider />

      <MetricItem
        icon="🏥"
        label="Hospitals At Risk"
        value={`${metrics.hospitalsAtRisk}`}
        color={metrics.hospitalsAtRisk > 2 ? '#EF4444' : '#FACC15'}
      />

      <Divider />

      {/* Timeline status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 12px',
        borderRadius: '8px',
        background: timelinePosition === 0 ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1rem',
          fontWeight: 700,
          color: timelinePosition === 0 ? '#EF4444' : 'var(--color-cyan-accent)',
        }}>
          T{timelinePosition >= 0 ? '+' : ''}{timelinePosition}h
        </div>
        {timelinePosition === 0 && (
          <span style={{
            fontSize: '0.65rem',
            color: '#EF4444',
            fontWeight: 600,
          }}>⚡ LANDFALL</span>
        )}
      </div>
    </div>
  );
}

function MetricItem({ icon, label, value, sub, color, badge }: {
  icon: string; label: string; value: string; sub?: string; color: string; badge?: string;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontSize: '0.9rem' }}>{icon}</span>
      <div>
        <div style={{
          fontSize: '0.58rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          {label}
          {badge && (
            <span style={{
              padding: '0px 4px',
              borderRadius: '3px',
              background: 'rgba(250, 204, 21, 0.15)',
              color: '#FACC15',
              fontSize: '0.5rem',
            }}>{badge}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span className="number-tick" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: color,
          }}>
            {value}
          </span>
          {sub && (
            <span style={{
              fontSize: '0.6rem',
              color: 'var(--color-text-muted)',
            }}>{sub}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      width: '1px',
      height: '28px',
      background: 'var(--color-border-default)',
    }} />
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}
