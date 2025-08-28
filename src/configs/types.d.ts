export type Sex = 'M' | 'F';

export type Measure = 'wfa' | 'hfa' | 'bfa'; // weight-for-age, height-for-age, BMI-for-age

export interface LMSEntry {
  measure: Measure;
  sex: Sex;
  ageMonths: number; // exact months (can be decimal)
  L: number;
  M: number;
  S: number;
}

export interface ChildInput {
  sex: Sex;
  birthDate?: string; // yyyy-mm-dd (optional if ageInMonths provided)
  measureDate: string; // yyyy-mm-dd
  ageInMonths?: number; // optional override when no birthDate
  weightKg?: number;
  heightCm?: number;
  muacCm?: number; // optional
}
