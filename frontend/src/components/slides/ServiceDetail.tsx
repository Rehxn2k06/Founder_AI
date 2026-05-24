import './ServiceDetail.css';

const SERVICE_DATA: Record<string, {
  name: string; icon: string; color: string; tagline: string;
  timeline: string; price: string; bestFor: string;
  includes: string[]; process: string[];
}> = {
  'Product Sprint': {
    name: 'Product Sprint',
    icon: '🚀', color: '#4f9eff',
    tagline: 'Idea → Live MVP in 6–10 weeks',
    timeline: '6–10 weeks', price: '$40k–$90k',
    bestFor: 'Founders who have validated the idea and need a live, shippable product yesterday.',
    includes: [
      'Product scoping & feature prioritization',
      'Full design system (Figma → production)',
      'Frontend + backend + infrastructure',
      'Deployment, testing & bug bash',
      'Handoff documentation & recorded walkthrough',
      '30-day post-launch warranty',
    ],
    process: ['Discovery', 'Design', 'Build Sprint 1', 'Build Sprint 2', 'Launch'],
  },
  'Design Sprint': {
    name: 'Design Sprint',
    icon: '🎨', color: '#a78bfa',
    tagline: 'Validate your concept in 2 weeks',
    timeline: '2 weeks', price: '$12k–$20k',
    bestFor: 'Teams that need to validate a concept before committing to a build.',
    includes: [
      'User research synthesis',
      '3 concept directions',
      'Hi-fidelity prototype (Figma)',
      'Investor-ready presentation deck',
      'User testing facilitation',
      'Design system foundations',
    ],
    process: ['Research', 'Concepts', 'Prototype', 'Test & Iterate'],
  },
  'Fractional CTO': {
    name: 'Fractional CTO',
    icon: '🧠', color: '#34d399',
    tagline: 'Technical co-founder, without the equity',
    timeline: '3+ months', price: '$8k–$15k/mo',
    bestFor: 'Non-technical founders who need a technical partner, not just a vendor.',
    includes: [
      'Weekly strategy & architecture sessions',
      'Tech stack selection & vendor evaluation',
      'Engineering hiring & interview support',
      'Code quality & process reviews',
      'Investor technical due diligence support',
      'On-call async Q&A',
    ],
    process: ['Onboarding', 'Audit', 'Strategy', 'Execution Support', 'Ongoing'],
  },
  'Scale & Iteration': {
    name: 'Scale & Iteration',
    icon: '⚡', color: '#fbbf24',
    tagline: 'Post-launch velocity with a dedicated pod',
    timeline: 'Monthly retainer', price: '$25k–$50k/mo',
    bestFor: 'Post-launch products that need to move fast — new features, performance, growth.',
    includes: [
      '1 senior designer + 2 senior engineers',
      'Two-week sprints, working software every cycle',
      'Shared Slack channel with your team',
      'Weekly sprint review & planning',
      'Performance & growth experiment work',
      'Priority bug response',
    ],
    process: ['Kickoff', 'Sprint 1', 'Review', 'Sprint 2', '→ Ongoing'],
  },
};

interface Props { service: string; }

export function ServiceDetail({ service }: Props) {
  const data = SERVICE_DATA[service] ?? SERVICE_DATA['Product Sprint'];

  return (
    <div className="service-detail" style={{ '--detail-color': data.color } as React.CSSProperties}>
      <div className="service-detail__hero glass-card">
        <div className="service-detail__hero-left">
          <div className="service-detail__icon">{data.icon}</div>
          <div>
            <p className="service-detail__eyebrow">Service Detail</p>
            <h2 className="service-detail__name">{data.name}</h2>
            <p className="service-detail__tagline">{data.tagline}</p>
          </div>
        </div>
        <div className="service-detail__badges">
          <div className="service-detail__badge">
            <span>⏱</span>
            <div>
              <p className="badge-label">Timeline</p>
              <p className="badge-value">{data.timeline}</p>
            </div>
          </div>
          <div className="service-detail__badge">
            <span>💰</span>
            <div>
              <p className="badge-label">Investment</p>
              <p className="badge-value">{data.price}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="service-detail__body">
        <div className="service-detail__section glass-card">
          <h4>Best For</h4>
          <p>{data.bestFor}</p>
        </div>

        <div className="service-detail__section glass-card">
          <h4>What's Included</h4>
          <ul className="service-detail__list">
            {data.includes.map((item, i) => (
              <li key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="checkmark">✓</span>{item}
              </li>
            ))}
          </ul>
        </div>

        <div className="service-detail__section glass-card">
          <h4>Process</h4>
          <div className="service-detail__steps">
            {data.process.map((step, i) => (
              <div key={i} className="service-step">
                <div className="service-step__dot">{i + 1}</div>
                <span>{step}</span>
                {i < data.process.length - 1 && <div className="service-step__line" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
