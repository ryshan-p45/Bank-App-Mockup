import { useNavigate } from 'react-router-dom';
import user from '../data/user.json';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProfileScreen.css';

const SETTINGS_ITEMS = [
  { key: 'personal', label: 'Personal details', icon: '👤' },
  { key: 'security', label: 'Password & security', icon: '🔒' },
  { key: 'notifications', label: 'Notification preferences', icon: '🔔' },
  { key: 'help', label: 'Help & support', icon: '❓' },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar" aria-hidden="true">
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </div>
        <h1 className="profile-name">
          {user.firstName} {user.lastName}
        </h1>
        <p className="profile-account">Account **** {user.accountNumber.slice(-4)}</p>
      </div>

      <div className="card profile-settings">
        {SETTINGS_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className="profile-settings-item"
            onClick={() => showToast('This is a mockup — settings screens aren’t wired up here.')}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            <span className="profile-settings-chevron" aria-hidden="true">
              ›
            </span>
          </button>
        ))}
      </div>

      <button type="button" className="secondary-button" onClick={handleLogout}>
        Log out
      </button>
    </>
  );
}
