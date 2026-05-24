import './ProcessDiagram.css';

const STEPS = [
  {
    num: 1,
    phase: 'Discovery',
    duration: 'Week 0',
    icon: '🔍',
    desc: 'Deep dive into users, the problem, and competitive landscape. We come out with a prioritized feature list and shared definition of "done".',
    output: 'Project brief, feature priorities',
  },
  {
    num: 2,
    phase: 'Design',
    duration: 'Weeks 1–2',
    icon: '✏️',
    desc: 'Lo-fi wireframes → stakeholder review → hi-fi design system → prototypes. You see work every 2 days, not at the end.',
    output: 'Design system, prototypes',
  },
  {
    num: 3,
    phase: 'Build',
    duration: 'Weeks 3–8',
    icon: '⚙️',
    desc: 'Two-week sprints. Working software ships at the end of every sprint. You have a staging environment from day one.',
    output: 'Working product, sprint reviews',
  },
  {
    num: 4,
    phase: 'Launch',
    duration: 'Weeks 9–10',
    icon: '🚀',
    desc: 'Load testing, bug bash, deployment, App Store submission, handoff docs, and a recorded walkthrough for your team.',
    output: 'Live product, handoff docs',
  },
  {
    num: 5,
    phase: 'Post-launch',
    duration: '30 days',
    icon: '🛡️',
    desc: 'We stick around for critical bug fixes. After that, retainer arrangements are available to keep the momentum.',
    output: 'Stability, ongoing velocity',
  },
];

export function ProcessDiagram() {
  return (
    <div className="process-diagram">
      <div className="process-diagram__header">
        <p className="process-diagram__eyebrow">How We Work</p>
        <h2 className="process-diagram__title">Delivery Process</h2>
        <p className="process-diagram__sub">Tight, opinionated, and built to not go sideways.</p>
      </div>

      <div className="process-steps">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="process-step glass-card"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="process-step__number">{step.num}</div>
            <div className="process-step__icon">{step.icon}</div>
            <div className="process-step__content">
              <div className="process-step__header">
                <h3 className="process-step__phase">{step.phase}</h3>
                <span className="process-step__duration">{step.duration}</span>
              </div>
              <p className="process-step__desc">{step.desc}</p>
              <div className="process-step__output">
                <span className="output-label">Output:</span>
                <span>{step.output}</span>
              </div>
            </div>
            {i < STEPS.length - 1 && <div className="process-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
}
