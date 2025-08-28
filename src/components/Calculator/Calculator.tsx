import { useMemo, useState } from 'react';
import type { ChildInput, Sex, Measure } from '@/configs/types';
import { monthsBetween, toDateOnly, lmsZ, zToPercentile, interpLMS, formatPct } from '@/lib/math';
import { getRows } from '@/lib/tables';
import PercentileGauge from '@/components/PercentileGauge';
import LineChart from '@/components/LineChart';

const todayISO = new Date().toISOString().slice(0, 10);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function labelFor(measure: Measure) {
  switch (measure) {
    case 'wfa':
      return 'Weight-for-Age';
    case 'hfa':
      return 'Height-for-Age';
    case 'bfa':
      return 'BMI-for-Age';
  }
}

function adviceFromZ(measure: Measure, z: number | null, ageMonths: number, muacCm?: number) {
  if (z == null || !isFinite(z)) return '—';
  const cat = (low: string, mod: string, norm: string, high: string) =>
    z < -3 ? low : z < -2 ? mod : z <= 2 ? norm : high;
  if (measure === 'hfa') {
    return cat(
      'Severely stunted. Discuss nutrition and possible underlying issues with your pediatrician.',
      'Stunted (below -2 SD). Encourage balanced diet and monitor growth closely.',
      'On track for height. Keep up balanced meals and regular activity.',
      'Tall-for-age. Usually fine if parents are tall; monitor proportionally.'
    );
  }
  if (measure === 'wfa') {
    return cat(
      'Severely underweight. Seek medical advice soon.',
      'Underweight. Add nutrient-dense foods; monitor.',
      'On track for weight.',
      'High weight for age. Combine with BMI/MUAC to evaluate adiposity.'
    );
  }
  // bfa
  const muacNote =
    muacCm && ageMonths >= 6 && ageMonths <= 59
      ? muacCm < 11.5
        ? ' MUAC indicates severe acute malnutrition.'
        : muacCm < 12.5
          ? ' MUAC indicates moderate acute malnutrition.'
          : ''
      : '';
  return cat(
    'Severe thinness for age. Consult a clinician.' + muacNote,
    'Thinness for age. Improve energy/protein intake and monitor.' + muacNote,
    'Healthy BMI for age. Maintain varied diet and play time.' + muacNote,
    'Overweight/obesity risk. Emphasize fruits/veg, water, outdoor play; limit sugary drinks.'
  );
}

function zToBand(z: number | null) {
  if (z == null || !isFinite(z)) return 'bg-slate-200';
  if (z < -3) return 'bg-red-200';
  if (z < -2) return 'bg-orange-200';
  if (z <= 2) return 'bg-green-200';
  return 'bg-yellow-200';
}

