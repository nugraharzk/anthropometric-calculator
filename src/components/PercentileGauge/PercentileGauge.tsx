import { Gauge } from 'lucide-react';

export default function PercentileGauge({
  label,
  percentile,
}: {
  label: string;
  percentile: number | null;
}) {
  const p = percentile ?? NaN;
  const pct = Number.isFinite(p) ? Math.max(0, Math.min(100, p)) : 0;
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-2">
        <Gauge className="w-5 h-5" />
        <h4 className="font-semibold">{label}</h4>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-slate-400" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-sm text-slate-600">
        {Number.isFinite(p) ? `${p.toFixed(1)}th percentile` : '—'}
      </div>
    </div>
  );
}
