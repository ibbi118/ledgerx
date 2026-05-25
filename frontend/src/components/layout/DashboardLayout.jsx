import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Map path segments to human-readable titles
const TITLES = {
  dashboard: 'Dashboard',
  accounts: 'Accounts',
  create: 'Create Transfer',
  history: 'Transaction History',
  funding: 'System Funding',
  profile: 'Profile',
  transactions: 'Transactions',
  system: 'System',
};

const getTitle = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  return TITLES[last] || 'LedgerX';
};

/**
 * DashboardLayout — shell for all authenticated pages.
 * Handles sidebar open/close state.
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          title={title}
        />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
