import type { LMSEntry } from '@/configs/types';

export function monthsBetween(d1: Date, d2: Date) {
  // Signed months with decimals
  const ms = d2.getTime() - d1.getTime();
  const days = ms / (1000 * 60 * 60 * 24);
  return days / 30.4375; // average month length
}

export function toDateOnly(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function lmsZ(value: number, L: number, M: number, S: number) {
  if (value <= 0 || M <= 0 || S <= 0) return NaN;
  if (Math.abs(L) < 1e-6) {
    return Math.log(value / M) / S;
  }
  return (Math.pow(value / M, L) - 1) / (L * S);
}

// Approximate standard normal CDF using Abramowitz-Stegun formula
export function normalCdf(z: number) {
  // constants
  const b1 = 0.31938153,
    b2 = -0.356563782,
    b3 = 1.781477937,
    b4 = -1.821255978,
    b5 = 1.330274429;
  const p = 0.2316419;
  const t = 1 / (1 + p * Math.abs(z));
  const poly = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;
  const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const cdf = 1 - pdf * poly;
  return z >= 0 ? cdf : 1 - cdf;
}

export function zToPercentile(z: number) {
  return normalCdf(z) * 100;
}

export function formatPct(p: number) {
  if (!isFinite(p)) return '—';
  return `${p.toFixed(1)}%`;
}

// Linear interpolation utility between two LMS points by age
export function interpLMS(age: number, rows: LMSEntry[]): LMSEntry | undefined {
  if (!rows.length) return undefined;
  const sorted = [...rows].sort((a, b) => a.ageMonths - b.ageMonths);
  if (age <= sorted[0].ageMonths) return sorted[0];
  if (age >= sorted[sorted.length - 1].ageMonths) return sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i],
      b = sorted[i + 1];
    if (age >= a.ageMonths && age <= b.ageMonths) {
      const t = (age - a.ageMonths) / (b.ageMonths - a.ageMonths);
      return {
        measure: a.measure,
        sex: a.sex,
        ageMonths: age,
        L: a.L + (b.L - a.L) * t,
        M: a.M + (b.M - a.M) * t,
        S: a.S + (b.S - a.S) * t,
      };
    }
  }
}
