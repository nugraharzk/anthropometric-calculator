import type { Measure, Sex, LMSEntry } from '@/configs/types';
import { SAMPLE_TABLES } from '@/data/sampleLMS';

export type Tables = Record<Measure, LMSEntry[]>;

// Global in-memory tables (start with sample; can be replaced by uploads)
export const tables: Tables = {
  wfa: [...SAMPLE_TABLES.wfa],
  hfa: [...SAMPLE_TABLES.hfa],
  bfa: [...SAMPLE_TABLES.bfa],
};

export function setTables(next: Partial<Tables>) {
  if (next.wfa) tables.wfa = next.wfa;
  if (next.hfa) tables.hfa = next.hfa;
  if (next.bfa) tables.bfa = next.bfa;
}

export function getRows(measure: Measure, sex: Sex) {
  return tables[measure].filter((r) => r.sex === sex);
}
