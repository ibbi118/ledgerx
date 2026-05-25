import { useState } from 'react';
import { ArrowLeftRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import TransactionForm from '../../components/transactions/TransactionForm';
import Card from '../../components/ui/Card';

const CreateTransaction = () => {
  const [successCount, setSuccessCount] = useState(0);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary">Send Money</h2>
        <p className="text-sm text-text-muted mt-0.5">
          Transfer funds between accounts securely
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Transaction Processing Time</p>
          <p className="text-blue-600 mt-0.5">
            Transactions are processed atomically and may take up to 40 seconds to complete.
            Please do not close this page or submit again during processing.
          </p>
        </div>
      </div>

      {/* Success notice */}
      {successCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          Transaction submitted! View status in{' '}
          <Link to="/transactions/history" className="underline font-medium">
            Transaction History
          </Link>
        </div>
      )}

      {/* Form */}
      <TransactionForm onSuccess={() => setSuccessCount((c) => c + 1)} />

      {/* Help */}
      <Card>
        <h4 className="text-sm font-semibold text-primary mb-3">How it works</h4>
        <ol className="space-y-2 text-sm text-text-muted">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            Select the source account (must have sufficient balance)
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            Paste the destination account ID
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            Enter the amount and click Send Transfer
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-accent text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
            Track the status in Transaction History
          </li>
        </ol>
      </Card>
    </div>
  );
};

export default CreateTransaction;
