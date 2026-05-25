import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowLeftRight, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAccounts, getBalance } from '../../api/account.api';
import { getTransactions } from '../../api/transaction.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/formatDate';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [accData, txData] = await Promise.all([
        getAccounts(),
        getTransactions(),
      ]);

      const accs = accData.accounts || [];
      setAccounts(accs);
      setTransactions(txData.transactions || []);

      // Fetch balances for all accounts and sum them
      const balances = await Promise.all(
        accs.map((acc) =>
          getBalance(acc._id).then((r) => r.balance || 0).catch(() => 0)
        )
      );
      setTotalBalance(balances.reduce((sum, b) => sum + b, 0));
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const recentTransactions = transactions.slice(0, 5);
  const completedCount = transactions.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-bold text-primary">
          Good morning, {user?.username} 👋
        </h2>
        <p className="text-sm text-text-muted mt-0.5">Here's your financial overview.</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Total Balance */}
          <motion.div variants={item}>
            <Card className="border-l-4 border-l-accent">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Total Balance
                  </p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {formatCurrency(totalBalance)}
                  </p>
                  <p className="text-xs text-text-muted mt-1">Across all accounts</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <TrendingUp size={20} className="text-accent" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Accounts */}
          <motion.div variants={item}>
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Accounts
                  </p>
                  <p className="text-2xl font-bold text-primary mt-1">{accounts.length}</p>
                  <p className="text-xs text-text-muted mt-1">Active accounts</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <Wallet size={20} className="text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Transactions */}
          <motion.div variants={item}>
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Transactions
                  </p>
                  <p className="text-2xl font-bold text-primary mt-1">{transactions.length}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {completedCount} completed
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <ArrowLeftRight size={20} className="text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Link to="/accounts">
          <Button variant="accent" size="sm" icon={Plus}>
            New Account
          </Button>
        </Link>
        <Link to="/transactions/create">
          <Button variant="secondary" size="sm" icon={ArrowLeftRight}>
            Send Money
          </Button>
        </Link>
      </div>

      {/* Recent Transactions + Accounts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Transactions */}
        <Card padding={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-primary">Recent Transactions</h3>
            <Link
              to="/transactions/history"
              className="text-xs text-text-muted hover:text-primary flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="p-4 space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-2">
                  <div className="skeleton w-9 h-9 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3.5 w-32 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                  <div className="skeleton h-4 w-20 rounded" />
                </div>
              ))
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <ArrowLeftRight size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">
                      Transfer
                    </p>
                    <p className="text-xs text-text-muted">{timeAgo(tx.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-primary">
                      {formatCurrency(tx.amount)}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-text-muted">
                No transactions yet.{' '}
                <Link to="/transactions/create" className="text-primary hover:underline">
                  Make one
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Accounts Overview */}
        <Card padding={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-primary">Your Accounts</h3>
            <Link
              to="/accounts"
              className="text-xs text-text-muted hover:text-primary flex items-center gap-1 transition-colors"
            >
              Manage <ArrowRight size={12} />
            </Link>
          </div>

          <div className="p-4 space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-2">
                  <div className="skeleton w-9 h-9 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3.5 w-28 rounded" />
                    <div className="skeleton h-3 w-20 rounded" />
                  </div>
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              ))
            ) : accounts.length > 0 ? (
              accounts.map((acc) => (
                <div
                  key={acc._id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <Wallet size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary font-mono">
                      ···{acc._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-text-muted">{acc.currency || 'PKR'}</p>
                  </div>
                  <StatusBadge status={acc.status} />
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-text-muted">
                No accounts.{' '}
                <Link to="/accounts" className="text-primary hover:underline">
                  Create one
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
