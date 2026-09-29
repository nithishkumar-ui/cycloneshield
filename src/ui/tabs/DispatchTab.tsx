import { useState, useEffect } from 'react';
import { useStore } from '../../state/store';

interface DispatchRecord {
  id: string;
  authority: string;
  channel: 'in_app' | 'telegram' | 'email';
  status: 'queued' | 'sent' | 'failed';
  simulated: boolean;
  timestamp: string;
}

const INITIAL_DISPATCHES: DispatchRecord[] = [];

const CHANNEL_ICONS: Record<string, string> = {
  in_app: '📱',
  telegram: '✈️',
  email: '📧',
};

const STATUS_COLORS: Record<string, string> = {
  queued: '#FACC15',
  sent: '#34D399',
  failed: '#EF4444',
};

export default function DispatchTab() {
  const { currentScenario } = useStore();
  const [dispatches, setDispatches] = useState<DispatchRecord[]>(INITIAL_DISPATCHES);
  const [autoDispatch, setAutoDispatch] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleDispatch = () => {
    setIsDispatching(true);
    const authorities = ['District Collector', 'Power Utility', 'Health Dept', 'Ports & Fisheries'];
    const channels: ('in_app' | 'telegram' | 'email')[] = ['in_app', 'telegram', 'email'];

    const newDispatches: DispatchRecord[] = [];
    authorities.forEach((auth) => {
      channels.forEach((ch) => {
        newDispatches.push({
          id: `${auth}-${ch}-${Date.now()}`,
          authority: auth,
          channel: ch,
          status: 'queued',
          simulated: ch !== 'in_app',
          timestamp: new Date().toISOString(),
        });
      });
    });

    setDispatches(newDispatches);

    // Simulate status transitions
    newDispatches.forEach((d, idx) => {
      setTimeout(() => {
        setDispatches((prev) =>
          prev.map((p) => (p.id === d.id ? { ...p, status: 'sent' as const } : p))
        );
      }, 800 + idx * 300);
    });

    setTimeout(() => setIsDispatching(false), 800 + newDispatches.length * 300 + 500);
  };

  if (!currentScenario) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        borderRadius: '8px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
      }}>
        <button
          className="btn-primary"
          onClick={handleDispatch}
          disabled={isDispatching}
          style={{
            fontSize: '0.78rem',
            opacity: isDispatching ? 0.5 : 1,
          }}
        >
          📡 {isDispatching ? 'Dispatching...' : 'Dispatch All'}
        </button>
        <div style={{ flex: 1 }} />
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.7rem',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={autoDispatch}
            onChange={(e) => setAutoDispatch(e.target.checked)}
            style={{ accentColor: 'var(--color-cyan-accent)' }}
          />
          Auto-dispatch on ≥ Warning
        </label>
      </div>

      {/* Simulated notice */}
      <div style={{
        padding: '8px 10px',
        borderRadius: '6px',
        background: 'rgba(250, 204, 21, 0.08)',
        border: '1px solid rgba(250, 204, 21, 0.2)',
        fontSize: '0.68rem',
        color: '#FACC15',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span>⚠️</span>
        Telegram and email channels are simulated unless credentials are configured.
      </div>

      {/* Outbox */}
      {dispatches.length === 0 ? (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.78rem',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📡</div>
          No dispatches yet. Click "Dispatch All" to send advisories.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{
            fontSize: '0.65rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '4px',
          }}>
            OUTBOX ({dispatches.filter((d) => d.status === 'sent').length}/{dispatches.length} sent)
          </div>
          {dispatches.map((d) => (
            <div
              key={d.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                background: 'var(--color-bg-card)',
                border: `1px solid ${STATUS_COLORS[d.status]}15`,
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>{CHANNEL_ICONS[d.channel]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600 }}>{d.authority}</div>
                <div style={{
                  fontSize: '0.6rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  gap: '6px',
                }}>
                  <span>{d.channel.replace('_', ' ')}</span>
                  {d.simulated && <span style={{ color: '#FACC15' }}>• simulated</span>}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '12px',
                background: `${STATUS_COLORS[d.status]}10`,
                border: `1px solid ${STATUS_COLORS[d.status]}30`,
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: STATUS_COLORS[d.status],
                  boxShadow: `0 0 4px ${STATUS_COLORS[d.status]}`,
                }} />
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  color: STATUS_COLORS[d.status],
                  textTransform: 'uppercase',
                }}>{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
