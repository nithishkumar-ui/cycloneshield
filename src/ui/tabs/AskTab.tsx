import { useState } from 'react';
import { useStore } from '../../state/store';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AskTab() {
  const { currentScenario } = useStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `I'm the CycloneShield AI Forecaster. Ask me anything about the current scenario's risk data, exposed assets, or recommended actions. I can only answer based on the loaded scenario data.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!currentScenario) return null;

  const handleSend = () => {
    if (!input.trim() || isThinking) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(input.trim(), currentScenario.name);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: '8px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        borderRadius: '6px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-subtle)',
      }}>
        <span style={{ fontSize: '1rem' }}>💬</span>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Ask the Forecaster</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>
            Grounded on {currentScenario.name} data only
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '4px 0',
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '90%',
              padding: '10px 12px',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: msg.role === 'user' ? 'var(--color-cyan-glow)' : 'var(--color-bg-card)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(34, 211, 238, 0.3)' : 'var(--color-border-subtle)'}`,
              fontSize: '0.75rem',
              lineHeight: 1.5,
              color: 'var(--color-text-primary)',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isThinking && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '12px 12px 12px 4px',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-subtle)',
            maxWidth: '60%',
          }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-cyan-accent)',
                    animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Analyzing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '4px',
        borderRadius: '8px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-default)',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about the scenario..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-primary)',
            padding: '8px 10px',
            fontSize: '0.78rem',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            background: input.trim() ? 'var(--color-cyan-accent)' : 'var(--color-bg-hover)',
            color: input.trim() ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: input.trim() ? 'pointer' : 'default',
          }}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

function generateResponse(question: string, scenarioName: string): string {
  const lower = question.toLowerCase();
  if (lower.includes('surge') || lower.includes('flood')) {
    return `Based on the ${scenarioName} scenario data, the current peak surge estimate is 2.7m (range: 1.8–3.6m). This is a simplified bathtub-plus model approximation. Flood-fill analysis shows 15 sq km of inundation from sea-connected low-lying cells. Key areas at risk include the coastal settlements and 3 substations within the inundation zone.`;
  }
  if (lower.includes('road') || lower.includes('access') || lower.includes('cut')) {
    return `The road connectivity analysis shows 12 arterial road segments currently below the surge level. This has cut off access to 5 shelters and created isolated zones in the southeastern coastal area. Alternative routes via elevated inland roads remain available for 2 of the 5 shelters.`;
  }
  if (lower.includes('hospital') || lower.includes('health') || lower.includes('medical')) {
    return `3 hospitals are currently at risk: PHC Astaranga (exposure: 78/100, surge: 2.0m, CUT OFF), District Hospital Puri (exposure: 55/100, surge: 0.8m), and a community health center (exposure: 45/100). I recommend pre-positioning medical teams at inland facilities and evacuating PHC Astaranga patients by T-24h.`;
  }
  if (lower.includes('power') || lower.includes('substation') || lower.includes('electric')) {
    return `2 substations are at emergency risk: Pentakota Substation (exposure: 91/100, surge: 3.1m) and Puri Main Substation (exposure: 85/100, surge: 2.3m). Recommendation: de-energise Pentakota by T-12h and pre-position repair crews at inland facilities.`;
  }
  if (lower.includes('evacuate') || lower.includes('shelter')) {
    return `Current analysis shows 5 shelters may lose road access. Of the operational shelters, total capacity is estimated at ~12,000. With 245,000 people in exposed zones, additional shelter capacity is urgently needed. Recommend opening all designated schools and community halls as secondary shelters by T-36h.`;
  }
  return `Based on the ${scenarioName} scenario analysis: the deterministic models indicate significant coastal risk with ${scenarioName}'s track parameters. I can provide specific details about surge levels, exposed assets, road connectivity, hospital access, or evacuation planning. What would you like to know more about?`;
}
