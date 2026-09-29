import { useStore } from '../../state/store';

export default function SummaryTab() {
  const { currentScenario, whatIf, metrics, timelinePosition } = useStore();

  if (!currentScenario) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Scenario info */}
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
      }}>
        <div style={{
          fontSize: '0.65rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '6px',
        }}>Active Scenario</div>
        <div style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--color-cyan-accent)',
          marginBottom: '4px',
        }}>{currentScenario.name}</div>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
        }}>{currentScenario.description}</div>
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '10px',
          flexWrap: 'wrap',
        }}>
          <MiniStat label="Peak Wind" value={`${currentScenario.peakWind} kt`} />
          <MiniStat label="Category" value={currentScenario.peakCategory} />
          <MiniStat label="Region" value={currentScenario.region} />
        </div>
      </div>

      {/* Current parameters */}
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
      }}>
        <SectionHeader label="Current Parameters" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}>
          <ParamDisplay label="Max Wind" value={`${whatIf.maxWind} kt`} color="#22D3EE" />
          <ParamDisplay label="Pressure Drop" value={`${whatIf.pressureDrop} hPa`} color="#38BDF8" />
          <ParamDisplay label="Landfall Shift" value={`${whatIf.landfallShift} km`} color="#A78BFA" />
          <ParamDisplay label="Tide" value={whatIf.tideState.toUpperCase()} color="#FB923C" />
        </div>
      </div>

      {/* Risk summary */}
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
      }}>
        <SectionHeader label="Risk Assessment" />
        <RiskGauge
          label="Peak Surge"
          value={metrics.peakSurge.mid}
          unit="m"
          low={metrics.peakSurge.low}
          high={metrics.peakSurge.high}
          maxValue={6}
          color={
            metrics.peakSurge.mid > 3 ? '#EF4444' :
            metrics.peakSurge.mid > 2 ? '#FB923C' :
            metrics.peakSurge.mid > 1 ? '#FACC15' : '#34D399'
          }
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginTop: '10px',
        }}>
          <RiskItem label="Assets Exposed" value={metrics.assetsExposed} severity={metrics.assetsExposed > 30 ? 'high' : 'medium'} />
          <RiskItem label="Roads Cut" value={metrics.roadsCut} severity={metrics.roadsCut > 10 ? 'high' : 'medium'} />
          <RiskItem label="Shelters Cut Off" value={metrics.sheltersCutOff} severity={metrics.sheltersCutOff > 3 ? 'high' : 'low'} />
          <RiskItem label="Hospitals At Risk" value={metrics.hospitalsAtRisk} severity={metrics.hospitalsAtRisk > 2 ? 'high' : 'low'} />
        </div>
      </div>

      {/* Timeline status */}
      <div style={{
        padding: '10px 12px',
        borderRadius: '8px',
        background: timelinePosition === 0
          ? 'rgba(239, 68, 68, 0.1)'
          : 'var(--color-bg-card)',
        border: `1px solid ${
          timelinePosition === 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border-subtle)'
        }`,
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: timelinePosition === 0 ? '#EF4444' : 'var(--color-cyan-accent)',
        }}>
          T{timelinePosition >= 0 ? '+' : ''}{timelinePosition}h
        </span>
        <span style={{
          fontSize: '0.72rem',
          color: 'var(--color-text-muted)',
          marginLeft: '8px',
        }}>
          {timelinePosition === 0 ? '⚡ LANDFALL IN PROGRESS' : timelinePosition < 0 ? 'Before landfall' : 'After landfall'}
        </span>
      </div>

      {/* Approximation badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderRadius: '6px',
        background: 'rgba(250, 204, 21, 0.08)',
        border: '1px solid rgba(250, 204, 21, 0.2)',
      }}>
        <span style={{ fontSize: '0.75rem' }}>⚠️</span>
        <span style={{
          fontSize: '0.68rem',
          color: '#FACC15',
        }}>
          Surge values are simplified approximations. See /about for methodology.
        </span>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: '0.65rem',
      fontWeight: 700,
      color: 'var(--color-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      {label}
      <div style={{
        flex: 1,
        height: '1px',
        background: 'var(--color-border-subtle)',
      }} />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</div>
    </div>
  );
}

function ParamDisplay({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      padding: '8px',
      borderRadius: '6px',
      background: `${color}08`,
      border: `1px solid ${color}20`,
    }}>
      <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color }}>{value}</div>
    </div>
  );
}

function RiskGauge({ label, value, unit, low, high, maxValue, color }: {
  label: string; value: number; unit: string; low: number; high: number; maxValue: number; color: string;
}) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color }}>
          {value.toFixed(1)}{unit}
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
            {' '}({low.toFixed(1)}–{high.toFixed(1)})
          </span>
        </span>
      </div>
      <div style={{
        height: '6px',
        borderRadius: '3px',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: '3px',
          background: `linear-gradient(90deg, ${color}60, ${color})`,
          boxShadow: `0 0 10px ${color}40`,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

function RiskItem({ label, value, severity }: { label: string; value: number; severity: 'low' | 'medium' | 'high' }) {
  const colors = { low: '#34D399', medium: '#FACC15', high: '#EF4444' };
  return (
    <div style={{
      padding: '8px',
      borderRadius: '6px',
      background: `${colors[severity]}08`,
      border: `1px solid ${colors[severity]}15`,
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '1.2rem',
        fontWeight: 700,
        color: colors[severity],
      }}>{value}</div>
      <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{label}</div>
    </div>
  );
}
