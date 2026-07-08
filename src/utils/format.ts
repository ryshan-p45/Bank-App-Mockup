/** Formats a mock monetary amount for display, e.g. R 1,234.50. */
export function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === 'ZAR' ? 'R' : currency;
  return `${symbol} ${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Formats an ISO date string (2026-07-06) as a short display date, e.g. 6 Jul. */
export function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

/** Formats an ISO date string as a longer display date, e.g. 6 July 2026. */
export function formatLongDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}
