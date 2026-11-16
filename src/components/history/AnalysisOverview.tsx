import { ProbabilityChart } from '@/components/history/ProbabilityChart';
import { summarizeHistory, type HistorySummary } from '@/utils/historyStats';
import { formatProbability } from '@/utils/format';
import type { TransactionRecord } from '@/types/prediction';

type AnalysisOverviewProps = {
  records: TransactionRecord[];
};

type StatTile = {
  label: string;
  value: string;
  valueClassName: string;
};

function buildStatTiles(summary: HistorySummary): StatTile[] {
  return [
    { label: 'Analyzed', value: String(summary.total), valueClassName: 'text-white' },
    { label: 'Flagged as fraud', value: String(summary.flaggedCount), valueClassName: 'text-rose-400' },
    { label: 'Not fraud', value: String(summary.notFlaggedCount), valueClassName: 'text-emerald-400' },
    {
      label: 'Average fraud probability',
      value: summary.averageProbability === null ? '-' : formatProbability(summary.averageProbability),
      valueClassName: 'text-sky-300',
    },
  ];
}

export function AnalysisOverview({ records }: AnalysisOverviewProps) {
  const tiles = buildStatTiles(summarizeHistory(records));

  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition-colors duration-200 hover:border-slate-700"
          >
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">{tile.label}</dt>
            <dd className={`mt-2 text-2xl font-bold tabular-nums ${tile.valueClassName}`}>{tile.value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">Fraud probability trend</h3>
          <p className="text-xs text-slate-500">Each point is a saved prediction, oldest to newest.</p>
        </div>
        <ProbabilityChart records={records} />
      </div>
    </div>
  );
}
