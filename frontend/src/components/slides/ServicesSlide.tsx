import './ServicesSlide.css';

const SERVICES = [
  {
    id: 'product-sprint',
    name: 'Product Sprint',
    tagline: 'Idea → Live MVP',
    timeline: '6–10 weeks',
    price: '$40k–$90k',
    icon: '🚀',
    color: '#4f9eff',
    desc: 'Full design + engineering for a shippable product. We own the whole stack.',
  },
  {
    id: 'design-sprint',
    name: 'Design Sprint',
    tagline: 'Validate before you build',
    timeline: '2 weeks',
    price: '$12k–$20k',
    icon: '🎨',
    color: '#a78bfa',
    desc: 'Research, 3 concept directions, and a hi-fi prototype ready for investors.',
  },
  {
    id: 'fractional-cto',
    name: 'Fractional CTO',
    tagline: 'Technical co-founder, on demand',
    timeline: '3+ months',
    price: '$8k–$15k/mo',
    icon: '🧠',
    color: '#34d399',
    desc: 'Strategy, architecture, hiring help, and vendor selection. For non-technical founders.',
  },
  {
    id: 'scale',
    name: 'Scale & Iteration',
    tagline: 'Post-launch velocity',
    timeline: 'Monthly retainer',
    price: '$25k–$50k/mo',
    icon: '⚡',
    color: '#fbbf24',
    desc: 'A dedicated pod (1 designer + 2 engineers) embedded in your product.',
  },
];

export function ServicesSlide() {
  return (
    <div className="services-slide">
      <div className="services-slide__header">
        <p className="services-slide__eyebrow">What We Build</p>
        <h2 className="services-slide__title">Our Services</h2>
        <p className="services-slide__sub">Pick what fits your stage. We do one thing well: ship.</p>
      </div>
      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <div
            key={s.id}
            className="service-card glass-card"
            style={{
              '--card-color': s.color,
              animationDelay: `${i * 0.08}s`,
            } as React.CSSProperties}
          >
            <div className="service-card__icon">{s.icon}</div>
            <div className="service-card__content">
              <h3 className="service-card__name">{s.name}</h3>
              <p className="service-card__tagline">{s.tagline}</p>
              <p className="service-card__desc">{s.desc}</p>
            </div>
            <div className="service-card__meta">
              <span className="service-card__timeline">⏱ {s.timeline}</span>
              <span className="service-card__price">{s.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
