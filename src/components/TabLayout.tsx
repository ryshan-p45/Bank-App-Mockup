import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

/** Shared shell for the four primary tabs: scrollable content above a fixed bottom nav. */
export default function TabLayout() {
  return (
    <div className="screen">
      <div className="screen-content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
