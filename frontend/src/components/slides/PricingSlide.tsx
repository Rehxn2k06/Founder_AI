import './PricingSlide.css';

const PLANS = [
  {
    name: 'Design Sprint',
    icon: '🎨',
    price: '$12k–$20k',
    timeline: '2 weeks',
    color: '#a78bfa',
    desc: 'Validate before you commit. Research, concepts, and a prototype.',
    tags: ['One-time', 'Fixed price'],
  },
  {
    name: 'Product Sprint',
    icon: '🚀',
    price: '$40k–$90k',
    timeline: '6–10 weeks',
    color: '#4f9eff',
    desc: 'Full MVP — designed, engineered, and deployed.',
    tags: ['One-time', 'Fixed price'],
    featured: true,
  },
  {
    name: 'Fractional CTO',
    icon: '🧠',
    price: '$8k–$15k/mo',
    timeline: '3+ months',
    color: '#34d399',
    desc: 'Strategy, architecture, and hiring help. For non-technical founders.',
    tags: ['Monthly', 'Min 3 months'],
  },
  {
    name: 'Scale & Iteration',
    icon: '⚡',
    price: '$25k–$50k/mo',
    timeline: 'Monthly retainer',
    color: '#fbbf24',
    desc: 'Dedicated pod embedded in your product team.',
    tags: ['Monthly', 'Ongoing'],
  },
];

export function PricingSlide() {
  return (
    <div className="pricing-slide">
      <div className="pricing-slide__header">
        <p className="pricing-slide__eyebrow">Transparent Pricing</p>
        <h2 className="pricing-slide__title">Fixed Scope. Fixed Price.</h2>
        <p className="pricing-slide__sub">No hourly billing. No surprise invoices. You know what you're getting before we start.</p>
      </div>

      <div className="pricing-grid">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className={`pricing-card glass-card ${plan.featured ? 'pricing-card--featured' : ''}`}
            style={{ '--plan-color': plan.color, animationDelay: `${i * 0.08}s` } as React.CSSProperties}
          >
            {plan.featured && <div className="pricing-card__badge">Most Popular</div>}
            <div className="pricing-card__icon">{plan.icon}</div>
            <h3 className="pricing-card__name">{plan.name}</h3>
            <div className="pricing-card__price">{plan.price}</div>
            <div className="pricing-card__timeline">⏱ {plan.timeline}</div>
            <p className="pricing-card__desc">{plan.desc}</p>
            <div className="pricing-card__tags">
              {plan.tags.map(tag => (
                <span key={tag} className="pricing-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pricing-footer glass-card">
        <span>💳</span>
        <p>50% upfront, 50% on delivery. Monthly payments for retainers. Code ownership — always.</p>
      </div>
    </div>
  );
}
