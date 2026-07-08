import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import type { TransportType } from '../types';
import './VasHubScreen.css';

const TICKET_CATEGORIES: {
  type: TransportType;
  label: string;
  description: string;
  icon: string;
}[] = [
  { type: 'bus', label: 'Bus Tickets', description: 'Intercity coaches across South Africa', icon: '🚌' },
  { type: 'train', label: 'Train Tickets', description: 'Gautrain, Metrorail & long-distance rail', icon: '🚆' },
];

const OTHER_SERVICES = [
  { key: 'airtime', label: 'Airtime & Data', icon: '📶' },
  { key: 'electricity', label: 'Electricity', icon: '💡' },
  { key: 'dstv', label: 'DSTV & Streaming', icon: '📺' },
  { key: 'lotto', label: 'Lotto', icon: '🎟️' },
];

export default function VasHubScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSelectCategory = (type: TransportType) => {
    navigate(`/vas/${type}/search`);
  };

  return (
    <>
      <h1 className="vas-title">Buy value-added services</h1>
      <p className="vas-subtitle">Buy tickets and top-ups without leaving your banking app.</p>

      <section>
        <h2 className="section-title">Tickets</h2>
        <div className="vas-category-list">
          {TICKET_CATEGORIES.map((category) => (
            <button
              key={category.type}
              type="button"
              className="card vas-category"
              onClick={() => handleSelectCategory(category.type)}
            >
              <span className="vas-category-icon" aria-hidden="true">
                {category.icon}
              </span>
              <span className="vas-category-text">
                <span className="vas-category-label">{category.label}</span>
                <span className="vas-category-description">{category.description}</span>
              </span>
              <span className="vas-category-chevron" aria-hidden="true">
                ›
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Other services</h2>
        <div className="quick-actions-grid">
          {OTHER_SERVICES.map((service) => (
            <button
              key={service.key}
              type="button"
              className="quick-action"
              onClick={() =>
                showToast('This is a mockup — only bus & train ticket purchases are wired up here.')
              }
            >
              <span className="quick-action-icon" aria-hidden="true">
                {service.icon}
              </span>
              <span>{service.label}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
