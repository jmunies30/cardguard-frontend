import { supabase } from '@/lib/supabase';
import type { NewTransactionRecord, TransactionRecord } from '@/types/prediction';

const TABLE_NAME = 'fraud_predictions';
const HISTORY_LIMIT = 50;
const SELECT_COLUMNS =
  'id, transaction_reference, features, prediction_label, is_fraud, probability, threshold, model_name, created_at';

type FraudPredictionRow = {
  id: string;
  transaction_reference: string;
  features: Record<string, number>;
  prediction_label: string;
  is_fraud: boolean;
  probability: number | null;
  threshold: number | null;
  model_name: string | null;
  created_at: string;
};

function toTransactionRecord(row: FraudPredictionRow): TransactionRecord {
  return {
    id: row.id,
    transactionReference: row.transaction_reference,
    features: row.features,
    predictionLabel: row.prediction_label,
    isFraud: row.is_fraud,
    probability: row.probability,
    threshold: row.threshold,
    modelName: row.model_name,
    createdAt: row.created_at,
  };
}

export async function fetchTransactionHistory(): Promise<TransactionRecord[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(SELECT_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(HISTORY_LIMIT);

  if (error || !data) {
    throw new Error('Unable to load transaction history.');
  }
  return (data as FraudPredictionRow[]).map(toTransactionRecord);
}

export async function saveTransactionRecord(record: NewTransactionRecord): Promise<TransactionRecord> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      transaction_reference: record.transactionReference,
      features: record.features,
      prediction_label: record.predictionLabel,
      is_fraud: record.isFraud,
      probability: record.probability,
      threshold: record.threshold,
      model_name: record.modelName,
    })
    .select(SELECT_COLUMNS)
    .maybeSingle();

  if (error || !data) {
    throw new Error('Unable to save the prediction to history.');
  }
  return toTransactionRecord(data as FraudPredictionRow);
}
