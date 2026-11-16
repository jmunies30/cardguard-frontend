import { useEffect, useState, type FormEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { FeatureField } from '@/components/analysis/FeatureField';
import { Button } from '@/components/ui/Button';
import { TRANSACTION_FEATURES, type FeatureDefinition } from '@/config/transactionFeatures';
import type { FieldErrors } from '@/utils/validation';

type TransactionFormProps = {
  fieldValues: Record<string, string>;
  fieldErrors: FieldErrors;
  isAnalyzing: boolean;
  onFieldChange: (name: string, value: string) => void;
  onSubmit: () => void;
};

const CORE_FEATURES = TRANSACTION_FEATURES.filter((feature) => feature.group === 'core');
const ADVANCED_FEATURES = TRANSACTION_FEATURES.filter((feature) => feature.group === 'advanced');

function countEntered(features: FeatureDefinition[], fieldValues: Record<string, string>) {
  return features.filter((feature) => (fieldValues[feature.name] ?? '').trim() !== '').length;
}

export function TransactionForm({
  fieldValues,
  fieldErrors,
  isAnalyzing,
  onFieldChange,
  onSubmit,
}: TransactionFormProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const advancedHasErrors = ADVANCED_FEATURES.some((feature) => feature.name in fieldErrors);
  useEffect(() => {
    if (advancedHasErrors) {
      setIsAdvancedOpen(true);
    }
  }, [advancedHasErrors]);

  const enteredAdvancedCount = countEntered(ADVANCED_FEATURES, fieldValues);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {CORE_FEATURES.map((definition) => (
          <FeatureField
            key={definition.name}
            definition={definition}
            value={fieldValues[definition.name] ?? ''}
            error={fieldErrors[definition.name]}
            disabled={isAnalyzing}
            onChange={(value) => onFieldChange(definition.name, value)}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen((open) => !open)}
          aria-expanded={isAdvancedOpen}
          aria-controls="advanced-features-panel"
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-slate-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400"
        >
          <span className="space-y-0.5">
            <span className="block text-sm font-semibold text-white">Advanced features (V1 to V28)</span>
            <span className="block text-xs text-slate-400">
              {enteredAdvancedCount} of {ADVANCED_FEATURES.length} entered
            </span>
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isAdvancedOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isAdvancedOpen && (
          <div id="advanced-features-panel" className="animate-fade-in grid grid-cols-1 gap-5 border-t border-slate-800 p-5 sm:grid-cols-2">
            {ADVANCED_FEATURES.map((definition) => (
              <FeatureField
                key={definition.name}
                definition={definition}
                value={fieldValues[definition.name] ?? ''}
                error={fieldErrors[definition.name]}
                disabled={isAnalyzing}
                onChange={(value) => onFieldChange(definition.name, value)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
        <Button type="submit" isLoading={isAnalyzing} className="w-full sm:w-auto">
          {isAnalyzing ? 'Analyzing...' : 'Analyze Transaction'}
        </Button>
      </div>
    </form>
  );
}
