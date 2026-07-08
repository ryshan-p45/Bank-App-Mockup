import { Link, useNavigate } from 'react-router-dom';
import account from '../data/account.json';
import transactions from '../data/transactions.json';
import user from '../data/user.json';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatShortDate } from '../utils/format';
import type { Transaction } from '../types';
import './DashboardScreen.css';

const QUICK_ACTIONS = [
  { key: 'tickets', label: 'Buy Tickets', icon: '🎫', wired: true },
  { key: 'send', label: 'Send Money', icon: '💸', wired: false },
  { key: 'airtime', label: 'Airtime & Data', icon: '📶', wired: false },
  { key: 'bills', label: 'Pay Bills', icon: '🧾', wired: false },
] as const;

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const recentTransactions = (transactions as Transaction[]).slice(0, 4);

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[number]) => {
    if (action.key === 'tickets') {
      navigate('/vas');
      return;
    }
    showToast('This is a mockup — only bus & train ticket purchases are wired up here.');
  };

  return (
    <>
        <div className="dashboard-topbar">
          <div>
            <p className="dashboard-greeting">Good day,</p>
            <h1 className="dashboard-name">{user.firstName}</h1>
          </div>
          <Link to="/profile" className="dashboard-avatar" aria-label="Open profile">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </Link>
        </div>

        <div className="card balance-card">
          <p className="balance-card-label">{account.accountType}</p>
          <p className="balance-card-amount">{formatCurrency(account.balance, account.currency)}</p>
          <p className="balance-card-available">
            Available: {formatCurrency(account.availableBalance, account.currency)}
          </p>
          <p className="balance-card-account">Account **** {user.accountNumber.slice(-4)}</p>
        </div>

        <section>
          <h2 className="section-title">Quick actions</h2>
          <div className="quick-actions-grid">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.key}
                type="button"
                className="quick-action"
                onClick={() => handleQuickAction(action)}
              >
                <span className="quick-action-icon" aria-hidden="true">
                  {action.icon}
                </span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="section-header">
            <h2 className="section-title">Recent activity</h2>
            <Link to="/transactions" className="section-link">
              See all
            </Link>
          </div>
          <div className="card transaction-list">
            {recentTransactions.map((transaction) => (
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
        </section>
    </>
  );
}
