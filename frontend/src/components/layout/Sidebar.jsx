import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  History,
  Banknote,
  User,
  LogOut,
  X,
  TrendingUp,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/transactions/create', icon: ArrowLeftRight, label: 'Transfer' },
  { to: '/transactions/history', icon: History, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const SYSTEM_ITEMS = [
  { to: '/system/funding', icon: Banknote, label: 'System Funding' },
];

/**
 * Sidebar — app navigation with role-based links.
 * Collapsible on mobile via isOpen/onClose props.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, isSystemUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-accent text-primary shadow-sm'
            : 'text-gray-500 hover:bg-surface hover:text-primary'
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <TrendingUp size={16} className="text-accent" />
          </div>
          <span className="text-lg font-bold text-primary tracking-tight">LedgerX</span>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-surface text-text-muted"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {/* System-only section */}
        {isSystemUser && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3">
                System
              </p>
            </div>
            {SYSTEM_ITEMS.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-surface mb-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-accent flex items-center justify-center text-sm font-bold">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">{user?.username}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-border fixed left-0 top-0 bottom-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 md:hidden flex flex-col shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
