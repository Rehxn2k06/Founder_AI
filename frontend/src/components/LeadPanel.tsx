import './LeadPanel.css';
import type { LeadData } from '../types';

interface Props {
  lead: LeadData;
  filledCount: number;
  totalFields: number;
}

const FIELD_LABELS: Record<keyof LeadData, string> = {
  name: 'Name',
  company: 'Company',
  role: 'Role',
  problem: 'Problem',
  current_solution: 'Current Approach',
  timeline: 'Timeline',
  budget: 'Budget',
  team_size: 'Team Size',
  stage: 'Stage',
  notes: 'Notes',
};

const FIELD_ICONS: Record<keyof LeadData, string> = {
  name: '👤',
  company: '🏢',
  role: '💼',
  problem: '🎯',
  current_solution: '🔧',
  timeline: '📅',
  budget: '💰',
  team_size: '👥',
  stage: '🚀',
  notes: '📝',
};

const FIELD_ORDER: (keyof LeadData)[] = [
  'name', 'company', 'role', 'stage', 'problem',
  'current_solution', 'timeline', 'budget', 'team_size', 'notes'
];

export function LeadPanel({ lead, filledCount, totalFields }: Props) {
  const progress = (filledCount / totalFields) * 100;

  return (
    <div className="lead-panel glass-card">
      <div className="lead-panel__header">
        <div className="lead-panel__title">
          <span className="lead-panel__icon">📊</span>
          <h3>Discovery Progress</h3>
        </div>
        <div className="lead-panel__count">
          {filledCount}/{totalFields}
        </div>
      </div>

      <div className="lead-panel__progress">
        <div
          className="lead-panel__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="lead-panel__fields">
        {FIELD_ORDER.filter(f => f in FIELD_LABELS).map(field => {
          const value = lead[field];
          return (
            <div
              key={field}
              className={`lead-field ${value ? 'lead-field--filled' : 'lead-field--empty'}`}
            >
              <span className="lead-field__icon">{FIELD_ICONS[field]}</span>
              <div className="lead-field__content">
                <span className="lead-field__label">{FIELD_LABELS[field]}</span>
                {value ? (
                  <span className="lead-field__value">{value}</span>
                ) : (
                  <span className="lead-field__placeholder">—</span>
                )}
              </div>
              {value && <span className="lead-field__check">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
