import { AlertTriangle, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';
import type { AnalysisOutcome, AnalysisStatus } from '@/hooks/useTransactionAnalysis';
import { formatProbability } from '@/utils/format';

type PredictionPanelProps = {
  status: AnalysisStatus;
  outcome: AnalysisOutcome | null;
  errorMessage: string | null;
};

export function PredictionPanel({ status, outcome, errorMessage }: PredictionPanelProps) {
  if (status === 'analyzing') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 py-10 text-center" role="status">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-sky-500/20" />
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-400" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-white">Analyzing transaction</p>
          <p className="text-sm text-slate-400">The model is reviewing the submitted details.</p>
        </div>
      </div>
    );
  }

  if (status === 'error' && errorMessage) {
    return (
      <div className="animate-fade-in flex h-full flex-col items-center justify-center gap-4 py-10 text-center" role="alert">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/30">
          <AlertTriangle className="h-7 w-7 text-amber-400" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">No prediction was returned</p>
          <p className="text-sm leading-relaxed text-slate-400">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (status === 'complete' && outcome) {
    const { prediction, transactionReference, saveError } = outcome;
    const isFraud = prediction.isFraud;

    return (
      <div className="animate-fade-in flex h-full flex-col gap-6">
        <div
          className={`flex flex-col items-center gap-4 rounded-2xl border px-6 py-8 text-center ${
            isFraud
              ? 'border-rose-500/30 bg-gradient-to-b from-rose-500/15 to-rose-950/20'
              : 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/15 to-emerald-950/20'
          }`}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ring-1 ${
              isFraud ? 'bg-rose-500/15 ring-rose-400/40' : 'bg-emerald-500/15 ring-emerald-400/40'
            }`}
          >
            {isFraud ? (
              <ShieldAlert className="h-7 w-7 text-rose-400" aria-hidden="true" />
            ) : (
              <ShieldCheck className="h-7 w-7 text-emerald-400" aria-hidden="true" />
            )}
          </div>
          <h3
            className={`text-3xl font-bold tracking-tight sm:text-4xl ${isFraud ? 'text-rose-400' : 'text-emerald-400'}`}
          >
            {isFraud ? 'FRAUD DETECTED' : 'NOT FRAUD'}
          </h3>
          <p className="max-w-sm text-sm leading-relaxed text-slate-300">
            {isFraud
              ? 'The model classified this transaction as fraudulent.'
              : 'The model classified this transaction as not fraudulent.'}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <dt className="text-slate-500">Transaction ID</dt>
            <dd className="mt-1 font-mono font-medium text-white">{transactionReference}</dd>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <dt className="text-slate-500">Model</dt>
            <dd className="mt-1 break-words font-medium text-white">{prediction.modelName}</dd>
          </div>
        </dl>

        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Fraud probability</span>
            <span className="font-semibold text-white">{formatProbability(prediction.fraudProbability)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${isFraud ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${prediction.fraudProbability * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Decision threshold</span>
            <span>{formatProbability(prediction.threshold)}</span>
          </div>
        </div>

        {saveError && (
          <p className="flex items-start gap-2 text-sm text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Prediction received, but it could not be saved to history. {saveError}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 ring-1 ring-slate-700">
        <Sparkles className="h-6 w-6 text-sky-400" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-white">Awaiting a transaction</p>
        <p className="max-w-xs text-sm leading-relaxed text-slate-400">
          Enter the transaction details and analyze them to see the model's prediction here.
        </p>
      </div>
    </div>
  );
}
