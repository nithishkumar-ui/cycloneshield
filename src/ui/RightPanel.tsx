import { useStore, type TabId } from '../state/store';
import SummaryTab from './tabs/SummaryTab';
import AssetsTab from './tabs/AssetsTab';
import AdvisoriesTab from './tabs/AdvisoriesTab';
import DispatchTab from './tabs/DispatchTab';
import InsuranceTab from './tabs/InsuranceTab';
import AskTab from './tabs/AskTab';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'summary', label: 'Summary', icon: '📊' },
  { id: 'assets', label: 'Assets', icon: '🏗' },
  { id: 'advisories', label: 'Advisories', icon: '📋' },
  { id: 'dispatch', label: 'Dispatch', icon: '📡' },
  { id: 'insurance', label: 'Insurance', icon: '🛡' },
  { id: 'ask', label: 'Ask', icon: '💬' },
];

export default function RightPanel() {
  const { activeTab, setActiveTab, currentScenario } = useStore();

  if (!currentScenario) return null;

  return (
    <aside
      className="animate-slide-right"
      style={{
        width: '340px',
        minWidth: '340px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '12px',
      }}
    >
      {/* Tab bar */}
      <div className="glass-panel-sm" style={{
        display: 'flex',
        padding: '4px',
        marginBottom: '8px',
        gap: '2px',
        flexShrink: 0,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '7px 4px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--color-cyan-glow)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-cyan-accent)' : 'var(--color-text-muted)',
              fontSize: '0.65rem',
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="glass-panel-sm" style={{
        flex: 1,
        overflow: 'auto',
        padding: '14px',
      }}>
        {activeTab === 'summary' && <SummaryTab />}
        {activeTab === 'assets' && <AssetsTab />}
        {activeTab === 'advisories' && <AdvisoriesTab />}
        {activeTab === 'dispatch' && <DispatchTab />}
        {activeTab === 'insurance' && <InsuranceTab />}
        {activeTab === 'ask' && <AskTab />}
      </div>
    </aside>
  );
}
