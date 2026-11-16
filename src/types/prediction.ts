export type FeatureValues = Record<string, number>;

export type FraudDecision = 'FRAUD' | 'NOT FRAUD';

export type PredictionResult = {
  decision: FraudDecision;
  isFraud: boolean;
  fraudProbability: number;
  threshold: number;
  modelName: string;
};

export type TransactionRecord = {
  id: string;
  transactionReference: string;
  features: FeatureValues;
  predictionLabel: string;
  isFraud: boolean;
  probability: number | null;
  createdAt: string;
};

export type NewTransactionRecord = Omit<TransactionRecord, 'id' | 'createdAt'>;
