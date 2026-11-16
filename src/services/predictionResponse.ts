import type { PredictionResult } from '@/types/prediction';

const UNEXPECTED_RESPONSE_MESSAGE = 'The prediction model returned an unexpected response.';

export function parsePredictionResponse(body: unknown): PredictionResult {
  if (typeof body !== 'object' || body === null) {
    throw new Error(UNEXPECTED_RESPONSE_MESSAGE);
  }

  const { decision, fraud_probability, threshold, model } = body as Record<string, unknown>;

  if (decision !== 'FRAUD' && decision !== 'NOT FRAUD') {
    throw new Error(UNEXPECTED_RESPONSE_MESSAGE);
  }
  if (typeof fraud_probability !== 'number' || !Number.isFinite(fraud_probability) || fraud_probability < 0 || fraud_probability > 1) {
    throw new Error(UNEXPECTED_RESPONSE_MESSAGE);
  }
  if (typeof threshold !== 'number' || !Number.isFinite(threshold)) {
    throw new Error(UNEXPECTED_RESPONSE_MESSAGE);
  }
  if (typeof model !== 'string' || model.trim() === '') {
    throw new Error(UNEXPECTED_RESPONSE_MESSAGE);
  }

  return {
    decision,
    isFraud: decision === 'FRAUD',
    fraudProbability: fraud_probability,
    threshold,
    modelName: model.trim(),
  };
}
