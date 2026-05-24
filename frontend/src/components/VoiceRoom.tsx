import { useCallback, useState, useEffect, Component } from 'react';
import type { ReactNode } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
} from '@livekit/components-react';
import { AgentStatus } from './AgentStatus';
import { LeadPanel } from './LeadPanel';
import { VisualPanel } from './VisualPanel';
import { useLeadState } from '../hooks/useLeadState';
import { useAgentRPC } from '../hooks/useAgentRPC';
import type { VisualSlide, AgentStatus as AgentStatusType } from '../types';
import './VoiceRoom.css';

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(err: Error) {
    return { error: err.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="room-error glass-card">
          <span>⚠️</span>
          <div>
            <strong>Connection error</strong>
            <p>{this.state.error}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Inner component — has access to room context ─────────────────────────────
function RoomContent() {
  // useVoiceAssistant is the stable hook — gives agent state reliably
  const { state: agentState } = useVoiceAssistant();

  const [slide, setSlide] = useState<VisualSlide>({ type: 'none' });
  const { lead, updateField, filledCount, totalFields } = useLeadState();

  const handleSlide = useCallback((s: VisualSlide) => setSlide(s), []);
  const handleLeadField = useCallback(
    (field: string, value: string) => updateField(field as keyof typeof lead, value),
    [updateField, lead]
  );

  useAgentRPC({ onSlide: handleSlide, onLeadField: handleLeadField });

  const statusMap: Record<string, AgentStatusType> = {
    speaking: 'speaking',
    listening: 'listening',
    thinking: 'thinking',
    initializing: 'idle',
    idle: 'idle',
    connecting: 'idle',
    disconnected: 'idle',
  };
  const displayStatus: AgentStatusType = statusMap[agentState] ?? 'idle';

  return (
    <>
      <RoomAudioRenderer />
      <div className="room-layout">
        <aside className="room-sidebar">
          <LeadPanel lead={lead} filledCount={filledCount} totalFields={totalFields} />
        </aside>
        <main className="room-main">
          <VisualPanel slide={slide} />
        </main>
      </div>

      <div className="room-statusbar">
        <div className="room-statusbar__left">
          <div className="maneuver-badge">
            <div className="maneuver-badge__dot" />
            <span>Maneuver</span>
          </div>
        </div>
        <AgentStatus status={displayStatus} />
        <div className="room-statusbar__right">
          <span className="statusbar-hint">
            {agentState === 'speaking' ? 'Jordan is speaking…' :
             agentState === 'listening' ? 'Listening to you…' :
             agentState === 'thinking' ? 'Jordan is thinking…' :
             'Speak naturally — Jordan is listening'}
          </span>
        </div>
      </div>
    </>
  );
}

// ─── Outer wrapper ─────────────────────────────────────────────────────────────
interface VoiceRoomProps {
  token: string;
  url: string;
  onDisconnect: () => void;
}

export function VoiceRoom({
  token,
  url,
  onDisconnect,
}: VoiceRoomProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={onDisconnect}
      className="livekit-room"
    >
      <ErrorBoundary>
        <RoomContent />
      </ErrorBoundary>
    </LiveKitRoom>
  );
}
