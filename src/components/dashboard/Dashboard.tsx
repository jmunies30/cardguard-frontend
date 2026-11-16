import { Activity, ArrowDownUp, BrainCircuit } from 'lucide-react';
import { TransactionForm } from '@/components/analysis/TransactionForm';
import { PredictionPanel } from '@/components/analysis/PredictionPanel';
import { MethodologySection } from '@/components/methodology/MethodologySection';
import { AnalysisOverview } from '@/components/history/AnalysisOverview';
import { TransactionHistory } from '@/components/history/TransactionHistory';
import { Card } from '@/components/ui/Card';
import { useTransactionAnalysis } from '@/hooks/useTransactionAnalysis';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';

export function Dashboard() {
  const { records, status: historyStatus, reloadHistory, addRecord } = useTransactionHistory();
  const analysis = useTransactionAnalysis({ onRecordSaved: addRecord });

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
          <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
          Machine learning fraud screening
        </div>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Identify potentially fraudulent credit card transactions
          </h1>
          <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
            Card Guard uses a trained machine learning model to review credit card transaction details and flag
            the ones that look fraudulent.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Analyze a transaction</h2>
              <p className="text-sm text-slate-400">Enter the transaction details exactly as the model expects them.</p>
            </div>
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 sm:flex">
              <ArrowDownUp className="h-5 w-5 text-sky-400" aria-hidden="true" />
            </span>
          </div>
          <TransactionForm
            fieldValues={analysis.fieldValues}
            fieldErrors={analysis.fieldErrors}
            isAnalyzing={analysis.status === 'analyzing'}
            onFieldChange={analysis.setFieldValue}
            onSubmit={analysis.analyzeTransaction}
          />
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <Activity className="h-5 w-5 text-sky-400" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-white">Prediction</h2>
          </div>
          <PredictionPanel
            status={analysis.status}
            outcome={analysis.outcome}
            errorMessage={analysis.errorMessage}
          />
        </Card>
      </div>

      {historyStatus === 'ready' && records.length > 0 && (
        <Card>
          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-semibold text-white">Analysis overview</h2>
            <p className="text-sm text-slate-400">Summary of your saved predictions from the model.</p>
          </div>
          <AnalysisOverview records={records} />
        </Card>
      )}

      <Card>
        <div className="mb-6 space-y-1">
          <h2 className="text-xl font-semibold text-white">Transaction history</h2>
          <p className="text-sm text-slate-400">Predictions returned by the model, most recent first.</p>
        </div>
        <TransactionHistory records={records} status={historyStatus} onRetry={reloadHistory} />
      </Card>

      <Card>
        <div className="mb-6 space-y-1">
          <h2 className="text-xl font-semibold text-white">How the model works</h2>
          <p className="text-sm text-slate-400">From submitted transaction to displayed prediction.</p>
        </div>
        <MethodologySection />
      </Card>
    </main>
  );
}
