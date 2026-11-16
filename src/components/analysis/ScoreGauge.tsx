import { useEffect, useState } from 'react';
import { formatProbability } from '@/utils/format';

type ScoreGaugeProps = {
  probability: number;
  threshold: number;
  isFraud: boolean;
};

function describeDistance(probability: number, threshold: number): string {
  const distancePoints = Math.abs(probability - threshold) * 100;
  if (distancePoints < 0.05) {
    return 'Sits exactly at the decision threshold.';
  }
  const direction = probability > threshold ? 'above' : 'below';
  return `${distancePoints.toFixed(1)} points ${direction} the decision threshold.`;
}

export function ScoreGauge({ probability, threshold, isFraud }: ScoreGaugeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const markerPosition = isMounted ? probability * 100 : 0;
  const thresholdPosition = threshold * 100;

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Fraud probability</p>
          <p className={`mt-1 text-3xl font-bold tabular-nums ${isFraud ? 'text-rose-400' : 'text-emerald-400'}`}>
            {formatProbability(probability)}
          </p>
        </div>
        <p className="max-w-[12rem] text-right text-xs leading-relaxed text-slate-400">
          {describeDistance(probability, threshold)}
        </p>
      </div>

      <div className="relative pb-6 pt-4">
        <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500/80 via-amber-400/80 to-rose-500/90" />

        <div
          className="absolute top-0 bottom-0 w-px border-l border-dashed border-slate-300/70"
          style={{ left: `${thresholdPosition}%` }}
          aria-hidden="true"
        >
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
            Threshold {formatProbability(threshold)}
          </span>
        </div>

        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 shadow-lg transition-[left] duration-1000 ease-out"
          style={{ left: `${markerPosition}%` }}
          aria-hidden="true"
        />

        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-600">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
