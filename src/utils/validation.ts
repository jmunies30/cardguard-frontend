import type { FeatureDefinition } from '@/config/transactionFeatures';
import type { FeatureValues } from '@/types/prediction';

export type FieldErrors = Record<string, string>;

export type ValidationResult =
  | { ok: true; values: FeatureValues }
  | { ok: false; errors: FieldErrors };

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

export function validateTransactionInput(
  definitions: FeatureDefinition[],
  rawValues: Record<string, string>,
): ValidationResult {
  const errors: FieldErrors = {};
  const values: FeatureValues = {};

  for (const definition of definitions) {
    const rawValue = (rawValues[definition.name] ?? '').trim();

    if (rawValue === '') {
      errors[definition.name] = 'This field is required.';
    } else if (!NUMBER_PATTERN.test(rawValue) || !Number.isFinite(Number(rawValue))) {
      errors[definition.name] = 'Enter a valid number.';
    } else {
      values[definition.name] = Number(rawValue);
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, values };
}
