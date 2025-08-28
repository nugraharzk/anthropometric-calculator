import { Upload } from 'lucide-react';
import { useRef } from 'react';
import type { LMSEntry, Measure, Sex } from '@/configs/types';
import { setTables } from '@/lib/tables';

function parseCsv(text: string): LMSEntry[] {
  // Expect header with: measure,sex,ageMonths,L,M,S
  const lines = text.trim().split(/\r?\n/);
  const header = lines
    .shift()
    ?.split(',')
    .map((s) => s.trim().toLowerCase());

  if (!header || header.length < 6) throw new Error('Invalid header');
  const idx = (k: string) => header.indexOf(k);
  const out: LMSEntry[] = [];

  for (const line of lines) {
    const c = line.split(',').map((s) => s.trim());
    const row: LMSEntry = {
      measure: c[idx('measure')] as Measure,
      sex: c[idx('sex')] as Sex,
      ageMonths: parseFloat(c[idx('agemonths')]),
      L: parseFloat(c[idx('l')]),
      M: parseFloat(c[idx('m')]),
      S: parseFloat(c[idx('s')]),
    };
    out.push(row);
  }
  return out;
}

export default function UploadLMS() {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    const text = await file.text();
    let rows: LMSEntry[] = [];
    try {
      rows = parseCsv(text);
    } catch (e) {
      console.log(e);
      alert('Failed to parse CSV. Ensure columns: measure,sex,ageMonths,L,M,S');
      return;
    }
    const byMeasure: Record<string, LMSEntry[]> = { wfa: [], hfa: [], bfa: [] };
    rows.forEach((r) => {
      (byMeasure[r.measure] ||= []).push(r);
    });
    setTables({
      wfa: byMeasure['wfa'] || [],
      hfa: byMeasure['hfa'] || [],
      bfa: byMeasure['bfa'] || [],
    });
    alert(`Loaded ${rows.length} LMS rows.`);
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <Upload className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Load LMS Tables (CSV)</h3>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Optionally replace the built-in sample tables with your own WHO/CDC LMS CSV. Columns must
        be: <code>measure,sex,ageMonths,L,M,S</code>.
      </p>
      <div className="mt-3">
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Upload CSV…
        </button>
      </div>
    </div>
  );
}
