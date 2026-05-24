export interface LeadData {
  name?: string;
  company?: string;
  role?: string;
  problem?: string;
  current_solution?: string;
  timeline?: string;
  budget?: string;
  team_size?: string;
  stage?: string;
  notes?: string;
}

export type VisualSlide =
  | { type: 'none' }
  | { type: 'services' }
  | { type: 'service_detail'; service: string }
  | { type: 'process' }
  | { type: 'pricing' }
  | { type: 'case_study'; client: string }
  | { type: 'call_ended'; lead: LeadData };

export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface TranscriptLine {
  role: 'agent' | 'user';
  text: string;
  ts: string;
}
