import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
          <TrendingUp size={16} className="text-accent" />
        </div>
        <span className="text-lg font-bold text-primary">LedgerX</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        {/* 404 Display */}
        <div className="text-8xl font-extrabold text-primary mb-2 tracking-tighter leading-none">
          404
        </div>
        <div className="w-12 h-1 bg-accent rounded-full mx-auto mb-6" />

        <h1 className="text-xl font-bold text-primary mb-3">Page not found</h1>
        <p className="text-sm text-text-muted mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button variant="accent" size="md" icon={ArrowLeft} iconPosition="left">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" size="md">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
