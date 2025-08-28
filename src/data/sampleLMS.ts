import type { LMSEntry, Sex, Measure } from '@/configs/types';

function row(
  measure: Measure,
  sex: Sex,
  ageMonths: number,
  L: number,
  M: number,
  S: number
): LMSEntry {
  return { measure, sex, ageMonths, L, M, S };
}

// These sample values are approximate placeholders and NOT for clinical use.
// Please replace with official WHO/CDC LMS tables.
export const SAMPLE_WFA: LMSEntry[] = [
  // Boys (M) weight-for-age (kg)
  row('wfa', 'M', 0, -0.3521, 3.3464, 0.14602),
  row('wfa', 'M', 12, -0.0801, 9.409, 0.09029),
  row('wfa', 'M', 24, 0.1107, 12.2276, 0.08518),
  // Girls (F)
  row('wfa', 'F', 0, -0.3833, 3.2322, 0.14171),
  row('wfa', 'F', 12, -0.1401, 8.9477, 0.09272),
  row('wfa', 'F', 24, 0.0611, 11.5718, 0.08929),
];

export const SAMPLE_HFA: LMSEntry[] = [
  // Boys (M) length/height-for-age (cm)
  row('hfa', 'M', 0, 1.267, 49.8842, 0.05311),
  row('hfa', 'M', 12, 1.0, 75.7, 0.0379),
  row('hfa', 'M', 24, 1.0, 87.1, 0.0364),
  // Girls (F)
  row('hfa', 'F', 0, 1.3045, 49.1477, 0.05206),
  row('hfa', 'F', 12, 1.0, 74.0, 0.038),
  row('hfa', 'F', 24, 1.0, 86.4, 0.0365),
];

export const SAMPLE_BFA: LMSEntry[] = [
  // Boys (M) BMI-for-age (kg/m^2)
  row('bfa', 'M', 0, -1.2957, 13.4069, 0.0956),
  row('bfa', 'M', 12, -0.3521, 17.28, 0.08),
  row('bfa', 'M', 24, -0.2063, 16.42, 0.08),
  // Girls (F)
  row('bfa', 'F', 0, -1.1311, 13.3363, 0.09549),
  row('bfa', 'F', 12, -0.3833, 17.0, 0.08),
  row('bfa', 'F', 24, -0.3833, 16.2, 0.08),
];

export const SAMPLE_TABLES = {
  wfa: SAMPLE_WFA,
  hfa: SAMPLE_HFA,
  bfa: SAMPLE_BFA,
};
