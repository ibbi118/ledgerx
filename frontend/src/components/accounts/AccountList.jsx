import AccountCard from './AccountCard';
import { CardSkeleton } from '../ui/Loader';
import { Wallet } from 'lucide-react';

/**
 * AccountList — renders a grid of AccountCards with loading/empty states.
 */
const AccountList = ({ accounts, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (!accounts?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
          <Wallet size={24} className="text-text-muted" />
        </div>
        <h3 className="text-base font-semibold text-primary mb-1">No accounts yet</h3>
        <p className="text-sm text-text-muted">Create your first account to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <AccountCard key={account._id} account={account} />
      ))}
    </div>
  );
};

export default AccountList;
