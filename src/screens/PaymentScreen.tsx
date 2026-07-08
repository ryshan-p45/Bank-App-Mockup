import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { findTripById, isTransportType } from '../utils/vas';
import user from '../data/user.json';
import type { PurchasedTicket } from '../types';
import './PaymentScreen.css';

const PAYMENT_PROCESSING_DELAY_MS = 900;

export default function PaymentScreen() {
  const { type, optionId } = useParams<{ type: string; optionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passengerName, setPassengerName] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isTransportType(type)) {
    return <Navigate to="/vas" replace />;
  }

  const option = optionId ? findTripById(type, optionId) : undefined;
  const backTo = `/vas/${type}/details/${optionId}?${searchParams.toString()}`;
  const date = searchParams.get('date') ?? '';

  if (!option) {
    return (
      <div className="screen">
        <ScreenHeader title="Payment" backTo={`/vas/${type}/results?${searchParams.toString()}`} />
        <div className="screen-content">
          <EmptyState
            icon="⚠️"
            title="Trip no longer available"
            description="This trip couldn't be found. It may have expired — please search again."
          />
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!passengerName.trim()) {
      setError('Enter the passenger’s full name.');
      return;
    }

    setError('');
    setIsProcessing(true);

    const ticket: PurchasedTicket = {
      reference: `SB-${Math.abs(hashString(`${option.id}-${passengerName}-${date}`)).toString().slice(0, 8)}`,
      transportType: type,
      option,
      passengerName: passengerName.trim(),
      searchDate: date,
    };

    setTimeout(() => {
      navigate(`/vas/${type}/confirmation`, { state: { ticket } });
    }, PAYMENT_PROCESSING_DELAY_MS);
  };

  if (isProcessing) {
    return (
      <div className="screen">
        <ScreenHeader title="Payment" backTo={backTo} />
        <div className="screen-content">
          <LoadingState label="Processing your payment…" />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <ScreenHeader title="Payment" backTo={backTo} />
      <div className="screen-content">
        <div className="card payment-summary">
          <div className="payment-summary-row">
            <span>{option.operator}</span>
            <span>
              {option.from} → {option.to}
            </span>
          </div>
          <div className="payment-summary-row payment-summary-total">
            <span>Total</span>
            <span>R {option.price.toFixed(2)}</span>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="passengerName">Passenger full name</label>
            <input
              id="passengerName"
              value={passengerName}
              onChange={(event) => setPassengerName(event.target.value)}
              placeholder="As it appears on your ID"
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label htmlFor="paymentSource">Pay from</label>
            <div id="paymentSource" className="payment-source">
              <span>Everyday Account **** {user.accountNumber.slice(-4)}</span>
              <span className="badge badge-neutral">Card **** {user.cardLast4}</span>
            </div>
          </div>

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="primary-button">
            Pay R {option.price.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  );
}

/** Small deterministic hash so the same trip + name + date always mocks the same reference. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
