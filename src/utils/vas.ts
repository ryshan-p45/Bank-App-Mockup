import busRoutes from '../data/busRoutes.json';
import trainRoutes from '../data/trainRoutes.json';
import type { TransportType, TripOption } from '../types';

const ROUTES_BY_TYPE: Record<TransportType, TripOption[]> = {
  bus: busRoutes as TripOption[],
  train: trainRoutes as TripOption[],
};

export function getRoutesForType(type: TransportType): TripOption[] {
  return ROUTES_BY_TYPE[type];
}

/** All distinct departure/arrival cities for a transport type, used as search suggestions. */
export function getStationsForType(type: TransportType): string[] {
  const stations = getRoutesForType(type).flatMap((route) => [route.from, route.to]);
  return Array.from(new Set(stations)).sort();
}

/** Matches routes where "from" and "to" both contain the given text, regardless of date. */
export function searchTripsByRoute(type: TransportType, from: string, to: string): TripOption[] {
  const normalisedFrom = from.trim().toLowerCase();
  const normalisedTo = to.trim().toLowerCase();

  return getRoutesForType(type)
    .filter(
      (route) =>
        route.from.toLowerCase().includes(normalisedFrom) &&
        route.to.toLowerCase().includes(normalisedTo),
    )
    .sort((a, b) => a.departure.localeCompare(b.departure));
}

/** Narrows a list of trips down to the ones that run on the given ISO date. */
export function filterTripsByDate(trips: TripOption[], isoDate: string): TripOption[] {
  if (!isoDate) {
    return trips;
  }
  const dayOfWeek = new Date(`${isoDate}T00:00:00`).getDay();
  return trips.filter((trip) => trip.daysOfWeek.includes(dayOfWeek));
}

/** Mock search: matches routes by city, then narrows to trips that actually run on the given date. */
export function searchTrips(type: TransportType, from: string, to: string, isoDate: string): TripOption[] {
  return filterTripsByDate(searchTripsByRoute(type, from, to), isoDate);
}

export function findTripById(type: TransportType, id: string): TripOption | undefined {
  return getRoutesForType(type).find((route) => route.id === id);
}

export function isTransportType(value: string | undefined): value is TransportType {
  return value === 'bus' || value === 'train';
}
