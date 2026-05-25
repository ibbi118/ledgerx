import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

/**
 * App — root component.
 * Wraps everything in BrowserRouter + AuthProvider.
 * Toaster is mounted globally for notifications.
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* ─── Global Toast Notifications ──────────────────────────── */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#222222',
              color: '#ffffff',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              padding: '12px 16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            },
            success: {
              iconTheme: { primary: '#89E900', secondary: '#222222' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />

        {/* ─── App Routes ───────────────────────────────────────────── */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
