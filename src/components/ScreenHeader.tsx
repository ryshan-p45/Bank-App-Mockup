import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import './ScreenHeader.css';

interface ScreenHeaderProps {
  title: string;
  /** Shows a back button that navigates to this path, or calls history back when omitted. */
  backTo?: string;
  /** Optional element rendered on the right, e.g. a cancel link for a multi-step flow. */
  action?: ReactNode;
}

export default function ScreenHeader({ title, backTo, action }: ScreenHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="screen-header">
      <button type="button" className="screen-header-back" onClick={handleBack} aria-label="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="screen-header-title">{title}</h1>
      <div className="screen-header-action">{action}</div>
    </header>
  );
}
