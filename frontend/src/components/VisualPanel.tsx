import './VisualPanel.css';
import type { VisualSlide } from '../types';
import { ServicesSlide } from './slides/ServicesSlide';
import { ServiceDetail } from './slides/ServiceDetail';
import { ProcessDiagram } from './slides/ProcessDiagram';
import { PricingSlide } from './slides/PricingSlide';

interface Props {
  slide: VisualSlide;
}

function DefaultIdle() {
  return (
    <div className="visual-idle">
      <div className="visual-idle__logo">
        <span className="visual-idle__m">M</span>
      </div>
      <h1 className="visual-idle__title">Talk to the Founder</h1>
      <p className="visual-idle__sub">
        Ask about our services, process, or pricing.<br />
        Or just tell me what you're building.
      </p>
      <div className="visual-idle__hints">
        <span className="hint-pill">💬 "What does Maneuver do?"</span>
        <span className="hint-pill">💬 "Tell me about your process"</span>
        <span className="hint-pill">💬 "How much does it cost?"</span>
      </div>
    </div>
  );
}

function CallEnded({ lead }: { lead: Record<string, string> }) {
  return (
    <div className="call-ended glass-card">
      <div className="call-ended__icon">✅</div>
      <h2 className="call-ended__title">Great conversation!</h2>
      <p className="call-ended__sub">Lead captured and saved. Here's what we got:</p>
      <div className="call-ended__fields">
        {Object.entries(lead).map(([k, v]) => (
          <div key={k} className="call-ended__field">
            <span className="call-ended__key">{k.replace('_', ' ')}</span>
            <span className="call-ended__val">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VisualPanel({ slide }: Props) {
  return (
    <div className="visual-panel">
      {slide.type === 'none' && <DefaultIdle />}
      {slide.type === 'services' && <ServicesSlide />}
      {slide.type === 'service_detail' && <ServiceDetail service={slide.service} />}
      {slide.type === 'process' && <ProcessDiagram />}
      {slide.type === 'pricing' && <PricingSlide />}
      {slide.type === 'call_ended' && <CallEnded lead={slide.lead as Record<string, string>} />}
      {slide.type === 'case_study' && (
        <div className="case-study-placeholder glass-card">
          <div className="case-study__icon">📁</div>
          <h3>Case Study: {slide.client}</h3>
          <p>Deep dive into how we helped {slide.client} ship fast and raise capital.</p>
        </div>
      )}
    </div>
  );
}
