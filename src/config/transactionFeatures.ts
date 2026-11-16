export type FeatureGroup = 'core' | 'advanced';

export type FeatureDefinition = {
  name: string;
  label: string;
  group: FeatureGroup;
};

const ADVANCED_FEATURE_NAMES = Array.from({ length: 28 }, (_, index) => `V${index + 1}`);

// Order matches the model's input order and is preserved when the transaction is sent to the backend.
export const TRANSACTION_FEATURES: FeatureDefinition[] = [
  { name: 'Time', label: 'Time', group: 'core' },
  ...ADVANCED_FEATURE_NAMES.map(
    (name): FeatureDefinition => ({ name, label: name, group: 'advanced' }),
  ),
  { name: 'Amount', label: 'Amount', group: 'core' },
];
