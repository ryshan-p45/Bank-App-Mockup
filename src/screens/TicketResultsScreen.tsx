import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ScreenHeader from '../components/ScreenHeader';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { isTransportType, searchTrips } from '../utils/vas';
import { formatLongDate } from '../utils/format';
import type { TripOption } from '../types';
import './TicketResultsScreen.css';

const RESULTS_LOADING_DELAY_MS = 700;

export default function TicketResultsScreen() {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const from = searchParams.get('from') ?? '';
  const to = searchParams.get('to') ?? '';
  const date = searchParams.get('date') ?? '';

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), RESULTS_LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [from, to, date]);

  if (!isTransportType(type)) {
    return <Navigate to="/vas" replace />;
  }

  const backTo = `/vas/${type}/search?${searchParams.toString()}`;
  const results: TripOption[] = searchTrips(type, from, to);

  const handleSelect = (option: TripOption) => {
    navigate(`/vas/${type}/details/${option.id}?${searchParams.toString()}`);
  };

  return (
    <div className="screen">
      <ScreenHeader title="Search results" backTo={backTo} />
      <div className="screen-content">
        <div className="results-summary card">
          <p className="results-route">
            {from} <span aria-hidden="true">→</span> {to}
          </p>
          {date && <p className="results-date">{formatLongDate(date)}</p>}
        </div>

        {isLoading && <LoadingState label="Looking for the best trips…" />}

        {!isLoading && results.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No trips found"
            description={`We couldn't find any trips from ${from} to ${to} on this route. Try a different city or check the spelling.`}
            action={
              <button type="button" className="secondary-button" onClick={() => navigate(backTo)}>
                Edit search
              </button>
            }
          />
        )}

        {!isLoading && results.length > 0 && (
          <div className="results-list">
            {results.map((option) => (
              <button key={option.id} type="button" className="card result-card" onClick={() => handleSelect(option)}>
                <div className="result-card-top">
                  <span className="result-card-operator">{option.operator}</span>
                  <span className="badge badge-success">{option.seatsAvailable} seats left</span>
                </div>
                <div className="result-card-times">
                  <div>
                    <p className="result-card-time">{option.departure}</p>
                    <p className="result-card-place">{option.from}</p>
                  </div>
                  <div className="result-card-duration">
                    <span className="result-card-line" aria-hidden="true" />
                    <span>{option.duration}</span>
                  </div>
                  <div>
                    <p className="result-card-time">{option.arrival}</p>
                    <p className="result-card-place">{option.to}</p>
                  </div>
                </div>
                <div className="result-card-footer">
                  <span>Price</span>
                  <span className="result-card-price">R {option.price.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
