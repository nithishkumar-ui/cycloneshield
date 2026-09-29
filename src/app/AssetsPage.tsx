import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore, type AssetType } from '../state/store';
import { PRESET_SCENARIOS } from '../data/scenarios';

const MOCK_ASSETS = [
  { id: '1', name: 'Puri Main Substation', type: 'substation' as AssetType, exposure_score: 85, surge_depth: 2.3, rain_risk: 0.7, cut_off: false, severity: 'emergency', lat: 19.81, lon: 85.83 },
  { id: '2', name: 'Coastal Power Line A12', type: 'power_line' as AssetType, exposure_score: 72, surge_depth: 1.8, rain_risk: 0.5, cut_off: false, severity: 'warning', lat: 19.79, lon: 85.81 },
  { id: '3', name: 'NH-316 Segment S3', type: 'road' as AssetType, exposure_score: 68, surge_depth: 1.5, rain_risk: 0.8, cut_off: true, severity: 'warning', lat: 19.82, lon: 85.85 },
  { id: '4', name: 'District Hospital Puri', type: 'hospital' as AssetType, exposure_score: 55, surge_depth: 0.8, rain_risk: 0.6, cut_off: false, severity: 'watch', lat: 19.80, lon: 85.84 },
  { id: '5', name: 'Balukhand Shelter', type: 'shelter' as AssetType, exposure_score: 42, surge_depth: 0.4, rain_risk: 0.3, cut_off: true, severity: 'watch', lat: 19.83, lon: 85.86 },
  { id: '6', name: 'Pentakota Substation', type: 'substation' as AssetType, exposure_score: 91, surge_depth: 3.1, rain_risk: 0.9, cut_off: false, severity: 'emergency', lat: 19.78, lon: 85.80 },
  { id: '7', name: 'NH-316 Segment S7', type: 'road' as AssetType, exposure_score: 35, surge_depth: 0.3, rain_risk: 0.4, cut_off: false, severity: 'advisory', lat: 19.84, lon: 85.88 },
  { id: '8', name: 'PHC Astaranga', type: 'hospital' as AssetType, exposure_score: 78, surge_depth: 2.0, rain_risk: 0.7, cut_off: true, severity: 'emergency', lat: 19.77, lon: 85.79 },
  { id: '9', name: 'Konark Power Substation', type: 'substation' as AssetType, exposure_score: 45, surge_depth: 0.6, rain_risk: 0.4, cut_off: false, severity: 'watch', lat: 19.85, lon: 85.90 },
  { id: '10', name: 'SH-60 Coastal Segment', type: 'road' as AssetType, exposure_score: 62, surge_depth: 1.2, rain_risk: 0.6, cut_off: true, severity: 'warning', lat: 19.76, lon: 85.78 },
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

export default function AssetsPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const { currentScenario, setCurrentScenario } = useStore();
  const [filter, setFilter] = useState<AssetType | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('exposure_score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (scenarioId && (!currentScenario || currentScenario.id !== scenarioId)) {
      const scenario = PRESET_SCENARIOS.find((s) => s.id === scenarioId);
      if (scenario) setCurrentScenario(scenario);
      else navigate('/');
    }
  }, [scenarioId]);

  const filtered = MOCK_ASSETS
    .filter((a) => filter === 'all' || a.type === filter)
    .sort((a, b) => {
      const aVal = (a as any)[sortBy] ?? 0;
      const bVal = (b as any)[sortBy] ?? 0;
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const handleSort = (col: string) => {
    if (sortBy === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  return (
    <div className="grid-bg" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 24px',
      overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>
            🏗 Infrastructure Assets
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {currentScenario?.name} — {filtered.length} assets shown
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'substation', 'power_line', 'road', 'hospital', 'shelter'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={filter === t ? 'btn-primary' : 'btn-ghost'}
              style={{ fontSize: '0.72rem', padding: '5px 12px' }}
            >
              {t === 'all' ? 'All' : `${TYPE_ICONS[t]} ${t.replace('_', ' ')}`}
            </button>
          ))}
          <button className="btn-ghost" style={{ fontSize: '0.72rem' }}>📥 Export CSV</button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-default)' }}>
              {[
                { key: 'type', label: 'Type' },
                { key: 'name', label: 'Name' },
                { key: 'exposure_score', label: 'Exposure' },
                { key: 'surge_depth', label: 'Surge (m)' },
                { key: 'rain_risk', label: 'Rain Risk' },
                { key: 'cut_off', label: 'Access' },
                { key: 'severity', label: 'Severity' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    color: sortBy === col.key ? 'var(--color-cyan-accent)' : 'var(--color-text-muted)',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {col.label} {sortBy === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr
                key={asset.id}
                style={{
                  borderBottom: '1px solid var(--color-border-subtle)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontSize: '1rem' }}>{TYPE_ICONS[asset.type]}</span>
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 500 }}>
                  {asset.name}
                  <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>
                    {asset.lat.toFixed(3)}°N, {asset.lon.toFixed(3)}°E
                  </div>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '4px',
                      borderRadius: '2px',
                      background: 'var(--color-bg-primary)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${asset.exposure_score}%`,
                        background: SEVERITY_COLORS[asset.severity],
                        borderRadius: '2px',
                      }} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: SEVERITY_COLORS[asset.severity],
                    }}>{asset.exposure_score}</span>
                  </div>
                </td>
                <td style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  color: asset.surge_depth > 2 ? '#EF4444' : asset.surge_depth > 1 ? '#FB923C' : 'var(--color-text-secondary)',
                }}>
                  {asset.surge_depth.toFixed(1)}
                </td>
                <td style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-secondary)',
                }}>
                  {asset.rain_risk.toFixed(2)}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {asset.cut_off ? (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#EF4444',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}>🚫 CUT OFF</span>
                  ) : (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      background: 'rgba(52, 211, 153, 0.1)',
                      color: '#34D399',
                      border: '1px solid rgba(52, 211, 153, 0.2)',
                    }}>✓ OK</span>
                  )}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span className={`badge badge-${asset.severity}`}>{asset.severity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
