# Maneuver — "Talk to Founder" Voice AI Agent

A real-time voice web app where visitors can have a natural conversation with an AI representing Maneuver's founder. The agent runs discovery calls, answers questions about Maneuver, and renders synchronized visual content on the frontend while speaking.

## Demo

- Visitor lands on the page → clicks "Start Conversation"
- AI introduces itself as Jordan (Maneuver's founder)
- Discovery questions flow naturally — name, company, problem, timeline, budget
- Fields populate live on the left panel as the user answers
- If the user asks "what services do you offer?" → service cards appear instantly
- If the user asks "how does your process work?" → a 5-step diagram slides in
- At end of call → lead JSON saved to `leads/`

---

## How to Run Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- API keys for LiveKit, OpenAI, Deepgram, Cartesia (see below)

### 1. Clone and configure

```bash
git clone https://github.com/your-username/maneuver-voice-agent
cd maneuver-voice-agent
cp .env.example .env
# Fill in your API keys in .env
```

### 2. Start the Python agent + API server

```bash
cd agent
pip install -r requirements.txt

# Terminal 1: run the LiveKit voice agent
python main.py dev

# Terminal 2: run the FastAPI token + leads server
python server.py
```

### 3. Start the React frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

| Variable | Where to get it |
|----------|----------------|
| `LIVEKIT_URL` | [LiveKit Cloud](https://cloud.livekit.io) → Project → Settings |
| `LIVEKIT_API_KEY` | LiveKit Cloud → API Keys |
| `LIVEKIT_API_SECRET` | LiveKit Cloud → API Keys |
| `GOOGLE_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — **free tier, no CC required** |
| `DEEPGRAM_API_KEY` | [console.deepgram.com](https://console.deepgram.com) |
| `CARTESIA_API_KEY` | [play.cartesia.ai](https://play.cartesia.ai) |

---

## Architecture

| Layer | Choice | Why |
|-------|--------|---------|
| Voice Framework | LiveKit Agents (Python) | Required; Python SDK more mature |
| STT | Deepgram Nova-3 | Best latency, highly accurate |
| LLM | **Google Gemini 2.0 Flash** | **Free tier** (15 RPM, no CC); native tool calling |
| TTS | Cartesia Sonic | ~90ms latency, very natural |
| Frontend | React + Vite | Recommended in assignment |
| LiveKit UI | `@livekit/components-react` | Official SDK |
| Styling | Vanilla CSS + CSS variables | Premium dark glassmorphism theme |
| Lead Storage | JSON files + optional FastAPI `/leads` | Simple, local-first |

---

## Model Choices & Why

### STT — Deepgram Nova-3
- **~300ms latency** end-to-end, best in class for live voice
- Highly accurate for accented English and technical jargon
- LiveKit plugin is first-class

### LLM — Google Gemini 2.0 Flash
- **Completely free tier** — 15 requests/minute, 1M tokens/day, no credit card required
- Get your API key in 30 seconds at [aistudio.google.com](https://aistudio.google.com/app/apikey)
- Native tool/function calling — essential for the visual layer (the LLM decides when to call `show_services_slide`, etc.)
- Strong at natural, branching conversation without sounding scripted
- Slightly higher latency than GPT-4o (~1-2s TTFT) but more than acceptable for voice demos

### TTS — Cartesia Sonic
- **~90ms latency** — feels instantaneous, makes conversations feel real
- Very natural prosody for conversational speech
- If you don't have a Cartesia key, the agent falls back to OpenAI TTS

### Framework — LiveKit Agents (Python)
- Required by the assignment
- Python SDK is more mature than Node.js for custom agent logic
- Built-in VAD (Silero), turn detection, interruption handling

---

## Project Structure

```
maneuver-voice-agent/
├── agent/
│   ├── main.py          # Entry point — joins room, greets visitor
│   ├── agent.py         # STT/LLM/TTS pipeline, system prompt, RPC sender
│   ├── tools.py         # LLM tool definitions (visual + lead capture)
│   ├── lead_store.py    # Lead capture & JSON persistence
│   ├── server.py        # FastAPI: /token and /leads endpoints
│   └── knowledge_base.md # Maneuver services, process, pricing (ground truth)
│
├── frontend/src/
│   ├── App.tsx          # Landing page + connection state machine
│   ├── components/
│   │   ├── VoiceRoom.tsx     # LiveKit room wrapper
│   │   ├── AgentStatus.tsx   # Listening/thinking/speaking indicator
│   │   ├── VisualPanel.tsx   # Slide orchestrator
│   │   ├── LeadPanel.tsx     # Live discovery data panel
│   │   └── slides/
│   │       ├── ServicesSlide.tsx
│   │       ├── ServiceDetail.tsx
│   │       ├── ProcessDiagram.tsx
│   │       └── PricingSlide.tsx
│   └── hooks/
│       ├── useAgentRPC.ts    # LiveKit RPC → visual updates
│       └── useLeadState.ts   # Lead field state management
│
└── leads/               # Saved lead JSONs (auto-created)
```

---

## What I'd Do With Another Week

1. **Multi-agent handoff** — when the user is ready to book a follow-up, hand off to a scheduling agent that checks a calendar and sends a Calendly link
2. **Admin dashboard** — a `/admin` page showing past calls, lead data, and conversation replays
3. **Slack notification** — POST to a Slack webhook at call end with the captured lead data
4. **Streaming transcript** — show live captions synchronized with the audio
5. **Voice avatars** — animated AI avatar that lip-syncs with TTS output (using Heygen or D-ID)
6. **Better interruption UX** — visual feedback when the user interrupts (current: graceful audio cutoff)
7. **Phone number support** — LiveKit SIP integration so people can call in from a real phone

---

## Captured Lead Output Example

After a call, `leads/20240521T123456Z_maneuver-room.json` looks like:

```json
{
  "session_id": "20240521T123456Z",
  "room_name": "maneuver-room",
  "captured_at": "2024-05-21T12:34:56.000Z",
  "lead": {
    "name": "Alex Kim",
    "company": "Stackr",
    "role": "CEO",
    "problem": "Need to go from prototype to production-ready app in 8 weeks before a fundraise",
    "timeline": "8 weeks",
    "budget": "~$60k",
    "stage": "MVP",
    "team_size": "3 (no engineers yet)"
  },
  "transcript": [
    { "role": "agent", "text": "Hey! I'm Jordan...", "ts": "..." },
    { "role": "user", "text": "I'm building a B2B SaaS product...", "ts": "..." }
  ]
}
```
