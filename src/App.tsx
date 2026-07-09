import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PhoneFrame from './components/PhoneFrame/PhoneFrame';
import TabLayout from './components/TabLayout';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import VasHubScreen from './screens/VasHubScreen';
import TicketSearchScreen from './screens/TicketSearchScreen';
import TicketResultsScreen from './screens/TicketResultsScreen';
import TicketDetailsScreen from './screens/TicketDetailsScreen';
import PaymentScreen from './screens/PaymentScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ProfileScreen from './screens/ProfileScreen';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PhoneFrame>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<LoginScreen />} />

              <Route element={<RequireAuth />}>
                <Route element={<TabLayout />}>
                  <Route path="/dashboard" element={<DashboardScreen />} />
                  <Route path="/vas" element={<VasHubScreen />} />
                  <Route path="/transactions" element={<TransactionsScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                </Route>

                <Route path="/vas/:type/search" element={<TicketSearchScreen />} />
                <Route path="/vas/:type/results" element={<TicketResultsScreen />} />
                <Route path="/vas/:type/details/:optionId" element={<TicketDetailsScreen />} />
                <Route path="/vas/:type/payment/:optionId" element={<PaymentScreen />} />
                <Route path="/vas/:type/confirmation" element={<ConfirmationScreen />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </PhoneFrame>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
