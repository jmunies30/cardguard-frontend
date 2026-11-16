import { useId } from 'react';
import type { FeatureDefinition } from '@/config/transactionFeatures';

type FeatureFieldProps = {
  definition: FeatureDefinition;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export function FeatureField({ definition, value, error, disabled, onChange }: FeatureFieldProps) {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const hasError = Boolean(error);

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-200">
        {definition.label}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        disabled={disabled}
        required
        aria-invalid={hasError}
        aria-describedby={hasError ? messageId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-xl border bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 ${
          hasError
            ? 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-500/30'
            : 'border-slate-700 hover:border-slate-600 focus:border-sky-500 focus:ring-sky-500/30'
        }`}
      />
      {hasError && (
        <p id={messageId} className="text-sm text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
