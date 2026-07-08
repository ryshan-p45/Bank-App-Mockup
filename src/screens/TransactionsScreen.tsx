import transactions from '../data/transactions.json';
import account from '../data/account.json';
import EmptyState from '../components/EmptyState';
import { formatCurrency, formatShortDate } from '../utils/format';
import type { Transaction } from '../types';
import './TransactionsScreen.css';

export default function TransactionsScreen() {
  const allTransactions = transactions as Transaction[];

  return (
    <>
      <h1 className="transactions-title">Transaction history</h1>

      {allTransactions.length === 0 ? (
        <EmptyState
          icon="🗒️"
          title="No transactions yet"
          description="Once you spend or receive money, your transactions will show up here."
        />
      ) : (
        <div className="card transaction-list">
          {allTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-row">
              <div>
                <p className="transaction-description">{transaction.description}</p>
                <p className="transaction-meta">
                  {transaction.category} · {formatShortDate(transaction.date)}
                </p>
              </div>
              <p className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'debit' ? '-' : '+'}
                {formatCurrency(transaction.amount, account.currency)}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
