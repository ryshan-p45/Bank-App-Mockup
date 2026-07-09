import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ScreenHeader from '../components/ScreenHeader/ScreenHeader';
import { getStationsForType, isTransportType } from '../utils/vas';
import './TicketSearchScreen.css';

const TRANSPORT_LABEL = { bus: 'Bus Tickets', train: 'Train Tickets' } as const;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TicketSearchScreen() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [from, setFrom] = useState(searchParams.get('from') ?? '');
  const [to, setTo] = useState(searchParams.get('to') ?? '');
  const [date, setDate] = useState(searchParams.get('date') ?? todayIso());
  const [error, setError] = useState('');

  if (!isTransportType(type)) {
    return <Navigate to="/vas" replace />;
  }

  const stations = getStationsForType(type);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!from.trim() || !to.trim()) {
      setError('Enter where you’re travelling from and to.');
      return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setError('Departure and destination can’t be the same place.');
      return;
    }

    setError('');
    const query = new URLSearchParams({ from: from.trim(), to: to.trim(), date }).toString();
    navigate(`/vas/${type}/results?${query}`);
  };

  return (
    <div className="screen">
      <ScreenHeader title={TRANSPORT_LABEL[type]} backTo="/vas" />
      <div className="screen-content">
        <p className="search-intro">Search for available trips and see mock pricing instantly.</p>

        <form className="search-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="from">From</label>
            <input
              id="from"
              list="station-options"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder="Departure city"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="to">To</label>
            <input
              id="to"
              list="station-options"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="Destination city"
              autoComplete="off"
            />
          </div>
          <datalist id="station-options">
            {stations.map((station) => (
              <option key={station} value={station} />
            ))}
          </datalist>
          <div className="field">
            <label htmlFor="date">Travel date</label>
            <input
              id="date"
              type="date"
              min={todayIso()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="primary-button">
            Search trips
          </button>
        </form>

        <div className="search-suggestions">
          <p className="search-suggestions-title">Popular stations</p>
          <div className="search-suggestions-chips">
            {stations.slice(0, 6).map((station) => (
              <span key={station} className="badge badge-neutral">
                {station}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
