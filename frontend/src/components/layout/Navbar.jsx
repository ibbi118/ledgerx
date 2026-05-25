import { useState } from 'react';
import { Menu, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Navbar — top bar inside the authenticated dashboard layout.
 * Shows breadcrumb area, user dropdown, and mobile menu toggle.
 */
const Navbar = ({ onMenuToggle, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors text-text-muted"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-primary">{title}</h1>
      </div>

      {/* Right: user dropdown */}
      <div className="flex items-center gap-2">
        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-primary text-accent flex items-center justify-center text-xs font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-primary max-w-[120px] truncate">
              {user?.username}
            </span>
            <ChevronDown size={14} className="text-text-muted" />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-12 w-48 bg-white border border-border rounded-xl shadow-dropdown z-20 py-1 overflow-hidden animate-fade-in">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-primary truncate">{user?.username}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-surface transition-colors"
                >
                  <User size={15} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
