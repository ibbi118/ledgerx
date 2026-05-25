import { useState, useEffect } from 'react';
import { Wallet, RefreshCw, Copy, Check } from 'lucide-react';
import { getBalance } from '../../api/account.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import StatusBadge from '../ui/StatusBadge';
import Card from '../ui/Card';
import { Spinner } from '../ui/Loader';
import toast from 'react-hot-toast';

/**
 * AccountCard — displays a single account with live balance fetch.
 */
const AccountCard = ({ account }) => {
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, [account._id]);

  const fetchBalance = async () => {
    setBalanceLoading(true);
    try {
      const data = await getBalance(account._id);
      setBalance(data.balance);
    } catch {
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(account._id);
    setCopied(true);
    toast.success('Account ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
          <Wallet size={20} className="text-primary" />
        </div>
        <StatusBadge status={account.status} />
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-xs text-text-muted font-medium mb-1">Balance</p>
        {balanceLoading ? (
          <div className="skeleton h-7 w-32 rounded" />
        ) : (
          <p className="text-2xl font-bold text-primary">
            {balance !== null ? formatCurrency(balance) : '—'}
          </p>
        )}
        <p className="text-xs text-text-muted mt-1">{account.currency || 'PKR'}</p>
      </div>

      {/* Account ID */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <p className="text-xs text-text-muted font-mono truncate flex-1">
          {account._id}
        </p>
        <button onClick={copyId} className="text-text-muted hover:text-primary transition-colors">
          {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
        </button>
        <button
          onClick={fetchBalance}
          disabled={balanceLoading}
          className="text-text-muted hover:text-primary transition-colors"
        >
          <RefreshCw size={14} className={balanceLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {account.createdAt && (
        <p className="text-xs text-text-muted mt-2">
          Created {formatDate(account.createdAt)}
        </p>
      )}
    </Card>
  );
};

export default AccountCard;
