import type { TransactionRecord } from '@/types/prediction';
import { formatDateTime, formatProbability } from '@/utils/format';

const WIDTH = 640;
const HEIGHT = 260;
const PADDING = { top: 16, right: 24, bottom: 36, left: 48 };
const GRID_LEVELS = [0, 0.25, 0.5, 0.75, 1];

type ProbabilityChartProps = {
  records: TransactionRecord[];
};

export function ProbabilityChart({ records }: ProbabilityChartProps) {
  const points = records
    .filter((record): record is TransactionRecord & { probability: number } => record.probability !== null)
    .slice()
    .reverse();

  if (points.length === 0) {
    return null;
  }

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const xFor = (index: number) =>
    points.length === 1 ? PADDING.left + plotWidth / 2 : PADDING.left + (index / (points.length - 1)) * plotWidth;
  const yFor = (value: number) => PADDING.top + (1 - value) * plotHeight;
  const bottomY = PADDING.top + plotHeight;

  const coordinates = points.map((point, index) => ({ x: xFor(index), y: yFor(point.probability) }));
  const linePath = coordinates
    .map((coordinate, index) => `${index === 0 ? 'M' : 'L'} ${coordinate.x.toFixed(2)} ${coordinate.y.toFixed(2)}`)
    .join(' ');
  const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x.toFixed(2)} ${bottomY} L ${coordinates[0].x.toFixed(2)} ${bottomY} Z`;

  const latestThreshold = records.find((record) => record.threshold !== null)?.threshold ?? null;
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Fraud
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Not fraud
        </span>
        {latestThreshold !== null && (
          <span className="flex items-center gap-2">
            <span className="h-px w-5 border-t border-dashed border-slate-400" /> Decision threshold
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full overflow-visible"
        role="img"
        aria-label={`Fraud probability for the last ${points.length} predictions`}
      >
        <defs>
          <linearGradient id="probability-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {GRID_LEVELS.map((level) => (
          <g key={level}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={yFor(level)}
              y2={yFor(level)}
              className="stroke-slate-800"
              strokeWidth="1"
            />
            <text x={PADDING.left - 10} y={yFor(level) + 4} textAnchor="end" className="fill-slate-500 text-[11px]">
              {Math.round(level * 100)}%
            </text>
          </g>
        ))}

        {latestThreshold !== null && (
          <g>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={yFor(latestThreshold)}
              y2={yFor(latestThreshold)}
              className="stroke-slate-400"
              strokeWidth="1.25"
              strokeDasharray="6 6"
            />
            <text
              x={WIDTH - PADDING.right}
              y={yFor(latestThreshold) - 6}
              textAnchor="end"
              className="fill-slate-300 text-[11px]"
            >
              Threshold {formatProbability(latestThreshold)}
            </text>
          </g>
        )}

        <path d={areaPath} fill="url(#probability-area)" className="animate-fade-in" />
        <path
          d={linePath}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="animate-fade-in"
        />

        {points.map((point, index) => (
          <circle
            key={point.id}
            cx={coordinates[index].x}
            cy={coordinates[index].y}
            r="5"
            className={`${point.isFraud ? 'fill-rose-400' : 'fill-emerald-400'} stroke-slate-950 transition-transform duration-200 hover:scale-150`}
            strokeWidth="2"
          >
            <title>
              {`${point.transactionReference}: ${formatProbability(point.probability)} (${point.isFraud ? 'Fraud' : 'Not fraud'}) at ${formatDateTime(point.createdAt)}`}
            </title>
          </circle>
        ))}

        <text x={PADDING.left} y={HEIGHT - 8} className="fill-slate-500 text-[11px]">
          {formatDateTime(firstPoint.createdAt)}
        </text>
        {points.length > 1 && (
          <text x={WIDTH - PADDING.right} y={HEIGHT - 8} textAnchor="end" className="fill-slate-500 text-[11px]">
            {formatDateTime(lastPoint.createdAt)}
          </text>
        )}
      </svg>
    </div>
  );
}
