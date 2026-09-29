import { useState } from 'react';
import { useStore, type AssetType } from '../../state/store';

const MOCK_ASSETS = [
  { id: '1', name: 'Puri Main Substation', type: 'substation' as AssetType, exposure_score: 85, surge_depth: 2.3, rain_risk: 0.7, cut_off: false, severity: 'emergency' as const },
  { id: '2', name: 'Coastal Power Line A12', type: 'power_line' as AssetType, exposure_score: 72, surge_depth: 1.8, rain_risk: 0.5, cut_off: false, severity: 'warning' as const },
  { id: '3', name: 'NH-316 Segment S3', type: 'road' as AssetType, exposure_score: 68, surge_depth: 1.5, rain_risk: 0.8, cut_off: true, severity: 'warning' as const },
  { id: '4', name: 'District Hospital Puri', type: 'hospital' as AssetType, exposure_score: 55, surge_depth: 0.8, rain_risk: 0.6, cut_off: false, severity: 'watch' as const },
  { id: '5', name: 'Balukhand Shelter', type: 'shelter' as AssetType, exposure_score: 42, surge_depth: 0.4, rain_risk: 0.3, cut_off: true, severity: 'watch' as const },
  { id: '6', name: 'Pentakota Substation', type: 'substation' as AssetType, exposure_score: 91, surge_depth: 3.1, rain_risk: 0.9, cut_off: false, severity: 'emergency' as const },
  { id: '7', name: 'NH-316 Segment S7', type: 'road' as AssetType, exposure_score: 35, surge_depth: 0.3, rain_risk: 0.4, cut_off: false, severity: 'advisory' as const },
  { id: '8', name: 'PHC Astaranga', type: 'hospital' as AssetType, exposure_score: 78, surge_depth: 2.0, rain_risk: 0.7, cut_off: true, severity: 'emergency' as const },
];

const TYPE_ICONS: Record<AssetType, string> = {
  substation: '⚡',
  power_line: '🔌',
  road: '🛤',
  hospital: '🏥',
  shelter: '🏠',
};

const SEVERITY_COLORS: Record<string, string> = {
  advisory: '#38BDF8',
  watch: '#FACC15',
  warning: '#FB923C',
  emergency: '#EF4444',
};

export default function AssetsTab() {
  const { currentScenario } = useStore();
  const [filter, setFilter] = useState<AssetType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'exposure_score' | 'surge_depth' | 'name'>('exposure_score');

  if (!currentScenario) return null;

  const filtered = MOCK_ASSETS
    .filter((a) => filter === 'all' || a.type === filter)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
    });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {(['all', 'substation', 'power_line', 'road', 'hospital', 'shelter'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              border: filter === t ? '1px solid var(--color-cyan-accent)' : '1px solid var(--color-border-subtle)',
              background: filter === t ? 'var(--color-cyan-glow)' : 'transparent',
              color: filter === t ? 'var(--color-cyan-accent)' : 'var(--color-text-muted)',
              fontSize: '0.68rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t === 'all' ? '🔍 All' : `${TYPE_ICONS[t]} ${t.replace('_', ' ')}`}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          style={{
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '0.7rem',
          }}
        >
          <option value="exposure_score">Exposure Score</option>
          <option value="surge_depth">Surge Depth</option>
          <option value="name">Name</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
          {filtered.length} assets
        </span>
      </div>

      {/* Asset list */}
      {filtered.map((asset) => (
        <div
          key={asset.id}
          style={{
            padding: '10px',
            borderRadius: '8px',
            background: 'var(--color-bg-card)',
            border: `1px solid ${SEVERITY_COLORS[asset.severity]}20`,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.9rem' }}>{TYPE_ICONS[asset.type]}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, flex: 1 }}>{asset.name}</span>
            <span className={`badge badge-${asset.severity}`} style={{ fontSize: '0.6rem' }}>
              {asset.severity}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <MiniMetric label="Exposure" value={asset.exposure_score} unit="/100" color={SEVERITY_COLORS[asset.severity]} />
            <MiniMetric label="Surge" value={asset.surge_depth} unit="m" color="#22D3EE" />
            <MiniMetric label="Rain Risk" value={asset.rain_risk} unit="" color="#38BDF8" />
            {asset.cut_off && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}>
                <span style={{ fontSize: '0.6rem', color: '#EF4444' }}>🚫 CUT OFF</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Export button */}
      <button className="btn-ghost" style={{ alignSelf: 'flex-start' }}>
        📥 Export CSV
      </button>
    </div>
  );
}

function MiniMetric({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color }}>
        {typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}{unit}
      </div>
    </div>
  );
}
