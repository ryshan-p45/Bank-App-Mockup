import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const TABS = [
  {
    to: '/dashboard',
    label: 'Home',
    icon: (
      <path d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    to: '/vas',
    label: 'Pay',
    icon: <path d="M3 9h18M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 9h4" />,
  },
  {
    to: '/transactions',
    label: 'History',
    icon: <path d="M4 4v6h6M20 20v-6h-6M4.5 15a8 8 0 0 0 14.9 2.5M19.5 9a8 8 0 0 0-14.9-2.5" />,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
  },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {tab.icon}
          </svg>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
