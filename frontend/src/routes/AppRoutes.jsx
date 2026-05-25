import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Public pages
import Home from '../pages/home/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';

// Auth-protected pages
import Dashboard from '../pages/dashboard/Dashboard';
import Accounts from '../pages/accounts/Accounts';
import CreateTransaction from '../pages/transactions/CreateTransaction';
import TransactionHistory from '../pages/transactions/TransactionHistory';
import SystemFunding from '../pages/system/SystemFunding';
import Profile from '../pages/profile/Profile';

// Layout + guards
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

/**
 * AppRoutes — central routing configuration.
 *
 * Public:      /  /login  /register
 * Protected:   /dashboard  /accounts  /transactions/*  /profile
 * System only: /system/funding
 */
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* ─── Public Routes ─────────────────────────────────────────────── */}
      <Route path="/" element={<Home />} />

      {/* Redirect logged-in users away from auth pages */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* ─── Protected Dashboard Shell ─────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions/create" element={<CreateTransaction />} />
        <Route path="/transactions/history" element={<TransactionHistory />} />
        <Route path="/profile" element={<Profile />} />

        {/* System operator only */}
        <Route
          path="/system/funding"
          element={
            <ProtectedRoute systemOnly>
              <SystemFunding />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ─── Fallback ──────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
