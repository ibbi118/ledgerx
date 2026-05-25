import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import Table from '../ui/Table';
import StatusBadge from '../ui/StatusBadge';
import { formatDateTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'COMPLETED', 'FAILED', 'REVERSED'];

/**
 * resolveId — safely extracts a string ID from a field that may be either:
 *   - a plain string:  "64f3a2b1c9e8d7f600000001"
 *   - a populated obj: { _id: "64f3a2b1c9e8d7f600000001", status: "ACTIVE", ... }
 */
const resolveId = (val) => {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val._id?.toString() ?? null;
  return null;
};

const TransactionTable = ({ transactions, loading }) => {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const fromId = resolveId(t.fromAccount) ?? '';
      const toId   = resolveId(t.toAccount)   ?? '';
      const txId   = t._id ?? '';

      const matchSearch =
        !search ||
        txId.toLowerCase().includes(search.toLowerCase())   ||
        fromId.toLowerCase().includes(search.toLowerCase()) ||
        toId.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, search, statusFilter]);

  const columns = [
    {
      key: '_id',
      label: 'Transaction ID',
      render: (val) => (
        <span className="font-mono text-xs text-text-muted">
          {val ? `···${val.toString().slice(-10)}` : '—'}
        </span>
      ),
    },
    {
      key: 'fromAccount',
      label: 'From',
      render: (val) => {
        const id = resolveId(val);
        return (
          <span className="font-mono text-xs">
            {id ? `···${id.slice(-8).toUpperCase()}` : <span className="text-text-muted italic">System</span>}
          </span>
        );
      },
    },
    {
      key: 'toAccount',
      label: 'To',
      render: (val) => {
        const id = resolveId(val);
        return (
          <span className="font-mono text-xs">
            {id ? `···${id.slice(-8).toUpperCase()}` : '—'}
          </span>
        );
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (val) => (
        <span className="font-semibold text-primary">{formatCurrency(val)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (val) => (
        <span className="text-text-muted text-xs">{formatDateTime(val)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by ID or account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-text-muted flex-shrink-0" />
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted hover:text-primary border border-border'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && (
        <p className="text-xs text-text-muted">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No transactions found. Create one to get started."
      />
    </div>
  );
};

export default TransactionTable;
