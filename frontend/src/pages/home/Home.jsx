import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, ArrowRight, Shield, Zap, Globe, BarChart3,
  ArrowLeftRight, Lock
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Transfers',
    desc: 'Send money between accounts with atomic, ledger-backed transactions.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    desc: 'JWT authentication, bcrypt hashing, and idempotency keys protect every transaction.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Monitor your balance, transaction history, and account health in one place.',
  },
  {
    icon: Globe,
    title: 'Multi-Account Support',
    desc: 'Create and manage multiple financial accounts under a single profile.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Ledger-Based System',
    desc: 'Every debit and credit is immutably recorded. Full auditability guaranteed.',
  },
  {
    icon: Lock,
    title: 'Role-Based Access',
    desc: 'Separate permissions for users and system operators — no overlap.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Public Navbar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-accent" />
            </div>
            <span className="text-lg font-bold text-primary">LedgerX</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="accent" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs font-medium text-text-muted">
                Ledger-based Fintech Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-primary leading-tight tracking-tight mb-6">
              Modern Finance.
              <br />
              <span className="text-accent">Ledger Precision.</span>
            </h1>

            <p className="text-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
              LedgerX is a secure, scalable digital wallet platform with atomic transactions,
              real-time balance tracking, and enterprise-grade reliability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button variant="accent" size="lg" icon={ArrowRight} iconPosition="right">
                  Open Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10"
          >
            {[
              { label: 'Atomic Transactions', value: '100%' },
              { label: 'Uptime SLA', value: '99.9%' },
              { label: 'Avg Processing Time', value: '<40s' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary mb-3">
              Built for reliability
            </h2>
            <p className="text-text-muted max-w-lg mx-auto">
              Every feature is designed for financial-grade precision and security.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={item}
                className="bg-white border border-border rounded-2xl p-6 shadow-card"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-400 mb-8">
            Create your LedgerX account in seconds. No credit card required.
          </p>
          <Link to="/register">
            <Button variant="accent" size="lg" icon={ArrowRight} iconPosition="right">
              Create Free Account
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
