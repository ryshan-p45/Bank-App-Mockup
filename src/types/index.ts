export interface BankUser {
  firstName: string;
  lastName: string;
  username: string;
  accountNumber: string;
  cardLast4: string;
}

export interface BankAccount {
  accountType: string;
  balance: number;
  availableBalance: number;
  currency: string;
}

export type TransactionType = 'debit' | 'credit';

export interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
}

export type TransportType = 'bus' | 'train';

export interface TripOption {
  id: string;
  operator: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  /** Days this trip runs, as JS Date.getDay() values: 0 = Sunday .. 6 = Saturday. */
  daysOfWeek: number[];
}

export interface TicketSearchParams {
  from: string;
  to: string;
  date: string;
}

export interface PurchasedTicket {
  reference: string;
  transportType: TransportType;
  option: TripOption;
  passengerName: string;
  searchDate: string;
}
