import type { ReactNode } from 'react';
import './PhoneFrame.css';

/**
 * Frames the app to look like a mobile banking app running on a phone,
 * centred on the page as described in the README design brief.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-backdrop">
      <div className="phone-brand">
        <span className="phone-brand-mark">Delusive Bank</span>
        <p>A frontend mockup — nothing here connects to a real bank.</p>
      </div>
      <div className="phone-frame">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}
