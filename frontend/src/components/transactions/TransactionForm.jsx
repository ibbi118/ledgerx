import { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, Clock } from 'lucide-react';
import { createTransaction } from '../../api/transaction.api';
import { getAccounts } from '../../api/account.api';
import { generateIdempotencyKey } from '../../utils/generateKey';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import toast from 'react-hot-toast';

/**
 * TransactionForm — send money between accounts.
 * Handles the ~40s processing time with a dedicated loading UI.
 */
const TransactionForm = ({ onSuccess }) => {
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey());
  const [elapsed, setElapsed] = useState(0);

  const [form, setForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
  });
  const [errors, setErrors] = useState({});

  // Load user's accounts
  useEffect(() => {
    (async () => {
      try {
        const data = await getAccounts();
        setAccounts(data.accounts || []);
      } catch {
        toast.error('Failed to load accounts');
      } finally {
        setAccountsLoading(false);
      }
    })();
  }, []);

  // Elapsed timer during processing
  useEffect(() => {
    let interval;
    if (processing) {
      setElapsed(0);
      interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [processing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fromAccount) newErrors.fromAccount = 'Select source account';
    if (!form.toAccount) newErrors.toAccount = 'Select destination account';
    if (form.fromAccount && form.toAccount && form.fromAccount === form.toAccount)
      newErrors.toAccount = 'Cannot transfer to the same account';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      newErrors.amount = 'Enter a valid amount greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || processing) return;

    setProcessing(true);
    try {
      const result = await createTransaction({
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        amount: Number(form.amount),
        idempotencyKey,
      });

      toast.success('Transaction submitted successfully!');
      // Reset form with a new idempotency key to prevent duplicate submissions
      setForm({ fromAccount: '', toAccount: '', amount: '' });
      setIdempotencyKey(generateIdempotencyKey());
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.message || 'Transaction failed. Please try again.';
      toast.error(msg);
    } finally {
      setProcessing(false);
      setElapsed(0);
    }
  };

  return (
    <Card>
      {/* Processing overlay */}
      {processing && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Processing Transaction</p>
              <p className="text-xs text-yellow-600 mt-0.5 flex items-center gap-1">
                <Clock size={11} />
                {elapsed}s elapsed — This may take up to 40 seconds
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-yellow-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((elapsed / 40) * 100, 95)}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* From Account */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">
            From Account <span className="text-red-500">*</span>
          </label>
          <select
            name="fromAccount"
            value={form.fromAccount}
            onChange={handleChange}
            disabled={processing || accountsLoading}
            className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-primary
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
              disabled:bg-surface disabled:cursor-not-allowed
              ${errors.fromAccount ? 'border-red-400' : 'border-border'}`}
          >
            <option value="">Select source account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc._id.slice(-8).toUpperCase()} — {acc.status}
              </option>
            ))}
          </select>
          {errors.fromAccount && (
            <p className="text-xs text-red-500 mt-1">{errors.fromAccount}</p>
          )}
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
            <ArrowRight size={16} className="text-text-muted" />
          </div>
        </div>

        {/* To Account */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">
            To Account <span className="text-red-500">*</span>
          </label>
          <Input
            name="toAccount"
            value={form.toAccount}
            onChange={handleChange}
            placeholder="Paste destination account ID"
            disabled={processing}
            error={errors.toAccount}
          />
        </div>

        {/* Amount */}
        <Input
          label="Amount (PKR)"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="0"
          disabled={processing}
          error={errors.amount}
          min="1"
          required
        />

        {/* Idempotency Key */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">
            Idempotency Key
          </label>
          <div className="flex gap-2">
            <input
              value={idempotencyKey}
              readOnly
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-mono text-text-muted"
            />
            <button
              type="button"
              onClick={() => setIdempotencyKey(generateIdempotencyKey())}
              disabled={processing}
              className="px-3 py-2.5 rounded-xl border border-border bg-white hover:bg-surface transition-colors text-text-muted disabled:opacity-50"
              title="Generate new key"
            >
              <RefreshCw size={15} />
            </button>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Auto-generated key prevents duplicate transactions.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={processing}
          disabled={processing}
          size="lg"
        >
          {processing ? 'Processing...' : 'Send Transfer'}
        </Button>
      </form>
    </Card>
  );
};

export default TransactionForm;
