import { useStore } from '../../state/store';

const MOCK_ADVISORIES = [
  {
    authority: 'District Collector',
    severity: 'emergency',
    icon: '🏛',
    headline: {
      en: 'EMERGENCY: Immediate evacuation of low-lying coastal zones required before T-12h',
      hi: 'आपातकाल: T-12h से पहले तटीय निचले क्षेत्रों की तत्काल निकासी आवश्यक',
      ta: 'அவசரநிலை: T-12h க்கு முன் கடலோர தாழ்வான பகுதிகளில் உடனடி வெளியேற்றம் தேவை',
    },
    actions: [
      { when: 'T-36h', action: 'Activate SDRF and NDRF teams; open all designated shelters' },
      { when: 'T-24h', action: 'Begin mandatory evacuation of zones A1-A4 (est. 85,000 residents)' },
      { when: 'T-12h', action: 'Close all beaches, fishing harbours; restrict vehicular movement on coastal roads' },
    ],
    publicAlert: 'Severe cyclone approaching. Move to nearest shelter immediately. Carry important documents and medications.',
  },
  {
    authority: 'State Power Utility',
    severity: 'warning',
    icon: '⚡',
    headline: {
      en: 'WARNING: Pre-emptive de-energisation of 3 coastal substations recommended',
      hi: 'चेतावनी: 3 तटीय उपकेंद्रों को पूर्व-निर्धारित रूप से बिजली रोकने की सिफारिश',
      ta: 'எச்சரிக்கை: 3 கடலோர மின்மாற்றிகளை முன்கூட்டியே நிறுத்த பரிந்துரைக்கப்படுகிறது',
    },
    actions: [
      { when: 'T-24h', action: 'Pre-position repair crews at inland substations' },
      { when: 'T-12h', action: 'De-energise Pentakota Substation (surge depth > 3m expected)' },
      { when: 'T-6h', action: 'Switch grid to island mode for critical facilities' },
    ],
    publicAlert: 'Power outages expected in coastal areas. Charge devices and store water.',
  },
  {
    authority: 'Health Department',
    severity: 'warning',
    icon: '🏥',
    headline: {
      en: 'WARNING: 3 hospitals at risk, 2 shelters may lose road access',
      hi: 'चेतावनी: 3 अस्पतालों पर खतरा, 2 आश्रय स्थलों तक सड़क पहुँच बाधित हो सकती है',
      ta: 'எச்சரிக்கை: 3 மருத்துவமனைகள் ஆபத்தில், 2 தங்குமிடங்களுக்கு சாலை அணுகல் இழக்கப்படலாம்',
    },
    actions: [
      { when: 'T-48h', action: 'Pre-stock medical supplies at inland hospitals' },
      { when: 'T-24h', action: 'Evacuate patients from PHC Astaranga to district hospital' },
      { when: 'T-12h', action: 'Deploy mobile medical teams to shelter locations' },
    ],
    publicAlert: 'If you need medical attention during the storm, call emergency helpline 1070.',
  },
  {
    authority: 'Ports & Fisheries',
    severity: 'watch',
    icon: '🚢',
    headline: {
      en: 'WATCH: All fishing vessels must return to harbour by T-24h',
      hi: 'निगरानी: सभी मछली पकड़ने वाली नौकाओं को T-24h तक बंदरगाह लौटना चाहिए',
      ta: 'கண்காணிப்பு: அனைத்து மீன்பிடி படகுகளும் T-24h க்குள் துறைமுகம் திரும்ப வேண்டும்',
    },
    actions: [
      { when: 'T-48h', action: 'Issue no-sail advisory for all fishing vessels' },
      { when: 'T-24h', action: 'Secure all docked vessels; close harbour operations' },
      { when: 'T-12h', action: 'Evacuate all harbour personnel to designated safe zones' },
    ],
    publicAlert: 'Do not go to sea. Fishermen should secure boats and move inland.',
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  advisory: '#38BDF8',
  watch: '#FACC15',
  warning: '#FB923C',
  emergency: '#EF4444',
};

export default function AdvisoriesTab() {
  const { language, currentScenario, isGenerating } = useStore();

  if (!currentScenario) return null;

  if (isGenerating) {
    return (
      <div className="animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px 20px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTop: '3px solid var(--color-cyan-accent)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--color-cyan-accent)',
          fontWeight: 600,
        }}>Generating advisories...</div>
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}>
          Gemini is analyzing risk data and generating<br />per-authority advisories
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        fontSize: '0.65rem',
        color: 'var(--color-text-muted)',
        padding: '6px 10px',
        borderRadius: '6px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span>🤖</span>
        <span>AI-generated advisory based on deterministic model outputs</span>
        <span className="badge badge-safe" style={{ marginLeft: 'auto', fontSize: '0.55rem' }}>CACHED</span>
      </div>

      {MOCK_ADVISORIES.map((adv, idx) => (
        <div
          key={idx}
          style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'var(--color-bg-card)',
            border: `1px solid ${SEVERITY_COLORS[adv.severity]}25`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1rem' }}>{adv.icon}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, flex: 1 }}>{adv.authority}</span>
            <span className={`badge badge-${adv.severity}`} style={{ fontSize: '0.6rem' }}>
              {adv.severity}
            </span>
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: SEVERITY_COLORS[adv.severity],
            fontWeight: 600,
            marginBottom: '8px',
            lineHeight: 1.4,
          }}>
            {(adv.headline as Record<string, string>)[language] || adv.headline.en}
          </div>

          <div style={{ marginBottom: '8px' }}>
            {adv.actions.map((action, aidx) => (
              <div key={aidx} style={{
                display: 'flex',
                gap: '8px',
                padding: '5px 0',
                borderBottom: aidx < adv.actions.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--color-cyan-accent)',
                  fontWeight: 600,
                  minWidth: '42px',
                }}>{action.when}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {action.action}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            padding: '8px',
            borderRadius: '6px',
            background: 'rgba(34, 211, 238, 0.05)',
            border: '1px solid rgba(34, 211, 238, 0.1)',
          }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>📢 Public Alert</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
              {adv.publicAlert}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
