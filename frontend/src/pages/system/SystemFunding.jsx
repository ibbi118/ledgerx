import { useState, useEffect } from 'react';
import { Banknote, RefreshCw, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { systemInitialFund } from '../../api/transaction.api';
import { generateIdempotencyKey } from '../../utils/generateKey';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const SystemFunding = () => {
  const [processing, setProcessing]       = useState(false);
  const [elapsed, setElapsed]             = useState(0);
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey());
  const [toAccount, setToAccount]         = useState('');
  const [amount, setAmount]               = useState('');
  const [errors, setErrors]               = useState({});
  const [history, setHistory]             = useState([]);

  // Elapsed timer while waiting for backend
  useEffect(() => {
    let interval;
    if (processing) {
      setElapsed(0);
      interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [processing]);

  const validate = () => {
    const errs = {};
    if (!toAccount.trim())
      errs.toAccount = 'Account ID is required.';
    else if (!/^[a-fA-F0-9]{24}$/.test(toAccount.trim()))
      errs.toAccount = 'Must be a 24-character hex MongoDB ObjectId.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      errs.amount = 'Enter a valid amount greater than 0.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || processing) return;

    setProcessing(true);
    try {
      await systemInitialFund({
        toAccount: toAccount.trim(),
        amount: Number(amount),
        idempotencyKey,
      });

      toast.success(`PKR ${Number(amount).toLocaleString()} funded successfully!`);
      setHistory((prev) => [
        { id: toAccount.trim(), amount: Number(amount), time: new Date() },
        ...prev,
      ]);
      setToAccount('');
      setAmount('');
      setIdempotencyKey(generateIdempotencyKey());
      setErrors({});
    } catch (err) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message;

      if (status === 404) {
        // Account not found — mark the field error
        setErrors({ toAccount: 'Account not found. Verify the ID with the user.' });
        toast.error('Account not found.');
      } else {
        toast.error(msg || 'Funding failed. Please try again.');
      }
    } finally {
      setProcessing(false);
      setElapsed(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Banknote size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">System Funding</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Inject initial funds into any user account
          </p>
        </div>
      </div>

      {/* System role badge */}
      <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
        <ShieldCheck size={16} className="text-primary flex-shrink-0" />
        <p className="text-sm text-primary font-medium">
          System operator access — all actions are permanently ledger-recorded.
        </p>
      </div>

      {/* Processing bar */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Processing Funding Request</p>
                <p className="text-xs text-yellow-600 mt-0.5 flex items-center gap-1">
                  <Clock size={11} />
                  {elapsed}s elapsed — Please wait up to 40 seconds
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-yellow-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((elapsed / 40) * 100, 95)}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to use */}
      <Card className="bg-surface border-0">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          How to fund an account
        </h4>
        <ol className="space-y-2 text-sm text-text-muted">
          {[
            'Ask the user to copy their Account ID from their Accounts page.',
            'Paste the Account ID below and enter the funding amount.',
            'Click Fund Account — the ledger will credit the balance.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Account ID input — plain paste, no verify call */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              Target Account ID <span className="text-red-500">*</span>
              <span className="ml-2 text-xs font-normal text-text-muted">
                (paste from the user's Accounts page)
              </span>
            </label>
            <input
              value={toAccount}
              onChange={(e) => {
                setToAccount(e.target.value);
                setErrors((p) => ({ ...p, toAccount: '' }));
              }}
              placeholder="e.g. 64f3a2b1c9e8d7f600000001"
              disabled={processing}
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-mono
                placeholder:text-text-muted placeholder:font-sans
                focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                disabled:bg-surface disabled:cursor-not-allowed
                ${errors.toAccount ? 'border-red-400' : 'border-border'}`}
            />
            {errors.toAccount && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
                <AlertCircle size={12} /> {errors.toAccount}
              </p>
            )}
            <p className="text-xs text-text-muted mt-1">
              24-character hex string. The user can copy it from their account card.
            </p>
          </div>

          {/* Amount */}
          <Input
            label="Funding Amount (PKR)"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors((p) => ({ ...p, amount: '' }));
            }}
            placeholder="0"
            disabled={processing}
            error={errors.amount}
            min="1"
            required
          />

          {/* Live summary */}
          <AnimatePresence>
            {toAccount.trim().length === 24 && amount && Number(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-surface rounded-xl border border-border text-sm space-y-1.5">
                  <p className="font-semibold text-primary text-xs uppercase tracking-wide mb-2">
                    Funding Summary
                  </p>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Account</span>
                    <span className="font-mono text-xs text-primary">
                      ···{toAccount.trim().slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1.5">
                    <span className="text-text-muted">Amount to credit</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(Number(amount))}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idempotency key */}
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
                title="Regenerate key"
              >
                <RefreshCw size={15} />
              </button>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Auto-generated — prevents duplicate funding on retry.
            </p>
          </div>

          <Button
            type="submit"
            variant="accent"
            fullWidth
            size="lg"
            loading={processing}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Fund ${amount && Number(amount) > 0 ? formatCurrency(Number(amount)) : 'Account'}`}
          </Button>
        </form>
      </Card>

      {/* Session history */}
      {history.length > 0 && (
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-border">
            <h4 className="text-sm font-semibold text-primary">
              Funded This Session{' '}
              <span className="text-text-muted font-normal">({history.length})</span>
            </h4>
          </div>
          <div className="divide-y divide-border">
            {history.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-primary truncate">{item.id}</p>
                  <p className="text-xs text-text-muted">{item.time.toLocaleTimeString()}</p>
                </div>
                <span className="text-sm font-semibold text-primary flex-shrink-0">
                  +{formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Warning */}
      <Card className="border-orange-100 bg-orange-50">
        <h4 className="text-sm font-semibold text-orange-800 mb-2">⚠️ Important Notes</h4>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Only for <strong>initial</strong> account funding — not regular transfers.</li>
          <li>• Always confirm the Account ID with the user before submitting.</li>
          <li>• All entries are immutably recorded in the ledger.</li>
          <li>• Do not fund the same account twice without coordination.</li>
        </ul>
      </Card>
    </div>
  );
};

export default SystemFunding;
