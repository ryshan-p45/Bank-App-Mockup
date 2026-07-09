import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ScreenHeader from '../components/ScreenHeader/ScreenHeader';
import EmptyState from '../components/EmptyState';
import { findTripById, isTransportType } from '../utils/vas';
import { formatLongDate } from '../utils/format';
import './TicketDetailsScreen.css';

export default function TicketDetailsScreen() {
  const { type, optionId } = useParams<{ type: string; optionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!isTransportType(type)) {
    return <Navigate to="/vas" replace />;
  }

  const option = optionId ? findTripById(type, optionId) : undefined;
  const backTo = `/vas/${type}/results?${searchParams.toString()}`;
  const date = searchParams.get('date') ?? '';

  if (!option) {
    return (
      <div className="screen">
        <ScreenHeader title="Trip details" backTo={backTo} />
        <div className="screen-content">
          <EmptyState
            icon="⚠️"
            title="Trip no longer available"
            description="This trip couldn't be found. It may have expired — please search again."
            action={
              <button type="button" className="secondary-button" onClick={() => navigate(backTo)}>
                Back to results
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <ScreenHeader title="Trip details" backTo={backTo} />
      <div className="screen-content">
        <div className="card details-card">
          <p className="details-operator">{option.operator}</p>

          <div className="details-route">
            <div>
              <p className="details-time">{option.departure}</p>
              <p className="details-place">{option.from}</p>
            </div>
            <div className="details-duration">
              <span className="result-card-line" aria-hidden="true" />
              <span>{option.duration}</span>
            </div>
            <div>
              <p className="details-time">{option.arrival}</p>
              <p className="details-place">{option.to}</p>
            </div>
          </div>

          {date && <p className="details-date">Travel date: {formatLongDate(date)}</p>}

          <dl className="details-list">
            <div className="details-row">
              <dt>Seats available</dt>
              <dd>{option.seatsAvailable}</dd>
            </div>
            <div className="details-row">
              <dt>Ticket type</dt>
              <dd>Single, standard class</dd>
            </div>
            <div className="details-row">
              <dt>Price per ticket</dt>
              <dd>R {option.price.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        <p className="details-note">
          This is a mockup — no real ticket is issued. Prices and availability shown are for demonstration only.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate(`/vas/${type}/payment/${option.id}?${searchParams.toString()}`)}
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}
