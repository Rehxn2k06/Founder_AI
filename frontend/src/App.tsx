import { useState, useCallback } from 'react';
import { VoiceRoom } from './components/VoiceRoom';
import './App.css';

const API_BASE = 'http://localhost:8000';

type AppState = 'landing' | 'connecting' | 'in-call' | 'error';

interface ConnectionInfo {
  token: string;
  url: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [connection, setConnection] = useState<ConnectionInfo | null>(null);
  const [error, setError] = useState<string>('');

  const handleStart = useCallback(async () => {
    setAppState('connecting');
    setError('');

    try {
      const res = await fetch(`${API_BASE}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          participant_name: `visitor-${Date.now()}`,
          room_name: `room-${Date.now()}`
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setConnection({ token: data.token, url: data.url });
      setAppState('in-call');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not connect';
      setError(msg);
      setAppState('error');
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnection(null);
    setAppState('landing');
  }, []);

  if (appState === 'in-call' && connection) {
    return (
      <div className="app">
        <VoiceRoom
          token={connection.token}
          url={connection.url}
          onDisconnect={handleDisconnect}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="landing">
        <div className="landing__bg-orb landing__bg-orb--1" />
        <div className="landing__bg-orb landing__bg-orb--2" />

        <div className="landing__card glass-card">
          <div className="landing__logo">
            <div className="landing__logo-mark">M</div>
          </div>

          <div className="landing__eyebrow">Maneuver Product Studio</div>
          <h1 className="landing__title">Talk to the Founder</h1>
          <p className="landing__desc">
            Skip the contact form. Have a real conversation with Jordan — Maneuver's founder.
            Ask anything about our services, process, or just tell me what you're building.
          </p>

          <div className="landing__features">
            <div className="landing__feature">
              <span>🎙️</span>
              <span>Real-time voice conversation</span>
            </div>
            <div className="landing__feature">
              <span>🧠</span>
              <span>AI powered by Gemini 2.0 Flash</span>
            </div>
            <div className="landing__feature">
              <span>⚡</span>
              <span>Sub-second latency</span>
            </div>
          </div>

          {appState === 'error' && (
            <div className="landing__error">
              ⚠️ {error}
              <br />
              <small>Make sure the agent server is running on port 8000.</small>
            </div>
          )}

          <button
            id="start-call-btn"
            className="landing__cta"
            onClick={handleStart}
            disabled={appState === 'connecting'}
          >
            {appState === 'connecting' ? (
              <>
                <span className="cta-spinner" />
                Connecting…
              </>
            ) : (
              <>
                <span>🎙️</span>
                Start Conversation
              </>
            )}
          </button>

          <p className="landing__mic-note">
            Your browser will ask for microphone permission
          </p>
        </div>
      </div>
    </div>
  );
}
