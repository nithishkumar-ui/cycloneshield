import { useStore } from '../state/store';
import { PRESET_SCENARIOS } from '../data/scenarios';
import { useNavigate, useLocation } from 'react-router-dom';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'hi', label: 'हिन्दी' },
];

export default function TopBar() {
  const {
    currentScenario,
    setCurrentScenario,
    language,
    setLanguage,
    isGenerating,
    setIsGenerating,
    geminiStatus,
  } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scenario = PRESET_SCENARIOS.find((s) => s.id === e.target.value);
    if (scenario) {
      setCurrentScenario(scenario);
      if (location.pathname === '/') {
        navigate(`/command/${scenario.id}`);
      }
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <header className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: '56px',
      borderRadius: 0,
      borderBottom: '1px solid var(--color-border-default)',
      borderLeft: 'none',
      borderRight: 'none',
      borderTop: 'none',
      position: 'relative',
      zIndex: 100,
    }}>
      {/* Left: Logo + Scenario */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #22D3EE, #0E7490)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}>
            🌀
          </div>
          <div>
            <div style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              lineHeight: 1.1,
            }}>
              <span style={{ color: 'var(--color-cyan-accent)' }}>CYCLONE</span>
              <span style={{ color: 'var(--color-text-primary)' }}>SHIELD</span>
            </div>
            <div style={{
              fontSize: '0.6rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              AI Impact Forecaster
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '28px',
          background: 'var(--color-border-default)',
        }} />

        {/* Scenario Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>Scenario</span>
          <select
            value={currentScenario?.id || ''}
            onChange={handleScenarioChange}
            style={{
              background: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '180px',
            }}
          >
            <option value="">Select scenario...</option>
            {PRESET_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.year})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Status pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <StatusPill label="DATA" status="live" />
        <StatusPill label="MODELS" status="ready" />
        <StatusPill
          label="GEMINI"
          status={
            geminiStatus === 'ready'
              ? 'ready'
              : geminiStatus === 'thinking'
              ? 'loading'
              : geminiStatus === 'cooling_down'
              ? 'warning'
              : 'error'
          }
        />
      </div>

      {/* Right: Language + Generate + Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Language selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>

        {/* Generate button */}
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={!currentScenario || isGenerating}
          style={{
            opacity: !currentScenario || isGenerating ? 0.5 : 1,
            cursor: !currentScenario || isGenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isGenerating ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }} />
              Generating...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Generate Advisories
            </>
          )}
        </button>

        {/* Nav links */}
        {currentScenario && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <NavButton
              label="Command"
              active={location.pathname.startsWith('/command')}
              onClick={() => navigate(`/command/${currentScenario.id}`)}
            />
            <NavButton
              label="Assets"
              active={location.pathname.startsWith('/assets')}
              onClick={() => navigate(`/assets/${currentScenario.id}`)}
            />
          </div>
        )}

        <NavButton
          label="About"
          active={location.pathname === '/about'}
          onClick={() => navigate('/about')}
        />
      </div>

      {/* Animated scan line at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-cyan-accent), transparent)',
        opacity: 0.3,
      }} />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}

function StatusPill({ label, status }: { label: string; status: 'live' | 'ready' | 'loading' | 'warning' | 'error' }) {
  const colors = {
    live: '#34D399',
    ready: '#34D399',
    loading: '#22D3EE',
    warning: '#FACC15',
    error: '#EF4444',
  };
  const color = colors[status];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '3px 10px',
      borderRadius: '20px',
      background: `${color}10`,
      border: `1px solid ${color}30`,
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}`,
        animation: status === 'loading' ? 'pulse-ring 1.5s ease-out infinite' : status === 'live' ? 'pulse-ring 2s ease-out infinite' : 'none',
      }} />
      <span style={{
        fontSize: '0.65rem',
        fontWeight: 600,
        color: color,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  );
}

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: '6px',
        border: 'none',
        background: active ? 'var(--color-cyan-glow)' : 'transparent',
        color: active ? 'var(--color-cyan-accent)' : 'var(--color-text-secondary)',
        fontSize: '0.78rem',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}
