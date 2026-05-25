import { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { createAccount, getAccounts } from '../../api/account.api';
import AccountList from '../../components/accounts/AccountList';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(data.accounts || []);
    } catch {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      await createAccount();
      toast.success('Account created successfully!');
      setConfirmOpen(false);
      await loadAccounts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account';
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary">Accounts</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Manage your financial accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={loadAccounts}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="accent"
            size="sm"
            icon={Plus}
            onClick={() => setConfirmOpen(true)}
          >
            New Account
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-6 text-sm text-text-muted"
        >
          <span>
            <strong className="text-primary font-semibold">{accounts.length}</strong> total accounts
          </span>
          <span>
            <strong className="text-primary font-semibold">
              {accounts.filter((a) => a.status === 'ACTIVE').length}
            </strong>{' '}
            active
          </span>
        </motion.div>
      )}

      {/* Account grid */}
      <AccountList accounts={accounts} loading={loading} />

      {/* Create Account Confirm Modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Create New Account"
      >
        <div className="space-y-5">
          <div className="p-4 bg-surface rounded-xl border border-border">
            <p className="text-sm text-primary font-medium mb-1">Account Details</p>
            <ul className="text-sm text-text-muted space-y-1">
              <li>• Currency: PKR (Pakistani Rupee)</li>
              <li>• Status: Active on creation</li>
              <li>• Starting balance: 0</li>
            </ul>
          </div>
          <p className="text-sm text-text-muted">
            A new PKR account will be created under your profile. You can fund it using
            system transfers or receive money from other accounts.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              fullWidth
              loading={creating}
              onClick={handleCreate}
            >
              Create Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Accounts;
