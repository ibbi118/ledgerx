import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Footer — minimal footer for public (landing/auth) pages.
 */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp size={14} className="text-accent" />
            </div>
            <span className="text-base font-bold text-primary">LedgerX</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Register</Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            © {year} LedgerX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
