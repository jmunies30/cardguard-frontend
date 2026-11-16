import { API_BASE_URL, PREDICT_ENDPOINT } from '@/config/api';
import { parsePredictionResponse } from '@/services/predictionResponse';
import type { FeatureValues, PredictionResult } from '@/types/prediction';

const REQUEST_TIMEOUT_MS = 90_000;

export async function requestPrediction(transaction: FeatureValues): Promise<PredictionResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}${PREDICT_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ transaction }),
        signal: controller.signal,
      });
    } catch {
      throw new Error(
        controller.signal.aborted
          ? 'The prediction model took too long to respond. Please try again.'
          : 'Unable to connect to the prediction model.',
      );
    }

    if (!response.ok) {
      throw new Error(`The prediction model returned an error (status ${response.status}).`);
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new Error('The prediction model returned a response that could not be read.');
    }

    return parsePredictionResponse(body);
  } finally {
    window.clearTimeout(timeoutId);
  }
}
