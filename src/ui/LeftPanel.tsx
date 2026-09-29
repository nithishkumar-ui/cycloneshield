import { useStore, type TideState, type LayerVisibility } from '../state/store';

export default function LeftPanel() {
  const {
    whatIf,
    setWhatIf,
    timelinePosition,
    setTimelinePosition,
    isPlaying,
    setIsPlaying,
    layers,
    toggleLayer,
    verticalExaggeration,
    setVerticalExaggeration,
    currentScenario,
  } = useStore();

  if (!currentScenario) return null;

  return (
    <aside
      className="animate-slide-left"
      style={{
        width: '280px',
        minWidth: '280px',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '12px',
      }}
    >
      {/* What-If Controls */}
      <PanelSection title="WHAT-IF PARAMETERS" icon="⚡">
        <SliderControl
          label="Max Wind"
          unit="kt"
          value={whatIf.maxWind}
          min={30}
          max={200}
          step={5}
          onChange={(v) => setWhatIf({ maxWind: v })}
          color="#22D3EE"
        />
        <SliderControl
          label="Pressure Drop"
          unit="hPa"
          value={whatIf.pressureDrop}
          min={10}
          max={120}
          step={5}
          onChange={(v) => setWhatIf({ pressureDrop: v })}
          color="#38BDF8"
        />
        <SliderControl
          label="Landfall Shift"
          unit="km"
          value={whatIf.landfallShift}
          min={-50}
          max={50}
          step={5}
          onChange={(v) => setWhatIf({ landfallShift: v })}
          color="#A78BFA"
        />
        <div style={{ marginTop: '8px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Tide State
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['low', 'mean', 'high'] as TideState[]).map((t) => (
              <button
                key={t}
                onClick={() => setWhatIf({ tideState: t })}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  borderRadius: '6px',
                  border: whatIf.tideState === t
                    ? '1px solid var(--color-cyan-accent)'
                    : '1px solid var(--color-border-subtle)',
                  background: whatIf.tideState === t
                    ? 'var(--color-cyan-glow)'
                    : 'transparent',
                  color: whatIf.tideState === t
                    ? 'var(--color-cyan-accent)'
                    : 'var(--color-text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: whatIf.tideState === t ? 600 : 400,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </PanelSection>

      {/* Timeline */}
      <PanelSection title="TIMELINE" icon="⏱">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid var(--color-cyan-accent)',
              background: isPlaying ? 'var(--color-cyan-glow)' : 'transparent',
              color: 'var(--color-cyan-accent)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: timelinePosition < 0
              ? 'var(--color-cyan-accent)'
              : timelinePosition === 0
              ? 'var(--color-severity-emergency)'
              : 'var(--color-severity-warning)',
          }}>
            T{timelinePosition >= 0 ? '+' : ''}{timelinePosition}h
          </div>
          <div style={{
            fontSize: '0.65rem',
            color: 'var(--color-text-muted)',
            marginLeft: 'auto',
          }}>
            {timelinePosition === 0 ? '⚡ LANDFALL' : timelinePosition < 0 ? 'Before landfall' : 'After landfall'}
          </div>
        </div>
        <input
          type="range"
          min={-72}
          max={24}
          step={1}
          value={timelinePosition}
          onChange={(e) => setTimelinePosition(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--color-cyan-accent)',
            height: '4px',
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.6rem',
          color: 'var(--color-text-muted)',
          marginTop: '4px',
        }}>
          <span>T-72h</span>
          <span style={{ color: 'var(--color-severity-emergency)' }}>Landfall</span>
          <span>T+24h</span>
        </div>
      </PanelSection>

      {/* Layer Toggles */}
      <PanelSection title="LAYERS" icon="🗺">
        {(Object.keys(layers) as (keyof LayerVisibility)[]).map((layer) => (
          <LayerToggle
            key={layer}
            label={LAYER_LABELS[layer]}
            icon={LAYER_ICONS[layer]}
            active={layers[layer]}
            color={LAYER_COLORS[layer]}
            onClick={() => toggleLayer(layer)}
          />
        ))}
      </PanelSection>

      {/* 3D Controls */}
      <PanelSection title="3D VIEW" icon="🎮">
        <SliderControl
          label="Vertical Exaggeration"
          unit="x"
          value={verticalExaggeration}
          min={1}
          max={5}
          step={0.5}
          onChange={(v) => setVerticalExaggeration(v)}
          color="#A78BFA"
        />
      </PanelSection>
    </aside>
  );
}

/* ---- Sub-components ---- */

function PanelSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel-sm" style={{ padding: '14px', marginBottom: '8px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '12px',
      }}>
        <span style={{ fontSize: '0.8rem' }}>{icon}</span>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          {title}
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-subtle)',
          marginLeft: '8px',
        }} />
      </div>
      {children}
    </div>
  );
}

function SliderControl({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  color,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '5px',
      }}>
        <span style={{
          fontSize: '0.72rem',
          color: 'var(--color-text-secondary)',
        }}>{label}</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: color,
        }}>
          {value}
          <span style={{
            fontSize: '0.6rem',
            color: 'var(--color-text-muted)',
            marginLeft: '3px',
          }}>{unit}</span>
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: 0,
          right: 0,
          height: '4px',
          borderRadius: '2px',
          background: 'var(--color-bg-card)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: 0,
          width: `${pct}%`,
          height: '4px',
          borderRadius: '2px',
          background: `linear-gradient(90deg, ${color}40, ${color})`,
          boxShadow: `0 0 8px ${color}40`,
        }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            position: 'relative',
            zIndex: 2,
            opacity: 0,
            cursor: 'pointer',
            height: '20px',
          }}
        />
      </div>
    </div>
  );
}

function LayerToggle({
  label,
  icon,
  active,
  color,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '6px 8px',
        borderRadius: '6px',
        border: 'none',
        background: active ? `${color}10` : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s',
        marginBottom: '2px',
      }}
    >
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '2px',
        background: active ? color : 'var(--color-text-muted)',
        boxShadow: active ? `0 0 6px ${color}` : 'none',
        transition: 'all 0.2s',
      }} />
      <span style={{
        fontSize: '0.75rem',
        color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
      }}>
        {icon} {label}
      </span>
    </button>
  );
}

const LAYER_LABELS: Record<keyof LayerVisibility, string> = {
  surge: 'Storm Surge',
  rainPaths: 'Rain Flow Paths',
  power: 'Power Grid',
  roads: 'Arterial Roads',
  health: 'Health Facilities',
  shelters: 'Shelters',
};

const LAYER_ICONS: Record<keyof LayerVisibility, string> = {
  surge: '🌊',
  rainPaths: '🌧',
  power: '⚡',
  roads: '🛤',
  health: '🏥',
  shelters: '🏠',
};

const LAYER_COLORS: Record<keyof LayerVisibility, string> = {
  surge: '#22D3EE',
  rainPaths: '#38BDF8',
  power: '#FACC15',
  roads: '#FB923C',
  health: '#EF4444',
  shelters: '#34D399',
};
