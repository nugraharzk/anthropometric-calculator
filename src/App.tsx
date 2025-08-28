import Calculator from '@/components/Calculator';
import UploadLMS from '@/components/UploadLMS';
import { Baby, Scale, Ruler } from 'lucide-react';

export default function App() {
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <Baby className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Kids Growth Checker</h1>
        </div>
        <p className="mt-1 text-slate-600">
          Check whether your child's growth is on track using WHO/CDC LMS percentiles (WFA, HFA,
          BFA).
        </p>
      </header>

      <main className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-5 w-5" />
              <div className="font-semibold">Weight-for-Age (WFA)</div>
            </div>
            <p className="text-sm text-slate-600">
              Evaluates under/over-weight relative to age. Best for 0–10 years.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Ruler className="h-5 w-5" />
              <div className="font-semibold">Height-for-Age (HFA)</div>
            </div>
            <p className="text-sm text-slate-600">Screens for stunting (chronic undernutrition).</p>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-5 w-5" />
              <div className="font-semibold">BMI-for-Age (BFA)</div>
            </div>
            <p className="text-sm text-slate-600">
              Assesses thinness / overweight adjusted for age and sex.
            </p>
          </div>
        </div>

        <UploadLMS />
        <Calculator />
      </main>

      <footer className="mt-8 text-center text-xs text-slate-500">
        <p>Made with React + Vite + Tailwind + TypeScript.</p>
      </footer>
    </div>
  );
}
