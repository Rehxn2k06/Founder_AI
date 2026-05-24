import './AgentStatus.css';
import type { AgentStatus as AgentStatusType } from '../types';

interface Props {
  status: AgentStatusType;
}

const STATUS_LABELS: Record<AgentStatusType, string> = {
  idle: 'Ready',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

const STATUS_ICONS: Record<AgentStatusType, string> = {
  idle: '○',
  listening: '🎙️',
  thinking: '💭',
  speaking: '🔊',
};

export function AgentStatus({ status }: Props) {
  return (
    <div className={`agent-status agent-status--${status}`}>
      <div className="agent-status__indicator">
        {status === 'speaking' ? (
          <div className="speaking-waves">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="speaking-wave" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : status === 'listening' ? (
          <div className="pulse-ring">
            <div className="pulse-ring__dot" />
          </div>
        ) : status === 'thinking' ? (
          <div className="thinking-dots">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="thinking-dot" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        ) : (
          <div className="idle-dot" />
        )}
      </div>
      <span className="agent-status__label">{STATUS_LABELS[status]}</span>
    </div>
  );
}
