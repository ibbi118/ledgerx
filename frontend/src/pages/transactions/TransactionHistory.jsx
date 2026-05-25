import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTransactions } from '../../api/transaction.api';
import TransactionTable from '../../components/transactions/TransactionTable';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import toast from 'react-hot-toast';

const STATUSES = ['COMPLETED', 'PENDING', 'FAILED', 'REVERSED'];

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [rawResponse, setRawResponse]   = useState(null); // debug

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();

      // ── Debug: log the raw API response to the console ──────────────────
      // Open DevTools → Console to see exactly what the backend returns.
      // This tells us: field names, whether fromAccount/toAccount are
      // strings or populated objects, and which key holds the array.
      console.group('📦 GET /transaction/get — raw response');
      console.log('Full response:', data);
      console.log('Keys:', Object.keys(data));

      // Try to find the transactions array regardless of key name
      const txArray =
        data.transactions ??  // { transactions: [] }
        data.data          ??  // { data: [] }
        data.result        ??  // { result: [] }
        (Array.isArray(data) ? data : []);

      console.log('Resolved array length:', txArray.length);
      if (txArray.length > 0) {
        console.log('First transaction shape:', txArray[0]);
        console.log('fromAccount type:', typeof txArray[0].fromAccount, txArray[0].fromAccount);
        console.log('toAccount type:',   typeof txArray[0].toAccount,   txArray[0].toAccount);
      }
      console.groupEnd();
      // ── End debug ────────────────────────────────────────────────────────

      setRawResponse(data);
      setTransactions(txArray);
    } catch (err) {
      console.error('Transaction fetch error:', err.response ?? err);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const summary = STATUSES.reduce((acc, s) => {
    acc[s] = transactions.filter((t) => t.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-primary">Transaction History</h2>
          <p className="text-sm text-text-muted mt-0.5">All your transactions in one place</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={loadTransactions}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {STATUSES.map((status) => (
            <Card key={status} className="text-center py-4 px-3">
              <p className="text-2xl font-bold text-primary">{summary[status]}</p>
              <div className="flex justify-center mt-2">
                <StatusBadge status={status} />
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Table */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-primary">
            All Transactions
            {!loading && (
              <span className="ml-2 text-text-muted font-normal">
                ({transactions.length})
              </span>
            )}
          </h3>
        </div>
        <div className="p-4">
          <TransactionTable transactions={transactions} loading={loading} />
        </div>
      </Card>
    </div>
  );
};

export default TransactionHistory;
