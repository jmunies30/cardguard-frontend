import { AlertTriangle, History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { HistoryStatus } from '@/hooks/useTransactionHistory';
import type { TransactionRecord } from '@/types/prediction';
import { formatDateTime, formatProbability } from '@/utils/format';

type TransactionHistoryProps = {
  records: TransactionRecord[];
  status: HistoryStatus;
  onRetry: () => void;
};

export function TransactionHistory({ records, status, onRetry }: TransactionHistoryProps) {
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-400" role="status">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
        Loading transaction history...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
        <AlertTriangle className="h-8 w-8 text-amber-400" aria-hidden="true" />
        <p className="text-sm text-slate-300">Unable to load transaction history right now.</p>
        <Button onClick={onRetry} className="px-4 py-2 text-sm">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
          <History className="h-6 w-6 text-slate-400" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-white">No predictions yet</p>
          <p className="text-sm text-slate-400">Analyzed transactions will appear here once the model responds.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-slate-500">
            <th scope="col" className="border-b border-slate-800 px-4 py-3 font-medium">Transaction ID</th>
            <th scope="col" className="border-b border-slate-800 px-4 py-3 font-medium">Date and time</th>
            <th scope="col" className="border-b border-slate-800 px-4 py-3 font-medium">Prediction</th>
            <th scope="col" className="border-b border-slate-800 px-4 py-3 text-right font-medium">Probability</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="transition-colors duration-200 hover:bg-slate-800/40">
              <td className="border-b border-slate-800/70 px-4 py-4 font-mono text-slate-200">
                {record.transactionReference}
              </td>
              <td className="border-b border-slate-800/70 px-4 py-4 text-slate-400">
                {formatDateTime(record.createdAt)}
              </td>
              <td className="border-b border-slate-800/70 px-4 py-4">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    record.isFraud
                      ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${record.isFraud ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                  {record.isFraud ? 'Fraud' : 'Not fraud'}
                </span>
              </td>
              <td className="border-b border-slate-800/70 px-4 py-4 text-right font-medium text-white">
                {record.probability === null ? '-' : formatProbability(record.probability)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
