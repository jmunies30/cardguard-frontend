import { useRef, useState } from 'react';
import { TRANSACTION_FEATURES } from '@/config/transactionFeatures';
import { requestPrediction } from '@/services/predictionApi';
import { saveTransactionRecord } from '@/services/transactionHistory';
import { createTransactionReference } from '@/utils/format';
import { validateTransactionInput, type FieldErrors } from '@/utils/validation';
import type { PredictionResult, TransactionRecord } from '@/types/prediction';

export type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';

export type AnalysisOutcome = {
  transactionReference: string;
  prediction: PredictionResult;
  saveError: string | null;
};

type UseTransactionAnalysisOptions = {
  onRecordSaved: (record: TransactionRecord) => void;
};

export function useTransactionAnalysis({ onRecordSaved }: UseTransactionAnalysisOptions) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [outcome, setOutcome] = useState<AnalysisOutcome | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const setFieldValue = (name: string, value: string) => {
    setFieldValues((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => {
      if (!(name in previous)) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  const analyzeTransaction = async () => {
    if (inFlightRef.current) return;

    const validation = validateTransactionInput(TRANSACTION_FEATURES, fieldValues);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      setStatus('idle');
      return;
    }

    inFlightRef.current = true;
    setStatus('analyzing');
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const prediction = await requestPrediction(validation.values);
      const transactionReference = createTransactionReference();

      let saveError: string | null = null;
      try {
        const savedRecord = await saveTransactionRecord({
          transactionReference,
          features: validation.values,
          predictionLabel: prediction.decision,
          isFraud: prediction.isFraud,
          probability: prediction.fraudProbability,
        });
        onRecordSaved(savedRecord);
      } catch (saveFailure) {
        saveError = saveFailure instanceof Error ? saveFailure.message : 'Unable to save the prediction to history.';
      }

      setOutcome({ transactionReference, prediction, saveError });
      setStatus('complete');
    } catch (requestFailure) {
      setOutcome(null);
      setErrorMessage(
        requestFailure instanceof Error ? requestFailure.message : 'Something went wrong while analyzing the transaction.',
      );
      setStatus('error');
    } finally {
      inFlightRef.current = false;
    }
  };

  return {
    fieldValues,
    fieldErrors,
    status,
    outcome,
    errorMessage,
    setFieldValue,
    analyzeTransaction,
  };
}
