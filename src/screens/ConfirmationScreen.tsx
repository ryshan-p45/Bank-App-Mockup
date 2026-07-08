import { useLocation, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { formatLongDate } from '../utils/format';
import type { PurchasedTicket } from '../types';
import './ConfirmationScreen.css';

interface ConfirmationLocationState {
  ticket?: PurchasedTicket;
}

export default function ConfirmationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ticket } = (location.state as ConfirmationLocationState) ?? {};

  if (!ticket) {
    return (
      <div className="screen">
        <div className="screen-content">
          <EmptyState
            icon="🎫"
            title="No ticket to show"
            description="We couldn't find a completed purchase to display. Start a new search to buy a ticket."
            action={
              <button type="button" className="secondary-button" onClick={() => navigate('/vas')}>
                Go to Buy Tickets
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const { option } = ticket;

  return (
    <div className="screen confirmation-screen">
      <div className="screen-content">
        <div className="confirmation-icon" aria-hidden="true">
          ✓
        </div>
        <h1 className="confirmation-title">Ticket confirmed</h1>
        <p className="confirmation-subtitle">Your {ticket.transportType} ticket has been booked.</p>

        <div className="card ticket-card">
          <div className="ticket-card-header">
            <span>{option.operator}</span>
            <span className="badge badge-success">Confirmed</span>
          </div>
          <div className="ticket-card-route">
            <div>
              <p className="ticket-card-time">{option.departure}</p>
              <p className="ticket-card-place">{option.from}</p>
            </div>
            <span aria-hidden="true">→</span>
            <div>
              <p className="ticket-card-time">{option.arrival}</p>
              <p className="ticket-card-place">{option.to}</p>
            </div>
          </div>
          {ticket.searchDate && <p className="ticket-card-date">{formatLongDate(ticket.searchDate)}</p>}
          <div className="ticket-card-qr" aria-hidden="true">
            QR
          </div>
          <dl className="details-list">
            <div className="details-row">
              <dt>Passenger</dt>
              <dd>{ticket.passengerName}</dd>
            </div>
            <div className="details-row">
              <dt>Reference</dt>
              <dd>{ticket.reference}</dd>
            </div>
            <div className="details-row">
              <dt>Amount paid</dt>
              <dd>R {option.price.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        <div className="confirmation-actions">
          <button type="button" className="primary-button" onClick={() => navigate('/dashboard')}>
            Back to home
          </button>
          <button type="button" className="secondary-button" onClick={() => navigate('/vas')}>
            Buy another ticket
          </button>
        </div>
      </div>
    </div>
  );
}
