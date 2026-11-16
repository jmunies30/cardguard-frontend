import type { TransactionRecord } from '@/types/prediction';

export type HistorySummary = {
  total: number;
  flaggedCount: number;
  notFlaggedCount: number;
  averageProbability: number | null;
};

export function summarizeHistory(records: TransactionRecord[]): HistorySummary {
  const flaggedCount = records.filter((record) => record.isFraud).length;
  const probabilities = records
    .map((record) => record.probability)
    .filter((probability): probability is number => probability !== null);
  const averageProbability =
    probabilities.length > 0
      ? probabilities.reduce((sum, probability) => sum + probability, 0) / probabilities.length
      : null;

  return {
    total: records.length,
    flaggedCount,
    notFlaggedCount: records.length - flaggedCount,
    averageProbability,
  };
}