function buildPercentileSeries(
  measure: Measure,
  sex: Sex,
  minAge: number,
  maxAge: number,
  step = 6
) {
  // step in months; generates p3, p15, p50, p85, p97 using LMS
  const rows = getRows(measure, sex);
  const ages: number[] = [];
  for (let a = minAge; a <= maxAge; a += step) ages.push(Number(a.toFixed(1)));
  const toValue = (age: number, targetZ: number) => {
    const r = interpLMS(age, rows);
    if (!r) return NaN;
    // invert LMS: given z -> value
    const { L, M, S } = r;
    if (Math.abs(L) < 1e-6) {
      return M * Math.exp(S * targetZ);
    } else {
      return M * Math.pow(1 + L * S * targetZ, 1 / L);
    }
  };
  return ages.map((a) => ({
    x: a,
    p3: toValue(a, -1.88079),
    p15: toValue(a, -1.03643),
    p50: toValue(a, 0),
    p85: toValue(a, 1.03643),
    p97: toValue(a, 1.88079),
  }));
}
function Calculator() {
  const [state, setState] = useState<ChildInput>({ sex: 'M', measureDate: todayISO });
  const [measure, setMeasure] = useState<Measure>('wfa');

  const ageMonths = useMemo(() => {
    if (state.ageInMonths != null) return state.ageInMonths;
    if (state.birthDate) {
      return monthsBetween(toDateOnly(state.birthDate), toDateOnly(state.measureDate));
    }
    return NaN;
  }, [state.ageInMonths, state.birthDate, state.measureDate]);

  const bmi = useMemo(() => {
    if (!state.weightKg || !state.heightCm) return NaN;
    const meters = state.heightCm / 100;
    return state.weightKg / (meters * meters);
  }, [state.weightKg, state.heightCm]);

  const rows = getRows(measure, state.sex);
  const lms = useMemo(() => interpLMS(ageMonths, rows), [ageMonths, rows]);

  const z = useMemo(() => {
    if (!lms) return null;
    const value =
      measure === 'wfa'
        ? state.weightKg
        : measure === 'hfa'
          ? state.heightCm
          : Number.isFinite(bmi)
            ? bmi
            : undefined;
    if (!value || !isFinite(value)) return null;
    return lmsZ(value, lms.L, lms.M, lms.S);
  }, [lms, measure, state.weightKg, state.heightCm, bmi]);

  const percentile = z != null ? zToPercentile(z) : null;

  const series = useMemo(() => {
    if (!Number.isFinite(ageMonths))
      return [] as Array<{
        x: number;
        p3: number;
        p15: number;
        p50: number;
        p85: number;
        p97: number;
      }>;
    const minA = clamp(Math.floor((ageMonths as number) - 12), 0, 240);
    const maxA = clamp(Math.ceil((ageMonths as number) + 12), 0, 240);
    return buildPercentileSeries(measure, state.sex, minA, maxA, 6);
  }, [measure, ageMonths, state.sex]);

  const childY = useMemo(() => {
    if (measure === 'wfa') return state.weightKg ?? NaN;
    if (measure === 'hfa') return state.heightCm ?? NaN;
    return Number.isFinite(bmi) ? (bmi as number) : NaN;
  }, [measure, state.weightKg, state.heightCm, bmi]);

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Anthropometric Calculator</h2>
          <div className="flex gap-2">
            {(['wfa', 'hfa', 'bfa'] as Measure[]).map((m) => (
              <button
                key={m}
                onClick={() => setMeasure(m)}
                className={`rounded-xl px-3 py-2 text-sm font-medium border ${measure === m ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
              >
                {labelFor(m)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Sex</label>
            <div className="flex gap-2">
              {(['M', 'F'] as Sex[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setState((v) => ({ ...v, sex: s }))}
                  className={`rounded-xl border px-3 py-2 text-sm ${state.sex === s ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
                >
                  {s === 'M' ? 'Boy' : 'Girl'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Measure date</label>
            <input
              type="date"
              value={state.measureDate}
              onChange={(e) => setState((v) => ({ ...v, measureDate: e.target.value }))}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Birth date (or leave empty and set age)</label>
            <input
              type="date"
              value={state.birthDate ?? ''}
              onChange={(e) => setState((v) => ({ ...v, birthDate: e.target.value || undefined }))}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Age in months (optional override)</label>
            <input
              type="number"
              step="0.1"
              value={state.ageInMonths ?? ''}
              onChange={(e) =>
                setState((v) => ({
                  ...v,
                  ageInMonths: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="e.g., 18.5"
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              value={state.weightKg ?? ''}
              onChange={(e) =>
                setState((v) => ({
                  ...v,
                  weightKg: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Height / Length (cm)</label>
            <input
              type="number"
              step="0.1"
              value={state.heightCm ?? ''}
              onChange={(e) =>
                setState((v) => ({
                  ...v,
                  heightCm: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">MUAC (cm, optional, 6–59 mo)</label>
            <input
              type="number"
              step="0.1"
              value={state.muacCm ?? ''}
              onChange={(e) =>
                setState((v) => ({
                  ...v,
                  muacCm: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">BMI (auto)</label>
            <input
              readOnly
              value={Number.isFinite(bmi) ? (bmi as number).toFixed(2) : ''}
              className="w-full rounded-xl border px-3 py-2 bg-slate-100"
            />
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`rounded-2xl border p-4 shadow-soft ${zToBand(z)}`}>
          <div className="text-sm text-slate-700">
            Selected: <span className="font-medium">{labelFor(measure)}</span>
          </div>
          <div className="mt-1 text-sm">
            Age:{' '}
            <span className="font-medium">
              {Number.isFinite(ageMonths) ? (ageMonths as number).toFixed(1) : '—'} months
            </span>
          </div>
          <div className="mt-1 text-sm">
            Z‑score:{' '}
            <span className="font-medium">{z != null && isFinite(z) ? z.toFixed(2) : '—'}</span>
          </div>
          <div className="mt-1 text-sm">
            Percentile:{' '}
            <span className="font-medium">{percentile != null ? formatPct(percentile) : '—'}</span>
          </div>
        </div>
        <PercentileGauge label="Percentile" percentile={percentile ?? null} />
        <div className="rounded-2xl border bg-white p-4 shadow-soft">
          <div className="font-semibold mb-1">Advice</div>
          <p className="text-sm text-slate-700">
            {adviceFromZ(measure, z, Number(ageMonths || 0), state.muacCm)}
          </p>
        </div>
      </div>

      {series.length > 0 && Number.isFinite(childY) && (
        <LineChart
          data={series}
          unit={measure === 'hfa' ? ' cm' : measure === 'wfa' ? ' kg' : ' kg/m²'}
          childPoint={{ x: Number((ageMonths as number).toFixed(1)), y: childY as number }}
        />
      )}

      <div className="text-xs text-slate-500">
        <p>
          <strong>Disclaimer:</strong> Built‑in tables are minimal and approximate for demo only.
          For real assessments, upload official WHO/CDC LMS datasets and consult a clinician.
        </p>
      </div>
    </div>
  );
}

export default Calculator;
