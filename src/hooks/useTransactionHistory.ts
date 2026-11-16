import { useCallback, useEffect, useState } from 'react';
import { fetchTransactionHistory } from '@/services/transactionHistory';
import type { TransactionRecord } from '@/types/prediction';

export type HistoryStatus = 'loading' | 'ready' | 'error';

export function useTransactionHistory() {
  const [records, setRecords] = useState<TransactionRecord[]>([]);
  const [status, setStatus] = useState<HistoryStatus>('loading');

  const loadHistory = useCallback(async () => {
    setStatus('loading');
    try {
      const history = await fetchTransactionHistory();
      setRecords(history);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const addRecord = useCallback((record: TransactionRecord) => {
    setRecords((previous) => [record, ...previous]);
  }, []);

  return { records, status, reloadHistory: loadHistory, addRecord };
}
