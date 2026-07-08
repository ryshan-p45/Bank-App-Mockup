import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginScreen.css';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Enter a username and password to continue.');
      return;
    }

    setError('');
    login(username.trim());
    navigate('/dashboard');
  };

  return (
    <div className="screen login-screen">
      <div className="login-content">
        <div className="login-brand">
          <div className="login-logo" aria-hidden="true">
            ☀
          </div>
          <h1>Sunbank</h1>
          <p>Log in to manage your money and buy tickets on the go.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. thandiwe.mokoena"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="primary-button">
            Log in
          </button>
        </form>

        <p className="login-disclaimer">
          This is a design mockup. Any username and password will work — no real account data is used.
        </p>
      </div>
    </div>
  );
}
