import { useState } from 'react';
import { useStore } from '../../state/store';

interface Trigger {
  id: string;
  name: string;
  metric: 'wind_gust_kt' | 'surge_m' | 'rain_mm_24h';
  threshold: number;
  currentValue: number;
  fired: boolean;
}

const PAYOUT_LADDER = [
  { threshold: 'Tier 1', condition: 'Any 1 trigger', payout: 25 },
  { threshold: 'Tier 2', condition: 'Any 2 triggers', payout: 50 },
  { threshold: 'Tier 3', condition: 'All triggers', payout: 100 },
];

export default function InsuranceTab() {
  const { currentScenario, whatIf, metrics } = useStore();
  const [sumInsured, setSumInsured] = useState(10000000);

  if (!currentScenario) return null;

  const triggers: Trigger[] = [
    {
      id: 'wind',
      name: 'Wind Gust',
      metric: 'wind_gust_kt',
      threshold: 100,
      currentValue: whatIf.maxWind,
      fired: whatIf.maxWind >= 100,
    },
    {
      id: 'surge',
      name: 'Storm Surge',
      metric: 'surge_m',
      threshold: 2.5,
      currentValue: metrics.peakSurge.mid,
      fired: metrics.peakSurge.mid >= 2.5,
    },
    {
      id: 'rain',
      name: '24h Rainfall',
      metric: 'rain_mm_24h',
      threshold: 200,
      currentValue: 185,
      fired: false,
    },
  ];

  const firedCount = triggers.filter((t) => t.fired).length;
  const payoutPct = firedCount >= 3 ? 100 : firedCount >= 2 ? 50 : firedCount >= 1 ? 25 : 0;
  const liquidity = (payoutPct / 100) * sumInsured;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Trigger status header */}
      <div style={{
        padding: '14px',
        borderRadius: '8px',
        background: firedCount > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(52, 211, 153, 0.08)',
        border: `1px solid ${firedCount > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(52, 211, 153, 0.25)'}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '1.6rem',
          marginBottom: '4px',
        }}>{firedCount > 0 ? '🔴' : '🟢'}</div>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: firedCount > 0 ? '#EF4444' : '#34D399',
          marginBottom: '2px',
        }}>
          {firedCount > 0 ? `TRIGGER FIRED (${firedCount}/${triggers.length})` : 'NO TRIGGER FIRED'}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
          Payout: {payoutPct}%
        </div>
      </div>

      {/* Triggers */}
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        Parametric Triggers
      </div>
      {triggers.map((trigger) => (
        <div
          key={trigger.id}
          style={{
            padding: '10px',
            borderRadius: '8px',
            background: 'var(--color-bg-card)',
            border: `1px solid ${trigger.fired ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border-subtle)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: trigger.fired ? '#EF4444' : '#34D399',
              boxShadow: trigger.fired ? '0 0 8px rgba(239, 68, 68, 0.5)' : '0 0 8px rgba(52, 211, 153, 0.3)',
            }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, flex: 1 }}>{trigger.name}</span>
            <span className={`badge ${trigger.fired ? 'badge-emergency' : 'badge-safe'}`} style={{ fontSize: '0.55rem' }}>
              {trigger.fired ? 'FIRED' : 'OK'}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Current</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
                color: trigger.fired ? '#EF4444' : 'var(--color-text-primary)',
              }}>
                {trigger.currentValue.toFixed(1)}
              </div>
            </div>
            <div style={{
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
            }}>
              {trigger.fired ? '≥' : '<'}
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Threshold</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-cyan-accent)',
              }}>
                {trigger.threshold.toFixed(1)}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{
            height: '4px',
            borderRadius: '2px',
            background: 'var(--color-bg-primary)',
            marginTop: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min((trigger.currentValue / trigger.threshold) * 100, 100)}%`,
              borderRadius: '2px',
              background: trigger.fired
                ? 'linear-gradient(90deg, #EF4444, #DC2626)'
                : 'linear-gradient(90deg, #34D399, #10B981)',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      ))}

      {/* Payout Ladder */}
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginTop: '4px',
      }}>
        Payout Ladder
      </div>
      <div style={{
        padding: '10px',
        borderRadius: '8px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
      }}>
        {PAYOUT_LADDER.map((tier, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 0',
            borderBottom: idx < PAYOUT_LADDER.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
            opacity: (idx === 0 && firedCount >= 1) || (idx === 1 && firedCount >= 2) || (idx === 2 && firedCount >= 3) ? 1 : 0.4,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-cyan-accent)', minWidth: '44px' }}>
              {tier.threshold}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', flex: 1 }}>
              {tier.condition}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#FACC15',
            }}>
              {tier.payout}%
            </span>
          </div>
        ))}
      </div>

      {/* Sum insured + liquidity */}
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Sum Insured</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>₹</span>
            <input
              type="number"
              value={sumInsured}
              onChange={(e) => setSumInsured(Number(e.target.value))}
              style={{
                background: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                width: '120px',
                textAlign: 'right',
              }}
            />
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          borderRadius: '6px',
          background: firedCount > 0 ? 'rgba(250, 204, 21, 0.08)' : 'transparent',
          border: firedCount > 0 ? '1px solid rgba(250, 204, 21, 0.2)' : '1px solid var(--color-border-subtle)',
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Liquidity Needed</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: firedCount > 0 ? '#FACC15' : 'var(--color-text-muted)',
          }}>
            ₹{liquidity.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
